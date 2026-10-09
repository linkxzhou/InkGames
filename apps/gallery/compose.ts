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

/** The sheet already carries splash paths. Nothing here samples a reference. */
export function galleryStrokes(id: GalleryId): InkStrokeRequest[] {
  return compileVectorInk(parseVectorInk(SHEETS[id]), { width: PLATE, height: PLATE });
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
