import { inkColorRgb } from './ink-palette';
import { INK_COLOR_NAMES, type InkColorName } from './ink-palette';
import { inkCos, inkSin, lerp, P5Noise, P5Random, pow06, remap, round2, TWO_PI } from './ink-random';

/**
 * inkEngine brush, ported frame for frame.
 *
 * Source: thirdparty/inkEngine/ink-engine.js — mousePressed (pen-down setup per brush mode),
 * draw() (ink gray, ink running out, pressure ladder, tip offset), drawBrushStroke/_j58,
 * drawBranch/_j56, drawSprayDots/_j57, drawDryBrush/_j59, drawMarker/_j61, drawGothic/_j64,
 * drawFlyBrush/_j65 and buildFlyBranchConfig/_j62, plus the BRANCH_* and MARKER_LINES tables.
 * Ported with attribution under the owner-stated inkField authorization (THIRD_PARTY_NOTICES.md).
 *
 * The engine only produces draw ops (lines, dots, outlined rects in the wet buffer's gray) and says
 * when the feedback, countdown and commit passes run; InkSurface turns those into GPU work.
 * Random draws follow the original order with a numerically p5-compatible LCG and noise, so a stroke seeded
 * like inkEngine takes the same decisions. Angles use polynomial sin/cos, never Math.sin/atan2.
 * This is visual ink only; collision geometry lives in InkWorld.
 */

export type InkBrushMode = 'brush' | 'marker' | 'gothic' | 'pen' | 'dots' | 'fly' | 'brushSP';
export type InkSizeName =
  | 'ultra-small' | 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' | 'extra-extra-large' | 'huge';
export type InkEffect = 'mix' | 'sharpen' | 'flyingWhite' | 'wet' | 'effect4' | 'hair';
export type InkBlend = 'mix' | 'multiply' | 'darken' | 'spectral';

/** inkEngine/index.html menu values. */
export const INK_BRUSH_MODES: Readonly<Record<InkBrushMode, number>> = {
  brush: 1, marker: 2, gothic: 3, pen: 4, dots: 5, fly: 6, brushSP: 7,
};
export const INK_SIZES: Readonly<Record<InkSizeName, number>> = {
  'ultra-small': 0.1, 'extra-small': 0.25, small: 0.5, medium: 1, large: 2,
  'extra-large': 3, 'extra-extra-large': 5, huge: 10,
};
export const INK_EFFECTS: Readonly<Record<InkEffect, number>> = {
  mix: 0, sharpen: 1, flyingWhite: 2, wet: 3, effect4: 4, hair: 5,
};
export const INK_BLENDS: Readonly<Record<InkBlend, number>> = { mix: 0, multiply: 1, darken: 2, spectral: 3 };

/** What the inkEngine/index.html panel sets before a stroke. */
export interface InkBrushSettings {
  readonly mode: InkBrushMode;
  readonly size: InkSizeName | number;
  readonly effect: InkEffect;
  readonly blend: InkBlend;
}

/** A pointer sample. pressure 0..1 behaves like a stylus; omit it for a mouse. */
export interface InkPoint {
  readonly x: number;
  readonly y: number;
  readonly pressure?: number;
}

/**
 * One primitive in the wet buffer, coordinates in sheet pixels, colour 0..255.
 * line: x0,y0 → x1,y1, round caps, width w.
 * dot: filled circle at x0,y0, diameter w (p5 ellipse / point).
 * rect: centre x0,y0, local x axis (x1,y1), size w×h, filled white and outlined with the colour at width lw
 *   (drawMarker inherits p5's default white fill, so each stamp clears what is under it).
 */
export interface InkDrawOp {
  readonly kind: 'line' | 'dot' | 'rect';
  readonly x0: number;
  readonly y0: number;
  readonly x1: number;
  readonly y1: number;
  readonly w: number;
  readonly h: number;
  readonly lw: number;
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

/** What the frame asks the GPU to do after the ops are drawn. */
export interface InkFrameStep {
  readonly ops: readonly InkDrawOp[];
  /** Feedback force for this frame, undefined when no feedback pass runs. */
  readonly force: number | undefined;
  readonly commit: boolean;
}

/** Uniforms the ported shaders read; values are the engine globals of the same name. */
export interface InkShaderState {
  readonly brushMode: number;
  readonly baseBrushSize: number;
  readonly useSharpen: number;
  readonly effect3Brightness: number;
  readonly indiffusionStrength: number;
  readonly brushColorMode: number;
  readonly brushCategory: number;
  readonly mouseCount: number;
  readonly mouseCountAccumulated: number;
  readonly strokeSeed: number;
  readonly whiteMaxOpacity: number;
  readonly hueShift: number;
  readonly satShift: number;
  readonly briShift: number;
  readonly keyBlendMode: number;
  readonly useSpectralMix: number;
  readonly customBrushColor: readonly [number, number, number];
}

interface Vec { x: number; y: number }

interface SprayParticle {
  readonly id: number;
  readonly location: Vec;
  readonly prevLocation: Vec;
  radius: number;
  r: number;
  g: number;
  b: number;
  xOff: number;
  yOff: number;
  readonly sideDirection: number;
}

interface FlyBranch {
  readonly perpOffset: number;
  readonly randThreshold: number;
  readonly sizeMultiplier: number;
  readonly speedMultiplier: number;
  readonly startOffset: number;
  readonly endDistanceOffset: number;
  readonly brushSpeedMultiplier: number;
  readonly widthVariationFactor: number;
  readonly offsetVariationFactor: number;
}

interface FlyItem {
  readonly showMainBrush: number;
  readonly flyWhiteRandoms: readonly number[];
  readonly flyWhiteOffsetNoises: readonly number[];
  readonly flyWhiteWidthNoises: readonly number[];
}

const BRANCH_FLIP_TABLE: readonly { readonly x: boolean; readonly y: boolean }[] = [
  { x: false, y: false }, { x: true, y: false }, { x: false, y: true }, { x: true, y: true },
];

const BRANCH_OFFSETS_5: readonly { readonly base: 1 | 2 | 3; readonly sx: number; readonly sy: number; readonly threshold: number }[] = [
  { base: 2, sx: 1, sy: 1, threshold: 0.05 },
  { base: 1, sx: -1, sy: -1, threshold: 0.1 },
  { base: 3, sx: -1, sy: -1, threshold: 0.12 },
  { base: 1, sx: 1, sy: 1, threshold: 0.08 },
  { base: 3, sx: 1, sy: 1, threshold: 0.2 },
];

const QUARTER = TWO_PI / 8;
const TWELFTH = TWO_PI / 12;
const BRANCH_OFFSETS_8 = [0.065, 0.1, 0.125, 0.15, 0.1, 0.125, 0.15, 0.18]
  .map((threshold, i) => ({ angle: i * QUARTER, radius: 1.6, threshold, jitter: 9 + i }));
const BRANCH_OFFSETS_12 = [0.07, 0.08, 0.1, 0.13, 0.16, 0.1, 0.13, 0.16, 0.19, 0.13, 0.16, 0.19]
  .map((threshold, i) => ({ angle: i * TWELFTH, radius: 1, threshold, jitter: 17 + i }));

const MARKER_LINES: readonly { readonly perp: number; readonly threshold: number }[] = [
  { perp: 1.5, threshold: 0.7 }, { perp: -1.5, threshold: 0.75 }, { perp: 3, threshold: 0.8 },
  { perp: -3, threshold: 0.85 }, { perp: 5, threshold: 0.9 },
];

const SIZE_LADDER = [0.1, 0.25, 0.5, 1, 2, 3, 5, 10];

/** The tip lands 10px up-left of the pointer (inkEngine `tipOffset`), except for the gothic brush. */
export const INK_TIP_OFFSET = -10;

function clamp(value: number, lo: number, hi: number): number {
  return value < lo ? lo : value > hi ? hi : value;
}

function trunc(value: number): number {
  return value < 0 ? Math.ceil(value) : Math.floor(value);
}

export function resolveInkSize(size: InkSizeName | number): number {
  return typeof size === 'number' ? size : INK_SIZES[size];
}

export class InkBrushEngine {
  private readonly rng = new P5Random(0);
  private readonly perlin = new P5Noise(0);
  private ops: InkDrawOp[] = [];

