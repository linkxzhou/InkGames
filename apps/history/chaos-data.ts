import type { InkColorName, InkStrokeRequest } from '@inkgames/engine';
import type { InkPresentation, PresentationLayer } from '@inkgames/engine';
import type { ChaosShape } from './procedural';

function stroke(points: readonly (readonly [number, number])[], color: InkColorName = 'black', size: 'small' | 'medium' | 'large' | 'extra-large' = 'small', seed = 1): InkStrokeRequest {
  return { brush: { mode: 'brush', size, effect: 'wet', blend: 'mix' }, color, points: points.map(([x, y]) => ({ x, y })), seed };
}
function key(at: number, x: number, y: number, scale = 1, opacity = 1, rotation = 0, clip?: { x: number; y: number; width: number; height: number }, order?: number): PresentationLayer['keys'][number] {
  return {
    at, x, y, scale, opacity,
    ...(rotation === 0 ? {} : { rotation }),
    ...(clip === undefined ? {} : { clip }),
    ...(order === undefined ? {} : { order }),
  };
}

function shapes(): ChaosShape[] {
  const out: ChaosShape[] = [
    { id: 'ink', width: 256, height: 256, strokes: [stroke([[110, 110], [120, 124], [128, 115], [139, 132], [125, 140]], 'black', 'extra-large')] },
    { id: 'cloud', width: 640, height: 180, strokes: [
      stroke([[20, 100], [120, 70], [230, 110], [340, 65], [450, 100], [600, 80]], 'light_gray_new', 'large'),
      stroke([[20, 130], [140, 100], [260, 140], [390, 110], [590, 130]], 'medium_gray', 'medium'),
    ] },
    { id: 'mountain', width: 640, height: 300, strokes: [
      stroke([[0, 270], [80, 170], [150, 230], [270, 80], [340, 220], [460, 130], [600, 270]], 'light_gray_new', 'large'),
      stroke([[20, 290], [110, 240], [250, 160], [350, 260], [470, 200], [620, 290]], 'medium_gray', 'medium'),
      stroke([[260, 90], [280, 155], [310, 190]], 'black'),
      stroke([[450, 145], [470, 200], [510, 240]], 'black'),
    ] },
    { id: 'water', width: 640, height: 160, strokes: [
      stroke([[0, 30], [120, 50], [260, 20], [390, 55], [620, 30]], 'medium_gray', 'large'),
      stroke([[0, 90], [160, 70], [300, 110], [460, 75], [630, 100]], 'sage_gray', 'medium'),
      stroke([[10, 55], [100, 45], [180, 60], [270, 48], [370, 62], [530, 45]], 'light_gray_new'),
    ] },
    { id: 'pangu', width: 180, height: 300, strokes: [
      stroke([[90, 45], [78, 35], [68, 50], [75, 68], [95, 70], [109, 53], [100, 35], [90, 45]], 'black', 'medium'),
      stroke([[78, 85], [58, 145], [64, 225], [114, 228], [120, 150], [101, 83]], 'gray_brown', 'large'),
      stroke([[76, 90], [85, 150], [106, 198]], 'black'),
      stroke([[73, 220], [60, 280]], 'black', 'medium'),
      stroke([[109, 220], [130, 280]], 'black', 'medium'),
    ] },
    { id: 'armLeft', width: 150, height: 80, pivot: { x: 25, y: 35 }, strokes: [stroke([[25, 40], [70, 43], [125, 27]], 'gray_brown', 'medium'), stroke([[25, 30], [73, 31], [120, 20]], 'black')] },
    { id: 'armRight', width: 150, height: 80, pivot: { x: 125, y: 35 }, strokes: [stroke([[125, 40], [80, 43], [25, 27]], 'gray_brown', 'medium')] },
    { id: 'nuwa', width: 200, height: 300, strokes: [
      stroke([[100, 35], [83, 35], [77, 56], [97, 72], [118, 52], [105, 33]], 'black', 'medium'),
      stroke([[85, 35], [67, 70], [58, 100]], 'black'),
      stroke([[90, 83], [50, 238], [94, 273], [146, 245], [110, 88]], 'sage_gray', 'large'),
      stroke([[91, 100], [85, 185], [125, 240]], 'black'),
      stroke([[97, 275], [150, 280], [185, 244], [146, 222]], 'gray_brown', 'medium'),
    ] },
    { id: 'fire', width: 200, height: 160, strokes: [
      stroke([[50, 140], [75, 92], [64, 50], [100, 100], [135, 20], [126, 110], [160, 140]], 'terra_cotta', 'medium'),
      stroke([[60, 145], [140, 145]], 'black', 'medium'),
    ] },
    { id: 'crack', width: 250, height: 200, strokes: [stroke([[20, 20], [95, 48], [78, 86], [160, 100], [145, 148], [225, 190]], 'black', 'medium')] },
  ];
  const stoneColors: InkColorName[] = ['terra_cotta', 'sage_gray', 'light_gray_new', 'gray_brown', 'medium_gray'];
  stoneColors.forEach((color, index) => out.push({
    id: `stone${index}`,
    width: 90,
    height: 90,
    strokes: [stroke([[25, 30], [55, 20], [70, 50], [50, 65], [25, 50], [25, 30]], color, 'medium', 30 + index)],
  }));
  out.push({ id: 'finish', width: 640, height: 120, strokes: [stroke([[25, 85], [170, 60], [330, 45], [480, 55], [610, 25]], 'black', 'medium')] });
  return out;
}

