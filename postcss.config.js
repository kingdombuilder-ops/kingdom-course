/* =============================================================================
   postcss.config.js — PostCSS pipeline.

   Single plugin: autoprefixer. Tailwind was removed in batch 21 (the
   project uses inline styles + custom classes in src/styles/index.css
   exclusively). Autoprefixer is kept so vendor prefixes for the various
   CSS custom properties + animations work across browsers.
   ============================================================================= */

export default {
  plugins: {
    autoprefixer: {},
  },
};
