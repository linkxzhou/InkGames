/**
 * Screen-up is (0, -1) because the playfield is Y-down.
 * cos(50°) is a constant so the walk test never calls Math.cos.
 */
export const SCREEN_UP_X = 0;
export const SCREEN_UP_Y = -1;
export const WALKABLE_DOT = 0.6427876096865393;

export type FootingKind = 'walk' | 'wall';

/** Unit normal pointing toward the actor. Walkable when it is within about 50° of screen-up. */
export function footingKind(nx: number, ny: number): FootingKind {
  const dot = nx * SCREEN_UP_X + ny * SCREEN_UP_Y;
  return dot >= WALKABLE_DOT ? 'walk' : 'wall';
}

/** Unit tangent of a walkable normal, pointing toward +x when it can. */
export function walkTangent(nx: number, ny: number): { readonly x: number; readonly y: number } {
  let tx = -ny;
  let ty = nx;
  if (tx < 0) {
    tx = -tx;
    ty = -ty;
  }
  return { x: tx, y: ty };
}
