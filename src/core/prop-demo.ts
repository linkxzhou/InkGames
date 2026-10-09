import { Engine, World } from 'matter-js';
import {
  DoubleSide, GLSL3, Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, WebGLRenderer,
  type Texture,
} from 'three';
import { historyProp, paintHistoryProp, type HistoryPropId } from '../plugins/history-props';
import type { PropStroke } from '../plugins/prop-paintings';
import { InkSurface } from './ink-surface';
import { PROP_VIEW_H, PROP_VIEW_W, createPropWorld } from './prop-world';

export interface PropDemoOptions {
  readonly canvas: HTMLCanvasElement;
  readonly id: HistoryPropId;
}

const SPRITE_W = 1024;
const SPRITE_H = 768;

/**
 * One history prop on its own canvas: ink on a sprite, Matter underneath.
 * The sprite follows the body, so a fall or a cut is visible.
 * The world is a fixed 1600×900 stage; the drawing buffer follows the CSS box and the device pixel ratio.
 */
export class PropDemo {
  readonly id: HistoryPropId;
  /** Strokes inkEngine can replay. Water uses the full sheet; other props use the sprite. */
  readonly compareStrokes: readonly PropStroke[];
  readonly compareWidth: number;
  readonly compareHeight: number;
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera: OrthographicCamera;
  private readonly sheet: InkSurface;
  private readonly propInk: InkSurface;
  private readonly propMesh: Mesh;
  private readonly stakeMesh: Mesh | null;
  private readonly boltMesh: Mesh | null;
  private readonly embers: Mesh[] = [];
  private disposed = false;
  private lastError = 0;
  private readonly sim;
  private readonly onResize: () => void;

  constructor(options: PropDemoOptions) {
    const spec = historyProp(options.id);
    if (!spec) throw new Error(`未知道具 ${options.id}`);
    this.id = options.id;
    this.sim = createPropWorld(spec.physics);
    this.renderer = new WebGLRenderer({
      canvas: options.canvas, antialias: false, alpha: false, preserveDrawingBuffer: true,
    });
    this.renderer.setClearColor(0xd6cebc, 1);
    this.camera = new OrthographicCamera(0, PROP_VIEW_W, 0, PROP_VIEW_H, 0.1, 100);
    this.camera.position.z = 10;
    this.sheet = new InkSurface(this.renderer, {
      width: PROP_VIEW_W, height: PROP_VIEW_H, seed: 21, paper: true, background: [214, 206, 188],
    });
    const onWater = spec.physics === 'flow' && options.id !== 'inkstone';
    const band = onWater
      ? paintHistoryProp('water', { x: 0, y: options.id === 'water' ? 280 : 560, scale: 1, width: PROP_VIEW_W })
      : [];
    for (const stroke of band) this.paint(this.sheet, stroke);
    this.sheet.paint({
      brush: { mode: 'brush', size: 'extra-large', effect: 'wet', blend: 'mix' },
      color: 'gray_brown',
      points: [
        { x: 40, y: 790 }, { x: 420, y: 770 }, { x: 860, y: 786 }, { x: 1240, y: 768 }, { x: 1560, y: 784 },
      ],
      seed: 4,
    });
    const sheetMesh = new Mesh(new PlaneGeometry(PROP_VIEW_W, PROP_VIEW_H), new MeshBasicMaterial({
      map: this.sheet.texture, side: DoubleSide, toneMapped: false,
    }));
    sheetMesh.position.set(PROP_VIEW_W / 2, PROP_VIEW_H / 2, 0);
    this.scene.add(sheetMesh);
    this.propInk = new InkSurface(this.renderer, {
      width: SPRITE_W, height: SPRITE_H, seed: 21, paper: false, transparent: true, background: [0, 0, 0],
    });
    const strokes = options.id === 'water'
      ? paintHistoryProp('water', { x: 80, y: 360, scale: 1, width: 860 })
      : paintHistoryProp(options.id, { x: SPRITE_W / 2, y: SPRITE_H / 2 + 20, scale: 1.55, width: 900 });
    for (const stroke of strokes) this.paint(this.propInk, stroke);
    const bounds = boundsOf(strokes, SPRITE_W, SPRITE_H);
    this.sim.place(bounds);
    this.compareStrokes = options.id === 'water' ? band : strokes;
    this.compareWidth = options.id === 'water' ? PROP_VIEW_W : SPRITE_W;
    this.compareHeight = options.id === 'water' ? PROP_VIEW_H : SPRITE_H;
    this.propMesh = new Mesh(new PlaneGeometry(SPRITE_W, SPRITE_H), inkSpriteMaterial(this.propInk.texture));
    this.propMesh.position.z = 1;
    this.scene.add(this.propMesh);
    this.stakeMesh = this.sim.stake
      ? new Mesh(new PlaneGeometry(28, 150), new MeshBasicMaterial({ color: 0x2a241c }))
      : null;
    if (this.stakeMesh) {
      this.stakeMesh.position.z = 2;
      this.scene.add(this.stakeMesh);
    }
    this.boltMesh = this.sim.bolt
      ? new Mesh(new PlaneGeometry(36, 8), new MeshBasicMaterial({ color: 0x1a1a1a }))
      : null;
    if (this.boltMesh) {
      this.boltMesh.position.z = 2;
      this.scene.add(this.boltMesh);
    }
    const ground = new Mesh(new PlaneGeometry(PROP_VIEW_W + 80, 18), new MeshBasicMaterial({ color: 0x3c342c }));
    ground.position.set(this.sim.ground.position.x, this.sim.ground.position.y, 0.5);
    this.scene.add(ground);
    this.onResize = () => this.layout();
    this.layout();
    if (typeof window !== 'undefined') window.addEventListener('resize', this.onResize);
    this.sync();
    this.draw();
  }

