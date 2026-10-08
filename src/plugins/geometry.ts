import type { EnginePlugin } from '../core/types';
import { advanceBrush, quantizeSample, startBrush, type BrushState } from './brush-model';
import { ErosionToken, InputToken, StrokeToken, type Point, type Stroke, type StrokePoint, type StrokeStore } from './tokens';

export interface DrawStroke { points: StrokePoint[]; locked?: boolean; source?: 'pointer'; dryAfterSteps?: number }
export interface EraseStroke { path: Point[]; radius: number; source?: 'pointer' }

export function createStrokePlugin(defaultRadius = 6, dryAfterSteps = 180): EnginePlugin {
  let nextId = 1;
  let strokes: Stroke[] = [];
  let active: StrokePoint[] | null = null;
  let brush: BrushState | null = null;
  let currentStep = 0;
  return {
    manifest: {
      id: 'stroke-geometry', version: '1.0.0',
      requires: [{ token: InputToken, range: '^1.0.0' }],
      provides: [{ token: StrokeToken, version: '1.0.0' }], fixedPhase: 'input',
    },
    register(ctx) {
      const store = {
        get strokes() { return strokes as readonly Stroke[]; },
        get(id: number) { return strokes.find(stroke => stroke.id === id); },
        clear() { strokes = []; active = null; brush = null; nextId = 1; ctx.events.emit('StrokeCleared', {}); },
        create(points: StrokePoint[], locked = false, dryAtStep?: number) {
          if (!points.length) throw new Error('Stroke needs points');
          if (strokes.length >= 1024 || points.length > 4096) throw new Error('Stroke budget exceeded');
          const fragments = [points.map(p => ({ ...p }))];
          const stroke: Stroke = { id: nextId++, points: points.map(p => ({ ...p })), fragments, locked };
          if (dryAtStep !== undefined) stroke.dryAtStep = dryAtStep;
          strokes.push(stroke);
          ctx.events.emit('StrokeCreated', { strokeId: stroke.id });
          return stroke;
        },
        /**
         * 固化推进（plan/07 §4.4）：松笔后经过 dryAfterSteps 步，笔画从「可擦」变为「固化」。
         * 固化只影响可擦性，碰撞链继续存在——「能碰撞」不等于「不可擦」。
         */
        advance(step: number) {
          let dried = 0;
          for (const stroke of strokes) {
            if (stroke.dryAtStep === undefined || stroke.locked) continue;
            if (step < stroke.dryAtStep) continue;
            stroke.dryAtStep = undefined;
            stroke.locked = true;
            dried++;
            ctx.events.emit('StrokeDried', { strokeId: stroke.id, step });
          }
          return dried;
        },
      };
      ctx.provide(StrokeToken, store);
      const unsubscribe = ctx.commands.on<DrawStroke>('DrawStroke', command => {
        const delay = command.payload.dryAfterSteps;
        const dryAt = delay && delay > 0 ? currentStep + delay : undefined;
        store.create(command.payload.points, command.payload.locked, dryAt);
      });
      ctx.resources.add(unsubscribe);
      ctx.resources.add(() => { strokes = []; active = null; brush = null; });
    },
    init() { if (!(defaultRadius > 0)) throw new Error('Invalid stroke radius'); },
    fixedUpdate(ctx) {
      currentStep = ctx.step;
      const store = ctx.get(StrokeToken);
      const input = ctx.get(InputToken);
      // 本步积压的样本按路径距离**重采样**后推进笔尖（plan/09 P1-7）：
      // 一帧可能合并多个 pointermove，逐样本调用 advanceBrush 会让笔尖只前进样本数步、
      // 严重滞后于指针，并使速度估计偏小（提按失效）。这里按固定步预算补足插值点。
      const samples = input.drain();
      for (let i = 0; i < samples.length; i++) {
        const sample = quantizeSample(samples[i]);
        if (sample.tool === 'water') {
          if (sample.kind === 'down' || sample.kind === 'move') ctx.commands.enqueue<EraseStroke>('EraseStroke', { path: [{ x: sample.x, y: sample.y }], radius: defaultRadius * 2, source: 'pointer' });
          continue;
        }
        if (sample.kind === 'down') {
          brush = startBrush(sample, defaultRadius);
          active = [{ x: brush.x, y: brush.y, radius: brush.radius }];
        } else if ((sample.kind === 'move' || sample.kind === 'up') && active && brush) {
          // 长距离样本按「本步应推进的笔尖行进量」拆成若干子步，避免快速运笔时笔尖滞后
          // （plan/09 P1-7）：坐标沿 上一笔尖位置 → 本样本位置 线性插值。
          const originX = brush.x, originY = brush.y;
          const distance = Math.sqrt((sample.x - originX) ** 2 + (sample.y - originY) ** 2);
          const substeps = Math.max(1, Math.min(8, Math.ceil(distance / Math.max(1, defaultRadius * 2))));
          for (let step = 1; step <= substeps; step++) {
            const t = step / substeps;
            active.push(advanceBrush(brush, {
              ...sample,
              x: originX + (sample.x - originX) * t,
              y: originY + (sample.y - originY) * t,
            }, defaultRadius));
          }
          if (sample.kind === 'up') {
            // 松笔后固定步数内仍可被水刷擦断，之后固化（plan/07 §4.4）。
            ctx.commands.enqueue<DrawStroke>('DrawStroke', { points: active, source: 'pointer', dryAfterSteps: dryAfterSteps });
            active = null;
            brush = null;
          }
        } else if (sample.kind === 'cancel') { active = null; brush = null; }
      }
      store.advance(ctx.step);
    },
  };
}

