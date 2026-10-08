import { describe, expect, it } from 'vitest';
import { Engine, createToken, type EnginePlugin } from '../src/index';
import { createFakeHost } from './helpers/fake-host';

const CounterToken = createToken<{ value: number }>('test.counter');

function counterPlugin(steps: number[]): EnginePlugin {
  return {
    manifest: {
      id: 'test.counter', version: '1.0.0',
      provides: [{ token: CounterToken, version: '1.0.0' }], fixedPhase: 'gameplay',
    },
    register(ctx) { ctx.provide(CounterToken, { value: 0 }); },
    init() {},
    fixedUpdate(ctx) { steps.push(ctx.step); ctx.get(CounterToken).value++; },
  };
}

describe('固定步调度', () => {
  it('不同显示刷新率下 10 秒的固定步数量一致', async () => {
    for (const hz of [30, 60, 144]) {
      const host = createFakeHost();
      const steps: number[] = [];
      const engine = new Engine({ host, plugins: [counterPlugin(steps)] });
      await engine.init();
      engine.start();
      const frame = 1000 / hz;
      const timestamps = [0];
      for (let t = frame; t <= 10_000 + 1e-9; t += frame) timestamps.push(t);
      host.run(timestamps);
      expect(steps.length, `${hz}Hz`).toBe(600);
      await engine.dispose();
    }
  });

  it('卡顿时每帧最多推进 maxStepsPerFrame 步并上报 gap', async () => {
    const host = createFakeHost();
    const steps: number[] = [];
    const gaps: number[] = [];
    const engine = new Engine({
      host, plugins: [counterPlugin(steps)], maxStepsPerFrame: 2,
      onGap: (seconds, step) => gaps.push(seconds, step),
    });
    await engine.init();
    engine.start();
    host.run([0, 1000]); // 1 秒卡顿
    expect(steps.length).toBe(2);
    expect(gaps[0]).toBeGreaterThan(0.9);
    await engine.dispose();
  });

  it('暂停后恢复不丢失已累计的逻辑进度', async () => {
    const host = createFakeHost();
    const steps: number[] = [];
    const engine = new Engine({ host, plugins: [counterPlugin(steps)] });
    await engine.init();
    engine.start();
    host.run([0, 17, 34]);
    const before = engine.currentStep;
    engine.pause();
    expect(engine.status).toBe('paused');
    engine.start();
    host.run([51, 68]);
    expect(engine.currentStep).toBeGreaterThan(before);
    await engine.dispose();
  });

  it('命令与事件按固定步投递，回调中新增的命令顺延到下一步', async () => {
    const host = createFakeHost();
    const delivered: Array<[number, string]> = [];
    const plugin: EnginePlugin = {
      manifest: { id: 'test.queue', version: '1.0.0', fixedPhase: 'gameplay' },
      register(ctx) {
        ctx.commands.on<{ n: number }>('Ping', command => {
          delivered.push([command.step, `cmd:${command.payload.n}`]);
          if (command.payload.n < 2) ctx.commands.enqueue('Ping', { n: command.payload.n + 1 });
          ctx.events.emit('Pong', { n: command.payload.n });
        });
        ctx.events.on<{ n: number }>('Pong', event => delivered.push([event.step, `evt:${event.payload.n}`]));
      },
      init() {},
    };
    const engine = new Engine({ host, plugins: [plugin] });
    await engine.init();
    engine.start();
    host.run([0]);
    engine.commands.enqueue('Ping', { n: 0 });
    host.run([17, 34, 51]);
    expect(delivered.filter(item => item[1].startsWith('cmd'))).toEqual([[0, 'cmd:0'], [1, 'cmd:1'], [2, 'cmd:2']]);
    await engine.dispose();
  });

  it('dispose 幂等，且释放后不再请求帧', async () => {
    const host = createFakeHost();
    const engine = new Engine({ host, plugins: [counterPlugin([])] });
    await engine.init();
    engine.start();
    await engine.dispose();
    await engine.dispose();
    expect(engine.status).toBe('disposed');
    expect(host.pending).toBe(false);
  });
});
