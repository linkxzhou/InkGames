import {
  BoxGeometry, BufferGeometry, CircleGeometry, DoubleSide, Float32BufferAttribute, GLSL3, Group, LinearSRGBColorSpace,
  Matrix4, Mesh, MeshBasicMaterial, Plane, RawShaderMaterial, Raycaster, Scene, Vector2, Vector3, WebGLRenderer,
  type WebGLRenderer as Renderer,
} from 'three';
import { BambooView } from './bamboo-rig';
import { CameraRig } from './camera-rig';
import { createCunRock, cunOutlineWidth, type CunKind, type CunRock } from './cun-material';
import { INK_LAYER_Z, inkCameraDistance } from './ink-camera';
import { InkSurface, type InkSurfaceOptions, type InkSurfaceSnapshot } from './ink-surface';
import { Playfield } from './playfield';
import { TerrainSeep, terrainRibbonGeometry } from './terrain-seep';
import type { TerrainPoint } from './terrain-field';

export interface InkViewOptions {
  readonly canvas: HTMLCanvasElement;
  readonly width?: number;
  readonly height?: number;
  readonly seed?: number;
  readonly pixelRatio?: number;
  readonly onContext?: (state: 'lost' | 'restored') => void;
}

const PAPER: readonly [number, number, number] = [214, 206, 188];

const GROUND_VERT = `
precision highp float;
in vec3 position;
in vec2 uv;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProj;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = uProj * uView * uModel * vec4(position, 1.0);
}
`;

const GROUND_FRAG = `
precision highp float;
in vec2 vUv;
out vec4 finalColor;
uniform sampler2D uSeep;
void main() {
  float dry = texture(uSeep, vUv).r;
  vec3 paper = vec3(0.78, 0.74, 0.64);
  vec3 ink = vec3(0.07, 0.07, 0.08);
  finalColor = vec4(mix(ink, paper, smoothstep(0.04, 0.9, dry)), 1.0);
}
`;

const BACK_VERT = `
precision highp float;
in vec3 position;
in vec2 uv;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProj;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = uProj * uView * uModel * vec4(position, 1.0);
}
`;

const BACK_FRAG = `
precision highp float;
in vec2 vUv;
out vec4 finalColor;
uniform sampler2D uMap;
void main() { finalColor = texture(uMap, vUv); }
`;

interface BambooSlot { id: number; view: BambooView }

/**
 * three.js side-scroller view. Matter stays in Playfield. This class copies interpolated
 * body positions onto meshes and does not run a second clock.
 * A lost WebGL context pauses the playfield. webglcontextrestored rebuilds the ink
 * targets, copies the last CPU snapshots back, and draws one frame.
 */
export class InkView {
  readonly playfield = new Playfield();
  private surfaceSlot: InkSurface;
  readonly cameraRig: CameraRig;
  readonly scene = new Scene();
  readonly width: number;
  readonly height: number;
  private readonly renderer: WebGLRenderer;
  private readonly canvas: HTMLCanvasElement;
  private readonly hero = new Group();
  private readonly rocks: CunRock[] = [];
  private readonly bamboos: BambooSlot[] = [];
  private readonly raycaster = new Raycaster();
  private readonly ndc = new Vector2();
  private readonly plane = new Plane(new Vector3(0, 0, 1), 0);
  private readonly hitPoint = new Vector3();
  private readonly backdrop: Mesh;
  private seep: TerrainSeep | undefined;
  private ground: Mesh | undefined;
  private groundMat: RawShaderMaterial | undefined;
  private bridgeSig = '';
  private readonly bridgeMeshes: Mesh[] = [];
  private lost = false;
  private disposed = false;
  private lastError = 0;
  private restoreCount = 0;
  private restorePoint: InkSurfaceSnapshot | undefined;
  private seepPixels: Uint8Array | undefined;
  private loseExt: WEBGL_lose_context | null = null;
  private readonly surfaceOptions: InkSurfaceOptions;
  private readonly onContext: ((state: 'lost' | 'restored') => void) | undefined;
  private readonly onLost: (event: Event) => void;
  private readonly onRestored: () => void;

