import { InkRng, quantize, valueNoise } from './ink-noise';

export interface BrushPoint { readonly x: number; readonly y: number }

/** One bristle. Width is in the same pixels as the points. Alpha is coverage, not a baked gray. */
export interface BrushSegment {
  readonly x0: number;
  readonly y0: number;
  readonly x1: number;
  readonly y1: number;
  readonly width: number;
  readonly alpha: number;
}

export interface InkBrushOptions {
  /** inkEngine brushMode: 1 大笔 / 4 枯笔 / 6 飞白刷. */
  readonly mode: 'brush' | 'pen' | 'fly';
  /** inkEngine `baseBrushSize` multiplier (large ≈ 2). */
  readonly size: number;
  readonly effect: 'mix' | 'sharpen' | 'flyingWhite' | 'wet';
  readonly seed: number;
}

interface BrushTuning {
  readonly spring: number;
  readonly friction: number;
  readonly interp: number;
  readonly widthLo: number;
  readonly widthHi: number;
}

const TUNING: Record<InkBrushOptions['mode'], BrushTuning> = {
  // drawBrushStroke defaults when brushMode === 1 (spring 0.6, friction 0.5).
  // interp is 8 rather than the reference 15 so a stroke fits one frame on SwiftShader.
  brush: { spring: 0.6, friction: 0.5, interp: 8, widthLo: 20, widthHi: 24 },
  pen: { spring: 0.6, friction: 0.5, interp: 6, widthLo: 6, widthHi: 9 },
  fly: { spring: 0.6, friction: 0.5, interp: 6, widthLo: 10, widthHi: 14 },
};

/**
 * Spring-damped tip plus a few side bristles.
 * Structure follows inkEngine `drawBrushStroke` / `drawBranch` (NAME-MAP `_j58` / `_j56`):
 * vel += (target-pos)*spring; vel *= friction; substeps; main mark plus offset bristles.
 * Flying-white drops bristles as speed rises. This is visual ink, not collision geometry.
 */
export class InkBrush {
  private readonly rng: InkRng;
  private readonly tuning: BrushTuning;
  private readonly size: number;
  private readonly effect: InkBrushOptions['effect'];
  private x = 0;
  private y = 0;
  private velX = 0;
  private velY = 0;
  private ready = false;
  private speed = 0;
  private sizeNow = 1;
  private inkGray = 0;
  private frame = 0;
  private expected = 48;

  constructor(options: InkBrushOptions) {
    if (!(options.size > 0)) throw new Error('Brush size must be positive');
    this.rng = new InkRng(options.seed);
    this.tuning = TUNING[options.mode];
    this.size = options.size;
    this.effect = options.effect;
    this.sizeNow = this.rng.range(this.tuning.widthLo, this.tuning.widthHi) * options.size;
  }

  setExpectedLength(samples: number): void {
    this.expected = Math.max(8, samples);
  }

  begin(point: BrushPoint): BrushSegment[] {
    this.ready = true;
    this.x = point.x;
    this.y = point.y;
    this.velX = 0;
    this.velY = 0;
    this.frame = 0;
    return [];
  }

  sample(point: BrushPoint): BrushSegment[] {
    if (!this.ready) return this.begin(point);
    this.frame += 1;
    this.velX = (this.velX + (point.x - this.x) * this.tuning.spring) * this.tuning.friction;
    this.velY = (this.velY + (point.y - this.y) * this.tuning.spring) * this.tuning.friction;
    const stepSpeed = Math.sqrt(this.velX * this.velX + this.velY * this.velY);
    const speedScale = this.size <= 1 ? 0.9 : this.size <= 2 ? 1.3 : this.size <= 3 ? 2 : 3;
    this.speed = stepSpeed * speedScale;
    this.sizeNow = Math.max(1, this.sizeNow - 0.05);
    this.inkGray = this.inkGray * 0.6 + this.grayTarget(point) * 0.4;

    const segments: BrushSegment[] = [];
    const perp = stepSpeed > 0.001 ? { x: -this.velY / stepSpeed, y: this.velX / stepSpeed } : { x: 0, y: 1 };
    const hairs = this.tuning === TUNING.pen ? 5 : 8;
    for (let i = 0; i < this.tuning.interp; i++) {
      const prevX = this.x;
      const prevY = this.y;
      this.x += this.velX / this.tuning.interp;
      this.y += this.velY / this.tuning.interp;
      // sizeNow is the whole tip, not one sausage. Hairs share that radius the way drawBrushStroke splits branches.
      const radius = Math.max(1.5, this.markWidth() * 0.22);
      for (let hair = 0; hair < hairs; hair++) {
        if (!this.keepMark(hair === 0 ? 0.05 : 0.18)) continue;
        const across = ((hair / (hairs - 1)) * 2 - 1) + (this.rng.next() - 0.5) * 0.45;
        const offset = across * radius;
        const width = 0.7 + this.rng.next() * (this.tuning === TUNING.pen ? 1.4 : 2.4);
        const alpha = (0.18 + this.rng.next() * 0.42) * (1 - Math.min(0.65, this.inkGray / 255));
        this.push(segments, prevX + perp.x * offset, prevY + perp.y * offset, this.x + perp.x * offset, this.y + perp.y * offset, width, alpha);
      }
    }
    return segments;
  }

  private grayTarget(point: BrushPoint): number {
    const roll = this.rng.next();
    const alt = this.rng.range(20, 50);
    const fiber = valueNoise(point.x * 0.01, point.y * 0.01, 3);
    return roll > 0.3 ? fiber * 10 : alt;
  }

  private markWidth(): number {
    let width = this.sizeNow - this.speed;
    const fadeIn = this.frame < 5 ? 0.05 + (this.frame / 5) * 0.95 : 1;
    const tail = this.expected - 5;
    const fadeOut = this.frame > tail ? Math.max(0.05, 1 - (this.frame - tail) / 5) : 1;
    width *= fadeIn * fadeOut;
    const floor = this.tuning === TUNING.pen ? 0.6 : 1.2;
    return Math.max(floor, width);
  }

  /** Flying-white and the dry pen skip marks once the tip is moving. */
  private keepMark(threshold: number): boolean {
    const dry = this.effect === 'flyingWhite' || this.tuning === TUNING.pen || this.tuning === TUNING.fly;
    if (!dry) return this.rng.next() > threshold * 0.35;
    const drop = this.speed / (this.speed + 18);
    return this.rng.next() > threshold + drop * 0.55;
  }

  private push(out: BrushSegment[], x0: number, y0: number, x1: number, y1: number, width: number, alpha: number): void {
    out.push({
      x0: quantize(x0), y0: quantize(y0), x1: quantize(x1), y1: quantize(y1),
      width: quantize(Math.max(0.4, width)), alpha: quantize(Math.max(0.05, Math.min(0.85, alpha))),
    });
  }
}

export function strokeSegments(points: readonly BrushPoint[], options: InkBrushOptions): BrushSegment[] {
  if (points.length === 0) return [];
  const brush = new InkBrush(options);
  brush.setExpectedLength(points.length);
  const first = points[0];
  if (!first) return [];
  const out = brush.begin(first);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    if (point) out.push(...brush.sample(point));
  }
  return out;
}
