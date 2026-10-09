import { Application, Container } from 'pixi.js';
import { DoubleSide, LinearSRGBColorSpace, Mesh, MeshBasicMaterial, PlaneGeometry, Scene, WebGLRenderer } from 'three';
import { CameraRig, INK_LAYER_Z, InkSurface, InkWash, inkLayerScale } from '@inkgames/engine';
import { compareSheet } from './strokes';

const sheet = compareSheet(location.search);
const pixiMount = document.querySelector<HTMLElement>('#pixi');
const threeMount = document.querySelector<HTMLElement>('#three');
const caption = document.querySelector<HTMLElement>('#caption');
if (!pixiMount || !threeMount) throw new Error('Missing parity mounts');

const app = new Application();
await app.init({
  width: sheet.width, height: sheet.height, preference: 'webgl', autoStart: false,
  antialias: false, resolution: 1, backgroundColor: 0x222222,
});
pixiMount.appendChild(app.canvas);
const wash = new InkWash(app, {
  width: sheet.width, height: sheet.height, seed: sheet.seed, background: sheet.background, paper: true,
});
for (const stroke of sheet.strokes) wash.paint(stroke);
if (sheet.camera) {
  const scale = inkLayerScale(sheet.height, INK_LAYER_Z.actor);
  const rig = new Container();
  rig.pivot.set(sheet.width / 2, sheet.height / 2);
  rig.scale.set(scale);
  rig.position.set(sheet.width / 2, sheet.height / 2);
  rig.addChild(wash.view);
  app.stage.addChild(rig);
} else {
  app.stage.addChild(wash.view);
}
app.render();

const canvas = document.createElement('canvas');
canvas.width = sheet.width;
canvas.height = sheet.height;
threeMount.appendChild(canvas);
const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, preserveDrawingBuffer: true });
renderer.outputColorSpace = LinearSRGBColorSpace;
renderer.setPixelRatio(1);
renderer.setSize(sheet.width, sheet.height, false);
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

function read(gl: WebGLRenderingContext | WebGL2RenderingContext, width: number, height: number): Uint8Array {
  const pixels = new Uint8Array(width * height * 4);
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  return pixels;
}

const pixiGl = app.canvas.getContext('webgl2') ?? app.canvas.getContext('webgl');
const threeGl = renderer.getContext();
if (!pixiGl) throw new Error('Pixi 画布没有 WebGL');
const left = read(pixiGl, sheet.width, sheet.height);
const right = read(threeGl, sheet.width, sheet.height);
let sum = 0;
let max = 0;
const count = sheet.width * sheet.height;
for (let i = 0; i < count; i++) {
  const o = i * 4;
  const d = Math.abs((left[o] ?? 0) - (right[o] ?? 0))
    + Math.abs((left[o + 1] ?? 0) - (right[o + 1] ?? 0))
    + Math.abs((left[o + 2] ?? 0) - (right[o + 2] ?? 0));
  sum += d;
  if (d > max) max = d;
}
const mean = sum / count;

interface ParityWindow extends Window {
  __parityReady?: boolean;
  __parityMean?: number;
  __parityMax?: number;
  __parityGl?: number;
}
const host = window as ParityWindow;
host.__parityMean = mean;
host.__parityMax = max;
host.__parityGl = threeGl.getError();
host.__parityReady = true;
if (caption) caption.textContent = `Pixi 与 three.js · ${sheet.scene ?? sheet.id} · 每像素 RGB 平均差 ${mean.toFixed(2)} · 最大 ${max}。SwiftShader，真实 GPU 未实测。`;
