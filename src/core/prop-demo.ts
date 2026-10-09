import { Engine, World } from 'matter-js';
import {
  DoubleSide, Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry, Scene, WebGLRenderer,
} from 'three';
import { historyProp, paintHistoryProp, type HistoryPropId } from '../plugins/history-props';
import type { PropStroke } from '../plugins/prop-paintings';
import { InkSurface } from './ink-surface';
import { createPropWorld } from './prop-world';

export interface PropDemoOptions {
  readonly canvas: HTMLCanvasElement;
  readonly id: HistoryPropId;
}

/**
 * One history prop on its own canvas: ink on a sprite, Matter underneath.
 * The sprite follows the body, so a fall or a cut is visible.
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

  constructor(options: PropDemoOptions) {
    const spec = historyProp(options.id);
    if (!spec) throw new Error(`未知道具 ${options.id}`);
    this.id = options.id;
    this.sim = createPropWorld(spec.physics);
    this.renderer = new WebGLRenderer({
      canvas: options.canvas, antialias: false, alpha: false, preserveDrawingBuffer: true,
    });
    this.renderer.setSize(960, 540, false);
    this.renderer.setClearColor(0xd6cebc, 1);
    this.camera = new OrthographicCamera(0, 960, 0, 540, 0.1, 100);
    this.camera.position.z = 10;
    this.sheet = new InkSurface(this.renderer, {
      width: 960, height: 540, seed: 21, paper: true, background: [214, 206, 188],
    });
    const onWater = spec.physics === 'flow' && options.id !== 'inkstone';
    const band = onWater
      ? paintHistoryProp('water', { x: 0, y: options.id === 'water' ? 180 : 400, scale: 1, width: 960 })
      : [];
    for (const stroke of band) this.paint(this.sheet, stroke);
    const sheetMesh = new Mesh(new PlaneGeometry(960, 540), new MeshBasicMaterial({
      map: this.sheet.texture, side: DoubleSide, toneMapped: false,
    }));
    sheetMesh.position.set(480, 270, 0);
    this.scene.add(sheetMesh);
    this.propInk = new InkSurface(this.renderer, {
      width: 420, height: 520, seed: 21, paper: false, transparent: true, background: [0, 0, 0],
    });
    const strokes = paintHistoryProp(options.id, { x: 210, y: 280, scale: 0.9, width: 400 });
    for (const stroke of strokes) this.paint(this.propInk, stroke);
    this.compareStrokes = options.id === 'water' ? band : strokes;
    this.compareWidth = options.id === 'water' ? 960 : 420;
    this.compareHeight = options.id === 'water' ? 540 : 520;
    this.propMesh = new Mesh(new PlaneGeometry(420, 520), new MeshBasicMaterial({
      map: this.propInk.texture, transparent: true, depthWrite: false, side: DoubleSide, toneMapped: false,
    }));
    this.propMesh.position.z = 1;
    this.scene.add(this.propMesh);
    this.stakeMesh = this.sim.stake
      ? new Mesh(new PlaneGeometry(36, 110), new MeshBasicMaterial({ color: 0x2a241c }))
      : null;
    if (this.stakeMesh) {
      this.stakeMesh.position.z = 2;
      this.scene.add(this.stakeMesh);
    }
    this.boltMesh = this.sim.bolt
      ? new Mesh(new PlaneGeometry(28, 8), new MeshBasicMaterial({ color: 0x1a1a1a }))
      : null;
    if (this.boltMesh) {
      this.boltMesh.position.z = 2;
      this.scene.add(this.boltMesh);
    }
    const ground = new Mesh(new PlaneGeometry(1000, 28), new MeshBasicMaterial({ color: 0x3c342c }));
    ground.position.set(this.sim.ground.position.x, this.sim.ground.position.y, 0.5);
    this.scene.add(ground);
    this.sync();
    this.draw();
  }

  get glError(): number { return this.lastError; }
  get acted(): boolean { return this.sim.acted; }

  act(): string {
    const label = this.sim.act();
    if (this.sim.kind === 'cut') {
      this.sheet.paint({
        brush: { mode: 'fly', size: 'medium', effect: 'flyingWhite', blend: 'mix' },
        color: 'black',
        points: [{ x: 420, y: 300 }, { x: 640, y: 420 }, { x: 700, y: 460 }],
        seed: 9,
      });
    }
    if (this.sim.kind === 'flow') this.sheet.wash(480, 360, 80);
    if (this.sim.kind === 'burn') {
      this.sheet.paint({
        brush: { mode: 'gothic', size: 'large', effect: 'wet', blend: 'mix' },
        color: 'red',
        points: [{ x: 280, y: 220 }, { x: 300, y: 160 }, { x: 330, y: 200 }],
        seed: 11,
      });
      for (let i = 0; i < this.sim.embers.length; i++) {
        const mesh = new Mesh(new PlaneGeometry(12, 12), new MeshBasicMaterial({ color: 0x9a3b2f }));
        mesh.position.z = 3;
        this.embers.push(mesh);
        this.scene.add(mesh);
      }
    }
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
    this.sheet.dispose();
    this.propInk.dispose();
    this.renderer.dispose();
    World.clear(this.sim.engine.world, false);
    Engine.clear(this.sim.engine);
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
