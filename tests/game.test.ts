import { describe, expect, it } from 'vitest';
import {
  Engine,
  createInkCrossPlugin,
  createInputPlugin,
  createPhysicsPlugin,
  createRecorder,
  createReplay,
  createScenePlugin,
  createStrokePlugin,
  createWaterErosionPlugin,
  parseRecording,
  parseSceneJSON,
  type SceneJSON,
  type PointerSample,
  type EnginePlugin,
  type StrokeStore,
  StrokeToken,
} from '../src/index';
import sceneData from './fixtures/inkcross-scene.json';
import { createFakeHost } from './helpers/fake-host';

describe('场景 JSON', () => {
  it('接受墨渡示例场景', () => {
    const scene = parseSceneJSON(sceneData);
    expect(scene.world.width).toBe(640);
    expect(scene.ball).toBeDefined();
    expect(scene.goal).toBeDefined();
  });

  it.each([
    ['错误的格式标识', { ...sceneData, format: 'nope' }],
    ['负数世界尺寸', { ...sceneData, world: { width: -1, height: 10 } }],
    ['笔画少于 2 个点', { ...sceneData, strokes: [{ points: [{ x: 0, y: 0, radius: 1 }] }] }],
    ['非有限数值', { ...sceneData, ball: { x: Number.NaN, y: 0, radius: 1 } }],
    ['半径为 0 的圆', { ...sceneData, circles: [{ x: 0, y: 0, radius: 0, vx: 0, vy: 0, restitution: 0 }] }],
  ])('拒绝非法数据：%s', (_name, input) => {
    expect(() => parseSceneJSON(input)).toThrow();
  });
});

describe('命令录制', () => {
  it('拒绝乱序或非法记录', () => {
    const base = { format: 'inkgames.recording', version: 1, fixedHz: 60 };
    expect(() => parseRecording({ ...base, messages: [{ step: 2, order: 0, kind: 'A', payload: {} }, { step: 1, order: 0, kind: 'B', payload: {} }] })).toThrow(/Out of order/);
    expect(() => parseRecording({ ...base, messages: [{ step: -1, order: 0, kind: 'A', payload: {} }] })).toThrow(/Invalid recorded command/);
    expect(() => parseRecording({ ...base, version: 2, messages: [] })).toThrow(/Invalid recording header/);
  });

  it('录制后回放得到完全相同的笔画碎段', async () => {
    const make = async () => {
      const host = createFakeHost();
      const engine = new Engine({
        host,
        plugins: [createScenePlugin(640, 480), createInputPlugin(), createStrokePlugin(6), createWaterErosionPlugin(), createPhysicsPlugin()],
      });
      await engine.init();
      engine.start();
      host.run([0]);
      let time = 0;
      const frame = (count = 1) => { for (let i = 0; i < count; i++) { time += 1000 / 60; host.run([time]); } };
      return { engine, frame };
    };

    const a = await make();
    const recorder = createRecorder(a.engine);
    const finalA: unknown[] = [];
    a.engine.events.on('StrokeChanged', event => finalA.push(event.payload));
    a.engine.commands.enqueue('DrawStroke', { points: [{ x: 0, y: 50, radius: 5 }, { x: 160, y: 50, radius: 5 }] });
    a.frame(4);
    a.engine.commands.enqueue('EraseStroke', { path: [{ x: 80, y: 50 }], radius: 10 });
    a.frame(4);
    const recording = recorder.stop();
    expect(recording.messages.map(item => item.kind)).toEqual(['DrawStroke', 'EraseStroke']);
    await a.engine.dispose();

    const b = await make();
    const replay = createReplay(b.engine, JSON.parse(JSON.stringify(recording)));
    const finalB: unknown[] = [];
    b.engine.events.on('StrokeChanged', event => finalB.push(event.payload));
    const startStep = b.engine.currentStep;
    expect(startStep).toBeLessThanOrEqual(recording.messages[0].step);
    for (let i = 0; i < 12 && !replay.done(); i++) { replay.update(); b.frame(); }
    expect(replay.done()).toBe(true);
    expect(JSON.stringify(finalB)).toBe(JSON.stringify(finalA));
    await b.engine.dispose();
  });
});

