// 无头 Chromium + SwiftShader：逐道具截取 src（/compare/?prop=…）与 inkEngine（同一组指针路径、笔刷、种子）
// 的并排对照，再截十卡首页与十个演示页。需要先 ./build.sh build。截图写入 /opt/cursor/artifacts/screenshots/。
// 用法：node scripts/capture-parity.mjs [modes|道具 id|apps …]，不带参数时全部截取。
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = '/opt/cursor/artifacts/screenshots';
mkdirSync(outDir, { recursive: true });

const require = createRequire(import.meta.url);
const playwright = require('playwright');
const chromiumPath = join(process.env.HOME ?? '', '.cache/ms-playwright/chromium-1248/chrome-linux64/chrome');

const SCENES = ['modes', 'flow', 'distort', 'metallic', 'camera', 'sword', 'blade', 'spear', 'bow', 'shield', 'war-horse', 'banner', 'ink-bomb', 'water-brush', 'boat', 'water'];
const CARDS = ['sword', 'blade', 'spear', 'bow', 'shield', 'war-horse', 'banner', 'ink-bomb', 'water-brush', 'boat'];
const LABEL = {
  modes: '七种笔刷', flow: 'flow 液化', distort: 'distort 扭曲', metallic: 'metallic 虫蚀', camera: '分层镜头 z=40',
  sword: '剑', blade: '刀', spear: '枪', bow: '弓', shield: '盾', 'war-horse': '战马', banner: '旗',
  'ink-bomb': '墨弹', 'water-brush': '水刷', boat: '舟', water: '水面',
};
const args = process.argv.slice(2);
const scenes = args.length ? SCENES.filter(scene => args.includes(scene)) : SCENES;
const withApps = !args.length || args.includes('apps');

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.map': 'application/json', '.png': 'image/png',
};

function fileFor(urlPath) {
  if (urlPath === '/inkengine-host.html') return join(root, 'scripts/inkengine-host.html');
  if (urlPath.startsWith('/ink-engine/')) return join(root, 'thirdparty/inkEngine', urlPath.slice('/ink-engine/'.length));
  if (urlPath.startsWith('/shots/')) return join(outDir, urlPath.slice('/shots/'.length));
  const distPath = urlPath === '/' ? 'index.html' : urlPath.endsWith('/') ? `${urlPath}index.html` : urlPath;
  return join(root, 'dist', distPath);
}