  // Panel state.
  private brushMode = 1;
  private baseBrushSize = 2;
  private pressureBaseBrushSize: number | null = 2;
  private useSharpen = 0;
  private brushColorMode = 0;
  private readonly customBrushColor: [number, number, number] = [26, 26, 26];
  private whiteBrushMode = false;
  private keyBlendMode = 0;
  private useSpectralMix = false;

  // Stroke globals. Values before the first stroke are what warmUpStroke leaves behind (a brush-mode press).
  private strokeSeed = 1234567890;
  private strokeFrame = 0;
  private mouseCountStart = 0;
  private inkGray = 0;
  private initialSize = 0;
  private spraySize = 6;
  private randStep = 0.05;
  private maxUpdates = 30;
  private interpSteps = 15;
  private step2 = 5;
  private spring = 0.6;
  private friction = 0.5;
  private expectedStrokeLength = 400;
  private brushSize = 0;
  private readonly brushSizeMin = 2;
  private sizeNow = 20;
  private strokeWidth = 0;
  private lineWidth = 0;
  private smoothedWidth = 0;
  private velX = 0;
  private velY = 0;
  private speed = 0;
  private x = 0;
  private y = 0;
  private springInitialized = false;
  private prevTipX = 0;
  private prevTipY = 0;
  private isDrawing = false;
  private isReleasing = false;
  private countdownFrame = 0;
  private whiteMaxOpacity = 0.95;
  private hueShift = 0;
  private satShift = 0;
  private briShift = 0;
  private explodeStart = 0;
  private explodeEnd = 0;
  private targetmainStrokeDir = 0;
  private brushDir = 0;
  private indiffusionStrength = 0.45;
  private effect3Brightness = 0.2;
  private shapeType = 0;
  private ctlNoiseByFrame = 1;
  private interpolationOffset = 0;
  private pathRotation = 0;
  private penSketchNoiseBase = 0.5;
  private brushModeSP = false;
  private penPressure = 0;
  private stylusDetected = false;
  private readonly pressureHistory: [number, number, number] = [0, 0, 0];
  private strokeStartBaseBrushSize = 2;
  private markerAxis: Vec = { x: 1, y: 0 };
  private markerMove: Vec = { x: 1, y: 0 };
  private flyMove: Vec = { x: 1, y: 0 };
  private flyConfigs = new Map<string, readonly FlyBranch[]>();
  private flyWeights = new Map<string, number>();
  private sprayParticles: SprayParticle[] = [];
  private sprayParticleCounter = 0;

  /** setBrush(): mode/size/effect/blend for the next stroke. */
  configure(settings: InkBrushSettings): void {
    this.brushMode = INK_BRUSH_MODES[settings.mode];
    this.baseBrushSize = resolveInkSize(settings.size);
    this.pressureBaseBrushSize = this.baseBrushSize;
    this.useSharpen = INK_EFFECTS[settings.effect];
    if (settings.blend === 'spectral') this.useSpectralMix = true;
    else {
      this.keyBlendMode = INK_BLENDS[settings.blend];
      this.useSpectralMix = false;
    }
  }

  /** setColor(): a palette name, or an RGB triple (custom colour 33). */
  setColor(color: InkColorName | readonly [number, number, number]): void {
    if (typeof color === 'string') {
      this.whiteBrushMode = color === 'white';
      const id = INK_COLOR_NAMES.indexOf(color);
      this.brushColorMode = id < 0 ? 0 : id;
      const rgb = inkColorRgb(this.brushColorMode);
      this.customBrushColor[0] = rgb[0];
      this.customBrushColor[1] = rgb[1];
      this.customBrushColor[2] = rgb[2];
      return;
    }
    this.customBrushColor[0] = color[0];
    this.customBrushColor[1] = color[1];
    this.customBrushColor[2] = color[2];
    this.brushColorMode = 33;
    this.whiteBrushMode = false;
  }

  get mode(): number { return this.brushMode; }
  get effect(): number { return this.useSharpen; }
  get pendingCommit(): boolean { return this.isDrawing || this.isReleasing; }

  shaderState(): InkShaderState {
    return {
      brushMode: this.brushMode,
      baseBrushSize: this.baseBrushSize,
      useSharpen: this.useSharpen,
      effect3Brightness: this.effect3Brightness,
      indiffusionStrength: this.indiffusionStrength,
      brushColorMode: this.brushColorMode,
      brushCategory: this.brushColorMode === 1 ? 1 : 0,
      mouseCount: (this.strokeFrame + this.mouseCountStart) % 40,
      mouseCountAccumulated: this.strokeFrame + this.mouseCountStart,
      strokeSeed: this.strokeSeed,
      whiteMaxOpacity: this.whiteMaxOpacity,
      hueShift: this.hueShift,
      satShift: this.satShift,
      briShift: this.briShift,
      keyBlendMode: this.keyBlendMode,
      useSpectralMix: this.useSpectralMix ? 1 : 0,
      customBrushColor: [this.customBrushColor[0], this.customBrushColor[1], this.customBrushColor[2]],
    };
  }

  /** Pointer pressure as the API applies it before the event (median of the last three samples). */
  applyPressure(pressure: number | undefined): void {
    if (pressure === undefined) return;
    this.stylusDetected = true;
    this.penPressure = this.pressureMedian3(pressure);
  }

  /**
   * mousePressed(). `rngSeed` stands in for the p5 random state at press time; the inkEngine host
   * calls `p.randomSeed(rngSeed)` right before the stroke so both sides draw the same stroke seed.
   */
  press(cursorX: number, cursorY: number, rngSeed: number): void {
    const rng = this.rng;
    this.pressureHistory[0] = this.pressureHistory[1] = this.pressureHistory[2] = 0;
    rng.seed(rngSeed);
    this.strokeSeed = trunc(rng.random(100000000, 999999999));
    rng.seed(this.strokeSeed);
    this.perlin.seed(this.strokeSeed);
    this.mouseCountStart = this.strokeFrame;
    this.inkGray = 0;
    this.strokeFrame = 0;
    if (this.pressureBaseBrushSize !== null) this.baseBrushSize = this.pressureBaseBrushSize;
    this.sprayParticles = [];
    this.sprayParticleCounter = 0;
    this.whiteMaxOpacity = rng.random(0.5, 0.99);
    this.hueShift = rng.random(-0.02, 0.02);
    this.satShift = rng.random(-0.05, 0.05);
    this.briShift = rng.random(-0.05, 0.05);
    this.explodeStart = rng.random(0, 1) > 0.8 ? 1 : 0;
    this.explodeEnd = rng.random(0, 1) > 0.8 ? 1 : 0;
    // targetflyBrushType: drawn, then overwritten per sub-step inside drawBrushStroke.
    rng.random(-1, 3);
    this.targetmainStrokeDir = Math.max(0, trunc(rng.random(-1, 3)));
    this.brushDir = trunc(rng.random(0, 4));
    rng.random(0.4, 0.5);
    if (this.brushMode === 3 || this.brushMode === 4) rng.random(0.2, 0.3);
    else if (this.brushMode === 5) rng.random(0.25, 0.35);
    // The original randomises then overrides this; the draws above are kept so later values line up.
    this.indiffusionStrength = 0.45;
    if (this.baseBrushSize <= 1.5) this.explodeStart = this.explodeEnd = 0;
    this.effect3Brightness = rng.random(0.5, 0.9);
    trunc(rng.random(0, 4));
    this.shapeType = trunc(rng.random(0, 4));
    // max(noise(0), 0, 1, 0.2, 0.8) is always 1 because noise never exceeds 1.
    this.ctlNoiseByFrame = Math.max(this.perlin.noise(0), 0, 1, 0.2, 0.8);
    this.interpolationOffset = trunc(rng.random(-2, 4));
    rng.random(0, 1);
    this.pathRotation = 0;
    const base = this.baseBrushSize;
    switch (this.brushMode) {
      case 1:
        this.initialSize = round2(rng.random(20, 24) * base);
        this.spraySize = base > 5 ? 1.5 * base : 3 * base;
        this.randStep = 0.05;
        this.maxUpdates = 30;
        this.interpSteps = 15;
        this.step2 = 5;
        this.spring = 0.6;
        this.friction = 0.5;
        break;
      case 2:
        this.initialSize = round2(rng.random(20, 24) * base);
        this.spraySize = base;
        this.randStep = 0.05;
        this.maxUpdates = 10;
        this.interpSteps = 10;
        this.step2 = 10;
        this.spring = 0.3;
        this.friction = 0.5;
        break;
      case 3:
        this.initialSize = rng.random(2, 4) * base;
        this.spraySize = 10 * base;
        this.step2 = 3;
        this.randStep = 0.05;
        this.maxUpdates = 10;
        break;
      case 4:
        this.initialSize = rng.random(6, 9) * base;
        this.spraySize = base;
        this.step2 = 5;
        this.randStep = 0.05;
        this.maxUpdates = 10;
        this.penSketchNoiseBase = this.perlin.noise(cursorX, cursorY);
        rng.random(0, 1);
        this.spring = 0.6;
        this.friction = 0.5;
        break;
      case 5:
      case 6:
        this.initialSize = rng.random(10, 14) * base;
        this.spraySize = 10;
        this.step2 = 1;
        this.randStep = 0.05;
        this.maxUpdates = 10;
        this.interpSteps = 10;
        this.spring = 0.6;
        this.friction = 0.5;
        break;
      default:
        // brushSP keeps whatever interp/spring the previous stroke left, as in the original.
        this.initialSize = rng.random(30, 40);
        this.maxUpdates = 10;
        this.randStep = 0.05;
        break;
    }
    if (this.useSharpen >= 3.5) this.maxUpdates = 20;
    this.expectedStrokeLength = 400;
    this.brushSize = this.initialSize;
    this.sizeNow = this.brushSize;
    this.strokeWidth = this.sizeNow;
    this.strokeStartBaseBrushSize = this.baseBrushSize;
    if (this.pressureBaseBrushSize === null) this.pressureBaseBrushSize = this.baseBrushSize;
    this.springInitialized = false;
    this.x = cursorX;
    this.y = cursorY;
    this.velX = 0;
    this.velY = 0;
    this.speed = 0;
    this.lineWidth = 0;
    this.smoothedWidth = 0;
    this.markerAxis = { x: 1, y: 0 };
    this.markerMove = { x: 1, y: 0 };
    this.flyConfigs = new Map();
    this.flyWeights = new Map();
    this.flyMove = { x: 1, y: 0 };
    this.prevTipX = cursorX;
    this.prevTipY = cursorY;
    this.isDrawing = true;
    this.isReleasing = false;
    this.countdownFrame = 0;
    const drawingSeed = trunc(rng.random(1000000, 9999999));
    this.brushModeSP = this.brushMode === 7;
    rng.seed(drawingSeed);
    this.perlin.seed(drawingSeed);
  }

