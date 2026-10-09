import { advanceFrameClock } from '@inkgames/engine';
import { chaosPresentation, chaosShapes } from './chaos-data';
import { createChaos, type ChaosView } from "./procedural";
import chapter from '../../plan/11-history-game-data/chapters/00-shanggu.json';

interface HistoryWindow extends Window { __historyHash?: (frame: number) => number }

function element<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`缺少节点 ${id}`);
  return node as T;
}
const entry = chapter.scenes.find(row => row.scene.id === 'shanggu.hundun');
if (!entry) throw new Error('缺少混沌开卷剧本');
const opening = entry.opening;
const strings: Readonly<Record<string, string | undefined>> = entry.strings.strings;
const shots = opening.shots.map(shot => ({ ...shot, image: "procedural" }));
const canvas = element<HTMLCanvasElement>('view');
const seek = element<HTMLInputElement>('seek');
const play = element<HTMLButtonElement>('play');
const restart = element<HTMLButtonElement>('restart');
const start = element<HTMLButtonElement>('start');
const subtitle = element('subtitle');
const status = element('status');
const overlay = element('overlay');
let frame = 0;
let playing = false;
let last: number | undefined;
let elapsed = 0;
let ambient: AudioContext | undefined;
let audioGain: GainNode | undefined;
let oscillator: OscillatorNode | undefined;
let muted = true;
let disposed = false;
let stage: ChaosView | undefined;
const buttons = shots.map((shot, index) => {
  const button = document.createElement('button');
  const small = document.createElement('small');
  small.textContent = `0${index + 1} / ${Math.floor(shot.from / 60)}s`;
  button.append(small, ['一点生墨', '盘古撑天', '天地初分', '洪水炼石', '五石补天'][index]);
  button.addEventListener('click', () => { frame = shot.from + 40; elapsed = frame / 60; last = undefined; refresh(); });
  element('shots').append(button);
  return button;
});
function clock(value: number): string { const sec = Math.floor(value / 60); return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`; }
function refresh(): void {
  if (disposed || !stage || stage.contextLost) return;
  stage.render(frame);
  const index = Math.max(0, shots.findIndex(shot => frame >= shot.from && frame < shot.to));
  buttons.forEach((button, i) => button.classList.toggle('active', i === index));
  seek.value = String(frame);
  element('time').textContent = `${clock(frame)} / 01:30`;
  const cue = opening.tracks.text.find(cue => cue.kind === 'subtitle' && frame >= cue.at && frame < cue.until);
  subtitle.textContent = cue ? strings[cue.key ?? cue.vo ?? ''] ?? '' : '';
  status.textContent = `${shots[index]?.note ?? ''} · 纯笔画生成 · 30 fps 写意预览`;
  play.textContent = playing ? '暂停' : '播放';
  if (droppedFrames > 0) status.textContent = `${status.textContent ?? ''} · 曾丢帧 ${droppedFrames}`;
  if (audioGain && ambient) audioGain.gain.setTargetAtTime(playing && !muted ? .025 : 0, ambient.currentTime, .3);
}
function toggle(): void { playing = !playing; last = undefined; carry = 0; overlay.style.display = 'none'; refresh(); }
play.addEventListener('click', toggle);
start.addEventListener('click', toggle);
restart.addEventListener('click', () => { frame = 0; elapsed = 0; carry = 0; droppedFrames = 0; playing = true; last = undefined; overlay.style.display = 'none'; refresh(); });
seek.addEventListener('input', () => { frame = Number(seek.value); elapsed = frame / 60; last = undefined; carry = 0; droppedFrames = 0; overlay.style.display = 'none'; refresh(); });
element('mute').addEventListener('click', () => {
  if (!ambient) {
    ambient = new AudioContext();
    audioGain = ambient.createGain(); audioGain.gain.value = 0; audioGain.connect(ambient.destination);
    oscillator = ambient.createOscillator(); oscillator.frequency.value = 65; oscillator.type = 'sine'; oscillator.connect(audioGain); oscillator.start();
  }
  void ambient.resume(); muted = !muted;
  element('mute').textContent = muted ? '环境声：关' : '环境声：低频合成'; refresh();
});
document.addEventListener('visibilitychange', () => { last = undefined; if (document.hidden) { playing = false; refresh(); } });
let raf = 0;
let lastRendered = -1;
let droppedFrames = 0;
let carry = 0;
/**
 * Logic runs at 60 Hz on the wall clock; the view redraws at 30 fps.
 * Steps are not hard-capped at four, otherwise a slow GPU would make the
 * cutscene run in slow motion instead of dropping frames.
 */
function loop(now: number): void {
  if (disposed) return;
  if (playing && !stage?.contextLost) {
    const gap = last === undefined ? 0 : (now - last) / 1000;
    const step = advanceFrameClock(frame, carry, gap, opening.durationFrames);
    carry = step.carry;
    if (step.dropped) droppedFrames += 1;
    frame = step.frame;
    elapsed = frame / 60;
    if (frame >= opening.durationFrames - 1) playing = false;
    const display = Math.floor(elapsed * 30);
    if (display !== lastRendered) { lastRendered = display; refresh(); }
  }
  last = now;
  raf = requestAnimationFrame(loop);
}
window.addEventListener('pagehide', () => {
  // Flag first so an in-flight refresh does not pose layers after the slots are cleared.
  disposed = true;
  cancelAnimationFrame(raf);
  stage?.dispose();
  oscillator?.stop();
  void ambient?.close();
});
async function boot(): Promise<void> {
  try {
    stage = await createChaos(canvas, { shapes: chaosShapes(), presentation: chaosPresentation() }, text => { element("loading").textContent = text; });
    // Diagnostic hook for scripts/browser-smoke.mjs: render the same frame on this
    // stage twice, in different orders, and report the canvas bytes' hash. Only
    // reads pixels; it never changes playback state.
    (window as HistoryWindow).__historyHash = (target: number): number => {
      const view = stage;
      if (!view) return -1;
      view.render(target);
      const gl = canvas.getContext('webgl2');
      if (!gl) return -1;
      const pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
      gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      let hash = 2166136261;
      for (let i = 0; i < pixels.length; i++) { hash ^= pixels[i] ?? 0; hash = Math.imul(hash, 16777619); }
      view.render(frame);
      return hash >>> 0;
    };
    play.disabled = false; restart.disabled = false; seek.disabled = false;
    element('loading').textContent = '天地未分，混沌如一枚鸡子。'; start.hidden = false;
    const params = new URLSearchParams(location.search);
    if (params.has('frame')) { frame = Math.max(0, Math.min(opening.durationFrames - 1, Number(params.get('frame')) || 0)); elapsed = frame / 60; overlay.style.display = 'none'; }
    refresh();
    raf = requestAnimationFrame(loop);
  } catch (error) {
    element('loading').textContent = `无法准备画面：${error instanceof Error ? error.message : String(error)}`;
    status.textContent = '请通过本地开发服务访问 /history/；全部画面由引擎笔刷生成。';
  }
}
void boot();
