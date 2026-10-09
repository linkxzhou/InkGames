import { Application, BufferImageSource, Graphics, Rectangle, RenderTexture, Sprite, Texture } from 'pixi.js';
import {
  INK_TIP_OFFSET, InkBrushEngine, type InkBrushSettings, type InkDrawOp, type InkPoint, type InkShaderState,
} from './ink-brush';
import { type InkBite, scanInkBites } from './ink-metallic';
import { inkColorRgb, type InkColorName } from './ink-palette';
import { inkPaperPixels } from './ink-paper';
import { inkCos, inkSin, P5Random, TWO_PI } from './ink-random';
import {
  createCompositeFilter, createDistortFilter, createEncodeFilter, createFeedbackFilter, createFlowFilter,
  createForceMapFilter, createMetallicFilter, createRealtimeFilter, createTypeMapFilter, createWashFilter,
  type ForceMapParams, type InkFilter,
} from './ink-wash-filters';

export type InkColor = InkColorName | readonly [number, number, number];

export interface InkWashOptions {
  readonly width: number;
  readonly height: number;
  /** inkEngine `seed`: paper, force field and default stroke seeds. */
  readonly seed?: number;
  /** canvasBackgroundColor. inkEngine's default is 222 gray; the paper is this × 1.1. */
  readonly background?: readonly [number, number, number];
  /** Paper texture toggle. Off shows the plain background colour. */
  readonly paper?: boolean;
  /** White base, no paper: a layer meant to be shown with blendMode 'multiply' over another sheet. */
  readonly transparent?: boolean;
}

/** flow.frag after the stroke commits. iterations is inkEngine's flowIterations at release. */
export interface InkFlowFinish {
  readonly blendType: number;
  readonly iterations: number;
  /** Replay seed. inkEngine's live button uses Math.random; a recording stores this instead. */
  readonly seed?: number;
}

/** distort.frag. extent 'frame' is inkEngine's full-canvas pass; 'stroke' keeps the rest of the sheet still. */
export interface InkDistortFinish {
  readonly displacementB?: number;
  readonly displacementC?: number;
  readonly extent?: 'frame' | 'stroke';
}

/** metallic.frag on bites scanned from this stroke. tint defaults to the panel value [0.72, 0.5, 0.35]. */
export interface InkMetallicFinish {
  readonly size?: number;
  readonly tint?: readonly [number, number, number];
}

/** Optional post passes, matching the order inkEngine composites them: metallic, then distort, then flow. */
export interface InkFinish {
  readonly flow?: InkFlowFinish;
  readonly distort?: InkDistortFinish;
  readonly metallic?: InkMetallicFinish;
}

/** A stroke the way inkEngine/index.html paints one: panel settings, a colour, one pointer sample per frame. */
export interface InkStrokeRequest {
  readonly brush: InkBrushSettings;
  readonly color: InkColor;
  /** Where the tip should land, one sample per frame (InkWash adds inkEngine's tip offset). */
  readonly points: readonly InkPoint[];
  /** p5 random state at pen-down; the inkEngine host reproduces it with p.randomSeed(seed). */
  readonly seed?: number;
  /** flow / distort / metallic, applied once the stroke has committed. */
  readonly finish?: InkFinish;
}

interface PixelRect { x: number; y: number; w: number; h: number }

interface Bounds { minX: number; minY: number; maxX: number; maxY: number }

const EMPTY: Bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };

/** Pointer positions inkEngine needs so its tip lands on `points` (gothic has no tip offset). */
export function inkPointerPath(points: readonly InkPoint[], mode: InkBrushSettings['mode']): InkPoint[] {
  const shift = mode === 'gothic' ? 0 : -INK_TIP_OFFSET;
  return points.map(point => (point.pressure === undefined
    ? { x: point.x + shift, y: point.y + shift }
    : { x: point.x + shift, y: point.y + shift, pressure: point.pressure }));
}

/**
 * An ink sheet that runs inkEngine's pipeline on Pixi render textures.
 *
 * Per frame, as in inkEngine draw(): the ported brush (ink-brush.ts) draws gray marks into the wet
 * buffer, then one feedback pass (feedback.frag) spreads them; after the pen lifts the feedback keeps
 * running with falling force for maxUpdates frames, then encode.frag tints the stroke into the
 * committed colour buffer and typeMapEncode.frag marks it. composite.frag shows paper × ink.
 * Passes cover the current stroke's rectangle only, which gives the same pixels as inkEngine's
 * full-screen passes for every effect except 4/5, whose margin grows with the stroke.
 * The force field is repainted on that rectangle every feedback frame (mapFrag, time = frame/60).
 * A new stroke leaves the previous ping-pong rectangle in place, so an overlap blends onto it.
 * Display only: collision stays on the CPU in InkWorld.
 */
