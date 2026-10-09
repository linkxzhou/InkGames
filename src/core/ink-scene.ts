import { DoubleSide, Mesh, MeshBasicMaterial, OrthographicCamera, Plane, PlaneGeometry, Scene, Vector3, WebGLRenderer } from 'three';
import { InkSurface } from './ink-surface';
import type { InkStrokeRequest } from './ink-stroke';

export interface InkSceneLayer {
  readonly id: string;
  readonly width: number;
  readonly height: number;
  readonly strokes: readonly InkStrokeRequest[];
  /** Rotation origin in layer-local pixels; defaults to the layer centre. */
  readonly pivot?: { readonly x: number; readonly y: number };
}
export interface InkLayerPose {
  /** Position of the pivot in scene pixels. */
  readonly x: number;
  readonly y: number;
  readonly scale?: number;
  readonly rotation?: number;
  readonly opacity?: number;
  /** Draw order; higher values sit in front. Defaults to registration order. */
  readonly order?: number;
}
/** Rectangular clip in scene pixels; anything outside is not drawn. */
export interface InkClipRect { readonly x: number; readonly y: number; readonly width: number; readonly height: number; }
/** One procedural wet-spread impulse on a layer's own ink surface. */
/** One wash impulse on a layer's own surface. */
export interface InkSurfaceWashStep { readonly x: number; readonly y: number; readonly radius: number; }

interface Slot { surface: InkSurface; mesh: Mesh<PlaneGeometry, MeshBasicMaterial>; pivot: { x: number; y: number }; }

/** Procedurally painted layers, never external image textures. */
export class InkScene {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new OrthographicCamera(0, 1280, 0, 720, .1, 100);
  private readonly slots = new Map<string, Slot>();
  private disposed = false;
  private lost = false;
  private readonly onLost = (event: Event): void => {
    event.preventDefault();
    this.lost = true;
  };
  private readonly onRestored = (): void => {
    this.lost = false;
  };
  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({ canvas, antialias: false });
    this.renderer.setSize(1280, 720, false);
    this.renderer.setClearColor(0xdcd4be);
    this.renderer.localClippingEnabled = true;
    this.camera.position.z = 50;
    canvas.addEventListener('webglcontextlost', this.onLost);
    canvas.addEventListener('webglcontextrestored', this.onRestored);
  }
  get contextLost(): boolean { return this.lost; }
  has(id: string): boolean { return this.slots.has(id); }
  async add(layer: InkSceneLayer): Promise<void> {
    if (this.disposed || this.slots.has(layer.id)) throw new Error('墨层重复或场景已释放');
    const pivot = layer.pivot ?? { x: layer.width / 2, y: layer.height / 2 };
    if (pivot.x < 0 || pivot.y < 0 || pivot.x > layer.width || pivot.y > layer.height) throw new Error(`pivot 超出墨层范围：${layer.id}`);
    const surface = new InkSurface(this.renderer, { width: layer.width, height: layer.height, seed: 17, paper: false, transparent: true });
    const geometry = new PlaneGeometry(layer.width, layer.height);
    // Shift the quad so the mesh origin sits on the pivot; rotation then hinges there.
    geometry.translate(layer.width / 2 - pivot.x, layer.height / 2 - pivot.y, 0);
    const mesh = new Mesh(geometry, new MeshBasicMaterial({ map: surface.texture, transparent: true, depthWrite: false, side: DoubleSide, toneMapped: false }));
    mesh.renderOrder = this.slots.size;
    mesh.visible = false;
    this.slots.set(layer.id, { surface, mesh, pivot });
    this.scene.add(mesh);
    for (const stroke of layer.strokes) {
      // A navigation away must not report success for a half-painted layer.
      if (this.disposed) throw new Error('场景已释放');
      surface.paint(stroke);
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    }
  }
  pose(id: string, pose: InkLayerPose): void {
    if (this.disposed) return;
    const slot = this.slots.get(id);
    if (!slot) throw new Error(`未知墨层 ${id}`);
    slot.mesh.position.set(pose.x, pose.y, 0);
    slot.mesh.scale.setScalar(pose.scale ?? 1);
    slot.mesh.rotation.z = pose.rotation ?? 0;
    slot.mesh.material.opacity = pose.opacity ?? 1;
    if (pose.order !== undefined) slot.mesh.renderOrder = pose.order;
    slot.mesh.visible = slot.mesh.material.opacity > 0;
  }
  /**
   * Real ink feedback on a layer's own surface, not a scaled decal.
   * The caller controls when and how often this runs so playback stays deterministic.
   */
  wash(id: string, steps: readonly InkSurfaceWashStep[]): void {
    if (this.disposed) return;
    const slot = this.slots.get(id);
    if (!slot) throw new Error(`未知墨层 ${id}`);
    for (const step of steps) slot.surface.wash(step.x, step.y, step.radius);
  }
  /**
   * Clip a layer to a scene-space rectangle, or clear it with null.
   * The rectangle is converted into the layer's local space and applied as four
   * axis-aligned planes using the local-space bounding box of the corners, so a
   * rotated layer is clipped to the box that contains the requested region.
   */
  clip(id: string, rect: InkClipRect | null): void {
    if (this.disposed) return;
    const slot = this.slots.get(id);
    if (!slot) throw new Error(`未知墨层 ${id}`);
    if (!rect) { slot.mesh.material.clippingPlanes = null; slot.mesh.material.needsUpdate = true; return; }
    if (rect.width <= 0 || rect.height <= 0) throw new Error('裁剪矩形必须为正');
    slot.mesh.updateMatrixWorld();
    const inverse = slot.mesh.matrixWorld.clone().invert();
    const xs: number[] = [];
    const ys: number[] = [];
    for (const [cx, cy] of [[rect.x, rect.y], [rect.x + rect.width, rect.y], [rect.x, rect.y + rect.height], [rect.x + rect.width, rect.y + rect.height]] as const) {
      const point = new Vector3(cx, cy, 0).applyMatrix4(inverse);
      xs.push(point.x);
      ys.push(point.y);
    }
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    slot.mesh.material.clippingPlanes = [
      new Plane(new Vector3(1, 0, 0), -minX),
      new Plane(new Vector3(-1, 0, 0), maxX),
      new Plane(new Vector3(0, 1, 0), -minY),
      new Plane(new Vector3(0, -1, 0), maxY),
    ];
    slot.mesh.material.needsUpdate = true;
  }
  render(): void { if (!this.disposed && !this.lost) this.renderer.render(this.scene, this.camera); }
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    const canvas = this.renderer.domElement;
    canvas.removeEventListener('webglcontextlost', this.onLost);
    canvas.removeEventListener('webglcontextrestored', this.onRestored);
    for (const slot of this.slots.values()) { slot.surface.dispose(); slot.mesh.geometry.dispose(); slot.mesh.material.dispose(); }
    this.slots.clear();
    this.renderer.dispose();
  }
}
