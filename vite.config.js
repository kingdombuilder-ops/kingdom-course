import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Vite config for The Kingdom Course.
// Notes:
// - The default build chunks vendor code automatically; we add a manual chunk
//   for the heavy liturgical data so it can be cached separately and lazy-
//   loaded if we later split route-level entries.
// - Source maps are off in production for size; turn on for staging.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@':           path.resolve(__dirname, './src'),
      '@data':       path.resolve(__dirname, './src/data'),
      '@tabs':       path.resolve(__dirname, './src/tabs'),
      '@modals':     path.resolve(__dirname, './src/modals'),
      '@components': path.resolve(__dirname, './src/components'),
      '@shared':     path.resolve(__dirname, './src/shared'),
      '@styles':     path.resolve(__dirname, './src/styles'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Pull liturgical data into its own chunk so it caches independently
          'liturgical': ['./src/data/liturgical.js'],
          // Field Guide content (~123 KB raw / ~42 KB gz) — separate chunk
          // so it caches independently of app code changes
          'field-guide': ['./src/data/field-guide.js'],
          // Course content (~334 KB raw / ~85-100 KB gz) — biggest single
          // data file. Separate chunk for independent caching.
          'course': ['./src/data/course.js'],
          // React + ReactDOM in their own vendor chunk
          'react-vendor': ['react', 'react-dom'],
          // Lucide icons in their own chunk (used everywhere, ~30KB)
          'icons': ['lucide-react'],
        },
      },
    },
  },
});