export class InkWash {
  readonly view: Sprite;
  readonly width: number;
  readonly height: number;
  private readonly engine = new InkBrushEngine();
  private readonly seed: number;
  private readonly background: readonly [number, number, number];
  private readonly pen = new Graphics();
  private readonly passSprite = new Sprite(Texture.WHITE);
  private readonly copySprite = new Sprite();
  private readonly stamp: RenderTexture;
  private readonly wet: RenderTexture;
  private readonly pingPong: RenderTexture;
  private readonly scratch: RenderTexture;
  private readonly final: RenderTexture;
  private readonly typeMap: RenderTexture;
  private readonly display: RenderTexture;
  private readonly force: RenderTexture;
  private readonly lastStroke: RenderTexture;
  private readonly bugsMask: RenderTexture;
  private readonly bugsData: RenderTexture;
  private readonly base: Texture;
  private readonly feedback: InkFilter;
  private readonly encode: InkFilter;
  private readonly typeEncode: InkFilter;
  private readonly composite: InkFilter;
  private readonly realtime: InkFilter;
  private readonly forceMap: InkFilter;
  private readonly distort: InkFilter;
  private readonly flow: InkFilter;
  private readonly metallic: InkFilter;
  private readonly washColor: InkFilter;
  private readonly washType: InkFilter;
  private readonly forceSeeds: readonly number[];
  private stroke: Bounds = { ...EMPTY };
  private pathBounds: Bounds = { ...EMPTY };
  private lastRect: PixelRect | undefined;
  private strokeFrames = 0;
  /** Host pages step twice after ready before the first stroke, so the force clock starts there. */
  private frameCount = 2;
  private serial = 0;
  private pendingFinish: InkFinish | undefined;
  private strokeSeed = 0;
  private live: { down: boolean; cursor: InkPoint; pmouse: InkPoint; pending: InkPoint | undefined; lift: number } | undefined;
  private disposed = false;

  constructor(private readonly app: Application, options: InkWashOptions) {
    this.width = Math.max(2, Math.round(options.width));
    this.height = Math.max(2, Math.round(options.height));
    this.seed = options.seed ?? 1234567890;
    this.background = options.background ?? [222, 222, 222];
    const make = (antialias = false): RenderTexture => RenderTexture.create({
      width: this.width, height: this.height, resolution: 1, antialias,
    });
    this.stamp = make(true);
    this.wet = make();
    this.pingPong = make();
    this.scratch = make();
    this.final = make();
    this.typeMap = make();
    this.display = make();
    this.force = make();
    this.lastStroke = make();
    this.bugsMask = make();
    this.bugsData = make();
    this.base = this.makeBase(options);
    const w = this.width;
    const h = this.height;
    const params = this.forceParams();
    this.forceSeeds = params.seeds;
    this.feedback = createFeedbackFilter(this.wet.source, this.force.source, w, h);
    this.encode = createEncodeFilter(this.final.source, this.wet.source, this.typeMap.source, w, h);
    this.typeEncode = createTypeMapFilter(this.typeMap.source, this.wet.source, w, h);
    this.composite = createCompositeFilter(this.base.source, this.final.source, this.typeMap.source, w, h);
    this.realtime = createRealtimeFilter(this.scratch.source, this.wet.source, this.final.source, w, h);
    this.forceMap = createForceMapFilter(params, w, h);
    this.distort = createDistortFilter(this.display.source, this.force.source, w, h);
    this.flow = createFlowFilter(this.final.source, this.lastStroke.source, w, h);
    this.metallic = createMetallicFilter(this.display.source, this.bugsMask.source, this.bugsData.source, w, h);
    this.washColor = createWashFilter(this.final.source, w, h);
    this.washType = createWashFilter(this.typeMap.source, w, h);
    this.washType.set('uTypeMode', 1);
    this.encode.setVec('canvasBackgroundColor', this.background[0] / 255, this.background[1] / 255, this.background[2] / 255);
    this.view = new Sprite(this.display);
    const full = this.fullRect();
    this.fill(this.wet, full, 0xffffff);
    this.fill(this.pingPong, full, 0xffffff);
    this.fill(this.final, full, 0xffffff);
    this.fill(this.lastStroke, full, 0xffffff);
    this.fill(this.typeMap, full, 0x000000);
    this.forceMap.set('time', 0);
    this.pass(this.forceMap, this.force, full);
    this.pass(this.composite, this.display, full);
    this.distort.setVec('backgroundColor', this.background[0] / 255, this.background[1] / 255, this.background[2] / 255);
    this.distort.set('fbmSeed1', this.forceSeeds[0] || 100);
    this.distort.set('fbmSeed2', this.forceSeeds[1] || 200);
    this.distort.set('fbmSeed3', this.forceSeeds[2] || 300);
    this.distort.set('fbmSeed4', this.forceSeeds[3] || 400);
  }

