import type { HostPort } from '../core/types';

export interface P5CanvasHost extends HostPort {
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGL2RenderingContext;
  dispose(): void;
}

export async function createP5Host(p5Constructor: new (sketch: (instance: P5Instance) => void, node?: HTMLElement) => P5Instance, parent: HTMLElement, width: number, height: number): Promise<P5CanvasHost> {
  if (width <= 0 || height <= 0) throw new Error('Canvas dimensions must be positive');
  let instance: P5Instance | undefined;
  try {
    await new Promise<void>((resolve, reject) => {
      instance = new p5Constructor(p => {
        p.setup = () => {
          try {
            p.pixelDensity(1);
            p.createCanvas(width, height, p.WEBGL);
            p.noLoop();
            resolve();
          } catch (error) { reject(error); }
        };
      }, parent);
    });
    const canvas = parent.querySelector('canvas:last-of-type');
    const gl = instance?.drawingContext;
    if (!(canvas instanceof HTMLCanvasElement) || !(gl instanceof WebGL2RenderingContext)) throw new Error('p5 host requires a WebGL2 canvas');
    const lostHandlers = new Set<() => void>();
    const restoredHandlers = new Set<() => void>();
    // p5 2.3.4 不处理 context lost（plan/07 §8.2）：宿主负责 preventDefault + 上报，
    // 由引擎统一暂停/恢复时钟，而不是静默吞掉事件。
    const onLost = (event: Event) => {
      event.preventDefault();
      for (const handler of lostHandlers) handler();
    };
    const onRestored = () => { for (const handler of restoredHandlers) handler(); };
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);
    return {
      canvas, gl,
      now: () => performance.now(),
      requestFrame: callback => requestAnimationFrame(time => callback(time)),
      cancelFrame: handle => cancelAnimationFrame(handle),
      onContextLost: handler => { lostHandlers.add(handler); },
      onContextRestored: handler => { restoredHandlers.add(handler); },
      dispose: () => {
        canvas.removeEventListener('webglcontextlost', onLost);
        canvas.removeEventListener('webglcontextrestored', onRestored);
        lostHandlers.clear(); restoredHandlers.clear();
        instance?.remove(); instance = undefined;
      },
    };
  } catch (error) { instance?.remove(); throw error; }
}

export interface P5Instance {
  WEBGL: unknown;
  setup: () => void;
  createCanvas(width: number, height: number, renderer: unknown): unknown;
  noLoop(): void;
  pixelDensity(value: number): void;
  remove(): void;
  readonly drawingContext: WebGL2RenderingContext;
}
