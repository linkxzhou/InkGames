/** Display pose of one Matter body. z is layer depth, not physics. */

export interface BodyLink {
  readonly bodyId: number;
  readonly z: number;
  previousX: number;
  previousY: number;
  currentX: number;
  currentY: number;
}

export interface SampledPose {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

/** Linear blend. alpha 0 sticks to the previous step, alpha 1 to the current one. */
export function sampleBodyLink(link: BodyLink, alpha: number): SampledPose {
  const t = alpha;
  return {
    x: link.previousX + (link.currentX - link.previousX) * t,
    y: link.previousY + (link.currentY - link.previousY) * t,
    z: link.z,
  };
}