  /** mouseReleased(). */
  release(): void {
    if (!this.isDrawing) return;
    if (this.sprayParticles.length) this.sprayParticles = this.sprayParticles.filter(p => p.radius > 0);
    if (!this.isReleasing) {
      this.isReleasing = true;
      this.countdownFrame = 0;
    }
    if (this.stylusDetected) this.penPressure = 0;
  }

  /** The commit pass ran; clear the stroke flags like commitStroke(). */
  committed(): void {
    this.isDrawing = false;
    this.isReleasing = false;
    this.countdownFrame = 0;
  }

  /**
   * One draw() frame. `down` is the pointer state, cursor/pmouse are pointer positions
   * (pmouse is the previous pointer event, as p5's pmouseX).
   */
  frame(down: boolean, cursorX: number, cursorY: number, pmouseX: number, pmouseY: number): InkFrameStep {
    this.ops = [];
    const mode = this.brushMode;
    const free = mode === 3 || mode === 4 || mode === 5;
    const canDraw = free ? down : down && this.brushSize > 0;
    if (canDraw && this.isDrawing) this.drawFrame(cursorX, cursorY, pmouseX, pmouseY);
    let force: number | undefined;
    let commit = false;
    if (canDraw && this.isDrawing) {
      force = mode === 4 ? 0.4 : 1;
    } else if (this.isReleasing && this.countdownFrame < this.maxUpdates) {
      force = remap(this.countdownFrame, 0, this.maxUpdates, 1, 0);
      if (mode === 4) force *= 0.4;
      this.countdownFrame++;
    } else if (this.isReleasing) {
      commit = true;
    }
    return { ops: this.ops, force, commit };
  }

  private drawFrame(cursorX: number, cursorY: number, pmouseX: number, pmouseY: number): void {
    const rng = this.rng;
    const mode = this.brushMode;
    this.strokeFrame++;
    rng.seed(this.strokeSeed + this.strokeFrame * 100000000);
    if (mode === 3) {
      const roll = rng.random(0, 1);
      const alt = rng.random(150, 250);
      const target = roll > 0.1 ? this.perlin.noise(cursorX * 0.01, cursorY * 0.01) * 150 : alt;
      this.inkGray = this.inkGray * 0.3 + target * 0.7;
    } else {
      const roll = rng.random(0, 1);
      const alt = rng.random(20, 50);
      const target = roll > 0.3 ? this.perlin.noise(cursorX * 0.01, cursorY * 0.01) * 10 : alt;
      this.inkGray = this.inkGray * 0.6 + target * 0.4;
    }
    this.brushSize = Math.max(1, this.brushSize - this.randStep);
    this.sizeNow = this.brushSize;
    if (this.strokeFrame >= 8) this.pressureLadder();
    if (this.brushSize <= this.brushSizeMin && !this.isReleasing && mode !== 3 && mode !== 4 && mode !== 5) {
      this.isReleasing = true;
      this.countdownFrame = 0;
    }
    let tipX = cursorX;
    let tipY = cursorY;
    const pathAngle = remap(this.perlin.noise(tipX * 0.01, tipY * 0.01), 0, 1, -this.pathRotation, this.pathRotation);
    if (mode !== 3) {
      rng.seed(this.strokeSeed + this.strokeFrame * 10000000);
      const jitterX = rng.random(this.pathRotation * 0.5, this.pathRotation);
      const jitterY = rng.random(this.pathRotation * 0.5, this.pathRotation);
      tipX += jitterX * inkCos(pathAngle) + INK_TIP_OFFSET;
      tipY += jitterY * inkSin(pathAngle) + INK_TIP_OFFSET;
    }
    const moved = Math.hypot(tipX - this.prevTipX, tipY - this.prevTipY);
    if (moved > 1 && this.strokeFrame < this.expectedStrokeLength) {
      if (mode === 4) this.drawDryBrush(tipX, tipY, this.prevTipX, this.prevTipY);
      if (mode === 1 || mode === 7) {
        const sprayRoll = rng.random(0, 1);
        if (sprayRoll > 0.9 && !this.whiteBrushMode && !this.brushModeSP && this.baseBrushSize >= 1.5) {
          if (this.strokeFrame > 5 && this.baseBrushSize < 6) this.drawSprayDots(tipX, tipY, pmouseX, pmouseY);
        }
        this.drawBrushStroke(tipX, tipY, this.targetmainStrokeDir);
      }
      if (mode === 2) {
        rng.random(0, 1);
        this.drawMarker(tipX, tipY);
      }
      if (mode === 3) {
        this.drawGothic(tipX, tipY, this.prevTipX, this.prevTipY);
        if (rng.random(0, 1) > 0.4) this.drawSprayDots(tipX, tipY, pmouseX, pmouseY);
      }
      if (mode === 5 && rng.random(0, 1) > 0.05) this.drawSprayDots(tipX, tipY, pmouseX, pmouseY);
      if (mode === 6) this.drawFlyBrush(tipX, tipY);
    }
    this.prevTipX = tipX;
    this.prevTipY = tipY;
  }

  private pressureLadder(): void {
    const pressure = this.penPressure;
    const previous = this.baseBrushSize;
    if (pressure >= 0.3) {
      const strokeBase = this.pressureBaseBrushSize || this.strokeStartBaseBrushSize || 1;
      let index = SIZE_LADDER.indexOf(strokeBase);
      if (index === -1) {
        index = SIZE_LADDER.findIndex(size => size >= strokeBase);
        if (index === -1) index = SIZE_LADDER.length - 1;
      }
      const boost = pressure < 0.5 ? 1 : pressure < 0.7 ? 2 : 3;
      this.baseBrushSize = SIZE_LADDER[Math.min(index + boost, SIZE_LADDER.length - 1)] ?? strokeBase;
    } else if (pressure >= 0) {
      this.baseBrushSize = this.pressureBaseBrushSize || this.strokeStartBaseBrushSize || this.baseBrushSize;
    }
    if (this.baseBrushSize !== previous && previous > 0) {
      const factor = pow06(this.baseBrushSize / previous);
      this.brushSize *= factor;
      this.initialSize *= factor;
    }
  }

