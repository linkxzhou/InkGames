import { parseScenePackage, StoryStage } from '@inkgames/engine';
import example from '../../plan/11-history-game-data/scene-zhanguo-jingke.example.json';

interface StoryWindow extends Window {
  __storyReady?: boolean;
  __storyPhase?: string;
  __storyGl?: number;
  __storyLost?: boolean;
  __storyRestored?: boolean;
  __storyLose?: () => void;
  __storyRestore?: () => void;
}

const canvas = document.querySelector<HTMLCanvasElement>('#view');
const status = document.querySelector<HTMLElement>('#status');
const choices = document.querySelector<HTMLElement>('#choices');
const timeline = document.querySelector<HTMLElement>('#timeline');
const title = document.querySelector<HTMLElement>('#title');
if (!canvas || !status || !choices || !timeline) throw new Error('缺少页面节点');
const statusEl: HTMLElement = status;
const choiceEl: HTMLElement = choices;
const timelineEl: HTMLElement = timeline;

const pack = parseScenePackage(example);
const pose = new URLSearchParams(location.search).get('pose');
const storage = window.localStorage;
const host = window as StoryWindow;
const stage = new StoryStage({
  canvas,
  pack,
  storage,
  pixelRatio: pose ? 1 : Math.min(2, window.devicePixelRatio || 1),
  onContext: state => {
    host.__storyLost = state === 'lost';
    if (state === 'restored') {
      host.__storyRestored = true;
      host.__storyLost = false;
      host.__storyGl = stage.glError;
    }
  },
});
stage.director.audio.unlock();

host.__storyLose = () => stage.simulateContextLoss();
host.__storyRestore = () => stage.simulateContextRestore();

function paint(view = stage.director.view()): void {
  const node = view.node;
  const shot = view.tick?.shotId ?? '';
  const waiting = view.tick?.waiting ? ` · 等待${view.tick.waiting === 'input' ? '输入' : '旁白'}` : '';
  statusEl.textContent = `${view.phase} · ${node.id}${shot ? ` · ${shot}` : ''}${view.note ? ` · ${view.note}` : ''}${waiting}`;
  if (title) title.textContent = stage.director.story.text(pack.scene.title);
  choiceEl.replaceChildren();
  for (const choice of view.choices) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = stage.director.story.text(choice.label);
    button.addEventListener('click', () => {
      stage.director.audio.unlock();
      paint(stage.choose(choice.id));
    });
    choiceEl.appendChild(button);
  }
  timelineEl.replaceChildren();
  const marks = [pack.scene.anchors.entry, pack.scene.anchors.exit];
  for (const anchor of marks) {
    const chip = document.createElement('span');
    chip.textContent = stage.director.story.text(anchor.title);
    timelineEl.appendChild(chip);
  }
  for (const plotNode of pack.scene.plot.nodes) {
    const chip = document.createElement('span');
    chip.textContent = plotNode.id;
    if (plotNode.id === node.id) chip.className = 'here';
    timelineEl.appendChild(chip);
  }
  host.__storyPhase = view.phase;
  host.__storyGl = stage.glError;
}

document.querySelector<HTMLButtonElement>('#skip')?.addEventListener('click', () => {
  stage.director.audio.unlock();
  paint(stage.fastForward(pack.opening.durationFrames + 2));
});
document.querySelector<HTMLButtonElement>('#continue')?.addEventListener('click', () => {
  stage.director.audio.unlock();
  paint(stage.confirm());
});
document.querySelector<HTMLButtonElement>('#save')?.addEventListener('click', () => {
  paint();
  statusEl.textContent = `${statusEl.textContent} · 已写入本地存档`;
});
document.querySelector<HTMLButtonElement>('#load')?.addEventListener('click', () => {
  const node = stage.director.resume();
  paint();
  if (!node) statusEl.textContent = `${statusEl.textContent} · 没有检查点`;
});

if (pose === 'fork' || pose === 'canon') {
  stage.fastForward(pack.opening.durationFrames + 2);
  if (pose === 'canon') stage.choose('pick.canon');
} else if (pose === 'title') {
  for (let i = 0; i < 80; i++) stage.step();
}

paint(stage.director.view());
host.__storyReady = true;

if (!pose) {
  let last = performance.now();
  const loop = (now: number): void => {
    const gap = now - last;
    last = now;
    if (stage.director.view().phase === 'cutscene' && !stage.contextLost) {
      const steps = gap > 32 ? 2 : 1;
      let view = stage.director.view();
      for (let i = 0; i < steps; i++) view = stage.step();
      paint(view);
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
