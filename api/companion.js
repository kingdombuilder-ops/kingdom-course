/* =============================================================================
   api/companion.js — Vercel Edge Function, Companion AI backend (Commit 2)

   Two endpoints, single file, dispatched by query param (set via
   vercel.json rewrite):

     POST /api/companion            main chat endpoint, Clerk-authed,
                                    SSE streaming from Anthropic
     GET  /api/companion/health     public, returns { status, model,
                                    timestamp }

   The `/api/companion/health` URL is rewritten by vercel.json to
   `/api/companion?_route=health` so a single Edge Function file
   handles both routes. Per the "Single-file Edge Function, dispatch
   by pathname" decision documented in PHASE_3_HANDOFF.md ("Split
   when file crosses ~300 lines").

   ----------------------------------------------------------------------
   Per the Companion build sequence in CLAUDE.md, THIS COMMIT (2) DOES
   NOT INCLUDE:
     - Full v1 system prompt              (Commit 3)
     - Crisis detection per §5.3          (Commit 4)
     - Rate limiting per §5.4             (Commit 5)
     - Per-tab context awareness per §5.5 (Commit 6)
     - Frontend wiring of Companion.jsx   (Commit 7 — gated by both
                                            Commits 4 AND 5 per the
                                            user-exposure gate in
                                            CLAUDE.md Credentialing
                                            discipline)
     - Sentry instrumentation             (Commit 8)
   ----------------------------------------------------------------------

   Model pinned to `claude-sonnet-4-6` per CLAUDE.md: "Pin versioned
   model strings in production code; never use alias strings."
   ============================================================================= */

import Anthropic from '@anthropic-ai/sdk';
import { createClerkClient } from '@clerk/backend';

// Canonical Edge runtime declaration for pure Vercel API routes
// (non-Next.js). The `vercel.json` functions block does NOT support
// `"runtime": "edge"` — that block is for Node serverless versioned
// runtime strings only. Edge is declared in-file via this config
// object, per Vercel's documented Edge Function setup.
export const config = { runtime: 'edge' };

const COMPANION_MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 2048;

/* Placeholder system prompt — Commit 3 replaces this with the full
   v1 prompt per MASTER_SPECIFICATION §5.2 (identity, theological
   grounding, tone, vocabulary lock, limits, parish bridge, crisis
   protocol reference, multilingual). At that point the prompt moves
   to its own file (location decision deferred to Commit 3: either
   `api/_companion-system-prompt.js` with underscore prefix per the
   Vercel "not routed" convention, OR `lib/companion-system-prompt.js`
   moved outside the api/ tree entirely).

   For Commit 2 the prompt is inline to keep the file count at one. */
const SYSTEM_PROMPT_V0 =
  "You are a Catholic Companion in early development. You will be " +
  "replaced with the full system prompt in the next commit. Respond " +
  "briefly; refer users to a priest for any catechetical or pastoral " +
  "question.";

/* Lazy-init clients inside handlers (NOT at module top-level). Top-level
   construction causes FUNCTION_INVOCATION_FAILED at module load if either
   SDK throws synchronously on an undefined/invalid env var, AND it makes
   the health endpoint depend on SDK construction it doesn't need.
   Lazy-init keeps the module load side-effect-free. */

let _clerkClient;
function getClerkClient() {
  if (!_clerkClient) {
    if (!process.env.CLERK_SECRET_KEY) {
      throw new Error('CLERK_SECRET_KEY not configured');
    }
    _clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
  }
  return _clerkClient;
}

let _anthropic;
function getAnthropic() {
  if (!_anthropic) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }
    _anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return _anthropic;
}

/* ----- Route dispatch ----------------------------------------------------- */
export default async function handler(request) {
  const url = new URL(request.url);

  // Health endpoint — public, no auth. Reached via vercel.json rewrite
  // mapping /api/companion/health → /api/companion?_route=health.
  if (request.method === 'GET' && url.searchParams.get('_route') === 'health') {
    return handleHealth();
  }

  // Main chat endpoint — requires Clerk auth.
  if (request.method === 'POST') {
    return handleCompanion(request);
  }

  return new Response('Not Found', { status: 404 });
}

/* ----- Health (public, no auth) ------------------------------------------ */
function handleHealth() {
  return Response.json({
    status: 'ok',
    model: COMPANION_MODEL,
    timestamp: new Date().toISOString(),
  });
}

/* ----- Companion (auth + streaming) -------------------------------------- */
async function handleCompanion(request) {
  // 1. Auth via Clerk Bearer header (Authorization: Bearer <jwt>).
  //    @clerk/backend's authenticateRequest reads the header
  //    automatically. userId becomes the rate-limit key in Commit 5.
  let userId;
  try {
    const auth = await getClerkClient().authenticateRequest(request);
    if (!auth.isAuthenticated) {
      return Response.json({ error: 'unauthenticated' }, { status: 401 });
    }
    userId = auth.toAuth().userId;
  } catch (err) {
    console.error('[companion] auth error:', err);
    return Response.json({ error: 'auth_error' }, { status: 401 });
  }

  // 2. Parse request body. Expected shape:
  //    { messages: [{role, content}, ...], context: {...} }
  //    `context` (currentTab, currentDay, userHouse, locale) is
  //    accepted but ignored at this stage — Commit 6 wires it into
  //    the system prompt or message envelope.
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }
  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'messages_required' }, { status: 400 });
  }

  // 3. Open Anthropic streaming connection. Errors BEFORE the stream
  //    opens must be surfaced as structured JSON. Once SSE bytes are
  //    flowing the client can only receive SSE error frames.
  let upstreamStream;
  try {
    upstreamStream = getAnthropic().messages.stream({
      model: COMPANION_MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT_V0,
      messages,
    });
  } catch (err) {
    console.error('[companion] upstream pre-stream error:', err);
    const status = err.status || 502;
    return Response.json(
      { error: 'upstream_error', message: err.message },
      { status }
    );
  }

  // 4. Forward Anthropic SSE events raw to the client. Each upstream
  //    event becomes one SSE frame: `event: <type>\ndata: <json>\n\n`.
  //    Client disconnect aborts the upstream to stop paying for
  //    tokens nobody is reading.
  const encoder = new TextEncoder();
  const sseStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of upstreamStream) {
          const frame = `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(frame));
        }
        controller.close();
      } catch (err) {
        // Mid-stream upstream error. Log before closing — Sentry
        // (Commit 8) will pick this up. Mid-stream errors are
        // invisible to user-facing error paths; telemetry is the
        // only way we'll know they're happening.
        console.error('[companion] mid-stream error:', err);
        try {
          const errFrame = `event: error\ndata: ${JSON.stringify({ message: err.message })}\n\n`;
          controller.enqueue(encoder.encode(errFrame));
        } catch {
          // Controller may already be closed; ignore.
        }
        controller.close();
      }
    },
    cancel(reason) {
      // Client disconnected. Abort the upstream to stop paying for
      // tokens nobody is reading.
      console.log('[companion] client disconnected; aborting upstream', reason);
      try {
        upstreamStream.controller?.abort?.();
      } catch (err) {
        console.error('[companion] error aborting upstream:', err);
      }
    },
  });

  return new Response(sseStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