describe('指针命令回放', () => {
  it('只记录源指针消息且回放生成同一笔画', async () => {
    async function make() {
      const host = createFakeHost();
      let store: StrokeStore;
      const probe: EnginePlugin = {
        manifest: { id: 'stroke-probe', version: '1.0.0', requires: [{ token: StrokeToken, range: '^1.0.0' }] },
        register() {}, init(ctx) { store = ctx.get(StrokeToken); },
      };
      const engine = new Engine({ host, plugins: [createInputPlugin(), createStrokePlugin(6), probe] });
      const strokes: unknown[] = [];
      engine.events.on('StrokeCreated', event => strokes.push(event.payload));
      await engine.init();
      engine.start(); host.run([0]);
      let time = 0;
      function frame() { time += 1000 / 60; host.run([time]); }
      return { engine, frame, strokes, geometry: () => JSON.stringify(store.strokes.map(stroke => stroke.fragments)) };
    }
    const source = await make();
    const recorder = createRecorder(source.engine);
    const samples: PointerSample[] = [
      { x: 0, y: 20, pressure: 0.5, kind: 'down', tool: 'ink' },
      { x: 25, y: 20, pressure: 0.5, kind: 'move', tool: 'ink' },
      { x: 50, y: 20, pressure: 0.5, kind: 'up', tool: 'ink' },
    ];
    for (const sample of samples) { source.engine.commands.enqueue('PointerSample', sample); source.frame(); source.frame(); }
    source.frame(); source.frame();
    const recording = recorder.stop();
    expect(recording.messages.map(item => item.kind)).toEqual(['PointerSample', 'PointerSample', 'PointerSample']);
    expect(source.strokes).toHaveLength(1);
    const expectedGeometry = source.geometry();
    await source.engine.dispose();

    const copy = await make();
    const replay = createReplay(copy.engine, recording);
    for (let i = 0; i < 12 && !replay.done(); i++) { replay.update(); copy.frame(); }
    copy.frame(); copy.frame();
    expect(copy.strokes).toEqual(source.strokes);
    expect(copy.geometry()).toBe(expectedGeometry);
    await copy.engine.dispose();
  });
});

describe('墨渡规则', () => {
  async function build(scene: SceneJSON, budget = 500) {
    const host = createFakeHost();
    const game = createInkCrossPlugin(scene, budget);
    const engine = new Engine({
      host,
      plugins: [game, createPhysicsPlugin(), createWaterErosionPlugin(), createStrokePlugin(6), createInputPlugin(), createScenePlugin(640, 480)],
    });
    await engine.init();
    engine.start();
    host.run([0]);
    let time = 0;
    const frame = (count = 1) => { for (let i = 0; i < count; i++) { time += 1000 / 60; host.run([time]); } };
    return { engine, game, frame };
  }

  it('预绘笔画不扣墨，玩家笔画按长度扣墨', async () => {
    const { engine, game, frame } = await build(parseSceneJSON(sceneData));
    expect(game.game.ink).toBe(500);
    engine.commands.enqueue('DrawStroke', { points: [{ x: 0, y: 10, radius: 2 }, { x: 100, y: 10, radius: 2 }] });
    frame(4);
    expect(game.game.ink).toBeCloseTo(400, 5);
    await engine.dispose();
  });

  it('墨珠无支撑坠出场景底部判负', async () => {
    const scene = parseSceneJSON({ ...sceneData, strokes: [], ball: { x: 70, y: 400, radius: 12 }, goal: { x: 600, y: 20, radius: 10 } });
    const { engine, game, frame } = await build(scene);
    frame(120);
    expect(game.game.status).toBe('lost');
    await engine.dispose();
  });

  it('墨珠接触终点印章判胜', async () => {
    const scene = parseSceneJSON({ ...sceneData, strokes: [], ball: { x: 100, y: 40, radius: 12 }, goal: { x: 100, y: 120, radius: 26 } });
    const { engine, game, frame } = await build(scene);
    frame(120);
    expect(game.game.status).toBe('won');
    await engine.dispose();
  });

  it('水刷擦断桥后墨珠穿过缺口落下（权威碰撞随碎段更新）', async () => {
    const scene = parseSceneJSON({
      ...sceneData,
      strokes: [{ points: [{ x: 20, y: 200, radius: 6 }, { x: 180, y: 200, radius: 6 }] }],
      ball: { x: 100, y: 120, radius: 12 },
      goal: { x: 100, y: 440, radius: 20 },
    });
    const { engine, game, frame } = await build(scene);
    engine.commands.enqueue('EraseStroke', { path: [{ x: 100, y: 200 }], radius: 30 });
    frame(180);
    expect(game.game.status).toBe('won');
    await engine.dispose();
  });

  it('桥保持完整时墨珠停在桥上而不会落下', async () => {
    const scene = parseSceneJSON({
      ...sceneData,
      strokes: [{ points: [{ x: 20, y: 200, radius: 6 }, { x: 180, y: 200, radius: 6 }] }],
      ball: { x: 100, y: 120, radius: 12 },
      goal: { x: 100, y: 440, radius: 20 },
    });
    const { engine, game, frame } = await build(scene);
    frame(180);
    expect(game.game.status).toBe('playing');
    expect(game.game.ball!.y).toBeLessThan(200);
    await engine.dispose();
  });
});
