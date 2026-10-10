import { InkFxStage, listInkFx, type InkFxParams } from '@inkgames/engine';

interface FxWindow extends Window {
  __fxReady?: boolean;
  __fxDone?: boolean;
  __fxGl?: number;
  __fxId?: string;
}

function must<T extends Element>(node: T | null, name: string): T {
  if (!node) throw new Error(`缺少特效页节点 ${name}`);
  return node;
}

const host = window as FxWindow;
const grid = must(document.querySelector<HTMLElement>('#grid'), 'grid');
const stageEl = must(document.querySelector<HTMLElement>('#stage'), 'stage');
const canvas = must(document.querySelector<HTMLCanvasElement>('#view'), 'view');
const title = must(document.querySelector<HTMLElement>('#fx-title'), 'title');
const status = must(document.querySelector<HTMLElement>('#fx-status'), 'status');
const panel = must(canvas.parentElement, 'panel');

const params = new URLSearchParams(location.search);
const queryId = params.get('fx');
const still = params.get('still');
const record = params.get('record') === '1';
const catalog = listInkFx();

const stage = new InkFxStage(canvas, { width: 960, height: 540 });
let active = queryId && catalog.some(item => item.id === queryId) ? queryId : catalog[0]?.id ?? 'drop';
let playing = false;
let last = performance.now();
let playedFor = 0;
let hovered: HTMLButtonElement | undefined;

function readParams(): Partial<InkFxParams> {
  const speed = Number(document.querySelector<HTMLInputElement>('#fx-speed')?.value ?? '1');
  const density = Number(document.querySelector<HTMLInputElement>('#fx-density')?.value ?? '1');
  const pigment = Number(document.querySelector<HTMLSelectElement>('#fx-pigment')?.value ?? '-1');
  return { speed, density, pigment };
}

function show(id: string): void {
  active = id;
  const info = catalog.find(item => item.id === id);
  title.textContent = info ? info.label : id;
  status.textContent = info ? `${info.use} · ${info.technique}` : id;
  stage.play(id, readParams());
  playing = true;
  playedFor = 0;
  host.__fxId = id;
  host.__fxDone = false;
}

function mountOnCard(card: HTMLButtonElement): void {
  const preview = card.querySelector<HTMLCanvasElement>('canvas.preview');
  card.insertBefore(canvas, preview);
  canvas.classList.add('live');
  if (preview) preview.hidden = true;
}

function mountOnPanel(): void {
  canvas.classList.remove('live');
  const header = panel.querySelector('header');
  if (header) header.after(canvas);
  else panel.prepend(canvas);
  for (const preview of grid.querySelectorAll<HTMLCanvasElement>('canvas.preview')) preview.hidden = false;
}

function rememberCard(card: HTMLButtonElement): void {
  const preview = card.querySelector<HTMLCanvasElement>('canvas.preview');
  const ctx = preview?.getContext('2d');
  if (preview && ctx) ctx.drawImage(canvas, 0, 0, preview.width, preview.height);
}

for (const item of catalog) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'fx-card';
  card.dataset.id = item.id;
  const preview = document.createElement('canvas');
  preview.width = 480;
  preview.height = 270;
  preview.className = 'preview';
  const paper = preview.getContext('2d');
  if (paper) {
    paper.fillStyle = '#efe8da';
    paper.fillRect(0, 0, preview.width, preview.height);
  }
  const heading = document.createElement('h2');
  heading.textContent = item.label;
  const copy = document.createElement('p');
  copy.textContent = item.use;
  card.append(preview, heading, copy);
  card.addEventListener('mouseenter', () => {
    if (queryId || stageEl.classList.contains('open')) return;
    if (hovered && hovered !== card) {
      rememberCard(hovered);
      hovered = undefined;
    }
    mountOnCard(card);
    hovered = card;
    show(item.id);
  });
  card.addEventListener('mouseleave', () => {
    if (queryId || stageEl.classList.contains('open') || hovered !== card) return;
    rememberCard(card);
    mountOnPanel();
    hovered = undefined;
    playing = false;
  });
  card.addEventListener('click', () => {
    if (hovered) rememberCard(hovered);
    hovered = undefined;
    mountOnPanel();
    show(item.id);
    stageEl.hidden = false;
    stageEl.classList.add('open');
  });
  grid.append(card);
}

document.querySelector('#fx-close')?.addEventListener('click', () => {
  stageEl.hidden = true;
  stageEl.classList.remove('open');
  playing = Boolean(queryId);
});
document.querySelector('#fx-replay')?.addEventListener('click', () => show(active));
for (const id of ['#fx-speed', '#fx-density', '#fx-pigment']) {
  document.querySelector(id)?.addEventListener('change', () => {
    if (playing) show(active);
  });
}

if (queryId) {
  stageEl.hidden = false;
  stageEl.classList.add('open');
  show(queryId);
}

if (still !== null) {
  const info = catalog.find(item => item.id === active);
  const duration = info?.duration ?? 1;
  const raw = Number(still);
  const at = Math.min(duration, Math.max(0, raw <= 1 ? raw * duration : raw));
  stage.play(active, readParams());
  stage.seek(at);
  playing = false;
  host.__fxGl = stage.error;
  host.__fxReady = true;
  host.__fxDone = true;
} else {
  host.__fxReady = true;
  host.__fxGl = 0;
  const loop = (now: number): void => {
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    if (playing) {
      stage.update(dt);
      playedFor += dt;
      host.__fxGl = stage.error;
      const current = stage.current;
      const info = catalog.find(item => item.id === active);
      const span = info?.loop ? Math.min(6, Math.max(3, info.duration)) : Math.max(3, info?.duration ?? 1);
      if (record && playedFor >= span) {
        host.__fxDone = true;
        playing = false;
      } else if (!record && current?.finished && playedFor > 0.4 && info && !info.loop) {
        host.__fxDone = true;
        playing = false;
      }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