  private pressureMedian3(value: number): number {
    const h = this.pressureHistory;
    h[0] = h[1];
    h[1] = h[2];
    h[2] = value;
    return Math.max(Math.min(h[0], h[1]), Math.min(Math.max(h[0], h[1]), h[2]));
  }

  private effBaseSize(): number {
    return this.pressureBaseBrushSize ?? this.baseBrushSize;
  }

  private inkJitter(value: number): number {
    return this.brushColorMode === 0 ? value + this.rng.random(10, 40) : value + this.rng.random(30, 80);
  }

  /** setInkStroke / setInkFill: the wet buffer only ever holds gray. */
  private inkGrayOf(inkValue: number, alt: number): number {
    if (this.brushColorMode === 0) return inkValue;
    if (this.brushColorMode === 1) return 150;
    return alt;
  }

  private line(x0: number, y0: number, x1: number, y1: number, w: number, gray: number, a: number): void {
    const g = clamp(gray, 0, 255);
    this.ops.push({ kind: 'line', x0, y0, x1, y1, w, h: 0, lw: 0, r: g, g, b: g, a: clamp(a, 0, 255) });
  }

  private lineRgb(x0: number, y0: number, x1: number, y1: number, w: number, r: number, g: number, b: number, a: number): void {
    this.ops.push({ kind: 'line', x0, y0, x1, y1, w, h: 0, lw: 0, r: clamp(r, 0, 255), g: clamp(g, 0, 255), b: clamp(b, 0, 255), a: clamp(a, 0, 255) });
  }

  private dot(x: number, y: number, d: number, gray: number, a: number): void {
    const g = clamp(gray, 0, 255);
    this.ops.push({ kind: 'dot', x0: x, y0: y, x1: 0, y1: 0, w: d, h: 0, lw: 0, r: g, g, b: g, a: clamp(a, 0, 255) });
  }

  private drawBranch(ox: number, oy: number, x: number, y: number, curX: number, curY: number,
    ex: number, ey: number, half: number, sizeVariation: number, jitter: number, gray: number, alpha: number): void {
    const rng = this.rng;
    const eff = this.effBaseSize();
    const tiny = eff < 0.25;
    let width = half * sizeVariation + jitter;
    const cap = tiny ? Math.max(2, eff * 10) : 15;
    if (width > cap) width = rng.random(tiny ? 0.6 : 1, cap);
    let sw = Math.max(tiny ? 0.6 : 1, width);
    if (sw < 3) sw *= 2;
    if (this.brushModeSP) {
      const clampedBase = Math.max(0.15, Math.min(1.5, eff));
      const show = rng.random(0, 1) > 0.8;
      const jx = rng.random(0, 1) > 0.05 ? rng.random(-6 * clampedBase, 6 * clampedBase) : rng.random(-16 * clampedBase, 16 * clampedBase);
      const jy = rng.random(0, 1) > 0.05 ? rng.random(-6 * clampedBase, 6 * clampedBase) : rng.random(-16 * clampedBase, 16 * clampedBase);
      if (show) {
        this.line(x + ox + ex, y + oy + ey, curX + ox + jx, curY + oy + jy, rng.random(0.5, 1.5), gray, alpha);
      } else {
        sw = Math.min(1, sw);
        if (sw < 4) this.line(x + ox + ex, y + oy + ey, curX + ox, curY + oy, sw + 0.5, gray, alpha);
      }
      return;
    }
    const weight = eff < 4 ? sw : rng.random(sw * 0.5, sw);
    this.line(x + ox + ex, y + oy + ey, curX + ox, curY + oy, weight, gray, alpha);
  }

  private drawSprayDots(penX: number, penY: number, fromX: number, fromY: number): void {
    if (this.strokeFrame >= this.expectedStrokeLength) return;
    const rng = this.rng;
    const noise = this.perlin;
    const inkValue = this.inkJitter(this.inkGray);
    const alt = this.inkJitter(this.inkGray);
    const spread = 0.5 * this.initialSize * noise.noise(penX * 0.01, penY * 0.01) * (Math.abs(penX - fromX) + Math.abs(penY - fromY));
    const eff = this.effBaseSize();
    const scatter = Math.min(this.spraySize * eff, spread) * remap(noise.noise(penX, penY), 0, 1, 0.3, 1);
    let numDots = Math.max(3, scatter);
    if (this.strokeFrame < 5) numDots = Math.max(2, scatter * remap(this.strokeFrame, 0, 5, -0.2, 1));
    else if (this.strokeFrame >= this.expectedStrokeLength - 5) {
      numDots = Math.max(2, scatter * remap(this.strokeFrame, this.expectedStrokeLength - 5, this.expectedStrokeLength, 1, -0.2));
    }
    const gray = this.inkGrayOf(inkValue, alt);
    for (let i = 0; i < this.step2; i++) {
      const lx = lerp(penX, fromX, i / this.step2);
      const ly = lerp(penY, fromY, i / this.step2);
      for (let j = 0; j < 10; j++) {
        const dotScale = rng.random(0, 1) > 0.1 ? 1 : 1.5;
        const dotAngle = rng.random(TWO_PI);
        const u0 = rng.random();
        const a = rng.random(-numDots * dotScale, numDots * dotScale);
        const b = rng.random(-numDots * dotScale, numDots * dotScale);
        let dx: number;
        let dy: number;
        if (this.shapeType === 0) {
          const radius = Math.sqrt(u0) * numDots;
          dx = radius * inkCos(dotAngle);
          dy = radius * inkSin(dotAngle);
        } else if (this.shapeType === 1) {
          dx = inkSin(dotAngle) * a;
          dy = inkCos(dotAngle) * b;
        } else if (this.shapeType === 2) {
          const u = dotAngle / TWO_PI;
          const v = u0;
          if (u + v > 1) {
            dx = numDots * (1 - u);
            dy = numDots * (1 - v);
          } else {
            dx = numDots * u;
            dy = numDots * v;
          }
          dx -= numDots * 0.5;
          dy -= numDots * 0.5;
        } else {
          const u = a / numDots;
          const v = b / numDots;
          const manhattan = Math.abs(u) + Math.abs(v);
          if (manhattan > 1) {
            dx = (u / manhattan) * numDots;
            dy = (v / manhattan) * numDots;
          } else {
            dx = u * numDots;
            dy = v * numDots;
          }
        }
        const roll = rng.random(0, 1);
        let small = rng.random(0.2, 1);
        let big = rng.random(1, 2);
        const floor = eff < 0.25 ? 0.1 : 0.3;
        small = Math.max(floor, small * eff);
        big = Math.max(floor, big * eff);
        const alpha = rng.random(100, 255);
        let ss = roll > 0.1 ? small : big;
        if (this.brushMode === 3 || this.brushMode === 5) ss *= 2;
        const lo = eff < 0.25 ? Math.max(0.3, eff * 3) : 2;
        const hi = eff < 0.25 ? eff * 5 : 20;
        ss = Math.max(lo, Math.min(hi, ss));
        this.dot(lx + dx, ly + dy, ss, gray, alpha);
      }
    }
  }

