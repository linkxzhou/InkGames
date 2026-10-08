import p5 from 'p5';
import {
  Engine,
  createCameraPlugin,
  createInkCrossPlugin,
  createInkFluidPlugin,
  createInputPlugin,
  createPhysicsPlugin,
  createPointerPlugin,
  createScenePlugin,
  createSceneRendererPlugin,
  createStrokePlugin,
  createWaterErosionPlugin,
  createWebGL2RendererPlugin,
  createP5Host,
  parseSceneJSON,
  InkDiagnosticsToken,
  StrokeToken,
  type CircleBody,
  type PointerSample,
  type EnginePlugin,
  type InkDiagnostics,
  type StrokeStore,
} from '@inkgames/engine';
import sceneData from './scene.json';

const WIDTH = 640;
const HEIGHT = 480;
const stage = document.getElementById('stage') as HTMLElement;
const statusEl = document.getElementById('status') as HTMLElement;
const inkEl = document.getElementById('ink') as HTMLElement;
const toolButton = document.getElementById('tool') as HTMLButtonElement;
const resetButton = document.getElementById('reset') as HTMLButtonElement;

type P5Constructor = Parameters<typeof createP5Host>[0];
const scene = parseSceneJSON(sceneData);

async function boot(): Promise<void> {
  const host = await createP5Host(p5 as unknown as P5Constructor, stage, WIDTH, HEIGHT);
  host.canvas.addEventListener('webglcontextlost', event => event.preventDefault());

  const game = createInkCrossPlugin(scene, 900);
  const pointer = createPointerPlugin(host.canvas);
  // 小型探针插件：只为把墨层诊断服务带给页面（供对账回归），不参与任何游戏逻辑。
  let diagnostics: InkDiagnostics | undefined;
  let strokes: StrokeStore | undefined;
  const probe: EnginePlugin = {
    manifest: {
      id: 'inkcross-probe', version: '1.0.0',
      requires: [{ token: InkDiagnosticsToken, range: '^1.0.0' }, { token: StrokeToken, range: '^1.0.0' }],
    },
    register() {},
    init(ctx) { diagnostics = ctx.get(InkDiagnosticsToken); strokes = ctx.get(StrokeToken); },
  };
  const engine = new Engine({
    host,
    fixedHz: 60,
    // 上下文丢失后 p5 与原生 FBO/纹理全部失效（plan/09 P0-3）；v0.1 的恢复策略是
    // 暂停时钟 + 整页重载，避免留下半失效的 GPU 资源。重建式恢复见 plan/09 R3 后续项。
    onContextRestored: () => location.reload(),
    plugins: [
      createWebGL2RendererPlugin(host.canvas, host.gl),
      createScenePlugin(WIDTH, HEIGHT),
      createCameraPlugin(),
      createInputPlugin(),
      createStrokePlugin(),
      createWaterErosionPlugin(),
      createPhysicsPlugin(),
      pointer,
      createInkFluidPlugin(60),
      createSceneRendererPlugin(),
      probe,
      game,
    ],
  });
  await engine.init();
  // 供浏览器冒烟与人工调试读取引擎状态与墨量对账数据。
  // measureInk 是 GPU 回读，仅限测试/调试调用，不进游戏逻辑（plan/07 §3）。
  (window as unknown as { __inkgames?: unknown }).__inkgames = {
    engine, game,
    measureInk: () => (diagnostics as InkDiagnostics).measureInk(),
    forceRebuild: () => (diagnostics as InkDiagnostics).forceRebuild(),
    forceRedraw: (strokeId: number) => (diagnostics as InkDiagnostics).forceRedraw(strokeId),
    forceRedrawBatch: (strokeIds: readonly number[]) => (diagnostics as InkDiagnostics).forceRedrawBatch(strokeIds),
    strokeIds: () => (strokes as StrokeStore).strokes.map(stroke => stroke.id),
    setTool: (next: PointerSample['tool']) => { tool = next; pointer.setTool(next); },
  };

  let tool: PointerSample['tool'] = 'ink';
  toolButton.onclick = () => {
    tool = tool === 'ink' ? 'water' : 'ink';
    pointer.setTool(tool);
    toolButton.textContent = tool === 'ink' ? '切换：水刷' : '切换：笔（墨）';
  };
  resetButton.onclick = () => location.reload();

  engine.start();

  let ball: CircleBody | undefined = game.game.ball;
  const hud = window.setInterval(() => {
    const state = game.game;
    ball = state.ball ?? ball;
    statusEl.textContent = state.status;
    inkEl.textContent = state.ink.toFixed(0);
  }, 200);

  window.addEventListener('beforeunload', () => {
    window.clearInterval(hud);
    void engine.dispose().finally(() => host.dispose());
  });
}

void boot().catch(error => {
  statusEl.textContent = '启动失败';
  document.body.insertAdjacentHTML(
    'beforeend',
    `<pre style="color:#b00;max-width:90vw;overflow:auto">${String((error as Error)?.stack ?? error)}</pre>`,
  );
});
