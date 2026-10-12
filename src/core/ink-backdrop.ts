import {
  Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry, Scene, SRGBColorSpace, WebGLRenderer,
} from 'three';
import { InkSurface } from './ink-surface';
import { P5Noise, P5Random } from './ink-random';

/** 宣纸 #eceae4。与内容站 `--paper` 相同，无 WebGL 时页面就停在这一色。 */
export const BACKDROP_PAPER: readonly [number, number, number] = [236, 234, 228];
/** 中灰 #6e6e6c。湿墨用它，避免墨黑铺满正文。 */
const INK: readonly [number, number, number] = [110, 110, 108];
/** 纸纹会把底色乘 1.1 再压暗。这个值经过那一步后接近宣纸 #eceae4。 */
const PAPER_BEFORE_FIBRE: readonly [number, number, number] = [200, 198, 194];
/**
 * 朱砂 #b3241c。编码会把明度高于 0.6 的颜色抬淡，
 * 背景上因此只剩一小点淡红，不会压过文字。
 */
const VERMILION: readonly [number, number, number] = [179, 36, 28];

export const BACKDROP_WIDTH = 480;
export const BACKDROP_HEIGHT = 270;

export interface BackdropMark {
  readonly x: number;
  readonly y: number;
  readonly vermilion: boolean;
  readonly radius: number;
}

export interface InkBackdropOptions {
  readonly canvas: HTMLCanvasElement;
  readonly reducedMotion?: boolean;
  readonly seed?: number;
}

/** 疏落的淡墨点，最后一处是朱砂。位置由种子决定，方便单测。 */
export function backdropMarks(seed: number, width = BACKDROP_WIDTH, height = BACKDROP_HEIGHT): readonly BackdropMark[] {
  const rng = new P5Random(seed);
  const marks: BackdropMark[] = [];
  const count = 7;
  for (let i = 0; i < count; i++) {
    const vermilion = i === count - 1;
    marks.push({
      x: width * (0.1 + rng.random() * 0.8),
      y: height * (0.12 + rng.random() * 0.76),
      vermilion,
      radius: vermilion ? 3 : 8 + rng.random() * 14,
    });
  }
  return marks;
}

const ACTIVE_MS = 125;
const IDLE_MS = 500;
const IDLE_AFTER_MS = 8000;
const TRAIL = 10;

function clampSheet(value: number, limit: number): number {
  if (value < 12) return 12;
  if (value > limit - 12) return limit - 12;
  return value;
}

/**
 * 全屏淡墨底。墨画在低分辨率的 InkSurface 上（纸纹、湿墨反馈、漫水都走现成管线），
 * 再铺满视口。显示画布的像素比锁在 1，动画大约 8 帧/秒，页面不可见或静止后更慢。
 */
export class InkBackdrop {
  readonly canvas: HTMLCanvasElement;
  private readonly renderer: WebGLRenderer;
  private readonly surface: InkSurface;
  private readonly scene = new Scene();
  private readonly camera: OrthographicCamera;
  private readonly sheet: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private readonly noise: P5Noise;
  private readonly marks: readonly BackdropMark[];
  private readonly seed: number;
  private reduced: boolean;
  private disposed = false;
  private raf = 0;
  private lastDraw = 0;
  private lastInput = 0;
  private frames = 0;
  private bloom = 0;
  private readonly trail: { x: number; y: number }[] = [];
  private readonly onResize = (): void => { this.layout(); };
  private readonly onInput = (): void => { this.lastInput = performance.now(); };
  private readonly onLost = (event: Event): void => {
    event.preventDefault();
    this.canvas.style.display = 'none';
    this.stop();
  };
  private readonly loop = (now: number): void => {
    if (this.disposed || this.reduced) return;
    this.raf = requestAnimationFrame(this.loop);
    if (document.hidden) return;
    const gap = now - this.lastInput > IDLE_AFTER_MS ? IDLE_MS : ACTIVE_MS;
    if (now - this.lastDraw < gap) return;
    this.lastDraw = now;
    this.step();
    this.present();
    this.frames += 1;
    this.canvas.dataset.inkFrames = String(this.frames);
  };