  private drawBrushStroke(penX: number, penY: number, mainStrokeDir: number): void {
    if (this.strokeFrame >= this.expectedStrokeLength) return;
    const rng = this.rng;
    const noise = this.perlin;
    const inkValue = this.inkJitter(this.inkGray);
    const alt = this.inkJitter(this.inkGray);
    const eff = this.effBaseSize();
    const base = this.baseBrushSize;
    const pressureScale = this.penPressure >= 0 ? 0.7 + 0.4 * Math.min(this.penPressure / 0.7, 1) : 1;
    const tiny = eff < 0.25;
    const branchFloor = tiny ? rng.random(0.4, 0.8) : rng.random(base * 0.8, base * 2);
    const swFloorTiny = Math.max(0.6, base * 2);
    let mainFloor = tiny ? swFloorTiny : Math.max(0.6, base * 1.5);
    if (mainFloor < 3) mainFloor *= 2;
    let thinFloor = tiny ? swFloorTiny : Math.max(0.6, base * 1.2);
    if (thinFloor < 3) thinFloor *= 2;
    const widthCap = tiny ? Math.max(2, eff * 10) : eff < 0.5 ? 0.7 : 9999;
    this.lineWidth = this.strokeWidth * 0.5;
    if (!this.springInitialized) {
      this.springInitialized = true;
      this.x = penX;
      this.y = penY;
    }
    this.velX = (this.velX + (penX - this.x) * this.spring) * this.friction;
    this.velY = (this.velY + (penY - this.y) * this.spring) * this.friction;
    this.speed = Math.sqrt(this.velX * this.velX + this.velY * this.velY);
    this.speed *= base <= 1 ? 0.9 : base <= 2 ? 1.3 : base <= 3 ? 2 : 3;
    this.strokeWidth = this.sizeNow - this.speed;
    const ctl = this.ctlNoiseByFrame;
    const off1 = base * ctl * pressureScale;
    const off2 = 2 * base * ctl * pressureScale;
    const off3 = 3 * base * ctl * pressureScale;
    let showMainBrush = 0.1;
    const sizeCap = this.initialSize;
    let ex = 0;
    let ey = 0;
    if (mainStrokeDir === 0) showMainBrush = 0.08;
    else if (mainStrokeDir === 1) showMainBrush = 0.6;
    else if (mainStrokeDir === 2) showMainBrush = 0.2;
    const interpCount = this.interpSteps + this.interpolationOffset;
    const flip = BRANCH_FLIP_TABLE[this.brushDir] ?? { x: false, y: false };
    for (let i = 0; i < interpCount; ++i) {
      let fly = 0;
      if (base < 1.5) fly = rng.random(0, 1) > 0.4 ? 0 : rng.random(0, 1) > 0.4 ? 1 : 2;
      else if (base > 1.5 && base < 6) fly = rng.random(0, 1) > 0.4 ? 2 : rng.random(0, 1) > 0.6 ? 3 : 4;
      else if (base > 6) fly = rng.random(0, 1) > 0.3 ? 3 : 4;
      if (this.brushModeSP) fly = rng.random(0, 1) > 0.3 ? 3 : rng.random(0, 1) > 0.5 ? 2 : 4;
      if (this.strokeFrame < 5) fly = rng.random(0, 1) > 0.2 ? 5 : fly;
      const curX = this.x;
      const curY = this.y;
      this.x += this.velX / interpCount;
      this.y += this.velY / interpCount;
      const x = this.x;
      const y = this.y;
      const r977 = rng.random(0, 1);
      const r978 = rng.random(0, 4);
      const r979 = rng.random(0, 3);
      const r980 = rng.random(-1, 1);
      const r981 = rng.random(-1, 1);
      const r982 = rng.random(-1, 1);
      const r983 = rng.random(-1, 1);
      let mainChance = showMainBrush;
      let branchScale = 1;
      if (fly === 3) {
        mainChance *= 0.8;
        branchScale *= 0.8;
      } else if (fly === 4) {
        mainChance *= 0.6;
        branchScale *= 0.5;
      }
      if (eff < 0.25) mainChance = 0.18;
      else if (eff < 1.5) mainChance = 0.1;
      this.smoothedWidth = lerp(this.smoothedWidth, this.strokeWidth, 0.5);
      if (this.brushMode === 1) {
        if (r977 > 0.8 && this.lineWidth < 2 && i === 0) this.lineWidth = round2(r978);
      } else {
        this.lineWidth += (this.smoothedWidth - this.lineWidth) * 0.3;
      }
      let width: number;
      if (this.brushMode === 1) {
        width = this.lineWidth;
      } else if (this.strokeFrame < 5) {
        width = Math.max(tiny ? 0.1 : 0.5, this.lineWidth * remap(this.strokeFrame, 0, 5, 0.05, 1));
        if (this.explodeStart) {
          ex = r980 * remap(this.strokeFrame, 0, 5, 10, 0);
          ey = r981 * remap(this.strokeFrame, 0, 5, 10, 0);
        }
      } else if (this.strokeFrame >= this.expectedStrokeLength - 5) {
        const end = this.expectedStrokeLength;
        width = Math.max(tiny ? 0.1 : 0.5, this.lineWidth * remap(this.strokeFrame, end - 5, end, 1, 0.05));
        if (this.explodeEnd) {
          ex = r982 * remap(this.strokeFrame, end - 5, end, 0, 10);
          ey = r983 * remap(this.strokeFrame, end - 5, end, 0, 10);
        }
      } else if (this.lineWidth > 2) {
        width = Math.max(tiny ? 0.2 : 1, this.lineWidth);
      } else {
        width = Math.max(tiny ? 0.1 : 0.5, this.lineWidth + (r979 / 3 - 0.5));
      }
      let main = width;
      let half = width * 0.5;
      if (fly === 3) {
        main *= 0.8;
        half *= 0.8;
      } else if (fly === 4) {
        main *= 0.5;
        half *= 0.5;
      }
      const r990 = rng.random(0, 1);
      const mainAlpha = rng.random(150, 255);
      const a992 = rng.random(100, 255);
      const a993 = rng.random(100, 255);
      const a994 = rng.random(100, 255);
      const gray = this.inkGrayOf(inkValue, alt);
      if (tiny) {
        if (!this.brushModeSP && this.strokeFrame > 1) {
          const kk = Math.min(sizeCap, Math.max(mainFloor, main));
          this.line(x + ex, y + ey, curX, curY, Math.min(widthCap, kk), gray, mainAlpha);
        }
      } else if (r990 > mainChance) {
        const drawn = !this.brushModeSP && this.strokeFrame > 3 && base < 4;
        if (main < 5) {
          const kk = mainStrokeDir === 0 ? 1.5 * Math.min(sizeCap, Math.max(mainFloor, main)) : Math.min(sizeCap, Math.max(mainFloor, main));
          if (drawn) this.line(x + ex, y + ey, curX, curY, Math.min(widthCap, kk), gray, mainAlpha);
        } else {
          let kk = branchScale * Math.min(sizeCap, Math.max(mainFloor, main));
          if (kk > 15) kk = rng.random(1.5, kk);
          if (drawn) this.line(x + ex, y + ey, curX, curY, Math.min(widthCap, kk), gray, mainAlpha);
        }
      }
      const chance: number[] = [];
      const jitter: number[] = [];
      for (let j = 0; j < 30; j++) {
        chance.push(rng.random(0, 1));
        jitter.push(rng.random(-0.5, 0.5));
      }
      if (mainStrokeDir === 1) {
        chance[0] = (chance[0] ?? 0) * 2;
        chance[1] = (chance[1] ?? 0) * 0.5;
        chance[2] = (chance[2] ?? 0) * 0.5;
      } else if (mainStrokeDir === 2) {
        chance[0] = (chance[0] ?? 0) * 0.5;
        chance[1] = (chance[1] ?? 0) * 0.5;
        chance[2] = (chance[2] ?? 0) * 0.5;
      }
      const c = (k: number): number => chance[k] ?? 0;
      const jt = (k: number): number => jitter[k] ?? 0;
      if (fly === 0) {
        if (c(0) > 0.2) {
          const fx = flip.x ? -1 : 1;
          const fy = flip.y ? -1 : 1;
          let sv = remap(noise.noise(x * 0.1, y * 0.1), 0, 1, 0.8, 1.2);
          sv = Math.max(1 + jt(0), sv);
          const w = half * sv < 5
            ? Math.min(widthCap, noise.noise(x * 0.1, y * 0.2) + 1.5 * Math.max(thinFloor, half * sv))
            : Math.min(widthCap, branchScale * Math.max(branchFloor, half * sv));
          this.line(x + fx * off2 + ex, y + fy * off2 + ey, curX + fx * off2, curY + fy * off2, w, gray, a992);
        }
        if (c(1) > 0.3) {
          const fx = flip.x ? -1 : 1;
          const fy = flip.y ? 1 : -1;
          let sv = remap(noise.noise(x * 0.3 + 300, y * 0.3 + 300), 0, 1, 0.6, 1.5);
          sv = Math.max(1 + jt(1), sv);
          const w = Math.min(widthCap, branchScale * Math.max(branchFloor, half * sv));
          this.line(x + fx * off2 + ex, y + fy * off2 + ey, curX + fx * off2, curY + fy * off2, w, gray, a993);
        }
      } else if (fly === 1) {
        if (c(0) > 0.1) {
          const fx = flip.x ? -1 : 1;
          const fy = flip.y ? -1 : 1;
          let sv = remap(noise.noise(x * 0.3 + 200, y * 0.1 + 100), 0, 1, 0.8, 1.2);
          sv = Math.max(1 + jt(0), sv);
          const w = Math.min(widthCap, branchScale * Math.max(branchFloor, half * sv));
          this.line(x + fx * off2 + ex, y + fy * off2 + ey, curX + fx * off2, curY + fy * off2, w, gray, a992);
        }
        if (c(1) > 0.05) {
          const fx = flip.x ? -1 : 1;
          const fy = flip.y ? 1 : -1;
          let sv = remap(noise.noise(x * 0.2 + 300, y * 0.2 + 200), 0, 1, 0.8, 1.2);
          sv = Math.max(1 + jt(1), sv);
          const w = Math.min(widthCap, branchScale * Math.max(branchFloor, half * sv));
          this.line(x + fx * off1 + ex, y + fy * off1 + ey, curX + fx * off1, curY + fy * off1, w, gray, a993);
        }
        if (c(2) > 0.15) {
          let sv = remap(noise.noise(x * 0.1 + 400, y * 0.3 + 300), 0, 1, 0.8, 1.2);
          sv = Math.max(1 + jt(2), sv);
          const w = half * sv < 5
            ? Math.min(widthCap, noise.noise(x * 1, y * 2) + 1.5 * Math.max(thinFloor, half * sv))
            : Math.min(widthCap, branchScale * Math.max(branchFloor, half * sv));
          this.line(x - off3 + ex, y - off3 + ey, curX - off3, curY - off3, w, gray, a994);
        }
      } else if (fly === 2) {
        const sv = remap(noise.noise(x * 0.1 + 400, y * 0.1 + 200), 0, 1, 0.8, 1.2);
        BRANCH_OFFSETS_5.forEach((cfg, k) => {
          if (c(k) <= cfg.threshold) return;
          const offset = cfg.base === 1 ? off1 : cfg.base === 2 ? off2 : off3;
          const sx = k === 0 ? (flip.x ? -cfg.sx : cfg.sx) : cfg.sx;
          const sy = k === 0 ? (flip.y ? -cfg.sy : cfg.sy) : cfg.sy;
          this.drawBranch(sx * offset, sy * offset, x, y, curX, curY, ex, ey, half, sv, jt(3 + k), gray, a992);
        });
      } else if (fly === 3) {
        const sv = remap(noise.noise(x * 0.1 + 400, y * 0.1 + 200), 0, 1, 0.85, 1.15);
        let reach = base * ctl;
        if (base > 4) reach *= rng.random(0.5, 2.5);
        BRANCH_OFFSETS_8.forEach((cfg, k) => {
          const rot = base > 4 ? rng.random(0, 6.28) : 0;
          if (c(k) <= cfg.threshold) return;
          const dx = inkCos(cfg.angle + rot) * cfg.radius * reach;
          const dy = inkSin(cfg.angle + rot) * cfg.radius * reach;
          this.drawBranch((flip.x ? -1 : 1) * dx, (flip.y ? -1 : 1) * dy, x, y, curX, curY, ex, ey, half, sv, jt(cfg.jitter), gray, a992);
        });
      } else if (fly === 4) {
        const sv = remap(noise.noise(x * 0.1 + 400, y * 0.1 + 200), 0, 1, 0.9, 1.1);
        // The original passes the colour id where the gray belongs and drops the alpha:
        // these branches are opaque, gray = brushColorMode.
        const quirkGray = this.brushColorMode;
        let reach = base * ctl;
        if (base > 4) reach *= rng.random(0.5, 2.5);
        BRANCH_OFFSETS_12.forEach((cfg, k) => {
          const rot = base > 4 ? rng.random(0, 6.28) : 0;
          if (c(k) <= cfg.threshold) return;
          const dx = inkCos(cfg.angle + rot) * cfg.radius * reach;
          const dy = inkSin(cfg.angle + rot) * cfg.radius * reach;
          this.drawBranch((flip.x ? -1 : 1) * dx, (flip.y ? -1 : 1) * dy, x, y, curX, curY, ex, ey, half, sv, jt(cfg.jitter), quirkGray, 255);
        });
      }
    }
  }

