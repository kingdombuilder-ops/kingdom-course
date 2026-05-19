/* =============================================================================
   api/diag.js — DIAGNOSTIC Edge function with NO SDK imports.

   Created to isolate the Companion Commit 2 FUNCTION_INVOCATION_FAILED
   crash. If `/api/diag` returns 200 while `/api/companion/health` still
   returns 500, the crash is at SDK import time (either @anthropic-ai/sdk
   or @clerk/backend is incompatible with Vercel Edge runtime as
   imported).

   Once root cause is identified, this file deletes.

   Returns env-presence booleans only (no values, no leak).
   ============================================================================= */

export const runtime = 'edge';

export default function handler() {
  return new Response(
    JSON.stringify({
      status: 'diag_ok',
      timestamp: new Date().toISOString(),
      env_visible: {
        ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
        CLERK_SECRET_KEY: !!process.env.CLERK_SECRET_KEY,
        KV_URL: !!process.env.KV_URL,
        VITE_CLERK_PUBLISHABLE_KEY: !!process.env.VITE_CLERK_PUBLISHABLE_KEY,
      },
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );
}
