import { lookupString } from './content-catalog';
import { resolveStrokeCue } from './stroke-cues';
import type { AudioCue, CameraKey, CutsceneDef, EffectCue, StringTable, TextCue } from './narrative-types';
import type { PropStroke } from '../plugins/prop-paintings';

export interface ActiveText {
  readonly cue: TextCue;
  readonly text: string;
}

export interface StrokePulse {
  readonly layer: string;
  readonly mode: 'instant' | 'begin' | 'point' | 'end';
  readonly stroke: PropStroke;
  readonly point?: { readonly x: number; readonly y: number };
}

export interface CameraPose {
  readonly x: number;
  readonly y: number;
  readonly zoom: number;
  readonly shake: number;
  readonly focusZ: number;
  readonly blur: number;
}

export interface CutsceneTick {
  readonly frame: number;
  readonly shotId: string | undefined;
  readonly camera: CameraPose;
  readonly texts: readonly ActiveText[];
  readonly strokes: readonly StrokePulse[];
  readonly effects: readonly EffectCue[];
  readonly audio: readonly AudioCue[];
  readonly waiting: 'vo-end' | 'input' | undefined;
  readonly ended: boolean;
  readonly frozen: boolean;
  readonly fade: number;
  readonly vignette: number;
}

interface LiveRun {
  layer: string;
  stroke: PropStroke;
  cursor: number;
  open: boolean;
  done: boolean;
}

/**
 * Frame clock for one cutscene. Painting and audio stay with the caller.
 * inOutSine is a smoothstep polynomial so the clock does not call Math.sin.
 */
export class CutscenePlayer {
  private frame = -1;
  private wait: 'vo-end' | 'input' | undefined;
  private waited = 0;
  private waitVo: string | undefined;
  private waitCap = 0;
  private frozen = false;
  private fade = 0;
  private fadeFrom = 0;
  private fadeTo = 0;
  private fadeStart = 0;
  private fadeFrames = 1;
  private vignette = 0;
  private readonly runs: LiveRun[] = [];
  private readonly started = new Set<number>();

  constructor(
    readonly def: CutsceneDef,
    readonly strings: StringTable,
    private voPlaying: (key: string) => boolean = () => false,
  ) {}

  get position(): number { return this.frame; }

  shotId(frame = this.frame): string | undefined {
    return this.def.shots.find(shot => frame >= shot.from && frame < shot.to)?.id;
  }

  /** One frame. confirm releases an input sync. autoSync is the skip path. */
  step(confirm = false, autoSync = false): CutsceneTick {
    if (this.wait) {
      this.waited += 1;
      const released = this.wait === 'input'
        ? confirm || autoSync
        : autoSync || !this.waitVo || !this.voPlaying(this.waitVo) || this.waited >= this.waitCap;
      if (!released) return this.view([]);
      this.wait = undefined;
      this.waitVo = undefined;
    }
    if (this.frame >= this.def.durationFrames) return this.view([]);
    this.frame += 1;
    const strokes: StrokePulse[] = [];
    if (!this.frozen) {
      this.def.tracks.strokes.forEach((cue, index) => {
        if (cue.at !== this.frame || this.started.has(index)) return;
        this.started.add(index);
        const resolved = resolveStrokeCue(cue);
        if (cue.mode === 'instant') {
          for (const stroke of resolved) strokes.push({ layer: cue.layer, mode: 'instant', stroke });
          return;
        }
        for (const stroke of resolved) this.runs.push({ layer: cue.layer, stroke, cursor: 0, open: false, done: false });
      });
      for (const run of this.runs) {
        if (run.done) continue;
        const point = run.stroke.points[run.cursor];
        if (!point) {
          if (run.open) {
            const last = run.stroke.points[run.stroke.points.length - 1];
            if (last) strokes.push({ layer: run.layer, mode: 'end', stroke: run.stroke, point: last });
          }
          run.done = true;
          continue;
        }
        if (!run.open) {
          strokes.push({ layer: run.layer, mode: 'begin', stroke: run.stroke, point });
          run.open = true;
        } else if (run.cursor >= run.stroke.points.length - 1) {
          strokes.push({ layer: run.layer, mode: 'end', stroke: run.stroke, point });
          run.done = true;
        } else {
          strokes.push({ layer: run.layer, mode: 'point', stroke: run.stroke, point });
        }
        run.cursor += 1;
      }
    }
    for (const effect of this.def.tracks.effects) {
      if (effect.at !== this.frame) continue;
      if (effect.kind === 'freeze') this.frozen = true;
      if (effect.kind === 'fade') {
        this.fadeFrom = typeof effect.from === 'number' ? effect.from : this.fade;
        this.fadeTo = typeof effect.to === 'number' ? effect.to : 1;
        this.fadeStart = this.frame;
        this.fadeFrames = effect.frames && effect.frames > 0 ? effect.frames : 1;
      }
      if (effect.kind === 'mask') {
        const amount = effect.params?.vignette;
        if (typeof amount === 'number') this.vignette = amount;
      }
    }
    const sync = this.def.tracks.sync.find(point => point.at === this.frame && point.waitFor !== 'none');
    if (sync && !(autoSync && sync.waitFor === 'input')) {
      this.wait = sync.waitFor === 'none' ? undefined : sync.waitFor;
      this.waited = 0;
      this.waitVo = sync.vo;
      this.waitCap = sync.maxWaitFrames ?? 1;
      if (autoSync) this.wait = undefined;
    }
    return this.view(strokes);
  }

