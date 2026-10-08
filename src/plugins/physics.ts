import type { EnginePlugin } from '../core/types';
import { PhysicsToken, SceneToken, StrokeToken, type Physics2D, type StrokePoint } from './tokens';

function closestPoint(a: StrokePoint, b: StrokePoint, x: number, y: number): { x: number; y: number; radius: number } {
  const dx = b.x - a.x, dy = b.y - a.y;
  const lengthSq = dx * dx + dy * dy;
  const t = lengthSq ? Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / lengthSq)) : 0;
  return { x: a.x + dx * t, y: a.y + dy * t, radius: a.radius + (b.radius - a.radius) * t };
}

export function createPhysicsPlugin(): EnginePlugin {
  let service: Physics2D;
  let bind: (store: import('./tokens').StrokeStore) => void;
  const cellSize = 64;
  const grid = new Map<string, number[]>();
  let dirty = true;
  const cell = (x: number, y: number) => `${x},${y}`;
  return {
    manifest: {
      id: 'physics2d', version: '1.0.0',
      requires: [{ token: SceneToken, range: '^1.0.0' }, { token: StrokeToken, range: '^1.0.0' }],
      provides: [{ token: PhysicsToken, version: '1.0.0' }], fixedPhase: 'physics',
    },
    register(ctx) {
      let store: import('./tokens').StrokeStore;
      service = {
        colliders: [],
        sync() {
          // 存快照副本而非 fragment 对象引用（plan/07 §3「严禁物理仍持有旧引用」）：
          // 水刷在下一步替换 fragments 时，物理不会读到已失效的端点。
          const next: Array<{ strokeId: number; a: StrokePoint; b: StrokePoint }> = [];
          for (const stroke of store.strokes) for (const fragment of stroke.fragments) {
            for (let i = 1; i < fragment.length; i++) {
              const a = fragment[i - 1], b = fragment[i];
              next.push({ strokeId: stroke.id, a: { ...a }, b: { ...b } });
            }
          }
          Object.assign(service, { colliders: next });
          dirty = false;
          grid.clear();
          next.forEach((segment, index) => {
            const radius = Math.max(segment.a.radius, segment.b.radius);
            const minX = Math.floor((Math.min(segment.a.x, segment.b.x) - radius) / cellSize);
            const maxX = Math.floor((Math.max(segment.a.x, segment.b.x) + radius) / cellSize);
            const minY = Math.floor((Math.min(segment.a.y, segment.b.y) - radius) / cellSize);
            const maxY = Math.floor((Math.max(segment.a.y, segment.b.y) + radius) / cellSize);
            for (let x = minX; x <= maxX; x++) for (let y = minY; y <= maxY; y++) {
              const key = cell(x, y);
              const entries = grid.get(key) ?? [];
              entries.push(index);
              grid.set(key, entries);
            }
          });
        },
      };
      ctx.provide(PhysicsToken, service);
      ctx.resources.add(ctx.commands.on('DrawStroke', () => { dirty = true; }));
      ctx.resources.add(ctx.commands.on('EraseStroke', () => { dirty = true; }));
      ctx.resources.add(ctx.events.on('StrokeCreated', () => { dirty = true; }));
      ctx.resources.add(ctx.events.on('StrokeChanged', () => { dirty = true; }));
      ctx.resources.add(ctx.events.on('StrokeCleared', () => { dirty = true; }));
      bind = value => { store = value; service.sync(); };
    },
    init(ctx) { bind(ctx.get(StrokeToken)); },
    fixedUpdate(ctx) {
      const scene = ctx.get(SceneToken);
      if (dirty) service.sync();
      for (const ball of scene.circles) {
        ball.vy += scene.gravity * ctx.dt;
        ball.x += ball.vx * ctx.dt;
        ball.y += ball.vy * ctx.dt;
        const candidates = new Set<number>();
        const minX = Math.floor((ball.x - ball.radius) / cellSize);
        const maxX = Math.floor((ball.x + ball.radius) / cellSize);
        const minY = Math.floor((ball.y - ball.radius) / cellSize);
        const maxY = Math.floor((ball.y + ball.radius) / cellSize);
        for (let x = minX; x <= maxX; x++) for (let y = minY; y <= maxY; y++) {
          for (const index of grid.get(cell(x, y)) ?? []) candidates.add(index);
        }
        for (const index of [...candidates].sort((a, b) => a - b)) {
          const collider = service.colliders[index];
          const reach = ball.radius + Math.max(collider.a.radius, collider.b.radius);
          if (ball.x < Math.min(collider.a.x, collider.b.x) - reach ||
              ball.x > Math.max(collider.a.x, collider.b.x) + reach ||
              ball.y < Math.min(collider.a.y, collider.b.y) - reach ||
              ball.y > Math.max(collider.a.y, collider.b.y) + reach) continue;
          const point = closestPoint(collider.a, collider.b, ball.x, ball.y);
          const dx = ball.x - point.x, dy = ball.y - point.y;
          const minDistance = ball.radius + point.radius;
          const distanceSq = dx * dx + dy * dy;
          if (distanceSq >= minDistance * minDistance) continue;
          const distance = Math.sqrt(distanceSq);
          const nx = distance > 1e-8 ? dx / distance : 0;
          const ny = distance > 1e-8 ? dy / distance : -1;
          ball.x += nx * (minDistance - distance);
          ball.y += ny * (minDistance - distance);
          const velocityAlongNormal = ball.vx * nx + ball.vy * ny;
          if (velocityAlongNormal < 0) {
            ball.vx -= (1 + ball.restitution) * velocityAlongNormal * nx;
            ball.vy -= (1 + ball.restitution) * velocityAlongNormal * ny;
          }
        }
      }
    },
  };
}
