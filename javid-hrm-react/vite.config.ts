import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@styles': fileURLToPath(new URL('../JavidHrm/assets/styles', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: true,
    fs: {
      allow: [fileURLToPath(new URL('..', import.meta.url))],
    },
  },
});
