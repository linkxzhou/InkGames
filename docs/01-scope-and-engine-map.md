# 01 · 范围与能力地图

[目录](./README.md) · [下一章](./02-host-and-render-backend.md)

> 本章前半描述十卡仍在用的 Pixi 舞台。文末「横版切片」是已经从 `src/index.ts` 导出、可以调用的 three.js 关卡。叙事宿主能播「易水寒」并走正史 / 野史；玩法模板、`PostStack`、景深和真实 GPU 验收仍未完成。

仓库里同时有两套能跑的运行时。它们不共享时钟，也不共享墨层。

| 运行时 | 入口 | 画面 | 物理 | 页面 |
|---|---|---|---|---|
| v0.1 微内核 | `Engine`（`src/core/engine.ts`） | p5 宿主 + 原生 WebGL2 `InkFluid` | 圆—胶囊，插件 `src/plugins/physics.ts` | `/inkcross/`、`/wuxia/` |
| 2.0 舞台 | `InkStage.create`（`src/core/ink-stage.ts`） | PixiJS 8.22.0，单画布 1280×720 | Matter.js 0.20.0，`InkWorld` | `/` 十卡，以及十个道具页、`/compare/` |

公共类型和函数只从 [`src/index.ts`](../src/index.ts) 导出。应用侧用别名 `@inkgames/engine`（见 `vite.config.ts`），不要从 `src/core/` 或 `src/plugins/` 直接 import。

## 2.0 从 `src/index.ts` 能拿到什么

- `InkStage`、`InkStageOptions`：一页一个舞台。`create({ parent, item, onStatus })` 自己 `await app.init`，失败会 `dispose`。
- `InkStage` 的纸色 `INK_STAGE_PAPER`。
- `InkWash`、`InkWashOptions`、`InkStrokeRequest`、`InkColor`、`InkFinish`（`InkFlowFinish` / `InkDistortFinish` / `InkMetallicFinish`）、`inkPointerPath`：跑 inkEngine 管线的墨层，见第 7 章。
- `inkCameraDistance`、`inkLayerScale`、`INK_LAYER_Z`：分层镜头的距离和缩放，见第 7 章。
- `scanInkBites`、`InkBite`：虫蚀采样。通常不必直接调，`finish.metallic` 会用它。
- `InkBrushEngine`、`InkBrushSettings`、`InkPoint`、`InkDrawOp`、`InkFrameStep`、`InkShaderState`，以及面板取值表 `INK_BRUSH_MODES`、`INK_SIZES`、`INK_EFFECTS`、`INK_BLENDS`、`INK_TIP_OFFSET`、`resolveInkSize`：逐帧移植的七种笔刷，纯 CPU，不碰 GPU。
- `INK_PALETTE`、`INK_COLOR_NAMES`、`inkColorId`、`inkColorRgb`、`InkColorName`：inkEngine 的 36 色。
- `PROP_BRUSHES`、`PropBrush`、`PropPaintingId`、`paintProp`、`actionStroke`、`PropStroke`、`PropPlacement`：每个道具的笔刷表和画法，见第 8 章。
- `InkWorld`、`InkBridge`、`InkImpact`、`InkProjectile`：Matter 世界、墨桥、投射物命中。
- `ITEM_PRESETS`、`getItemPreset`、`ItemPreset`、`ItemAction`：十张卡片的文案和动作种类。

## v0.1 仍导出、仍被旧页面使用的部分

`Engine`、`createToken`、`resolvePlugins`、`satisfies`、`FIXED_PHASES`、`RENDER_PHASES`，以及宿主、场景、笔画、侵蚀、物理、录制、`InkFluid`、`createInkCrossPlugin` 的插件工厂。这些服务的对象契约在 `src/core/types.ts` 和 `src/plugins/tokens.ts`。新页面不要再组装这条插件链。

## 数据怎么走

十卡页面的依赖是单向的：

```text
键盘 / 指针
  → InkStage.frame（唯一 RAF）
      → 固定步：InkWorld.step、道具动作、eraseBridge
      → 显示步：可擦层 InkWash.update（拖动中的湿墨）、移动和旋转墨层精灵
```

墨的碰撞不读像素。水刷先改 `InkWorld` 里的矩形刚体，再在已提交的墨层上做视觉减淡。`InkWash` 不拥有物理世界。

## 还不能当成完成的部分

真实桌面 GPU 的帧率、WebGL 上下文自动重建、遮罩、景深模糊、EasyCam 的回放变焦、2.0 自己的录制格式、按道具拆开的插件文件。这些仍是现行 Pixi 舞台的缺口，结转说明在 [引擎计划](../plan/10-three-matter-side-scroller-plan.md)。和 inkEngine 的逐项差距在 [第 12 章](./12-inkengine-parity-audit.md)。

## 横版切片

`src/index.ts` 已经导出横版关卡用的类型。页面在 `apps/scroll/`，首页十卡仍走上面的 `InkStage`。坡度、击退和砍竹的规则写在 `Playfield` 上，没有单独的 `ActorController` / `Combat` 类。

| 导出 | 做什么 |
|---|---|
| `InkView`、`InkViewOptions` | `WebGLRenderer`、场景、画布、`frame` / `dispose` |
| `Playfield` | Matter 世界、固定步、插值、坡、单向平台、击退、扫掠、砍竹、水刷刚体 |
| `CameraRig` | 侧视透视相机。`camera.up` 为 `(0, -1, 0)`，`scale.x` 为 `-1`，使世界 +x 在画面右侧 |
| `InkSurface`、`InkSurfaceOptions`、`InkSurfaceSnapshot` | 墨面渲染目标：`paint` / `update` / `texture` / `wash` / `snapshot` |
| `TerrainSeep`、`SEEP_WIDTH`、`SEEP_HEIGHT`、`bakeHeightField`、`contactsToStamps`、`terrainHeightAt` | 512×256 地面洇染 |
| `createCunRock`、`cunOutlineWidth`、`CunKind`、`CunRock` | 披麻 / 斧劈皴与随距离变化的勾边 |
| `BambooView`、`DROPLET_CAP`、`clampDropletCount` | 竹的摆动、断开和最多 256 个墨滴 |
| `SceneDirector`、`StoryRuntime`、`CutscenePlayer`、`AudioBus`、`InkText`、`SaveStore`、`StoryStage` | 读场景包、播过场、走剧情图、Canvas 字幕、本地存档。演示页 `/story/` |
| `parseScenePackage`、`parseChapterBundle`、`conditionMet`、`resolveStrokeCue` | 只读解析 `plan/11` 的场景 JSON，并把道具 / 笔刷提示收成笔画 |

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

`PostStack` 没有单独的类。过场里的 flow / distort / metallic / wash / fade 由 `StoryStage` 写到 `InkSurface` 或一张淡出平面；遮罩是画布暗角，不是 GLSL pass。玩法节点只显示目标文字并等待继续，对决等模板没有模拟。景深散景、`inkgames.ink-recording` 回放、以及「同一机器连播两次末帧逐像素一致」都还没有。Pixi `InkStage` 在上下文丢失后仍不重建纹理。three.js 的 `InkView` 与 `StoryStage` 会在 `webglcontextrestored` 后重建渲染目标，并从丢失前的 `snapshot` 贴回；无头 SwiftShader 用 `WEBGL_lose_context` 走过 `/scroll/?pose=rest`，真实 GPU 未实测。
