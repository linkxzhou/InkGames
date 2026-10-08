import type { PointerSample, StrokePoint } from './tokens';

export interface BrushState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  inkLeft: number;
}

export function quantizeSample(sample: PointerSample): PointerSample {
  const pressure = Number.isFinite(sample.pressure) ? sample.pressure : 0.5;
  return {
    ...sample,
    x: Math.round(sample.x * 64) / 64,
    y: Math.round(sample.y * 64) / 64,
    pressure: Math.round(Math.max(0, Math.min(1, pressure)) * 31) / 31,
  };
}

export function startBrush(sample: PointerSample, baseRadius: number): BrushState {
  return { x: sample.x, y: sample.y, vx: 0, vy: 0,
    radius: Math.max(1, baseRadius * (0.45 + sample.pressure * 1.1)), inkLeft: 1 };
}

/**
 * 弹簧-阻尼笔尖跟随（plan/08 §3.3 O2）。速度经 `speed / (speed + k)` 饱和映射到提按，
 * 避免原实现的 `speed/100` 在快速运笔时把半径压到 1px（那会让整笔塌成一根中灰细线，
 * 失去毛笔的粗细层次）。
 */
export function advanceBrush(state: BrushState, target: PointerSample, baseRadius: number): StrokePoint {
  state.vx = (state.vx + (target.x - state.x) * 0.45) * 0.65;
  state.vy = (state.vy + (target.y - state.y) * 0.45) * 0.65;
  state.x = Math.round((state.x + state.vx) * 64) / 64;
  state.y = Math.round((state.y + state.vy) * 64) / 64;
  const speed = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
  state.inkLeft = Math.max(0.35, state.inkLeft - speed / 20000);
  // 提按：快则细、慢则饱，用饱和曲线保证半径始终保持在基准的 45% 以上。
  const press = 1 - 0.55 * (speed / (speed + 26));
  const targetRadius = Math.max(1,
    baseRadius * (0.45 + target.pressure * 1.1) * press * state.inkLeft);
  const limit = Math.max(0.25, state.radius * 0.2);
  state.radius = Math.max(1, Math.round((state.radius + Math.max(-limit, Math.min(limit, targetRadius - state.radius))) * 64) / 64);
  return { x: state.x, y: state.y, radius: state.radius };
}