  get glError(): number { return this.lastError; }
  get acted(): boolean { return this.sim.acted; }

  act(): string {
    const label = this.sim.act();
    const at = this.sim.focus();
    if (this.sim.kind === 'cut') {
      const stake = this.sim.stake;
      const tipX = stake ? stake.position.x : at.x + 180;
      const tipY = stake ? stake.position.y : at.y + 40;
      this.sheet.paint({
        brush: { mode: 'fly', size: 'large', effect: 'flyingWhite', blend: 'mix' },
        color: 'black',
        points: [
          { x: at.x - 40, y: at.y - 80 },
          { x: (at.x + tipX) / 2, y: (at.y + tipY) / 2 },
          { x: tipX + 30, y: tipY + 20 },
        ],
        seed: 9,
      });
    }
    if (this.sim.kind === 'flow') this.sheet.wash(at.x, Math.min(PROP_VIEW_H - 40, at.y + 80), 90);
    if (this.sim.kind === 'move') {
      this.sheet.paint({
        brush: { mode: 'gothic', size: 'medium', effect: 'wet', blend: 'mix' },
        color: 'gray_brown',
        points: [
          { x: at.x - 80, y: at.y + 70 },
          { x: at.x - 20, y: at.y + 90 },
          { x: at.x + 30, y: at.y + 74 },
        ],
        seed: 15,
      });
    }
    if (this.sim.kind === 'burn') {
      this.sheet.paint({
        brush: { mode: 'gothic', size: 'large', effect: 'wet', blend: 'mix' },
        color: 'wine_red',
        points: [
          { x: at.x - 24, y: at.y + 10 },
          { x: at.x, y: at.y - 70 },
          { x: at.x + 28, y: at.y + 6 },
        ],
        seed: 11,
      });
      for (let i = 0; i < this.sim.embers.length; i++) {
        const mesh = new Mesh(new PlaneGeometry(14, 14), new MeshBasicMaterial({ color: 0x8e2e28 }));
        mesh.position.z = 3;
        this.embers.push(mesh);
        this.scene.add(mesh);
      }
    }
    this.sync();
    this.draw();
    return label;
  }

