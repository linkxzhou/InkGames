import { describe, expect, it } from 'vitest';
import {
  Engine,
  createInputPlugin,
  createPhysicsPlugin,
  createScenePlugin,
  createStrokePlugin,
  createWaterErosionPlugin,
  quantizeSample,
  startBrush,
  advanceBrush,
} from '../src/index';
import { createFakeHost, type FakeHost } from './helpers/fake-host';

interface Changed { strokeId: number; fragments: Array<Array<{ x: number; y: number; radius: number }>> }

async function createWorld() {
  const host = createFakeHost();
  const engine = new Engine({
    host,
    plugins: [
      createScenePlugin(640, 480),
      createInputPlugin(),
      createStrokePlugin(6),
      createWaterErosionPlugin(),
      createPhysicsPlugin(),
    ],
  });
  await engine.init();
  engine.start();
  host.run([0]);
  let time = 0;
  const settle = (frames = 6) => {
    for (let i = 0; i < frames; i++) { time += 17; host.run([time]); }
  };
  return { engine, host, settle };
}

describe('水刷侵蚀权威几何', () => {
  it('桥中间被擦断为两段', async () => {
    const { engine, settle } = await createWorld();
    engine.commands.enqueue('DrawStroke', { points: [{ x: 0, y: 100, radius: 5 }, { x: 100, y: 100, radius: 5 }] });
    settle();
    let changed: Changed | undefined;
    engine.events.on<Changed>('StrokeChanged', event => { changed = event.payload; });
    engine.commands.enqueue('EraseStroke', { path: [{ x: 50, y: 100 }], radius: 10 });
    settle();
    expect(changed).toBeDefined();
    expect(changed!.fragments.length).toBe(2);
    const [left, right] = changed!.fragments;
    expect(left[0].x).toBeCloseTo(0, 5);
    expect(left[1].x).toBeCloseTo(35, 5);
    expect(right[0].x).toBeCloseTo(65, 5);
    expect(right[1].x).toBeCloseTo(100, 5);
    for (const fragment of changed!.fragments) for (const point of fragment) expect(point.radius).toBeGreaterThan(0);
    await engine.dispose();
  });

  it('擦除端点后只剩一段', async () => {
    const { engine, settle } = await createWorld();
    engine.commands.enqueue('DrawStroke', { points: [{ x: 0, y: 0, radius: 4 }, { x: 100, y: 0, radius: 4 }] });
    settle();
    let changed: Changed | undefined;
    engine.events.on<Changed>('StrokeChanged', event => { changed = event.payload; });
    engine.commands.enqueue('EraseStroke', { path: [{ x: 0, y: 0 }], radius: 10 });
    settle();
    expect(changed!.fragments.length).toBe(1);
    expect(changed!.fragments[0][0].x).toBeGreaterThan(13);
    await engine.dispose();
  });

  it('两次交错擦除把同一桥切成三段', async () => {
    const { engine, settle } = await createWorld();
    engine.commands.enqueue('DrawStroke', { points: [{ x: 0, y: 0, radius: 4 }, { x: 165, y: 0, radius: 4 }] });
    settle();
    const latest: Changed[] = [];
    engine.events.on<Changed>('StrokeChanged', event => latest.push(event.payload));
    engine.commands.enqueue('EraseStroke', { path: [{ x: 50, y: 0 }], radius: 12 });
    settle(3);
    engine.commands.enqueue('EraseStroke', { path: [{ x: 120, y: 0 }], radius: 12 });
    settle(3);
    expect(latest.at(-1)!.fragments.length).toBe(3);
    await engine.dispose();
  });

  it('擦掉整笔后碎段为空', async () => {
    const { engine, settle } = await createWorld();
    engine.commands.enqueue('DrawStroke', { points: [{ x: 10, y: 10, radius: 3 }, { x: 20, y: 10, radius: 3 }] });
    settle();
    let changed: Changed | undefined;
    engine.events.on<Changed>('StrokeChanged', event => { changed = event.payload; });
    engine.commands.enqueue('EraseStroke', { path: [{ x: 15, y: 10 }], radius: 40 });
    settle();
    expect(changed!.fragments.length).toBe(0);
    await engine.dispose();
  });

  it('已锁定笔画不会被水刷修改', async () => {
    const { engine, settle } = await createWorld();
    engine.commands.enqueue('DrawStroke', { points: [{ x: 0, y: 0, radius: 4 }, { x: 100, y: 0, radius: 4 }], locked: true });
    settle();
    let changes = 0;
    engine.events.on('StrokeChanged', () => { changes++; });
    engine.commands.enqueue('EraseStroke', { path: [{ x: 50, y: 0 }], radius: 20 });
    settle();
    expect(changes).toBe(0);
    await engine.dispose();
  });

  it('同一输入序列两次运行得到逐字节一致的结果', async () => {
    const run = async (): Promise<string> => {
      const { engine, settle } = await createWorld();
      engine.commands.enqueue('DrawStroke', { points: [{ x: 0, y: 40, radius: 5 }, { x: 180, y: 40, radius: 5 }] });
      settle();
      engine.commands.enqueue('EraseStroke', { path: [{ x: 40, y: 40 }, { x: 90, y: 40 }], radius: 9 });
      let snapshot = '';
      engine.events.on('StrokeChanged', event => { snapshot = JSON.stringify(event.payload); });
      settle();
      await engine.dispose();
      return snapshot;
    };
    const first = await run();
    expect(first).not.toBe('');
    expect(await run()).toBe(first);
  });
});

