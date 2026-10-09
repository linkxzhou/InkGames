# 01 · 范围与能力地图

[目录](./README.md) · [下一章](./02-host-and-render-backend.md)

**当前只有一条运行时：three.js + Matter.js。** 曾经的 p5 微内核 + 原生 WebGL2（`/inkcross/`、`/wuxia/`）与 PixiJS 十卡舞台已于 2026-10-09 删除，`src/core/engine.ts`、`types.ts`、`plugin-graph.ts`、`ink-stage.ts`、`ink-wash.ts` 等文件都不在仓库里了。公共 API 只从 [`src/index.ts`](../src/index.ts) 导出，应用侧用别名 `@inkgames/engine`（见 `vite.config.ts`），不要从 `src/core/` 或 `src/plugins/` 直接 import。

依赖只剩两个：`three@0.186.1` 与 `matter-js@0.20.0`。

## 三条入口

| 入口 | 页面 | 渲染 | 物理 | 主要模块 |
|---|---|---|---|---|
| 横版切片 | `/scroll/` | `InkView`（透视侧视 + `InkSurface`） | `Playfield`（Matter 固定步） | `Playfield`、`CameraRig`、`TerrainSeep`、`CunRock`、`BambooView` |
| 叙事宿主 | `/story/` | `StoryStage`（多张 `InkSurface` 平面） | 无 | `SceneDirector`、`StoryRuntime`、`CutscenePlayer`、`InkText`、`AudioBus`、`SaveStore` |
| 历史动画 | `/history/` | `InkScene`（分件墨层） | 无 | `InkScene`、`validatePresentation` / `poseAt`、`advanceFrameClock` |

## 从 `src/index.ts` 能拿到什么

**笔刷与调色（纯 CPU，不碰 GPU）**

- `InkBrushEngine`、`InkBrushSettings`、`InkPoint`、`InkDrawOp`、`InkFrameStep`、`InkShaderState`，以及面板取值表 `INK_BRUSH_MODES`、`INK_SIZES`、`INK_EFFECTS`、`INK_BLENDS`、`INK_TIP_OFFSET`、`resolveInkSize`。
- `INK_PALETTE`、`INK_COLOR_NAMES`、`inkColorId`、`inkColorRgb`、`InkColorName`：36 色表。
- `scanInkBites`、`InkBite`：虫蚀采样，供 `finish.metallic` 使用。

**笔画契约（与渲染库无关，在 `src/core/ink-stroke.ts`）**

- `InkStrokeRequest`、`InkColor`、`InkFinish`（`InkFlowFinish` / `InkDistortFinish` / `InkMetallicFinish`）、`inkPointerPath`。这些类型原先放在 Pixi 的 `ink-wash.ts` 里，迁移时移出，供 `InkSurface`、`InkScene`、`StoryStage` 与道具表共用。

**墨面与场景**

- `InkSurface`、`InkSurfaceOptions`、`InkSurfaceSnapshot`：three.js `WebGLRenderTarget` 上的 inkEngine 管线，见第 7 章。
- `InkScene`、`InkSceneLayer`、`InkLayerPose`、`InkClipRect`、`InkWashStep`：程序分件墨层，支持关节轴心、矩形裁剪、绘制顺序与真实漫水。
- `InkView`、`InkViewOptions`：横版切片宿主。
- `inkCameraDistance`、`inkLayerScale`、`INK_LAYER_Z`：分层镜头的距离和缩放常数。

**表现数据**

- `validatePresentation`、`poseAt`、`InkPresentation`、`PresentationLayer`、`PresentationImpulse`、`LayerKey`、`LayerPose`、`ClipRect`：版本化关键帧校验与求值。
- `advanceFixedClock`、`advanceFrameClock`、`FIXED_DT`、`MAX_FIXED_STEPS`、`MAX_FRAME_SEC`、`FRAME_CLOCK_MAX_STEPS`、`FRAME_CLOCK_MAX_GAP_SEC`、`FixedClock`、`FrameStep`：玩法固定步与过场帧时钟，见第 3 章。

**物理与玩法**

- `Playfield`、`Footing`、`SweepHit`、`ACTOR_RADIUS`、`MOVE_SPEED`、`JUMP_VY`、`KNOCKBACK_CAP`、`KNOCKBACK_LOCK`、`ATTACK_STEPS`。
- `InkWorld`、`InkBridge`、`InkImpact`、`InkProjectile`：Matter 世界、墨桥、投射物命中。
- `CameraRig`。

**三项画面**

- `TerrainSeep`、`SEEP_WIDTH`、`SEEP_HEIGHT`、`bakeHeightField`、`contactsToStamps`、`terrainHeightAt`、`TerrainPoint`、`TerrainBounds`、`InkStamp`。
- `createCunRock`、`cunOutlineWidth`、`CunKind`、`CunRock`。
- `BambooView`、`DROPLET_CAP`、`clampDropletCount`、`BambooPose`。

**道具笔画**

- `PROP_BRUSHES`、`PropBrush`、`PropPaintingId`、`PropPart`。
- `paintProp`、`actionStroke`、`PropStroke`、`PropPlacement`、`resolveStrokeCue`、`samplePolyline`。

**叙事与内容**

- `SceneDirector`、`StoryRuntime`、`CutscenePlayer`、`cameraAt`、`AudioBus`、`InkText`、`SaveStore`、`StoryStage`、`emptySave`、`migrateSave`、`sceneClearedKeys`。
- `parseChapterIndex`、`parseChapterBundle`、`parseScenePackage`、`lookupString`、`conditionMet`、`findFullScene`，以及 `narrative-types.ts` 的内容契约。

## 数据怎么走

切片页面是单向依赖：

```text
键盘 / 指针
  → InkView.frame（唯一 RAF）
      → Playfield.step：固定步 1/60、插值、坡、击退、扫掠、砍竹
      → TerrainSeep.update、InkSurface.update、CameraRig.follow
      → WebGLRenderer.render
```

墨的碰撞不读像素：水刷先改 `InkWorld` / `Playfield` 的矩形刚体，再在已提交的墨层上做视觉减淡。`InkSurface` 不拥有物理世界。

历史动画页面走另一条时钟：`advanceFrameClock` 按墙钟推进 60 Hz 逻辑帧并携带进位，`poseAt` 只按帧号求值，所以跳到任意帧都能重建姿态。

```ts
import { InkView } from '@inkgames/engine';

const canvas = document.querySelector('canvas');
if (!(canvas instanceof HTMLCanvasElement)) throw new Error('missing canvas');
const view = new InkView({ canvas, width: 1280, height: 720, seed: 21 });
view.addTerrain([
  { x: 0, y: 640 },
  { x: 620, y: 520 },
  { x: 1400, y: 450 },
]);
view.playfield.placeActor(160, 590);
view.frame(1 / 60);
view.dispose();
```

## 仍未完成

`PostStack` 没有单独的类。过场里的 flow / distort / metallic / wash / fade 由 `StoryStage` 写到 `InkSurface` 或一张淡出平面；遮罩是画布暗角，不是 GLSL pass。玩法模板没有模拟，玩法节点只显示目标文字并等待继续。景深散景、`inkgames.ink-recording` 回放、遮罩多边形、以及「同一机器连播两次末帧逐像素一致」都还没有。

上下文恢复分两种：`InkView` 与 `StoryStage` 在 `webglcontextrestored` 后重建渲染目标并从丢失前的 `snapshot` 贴回；`InkScene`（`/history/`）目前不重建。无头 SwiftShader 用 `WEBGL_lose_context` 走过 `/scroll/?pose=rest`，真实 GPU 未实测。
