import {
  INK_STAGE_PAPER, paintProp,
  type InkBrushMode, type InkFinish, type PropPaintingId, type PropPlacement, type PropStroke,
} from '@inkgames/engine';

export const PLACEMENT: Readonly<Record<PropPaintingId, PropPlacement>> = {
  sword: { x: 300, y: 320 },
  blade: { x: 280, y: 330 },
  spear: { x: 300, y: 260 },
  bow: { x: 300, y: 240 },
  shield: { x: 320, y: 250 },
  'war-horse': { x: 330, y: 250 },
  banner: { x: 200, y: 250, pose: 1 },
  'ink-bomb': { x: 320, y: 300, scale: 1.25 },
  'water-brush': { x: 320, y: 300 },
  boat: { x: 330, y: 250 },
  water: { x: 0, y: 200, width: 640 },
  landscape: { x: 0, y: 330, width: 640 },
  figure: { x: 320, y: 260 },
};

export const PROPS: readonly PropPaintingId[] = [
  'sword', 'blade', 'spear', 'bow', 'shield', 'war-horse', 'banner', 'ink-bomb', 'water-brush', 'boat', 'water', 'landscape',
];

export function effectStroke(finish: InkFinish): PropStroke[] {
  const points = Array.from({ length: 36 }, (_, k) => ({ x: 70 + k * 14, y: 200 + (k % 6) * 3 }));
  return [{
    prop: 'landscape', part: 'ground',
    brush: { mode: 'brush', size: 'large', effect: 'wet', blend: 'mix' },
    color: 'black', points, seed: 100, finish,
  }];
}

export function cameraStrokes(): PropStroke[] {
  const across = Array.from({ length: 48 }, (_, k) => ({ x: 30 + (740 * k) / 47, y: 300 }));
  const corner = Array.from({ length: 16 }, (_, k) => ({ x: 36 + k * 10, y: 48 + k * 8 }));
  return [
    { prop: 'landscape', part: 'ground', brush: { mode: 'brush', size: 'large', effect: 'mix', blend: 'mix' }, color: 'black', points: across, seed: 100 },
    { prop: 'landscape', part: 'post', brush: { mode: 'brush', size: 'medium', effect: 'mix', blend: 'mix' }, color: 'terra_cotta', points: corner, seed: 101 },
  ];
}

export function modeStrokes(): PropStroke[] {
  const modes: InkBrushMode[] = ['brush', 'marker', 'gothic', 'pen', 'dots', 'fly', 'brushSP'];
  return modes.map((mode, i) => {
    const shift = mode === 'gothic' ? 0 : -10;
    const points = Array.from({ length: 40 }, (_, k) => ({ x: 80 + (620 * k) / 39 + shift, y: 60 + i * 75 + shift }));
    return {
      prop: 'landscape', part: mode, brush: { mode, size: mode === 'gothic' ? 'medium' : 'large', effect: 'mix', blend: 'mix' },
      color: 'black', points, seed: 100 + i,
    };
  });
}

export interface CompareSheet {
  readonly id: PropPaintingId;
  readonly scene: string | null;
  readonly width: number;
  readonly height: number;
  readonly background: readonly [number, number, number];
  readonly seed: number;
  readonly strokes: readonly PropStroke[];
  readonly camera: boolean;
}

export function compareSheet(search: string): CompareSheet {
  const query = new URLSearchParams(search);
  const requested = query.get('prop') as PropPaintingId | null;
  const id: PropPaintingId = requested && PROPS.includes(requested) ? requested : 'sword';
  const scene = query.get('scene');
  const modes = scene === 'modes';
  const effect = scene === 'flow' || scene === 'distort' || scene === 'metallic';
  const camera = scene === 'camera';
  const width = modes || effect || camera ? 800 : 640;
  const height = modes ? 600 : 480;
  const background: readonly [number, number, number] = modes || effect || camera ? [222, 222, 222] : INK_STAGE_PAPER;
  const strokes = scene === 'modes' ? modeStrokes()
    : scene === 'flow' ? effectStroke({ flow: { blendType: 0, iterations: 4, seed: 100 } })
    : scene === 'distort' ? effectStroke({ distort: { displacementB: 20, displacementC: 50, extent: 'frame' } })
    : scene === 'metallic' ? effectStroke({ metallic: { size: 10 } })
    : scene === 'camera' ? cameraStrokes()
    : paintProp(id, PLACEMENT[id]);
  return { id, scene, width, height, background, seed: 1234567890, strokes, camera };
}
