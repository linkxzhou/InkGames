export { InkBrushEngine, INK_BRUSH_MODES, INK_SIZES, INK_EFFECTS, INK_BLENDS, INK_TIP_OFFSET, resolveInkSize } from './core/ink-brush';
export type {
  InkBrushMode, InkSizeName, InkEffect, InkBlend, InkBrushSettings, InkPoint, InkDrawOp, InkFrameStep, InkShaderState,
} from './core/ink-brush';
export type { InkColor, InkFinish, InkFlowFinish, InkDistortFinish, InkMetallicFinish, InkStrokeRequest } from './core/ink-stroke';
export { inkPointerPath } from './core/ink-stroke';
export { parseVectorInk, compileVectorInk, scoreInkRgba } from './core/vector-ink';
export type { VectorInkSheet, VectorInkPath, VectorInkFit, VectorInkRole, InkRasterScore } from './core/vector-ink';
export { INK_PALETTE, INK_COLOR_NAMES, inkColorId, inkColorRgb } from './core/ink-palette';
export type { InkColorName, InkColorEntry } from './core/ink-palette';
export { scanInkBites } from './core/ink-metallic';
export type { InkBite } from './core/ink-metallic';

export { InkSurface } from './core/ink-surface';
export type { InkSurfaceOptions, InkSurfaceSnapshot } from './core/ink-surface';
export { InkScene } from './core/ink-scene';
export type { InkSceneLayer, InkLayerPose, InkClipRect, InkSurfaceWashStep } from './core/ink-scene';
export { InkView } from './core/ink-view';
export type { InkViewOptions } from './core/ink-view';
export { validatePresentation, poseAt } from './core/ink-presentation';
export type { InkPresentation, PresentationLayer, PresentationImpulse, LayerKey, LayerPose, ClipRect } from './core/ink-presentation';
export { advanceFixedClock, advanceFrameClock, FIXED_DT, MAX_FIXED_STEPS, MAX_FRAME_SEC, FRAME_CLOCK_MAX_STEPS, FRAME_CLOCK_MAX_GAP_SEC } from './core/fixed-clock';
export type { FixedClock, FrameStep } from './core/fixed-clock';

export { PROP_BRUSHES } from './plugins/prop-brushes';
export type { PropBrush, PropPaintingId, PropPart } from './plugins/prop-brushes';
export { paintProp, actionStroke } from './plugins/prop-paintings';
export type { PropStroke, PropPlacement } from './plugins/prop-paintings';
export { HISTORY_PROPS, historyProp, paintHistoryProp } from './plugins/history-props';
export type { HistoryProp, HistoryPropId, PropPhysics } from './plugins/history-props';
export { PropDemo } from './core/prop-demo';
export type { PropDemoOptions } from './core/prop-demo';
export { defineGameplay } from './core/gameplay';
export type { GameplaySetup, GameplayVerb } from './core/gameplay';

export { Playfield, ACTOR_RADIUS, MOVE_SPEED, JUMP_VY, KNOCKBACK_CAP, KNOCKBACK_LOCK, ATTACK_STEPS } from './core/playfield';
export type { Footing, SweepHit } from './core/playfield';
export { InkWorld } from './core/ink-world';
export type { InkBridge, InkImpact, InkProjectile } from './core/ink-world';
export { CameraRig } from './core/camera-rig';

export { TerrainSeep } from './core/terrain-seep';
export { cunOutlineWidth, createCunRock } from './core/cun-material';
export type { CunKind, CunRock } from './core/cun-material';
export { BambooView, DROPLET_CAP, clampDropletCount } from './core/bamboo-rig';
export type { BambooPose } from './core/bamboo-rig';
export { SEEP_WIDTH, SEEP_HEIGHT, bakeHeightField, contactsToStamps, hashBytes, terrainHeightAt } from './core/terrain-field';
export type { TerrainPoint, TerrainBounds, InkStamp } from './core/terrain-field';

export { parseChapterIndex, parseChapterBundle, parseScenePackage, lookupString, conditionMet, findFullScene } from './core/content-catalog';
export { StoryRuntime } from './core/story-runtime';
export type { StorySnapshot } from './core/story-runtime';
export { CutscenePlayer, cameraAt } from './core/cutscene-player';
export type { CutsceneTick, ActiveText, StrokePulse, CameraPose } from './core/cutscene-player';
export { AudioBus } from './core/audio-bus';
export type { AudioSink } from './core/audio-bus';
export { InkText } from './core/ink-text';
export { SaveStore, emptySave, migrateSave, sceneClearedKeys } from './core/save-store';
export type { SaveStorage } from './core/save-store';
export { SceneDirector } from './core/scene-director';
export type { DirectorPhase, DirectorView } from './core/scene-director';
export { StoryStage } from './core/story-stage';
export type { StoryStageOptions } from './core/story-stage';
export { createInkFx, listInkFx, INK_FX_PIGMENTS } from './fx/ink-fx';
export type { InkFx, InkFxFrame, InkFxInfo, InkFxParams, InkSplat } from './fx/ink-fx';
export { InkFxStage } from './fx/fx-stage';
export type { InkFxStageOptions } from './fx/fx-stage';
export { resolveStrokeCue, samplePolyline } from './core/stroke-cues';
export type {
  ChapterBundle, ChapterIndex, CutsceneDef, SceneDef, ScenePackage, StringTable, SaveGame, PlotLine, PlotNode,
} from './core/narrative-types';
