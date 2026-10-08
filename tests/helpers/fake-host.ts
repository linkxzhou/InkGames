import type { HostPort } from '../../src/index';

export interface FakeHost extends HostPort {
  /** 按给定的毫秒时间戳序列依次触发帧回调 */
  run(timestamps: readonly number[]): void;
  readonly pending: boolean;
}

export function createFakeHost(): FakeHost {
  let callback: ((timestamp: number) => void) | undefined;
  return {
    now: () => 0,
    requestFrame(next) { callback = next; return 1; },
    cancelFrame() { callback = undefined; },
    get pending() { return callback !== undefined; },
    run(timestamps) {
      for (const timestamp of timestamps) {
        const current = callback;
        callback = undefined;
        if (!current) return;
        current(timestamp);
      }
    },
  };
}
