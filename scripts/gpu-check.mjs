// 本地真实 GPU 验收入口。默认只起开发服务器并打印地址，留给所有者的 Chrome。
// `--shots` 或 GPU_CHECK_SHOTS=1 用无头 Chromium + SwiftShader 截横版切片，只证明着色器能编过、没有 GL 错误。
// SwiftShader 的像素不能当成 Mac 上的验收。
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const shots = process.argv.includes('--shots') || process.env.GPU_CHECK_SHOTS === '1';
const port = Number(process.env.GPU_CHECK_PORT ?? 4179);
const viteBin = join(root, 'node_modules', 'vite', 'bin', 'vite.js');
if (!existsSync(viteBin)) {
  console.error('未找到 vite。先执行 ./build.sh install');
  process.exit(1);
}

const server = spawn(process.execPath, [viteBin, '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
  cwd: root,
  stdio: 'inherit',
});

const base = `http://127.0.0.1:${port}`;
let stopped = false;
function stop(code) {
  if (stopped) return;
  stopped = true;
  server.kill('SIGTERM');
  process.exit(code);
}

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));

async function waitForServer() {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error('开发服务器提前退出');
    try {
      const response = await fetch(`${base}/scroll/`);
      if (response.ok) return;
    } catch { /* 还没听端口 */ }
    await new Promise(resolveDelay => setTimeout(resolveDelay, 200));
  }
  throw new Error('开发服务器没有在 30 秒内起来');
}

if (!shots) {
  await waitForServer();
  console.log(`横版切片：${base}/scroll/`);
  console.log('在 Mac（Apple Silicon）的 Chrome 里打开这一页。无头 SwiftShader 不能代替这次验收，文档保持「未实测」。');
  console.log('Ctrl+C 结束。');
  await new Promise(() => {});
}

const require = createRequire(import.meta.url);
function loadPlaywright() {
  const candidates = [
    'playwright',
    join(process.env.HOME ?? '', '.bg-agent/node/node_modules/playwright'),
  ];
  for (const candidate of candidates) {
    try { return require(candidate); } catch { /* 下一个 */ }
  }
  return undefined;
}

function findChromium() {
  const caches = [
    join(process.env.HOME ?? '', '.cache/ms-playwright'),
    join(process.env.HOME ?? '', 'Library/Caches/ms-playwright'),
  ];
  for (const cache of caches) {
    if (!existsSync(cache)) continue;
    const versions = readdirSync(cache).filter(name => /^chromium-\d+$/.test(name)).sort();
    for (const version of versions.reverse()) {
      const linux = join(cache, version, 'chrome-linux64', 'chrome');
      if (existsSync(linux)) return linux;
      const linuxOld = join(cache, version, 'chrome-linux', 'chrome');
      if (existsSync(linuxOld)) return linuxOld;
      const mac = join(cache, version, 'chrome-mac-arm64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing');
      if (existsSync(mac)) return mac;
    }
  }
  return undefined;
}

const playwright = loadPlaywright();
if (!playwright) {
  console.error('未安装 playwright');
  stop(1);
}

try {
  await waitForServer();
  const executablePath = findChromium();
  const browser = await playwright.chromium.launch({
    headless: true,
    args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'],
    ...(executablePath ? { executablePath } : {}),
  });
  const outDir = process.env.GPU_CHECK_OUT ?? '/opt/cursor/artifacts/screenshots';
  mkdirSync(outDir, { recursive: true });
  const failures = [];
  try {
    for (const pose of ['rest', 'cut']) {
      const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => {
        if (message.type() === 'error') errors.push(message.text());
      });
      await page.goto(`${base}/scroll/?pose=${pose}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
      await page.waitForFunction(() => window.__sliceReady === true, undefined, { timeout: 120000 });
      const gl = await page.evaluate(() => window.__sliceGl ?? 0);
      if (gl !== 0) errors.push(`gl error ${gl}`);
      const file = join(outDir, `slice-${pose}.png`);
      await page.screenshot({ path: file });
      console.log(file);
      if (errors.length) failures.push(`${pose}: ${errors.join(' | ')}`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
  if (failures.length) {
    console.error(failures.join('\n'));
    stop(1);
  }
  console.log('SwiftShader 截图完成。这不是真实 GPU 验收。');
  stop(0);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  stop(1);
}