const server = createServer((request, response) => {
  const file = fileFor(decodeURIComponent((request.url ?? '/').split('?')[0]));
  let body;
  try { body = readFileSync(file); } catch { response.writeHead(404).end('not found'); return; }
  response.writeHead(200, { 'content-type': `${MIME[extname(file)] ?? 'application/octet-stream'}; charset=utf-8` });
  response.end(body);
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;

const browser = await playwright.chromium.launch({
  headless: true,
  executablePath: existsSync(chromiumPath) ? chromiumPath : undefined,
  args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'],
});

/** Frames inkEngine needs after the last point: one hold frame, the release, maxUpdates countdown, commit. */
function tail(brush) {
  const countdown = brush.effect >= 4 ? 20 : brush.mode === 1 ? 30 : 10;
  return countdown + 4;
}

async function captureSrc(scene) {
  const page = await browser.newPage({ viewport: { width: 900, height: 760 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const special = scene === 'modes' || scene === 'flow' || scene === 'distort' || scene === 'metallic' || scene === 'camera';
  await page.goto(`${origin}/compare/?${special ? `scene=${scene}` : `prop=${scene}`}`, { waitUntil: 'load', timeout: 30000 });
  await page.waitForFunction(() => window.__compareReady === true, undefined, { timeout: 180000 });
  if (errors.length) throw new Error(`${scene} 对照页报错: ${errors.join('\n')}`);
  await page.locator('#mount canvas').screenshot({ path: join(outDir, `${scene}-src.png`) });
  const data = await page.evaluate(() => window.__compareScene);
  await page.close();
  return data;
}

async function captureInk(scene, data) {
  const page = await browser.newPage({ viewport: { width: data.width + 40, height: data.height + 40 } });
  const query = `w=${data.width}&h=${data.height}&bg=${data.background.join(',')}&seed=${data.seed}`;
  await page.goto(`${origin}/inkengine-host.html?${query}`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => window.__inkReady === true || window.__inkError, undefined, { timeout: 180000 });
  const error = await page.evaluate(() => window.__inkError);
  if (error) throw new Error(`inkEngine 未就绪: ${error}`);
  const started = Date.now();
  await page.evaluate(({ strokes, tails, cameraZ }) => {
    const ink = window.__ink;
    const pad = 20;
    strokes.forEach((stroke, i) => {
      // The same p5 random state at pen-down as src's InkBrushEngine.press(seed).
      ink.p.randomSeed(stroke.seed);
      ink.setBrush(stroke.brush).setColor(stroke.color);
      ink.strokePath(stroke.points.map(p => (p.pressure === undefined ? [p.x, p.y] : p)));
      ink.step(stroke.points.length + tails[i]);
      const finish = stroke.finish;
      if (!finish) return;
      // Same order as InkSurface.applyFinish: metallic, distort, then the flow commit.
      if (finish.metallic) {
        ink.core.win.bugsSize = finish.metallic.size == null ? 10 : finish.metallic.size;
        ink.p.randomSeed(stroke.seed);
        ink.core.fn.scanBugBites();
        ink.step(1);
      }
      if (finish.distort && finish.distort.extent === 'frame') {
        ink.core.state.distortShaderEnabled = true;
        if (finish.distort.displacementB != null) ink.core.state.distortDisplacementB = finish.distort.displacementB;
        if (finish.distort.displacementC != null) ink.core.state.distortDisplacementC = finish.distort.displacementC;
        ink.step(1);
      }
      if (finish.flow) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const p of stroke.points) {
          if (p.x < minX) minX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.x > maxX) maxX = p.x;
          if (p.y > maxY) maxY = p.y;
        }
        const w = ink.p.width;
        const h = ink.p.height;
        ink.core.state.flowEffectStrokeBounds = {
          minX: Math.max(0, minX - pad) / w, minY: Math.max(0, minY - pad) / h,
          maxX: Math.min(w, maxX + pad) / w, maxY: Math.min(h, maxY + pad) / h,
        };
        ink.core.fn.replayFlowEffect(finish.flow.blendType, finish.flow.seed, finish.flow.iterations);
        // One frame commits flow into the ink; the next rebuilds the composite from that ink.
        ink.step(2);
      }
    });
    // Hide the stroke-divider overlay inkEngine draws once strokes exist; it is UI, not ink.
    ink.core.state.allBrushStrokes = [];
    if (cameraZ) {
      // Keep playback from lerping the layers back to 0, and don't let EasyCam zoom.
      ink.core.state.isPlaying = true;
      ink.core.state.doMoving = false;
      ink.core.state.easycamTracking = false;
      const layerZ = ink.core.state.layerZ;
      layerZ[0] = cameraZ;
      layerZ[40] = 0;
      layerZ[80] = 0;
      layerZ[120] = 0;
    }
    ink.step(1);
  }, { strokes: data.strokes, tails: data.strokes.map(stroke => tail(stroke.brush)), cameraZ: data.cameraZ ?? 0 });
  // p5 keeps the drawing buffer, so read the canvas directly instead of waiting on the compositor.
  const png = await page.evaluate(() => window.__ink.snapshot('image/png'));
  writeFileSync(join(outDir, `${scene}-ink.png`), Buffer.from(png.split(',')[1], 'base64'));
  await page.close();
  return Date.now() - started;
}

async function compose(scene, data) {
  const page = await browser.newPage({ viewport: { width: data.width * 2 + 56, height: data.height + 92 } });
  await page.setContent(`<!doctype html><meta charset="utf-8"><title>${scene}</title>
    <style>
      body { margin: 0; background: #151515; color: #eee; font-family: "WenQuanYi Micro Hei", sans-serif; }
      h1 { font-size: 15px; font-weight: 500; margin: 12px 16px 8px; }
      .row { display: flex; gap: 24px; padding: 0 16px; }
      figure { margin: 0; }
      figcaption { font-size: 12px; margin-bottom: 6px; color: #bbb; }
      img { display: block; width: ${data.width}px; height: ${data.height}px; }
    </style>
    <h1>${LABEL[scene] ?? scene} · 同一组指针路径、笔刷与种子 · ${data.strokes.length} 笔 · SwiftShader · 非逐像素</h1>
    <div class="row">
      <figure><figcaption>inkEngine（thirdparty/inkEngine，参照）</figcaption><img src="${origin}/shots/${scene}-ink.png?${Date.now()}"></figure>
      <figure><figcaption>InkGames src（InkSurface + PROP_BRUSHES）</figcaption><img src="${origin}/shots/${scene}-src.png?${Date.now()}"></figure>
    </div>`);
  await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
  await page.screenshot({ path: join(outDir, `${scene}-compare.png`) });
  await page.close();
}

async function runPool(items, size, worker) {
  const queue = [...items];
  await Promise.all(Array.from({ length: Math.min(size, queue.length) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      await worker(item);
    }
  }));
}

try {
  // One scene at a time: SwiftShader runs in Chromium's single GPU process, so a second page only queues behind the first.
  await runPool(scenes, 1, async (scene) => {
    const data = await captureSrc(scene);
    const ms = await captureInk(scene, data);
    await compose(scene, data);
    console.log(`${scene}: ${data.strokes.length} 笔，inkEngine 用时 ${Math.round(ms / 1000)}s`);
  });

  if (withApps) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', error => console.error('pageerror', error.message));
    await page.goto(`${origin}/`, { waitUntil: 'load', timeout: 30000 });
    await page.waitForFunction(() => document.querySelectorAll('#cards a').length === 10);
    await page.screenshot({ path: join(outDir, 'gallery.png') });
    for (const id of CARDS) {
      await page.goto(`${origin}/${id}/`, { waitUntil: 'load', timeout: 30000 });
      await page.waitForFunction(() => {
        const loading = document.getElementById('loading');
        const status = document.getElementById('status')?.textContent ?? '';
        return Boolean(document.querySelector('#canvas-root canvas')) && loading?.hidden === true && status.includes('演示已就绪');
      }, undefined, { timeout: 180000 });
      await page.waitForTimeout(1200);
      await page.locator('#canvas-root canvas').screenshot({ path: join(outDir, `app-${id}.png`) });
      console.log(`app ${id}`);
    }
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
