import {
  DoubleSide, LinearSRGBColorSpace, Mesh, MeshBasicMaterial, PlaneGeometry, Scene, WebGLRenderer,
} from 'three';
import { AudioBus } from './audio-bus';
import type { EffectCue, ScenePackage } from './narrative-types';
import { CameraRig } from './camera-rig';
import { SceneDirector, type DirectorView } from './scene-director';
import { InkSurface, type InkSurfaceSnapshot } from './ink-surface';
import { InkText } from './ink-text';
import type { SaveStorage } from './save-store';
import type { InkFinish } from './ink-stroke';
import type { StrokePulse } from './cutscene-player';

export interface StoryStageOptions {
  readonly canvas: HTMLCanvasElement;
  readonly pack: ScenePackage;
  readonly storage: SaveStorage;
  readonly pixelRatio?: number;
  readonly onContext?: (state: 'lost' | 'restored') => void;
}

interface LayerSlot {
  surface: InkSurface;
  mesh: Mesh;
  options: { width: number; height: number; seed: number; paper: boolean; background: readonly [number, number, number]; transparent: boolean };
}

/**
 * one WebGL canvas for a scene package. Pixi is not attached to this canvas.
 * A lost context pauses playback. webglcontextrestored rebuilds the ink targets
 * and copies the last CPU snapshot back.
 */
export class StoryStage {
  readonly director: SceneDirector;
  readonly scene = new Scene();
  readonly width: number;
  readonly height: number;
  private readonly renderer: WebGLRenderer;
  private readonly cameraRig: CameraRig;
  private readonly canvas: HTMLCanvasElement;
  private readonly layers = new Map<string, LayerSlot>();
  private readonly text: InkText;
  private readonly textMesh: Mesh;
  private readonly fadeMesh: Mesh;
  private readonly onLost: (event: Event) => void;
  private readonly onRestored: () => void;
  private loseExt: WEBGL_lose_context | null = null;
  private snaps = new Map<string, InkSurfaceSnapshot>();
  private readonly live = new Set<LayerSlot>();
  private rejected = 0;
  private lost = false;
  private restoreCount = 0;
  private disposed = false;
  private lastError = 0;

  constructor(options: StoryStageOptions) {
    this.canvas = options.canvas;
    const cut = options.pack.opening;
    this.width = cut.canvas.width;
    this.height = cut.canvas.height;
    const ratio = options.pixelRatio ?? 1;
    this.renderer = new WebGLRenderer({
      canvas: this.canvas, antialias: false, alpha: false, depth: true, stencil: false,
      powerPreference: 'high-performance', preserveDrawingBuffer: true,
    });
    this.renderer.outputColorSpace = LinearSRGBColorSpace;
    this.renderer.setClearColor(0xd6cebc, 1);
    this.renderer.setPixelRatio(ratio);
    this.renderer.setSize(this.width, this.height, false);
    this.cameraRig = new CameraRig(this.width, this.height, this.width / 2, this.height / 2);
    this.director = new SceneDirector(options.pack, options.storage, new AudioBus());
    const paper = cut.canvas.paper;
    for (const layer of cut.layers) {
      if (layer.kind === 'screen') continue;
      const slot = this.makeLayer(layer.id, layer.z, layer.paper === true, paper, layer.transparent === true, cut.canvas.seed);
      this.layers.set(layer.id, slot);
      this.scene.add(slot.mesh);
    }
    if (!this.layers.has('sheet')) {
      const slot = this.makeLayer('sheet', 0, true, paper, false, cut.canvas.seed);
      this.layers.set('sheet', slot);
      this.scene.add(slot.mesh);
    }
    this.text = new InkText(this.width, this.height);
    this.textMesh = new Mesh(new PlaneGeometry(this.width, this.height), new MeshBasicMaterial({
      map: this.text.texture, transparent: true, depthWrite: false, side: DoubleSide, toneMapped: false,
    }));
    this.textMesh.position.set(this.width / 2, this.height / 2, 1);
    this.textMesh.renderOrder = 10;
    this.scene.add(this.textMesh);
    this.fadeMesh = new Mesh(new PlaneGeometry(this.width, this.height), new MeshBasicMaterial({
      color: 0x14110e, transparent: true, opacity: 1, depthWrite: false, side: DoubleSide,
    }));
    this.fadeMesh.position.set(this.width / 2, this.height / 2, 2);
    this.fadeMesh.renderOrder = 11;
    this.scene.add(this.fadeMesh);
    this.loseExt = this.renderer.getContext().getExtension('WEBGL_lose_context');
    this.onLost = event => {
      event.preventDefault();
      this.lost = true;
      options.onContext?.('lost');
    };
    this.onRestored = () => {
      this.rebuildGpu();
      options.onContext?.('restored');
    };
    this.canvas.addEventListener('webglcontextlost', this.onLost);
    this.canvas.addEventListener('webglcontextrestored', this.onRestored);
  }

