import { DoubleSide, LinearSRGBColorSpace, Mesh, MeshBasicMaterial, PlaneGeometry, Scene, WebGLRenderer } from 'three';
import { CameraRig, INK_LAYER_Z, InkSurface, inkLayerScale } from '@inkgames/engine';
import { compareSheet } from './strokes';

const sheet = compareSheet(location.search);
const mount = document.querySelector<HTMLElement>('#mount');
const caption = document.querySelector<HTMLElement>('#caption');
if (!mount) throw new Error('Missing compare mount');
const canvas = document.createElement('canvas');
canvas.width = sheet.width;
canvas.height = sheet.height;
mount.appendChild(canvas);
const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, preserveDrawingBuffer: true });
renderer.outputColorSpace = LinearSRGBColorSpace;
renderer.setPixelRatio(1);
renderer.setSize(sheet.width, sheet.height, false);
renderer.setClearColor(0x222222, 1);
const surface = new InkSurface(renderer, {
  width: sheet.width, height: sheet.height, seed: sheet.seed, paper: true, background: sheet.background, transparent: false,
});
for (const stroke of sheet.strokes) surface.paint(stroke);
const scene = new Scene();
const mesh = new Mesh(new PlaneGeometry(sheet.width, sheet.height), new MeshBasicMaterial({
  map: surface.texture, side: DoubleSide, toneMapped: false,
}));
mesh.position.set(sheet.width / 2, sheet.height / 2, 0);
if (sheet.camera) {
  const scale = inkLayerScale(sheet.height, INK_LAYER_Z.actor);
  mesh.scale.set(scale, scale, 1);
}
scene.add(mesh);
const camera = new CameraRig(sheet.width, sheet.height, sheet.width / 2, sheet.height / 2);
renderer.render(scene, camera.active);
const gl = renderer.getContext();
const pixels = new Uint8Array(sheet.width * sheet.height * 4);
gl.readPixels(0, 0, sheet.width, sheet.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
let dark = 0;
for (let i = 0; i < pixels.length; i += 4) {
  const shade = (pixels[i] ?? 0) + (pixels[i + 1] ?? 0) + (pixels[i + 2] ?? 0);
  if (shade < 180 * 3) dark += 1;
}
if (caption) caption.textContent = `InkSurface · ${sheet.scene ?? sheet.id} · 深色像素 ${dark}`;

interface CompareWindow extends Window {
  __compareReady?: boolean;
  __threeDark?: number;
  __threeGl?: number;
}
const host = window as CompareWindow;
host.__threeDark = dark;
host.__threeGl = gl.getError();
host.__compareReady = true;