function dot(a: Point, b: Point): number { return a.x * b.x + a.y * b.y; }
function subtract(a: Point, b: Point): Point { return { x: a.x - b.x, y: a.y - b.y }; }
function lerp(a: StrokePoint, b: StrokePoint, t: number): StrokePoint {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, radius: a.radius + (b.radius - a.radius) * t };
}
function intervals(a: StrokePoint, b: StrokePoint, center: Point, radius: number): [number, number][] {
  const d = subtract(b, a);
  const f = subtract(a, center);
  const A = dot(d, d);
  if (A < 1e-10) return [];
  const relativeRadius = b.radius - a.radius;
  const combinedRadius = radius + a.radius;
  const qa = A - relativeRadius * relativeRadius;
  const qb = 2 * (dot(f, d) - combinedRadius * relativeRadius);
  const qc = dot(f, f) - combinedRadius * combinedRadius;
  const inside = (t: number) => (qa * t + qb) * t + qc < 0;
  const roots: number[] = [0, 1];
  if (Math.abs(qa) < 1e-10) {
    if (Math.abs(qb) > 1e-10) roots.push(-qc / qb);
  } else {
    const disc = qb * qb - 4 * qa * qc;
    if (disc >= 0) {
      const root = Math.sqrt(disc);
      roots.push((-qb - root) / (2 * qa), (-qb + root) / (2 * qa));
    }
  }
  const bounds = roots.filter(t => t >= 0 && t <= 1).sort((x, y) => x - y);
  const cuts: [number, number][] = [];
  for (let i = 1; i < bounds.length; i++) {
    const lo = bounds[i - 1], hi = bounds[i];
    if (hi - lo > 1e-6 && inside((lo + hi) / 2)) cuts.push([lo, hi]);
  }
  return cuts;
}
function sameFragments(a: StrokePoint[][], b: StrokePoint[][]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const left = a[i], right = b[i];
    if (left.length !== right.length) return false;
    for (let j = 0; j < left.length; j++) {
      if (left[j].x !== right[j].x || left[j].y !== right[j].y || left[j].radius !== right[j].radius) return false;
    }
  }
  return true;
}

function eraseFragment(fragment: StrokePoint[], path: readonly Point[], radius: number): StrokePoint[][] {
  if (fragment.length === 1) {
    const point = fragment[0];
    return path.some(center => dot(subtract(point, center), subtract(point, center)) < (radius + point.radius) ** 2) ? [] : [fragment];
  }
  const output: StrokePoint[][] = [];
  let current: StrokePoint[] = [];
  for (let i = 1; i < fragment.length; i++) {
    const a = fragment[i - 1], b = fragment[i];
    const cuts = path.flatMap(center => intervals(a, b, center, radius)).sort((x, y) => x[0] - y[0]);
    let cursor = 0;
    for (const [lo, hi] of cuts) {
      if (hi <= cursor) continue;
      if (lo > cursor + 1e-6) {
        if (!current.length) current.push(lerp(a, b, cursor));
        current.push(lerp(a, b, lo));
        if (current.length > 1) output.push(current);
      }
      current = [];
      cursor = Math.max(cursor, hi);
    }
    if (cursor < 1 - 1e-6) {
      if (!current.length) current.push(lerp(a, b, cursor));
      current.push({ ...b });
    }
  }
  if (current.length > 1) output.push(current);
  return output;
}

export function createWaterErosionPlugin(): EnginePlugin {
  let bind: (store: StrokeStore) => void;
  return {
    manifest: {
      id: 'water-erosion', version: '1.0.0',
      requires: [{ token: StrokeToken, range: '^1.0.0' }],
      provides: [{ token: ErosionToken, version: '1.0.0' }], after: ['stroke-geometry'],
    },
    register(ctx) {
      let store: StrokeStore;
      const erosion = {
        erase(path: readonly Point[], radius: number) {
          if (radius <= 0 || !path.length) return [];
          // 两阶段提交（plan/07 §4.3）：先在快照上算出新几何，确认有变化后再就地替换并统一发事件。
          // 这样物理与墨水插件都不会读到“改了一半”的笔画，也避免遍历中改动集合。
          const staged: { stroke: Stroke; fragments: StrokePoint[][] }[] = [];
          for (const stroke of store.strokes) {
            if (stroke.locked) continue;
            const fragments = stroke.fragments.flatMap(fragment => eraseFragment(fragment, path, radius));
            if (sameFragments(fragments, stroke.fragments)) continue;
            staged.push({ stroke, fragments });
          }
          const changed: number[] = [];
          for (const { stroke, fragments } of staged) {
            stroke.fragments = fragments;
            changed.push(stroke.id);
          }
          for (const { stroke, fragments } of staged) {
            ctx.events.emit('StrokeChanged', { strokeId: stroke.id, fragments: fragments.map(part => part.map(p => ({ ...p }))) });
          }
          return changed;
        },
      };
      ctx.provide(ErosionToken, erosion);
      const unsubscribe = ctx.commands.on<EraseStroke>('EraseStroke', command => erosion.erase(command.payload.path, command.payload.radius));
      ctx.resources.add(unsubscribe);
      bind = value => { store = value; };
    },
    init(ctx) { bind(ctx.get(StrokeToken)); },
  };
}
