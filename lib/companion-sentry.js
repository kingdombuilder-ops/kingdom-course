/* =============================================================================
   lib/companion-sentry.js — Sentry error observability (Commit 8).

   Thin wrapper around @sentry/node so api/companion.js stays readable and
   Sentry is fully ISOLATED here. Errors only — no performance tracing, no
   OpenTelemetry overhead (tracesSampleRate: 0).

   Why this exists: Commit 5's rate limiters fail OPEN on KV error (a KV
   outage must not take down the Companion). That trade is only acceptable
   if the fail-open is observable — otherwise an outage silently disables
   all rate limiting. This module is the observability that closes that
   dependency. It also captures upstream (Anthropic) and auth-throw errors.

   PRIVACY (load-bearing, per §5.7 + the audience's sensitivity):
     - sendDefaultPii: false — no IP, cookies, or headers.
     - beforeSend strips event.request and event.user unconditionally, so
       no URL / body / query / identity ever leaves, regardless of which
       integrations are active.
     - captureError only accepts an error + a flat tag bag, and scrubTags()
       ALLOWLISTS the tag keys (area / limiter / stage). There is no code
       path that forwards user or assistant message content to Sentry.

   No-op when SENTRY_DSN is unset (local dev, or before the env var lands):
   initSentry() returns false and capture/flush become no-ops — never throws.
   ============================================================================= */

import * as Sentry from '@sentry/node';

const ALLOWED_TAGS = ['area', 'limiter', 'stage'];

let _ready = false;
let _enabled = false;

/* Idempotent. Call at the top of a handler (lazy — no module-load side
   effects, matching the Anthropic/Clerk/KV clients). Returns whether Sentry
   is enabled (i.e. a DSN was present). */
export function initSentry() {
  if (_ready) return _enabled;
  _ready = true;
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return false; // no-op mode
  Sentry.init({
    dsn,
    tracesSampleRate: 0, // errors only
    sendDefaultPii: false,
    environment: process.env.VERCEL_ENV || 'development',
    beforeSend: stripPii,
  });
  _enabled = true;
  return true;
}

/* Structural guarantee: never transmit request data or identity. Exported
   for unit testing. */
export function stripPii(event) {
  delete event.request; // URL / headers / body / query
  delete event.user; // identity
  return event;
}

/* Allowlist tag keys — only these ever become Sentry tags, so no call site
   can leak content through the tag bag. Exported for unit testing. */
export function scrubTags(tags) {
  const out = {};
  for (const k of ALLOWED_TAGS) {
    if (tags[k] != null) out[k] = String(tags[k]);
  }
  return out;
}

/* Capture an error with safe, allowlisted string tags ONLY. NEVER pass
   message content — call sites pass (err, { area, limiter, stage }). */
export function captureError(err, tags = {}) {
  if (!_enabled) return;
  Sentry.captureException(err, { level: tags.level || 'error', tags: scrubTags(tags) });
}

export function captureWarning(err, tags = {}) {
  captureError(err, { ...tags, level: 'warning' });
}

/* Flush before a serverless function returns/freezes (Vercel can freeze
   after the response, dropping un-sent events). No-op when disabled; fast
   when the queue is already empty. */
export async function flush(ms = 2000) {
  if (!_enabled) return;
  try { await Sentry.flush(ms); } catch { /* best-effort */ }
}
