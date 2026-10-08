import { describe, expect, it } from 'vitest';
import { Engine, createToken, resolvePlugins, satisfies, type EnginePlugin } from '../src/index';
import {
  createInputPlugin, createSceneRendererPlugin, createScenePlugin, createStrokePlugin, loadSceneJSON,
  SceneToken, StrokeToken, type Scene2D, type StrokeStore,
} from '../src/index';
import { createFakeHost } from './helpers/fake-host';

async function initError(engine: Engine): Promise<{ message: string; cause: string }> {
  try {
    await engine.init();
  } catch (error) {
    const wrapped = error as Error;
    return { message: wrapped.message, cause: String((wrapped.cause as Error | undefined)?.message ?? '') };
  }
  throw new Error('expected engine.init() to reject');
}

const A = createToken<number>('test.a');
const B = createToken<number>('test.b');

function plugin(id: string, extra: Partial<EnginePlugin['manifest']> = {}): EnginePlugin {
  return { manifest: { id, version: '1.0.0', ...extra }, register() {}, init() {} };
}

describe('场景标记与实体渲染契约（plan/09 R1）', () => {
  async function world() {
    const host = createFakeHost();
    let scene!: Scene2D;
    let strokes!: StrokeStore;
    const probe: EnginePlugin = {
      manifest: { id: 'probe', version: '1.0.0', requires: [{ token: SceneToken, range: '^1.0.0' }, { token: StrokeToken, range: '^1.0.0' }] },
      register() {},
      init(ctx) { scene = ctx.get(SceneToken); strokes = ctx.get(StrokeToken); },
    };
    const engine = new Engine({ host, plugins: [createScenePlugin(640, 480, 0), createInputPlugin(), createStrokePlugin(6), probe] });
    await engine.init();
    return { engine, scene: () => scene, strokes: () => strokes };
  }

  it('loadSceneJSON 把 goal 注册为场景标记，球进入 circles', async () => {
    const { engine, scene, strokes } = await world();
    loadSceneJSON(scene(), strokes(), {
      format: 'inkgames.scene', version: 1,
      world: { width: 640, height: 480 },
      ball: { x: 70, y: 60, radius: 12 },
      goal: { x: 540, y: 360, radius: 26 },
    });
    expect(scene().circles).toHaveLength(1);
    expect(scene().circles[0].x).toBe(70);
    expect(scene().markers).toHaveLength(1);
    expect(scene().markers[0]).toMatchObject({ id: 'goal', kind: 'goal', x: 540, radius: 26 });
    await engine.dispose();
  });

  it('scene-renderer 只声明 Renderer/Scene 为必需依赖，Ink 为可选', () => {
    const renders = createSceneRendererPlugin().manifest;
    const required = (renders.requires ?? []).map(item => item.token.id);
    expect(required).toEqual(['inkgames.webgl2', 'inkgames.scene2d']);
    expect((renders.optional ?? []).map(item => item.token.id)).toEqual(['inkgames.ink-visual']);
    // 未声明 Ink 为必需 → 缺墨水插件时不会因缺依赖而拒绝启动。
    expect(required).not.toContain('inkgames.ink-visual');
  });
});

describe('插件图与依赖', () => {
  it('版本范围支持 ^ 与 ~，拒绝不支持的主版本', () => {
    expect(satisfies('1.4.2', '^1.0.0')).toBe(true);
    expect(satisfies('2.0.0', '^1.0.0')).toBe(false);
    expect(satisfies('1.4.2', '~1.4.0')).toBe(true);
    expect(satisfies('1.5.0', '~1.4.0')).toBe(false);
    expect(satisfies('1.2.3', '1.2.3')).toBe(true);
    expect(satisfies('1.2.4', '1.2.3')).toBe(false);
  });

  it('按依赖拓扑排序，且与传入顺序无关', () => {
    const provider = plugin('provider', { provides: [{ token: A, version: '1.0.0' }] });
    const consumer = plugin('consumer', { requires: [{ token: A, range: '^1.0.0' }] });
    expect(resolvePlugins([consumer, provider]).map(item => item.manifest.id)).toEqual(['provider', 'consumer']);
    expect(resolvePlugins([provider, consumer]).map(item => item.manifest.id)).toEqual(['provider', 'consumer']);
  });

  it('缺失依赖、重复 provider、依赖环和未知 before/after 都立即报错', () => {
    const provider = plugin('provider', { provides: [{ token: A, version: '1.0.0' }] });
    expect(() => resolvePlugins([plugin('orphan', { requires: [{ token: B, range: '^1.0.0' }] })])).toThrow(/missing service/);
    expect(() => resolvePlugins([provider, plugin('dup', { provides: [{ token: A, version: '1.0.0' }] })])).toThrow(/Duplicate provider/);
    expect(() => resolvePlugins([
      plugin('x', { after: ['y'] }), plugin('y', { after: ['x'] }),
    ])).toThrow(/cycle/);
    expect(() => resolvePlugins([plugin('x', { before: ['ghost'] })])).toThrow(/before unknown plugin/);
  });

  it('声明了 provide 但未注册服务时初始化失败并回滚', async () => {
    const order: string[] = [];
    const liar: EnginePlugin = {
      manifest: { id: 'liar', version: '1.0.0', provides: [{ token: A, version: '1.0.0' }] },
      register(ctx) { ctx.resources.add(() => { order.push('cleanup:liar'); }); },
      init() {},
      dispose() { order.push('dispose:liar'); },
    };
    const engine = new Engine({ host: createFakeHost(), plugins: [liar] });
    const failure = await initError(engine);
    expect(failure.message).toMatch(/Plugin liar initialization failed/);
    expect(failure.cause).toMatch(/did not register/);
    expect(order).toContain('cleanup:liar');
    expect(order).toContain('dispose:liar');
    expect(engine.status).toBe('disposed');
  });

  it('init 抛错时逆依赖顺序释放已初始化插件', async () => {
    const order: string[] = [];
    const first: EnginePlugin = {
      manifest: { id: 'first', version: '1.0.0', provides: [{ token: A, version: '1.0.0' }] },
      register(ctx) { ctx.provide(A, 1); ctx.resources.add(() => { order.push('scope:first'); }); },
      init() {},
      dispose() { order.push('dispose:first'); },
    };
    const second: EnginePlugin = {
      manifest: { id: 'second', version: '1.0.0', requires: [{ token: A, range: '^1.0.0' }] },
      register() {},
      init() { throw new Error('boom'); },
      dispose() { order.push('dispose:second'); },
    };
    const engine = new Engine({ host: createFakeHost(), plugins: [first, second] });
    expect((await initError(engine)).cause).toBe('boom');
    expect(order).toEqual(['dispose:second', 'dispose:first', 'scope:first']);
  });

  it('未声明依赖的服务不可访问', async () => {
    const provider: EnginePlugin = {
      manifest: { id: 'provider', version: '1.0.0', provides: [{ token: A, version: '1.0.0' }] },
      register(ctx) { ctx.provide(A, 7); },
      init() {},
    };
    const sneaky: EnginePlugin = {
      manifest: { id: 'sneaky', version: '1.0.0', after: ['provider'] },
      register() {},
      init(ctx) { ctx.get(A); },
    };
    const engine = new Engine({ host: createFakeHost(), plugins: [provider, sneaky] });
    const failure = await initError(engine);
    expect(failure.message).toMatch(/Plugin sneaky initialization failed/);
    expect(failure.cause).toMatch(/did not declare dependency/);
  });
});