  get contextLost(): boolean { return this.lost; }
  get glError(): number { return this.lastError; }
  get restores(): number { return this.restoreCount; }
  /** Pulses dropped because they could not be applied to a free surface. */
  get rejectedPulses(): number { return this.rejected; }

  captureRestorePoint(): void {
    if (this.lost || this.disposed) return;
    this.snaps.clear();
    for (const [id, slot] of this.layers) this.snaps.set(id, slot.surface.snapshot());
  }

  simulateContextLoss(): void {
    this.captureRestorePoint();
    this.loseExt?.loseContext();
  }

  simulateContextRestore(): void {
    this.loseExt?.restoreContext();
  }

  step(): DirectorView {
    if (this.disposed) return this.director.view();
    if (this.lost) return this.director.view();
    const view = this.director.step();
    this.apply(view);
    return view;
  }

  fastForward(frames: number): DirectorView {
    const pulses = this.director.fastForward(frames);
    this.paintPulses(pulses);
    const view = this.director.view();
    this.present(view);
    return view;
  }

  confirm(): DirectorView {
    this.director.confirm();
    return this.director.view();
  }

  choose(choiceId: string): DirectorView {
    this.director.choose(choiceId);
    return this.director.view();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.canvas.removeEventListener('webglcontextlost', this.onLost);
    this.canvas.removeEventListener('webglcontextrestored', this.onRestored);
    for (const slot of this.layers.values()) slot.surface.dispose();
    this.text.dispose();
    this.director.audio.dispose();
    this.renderer.dispose();
  }

  private apply(view: DirectorView): void {
    const tick = view.tick;
    if (tick) {
      this.paintPulses(tick.strokes);
      for (const effect of tick.effects) this.applyEffect(effect);
      this.text.setVignette(tick.vignette);
    }
    for (const slot of this.layers.values()) slot.surface.update();
    this.present(view);
  }

  private present(view: DirectorView, drain = false): void {
    const tick = view.tick;
    this.text.render(tick?.texts ?? [], this.director.subtitles);
    const fade = tick?.fade ?? 1;
    const fadeMat = this.fadeMesh.material;
    if (fadeMat instanceof MeshBasicMaterial) {
      fadeMat.opacity = 1 - fade;
      this.fadeMesh.visible = fadeMat.opacity > 0.02;
    }
    if (tick) {
      this.cameraRig.zoom = tick.camera.zoom;
      this.cameraRig.snap(this.width / 2 + tick.camera.x + tick.camera.shake, this.height / 2 + tick.camera.y);
    }
    this.renderer.setRenderTarget(null);
    const buffer = this.renderer.domElement;
    this.renderer.setViewport(0, 0, buffer.width, buffer.height);
    const gl = this.renderer.getContext();
    if (drain) {
      for (let i = 0; i < 8 && gl.getError() !== 0; i++) { /* disposing a lost context leaves INVALID_OPERATION */ }
    }
    this.renderer.render(this.scene, this.cameraRig.active);
    this.lastError = gl.getError();
  }