  frame(): void {
    if (this.disposed) return;
    this.sim.step();
    this.sync();
    this.draw();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    if (typeof window !== 'undefined') window.removeEventListener('resize', this.onResize);
    this.sheet.dispose();
    this.propInk.dispose();
    const spriteMat = this.propMesh.material;
    if (!Array.isArray(spriteMat)) spriteMat.dispose();
    this.renderer.dispose();
    World.clear(this.sim.engine.world, false);
    Engine.clear(this.sim.engine);
  }

  private layout(): void {
    const canvas = this.renderer.domElement;
    const shell = canvas.parentElement;
    const cssW = Math.max(320, Math.floor(shell?.clientWidth || PROP_VIEW_W));
    const cssH = Math.max(180, Math.floor(shell?.clientHeight || cssW * PROP_VIEW_H / PROP_VIEW_W));
    const ratio = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
    this.renderer.setPixelRatio(Math.min(ratio, 2));
    this.renderer.setSize(cssW, cssH, false);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
  }

  private sync(): void {
    this.propMesh.position.set(this.sim.prop.position.x, this.sim.prop.position.y, 1);
    this.propMesh.rotation.z = -this.sim.prop.angle;
    if (this.stakeMesh) {
      if (!this.sim.stake) this.stakeMesh.visible = false;
      else this.stakeMesh.position.set(this.sim.stake.position.x, this.sim.stake.position.y, 2);
    }
    if (this.boltMesh && this.sim.bolt) {
      this.boltMesh.position.set(this.sim.bolt.position.x, this.sim.bolt.position.y, 2);
      this.boltMesh.rotation.z = -this.sim.bolt.angle;
    }
    this.sim.embers.forEach((body, index) => {
      const mesh = this.embers[index];
      if (mesh) mesh.position.set(body.position.x, body.position.y, 3);
    });
  }

  private paint(surface: InkSurface, stroke: PropStroke): void {
    surface.paint({
      brush: stroke.brush,
      color: stroke.color,
      points: stroke.points,
      seed: stroke.seed,
      ...(stroke.finish ? { finish: stroke.finish } : {}),
    });
  }

  private draw(): void {
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);
    this.lastError = this.renderer.getContext().getError();
  }
}

/**
 * The prop sheet is ink on white. White is the unpainted ground, so it has to drop out
 * and let the page paper show through. Near-white washes stay faint on purpose.
 */
function inkSpriteMaterial(map: Texture): ShaderMaterial {
  const material = new ShaderMaterial({
    glslVersion: GLSL3,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    toneMapped: false,
    uniforms: { uMap: { value: map } },
    vertexShader: `
      out vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      in vec2 vUv;
      uniform sampler2D uMap;
      out vec4 fragColor;
      void main() {
        vec4 ink = texture(uMap, vUv);
        float whiteness = min(ink.r, min(ink.g, ink.b));
        float alpha = 1.0 - smoothstep(0.84, 0.98, whiteness);
        fragColor = vec4(ink.rgb * alpha, alpha);
      }
    `,
  });
  return material;
}

function boundsOf(strokes: readonly PropStroke[], spriteW: number, spriteH: number): {
  minX: number; minY: number; maxX: number; maxY: number; spriteW: number; spriteH: number;
} {
  let minX = spriteW / 2;
  let minY = spriteH / 2;
  let maxX = minX;
  let maxY = minY;
  for (const stroke of strokes) {
    for (const point of stroke.points) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }
  }
  // Brush radius sits outside the pointer path. Pad so the wash is not judged as off-canvas.
  const pad = 36;
  return {
    minX: Math.max(0, minX - pad),
    minY: Math.max(0, minY - pad),
    maxX: Math.min(spriteW, maxX + pad),
    maxY: Math.min(spriteH, maxY + pad),
    spriteW,
    spriteH,
  };
}