  constructor(options: InkBackdropOptions) {
    this.canvas = options.canvas;
    this.seed = options.seed ?? 20261012;
    this.reduced = options.reducedMotion ?? false;
    this.noise = new P5Noise(this.seed);
    this.marks = backdropMarks(this.seed);
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ canvas: this.canvas, antialias: false, alpha: false, powerPreference: 'low-power' });
    } catch (error) {
      this.canvas.style.display = 'none';
      throw error;
    }
    this.renderer = renderer;
    // 字节按 sRGB 进出，宣纸色才能和页面的 #eceae4 对齐。
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0xeceae4, 1);
    this.surface = new InkSurface(this.renderer, {
      width: BACKDROP_WIDTH,
      height: BACKDROP_HEIGHT,
      seed: this.seed,
      paper: true,
      background: PAPER_BEFORE_FIBRE,
    });
    this.surface.texture.colorSpace = SRGBColorSpace;
    const geometry = new PlaneGeometry(2, 2);
    const material = new MeshBasicMaterial({ map: this.surface.texture, toneMapped: false, depthWrite: false });
    this.sheet = new Mesh(geometry, material);
    this.sheet.frustumCulled = false;
    this.scene.add(this.sheet);
    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    this.camera.position.z = 1;
    this.seedSheet();
    this.layout();
    this.present();
    this.canvas.addEventListener('webglcontextlost', this.onLost);
  }

  /** 已画出的动画帧数（不含最初那张静帧）。 */
  get frameCount(): number { return this.frames; }

  start(): void {
    if (this.disposed || this.reduced || this.raf) return;
    this.lastInput = performance.now();
    this.lastDraw = 0;
    window.addEventListener('resize', this.onResize);
    window.addEventListener('pointermove', this.onInput, { passive: true });
    window.addEventListener('scroll', this.onInput, { passive: true });
    window.addEventListener('keydown', this.onInput);
    this.raf = requestAnimationFrame(this.loop);
  }

  setReducedMotion(value: boolean): void {
    this.reduced = value;
    if (value) this.stop();
    else this.start();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.stop();
    this.canvas.removeEventListener('webglcontextlost', this.onLost);
    this.surface.dispose();
    this.scene.traverse(object => {
      const mesh = object as Mesh;
      mesh.geometry?.dispose();
      const material = mesh.material;
      if (material && !Array.isArray(material)) material.dispose();
    });
    this.renderer.dispose();
  }

  private seedSheet(): void {
    const brush = { mode: 'brush' as const, size: 'medium' as const, effect: 'mix' as const, blend: 'mix' as const };
    this.marks.forEach((mark, index) => {
      const reach = mark.radius;
      this.surface.paint({
        brush: mark.vermilion ? { mode: 'dots', size: 'ultra-small', effect: 'mix', blend: 'mix' } : brush,
        color: mark.vermilion ? VERMILION : INK,
        points: mark.vermilion
          ? [{ x: mark.x, y: mark.y, pressure: 0.4 }]
          : [
            { x: mark.x - reach * 0.45, y: mark.y, pressure: 0.25 },
            { x: mark.x, y: mark.y + reach * 0.15, pressure: 0.4 },
            { x: mark.x + reach * 0.35, y: mark.y - reach * 0.1, pressure: 0.15 },
          ],
        seed: this.seed + index * 17,
      });
    });
  }

  private step(): void {
    const mark = this.marks[this.bloom % this.marks.length];
    if (!mark || mark.vermilion) {
      this.bloom += 1;
      return;
    }
    const t = (this.frames + 1) * 0.07;
    const x = clampSheet(mark.x + (this.noise.noise(t, 0.4) - 0.5) * 70, BACKDROP_WIDTH);
    const y = clampSheet(mark.y + (this.noise.noise(0.4, t) - 0.5) * 46, BACKDROP_HEIGHT);
    this.surface.paint({
      brush: { mode: 'brush', size: 'medium', effect: 'wet', blend: 'mix' },
      color: INK,
      points: [
        { x: x - 8, y, pressure: 0.28 },
        { x, y: y + 5, pressure: 0.34 },
      ],
      seed: (this.seed + this.frames * 19) >>> 0,
    });
    this.trail.push({ x, y });
    if (this.trail.length > TRAIL) {
      const old = this.trail.shift();
      if (old) this.surface.wash(old.x, old.y, 30);
    }
    if (this.frames % 48 === 47) this.bloom += 1;
  }

  /** InkSurface 的 pass 会把视口留在墨面尺寸上，铺回屏幕前要改回来。 */
  private present(): void {
    this.renderer.setRenderTarget(null);
    this.renderer.setViewport(0, 0, this.canvas.width, this.canvas.height);
    this.renderer.render(this.scene, this.camera);
  }

  private layout(): void {
    const width = Math.max(1, this.canvas.clientWidth);
    const height = Math.max(1, this.canvas.clientHeight);
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(width, height, false);
    const map = this.sheet.material.map;
    if (!map) return;
    const view = width / height;
    const sheet = BACKDROP_WIDTH / BACKDROP_HEIGHT;
    if (view > sheet) map.repeat.set(1, sheet / view);
    else map.repeat.set(view / sheet, 1);
    map.offset.set((1 - map.repeat.x) / 2, (1 - map.repeat.y) / 2);
  }

  private stop(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onInput);
    window.removeEventListener('scroll', this.onInput);
    window.removeEventListener('keydown', this.onInput);
  }
}
