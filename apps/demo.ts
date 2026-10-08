import { getItemPreset, InkStage } from '@inkgames/engine';

const id = document.body.dataset.item;
if (!id) throw new Error('Missing effect id');
const preset = getItemPreset(id);
const title = document.querySelector<HTMLElement>('#effect-title');
const number = document.querySelector<HTMLElement>('#effect-number');
const description = document.querySelector<HTMLElement>('#effect-description');
const parent = document.querySelector<HTMLElement>('#canvas-root');
const status = document.querySelector<HTMLElement>('#status');
const loading = document.querySelector<HTMLElement>('#loading');
const hint = document.querySelector<HTMLElement>('#hint');
const action = document.querySelector<HTMLButtonElement>('#action');
const replay = document.querySelector<HTMLButtonElement>('#replay');
const pause = document.querySelector<HTMLButtonElement>('#pause');
const reset = document.querySelector<HTMLButtonElement>('#reset');
if (!title || !number || !description || !parent || !status || !loading || !hint || !action || !replay || !pause || !reset) {
  throw new Error('Incomplete demo page');
}

title.textContent = preset.title;
number.textContent = preset.subtitle;
description.textContent = preset.description;
hint.textContent = preset.hint;
action.textContent = preset.actionLabel;
document.title = `${preset.title} · InkGames`;

let stage: InkStage | undefined;
try {
  stage = await InkStage.create({ parent, item: preset, onStatus: text => { status.textContent = text; } });
  loading.hidden = true;
  status.textContent = '演示已就绪。' + preset.hint;
} catch (error) {
  loading.textContent = `无法启动 WebGL 演示：${error instanceof Error ? error.message : String(error)}`;
  status.textContent = '请使用支持 WebGL 的桌面浏览器';
}

const activeStage = stage;
action.addEventListener('click', () => activeStage?.act());
replay.addEventListener('click', () => activeStage?.replay());
pause.addEventListener('click', () => {
  if (!activeStage) return;
  const paused = activeStage.togglePause();
  pause.textContent = paused ? '继续' : '暂停';
  status.textContent = paused ? '已暂停。物理和洇墨都停住。' : '继续播放。';
});
reset.addEventListener('click', () => activeStage?.reset());
window.addEventListener('pagehide', () => { void activeStage?.dispose(); }, { once: true });