  setBrush(settings: InkBrushSettings): void {
    this.engine.configure(settings);
  }

  setColor(color: InkColor): void {
    this.engine.setColor(color);
  }

  /** Brush, colour and points in one call, like setBrush().setColor().strokePath() on inkEngine. */
  paint(stroke: InkStrokeRequest): void {
    this.setBrush(stroke.brush);
    this.setColor(stroke.color);
    this.pendingFinish = stroke.finish;
    this.strokePath(stroke.points, stroke.seed);
    this.pendingFinish = undefined;
  }

  /**
   * Paint a whole stroke now: pen down at points[0], one point per frame, hold one frame, lift, then
   * run the countdown until the stroke is committed. Points are where the tip lands.
   */
  strokePath(points: readonly InkPoint[], seed?: number): void {
    if (this.disposed || !points.length) return;
    this.finishLive();
    const pointer = inkPointerPath(points, this.modeName());
    const first = pointer[0];
    if (!first) return;
    this.pathBounds = { ...EMPTY };
    for (const point of pointer) grow(this.pathBounds, point.x, point.y, point.x, point.y);
    this.pressAt(first, seed);
    let previous = first;
    for (let i = 1; i < pointer.length; i++) {
      const point = pointer[i];
      if (!point) continue;
      this.engine.applyPressure(point.pressure);
      this.runFrame(true, round2Point(point), previous, false);
      previous = point;
    }
    const last = pointer[pointer.length - 1] ?? first;
    this.runFrame(true, round2Point(last), pointer[pointer.length - 2] ?? first, false);
    this.engine.release();
    for (let guard = 0; guard < 200 && this.engine.pendingCommit; guard++) {
      this.runFrame(false, round2Point(last), last, false);
    }
    const finish = this.pendingFinish;
    if (finish) this.applyFinish(finish);
  }

  /** Live drawing: the pointer goes down now; call update() once per rendered frame. */
  beginStroke(point: InkPoint, seed?: number): void {
    if (this.disposed) return;
    this.finishLive();
    const pointer = inkPointerPath([point], this.modeName())[0] ?? point;
    this.live = { down: true, cursor: pointer, pmouse: pointer, pending: pointer, lift: 0 };
    this.pressAt(pointer, seed, true);
  }

  /** Latest pointer position; inkEngine samples the pointer once per frame, so only the last one counts. */
  addPoint(point: InkPoint): void {
    if (!this.live?.down) return;
    this.live.pending = inkPointerPath([point], this.modeName())[0] ?? point;
  }

  endStroke(): void {
    if (this.live?.down) this.live.lift = 1;
  }

  /** One inkEngine frame for a live stroke. Does nothing when no stroke is wet. */
  update(): void {
    const live = this.live;
    if (!live || this.disposed) return;
    if (live.down && live.lift > 0) {
      live.lift = 0;
      live.down = false;
      this.engine.release();
    }
    if (live.down) {
      const next = live.pending ?? live.cursor;
      live.pmouse = live.cursor;
      live.cursor = next;
      live.pending = undefined;
      this.engine.applyPressure(next.pressure);
    }
    this.runFrame(live.down, round2Point(live.cursor), live.pmouse, true);
    if (!this.engine.pendingCommit) this.live = undefined;
  }

  /** Water brush: lighten committed ink inside the circle and clear its type marks. */
  wash(x: number, y: number, radius: number): void {
    if (this.disposed) return;
    const rect = this.clampRect({ x: Math.floor(x - radius - 2), y: Math.floor(y - radius - 2), w: Math.ceil(radius * 2 + 4), h: Math.ceil(radius * 2 + 4) });
    if (!rect) return;
    for (const filter of [this.washColor, this.washType]) {
      filter.setVec('uCenter', x, y);
      filter.set('uRadius', Math.max(1, radius));
    }
    this.pass(this.washColor, this.scratch, rect);
    this.copy(this.scratch, this.final, rect);
    this.pass(this.washType, this.scratch, rect);
    this.copy(this.scratch, this.typeMap, rect);
    this.pass(this.composite, this.display, rect);
  }

