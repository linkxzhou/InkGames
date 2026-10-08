// 无头 Chromium + SwiftShader：截十卡页面，以及 InkWash 与 inkEngine 的并排对照。
// 需要先 ./build.sh build。截图写入 /opt/cursor/artifacts/screenshots/。
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = '/opt/cursor/artifacts/screenshots';
mkdirSync(outDir, { recursive: true });

const require = createRequire(import.meta.url);
const playwright = require('playwright');
const chromiumPath = join(process.env.HOME ?? '', '.cache/ms-playwright/chromium-1248/chrome-linux64/chrome');

const strokes = [
  {
    points: Array.from({ length: 22 }, (_, i) => [70 + i * 16, 150 + (i % 3) * 3]),
    brush: { mode: 'brush', size: 'large', effect: 0 },
    color: 'black',
  },
  {
    points: curve(90, 300, 320, 210, 680, 360, 26),
    brush: { mode: 'brush', size: 'large', effect: 0 },
    color: 'blue_dark',
  },
  {
    points: Array.from({ length: 16 }, (_, i) => [480 + i * 18, 90 + i * 12]),
    brush: { mode: 'brush', size: 'medium', effect: 2 },
    color: 'black',
  },
];

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
  const urlPath = decodeURIComponent((request.url ?? '/').split('?')[0]);
  const file = fileFor(urlPath);
  try {
    const body = readFileSync(file);
    response.writeHead(200, { 'content-type': `${MIME[extname(file)] ?? 'application/octet-stream'}; charset=utf-8` });
    response.end(body);
  } catch {
    response.writeHead(404).end('not found');
  }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const { port } = server.address();
const origin = `http://127.0.0.1:${port}`;

const browser = await playwright.chromium.launch({
  headless: true,
  executablePath: existsSync(chromiumPath) ? chromiumPath : undefined,
  args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'],
});

const cards = ['sword', 'blade', 'spear', 'bow', 'shield', 'war-horse', 'banner', 'ink-bomb', 'water-brush', 'boat'];

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', error => console.error('pageerror', error.message));

  await page.goto(`${origin}/`, { waitUntil: 'load', timeout: 30000 });
  await page.waitForFunction(() => document.querySelectorAll('#cards a').length === 10);
  await page.screenshot({ path: join(outDir, 'gallery.png') });
  console.log('gallery');

  for (const id of cards) {
    await page.goto(`${origin}/${id}/`, { waitUntil: 'load', timeout: 30000 });
    await page.waitForFunction(() => {
      const loading = document.getElementById('loading');
      const status = document.getElementById('status')?.textContent ?? '';
      return Boolean(document.querySelector('#canvas-root canvas')) && loading?.hidden === true && status.includes('演示已就绪');
    }, undefined, { timeout: 120000 });
    await page.screenshot({ path: join(outDir, `${id}.png`) });
    console.log(id);
  }

  await page.setViewportSize({ width: 860, height: 680 });
  await page.goto(`${origin}/compare/`, { waitUntil: 'load', timeout: 30000 });
  await page.waitForFunction(() => window.__compareReady === true, undefined, { timeout: 120000 });
  const srcCanvas = page.locator('#mount canvas');
  await srcCanvas.screenshot({ path: join(outDir, 'compare-src.png') });
  console.log('compare-src');

  await page.goto(`${origin}/inkengine-host.html`, { waitUntil: 'load', timeout: 30000 });
  await page.waitForFunction(() => window.__inkReady === true || window.__inkError, undefined, { timeout: 60000 });
  const inkError = await page.evaluate(() => window.__inkError);
  if (inkError) throw new Error(`inkEngine 未就绪: ${inkError}`);
  await page.evaluate(async (list) => {
    const ink = window.__ink;
    for (const stroke of list) {
      ink.setBrush(stroke.brush).setColor(stroke.color);
      ink.strokePath(stroke.points);
      ink.step(stroke.points.length + 40);
    }
  }, strokes);
  await page.locator('#defaultCanvas0').screenshot({ path: join(outDir, 'compare-ink.png') });
  console.log('compare-ink');

  await page.setViewportSize({ width: 1680, height: 760 });
  await page.setContent(`<!doctype html><meta charset="utf-8"><title>对照</title>
    <style>
      body { margin: 0; background: #111; color: #eee; font-family: sans-serif; }
      h1 { font-size: 16px; font-weight: 500; margin: 16px; }
      .row { display: flex; gap: 16px; padding: 0 16px 16px; }
      figure { margin: 0; }
      figcaption { font-size: 13px; margin-bottom: 8px; }
      img { width: 800px; height: 600px; background: #dedede; display: block; }
    </style>
    <h1>同一组笔画 · SwiftShader · EasyCam 关闭 · 不是逐像素对照</h1>
    <div class="row">
      <figure><figcaption>inkEngine（thirdparty，参照）</figcaption><img src="${origin}/shots/compare-ink.png"></figure>
      <figure><figcaption>InkWash（src，满分辨率对照页）</figcaption><img src="${origin}/shots/compare-src.png"></figure>
    </div>`);
  await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
  await page.screenshot({ path: join(outDir, 'compare-side-by-side.png') });
  console.log('side-by-side');
} finally {
  await browser.close();
  server.close();
}

function curve(x0, y0, cx, cy, x1, y1, steps) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    points.push([u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1]);
  }
  return points;
}
