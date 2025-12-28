import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'build/js',
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/ts/main.ts'),
      name: 'Evil',
      fileName: () => 'evil.js',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        // Ensure jQuery is bundled
        inlineDynamicImports: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
