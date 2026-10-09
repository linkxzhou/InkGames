import type { AudioCue } from './narrative-types';

export interface AudioSink {
  schedule(bus: AudioCue['bus'], key: string, frequency: number, durationSec: number, gain: number, loop: boolean): void;
  stop(bus: AudioCue['bus']): void;
}

/**
 * Four buses. Missing asset files become short tones so sync points still release.
 * The real recordings are not in this repository.
 */
export class AudioBus {
  private readonly playing = new Map<string, number>();
  private readonly log: AudioCue[] = [];
  private unlocked = false;
  private context: AudioContext | undefined;
  private readonly nodes: { osc: OscillatorNode; gain: GainNode; bus: AudioCue['bus'] }[] = [];

  constructor(private readonly sink?: AudioSink, private readonly volumes: Readonly<Record<AudioCue['bus'], number>> = { bgm: 0.8, amb: 0.8, sfx: 0.8, vo: 1 }) {}

  get cues(): readonly AudioCue[] { return this.log; }

  unlock(): void {
    this.unlocked = true;
    if (this.sink || typeof AudioContext === 'undefined') return;
    if (!this.context) this.context = new AudioContext();
    void this.context.resume();
  }

  play(cue: AudioCue, frame: number, fps = 60): void {
    this.log.push(cue);
    if (cue.action === 'stop') {
      this.stop(cue.bus);
      return;
    }
    const key = cue.key ?? cue.asset ?? cue.bus;
    const duration = cue.bus === 'vo' ? 3 : cue.bus === 'sfx' ? 0.35 : 8;
    if (cue.bus === 'vo' && cue.key) this.playing.set(cue.key, frame + Math.round(duration * fps));
    const gain = dbToGain(cue.gainDb ?? -8) * (this.volumes[cue.bus] ?? 1);
    const frequency = cue.bus === 'vo' ? 196 : cue.bus === 'sfx' ? 520 : cue.bus === 'amb' ? 82 : 110;
    if (this.sink) {
      this.sink.schedule(cue.bus, key, frequency, duration, gain, cue.loop === true && cue.bus !== 'vo');
      return;
    }
    if (!this.unlocked || !this.context) return;
    const osc = this.context.createOscillator();
    const amp = this.context.createGain();
    osc.type = cue.bus === 'sfx' ? 'square' : 'sine';
    osc.frequency.value = frequency;
    amp.gain.value = Math.min(0.2, gain);
    osc.connect(amp);
    amp.connect(this.context.destination);
    osc.start();
    if (!cue.loop || cue.bus === 'vo' || cue.bus === 'sfx') osc.stop(this.context.currentTime + duration);
    this.nodes.push({ osc, gain: amp, bus: cue.bus });
  }

  stop(bus: AudioCue['bus']): void {
    this.sink?.stop(bus);
    for (const node of this.nodes) {
      if (node.bus !== bus) continue;
      try { node.osc.stop(); } catch { /* already stopped */ }
    }
  }

  voEnded(key: string, frame: number): boolean {
    const until = this.playing.get(key);
    if (until === undefined) return true;
    return frame >= until;
  }

  dispose(): void {
    for (const bus of ['bgm', 'amb', 'sfx', 'vo'] as const) this.stop(bus);
    void this.context?.close();
  }
}

function dbToGain(db: number): number {
  let gain = 1;
  const steps = Math.round(db);
  const up = steps > 0;
  const n = up ? steps : -steps;
  for (let i = 0; i < n; i++) gain = up ? gain * 1.122018454 : gain / 1.122018454;
  return gain;
}