  /** Jump ahead, collapsing each newly started live stroke into one instant paint. */
  fastForward(frames: number): StrokePulse[] {
    const pulses: StrokePulse[] = [];
    const cap = Math.max(0, Math.floor(frames));
    for (let i = 0; i < cap && this.frame < this.def.durationFrames; i++) {
      const tick = this.step(true, true);
      for (const pulse of tick.strokes) {
        if (pulse.mode === 'instant') pulses.push(pulse);
        else if (pulse.mode === 'begin') pulses.push({ ...pulse, mode: 'instant' });
      }
    }
    return pulses;
  }

  private view(strokes: readonly StrokePulse[]): CutsceneTick {
    const ended = this.frame >= this.def.durationFrames && !this.wait;
    const u = (Math.max(0, this.frame) - this.fadeStart) / this.fadeFrames;
    const k = u < 0 ? 0 : u > 1 ? 1 : u;
    this.fade = this.fadeFrom + (this.fadeTo - this.fadeFrom) * k;
    return {
      frame: Math.max(0, this.frame),
      shotId: this.shotId(),
      camera: cameraAt(this.def.tracks.camera, Math.max(0, this.frame)),
      texts: this.def.tracks.text.filter(cue => this.frame >= cue.at && this.frame < cue.until).map(cue => ({
        cue,
        text: lookupString(this.strings, cue.key ?? cue.vo),
      })),
      strokes,
      effects: this.def.tracks.effects.filter(effect => effect.at === this.frame),
      audio: this.def.tracks.audio.filter(cue => cue.at === this.frame),
      waiting: this.wait,
      ended,
      frozen: this.frozen,
      fade: this.fade,
      vignette: this.vignette,
    };
  }
}

function ease(kind: CameraKey['ease'], t: number): number {
  const u = t < 0 ? 0 : t > 1 ? 1 : t;
  if (kind === 'inQuad') return u * u;
  if (kind === 'outQuad') return 1 - (1 - u) * (1 - u);
  if (kind === 'inOutSine') return u * u * (3 - 2 * u);
  return u;
}

export function cameraAt(keys: readonly CameraKey[], frame: number): CameraPose {
  const first = keys[0];
  if (!first) return { x: 0, y: 0, zoom: 1, shake: 0, focusZ: 0, blur: 0 };
  let prev = first;
  let next = first;
  for (const key of keys) {
    if (key.at <= frame) prev = key;
    if (key.at >= frame) { next = key; break; }
    next = key;
  }
  const span = next.at - prev.at;
  const t = span <= 0 ? 1 : (frame - prev.at) / span;
  const k = ease(next.ease, t);
  let shake = 0;
  if (prev.shake && frame >= prev.at && frame < prev.at + prev.shake.frames) {
    const n = (frame * 17 + 3) % 100;
    shake = prev.shake.amp * (n / 50 - 1);
  }
  const dof = (k > 0.5 ? next.dof : prev.dof) ?? next.dof ?? prev.dof;
  return {
    x: prev.x + (next.x - prev.x) * k,
    y: prev.y + (next.y - prev.y) * k,
    zoom: prev.zoom + (next.zoom - prev.zoom) * k,
    shake,
    focusZ: dof?.focusZ ?? 0,
    blur: dof?.blur ?? 0,
  };
}
