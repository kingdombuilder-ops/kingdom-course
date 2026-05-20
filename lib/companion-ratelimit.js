/* =============================================================================
   lib/companion-ratelimit.js — Companion rate limiting (§5.4).

   Two limiters, two threat models, evaluated on different branches:

     - IP limiter (5/hr, keyed by IP+UA) — guards the UNAUTHENTICATED
       surface. It is the abuse floor against credential-spray / brute-
       force: requests that do not authenticate are throttled per IP so an
       attacker can't hammer the auth path. Keyed by IP+UA, not IP alone,
       and applied ONLY to unauthenticated outcomes — never to all traffic
       — because shared NAT egress (a parish lab, an RCIA group, an office)
       puts many legitimate users behind one IP. A blanket per-IP cap would
       throttle them; an unauthenticated-only cap does not.

     - User limiter (30/hr AND 100/day, keyed by Clerk user ID) — guards
       against single-user runaway cost. It sits behind auth and gates the
       Anthropic call.

   Both use a fixed-window counter (INCR + EXPIRE on first hit; reject when
   the count exceeds the limit; Retry-After = the key's remaining TTL).
   Fixed-window is chosen over a sliding log for simplicity and O(1) cost;
   the burst-at-window-edge imprecision is irrelevant at these limits (the
   §5.4 acceptance is "an honest user with one phone never hits them").

   Storage: Vercel KV (Redis) via @vercel/kv, reading KV_REST_API_URL /
   KV_REST_API_TOKEN (§5.4 + the env table in MASTER_SPECIFICATION). The
   client is fetch-based (no Node-only built-ins), so it is safe in the
   Node-serverless function. Lazy-init: no module-load side effects, same
   discipline as the Anthropic/Clerk clients in api/companion.js.

   FAIL-OPEN + OBSERVABILITY DEPENDENCY: the callers in api/companion.js
   catch any throw from these functions and ALLOW the request (a KV outage
   must not take down the Companion). That trade is only safe if the
   fail-open is observable — otherwise a KV outage silently disables all
   rate limiting with no signal.
   TODO(Commit 8): the catch-site console.error calls in api/companion.js
   MUST become Sentry captures so fail-open events page/alert. This is the
   load-bearing piece that makes fail-open acceptable; do not consider the
   rate-limit work complete until Commit 8 wires it.

   §5.4 "override for paid pastoral users" is intentionally NOT built — no
   pastor tier exists yet. Add it when the tier does, not before.
   ============================================================================= */

import { createClient } from '@vercel/kv';

export const IP_PER_HOUR = 5;
export const USER_PER_HOUR = 30;
export const USER_PER_DAY = 100;

const HOUR = 3600;
const DAY = 86400;

let _kv;
function getKv() {
  if (!_kv) {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;
    if (!url || !token) {
      throw new Error('KV_REST_API_URL / KV_REST_API_TOKEN not configured');
    }
    _kv = createClient({ url, token });
  }
  return _kv;
}

/* FNV-1a, 32-bit. Bounds the UA portion of the IP key to a fixed-length
   hex string instead of stuffing a raw (attacker-controlled, unbounded)
   User-Agent into a Redis key. Not security-sensitive — just key hygiene. */
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

/* One fixed-window hit. INCR the counter; on the first hit of a new window
   set its TTL; reject once the count exceeds the limit. Exported with an
   injectable client so the window logic is unit-testable against an
   in-memory fake (the live KV path is verified post-deploy). */
export async function hit(kv, key, limit, windowSec) {
  const count = await kv.incr(key);
  if (count === 1) {
    await kv.expire(key, windowSec);
  }
  if (count > limit) {
    let ttl = await kv.ttl(key);
    if (ttl == null || ttl < 0) ttl = windowSec; // counter without TTL — re-arm
    return { allowed: false, retryAfter: ttl, count };
  }
  return { allowed: true, retryAfter: 0, count };
}

/* Unauthenticated IP+UA limiter. */
export async function checkIpLimit(ip, ua) {
  const key = `rl:ip:${ip}:${fnv1a(ua || '')}`;
  return hit(getKv(), key, IP_PER_HOUR, HOUR);
}

/* Authenticated user limiter — hourly first, then daily. Hourly is checked
   first so that when the hour cap is already blown we return without
   touching (incrementing) the daily counter. Returns { allowed, retryAfter,
   scope } where scope is 'hour' | 'day' | null. */
export async function checkUserLimit(userId) {
  const kv = getKv();
  const hourly = await hit(kv, `rl:u:${userId}:h`, USER_PER_HOUR, HOUR);
  if (!hourly.allowed) return { ...hourly, scope: 'hour' };
  const daily = await hit(kv, `rl:u:${userId}:d`, USER_PER_DAY, DAY);
  if (!daily.allowed) return { ...daily, scope: 'day' };
  return { allowed: true, retryAfter: 0, scope: null };
}