  clear(): void {
    if (this.disposed) return;
    this.live = undefined;
    if (this.engine.pendingCommit) this.engine.committed();
    const full = this.fullRect();
    this.fill(this.wet, full, 0xffffff);
    this.fill(this.pingPong, full, 0xffffff);
    this.fill(this.final, full, 0xffffff);
    this.fill(this.typeMap, full, 0x000000);
    this.pass(this.composite, this.display, full);
    this.stroke = { ...EMPTY };
  }

  get frames(): number {
    return this.frameCount;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.view.removeFromParent();
    this.view.destroy();
    this.passSprite.filters = [];
    this.passSprite.destroy();
    this.copySprite.destroy();
    this.pen.destroy();
    for (const texture of [this.stamp, this.wet, this.pingPong, this.scratch, this.final, this.typeMap, this.display, this.force, this.lastStroke, this.bugsMask, this.bugsData]) texture.destroy(true);
    if (this.base !== Texture.WHITE) this.base.destroy(true);
    for (const filter of [this.feedback, this.encode, this.typeEncode, this.composite, this.realtime, this.forceMap, this.distort, this.flow, this.metallic, this.washColor, this.washType]) {
      filter.filter.destroy();
    }
  }

  private modeName(): InkBrushSettings['mode'] {
    return this.engine.mode === 3 ? 'gothic' : 'brush';
  }

  private pressAt(pointer: InkPoint, seed: number | undefined, live = false): void {
    if (this.engine.pendingCommit) this.commit();
    this.serial += 1;
    // inkEngine does not clear the ping-pong. feedback writes alpha < 1, so a new stroke blends onto
    // whatever the previous stroke left there. Clearing that rectangle made overlaps lighter.
    this.lastRect = undefined;
    this.stroke = { ...EMPTY };
    this.strokeFrames = 0;
    this.engine.applyPressure(pointer.pressure);
    const cursor = round2Point(pointer);
    this.strokeSeed = seed ?? ((this.seed + this.serial * 7919) >>> 0);
    this.engine.press(cursor.x, cursor.y, this.strokeSeed);
    this.runFrame(true, cursor, pointer, live);
  }

  private runFrame(down: boolean, cursor: InkPoint, pmouse: InkPoint, live: boolean): void {
    const step = this.engine.frame(down, cursor.x, cursor.y, pmouse.x, pmouse.y);
    this.frameCount += 1;
    this.strokeFrames += 1;
    if (step.ops.length) this.drawOps(step.ops);
    const rect = this.strokeRect();
    if (step.force !== undefined && rect) {
      // updateForceMap: time = millis() * 0.001. With clock:'frame' that is frameCount/60.
      // Only this stroke's rectangle is sampled by feedback, so the rest of the field can stay.
      this.refreshForce(rect);
      this.applyShaderState(this.feedback, this.engine.shaderState());
      this.feedback.set('force', step.force);
      // feedback.frag often writes alpha < 1; like p5, blend it over the previous ping-pong frame,
      // then over the wet sheet. That is what keeps old ink dark instead of washing it out.
      this.pass(this.feedback, this.pingPong, rect);
      this.copy(this.pingPong, this.wet, rect);
      if (live) this.showLive(rect);
    }
    if (step.commit) this.commit();
  }

