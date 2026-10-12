import { resolve } from 'node:path';
import { defineConfig } from 'vite';

/** 查看器底纹。打成单个 IIFE，file:// 用普通 script 引入，不走 ES module。 */
export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, 'src/core/ink-backdrop-mount.ts'),
      name: 'InkGamesBackdrop',
      formats: ['iife'],
      fileName: () => 'ink-backdrop.js',
    },
    outDir: resolve(__dirname, 'video/viewer/assets'),
    emptyOutDir: false,
    sourcemap: false,
    minify: true,
    target: 'es2022',
  },
});