  private drawDryBrush(penX: number, penY: number, fromX: number, fromY: number): void {
    const rng = this.rng;
    const eff = this.effBaseSize();
    const baseNow = this.baseBrushSize;
    const remaining = Math.max(eff < 0.25 ? 0.3 : 1, this.initialSize - this.strokeFrame * this.randStep);
    const reach = Math.min(baseNow * 2, 5 * remaining * this.penSketchNoiseBase * remap(inkSin(this.strokeFrame * 2), 0, 1, 0.5, 1.5));
    const moved = Math.abs(penX - fromX) > 0.1 || Math.abs(penY - fromY) > 0.1;
    const inkValue = this.inkJitter(this.inkGray);
    const alt = this.inkJitter(this.inkGray);
    const items: { t: number; weight: number; angle: number; radius: number; alpha: number }[] = [];
    for (let i = 0; i < 80; i++) {
      items.push({
        t: rng.random(0, 1),
        weight: Math.max(eff < 0.25 ? 0.1 : 0.3, Math.min(eff < 0.25 ? baseNow * 5 : 2, baseNow * rng.random(-0.5, 1))),
        angle: rng.random(0, TWO_PI),
        radius: Math.sqrt(rng.random(0, 1)) * reach,
        alpha: rng.random(150, 255),
      });
    }
    if (this.strokeFrame <= 3) return;
    const gray = this.inkGrayOf(inkValue, alt);
    for (const item of items) {
      const dx = item.radius * inkCos(item.angle);
      const dy = item.radius * inkSin(item.angle);
      const x = moved ? lerp(penX, fromX, item.t) + dx : penX + dx;
      const y = moved ? lerp(penY, fromY, item.t) + dy : penY + dy;
      this.dot(x, y, item.weight, gray, item.alpha);
    }
  }