  private drawOps(ops: readonly InkDrawOp[]): void {
    const pen = this.pen;
    pen.clear();
    const bounds: Bounds = { ...EMPTY };
    for (const op of ops) {
      const color = (Math.round(op.r) << 16) | (Math.round(op.g) << 8) | Math.round(op.b);
      const alpha = op.a / 255;
      if (op.kind === 'line') {
        const reach = op.w / 2 + 1;
        if (Math.abs(op.x1 - op.x0) + Math.abs(op.y1 - op.y0) < 1e-3) pen.circle(op.x0, op.y0, op.w / 2).fill({ color, alpha });
        else pen.moveTo(op.x0, op.y0).lineTo(op.x1, op.y1).stroke({ width: op.w, color, alpha, cap: 'round' });
        grow(bounds, Math.min(op.x0, op.x1) - reach, Math.min(op.y0, op.y1) - reach, Math.max(op.x0, op.x1) + reach, Math.max(op.y0, op.y1) + reach);
      } else if (op.kind === 'dot') {
        pen.circle(op.x0, op.y0, Math.max(0.05, op.w / 2)).fill({ color, alpha });
        grow(bounds, op.x0 - op.w / 2 - 1, op.y0 - op.w / 2 - 1, op.x0 + op.w / 2 + 1, op.y0 + op.w / 2 + 1);
      } else {
        const ax = op.x1 * op.w / 2;
        const ay = op.y1 * op.w / 2;
        const bx = -op.y1 * op.h / 2;
        const by = op.x1 * op.h / 2;
        pen.poly([
          op.x0 - ax - bx, op.y0 - ay - by, op.x0 + ax - bx, op.y0 + ay - by,
          op.x0 + ax + bx, op.y0 + ay + by, op.x0 - ax + bx, op.y0 - ay + by,
        ]).fill({ color: 0xffffff, alpha: 1 }).stroke({ width: op.lw, color, alpha, join: 'miter' });
        const reach = (op.w + op.h) / 2 + op.lw + 1;
        grow(bounds, op.x0 - reach, op.y0 - reach, op.x0 + reach, op.y0 + reach);
      }
    }
    const rect = this.clampRect(toRect(bounds, 0));
    if (!rect) return;
    grow(this.stroke, bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
    this.app.renderer.render({ container: pen, target: this.stamp, clear: true, clearColor: [0, 0, 0, 0] });
    this.copy(this.stamp, this.wet, rect);
  }

  private strokeRect(): PixelRect | undefined {
    const spread = this.engine.effect >= 4 ? 3 * this.strokeFrames : 0;
    return this.clampRect(toRect(this.stroke, 3 + spread));
  }

  private commit(): void {
    const rect = this.strokeRect();
    const state = this.engine.shaderState();
    this.engine.committed();
    if (!rect) return;
    this.applyShaderState(this.encode, state);
    this.encode.setVec('customBrushColor', state.customBrushColor[0] / 255, state.customBrushColor[1] / 255, state.customBrushColor[2] / 255);
    this.pass(this.encode, this.scratch, rect);
    this.copy(this.scratch, this.final, rect);
    this.typeEncode.set('brushCategory', state.brushCategory);
    this.typeEncode.set('whiteMaxOpacity', state.whiteMaxOpacity);
    this.pass(this.typeEncode, this.scratch, rect);
    this.copy(this.scratch, this.typeMap, rect);
    // commitStroke paints lastStrokeBuffer white, then copies the wet stroke. The rest of `wet` still
    // holds older strokes, so only this rectangle is copied.
    this.fill(this.lastStroke, this.fullRect(), 0xffffff);
    this.copy(this.wet, this.lastStroke, rect);
    this.fill(this.wet, rect, 0xffffff);
    this.pass(this.composite, this.display, rect);
    this.lastRect = rect;
    this.stroke = { ...EMPTY };
  }

  /** composite into scratch, then realtime.frag overlays the wet stroke into the display. */
  private showLive(rect: PixelRect): void {
    const state = this.engine.shaderState();
    this.pass(this.composite, this.scratch, rect);
    this.applyShaderState(this.realtime, state);
    const rgb = state.brushColorMode === 33 ? state.customBrushColor : inkColorRgb(state.brushColorMode);
    this.realtime.setVec('brushColor', rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
    this.pass(this.realtime, this.display, rect);
  }

  private finishLive(): void {
    if (!this.live) return;
    if (this.live.down) this.engine.release();
    for (let guard = 0; guard < 200 && this.engine.pendingCommit; guard++) {
      this.runFrame(false, round2Point(this.live.cursor), this.live.cursor, false);
    }
    this.live = undefined;
  }

  private applyShaderState(filter: InkFilter, state: InkShaderState): void {
    filter.set('brushMode', state.brushMode);
    filter.set('baseBrushSize', state.baseBrushSize);
    filter.set('useSharpen', state.useSharpen);
    filter.set('effect3Brightness', state.effect3Brightness);
    filter.set('indiffusionStrength', state.indiffusionStrength);
    filter.set('brushColorMode', state.brushColorMode);
    filter.set('brushCategory', state.brushCategory);
    filter.set('mouseCount', state.mouseCount);
    filter.set('mouseCountAccumulated', state.mouseCountAccumulated);
    filter.set('strokeSeed', state.strokeSeed);
    filter.set('whiteMaxOpacity', state.whiteMaxOpacity);
    filter.set('hueShift', state.hueShift);
    filter.set('satShift', state.satShift);
    filter.set('briShift', state.briShift);
    filter.set('keyBlendMode', state.keyBlendMode);
    filter.set('useSpectralMix', state.useSpectralMix);
  }

  private pass(filter: InkFilter, target: RenderTexture, rect: PixelRect): void {
    const sprite = this.passSprite;
    sprite.position.set(rect.x, rect.y);
    sprite.width = rect.w;
    sprite.height = rect.h;
    sprite.filters = [filter.filter];
    this.app.renderer.render({ container: sprite, target, clear: false });
  }

  private copy(from: RenderTexture, to: RenderTexture, rect: PixelRect): void {
    const texture = new Texture({ source: from.source, frame: new Rectangle(rect.x, rect.y, rect.w, rect.h) });
    this.copySprite.texture = texture;
    this.copySprite.position.set(rect.x, rect.y);
    this.app.renderer.render({ container: this.copySprite, target: to, clear: false });
    this.copySprite.texture = Texture.EMPTY;
    texture.destroy();
  }

  private fill(target: RenderTexture, rect: PixelRect, color: number): void {
    this.pen.clear();
    this.pen.rect(rect.x, rect.y, rect.w, rect.h).fill({ color, alpha: 1 });
    this.app.renderer.render({ container: this.pen, target, clear: false });
    this.pen.clear();
  }

  private fullRect(): PixelRect {
    return { x: 0, y: 0, w: this.width, h: this.height };
  }

  private clampRect(rect: PixelRect | undefined): PixelRect | undefined {
    if (!rect) return undefined;
    const x0 = Math.max(0, Math.floor(rect.x));
    const y0 = Math.max(0, Math.floor(rect.y));
    const x1 = Math.min(this.width, Math.ceil(rect.x + rect.w));
    const y1 = Math.min(this.height, Math.ceil(rect.y + rect.h));
    if (x1 <= x0 || y1 <= y0) return undefined;
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }

  private makeBase(options: InkWashOptions): Texture {
    if (options.transparent) return Texture.WHITE;
    const pixels = options.paper === false
      ? solid(this.width, this.height, this.background)
      : inkPaperPixels(this.width, this.height, this.background, this.seed);
    const source = new BufferImageSource({
      resource: pixels, width: this.width, height: this.height,
      format: 'rgba8unorm', alphaMode: 'no-premultiply-alpha', scaleMode: 'linear',
    });
    return new Texture({ source });
  }

  /** mapFrag for one rectangle at the current frame clock. */
  private refreshForce(rect: PixelRect): void {
    this.forceMap.set('time', this.frameCount / 60);
    this.pass(this.forceMap, this.force, rect);
  }

  /**
   * Post passes in inkEngine's order: metallic (on the clean composite), distort, then the flow
   * commit. The stable picture after flowEnd is composite(flow(final)), not the in-between frame
   * that flowed the already-composited image, so flow is written into final and typeMap and the
   * rectangle is composited again.
   */
  private applyFinish(finish: InkFinish): void {
    const rect = finish.distort?.extent === 'frame' ? this.fullRect() : this.effectRect();
    if (!rect) return;
    if (finish.metallic) this.applyMetallic(rect, finish.metallic);
    if (finish.distort) this.applyDistort(rect, finish.distort);
    if (finish.flow) this.applyFlow(finish.flow);
  }

  private effectRect(): PixelRect | undefined {
    const ink = this.lastRect;
    if (!ink) return undefined;
    // strokeBounds are top-left. The shader compares them with a bottom-left UV, the same quirk as
    // inkEngine, so the pass has to cover both the stroke and its vertical mirror.
    const mirrorY = this.height - (ink.y + ink.h);
    const y = Math.min(ink.y, mirrorY);
    const y1 = Math.max(ink.y + ink.h, mirrorY + ink.h);
    return this.clampRect({ x: ink.x - 24, y: y - 24, w: ink.w + 48, h: y1 - y + 48 });
  }

  private pathBoundsNormalized(): { minX: number; minY: number; maxX: number; maxY: number } | undefined {
    const b = this.pathBounds;
    if (!(b.maxX >= b.minX)) return undefined;
    const pad = 20;
    // Same numbers inkEngine uploads (top-left, padded, divided by the canvas). The shader compares
    // them with a bottom-left UV on both sides, so the region that actually moves matches.
    return {
      minX: Math.max(0, b.minX - pad) / this.width,
      minY: Math.max(0, b.minY - pad) / this.height,
      maxX: Math.min(1, b.maxX + pad) / this.width,
      maxY: Math.min(1, b.maxY + pad) / this.height,
    };
  }

  private applyFlow(flow: InkFlowFinish): void {
    const bounds = this.pathBoundsNormalized();
    const rect = this.effectRect();
    if (!bounds || !rect) return;
    const iterations = Math.max(0, Math.floor(flow.iterations));
    const flowSeed = flow.seed ?? (this.strokeSeed % 1000000);
    // replayFlowEffect / the commit pass: blendVol grows by 10% per iteration, one pass, then composite.
    this.flow.set('blendType', flow.blendType);
    this.flow.set('blendVol', 100 * (1 + iterations * 0.1));
    this.flow.set('radSeed', flowSeed * 0.001);
    this.flow.setVec('strokeBounds', bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
    this.flow.set('seed', flowSeed * 0.0001);
    this.flow.set('iTime', this.frameCount / 60);
    this.flow.set('isTypeMapMode', 0);
    this.flow.bind('tex0', this.final.source);
    this.flow.bind('lastStrokeTex', this.lastStroke.source);
    this.pass(this.flow, this.scratch, rect);
    this.copy(this.scratch, this.final, rect);
    this.flow.set('isTypeMapMode', 1);
    this.flow.bind('tex0', this.typeMap.source);
    this.pass(this.flow, this.scratch, rect);
    this.copy(this.scratch, this.typeMap, rect);
    this.pass(this.composite, this.display, rect);
  }

  private applyDistort(rect: PixelRect, distort: InkDistortFinish): void {
    this.refreshForce(rect);
    this.distort.bind('tex0', this.display.source);
    this.distort.bind('forceMap', this.force.source);
    this.distort.set('time', (this.frameCount / 60) * 0.005);
    this.distort.set('distortEnabled', 1);
    this.distort.set('displacementB', distort.displacementB ?? 20);
    this.distort.set('displacementC', distort.displacementC ?? 50);
    this.pass(this.distort, this.scratch, rect);
    this.copy(this.scratch, this.display, rect);
  }

  private applyMetallic(rect: PixelRect, metallic: InkMetallicFinish): void {
    const tint = metallic.tint ?? [0.72, 0.5, 0.35];
    let pixels: Uint8ClampedArray;
    try {
      const shot = this.app.renderer.extract.pixels({ target: this.display });
      pixels = shot.pixels;
      if (shot.width !== this.width || shot.height !== this.height) return;
    } catch {
      return;
    }
    // Scan only this stroke. The whole sheet would offer darker ink (the ground, a tassel)
    // and the bites would leave the blade.
    const focus = this.lastRect ?? rect;
    const crop = new Uint8Array(focus.w * focus.h * 4);
    for (let y = 0; y < focus.h; y++) {
      const src = ((focus.y + y) * this.width + focus.x) * 4;
      crop.set(pixels.subarray(src, src + focus.w * 4), y * focus.w * 4);
    }
    const bites = scanInkBites(
      crop, focus.w, focus.h, focus.x, focus.y, this.width, this.height, this.background,
      this.strokeSeed, metallic.size ?? 10, tint,
    );
    if (!bites.length) return;
    this.paintBites(bites);
    const t = this.frameCount / 600;
    this.metallic.bind('tex0', this.display.source);
    this.metallic.bind('bugsMask', this.bugsMask.source);
    this.metallic.bind('bugsData', this.bugsData.source);
    this.metallic.set('time', this.frameCount * 1000 / 60);
    this.metallic.setVec('lightPos', 0.5 + inkSin(t * 0.7) * 0.3, 0.4 + inkCos(t * 0.5) * 0.25);
    this.metallic.setVec('metalTint', tint[0], tint[1], tint[2]);
    const cover = this.clampRect({
      x: rect.x - 48, y: rect.y - 48, w: rect.w + 96, h: rect.h + 96,
    }) ?? rect;
    this.pass(this.metallic, this.scratch, cover);
    this.copy(this.scratch, this.display, cover);
  }

  /**
   * updateBugTextures. Canvas 2D fills the outline the way p5's beginShape does; Pixi's polygon
   * fill triangulates a self-intersecting lightning ribbon into a solid blob.
   */
  private paintBites(bites: readonly InkBite[]): void {
    const mask = document.createElement('canvas');
    const data = document.createElement('canvas');
    mask.width = data.width = this.width;
    mask.height = data.height = this.height;
    const maskCtx = mask.getContext('2d');
    const dataCtx = data.getContext('2d');
    if (!maskCtx || !dataCtx) return;
    for (const bite of bites) {
      paintBite(maskCtx, bite, `rgb(${Math.round(bite.r)},${Math.round(bite.g)},${Math.round(bite.b)})`);
      const r = Math.round(clamp01(bite.x / this.width) * 255);
      const g = Math.round(clamp01(bite.y / this.height) * 255);
      const b = Math.round(clamp01(bite.size / this.width) * 255);
      paintBite(dataCtx, bite, `rgb(${r},${g},${b})`);
    }
    this.blitCanvas(mask, this.bugsMask);
    this.blitCanvas(data, this.bugsData);
  }

  private blitCanvas(canvas: HTMLCanvasElement, target: RenderTexture): void {
    const image = canvas.getContext('2d')?.getImageData(0, 0, this.width, this.height);
    if (!image) return;
    const source = new BufferImageSource({
      resource: new Uint8Array(image.data.buffer), width: this.width, height: this.height,
      format: 'rgba8unorm', alphaMode: 'no-premultiply-alpha', scaleMode: 'linear',
    });
    const texture = new Texture({ source });
    const sprite = new Sprite(texture);
    this.app.renderer.render({ container: sprite, target, clear: true, clearColor: [0, 0, 0, 0] });
    sprite.destroy();
    texture.destroy(true);
  }

  /** randomizeForceMap draws, from the sheet seed. */
  private forceParams(): ForceMapParams {
    const rng = new P5Random(this.seed);
    const seeds: number[] = [];
    const scales: number[] = [];
    const amplitudes: number[] = [];
    const phases: number[] = [];
    const vortexScales: number[] = [];
    const clusterScales: number[] = [];
    for (let i = 0; i < 4; i++) seeds.push(rng.random(100 + i * 100, 200 + i * 100));
    for (let i = 0; i < 3; i++) {
      scales.push(rng.random(0.001 + i * 0.002, 0.003 + i * 0.005));
      amplitudes.push(rng.random(0.1 + i * 0.1, 0.4 + i * 0.2));
      phases.push(rng.random(0, TWO_PI));
    }
    for (let i = 0; i < 2; i++) {
      vortexScales.push(rng.random(0.005 + i * 0.003, 0.015 + i * 0.003));
      clusterScales.push(rng.random(0.0005 + i * 0.0003, 0.002 + i * 0.0005));
    }
    return { seeds, scales, amplitudes, phases, vortexScales, clusterScales };
  }
}

function grow(bounds: Bounds, minX: number, minY: number, maxX: number, maxY: number): void {
  if (minX < bounds.minX) bounds.minX = minX;
  if (minY < bounds.minY) bounds.minY = minY;
  if (maxX > bounds.maxX) bounds.maxX = maxX;
  if (maxY > bounds.maxY) bounds.maxY = maxY;
}

function toRect(bounds: Bounds, margin: number): PixelRect | undefined {
  if (!(bounds.maxX >= bounds.minX)) return undefined;
  return {
    x: bounds.minX - margin, y: bounds.minY - margin,
    w: bounds.maxX - bounds.minX + margin * 2, h: bounds.maxY - bounds.minY + margin * 2,
  };
}

function round2Point(point: InkPoint): InkPoint {
  return { x: Math.round(point.x * 100) / 100, y: Math.round(point.y * 100) / 100 };
}

function paintBite(ctx: CanvasRenderingContext2D, bite: InkBite, style: string): void {
  ctx.fillStyle = style;
  ctx.beginPath();
  const first = bite.vertices[0];
  if (!first || bite.vertices.length < 3) {
    ctx.rect(bite.x - bite.size / 2, bite.y - bite.size / 2, bite.size, bite.size);
    ctx.fill();
    return;
  }
  ctx.moveTo(bite.x + first.x, bite.y + first.y);
  for (let i = 1; i < bite.vertices.length; i++) {
    const v = bite.vertices[i];
    if (v) ctx.lineTo(bite.x + v.x, bite.y + v.y);
  }
  ctx.closePath();
  ctx.fill();
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function solid(width: number, height: number, rgb: readonly [number, number, number]): Uint8Array {
  const data = new Uint8Array(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = rgb[0];
    data[i + 1] = rgb[1];
    data[i + 2] = rgb[2];
    data[i + 3] = 255;
  }
  return data;
}
