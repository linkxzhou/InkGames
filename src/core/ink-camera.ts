/**
 * inkEngine's layered camera (initEasyCam / drawLayersWithBlur).
 * fov is π/3 and the default distance is height / (2 * tan(fov/2)). tan(30°) = 1/√3, so the
 * distance stays exact without Math.tan. A layer at depth z (positive toward the camera, as in p5)
 * is drawn at scale distance / (distance − z). z = 0 is 1:1, which is where gameplay lives.
 * Ported with attribution under the owner-stated inkField authorization (THIRD_PARTY_NOTICES.md).
 */

const TAN_HALF_FOV = 1 / Math.sqrt(3);

/** EasyCam's default distance for a canvas of this height. */
export function inkCameraDistance(height: number): number {
  return height / (2 * TAN_HALF_FOV);
}

/** How large a sprite at depth z appears. z = 0 → 1. */
export function inkLayerScale(height: number, z: number): number {
  const distance = inkCameraDistance(height);
  return distance / (distance - z);
}

/** The four depths inkEngine assigns: painting, cursor, future path, text. */
export const INK_LAYER_Z = {
  /** Far scenery, behind the sheet. */
  far: -80,
  /** Paper, ground, water, bridges: screen position equals world position when the camera is centered. */
  play: 0,
  /** Figure, held props, horse, boat, banner, projectiles. */
  actor: 40,
  /** inkEngine's text overlay. */
  overlay: 120,
} as const;