export function chaosShapes(): readonly ChaosShape[] { return shapes(); }
/** Keyframe presentation data; the engine evaluates it, apps only author it. */
export function chaosPresentation(): InkPresentation {
  const layers: PresentationLayer[] = [];
  const put = (id: string, keys: readonly PresentationLayer['keys'][number][]): void => { layers.push({ id, keys }); };

  put('ink', [key(0, 640, 120, .08, 0), key(110, 640, 300, 1, 1, 0, undefined, 4), key(1080, 640, 360, 2.2, 1, 0, undefined, 4), key(1560, 640, 340, 2.4, 0, 0, undefined, 4)]);
  put('cloud', [key(600, 640, 230, 1.7, 0, 0, undefined, 1), key(720, 640, 225, 1.8, .7, 0, undefined, 1), key(1560, 640, 130, 1.9, .7, 0, undefined, 1), key(5400, 640, 100, 2, .6, 0, undefined, 1)]);
  put('mountain', [key(1320, 640, 560, 1.8, 0, 0, undefined, 2), key(1620, 640, 548, 1.8, 1, 0, undefined, 2), key(5400, 640, 512, 1.9, 1, 0, undefined, 2)]);
  put('water', [key(2640, 640, 556, 2, 0, 0, undefined, 3), key(2760, 640, 556, 2, .85, 0, undefined, 3), key(3660, 640, 548, 2, .9, 0, undefined, 3), key(5400, 640, 570, 2, .8, 0, undefined, 3)]);
  put('pangu', [key(600, 640, 425, 1.4, 0, 0, undefined, 5), key(780, 640, 425, 1.4, 1, 0, undefined, 5), key(3000, 640, 430, 1.45, 1, 0, undefined, 5), key(3180, 640, 440, 1.4, 0, 0, undefined, 5)]);
  put('armLeft', [key(780, 560, 380, 1.2, 0, 0, undefined, 6), key(1560, 560, 380, 1.2, 1, 1.05, undefined, 6), key(3060, 560, 380, 1.2, 0, 1.05, undefined, 6)]);
  put('armRight', [key(780, 720, 380, 1.2, 0, 0, undefined, 6), key(1560, 720, 380, 1.2, 1, -1.05, undefined, 6), key(3060, 720, 380, 1.2, 0, -1.05, undefined, 6)]);
  put('crack', [
    key(4200, 900, 190, 1.5, 0, 0, { x: 0, y: 0, width: 1280, height: 720 }),
    key(4500, 900, 190, 1.6, 1, 0, { x: 0, y: 0, width: 1280, height: 720 }),
    key(5100, 900, 190, 1.65, 1, 0, { x: 0, y: 60, width: 1280, height: 300 }),
    key(5280, 900, 190, 1.7, 0, 0, { x: 400, y: 120, width: 520, height: 200 }),
    key(5400, 900, 190, 1.7, 0, 0, { x: 620, y: 160, width: 60, height: 40 }),
  ]);
  put('nuwa', [key(3120, 550, 470, 1.35, 0, 0, undefined, 5), key(3300, 550, 470, 1.35, 1, 0, undefined, 5), key(5400, 550, 468, 1.35, 1, 0, undefined, 5)]);
  put('fire', [key(3900, 760, 580, 1, 0, 0, undefined, 2), key(4020, 760, 580, 1, .85, 0, undefined, 2), key(4700, 760, 580, 1.05, .9, 0, undefined, 2), key(5400, 760, 580, 1, .5, 0, undefined, 2)]);
  put('finish', [key(4980, 640, 610, 1.6, 0, 0, undefined, 7), key(5160, 640, 610, 1.6, 1, 0, undefined, 7), key(5400, 640, 610, 1.6, 1, 0, undefined, 7)]);
  const stoneColors: InkColorName[] = ['terra_cotta', 'sage_gray', 'light_gray_new', 'gray_brown', 'medium_gray'];
  stoneColors.forEach((_color, index) => {
    const base = 4740 + index * 40;
    put(`stone${index}`, [
      key(base - 360, 760 + (index - 2) * 28, 540, .8, 0, 0, undefined, 6),
      key(base - 300, 770 + (index - 2) * 30, 535, .85, 1, 0, undefined, 6),
      key(5400, 894 + (index - 2) * 6, 348 + index * 8, .9, 1, 0, undefined, 6),
    ]);
  });
  return { format: 'inkgames.presentation', version: 1, id: 'shanggu.hundun.opening', canvas: { width: 1280, height: 720 }, fps: 30, durationFrames: 5400, layers,
    impulses: [
      // s1: the falling seed spreads on the ink layer it landed on.
      { layer: 'ink', at: 112, x: 128, y: 128, radius: 26 },
      { layer: 'ink', at: 168, x: 128, y: 128, radius: 44 },
      { layer: 'ink', at: 230, x: 128, y: 128, radius: 62 },
      // s4: the flood spreads on the water sheet where it arrives.
      { layer: 'water', at: 3700, x: 320, y: 60, radius: 70 },
      { layer: 'water', at: 3900, x: 150, y: 40, radius: 50 },
      { layer: 'water', at: 4100, x: 500, y: 80, radius: 60 },
    ] };
}
