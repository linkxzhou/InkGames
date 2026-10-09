import { InkSurface } from '@inkgames/engine';
import {
  DoubleSide, Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry, Scene, WebGLRenderer,
} from 'three';
import { PLATE, paintChaos1, paintChaos2, paintChaos3, paintChaos4, paintChuhan } from './compose';
import chaos1 from '../../thirdparty/上古-混沌-1.png';
import chaos2 from '../../thirdparty/上古-混沌-2.png';
import chaos3 from '../../thirdparty/上古-混沌-3.png';
import chaos4 from '../../thirdparty/上古-混沌-4.png';
import chuhan from '../../thirdparty/楚汉之争水墨.png';

const REFS: Readonly<Record<string, string>> = {
  'chaos-1': chaos1,
  'chaos-2': chaos2,
  'chaos-3': chaos3,
  'chaos-4': chaos4,
  chuhan,
};

interface GalleryStat {
  readonly id: string;
  readonly mean: number;
  readonly max: number;
}

interface GalleryWindow extends Window {
  __galleryReady?: boolean;
  __galleryDone?: boolean;
  __galleryGl?: number;
  __galleryStats?: readonly GalleryStat[];
}

interface LivePlate {
  readonly id: string;
  readonly renderer: WebGLRenderer;
  readonly surface: InkSurface;
  readonly scene: Scene;
  readonly camera: OrthographicCamera;
}

const host = window as GalleryWindow;
const status = document.querySelector<HTMLElement>('#status');
if (!status) throw new Error('缺少状态');

const PAINT: Readonly<Record<string, (surface: InkSurface) => void>> = {
  'chaos-1': paintChaos1,
  'chaos-2': paintChaos2,
  'chaos-3': paintChaos3,
  'chaos-4': paintChaos4,
  chuhan: paintChuhan,
};

function compare(canvas: HTMLCanvasElement, img: HTMLImageElement): GalleryStat {
  const w = canvas.width;
  const h = canvas.height;
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  const ctx = off.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('无法读取参照图');
  // Reference PNGs are mostly transparent. Composite them on the same paper as the engine.
  ctx.fillStyle = '#d6cebc';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  const ref = ctx.getImageData(0, 0, w, h).data;
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(canvas, 0, 0, w, h);
  const ours = ctx.getImageData(0, 0, w, h).data;
  let sum = 0;
  let max = 0;
  const pixels = w * h;
  for (let i = 0; i < pixels; i++) {
    const o = i * 4;
    const d = Math.abs((ours[o] ?? 0) - (ref[o] ?? 0))
      + Math.abs((ours[o + 1] ?? 0) - (ref[o + 1] ?? 0))
      + Math.abs((ours[o + 2] ?? 0) - (ref[o + 2] ?? 0));
    sum += d;
    if (d > max) max = d;
  }
  return { id: '', mean: sum / pixels, max };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`参照图没有载入 ${src}`));
    img.src = src;
  });
}

const live: LivePlate[] = [];
const stats: GalleryStat[] = [];
let gl = 0;

for (const section of document.querySelectorAll<HTMLElement>('.plate')) {
  const id = section.dataset.plate ?? '';
  const canvas = section.querySelector('canvas');
  const slot = section.querySelector('img');
  const metric = section.querySelector('.metric');
  const paint = PAINT[id];
  const ref = REFS[id];
  if (!canvas || !slot || !metric || !paint || !ref) throw new Error(`画廊缺页 ${id}`);
  slot.src = ref;
  const renderer = new WebGLRenderer({
    canvas, antialias: false, alpha: false, preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(1);
  renderer.setSize(PLATE, PLATE, false);
  renderer.setClearColor(0xd6cebc, 1);
  const camera = new OrthographicCamera(0, PLATE, 0, PLATE, 0.1, 100);
  camera.position.z = 10;
  const scene = new Scene();
  const surface = new InkSurface(renderer, {
    width: PLATE, height: PLATE, seed: 11, paper: true, background: [214, 206, 188],
  });
  const mesh = new Mesh(new PlaneGeometry(PLATE, PLATE), new MeshBasicMaterial({
    map: surface.texture, side: DoubleSide, toneMapped: false,
  }));
  mesh.position.set(PLATE / 2, PLATE / 2, 0);
  scene.add(mesh);
  paint(surface);
  renderer.setRenderTarget(null);
  renderer.render(scene, camera);
  const err = renderer.getContext().getError();
  if (err !== 0) gl = err;
  const image = await loadImage(ref);
  const stat = compare(canvas, image);
  const row = { id, mean: stat.mean, max: stat.max };
  stats.push(row);
  metric.textContent = `平均绝对 RGB ${stat.mean.toFixed(1)} · 最大 ${stat.max} · 不是逐像素重合`;
  live.push({ id, renderer, surface, scene, camera });
}

host.__galleryStats = stats;
host.__galleryGl = gl;
host.__galleryReady = true;
const worst = stats.reduce((a, b) => (a.mean > b.mean ? a : b));
status.textContent = `五张都已铺上。差最大的是 ${worst.id}（${worst.mean.toFixed(1)}）。构图接近不等于笔墨一致。真实 GPU 未实测。`;

const play = new URLSearchParams(location.search).get('play') === '1';
if (play) {
  const started = performance.now();
  let frame = 0;
  const tick = (): void => {
    frame += 1;
    for (const plate of live) {
      if (frame % 5 === 0) plate.surface.update();
      if (plate.id === 'chuhan' && frame % 20 === 0) plate.surface.wash(80 + (frame % 480), 280, 36);
      if (plate.id === 'chaos-1' && frame % 24 === 0) plate.surface.wash(260, 168, 18);
      plate.renderer.setRenderTarget(null);
      plate.renderer.render(plate.scene, plate.camera);
      const err = plate.renderer.getContext().getError();
      if (err !== 0) host.__galleryGl = err;
    }
    if (performance.now() - started > 8000) host.__galleryDone = true;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
