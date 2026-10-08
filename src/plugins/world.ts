import type { EnginePlugin } from '../core/types';
import { CameraToken, InputToken, SceneToken, type Camera2D, type Input2D, type PointerSample, type Scene2D } from './tokens';

export function createScenePlugin(width: number, height: number, gravity = 700): EnginePlugin {
  let scene: Scene2D;
  return {
    manifest: { id: 'scene2d', version: '1.0.0', provides: [{ token: SceneToken, version: '1.0.0' }] },
    register(ctx) {
      let nextId = 1;
      scene = {
        width, height, gravity, circles: [], markers: [],
        addCircle(body) { const circle = { ...body, id: nextId++ }; this.circles.push(circle); return circle; },
        addMarker(marker) { this.markers.push({ ...marker }); },
        clearMarkers() { this.markers.length = 0; },
        reset(w, h) { this.width = w; this.height = h; this.circles.length = 0; this.markers.length = 0; nextId = 1; },
      };
      ctx.provide(SceneToken, scene);
    },
    init() { if (width <= 0 || height <= 0 || !Number.isFinite(gravity)) throw new Error('Invalid scene dimensions or gravity'); },
  };
}

export function createCameraPlugin(): EnginePlugin {
  let camera: Camera2D;
  return {
    manifest: { id: 'camera2d', version: '1.0.0', provides: [{ token: CameraToken, version: '1.0.0' }] },
    register(ctx) {
      camera = {
        x: 0, y: 0, zoom: 1,
        viewport: { x: 0, y: 0, width: 0, height: 0 },
        setViewport(viewport) { Object.assign(this.viewport, viewport); },
        screenToWorld(p) { return { x: p.x / this.zoom + this.x, y: p.y / this.zoom + this.y }; },
        worldToScreen(p) { return { x: (p.x - this.x) * this.zoom, y: (p.y - this.y) * this.zoom }; },
      };
      ctx.provide(CameraToken, camera);
    },
    init() {},
  };
}

export function createInputPlugin(): EnginePlugin {
  let input: Input2D;
  return {
    manifest: { id: 'input2d', version: '1.0.0', provides: [{ token: InputToken, version: '1.0.0' }] },
    register(ctx) {
      const samples: PointerSample[] = [];
      input = { push(sample) { samples.push({ ...sample }); }, drain() { return samples.splice(0); } };
      ctx.provide(InputToken, input);
      ctx.resources.add(ctx.commands.on<PointerSample>('PointerSample', command => input.push(command.payload)));
    },
    init() {},
  };
}

export function createPointerPlugin(canvas: HTMLCanvasElement): EnginePlugin & { setTool(value: PointerSample['tool']): void } {
  let tool: PointerSample['tool'] = 'ink';
  return {
    manifest: { id: 'pointer-dom', version: '1.0.0', requires: [{ token: InputToken, range: '^1.0.0' }, { token: CameraToken, range: '^1.0.0' }] },
    register() {},
    init(ctx) {
      const camera = ctx.get(CameraToken);
      function push(event: PointerEvent, kind: PointerSample['kind']): void {
        const rect = canvas.getBoundingClientRect();
        const point = camera.screenToWorld({
          x: (event.clientX - rect.left) * canvas.width / rect.width,
          y: (event.clientY - rect.top) * canvas.height / rect.height,
        });
        const pressure = event.pointerType === 'mouse' ? 0.5 : event.pressure;
        ctx.commands.enqueue<PointerSample>('PointerSample', {
          ...point, pressure: Number.isFinite(pressure) ? pressure : 0.5, kind, tool,
        });
      }
      const down = (event: PointerEvent) => { canvas.setPointerCapture(event.pointerId); push(event, 'down'); };
      const move = (event: PointerEvent) => {
        if (event.buttons === 0) return;
        const batch = event.getCoalescedEvents?.() ?? [event];
        for (const sample of batch.length ? batch : [event]) push(sample, 'move');
      };
      const up = (event: PointerEvent) => { push(event, 'up'); if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId); };
      const cancel = (event: PointerEvent) => push(event, 'cancel');
      canvas.addEventListener('pointerdown', down);
      canvas.addEventListener('pointermove', move);
      canvas.addEventListener('pointerup', up);
      canvas.addEventListener('pointercancel', cancel);
      ctx.resources.add(() => {
        canvas.removeEventListener('pointerdown', down);
        canvas.removeEventListener('pointermove', move);
        canvas.removeEventListener('pointerup', up);
        canvas.removeEventListener('pointercancel', cancel);
      });
    },
    setTool(value: PointerSample['tool']) { tool = value; },
  };
}
