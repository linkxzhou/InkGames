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
        scroll: resolve(__dirname, 'apps/scroll/index.html'),
        story: resolve(__dirname, 'apps/story/index.html'),
        history: resolve(__dirname, 'apps/history/index.html'),
        gallery: resolve(__dirname, 'apps/gallery/index.html'),
        'prop-sword': resolve(__dirname, 'apps/props/sword/index.html'),
        'prop-dagger': resolve(__dirname, 'apps/props/dagger/index.html'),
        'prop-slip': resolve(__dirname, 'apps/props/slip/index.html'),
        'prop-ding': resolve(__dirname, 'apps/props/ding/index.html'),
        'prop-chariot': resolve(__dirname, 'apps/props/chariot/index.html'),
        'prop-crossbow': resolve(__dirname, 'apps/props/crossbow/index.html'),
        'prop-warship': resolve(__dirname, 'apps/props/warship/index.html'),
        'prop-water': resolve(__dirname, 'apps/props/water/index.html'),
        'prop-beacon': resolve(__dirname, 'apps/props/beacon/index.html'),
        'prop-wall': resolve(__dirname, 'apps/props/wall/index.html'),
        'prop-horse': resolve(__dirname, 'apps/props/horse/index.html'),
        'prop-banner': resolve(__dirname, 'apps/props/banner/index.html'),
        'prop-seal': resolve(__dirname, 'apps/props/seal/index.html'),
        'prop-inkstone': resolve(__dirname, 'apps/props/inkstone/index.html'),
        'prop-lantern': resolve(__dirname, 'apps/props/lantern/index.html'),
        'prop-cannon': resolve(__dirname, 'apps/props/cannon/index.html'),
        'prop-treasure': resolve(__dirname, 'apps/props/treasure/index.html'),
        'prop-shield': resolve(__dirname, 'apps/props/shield/index.html'),
        'prop-spear': resolve(__dirname, 'apps/props/spear/index.html'),
        'prop-blade': resolve(__dirname, 'apps/props/blade/index.html'),
      },
    },
    target: 'es2022',
    sourcemap: true,
  },
});
