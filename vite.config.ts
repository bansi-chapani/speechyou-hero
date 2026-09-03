import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // import.meta.dirname — __dirname is deprecated under Vite's native config loader
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // motion is ~158KB and only drives the headline reveal. Split it out
        // so it cannot block first paint of the hero copy and the score.
        // Function form: this Rollup version types manualChunks as a function.
        manualChunks(id: string) {
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
            return 'motion';
          }
        },
      },
    },
  },
});
