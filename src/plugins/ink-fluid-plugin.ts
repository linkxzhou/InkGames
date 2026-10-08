import type { EnginePlugin } from '../core/types';
import { InkFluid } from './ink-fluid';
import { withGLState } from './gl-state';
import { InkDiagnosticsToken, InkToken, RendererToken, StrokeToken, type InkVisual, type Point, type Stroke } from './tokens';

export function createInkFluidPlugin(fixedHz = 60): EnginePlugin {
  if (!Number.isFinite(fixedHz) || fixedHz <= 0) throw new Error('Invalid fluid fixedHz');
  let visual: InkVisual;
  let field: InkFluid;
  let rebuild = false;
  const pending = new Set<number>();
  const changed = new Set<number>();
  const erasures: { path: Point[]; radius: number }[] = [];
  let previousStep = 0;
  return {
    manifest: {
      id: 'ink-fluid', version: '1.0.0',
      requires: [{ token: RendererToken, range: '^1.0.0' }, { token: StrokeToken, range: '^1.0.0' }],
      provides: [
        { token: InkToken, version: '1.0.0' },
        { token: InkDiagnosticsToken, version: '1.0.0' },
      ], renderPhase: 'ink',
    },
    register(ctx) {
      visual = { draw: stroke => field.draw(stroke), erase: (path, radius) => { void field.erase(path, radius); }, render: () => field.render(), resize: (w, h) => field.resize(w, h), setPaper: paper => field.setPaper(paper) };
      ctx.provide(InkToken, visual);
      ctx.provide(InkDiagnosticsToken, {
        measureInk: () => field.measureInk(),
        forceRebuild: () => field.forceRebuild(),
        forceRedraw: (strokeId: number) => field.forceRedraw(strokeId),
        forceRedrawBatch: (strokeIds: readonly number[]) => field.forceRedrawBatch(strokeIds),
      });
    },
    init(ctx) {
      const renderer = ctx.get(RendererToken);
      if (!renderer.halfFloat) throw new Error('Ink fluid requires verified 16F render targets');
      field = withGLState(renderer.gl, () => new InkFluid(renderer.gl, renderer.canvas));
      ctx.resources.add(() => withGLState(renderer.gl, () => field.dispose()));
      ctx.resources.add(ctx.events.on<{ strokeId: number }>('StrokeCreated', event => { pending.add(event.payload.strokeId); }));
      ctx.resources.add(ctx.events.on<{ strokeId: number }>('StrokeChanged', event => { changed.add(event.payload.strokeId); }));
      ctx.resources.add(ctx.events.on('StrokeCleared', () => { rebuild = true; pending.clear(); changed.clear(); }));
      // 水刷视觉擦除：与 CPU 权威几何订阅同一条 EraseStroke 命令（plan/07 §3）。
      // 固定墨层不被清除，湿墨被冲掉后由后续 step 的湿度重新驱动，形成“擦后残留”。
      ctx.resources.add(ctx.commands.on<{ path: Point[]; radius: number }>('EraseStroke', command => {
        erasures.push({ path: command.payload.path, radius: command.payload.radius });
      }));
    },
    render(ctx) {
      if (rebuild) {
        field.rebuild(ctx.get(StrokeToken).strokes);
        rebuild = false;
        pending.clear();
        changed.clear();
        erasures.length = 0;
      } else {
        const store = ctx.get(StrokeToken);
        for (const id of pending) {
          const stroke = store.get(id);
          if (stroke) { field.draw(stroke); changed.delete(id); }
        }
        pending.clear();
        const changedStrokes: Stroke[] = [];
        for (const id of changed) {
          const stroke = store.get(id);
          if (stroke) changedStrokes.push(stroke);
        }
        changed.clear();
        // 一次性提交整批：逐笔调用会让相交邻居被重复绘制并累加墨量（plan/09 §10 对账实测）。
        if (changedStrokes.length) field.redrawStrokes(changedStrokes);
        for (const erasure of erasures) field.erase(erasure.path, erasure.radius);
        erasures.length = 0;
      }
      const steps = ctx.step - previousStep;
      for (let i = 0; i < steps; i++) field.step(1 / fixedHz);
      previousStep = ctx.step;
      field.render();
    },
  };
}