  constructor(options: InkViewOptions) {
    this.canvas = options.canvas;
    this.width = options.width ?? 1280;
    this.height = options.height ?? 720;
    const ratio = options.pixelRatio ?? Math.min(2, window.devicePixelRatio || 1);
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      alpha: false,
      depth: true,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    this.renderer.outputColorSpace = LinearSRGBColorSpace;
    this.renderer.setClearColor(0xd6cebc, 1);
    this.renderer.setPixelRatio(ratio);
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.autoClear = true;
    this.cameraRig = new CameraRig(this.width, this.height, this.width / 2, this.height / 2);
    this.surfaceOptions = {
      width: this.width, height: this.height, seed: options.seed ?? 1234567890,
      paper: true, background: PAPER, transparent: false,
    };
    this.surfaceSlot = new InkSurface(this.renderer, this.surfaceOptions);
    this.backdrop = new Mesh(centeredQuad(), backdropMaterial(this.surfaceSlot.texture));
    this.backdrop.frustumCulled = false;
    this.backdrop.renderOrder = 0;
    this.scene.add(this.backdrop);
    this.hero.add(disc(18, 0x1a1a1a, 0));
    this.hero.add(disc(8, 0x141414, -28));
    this.hero.position.z = INK_LAYER_Z.actor;
    this.hero.renderOrder = 5;
    this.scene.add(this.hero);
    this.onContext = options.onContext;
    this.loseExt = this.renderer.getContext().getExtension('WEBGL_lose_context');
    this.onLost = event => {
      event.preventDefault();
      this.lost = true;
      this.playfield.pausedClock = true;
      this.onContext?.('lost');
    };
    this.onRestored = () => {
      this.rebuildGpu();
      this.onContext?.('restored');
    };
    this.canvas.addEventListener('webglcontextlost', this.onLost);
    this.canvas.addEventListener('webglcontextrestored', this.onRestored);
  }

  get surface(): InkSurface { return this.surfaceSlot; }
  get restores(): number { return this.restoreCount; }

  captureRestorePoint(): void {
    if (this.lost || this.disposed) return;
    this.restorePoint = this.surfaceSlot.snapshot();
    this.seepPixels = this.seep?.snapshot();
  }

  simulateContextLoss(): void {
    this.captureRestorePoint();
    this.loseExt?.loseContext();
  }

  simulateContextRestore(): void {
    this.loseExt?.restoreContext();
  }

  get contextLost(): boolean { return this.lost; }
  get glError(): number { return this.lastError; }

  addTerrain(points: readonly TerrainPoint[]): void {
    this.playfield.addPolyline(points);
    this.seep?.dispose();
    this.seep = new TerrainSeep(this.renderer, this.playfield.terrainPoints);
    this.ground?.geometry.dispose();
    this.groundMat?.dispose();
    this.groundMat = groundMaterial(this.seep.texture);
    this.ground = new Mesh(terrainRibbonGeometry(points, this.playfield.bounds()), this.groundMat);
    this.ground.frustumCulled = false;
    this.ground.renderOrder = 1;
    this.scene.add(this.ground);
  }

  addRock(kind: CunKind, x: number, y: number, radius: number, seed: number): void {
    const rock = createCunRock(kind, seed, radius);
    rock.object.position.set(x, y, 0);
    this.scene.add(rock.object);
    this.rocks.push(rock);
  }

  addBamboo(x: number, baseY: number, height: number): number {
    const id = this.playfield.addBamboo(x, baseY, height);
    const view = new BambooView(height);
    this.scene.add(view.object);
    this.bamboos.push({ id, view });
    return id;
  }

  addOneWay(x: number, y: number, width: number): void {
    this.playfield.addOneWay(x, y, width);
    const mesh = new Mesh(
      new BoxGeometry(width, 10, 8),
      new MeshBasicMaterial({ color: 0x3c342c }),
    );
    mesh.position.set(x, y, 2);
    mesh.renderOrder = 2;
    this.scene.add(mesh);
  }

  addBridge(x: number, y: number, width: number): number {
    return this.playfield.addBridge(x, y, width);
  }

  /** Rigid body first, then the ink sheet. */
  washAt(x: number, y: number, radius: number): void {
    this.playfield.washBridge(x, y, radius);
    this.surfaceSlot.wash(x, y, radius);
  }

