import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: resolve(__dirname, 'apps'),
  publicDir: false,
  server: { port: 5173, open: false },
  resolve: {
    alias: { '@inkgames/engine': resolve(__dirname, 'src/index.ts') },
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        scroll: resolve(__dirname, 'apps/scroll/index.html'),
        story: resolve(__dirname, 'apps/story/index.html'),
        history: resolve(__dirname, 'apps/history/index.html'),
      },
    },
    target: 'es2022',
    sourcemap: true,
  },
});