  private drawMarker(penX: number, penY: number): void {
    if (this.strokeFrame >= this.expectedStrokeLength) return;
    const rng = this.rng;
    const noise = this.perlin;
    const eff = this.effBaseSize();
    const tiny = eff < 0.25;
    const widthCap = tiny ? eff * 5 : 9999;
    const inkValue = this.inkJitter(this.inkGray);
    const alt = this.inkJitter(this.inkGray);
    const sizeCap = this.initialSize * 0.3;
    if (!this.springInitialized) {
      this.springInitialized = true;
      this.x = penX;
      this.y = penY;
    }
    this.velX = (this.velX + (penX - this.x) * this.spring) * this.friction;
    this.velY = (this.velY + (penY - this.y) * this.spring) * this.friction;
    this.speed = Math.sqrt(this.velX * this.velX + this.velY * this.velY) * 1.2;
    const base = this.baseBrushSize;
    this.speed *= base <= 1 ? 0.9 : base <= 2 ? 1.3 : 1.5;
    this.strokeWidth = this.sizeNow - this.speed;
    const fromWidth = this.smoothedWidth;
    const toWidth = this.strokeWidth;
    const moveLen = Math.hypot(penX - this.x, penY - this.y);
    const half = Math.max(tiny ? 0.1 : 0.5, toWidth * 0.5);
    const stamp = 1.5 * Math.min(sizeCap, Math.max(tiny ? 0.5 : 4, half));
    const spacing = Math.max(stamp * 0.6 * 0.8, 0.5);
    let numSteps = Math.max(1, Math.ceil(moveLen / spacing));
    numSteps = Math.max(10, Math.min(50, numSteps));
    const density = numSteps / this.interpSteps;
    const moveFactor = Math.min(1, moveLen / 10);
    const lineGray = rng.random(50, 100);
    const items: { show: number; alpha: number; widthMult: number; fly: number[] }[] = [];
    for (let i = 0; i < this.interpSteps; ++i) {
      // explodeX1..Y2: drawn by the original, never used by the marker.
      for (let k = 0; k < 4; k++) rng.random(-1, 1);
      const show = rng.random(0, 1);
      const alpha = rng.random(80, 200);
      const widthMult = rng.random(0.8, 1.2);
      const fly = [rng.random(0, 1), rng.random(0, 1), rng.random(0, 1), rng.random(0, 1), rng.random(0, 1)];
      items.push({ show, alpha, widthMult, fly });
    }
    const gray = this.inkGrayOf(inkValue, alt);
    // p5's stroke weight carries over between stamps inside this push(); it starts at the default 1.
    let weight = 1;
    for (let i = 0; i < this.interpSteps; ++i) {
      const item = items[i];
      if (!item) continue;
      const curX = this.x;
      const curY = this.y;
      this.x += this.velX / this.interpSteps;
      this.y += this.velY / this.interpSteps;
      const x = this.x;
      const y = this.y;
      const progress = (i + 1) / this.interpSteps;
      this.smoothedWidth = lerp(this.smoothedWidth, lerp(fromWidth, toWidth, progress), 0.5);
      this.lineWidth += (this.smoothedWidth - this.lineWidth) * 0.8;
      this.lineWidth = Math.max(tiny ? 0.2 : 1.5, this.lineWidth);
      let width: number;
      const end = this.expectedStrokeLength;
      if (this.strokeFrame < 5) width = Math.max(tiny ? 0.1 : 0.5, this.lineWidth * remap(this.strokeFrame, 0, 5, 0.05, 1));
      else if (this.strokeFrame >= end - 5) width = Math.max(tiny ? 0.1 : 0.5, this.lineWidth * remap(this.strokeFrame, end - 5, end, 1, 0.05));
      else width = Math.max(tiny ? 0.1 : 0.5, this.lineWidth);
      let threshold = 0.3;
      if (density > 1) threshold = 0.3 / density;
      else if (density < 1) threshold = 0.3 * (2 - density);
      if (item.show > threshold && this.strokeFrame > 5) {
        const ss = Math.min(widthCap, 1.2 * Math.min(sizeCap, Math.max(3 * eff, width)));
        const dx = x - curX;
        const dy = y - curY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance >= 0.1) {
          this.markerMove = { x: dx / distance, y: dy / distance };
          this.markerAxis = { x: -dy / distance, y: dx / distance };
        }
        const w = ss * item.widthMult;
        const h = w * (0.5 + noise.noise(x * 0.1, y * 0.1) * 0.5);
        const g = clamp(gray, 0, 255);
        this.ops.push({
          kind: 'rect', x0: x, y0: y, x1: this.markerAxis.x, y1: this.markerAxis.y,
          w, h, lw: weight, r: g, g, b: g, a: clamp(item.alpha, 0, 255),
        });
      }
      if (moveFactor > 0.9 && this.strokeFrame > 5 && this.strokeFrame < end - 5) {
        const px = -this.markerMove.y;
        const py = this.markerMove.x;
        MARKER_LINES.forEach((cfg, j) => {
          if ((item.fly[j] ?? 0) <= cfg.threshold - moveFactor * 0.3) return;
          const ox = px * cfg.perp * eff;
          const oy = py * cfg.perp * eff;
          weight = Math.min(widthCap, Math.max(tiny ? 0.1 : 0.5, width * 0.3));
          this.line(curX + ox, curY + oy, x + ox, y + oy, weight, lineGray, 255);
        });
      }
    }
  }

  private buildFlyBranchConfig(eff: number): readonly FlyBranch[] {
    const rng = this.rng;
    let lo: number;
    let hi: number;
    if (eff <= 0.1) { lo = 2; hi = 4; }
    else if (eff <= 0.25) { lo = 4; hi = 7; }
    else if (eff <= 0.5) { lo = 6; hi = 10; }
    else if (eff <= 2) { lo = 10; hi = 15; }
    else if (eff <= 3) { lo = 20; hi = 30; }
    else { lo = 30; hi = 50; }
    rng.seed(this.strokeSeed + 50000);
    const count = Math.floor(rng.random(lo, hi + 1));
    const flySeed = this.strokeSeed + 60000;
    const pick = (salt: number, min: number, max: number): number => {
      rng.seed(flySeed + salt);
      return rng.random(min, max);
    };
    const branches: FlyBranch[] = [];
    for (let i = 0; i < count; i++) {
      const perpOffset = pick(i * 1000, -6, 6);
      const randThreshold = pick(i * 2000 + 1, 0.5, 1);
      const sizeMultiplier = pick(i * 3000 + 2, 1, 2);
      const speedMultiplier = pick(i * 4000 + 3, 0.7, 1.3);
      // minStrokeWeight: drawn and unused by the original.
      pick(i * 5000 + 4, 0.8, 1.2);
      const startOffset = Math.floor(pick(i * 6000 + 5, 0, 6));
      const endDistanceOffset = pick(i * 7000 + 6, 0, 8);
      const brushSpeedMultiplier = pick(i * 8000 + 7, 1, 2);
      const widthVariationFactor = pick(i * 9000 + 8, 0, 1);
      const offsetVariationFactor = pick(i * 10000 + 9, 0, 1);
      branches.push({
        perpOffset, randThreshold, sizeMultiplier, speedMultiplier, startOffset, endDistanceOffset,
        brushSpeedMultiplier, widthVariationFactor, offsetVariationFactor,
      });
    }
    return branches.sort((a, b) => a.perpOffset - b.perpOffset);
  }

  private drawGothic(penX: number, penY: number, fromX: number, fromY: number): void {
    if (this.strokeFrame >= this.expectedStrokeLength) return;
    const rng = this.rng;
    const noise = this.perlin;
    const gdx = penX - fromX;
    const gdy = penY - fromY;
    const moveDist = Math.sqrt(gdx * gdx + gdy * gdy);
    const speedMultiplier = remap(clamp(moveDist, 3, 50), 0, 50, 0.1, 5);
    let leftX = 0;
    let leftY = 1;
    let rightX = 0;
    let rightY = -1;
    if (moveDist > 0.1) {
      const ux = gdx / moveDist;
      const uy = gdy / moveDist;
      leftX = -uy;
      leftY = ux;
      rightX = uy;
      rightY = -ux;
    }
    const spawnCap = remap(clamp(speedMultiplier, 0.1, 5), 0.1, 5, 20, 1);
    rng.seed(this.strokeSeed + this.strokeFrame * 10000 + 1);
    const spawn = Math.floor(rng.random(0, spawnCap));
    const base = this.baseBrushSize;
    for (let i = 0; i < spawn; i++) {
      rng.seed(this.strokeSeed + this.strokeFrame * 1000 + this.sprayParticleCounter);
      const radius = rng.random(5, 15) * base;
      const px = penX + rng.random(-2, 2) * base;
      const py = penY + rng.random(-2, 2) * base;
      const sideDirection = rng.random(0, 1) > 0.5 ? 1 : -1;
      let r: number;
      let g: number;
      let b: number;
      if (this.brushColorMode === 0) r = g = b = this.inkGray * 0.3;
      else if (this.brushColorMode === 1) r = g = b = 150;
      else if (this.brushColorMode === 33) [r, g, b] = this.customBrushColor;
      else [r, g, b] = inkColorRgb(this.brushColorMode);
      this.sprayParticles.push({
        id: this.sprayParticleCounter++,
        location: { x: px, y: py },
        prevLocation: { x: px, y: py },
        radius, r, g, b, xOff: 0, yOff: 0, sideDirection,
      });
    }
    const shrinkLo = remap(clamp(base || 1, 0.1, 4), 0.1, 4, 0.01, 0.1);
    const shrinkHi = remap(clamp(base || 1, 0.1, 4), 0.1, 4, 0.1, 0.5);
    for (let i = this.sprayParticles.length - 1; i >= 0; i--) {
      const particle = this.sprayParticles[i];
      if (!particle || particle.radius <= 0) continue;
      rng.seed(this.strokeSeed + this.strokeFrame * 1000 + particle.id * 100);
      particle.radius -= rng.random(shrinkLo, shrinkHi) * 3;
      particle.xOff += rng.random(-0.5, 0.5) * speedMultiplier;
      particle.yOff += rng.random(-0.5, 0.5) * speedMultiplier;
      const speedScale = 2 * speedMultiplier;
      rng.random(0, 1);
      const side = particle.sideDirection;
      const sx = (side === 1 ? rightX : leftX) * speedScale;
      const sy = (side === 1 ? rightY : leftY) * speedScale;
      const nX = noise.noise(particle.location.x) * particle.xOff;
      const nY = noise.noise(particle.location.y) * particle.yOff;
      particle.prevLocation.x = particle.location.x;
      particle.prevLocation.y = particle.location.y;
      particle.location.x += 2 * (sx * 0.2 + nX * 0.8);
      particle.location.y += 2 * (sy * 0.2 + nY * 0.8);
      if (this.brushColorMode >= 2) {
        const drift = noise.noise(particle.location.x * 0.01, particle.location.y * 0.01) * 5;
        particle.r = clamp(particle.r + drift, 0, 255);
        particle.g = clamp(particle.g + drift, 0, 255);
        particle.b = clamp(particle.b + drift, 0, 255);
      } else if (this.brushColorMode === 0) {
        const drift = noise.noise(particle.location.x * 0.01, particle.location.y * 0.01) * 2;
        particle.r = clamp(particle.r + drift, 0, 200);
        particle.g = clamp(particle.g + drift, 0, 200);
        particle.b = clamp(particle.b + drift, 0, 200);
      }
      const visible = rng.random(0, 1) > 0.2;
      const dies = rng.random(0, 1) > 0.99;
      if (particle.radius > 0) {
        if (visible) {
          this.lineRgb(particle.prevLocation.x, particle.prevLocation.y, particle.location.x, particle.location.y,
            Math.max(1, particle.radius * 0.5), particle.r, particle.g, particle.b, 200);
        }
        if (dies) particle.radius = -1;
      } else {
        particle.radius = -1;
      }
    }
    this.sprayParticles = this.sprayParticles.filter(particle => particle.radius > 0);
  }

