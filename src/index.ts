export { InkStage, INK_STAGE_PAPER } from './core/ink-stage';
export type { InkStageOptions } from './core/ink-stage';
export { InkWash, inkPointerPath } from './core/ink-wash';
export type {
  InkWashOptions, InkStrokeRequest, InkColor, InkFinish, InkFlowFinish, InkDistortFinish, InkMetallicFinish,
} from './core/ink-wash';
export { inkCameraDistance, inkLayerScale, INK_LAYER_Z } from './core/ink-camera';
export { Playfield, ACTOR_RADIUS, MOVE_SPEED, JUMP_VY, KNOCKBACK_CAP, KNOCKBACK_LOCK, ATTACK_STEPS } from './core/playfield';
export type { Footing, SweepHit } from './core/playfield';
export { CameraRig } from './core/camera-rig';
export { InkView } from './core/ink-view';
export type { InkViewOptions } from './core/ink-view';
export { InkSurface } from './core/ink-surface';
export type { InkSurfaceOptions, InkSurfaceSnapshot } from './core/ink-surface';
export { TerrainSeep } from './core/terrain-seep';
export { cunOutlineWidth, createCunRock } from './core/cun-material';
export type { CunKind, CunRock } from './core/cun-material';
export { BambooView, DROPLET_CAP, clampDropletCount } from './core/bamboo-rig';
export type { BambooPose } from './core/bamboo-rig';
export { SEEP_WIDTH, SEEP_HEIGHT, bakeHeightField, contactsToStamps, hashBytes, terrainHeightAt } from './core/terrain-field';
export type { TerrainPoint, TerrainBounds, InkStamp } from './core/terrain-field';
export { scanInkBites } from './core/ink-metallic';
export type { InkBite } from './core/ink-metallic';
export { InkBrushEngine, INK_BRUSH_MODES, INK_SIZES, INK_EFFECTS, INK_BLENDS, INK_TIP_OFFSET, resolveInkSize } from './core/ink-brush';
export type {
  InkBrushMode, InkSizeName, InkEffect, InkBlend, InkBrushSettings, InkPoint, InkDrawOp, InkFrameStep, InkShaderState,
} from './core/ink-brush';
export { INK_PALETTE, INK_COLOR_NAMES, inkColorId, inkColorRgb } from './core/ink-palette';
export type { InkColorName, InkColorEntry } from './core/ink-palette';
export { PROP_BRUSHES } from './plugins/prop-brushes';
export type { PropBrush, PropPaintingId, PropPart } from './plugins/prop-brushes';
export { paintProp, actionStroke } from './plugins/prop-paintings';
export type { PropStroke, PropPlacement } from './plugins/prop-paintings';
export { InkWorld } from './core/ink-world';
export type { InkBridge, InkImpact, InkProjectile } from './core/ink-world';
export { ITEM_PRESETS, getItemPreset } from './plugins/items';
export type { ItemAction, ItemPreset } from './plugins/items';
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