  pointer(clientX: number, clientY: number): { x: number; y: number } | undefined {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return undefined;
    const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -(((clientY - rect.top) / rect.height) * 2 - 1);
    if (ndcX < -1 || ndcX > 1 || ndcY < -1 || ndcY > 1) return undefined;
    this.ndc.set(ndcX, ndcY);
    this.raycaster.setFromCamera(this.ndc, this.cameraRig.active);
    const hit = this.raycaster.ray.intersectPlane(this.plane, this.hitPoint);
    if (!hit) return undefined;
    return { x: hit.x, y: hit.y };
  }

  resize(width: number, height: number): void {
    this.renderer.setSize(width, height, false);
    this.cameraRig.resize(width, height);
  }

  frame(dt: number): void {
    if (this.disposed || this.lost) return;
    this.playfield.step(dt);
    this.seep?.update(this.playfield.stamps());
    this.bindSeep();
    this.draw(dt, true);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.canvas.removeEventListener('webglcontextlost', this.onLost);
    this.canvas.removeEventListener('webglcontextrestored', this.onRestored);
    this.surfaceSlot.dispose();
    this.seep?.dispose();
    this.ground?.geometry.dispose();
    this.groundMat?.dispose();
    for (const rock of this.rocks) rock.dispose();
    for (const bamboo of this.bamboos) bamboo.view.dispose();
    this.backdrop.geometry.dispose();
    disposeMaterial(this.backdrop.material);
    this.renderer.dispose();
  }

  private rebuildGpu(): void {
    const snap = this.restorePoint;
    try { this.surfaceSlot.dispose(); } catch { /* buffers are already invalid after the loss */ }
    this.surfaceSlot = new InkSurface(this.renderer, this.surfaceOptions);
    if (snap) this.surfaceSlot.restore(snap);
    const backdrop = this.backdrop.material;
    if (backdrop instanceof RawShaderMaterial && backdrop.uniforms.uMap) backdrop.uniforms.uMap.value = this.surfaceSlot.texture;
    if (this.playfield.terrainPoints.length > 1) {
      try { this.seep?.dispose(); } catch { /* lost with the context */ }
      this.seep = new TerrainSeep(this.renderer, this.playfield.terrainPoints);
      if (this.seepPixels) this.seep.restore(this.seepPixels);
      this.bindSeep();
    }
    this.scene.traverse(obj => {
      if (!('material' in obj)) return;
      const material = obj.material;
      const list = Array.isArray(material) ? material : [material];
      for (const item of list) item.needsUpdate = true;
    });
    this.playfield.pausedClock = false;
    this.lost = false;
    this.restoreCount += 1;
    this.draw(0, false, true);
  }

  private bindSeep(): void {
    if (this.groundMat && this.seep) {
      const slot = this.groundMat.uniforms.uSeep;
      if (slot) slot.value = this.seep.texture;
    }
  }