describe('量化笔尖物理', () => {
  it('量化压感和坐标且固定输入轨迹结果一致', () => {
    const input = [
      { x: 10.25, y: 20.75, pressure: 0.5, kind: 'down' as const, tool: 'ink' as const },
      { x: 30.3, y: 21, pressure: 0.55, kind: 'move' as const, tool: 'ink' as const },
      { x: 80.1, y: 21, pressure: 0.53, kind: 'up' as const, tool: 'ink' as const },
    ];
    const run = () => {
      const samples = input.map(quantizeSample);
      const state = startBrush(samples[0], 6);
      return samples.slice(1).map(sample => advanceBrush(state, sample, 6));
    };
    expect(run()).toEqual(run());
    const first = run();
    expect(first[0].x).toBeGreaterThan(10.25);
    expect(first[0].x).toBeLessThan(30.3);
    expect(first[1].radius).toBeGreaterThan(0);
    expect(quantizeSample(input[0]).pressure * 31).toBe(Math.round(0.5 * 31));
  });

});

describe('固化可擦性（plan/07 §4.4）', () => {
  it('松笔后固化窗口内可擦断，超过 dryAfterSteps 后不可擦', async () => {
    const { engine, settle } = await createWorld();
    const dried: number[] = [];
    engine.events.on<{ strokeId: number }>('StrokeDried', event => dried.push(event.payload.strokeId));

    // dryAfterSteps=4：第 4 步之后固化。
    engine.commands.enqueue('DrawStroke', { points: [{ x: 0, y: 200, radius: 5 }, { x: 200, y: 200, radius: 5 }], dryAfterSteps: 4 });
    settle(2);
    let changed = 0;
    engine.events.on('StrokeChanged', () => { changed++; });
    engine.commands.enqueue('EraseStroke', { path: [{ x: 100, y: 200 }], radius: 12 });
    settle(2);
    expect(changed).toBe(1); // 固化前：水刷能切断

    settle(6); // 越过固化窗口
    expect(dried.length).toBe(1);

    changed = 0;
    engine.commands.enqueue('EraseStroke', { path: [{ x: 40, y: 200 }], radius: 12 });
    settle(2);
    expect(changed).toBe(0); // 固化后：水刷不再改变几何
    await engine.dispose();
  });

  it('未声明 dryAfterSteps 的笔画永不固化，始终可擦', async () => {
    const { engine, settle } = await createWorld();
    engine.commands.enqueue('DrawStroke', { points: [{ x: 0, y: 300, radius: 5 }, { x: 200, y: 300, radius: 5 }] });
    settle(10);
    let changed = 0;
    engine.events.on('StrokeChanged', () => { changed++; });
    engine.commands.enqueue('EraseStroke', { path: [{ x: 100, y: 300 }], radius: 12 });
    settle(2);
    expect(changed).toBe(1);
    await engine.dispose();
  });
});

export type { FakeHost };
