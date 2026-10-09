// 在无头 Chromium(+SwiftShader) 中打开构建后的三条 three.js 页面，验证引擎启动与渲染循环。
// 只证明着色器能编过、无未捕获异常；真实 GPU 观感与性能以所有者在本机 Chrome 的验收为准。
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = [
  { path: '/scroll/', ready: 'window.__sliceReady === true', label: '横版切片' },
  { path: '/story/', ready: 'window.__storyReady === true', label: '叙事宿主' },
  { path: '/history/', ready: "document.querySelector('#play') && !document.querySelector('#play').disabled", label: '历史动画' },
];
const entry = join(root, 'dist', 'history', 'index.html');
if (!existsSync(entry)) {
  console.error('未找到 dist/history/index.html，请先执行 ./build.sh build');
  process.exit(1);
}

const require = createRequire(import.meta.url);
function resolvePlaywright() {
  const candidates = [
    'playwright',
    join(process.env.HOME ?? '', '.bg-agent/node/node_modules/playwright'),
    join(process.env.HOME ?? '', '.workbuddy/binaries/node/workspace/node_modules/playwright'),
  ];
  for (const candidate of candidates) {
    try { return require(candidate); } catch { /* 尝试下一个候选 */ }
  }
  return undefined;
}

function resolveChromium() {
  const caches = [
    join(process.env.HOME ?? '', 'Library/Caches/ms-playwright'),
    join(process.env.HOME ?? '', '.cache/ms-playwright'),
  ];
  for (const cache of caches) {
    if (!existsSync(cache)) continue;
    const versions = readdirSync(cache).filter(name => /^chromium-\d+$/.test(name)).sort();
    for (const version of versions.reverse()) {
      const mac = join(cache, version, 'chrome-mac-arm64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing');
      if (existsSync(mac)) return mac;
      const linux64 = join(cache, version, 'chrome-linux64', 'chrome');
      if (existsSync(linux64)) return linux64;
      const linux = join(cache, version, 'chrome-linux', 'chrome');
      if (existsSync(linux)) return linux;
    }
  }
  return undefined;
}

const playwright = resolvePlaywright();
if (!playwright) {
  console.error('未安装 playwright：执行 `yarn add -D playwright` 或让本机缓存提供 playwright 后再试');
  process.exit(1);
}

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.map': 'application/json' };
const server = createServer((request, response) => {
  const path = (request.url ?? '/').split('?')[0];
  const file = join(root, 'dist', path === '/' ? 'index.html' : path.endsWith('/') ? `${path}index.html` : path);
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

const executablePath = resolveChromium();
const browser = await playwright.chromium.launch({
  headless: true,
  args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'],
  ...(executablePath ? { executablePath } : {}),
});

try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  // HTTP failures are asserted through the response listener; a bare
  // "Failed to load resource" console line can also come from the browser's own
  // favicon fetch, which never appears as a page response.
  const missing = [];
  page.on('response', response => { if (response.status() >= 400) missing.push(`${response.status()} ${response.url()}`); });
  page.on('console', message => {
    if (message.type() !== 'error') return;
    const text = message.text();
    if (/Failed to load resource/.test(text)) return;
    errors.push(`console: ${text}`);
  });
  // 参考图片只允许作为本地参照，绝不能成为运行时资源。
  const imageRequests = [];
  page.on('request', request => {
    if (/thirdparty|\.png|\.jpe?g|\.webp/.test(request.url())) imageRequests.push(request.url());
  });

  for (const target of PAGES) {
    const before = errors.length;
    await page.goto(`http://127.0.0.1:${port}${target.path}`, { waitUntil: 'load', timeout: 30000 });
    await page.waitForFunction(target.ready, undefined, { timeout: 60000 }).catch(() => undefined);
    await page.waitForTimeout(800);
    const canvas = await page.evaluate(() => {
      const node = document.querySelector('canvas');
      return node ? { width: node.width, height: node.height } : null;
    });
    if (!canvas || canvas.width < 1 || canvas.height < 1) throw new Error(`${target.label} 没有可用画布`);
    if (errors.length !== before) throw new Error(`${target.label} 产生错误：${errors.slice(before).join(' / ')}`);
    if (missing.length > 0) throw new Error(`${target.label} 有失败请求：${missing.join(' / ')}`);
    console.log(`${target.label} 就绪：画布 ${canvas.width}×${canvas.height}`);
    if (target.path === '/history/') {
      // 确定性回归：连续两次渲染同一帧必须逐字节一致；不同帧必须不同（否则等于没画）。
      const h = await page.evaluate(() => {
        const hash = window.__historyHash;
        if (!hash) return null;
        const a1 = hash(1200);
        const a2 = hash(1200);
        const b = hash(3800);
        return { a1, a2, b };
      });
      if (!h) throw new Error('历史动画缺少 __historyHash 诊断钩子');
      if (h.a1 !== h.a2) throw new Error(`同一帧连续渲染两次不一致：${h.a1} vs ${h.a2}`);
      if (h.a1 === h.b) throw new Error('不同帧渲染结果相同，场景没有随时间变化');
      console.log(`历史动画确定性：同帧一致、异帧不同（${h.a1} / ${h.b}）`);
    }
  }
  if (imageRequests.length > 0) throw new Error(`运行时应为零图片请求，实际：${imageRequests.join(' / ')}`);
  console.log('页面冒烟通过:', PAGES.map(target => target.path).join(' '), '· 零图片请求');
} finally {
  await browser.close();
  server.close();
}