  private draw(dt: number, advanceInk: boolean, drain = false): void {
    this.syncHero();
    this.syncBamboo(dt);
    this.syncBridges();
    const pose = this.playfield.sample(this.playfield.actor.id, this.playfield.alpha);
    if (pose && this.playfield.terrainPoints.length > 1) {
      this.cameraRig.follow(pose.x, pose.y, this.playfield.bounds());
    }
    this.placeBackdrop();
    const width = cunOutlineWidth(inkCameraDistance(this.height), this.cameraRig.distance);
    for (const rock of this.rocks) rock.setOutlineWidth(width);
    if (advanceInk) this.surfaceSlot.update();
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

  private syncHero(): void {
    const pose = this.playfield.sample(this.playfield.actor.id, this.playfield.alpha);
    if (!pose) return;
    this.hero.position.set(pose.x, pose.y, INK_LAYER_Z.actor);
    this.hero.rotation.set(0, 0, 0);
  }

  private syncBamboo(dt: number): void {
    const alpha = this.playfield.alpha;
    for (const slot of this.bamboos) {
      const intact = this.playfield.bambooIntact(slot.id);
      const bodies = this.playfield.bambooBodies(slot.id);
      const whole = intact ? bodies[0] : undefined;
      const root = intact ? undefined : bodies[0];
      const upper = intact ? undefined : bodies[1];
      const wholePose = whole ? this.playfield.sample(whole.id, alpha) : undefined;
      const rootPose = root ? this.playfield.sample(root.id, alpha) : undefined;
      const upperPose = upper ? this.playfield.sample(upper.id, alpha) : undefined;
      slot.view.sync({
        intact,
        ...(wholePose ? { whole: { x: wholePose.x, y: wholePose.y } } : {}),
        ...(rootPose ? { root: { x: rootPose.x, y: rootPose.y } } : {}),
        ...(upperPose && upper ? { upper: { x: upperPose.x, y: upperPose.y, angle: upper.angle } } : {}),
      }, dt, slot.id * 97 + 13);
    }
  }

  private syncBridges(): void {
    const layout = this.playfield.bridgeLayout();
    const sig = layout.map(piece => `${piece.bridgeId}:${piece.x.toFixed(2)}:${piece.width.toFixed(2)}`).join('|');
    if (sig === this.bridgeSig) return;
    this.bridgeSig = sig;
    for (const mesh of this.bridgeMeshes) {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      disposeMaterial(mesh.material);
    }
    this.bridgeMeshes.length = 0;
    for (const piece of layout) {
      const mesh = new Mesh(
        new BoxGeometry(piece.width, 12, 8),
        new MeshBasicMaterial({ color: 0x2a2622 }),
      );
      mesh.position.set(piece.x, piece.y, 1);
      this.scene.add(mesh);
      this.bridgeMeshes.push(mesh);
    }
  }

  private placeBackdrop(): void {
    const distance = this.cameraRig.distance;
    const separation = distance - INK_LAYER_Z.far;
    const halfH = separation / Math.sqrt(3);
    const halfW = halfH * (this.width / Math.max(1, this.height));
    this.backdrop.position.set(this.cameraRig.camera.position.x, this.cameraRig.camera.position.y, INK_LAYER_Z.far);
    this.backdrop.scale.set(halfW * 2, halfH * 2, 1);
  }
}

function disc(radius: number, color: number, y: number): Mesh {
  const mesh = new Mesh(new CircleGeometry(radius, 24), new MeshBasicMaterial({ color, side: DoubleSide }));
  mesh.position.set(0, y, 0);
  return mesh;
}

function centeredQuad(): BufferGeometry {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute([
    -0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0,
  ], 3));
  geometry.setAttribute('uv', new Float32BufferAttribute([
    0, 0, 1, 0, 1, 1, 0, 1,
  ], 2));
  geometry.setIndex([0, 1, 2, 0, 2, 3]);
  return geometry;
}

function groundMaterial(seep: import('three').Texture): RawShaderMaterial {
  const material = new RawShaderMaterial({
    glslVersion: GLSL3,
    vertexShader: GROUND_VERT,
    fragmentShader: GROUND_FRAG,
    uniforms: {
      uModel: { value: new Matrix4() },
      uView: { value: new Matrix4() },
      uProj: { value: new Matrix4() },
      uSeep: { value: seep },
    },
    side: DoubleSide,
    depthTest: true,
    toneMapped: false,
  });
  bindMatrices(material);
  return material;
}

function backdropMaterial(map: import('three').Texture): RawShaderMaterial {
  const material = new RawShaderMaterial({
    glslVersion: GLSL3,
    vertexShader: BACK_VERT,
    fragmentShader: BACK_FRAG,
    uniforms: {
      uModel: { value: new Matrix4() },
      uView: { value: new Matrix4() },
      uProj: { value: new Matrix4() },
      uMap: { value: map },
    },
    depthWrite: false,
    depthTest: false,
    side: DoubleSide,
    toneMapped: false,
  });
  bindMatrices(material);
  return material;
}

function bindMatrices(material: RawShaderMaterial): void {
  material.onBeforeRender = (_renderer: Renderer, _scene, camera, _geometry, object) => {
    const model = material.uniforms.uModel;
    const view = material.uniforms.uView;
    const proj = material.uniforms.uProj;
    if (model?.value instanceof Matrix4) model.value.copy(object.matrixWorld);
    if (view?.value instanceof Matrix4) view.value.copy(camera.matrixWorldInverse);
    if (proj?.value instanceof Matrix4) proj.value.copy(camera.projectionMatrix);
  };
}

function disposeMaterial(material: import('three').Material | import('three').Material[]): void {
  if (Array.isArray(material)) {
    for (const entry of material) entry.dispose();
    return;
  }
  material.dispose();
}
