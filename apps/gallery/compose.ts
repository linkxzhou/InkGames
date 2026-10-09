import {
  compileVectorInk, parseVectorInk,
  type InkStrokeRequest, type InkSurface,
} from '@inkgames/engine';
import chaos1 from '../../assets/gallery/chaos-1.json';
import chaos2 from '../../assets/gallery/chaos-2.json';
import chaos3 from '../../assets/gallery/chaos-3.json';
import chaos4 from '../../assets/gallery/chaos-4.json';
import chuhan from '../../assets/gallery/chuhan.json';

/** Square plate, same aspect as the reference PNGs. */
export const PLATE = 720;

export type GalleryId = 'chaos-1' | 'chaos-2' | 'chaos-3' | 'chaos-4' | 'chuhan';

const SHEETS: Readonly<Record<GalleryId, unknown>> = {
  'chaos-1': chaos1,
  'chaos-2': chaos2,
  'chaos-3': chaos3,
  'chaos-4': chaos4,
  chuhan,
};

function splash(x: number, y: number, seed: number, count: number): InkStrokeRequest[] {
  const strokes: InkStrokeRequest[] = [];
  for (let i = 0; i < count; i++) {
    const dx = ((i * 37) % 17) - 8;
    const dy = ((i * 19) % 13) - 6;
    strokes.push({
      brush: { mode: 'gothic', size: i % 2 === 0 ? 'large' : 'medium', effect: 'wet', blend: 'mix' },
      color: i % 3 === 0 ? 'black' : 'dark_gray',
      seed: seed + i,
      points: [
        { x: x + dx * 4, y: y + dy * 3 },
        { x: x + dx * 9, y: y + dy * 8 - 18 },
        { x: x + dx * 3 + 10, y: y + 16 + (i % 4) * 6 },
      ],
    });
  }
  return strokes;
}

/** Vector sheet plus a few procedural splash strokes. Splash is not traced from the reference. */
export function galleryStrokes(id: GalleryId): InkStrokeRequest[] {
  const drawn = compileVectorInk(parseVectorInk(SHEETS[id]), { width: PLATE, height: PLATE });
  if (id === 'chaos-1') return [...drawn, ...splash(460, 250, 70, 6), ...splash(160, 420, 80, 4)];
  if (id === 'chaos-2') return [...drawn, ...splash(190, 110, 40, 4), ...splash(560, 100, 50, 4)];
  if (id === 'chaos-3') return [...drawn, ...splash(180, 520, 33, 4), ...splash(620, 560, 36, 4)];
  if (id === 'chaos-4') return [...drawn, ...splash(470, 80, 90, 5), ...splash(360, 560, 100, 4)];
  return [...drawn, ...splash(280, 80, 200, 8), ...splash(620, 120, 220, 6), ...splash(400, 360, 240, 5)];
}

function paintAll(surface: InkSurface, strokes: readonly InkStrokeRequest[]): void {
  for (const stroke of strokes) surface.paint(stroke);
}

export function paintChaos1(surface: InkSurface): void {
  paintAll(surface, galleryStrokes('chaos-1'));
}

export function paintChaos2(surface: InkSurface): void {
  paintAll(surface, galleryStrokes('chaos-2'));
}

export function paintChaos3(surface: InkSurface): void {
  paintAll(surface, galleryStrokes('chaos-3'));
}

export function paintChaos4(surface: InkSurface): void {
  paintAll(surface, galleryStrokes('chaos-4'));
}

export function paintChuhan(surface: InkSurface): void {
  paintAll(surface, galleryStrokes('chuhan'));
}
