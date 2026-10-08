import type { CircleBody, Scene2D, StrokePoint, StrokeStore } from './tokens';

export interface SceneJSON {
  format: 'inkgames.scene';
  version: 1;
  world: { width: number; height: number; gravity?: number };
  circles?: Omit<CircleBody, 'id'>[];
  strokes?: { points: StrokePoint[]; locked?: boolean }[];
  goal?: { x: number; y: number; radius: number };
  ball?: { x: number; y: number; radius: number };
}

function finite(value: unknown, name: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`Invalid ${name}`);
  return value;
}
export function parseSceneJSON(input: unknown): SceneJSON {
  const value = typeof input === 'string' ? JSON.parse(input) as unknown : input;
  if (!value || typeof value !== 'object') throw new Error('Scene must be an object');
  const scene = value as Partial<SceneJSON>;
  if (scene.format !== 'inkgames.scene' || scene.version !== 1) throw new Error('Unsupported scene format/version');
  if (!scene.world || typeof scene.world !== 'object') throw new Error('Missing scene world');
  finite(scene.world.width, 'world.width'); finite(scene.world.height, 'world.height');
  if (scene.world.width <= 0 || scene.world.height <= 0) throw new Error('World dimensions must be positive');
  if (scene.world.gravity !== undefined) finite(scene.world.gravity, 'world.gravity');
  if (scene.circles !== undefined && !Array.isArray(scene.circles)) throw new Error('circles must be an array');
  if (scene.strokes !== undefined && !Array.isArray(scene.strokes)) throw new Error('strokes must be an array');
  if ((scene.circles?.length ?? 0) > 500 || (scene.strokes?.length ?? 0) > 500) throw new Error('Scene exceeds entity limit');
  for (const [i, circle] of (scene.circles ?? []).entries()) {
    if (!circle || typeof circle !== 'object') throw new Error(`Invalid circles[${i}]`);
    for (const property of ['x', 'y', 'radius', 'vx', 'vy', 'restitution'] as const) finite(circle[property], `circles[${i}].${property}`);
    if (circle.radius <= 0) throw new Error(`Invalid circles[${i}].radius`);
  }
  for (const [i, stroke] of (scene.strokes ?? []).entries()) {
    if (!Array.isArray(stroke?.points) || stroke.points.length < 2 || stroke.points.length > 4096) throw new Error(`Invalid strokes[${i}].points`);
    for (const [j, point] of stroke.points.entries()) {
      for (const property of ['x','y','radius'] as const) finite(point[property], `strokes[${i}].points[${j}].${property}`);
      if (point.radius <= 0) throw new Error(`Invalid stroke radius at ${i}:${j}`);
    }
  }
  for (const name of ['goal','ball'] as const) {
    const point = scene[name];
    if (point !== undefined) {
      for (const property of ['x','y','radius'] as const) finite(point[property], `${name}.${property}`);
      if (point.radius <= 0) throw new Error(`Invalid ${name}.radius`);
    }
  }
  return scene as SceneJSON;
}

export function loadSceneJSON(scene: Scene2D, strokes: StrokeStore, input: unknown): SceneJSON {
  const data = parseSceneJSON(input);
  scene.reset(data.world.width, data.world.height);
  strokes.clear();
  scene.gravity = data.world.gravity ?? 700;
  for (const circle of data.circles ?? []) scene.addCircle(circle);
  if (data.ball) scene.addCircle({ ...data.ball, vx: 0, vy: 0, restitution: 0 });
  if (data.goal) scene.addMarker({ ...data.goal, id: 'goal', kind: 'goal' });
  for (const stroke of data.strokes ?? []) strokes.create(stroke.points, stroke.locked);
  return data;
}
