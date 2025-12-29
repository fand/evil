import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  publicDir: 'static',
  server: {
    port: 9000,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
