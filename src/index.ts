export { InkStage } from './core/ink-stage';
export type { InkStageOptions } from './core/ink-stage';
export { InkWorld } from './core/ink-world';
export type { InkBridge, InkImpact, InkProjectile } from './core/ink-world';
export { ITEM_PRESETS, getItemPreset } from './plugins/items';
export type { ItemPreset } from './plugins/items';
export { Engine } from './core/engine';
export { createToken } from './core/types';
export { resolvePlugins, satisfies, FIXED_PHASES, RENDER_PHASES } from './core/plugin-graph';
export type {
  CommandPort, Dependency, EngineOptions, EnginePlugin, EventPort, FixedContext,
  FixedPhase, HostPort, InitContext, PluginManifest, ProvidedService,
  RegistrationContext, RenderContext, RenderPhase, ResourcePort, ServiceToken, Stamped,
} from './core/types';

export { createP5Host } from './plugins/p5-host';
export type { P5CanvasHost, P5Instance } from './plugins/p5-host';
export { createWebGL2RendererPlugin } from './plugins/renderer-webgl2';
export { createScenePlugin, createCameraPlugin, createInputPlugin, createPointerPlugin } from './plugins/world';
export { createStrokePlugin, createWaterErosionPlugin } from './plugins/geometry';
export { quantizeSample, startBrush, advanceBrush } from './plugins/brush-model';
export type { BrushState } from './plugins/brush-model';
export type { DrawStroke, EraseStroke } from './plugins/geometry';
export { createSceneRendererPlugin } from './plugins/scene-renderer';
export { createCanvasSurfacePlugin, CanvasSurfaceToken } from './plugins/canvas-surface';
export type { CanvasSurface } from './plugins/canvas-surface';
export { createPhysicsPlugin } from './plugins/physics';
export {
  SceneToken, CameraToken, InputToken, StrokeToken, ErosionToken,
  PhysicsToken, RendererToken, InkToken,
} from './plugins/tokens';
export type {
  Scene2D, Camera2D, Input2D, StrokeStore, Erosion, Physics2D, InkVisual,
  Renderer2D, Point, StrokePoint, Stroke, CircleBody, PointerSample,
  Rect, SceneMarker,
} from './plugins/tokens';
export { InkFluid } from './plugins/ink-fluid';
export { createInkFluidPlugin } from './plugins/ink-fluid-plugin';
export { InkDiagnosticsToken } from './plugins/tokens';
export type { InkDiagnostics } from './plugins/tokens';
export { withGLState } from './plugins/gl-state';
export { parseSceneJSON, loadSceneJSON } from './plugins/scene-json';
export type { SceneJSON } from './plugins/scene-json';
export { createRecorder, createReplay, parseRecording } from './plugins/recording';
export type { Recording } from './plugins/recording';
export { createInkCrossPlugin } from './plugins/inkcross';
export type { InkCrossState } from './plugins/inkcross';
