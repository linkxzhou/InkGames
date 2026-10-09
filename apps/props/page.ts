import { PropDemo, historyProp, type HistoryPropId, type PropStroke } from '@inkgames/engine';

const id = document.body.dataset.prop ?? '';
const spec = historyProp(id);
const canvas = document.querySelector<HTMLCanvasElement>('#view');
const status = document.querySelector<HTMLElement>('#status');
const title = document.querySelector<HTMLElement>('#title');
const blurb = document.querySelector<HTMLElement>('#blurb');
const scenes = document.querySelector<HTMLElement>('#scenes');
const act = document.querySelector<HTMLButtonElement>('#act');
if (!spec || !canvas || !status || !title || !blurb || !scenes || !act) {
  throw new Error(`未知道具页 ${id}`);
}

title.textContent = spec.title;
blurb.textContent = spec.blurb;
scenes.textContent = spec.scenes.join(' · ');
act.textContent = spec.action;
document.title = `${spec.title} · InkGames`;

interface CompareStroke {
  readonly seed: number;
  readonly brush: PropStroke['brush'];
  readonly color: PropStroke['color'];
  readonly points: PropStroke['points'];
  readonly finish?: PropStroke['finish'];
}

interface PropWindow extends Window {
  __propReady?: boolean;
  __propDone?: boolean;
  __propGl?: number;
  __propAct?: () => void;
  __propId?: string;
  __propCompare?: {
    readonly width: number;
    readonly height: number;
    readonly background: readonly number[];
    readonly seed: number;
    readonly strokes: readonly CompareStroke[];
  };
}

const host = window as PropWindow;
host.__propId = id;
const demo = new PropDemo({ canvas, id: id as HistoryPropId });
status.textContent = `${spec.physics} · ${spec.scenes[0] ?? ''}`;
host.__propGl = demo.glError;
host.__propCompare = {
  width: demo.compareWidth,
  height: demo.compareHeight,
  background: [214, 206, 188],
  seed: 21,
  strokes: demo.compareStrokes.map(stroke => ({
    seed: stroke.seed,
    brush: stroke.brush,
    color: stroke.color,
    points: stroke.points,
    ...(stroke.finish ? { finish: stroke.finish } : {}),
  })),
};
host.__propReady = true;
host.__propAct = () => {
  status.textContent = `${spec.physics} · ${demo.act()}`;
  host.__propGl = demo.glError;
};

const params = new URLSearchParams(location.search);
const play = params.get('play') === '1';
let frames = 0;
function loop(): void {
  frames += 1;
  if (play && frames === 30) host.__propAct?.();
  demo.frame();
  host.__propGl = demo.glError;
  if (play && frames > 420) host.__propDone = true;
  requestAnimationFrame(loop);
}
act.addEventListener('click', () => host.__propAct?.());
if (play || params.get('pose') !== 'still') requestAnimationFrame(loop);
