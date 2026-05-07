/* =============================================================================
   src/env.js — Build-time environment flags.

   Single source of truth for IS_DEV. Lives in its own tiny module so:
     - Vite can statically replace `import.meta.env.DEV` with a literal
       boolean at build time (production: false; dev: true)
     - The test harness can intercept this module and stub IS_DEV to
       whatever the test wants

   App.jsx imports IS_DEV from here and uses it to:
     - Decide which preview mode to start in (harness vs live)
     - Gate the dev toggle UI

   When Vite ships the production bundle, IS_DEV is `false` everywhere
   it appears, so all dev-mode branches are dead-code-eliminated by
   the minifier. When `vite dev` is running, IS_DEV is `true`.
   ============================================================================= */

export const IS_DEV = import.meta.env.DEV === true;
