/* =============================================================================
   api/diag.js — DIAGNOSTIC Node serverless function (classic req/res).

   Confirms Node serverless works after the Edge premise was invalidated
   by @anthropic-ai/sdk + @clerk/backend Node-only module dependencies.
   Uses the classic (req, res) signature — unambiguous for Node
   serverless — to give a definitive runtime signal. (api/companion.js
   uses the Web Request/Response shape, which modern Vercel Node
   serverless also supports; if that ever times out, this file's classic
   shape is the proven fallback pattern.)

   No `export const config = { runtime: 'edge' }` → Node serverless
   default. Deletes once the Companion endpoint is verified working.

   Returns env-presence booleans only (no values, no leak).
   ============================================================================= */

export default function handler(req, res) {
  res.status(200).json({
    status: 'diag_ok',
    runtime: 'node-serverless',
    timestamp: new Date().toISOString(),
    env_visible: {
      ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
      CLERK_SECRET_KEY: !!process.env.CLERK_SECRET_KEY,
      KV_URL: !!process.env.KV_URL,
      VITE_CLERK_PUBLISHABLE_KEY: !!process.env.VITE_CLERK_PUBLISHABLE_KEY,
    },
  });
}
