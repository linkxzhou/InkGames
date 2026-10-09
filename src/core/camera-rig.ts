import { OrthographicCamera, PerspectiveCamera, type Camera } from 'three';
import { inkCameraDistance } from './ink-camera';
import type { TerrainBounds } from './terrain-field';

/**
 * Side-view perspective. camera.up is (0, -1, 0) so world +y stays down the screen
 * and a body position can be copied straight onto a mesh.
 * zoom 1.1 moves the camera closer. The orthographic camera is only a debug toggle.
 */
export class CameraRig {
  readonly camera: PerspectiveCamera;
  readonly ortho: OrthographicCamera;
  useOrthographic = false;
  private focusX: number;
  private focusY: number;
  private baseDistance: number;
  private zoomValue = 1;
  private viewWidth: number;
  private viewHeight: number;

  constructor(width: number, height: number, focusX: number, focusY: number) {
    this.viewWidth = width;
    this.viewHeight = height;
    this.focusX = focusX;
    this.focusY = focusY;
    this.baseDistance = inkCameraDistance(height);
    this.camera = new PerspectiveCamera(60, width / Math.max(1, height), 0.1, 8000);
    this.camera.up.set(0, -1, 0);
    this.ortho = new OrthographicCamera(0, width, height, 0, -2000, 2000);
    this.ortho.up.set(0, -1, 0);
    this.place();
  }

  get zoom(): number { return this.zoomValue; }

  set zoom(value: number) {
    this.zoomValue = value > 0.2 ? value : 0.2;
    this.place();
  }

  get distance(): number { return this.baseDistance / this.zoomValue; }

  get active(): Camera { return this.useOrthographic ? this.ortho : this.camera; }

  snap(x: number, y: number): void {
    this.focusX = x;
    this.focusY = y;
    this.place();
  }

  /** Five percent smoothing, then keep the view inside the level. */
  follow(x: number, y: number, bounds: TerrainBounds): void {
    this.focusX += (x - this.focusX) * 0.05;
    this.focusY += (y - this.focusY) * 0.05;
    this.focusX = clampFocus(this.focusX, bounds.minX, bounds.maxX, this.viewWidth);
    this.focusY = clampFocus(this.focusY, bounds.minY, bounds.maxY, this.viewHeight);
    this.place();
  }

  resize(width: number, height: number): void {
    this.viewWidth = width;
    this.viewHeight = height;
    this.baseDistance = inkCameraDistance(height);
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
    this.ortho.left = 0;
    this.ortho.right = width;
    this.ortho.top = height;
    this.ortho.bottom = 0;
    this.ortho.updateProjectionMatrix();
    this.place();
  }

  private place(): void {
    const z = this.distance;
    this.camera.up.set(0, -1, 0);
    this.camera.position.set(this.focusX, this.focusY, z);
    this.camera.lookAt(this.focusX, this.focusY, 0);
    this.ortho.up.set(0, -1, 0);
    this.ortho.position.set(this.focusX, this.focusY, z);
    this.ortho.lookAt(this.focusX, this.focusY, 0);
  }
}

function clampFocus(value: number, min: number, max: number, view: number): number {
  const half = view / 2;
  const low = min + half;
  const high = max - half;
  if (low > high) return (min + max) / 2;
  if (value < low) return low;
  if (value > high) return high;
  return value;
}
