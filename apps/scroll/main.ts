import { InkView } from '@inkgames/engine';

interface SliceWindow extends Window {
  __sliceReady?: boolean;
  __sliceError?: string;
  __sliceGl?: number;
  __sliceLost?: boolean;
  __sliceRestored?: boolean;
  __sliceLose?: () => void;
  __sliceRestore?: () => void;
}

const canvas = document.querySelector<HTMLCanvasElement>('#view');
const status = document.querySelector<HTMLElement>('#status');
if (!canvas) throw new Error('缺少画布');

const params = new URLSearchParams(location.search);
const pose = params.get('pose');
const view = new InkView({
  canvas,
  width: 1280,
  height: 720,
  seed: 42,
  ...(pose ? { pixelRatio: 1 } : {}),
  onContext: state => {
    host.__sliceLost = state === 'lost';
    if (state === 'restored') {
      host.__sliceRestored = true;
      host.__sliceLost = false;
      host.__sliceGl = view.glError;
    }
  },
});

const ground = [
  { x: 0, y: 640 },
  { x: 280, y: 640 },
  { x: 620, y: 520 },
  { x: 980, y: 560 },
  { x: 1400, y: 450 },
  { x: 1900, y: 500 },
  { x: 2400, y: 520 },
];
view.addTerrain(ground);
view.addRock('hemp', 500, 500, 72, 11);
view.addRock('axe', 1080, 460, 86, 29);
const nearBamboo = view.addBamboo(820, 542, 170);
view.addBamboo(1180, 508, 200);
view.addOneWay(980, 390, 160);
view.addBridge(1500, 470, 180);
view.playfield.placeActor(160, 590);
view.cameraRig.snap(640, 540);

view.surface.paint({
  brush: { mode: 'brush', size: 'large', effect: 'wet', blend: 'mix' },
  color: 'black',
  points: [
    { x: 90, y: 180 }, { x: 260, y: 130 }, { x: 480, y: 200 },
    { x: 720, y: 120 }, { x: 980, y: 190 }, { x: 1180, y: 150 },
  ],
  seed: 21,
});

const host = window as SliceWindow;
const held = new Set<string>();

window.addEventListener('keydown', event => {
  held.add(event.code);
  if (event.code === 'Space') {
    event.preventDefault();
    view.playfield.attack();
  }
  if (event.code === 'KeyW' || event.code === 'ArrowUp') {
    if (held.has('ArrowDown') || held.has('KeyS')) view.playfield.dropThrough();
    else view.playfield.jump();
  }
  if (event.code === 'KeyQ') {
    const poseNow = view.playfield.sample(view.playfield.actor.id, view.playfield.alpha);
    if (poseNow) view.washAt(poseNow.x, poseNow.y + 18, 36);
  }
});
window.addEventListener('keyup', event => held.delete(event.code));

function steer(): void {
  const left = held.has('KeyA') || held.has('ArrowLeft');
  const right = held.has('KeyD') || held.has('ArrowRight');
  view.playfield.move(left === right ? 0 : right ? 1 : -1);
}

function paintStatus(): void {
  if (!status) return;
  const actor = view.playfield.actor.position;
  const footing = view.playfield.footing.kind;
  const bamboo = view.playfield.bambooIntact(nearBamboo) ? '未断' : '已断';
  status.textContent = `脚 ${footing} · 位置 ${Math.round(actor.x)}, ${Math.round(actor.y)} · 近竹 ${bamboo}`;
}

function settle(steps: number): void {
  for (let i = 0; i < steps; i++) view.frame(1 / 60);
}

if (pose === 'rest') {
  view.playfield.move(1);
  settle(110);
  view.playfield.move(0);
  settle(8);
} else if (pose === 'cut') {
  view.playfield.placeActor(760, 490);
  view.cameraRig.snap(900, 500);
  settle(12);
  view.playfield.attack();
  settle(36);
}

host.__sliceGl = view.glError;
host.__sliceLose = () => view.simulateContextLoss();
host.__sliceRestore = () => view.simulateContextRestore();
host.__sliceReady = true;
paintStatus();

if (!pose) {
  let last = performance.now();
  const loop = (now: number): void => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    steer();
    view.frame(dt);
    host.__sliceGl = view.glError;
    paintStatus();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