  private drawFlyBrush(penX: number, penY: number): void {
    if (this.strokeFrame >= this.expectedStrokeLength) return;
    const rng = this.rng;
    const noise = this.perlin;
    const inkValue = this.inkJitter(this.inkGray);
    const eff = this.effBaseSize();
    if (!this.springInitialized) {
      this.springInitialized = true;
      this.x = penX;
      this.y = penY;
    }
    this.velX = (this.velX + (penX - this.x) * this.spring) * this.friction;
    this.velY = (this.velY + (penY - this.y) * this.spring) * this.friction;
    this.speed = Math.sqrt(this.velX * this.velX + this.velY * this.velY) * 0.7;
    this.strokeWidth = this.sizeNow - this.speed;
    const fromWidth = this.smoothedWidth;
    const toWidth = this.strokeWidth;
    const tinyFly = eff < 0.25;
    const smallFly = eff < 1;
    rng.random(30, 70);
    const key = `${eff}_${this.strokeSeed}`;
    let config = this.flyConfigs.get(key);
    if (!config) {
      config = this.buildFlyBranchConfig(eff);
      this.flyConfigs.set(key, config);
    }
    const items: FlyItem[] = [];
    for (let i = 0; i < this.interpSteps; ++i) {
      const flyWhiteRandoms: number[] = [];
      const flyWhiteOffsetNoises: number[] = [];
      const flyWhiteWidthNoises: number[] = [];
      for (let j = 0; j < 40; j++) {
        flyWhiteRandoms.push(rng.random(0.3, 1.2));
        flyWhiteOffsetNoises.push(noise.noise(this.strokeFrame * 0.08 + j * 0.15, this.strokeFrame * 0.08 + j * 0.15 + i * 0.01));
        flyWhiteWidthNoises.push(noise.noise(this.strokeFrame * 0.1 + j * 0.1, this.strokeFrame * 0.1 + j * 0.1 + i * 0.01));
      }
      rng.random(-1, 1);
      rng.random(-1, 1);
      rng.random(-1, 1);
      rng.random(-1, 1);
      const showMainBrush = rng.random(0, 1);
      rng.random(80, 200);
      rng.random(0.8, 1.2);
      items.push({ showMainBrush, flyWhiteRandoms, flyWhiteOffsetNoises, flyWhiteWidthNoises });
    }
    const end = this.expectedStrokeLength;
    for (let i = 0; i < this.interpSteps; ++i) {
      const item = items[i];
      if (!item) continue;
      const curX = this.x;
      const curY = this.y;
      this.x += this.velX / this.interpSteps;
      this.y += this.velY / this.interpSteps;
      const x = this.x;
      const y = this.y;
      const progress = (i + 1) / this.interpSteps;
      this.smoothedWidth = lerp(this.smoothedWidth, lerp(fromWidth, toWidth, progress), 0.5);
      this.lineWidth += (this.smoothedWidth - this.lineWidth) * 0.8;
      this.lineWidth = Math.max(smallFly ? eff * 1.5 : 1.5, this.lineWidth);
      const dx = x - curX;
      const dy = y - curY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance >= 0.1) this.flyMove = { x: dx / distance, y: dy / distance };
      const heading = this.flyMove;
      const perpX = -heading.y;
      const perpY = heading.x;
      const halfNow = Math.max(tinyFly ? eff * 0.4 : smallFly ? eff * 0.5 : 0.5, this.sizeNow * 0.5);
      const speedHalf = this.speed * 0.5;
      const nearEnd = this.strokeFrame >= end - 5;
      const thresholdScale = nearEnd ? 0.7 : 1;
      const done = this.strokeFrame >= end;
      const fadeFrames = nearEnd ? this.strokeFrame - (end - 5) : 0;
      const fade = nearEnd ? Math.min(1, fadeFrames / 5) : 0;
      config.forEach((branch, j) => {
        if (this.strokeFrame < branch.startOffset || done) return;
        if ((item.flyWhiteRandoms[j] ?? 0) <= branch.randThreshold * thresholdScale) return;
        const offsetNoise = item.flyWhiteOffsetNoises[j] ?? 0;
        const spread = remap(offsetNoise, 0, 1, 1, 2);
        const variation = 1 + (spread - 1) * branch.offsetVariationFactor;
        const sizeFactor = smallFly ? Math.max(0.3, eff * 3) : eff;
        const perp = branch.perpOffset * sizeFactor * variation;
        const ox = perpX * perp;
        const oy = perpY * perp;
        let toX = x;
        let toY = y;
        let fromX = curX;
        let fromY = curY;
        if (nearEnd) {
          const reach = branch.endDistanceOffset * fade * eff;
          toX = x + heading.x * reach;
          toY = y + heading.y * reach;
          if (fadeFrames !== 0) {
            const back = branch.endDistanceOffset * Math.min(1, (fadeFrames - 1) / 5) * eff;
            fromX = x + heading.x * back;
            fromY = y + heading.y * back;
          }
        }
        const slowed = speedHalf * branch.brushSpeedMultiplier * branch.speedMultiplier;
        const widthNow = Math.max(tinyFly ? eff * 0.3 : smallFly ? eff * 0.3 : 0.5, halfNow - slowed) * 0.6;
        const widthNoise = remap(item.flyWhiteWidthNoises[j] ?? 0, 0, 1, 0.8, 1.2);
        const widthVariation = 1 + (widthNoise - 1) * branch.widthVariationFactor;
        const alphaBase = Math.max(0, remap(j, 0, config?.length ?? 1, 80, 230) - noise.noise(i * 0.5, j * 0.5) * 30);
        const alpha = Math.min(200, alphaBase) + rng.random(-50, 50);
        const target = Math.max(1, widthNow * branch.sizeMultiplier * widthVariation);
        const weightKey = `${key}_${j}`;
        const previous = this.flyWeights.get(weightKey) ?? target;
        const ease = previous < 3 ? 0.15 : previous >= 5 ? 0.3 : lerp(0.15, 0.3, (previous - 3) / 2);
        const weight = lerp(previous, target, ease);
        this.flyWeights.set(weightKey, weight);
        this.line(fromX + ox, fromY + oy, toX + ox, toY + oy, weight, inkValue, alpha);
      });
    }
  }
}
