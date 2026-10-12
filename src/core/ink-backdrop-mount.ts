import { InkBackdrop } from './ink-backdrop';

/** 给 file:// 查看器的 IIFE 入口。找到 #inkbg 就铺底，没有 WebGL 时拿掉画布。 */
export function mountInkBackdrop(canvas: HTMLCanvasElement): InkBackdrop | undefined {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let backdrop: InkBackdrop;
  try {
    backdrop = new InkBackdrop({ canvas, reducedMotion: reduced });
  } catch {
    canvas.remove();
    return undefined;
  }
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onMotion = (): void => { backdrop.setReducedMotion(motion.matches); };
  motion.addEventListener('change', onMotion);
  backdrop.start();
  return backdrop;
}

function boot(): void {
  const canvas = document.getElementById('inkbg');
  if (canvas instanceof HTMLCanvasElement) mountInkBackdrop(canvas);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
