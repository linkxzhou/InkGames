/** CPU bake of the terrain ink field. The GPU seep pass reads this; vitest never creates a context. */

export const SEEP_WIDTH = 512;
export const SEEP_HEIGHT = 256;
export const SEEP_STAMP_LIMIT = 8;

export interface TerrainPoint {
  readonly x: number;
  readonly y: number;
}

export interface TerrainBounds {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

export interface InkStamp {
  readonly u: number;
  readonly v: number;
  readonly ink: number;
  readonly water: number;
  readonly radius: number;
}

export function terrainBounds(points: readonly TerrainPoint[]): TerrainBounds {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const point of points) {
    if (point.x < minX) minX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.x > maxX) maxX = point.x;
    if (point.y > maxY) maxY = point.y;
  }
  if (!(maxX > minX)) maxX = minX + 1;
  if (!(maxY > minY)) maxY = minY + 1;
  return { minX, minY, maxX, maxY };
}

/** RGBA8. R is dryness (255 = bare paper), B is ground height, G/A stay 0 / 255. */
export function bakeHeightField(points: readonly TerrainPoint[], width = SEEP_WIDTH, height = SEEP_HEIGHT): Uint8Array {
  const pixels = new Uint8Array(width * height * 4);
  const bounds = terrainBounds(points);
  const spanX = bounds.maxX - bounds.minX;
  const spanY = bounds.maxY - bounds.minY;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const worldX = bounds.minX + ((x + 0.5) / width) * spanX;
      const groundY = terrainHeightAt(points, worldX);
      const packed = Math.max(0, Math.min(255, Math.round(((groundY - bounds.minY) / spanY) * 255)));
      const i = (y * width + x) * 4;
      pixels[i] = 255;
      pixels[i + 1] = 0;
      pixels[i + 2] = packed;
      pixels[i + 3] = 255;
    }
  }
  return pixels;
}

export function hashBytes(data: Uint8Array): number {
  let hash = 2166136261;
  for (let i = 0; i < data.length; i++) {
    hash ^= data[i] ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function contactsToStamps(
  contacts: readonly TerrainPoint[],
  bounds: TerrainBounds,
  limit = SEEP_STAMP_LIMIT,
): InkStamp[] {
  const spanX = bounds.maxX - bounds.minX;
  const spanY = bounds.maxY - bounds.minY;
  const stamps: InkStamp[] = [];
  const count = Math.min(limit, contacts.length);
  for (let i = 0; i < count; i++) {
    const contact = contacts[i];
    if (!contact) continue;
    const u = (contact.x - bounds.minX) / spanX;
    const v = (contact.y - bounds.minY) / spanY;
    stamps.push({
      u: clamp01(u),
      v: clamp01(v),
      ink: 0.85,
      water: 0.45,
      radius: 0.035,
    });
  }
  return stamps;
}

export function terrainHeightAt(points: readonly TerrainPoint[], x: number): number {
  if (points.length === 0) return 0;
  const first = points[0];
  if (!first || points.length === 1) return first?.y ?? 0;
  let chosen = first;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (!a || !b) continue;
    const left = Math.min(a.x, b.x);
    const right = Math.max(a.x, b.x);
    if (x < left || x > right) continue;
    const span = b.x - a.x;
    const t = span === 0 ? 0 : (x - a.x) / span;
    return a.y + (b.y - a.y) * t;
  }
  let best = Infinity;
  for (const point of points) {
    const distance = Math.abs(point.x - x);
    if (distance < best) {
      best = distance;
      chosen = point;
    }
  }
  return chosen.y;
}

function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}
