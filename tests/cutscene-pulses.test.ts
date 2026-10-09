import { describe, expect, it } from 'vitest';
import { CutscenePlayer } from '../src/core/cutscene-player';
import type { CutsceneDef, StringTable } from '../src/core/narrative-types';

const strings: StringTable = { locale: 'zh-Hans', strings: {} };

function def(points: number): CutsceneDef {
  return {
    format: 'inkgames.cutscene', version: 1, id: 'test',
    canvas: { width: 1280, height: 720, paper: [220, 212, 190], seed: 1 },
    clock: { fps: 60, mode: 'frame' },
    durationFrames: 40,
    layers: [{ id: 'sheet', z: 0, kind: 'inkPlane', paper: true }],
    shots: [{ id: 's1', from: 0, to: 40 }],
    tracks: {
      strokes: [
        {
          at: 0, layer: 'sheet', mode: 'live',
          source: {
            brush: 'sword.slash', color: 'black', speed: 4,
            path: { type: 'polyline', points: Array.from({ length: points }, (_v, i) => [i * 10, i * 4] as const) },
          },
        },
      ],
      camera: [{ at: 0, x: 0, y: 0, zoom: 1, ease: 'linear' }],
      text: [], effects: [], audio: [], sync: [],
    },
  };
}

describe('cutscene live stroke pulses', () => {
  it('emits one begin, ordered points, then a single closing end', () => {
    const player = new CutscenePlayer(def(5), strings);
    const modes: string[] = [];
    let closes = 0;
    for (let i = 0; i < 20; i++) {
      for (const pulse of player.step().strokes) {
        modes.push(pulse.mode);
        if (pulse.mode === 'end' && pulse.endOfStroke === true) closes += 1;
      }
    }
    expect(modes[0]).toBe('begin');
    expect(modes.filter(mode => mode === 'begin')).toHaveLength(1);
    expect(modes.filter(mode => mode === 'end')).toHaveLength(1);
    expect(closes).toBe(1);
    expect(modes.filter(mode => mode === 'point').length).toBeGreaterThan(1);
  });

  it('closes a single-point stroke instead of leaving it open', () => {
    const player = new CutscenePlayer(def(1), strings);
    const modes: string[] = [];
    for (let i = 0; i < 5; i++) for (const pulse of player.step().strokes) modes.push(pulse.mode);
    expect(modes).toEqual(['begin', 'end']);
  });

  it('collapses live strokes into instant paints when skipped', () => {
    const player = new CutscenePlayer(def(6), strings);
    const pulses = player.fastForward(30);
    expect(pulses.length).toBeGreaterThan(0);
    for (const pulse of pulses) expect(pulse.mode).toBe('instant');
  });
});