  private paintPulses(pulses: readonly StrokePulse[]): void {
    for (const pulse of pulses) {
      const slot = this.layers.get(pulse.layer === 'overlay' ? 'sheet' : pulse.layer) ?? this.layers.get('sheet');
      if (!slot) continue;
      const stroke = pulse.stroke;
      const point = pulse.point;
      // A live run owns one surface at a time. A second begin on the same layer
      // while one is open cannot be expressed by InkSurface, so it is reported
      // instead of silently interleaving two strokes.
      if (pulse.mode === 'begin') {
        if (this.live.has(slot)) { this.rejected += 1; continue; }
        this.live.add(slot);
        slot.surface.setBrush(stroke.brush);
        slot.surface.setColor(stroke.color);
        if (!point) { this.live.delete(slot); this.rejected += 1; continue; }
        slot.surface.beginStroke(point.x, point.y, stroke.seed);
        continue;
      }
      if (pulse.mode === 'point') {
        if (!this.live.has(slot) || !point) { this.rejected += 1; continue; }
        slot.surface.addPoint(point.x, point.y);
        continue;
      }
      if (pulse.mode === 'end') {
        if (!this.live.has(slot)) { this.rejected += 1; continue; }
        this.live.delete(slot);
        slot.surface.endStroke();
        slot.surface.update();
        if (stroke.finish && pulse.endOfStroke === true) slot.surface.replayEffect(stroke.finish);
        continue;
      }
      if (pulse.mode === 'instant') {
        if (this.live.has(slot)) { this.rejected += 1; continue; }
        slot.surface.paint({ brush: stroke.brush, color: stroke.color, points: stroke.points, seed: stroke.seed, finish: stroke.finish });
      }
    }
  }

  private applyEffect(effect: EffectCue): void {
    const slot = this.layers.get(effect.layer ?? 'sheet') ?? this.layers.get('sheet');
    if (!slot) return;
    const finish = finishFor(effect);
    if (finish) slot.surface.replayEffect(finish);
    if (effect.kind === 'wash') slot.surface.wash(this.width / 2, this.height / 2, 80);
  }

  private makeLayer(id: string, z: number, paper: boolean, background: readonly [number, number, number], transparent: boolean, seed: number): LayerSlot {
    const options = { width: this.width, height: this.height, seed: seed + id.length, paper, background, transparent: paper ? false : transparent };
    const surface = new InkSurface(this.renderer, options);
    const mesh = new Mesh(new PlaneGeometry(this.width, this.height), new MeshBasicMaterial({
      map: surface.texture, transparent: !paper, depthWrite: paper, side: DoubleSide, toneMapped: false,
    }));
    mesh.position.set(this.width / 2, this.height / 2, z);
    mesh.renderOrder = z >= 40 ? 3 : z < 0 ? 0 : 1;
    return { surface, mesh, options };
  }

  private rebuildGpu(): void {
    for (const [id, slot] of this.layers) {
      try { slot.surface.dispose(); } catch { /* the lost context already dropped the buffers */ }
      slot.surface = new InkSurface(this.renderer, slot.options);
      const snap = this.snaps.get(id);
      if (snap) slot.surface.restore(snap);
      const material = slot.mesh.material;
      if (material instanceof MeshBasicMaterial) {
        material.map = slot.surface.texture;
        material.needsUpdate = true;
      }
    }
    this.text.texture.needsUpdate = true;
    const textMat = this.textMesh.material;
    if (textMat instanceof MeshBasicMaterial) textMat.needsUpdate = true;
    this.scene.traverse(obj => {
      if (!('material' in obj)) return;
      const material = obj.material;
      const list = Array.isArray(material) ? material : [material];
      for (const item of list) item.needsUpdate = true;
    });
    this.lost = false;
    this.restoreCount += 1;
    this.present(this.director.view(), true);
  }
}

function num(value: unknown, fallback: number): number {
  return typeof value === 'number' ? value : fallback;
}

function finishFor(effect: EffectCue): InkFinish | undefined {
  const params = effect.params ?? {};
  if (effect.kind === 'flow') {
    return { flow: { blendType: num(params.blendType, 0), iterations: num(params.iterations, 4), seed: num(params.seed, 1) } };
  }
  if (effect.kind === 'distort') {
    const extent = params.extent === 'frame' ? 'frame' : 'stroke';
    return { distort: { displacementB: num(params.displacementB, 20), displacementC: num(params.displacementC, 50), extent } };
  }
  if (effect.kind === 'metallic') return { metallic: { size: num(params.size, 10) } };
  return undefined;
}
