import { InkScene, poseAt, validatePresentation, type InkPresentation, type InkStrokeRequest } from '@inkgames/engine';

export interface ChaosView { render(frame: number): void; dispose(): void; readonly contextLost: boolean; }

export interface ChaosShape {
  readonly id: string;
  readonly width: number;
  readonly height: number;
  readonly strokes: readonly InkStrokeRequest[];
  readonly pivot?: { readonly x: number; readonly y: number };
}

export interface ChaosOptions {
  readonly shapes: readonly ChaosShape[];
  readonly presentation: unknown;
}

/** Data-driven procedural scroll: real brush layers plus keyframe evaluation. */
export async function createChaos(canvas: HTMLCanvasElement, options: ChaosOptions, progress: (text: string) => void): Promise<ChaosView> {
  const presentation: InkPresentation = validatePresentation(options.presentation);
  if (presentation.canvas.width !== 1280 || presentation.canvas.height !== 720) throw new Error('表现数据画布必须为 1280×720');
  const scene = new InkScene(canvas);
  try {
    for (const [index, shape] of options.shapes.entries()) {
      progress(`引擎绘制：${shape.id}（${index + 1}/${options.shapes.length}）`);
      await scene.add({ id: shape.id, width: shape.width, height: shape.height, strokes: shape.strokes, ...(shape.pivot === undefined ? {} : { pivot: shape.pivot }) });
    }
  } catch (error) { scene.dispose(); throw error; }
  for (const layer of presentation.layers) {
    if (!scene.has(layer.id)) {
      const missing = layer.id;
      scene.dispose();
      throw new Error(`未知墨层 ${missing}`);
    }
  }
  const applied = new Set<number>();
  let lastFrame = -1;
  return {
    get contextLost() { return scene.contextLost; },
    dispose: () => scene.dispose(),
    render(frame: number): void {
      if (scene.contextLost) return;
      // Wet-spread impulses are destructive and one-shot. A backward seek cannot
      // undo them, so the set is only cleared when the timeline restarts.
      if (frame < lastFrame) applied.clear();
      lastFrame = frame;
      for (const layer of presentation.layers) {
        const pose = poseAt(layer, frame);
        scene.pose(layer.id, { x: pose.x, y: pose.y, scale: pose.scale, rotation: pose.rotation, opacity: pose.opacity, ...(pose.order === undefined ? {} : { order: pose.order }) });
        scene.clip(layer.id, pose.clip ?? null);
      }
      presentation.impulses.forEach((impulse, index) => {
        if (applied.has(index) || frame < impulse.at) return;
        applied.add(index);
        scene.wash(impulse.layer, [{ x: impulse.x, y: impulse.y, radius: impulse.radius }]);
      });
      scene.render();
    },
  };
}
