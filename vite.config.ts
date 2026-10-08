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
        index: resolve(__dirname, 'apps/index.html'),
        ...Object.fromEntries([
          'sword', 'blade', 'spear', 'bow', 'shield', 'war-horse', 'banner', 'ink-bomb', 'water-brush', 'boat',
        ].map(id => [id, resolve(__dirname, `apps/${id}/index.html`)])),
        inkcross: resolve(__dirname, 'apps/inkcross/index.html'),
        wuxia: resolve(__dirname, 'apps/wuxia/index.html'),
      },
    },
    target: 'es2022',
    sourcemap: true,
  },
});
