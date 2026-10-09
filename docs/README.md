# InkGames 文档

**渲染栈（2026-10-09）**：只有 **three.js + Matter.js**。PixiJS 十卡舞台、p5 微内核、原生 WebGL2 渲染插件、`InkFluid`、旧 `Engine`/插件图/命令录制都已删除，`package.json` 只依赖 `three@0.186.1` 与 `matter-js@0.20.0`。入口：

| 入口 | 页面 | 主要模块 |
|---|---|---|
| 横版切片 | `/scroll/` | `InkView`、`Playfield`、`CameraRig`、`TerrainSeep`、`CunRock`、`BambooView` |
| 叙事宿主 | `/story/` | `StoryStage`、`SceneDirector`、`StoryRuntime`、`CutscenePlayer`、`InkText`、`AudioBus`、`SaveStore` |
| 历史动画 | `/history/` | `InkScene`、`validatePresentation` / `poseAt`、`advanceFrameClock` |
| 参照画廊 | `/gallery/` | `InkSurface`、`compileVectorInk`，旁边显示参照 PNG |
| 历史道具 | `/props/<id>/` | `PropDemo`、`HISTORY_PROPS`、`paintHistoryProp` |

首页 `/` 列出这些入口和二十张道具卡。

**仍未完成**：完整玩法模拟、`PostStack` 类、景深、2.0 录制回放、`InkScene` 的上下文恢复、真实配音、真实 GPU 验收。`defineGameplay` 只返回动词和说明。设计在 [引擎计划](../plan/10-three-matter-side-scroller-plan.md)；历史游戏叙事与缺口在 [plan/11](../plan/11-history-game-story-design.md)、[plan/12](../plan/12-history-game-engine-gaps.md)；历史动画的实施与状态在 [plan/12 动画计划](../plan/12-history-game-ink-animation-production-plan.md)。

历史检索和 2026-10-09 的出处在 [第 11 章](./11-references-and-research.md)。和 inkEngine 的逐项对照在 [第 12 章](./12-inkengine-parity-audit.md)：文末是 three.js `InkSurface` 的 SwiftShader 并排差，历史总表提到的 Pixi `InkWash` 已删除。真实 GPU 未实测。

| 章 | 内容 | 已导出的现行实现 |
|---|---|---|
| [01 范围](./01-scope-and-engine-map.md) | 引擎边界与目录；旧微内核已删 | `InkView`、`InkScene`、`StoryStage` 等从 `src/index.ts` 导出 |
| [02 宿主与渲染](./02-host-and-render-backend.md) | `WebGLRenderer`、侧视相机、层深 | `InkView`、`StoryStage`、`InkScene` |
| [03 时钟](./03-clocks.md) | 玩法固定步与过场帧时钟 | `advanceFixedClock`、`advanceFrameClock`、`Playfield` |
| [04 道具与模块](./04-plugin-system.md) | 道具笔刷表与模块划分 | `PROP_BRUSHES`、`paintProp`、`actionStroke` |
| [05 场景](./05-world-scene-and-assets.md) | 像素、Y 向下、折线地面、Matter 世界 | `Playfield`、`InkWorld` |
| [06 输入、笔和碰撞](./06-input-strokes-and-physics.md) | 笔刷、水刷、坡、单向平台、扫掠 | `InkBrushEngine`、`Playfield` |
| [07 水墨](./07-ink-rendering.md) | inkEngine 管线、分件墨层、漫水与遮罩 | `InkSurface`、`InkScene`、`InkAnimation` |
| [08 玩法与存档](./08-gameplay-and-persistence.md) | 叙事流程、存档、录制缺口 | `SceneDirector`、`SaveStore`、`CutscenePlayer` |
| [09 验证](./09-tooling-and-quality.md) | `build.sh`、单测、SwiftShader 冒烟、确定性回归 | 现行脚本与测试清单 |
| [10 交付](./10-shipping-and-ecosystem.md) | 依赖与许可 | `three@0.186.1`、`matter-js@0.20.0`、Perlin |

公共类型和函数只从 [`src/index.ts`](../src/index.ts) 导出。应用代码用别名 `@inkgames/engine`，不要去 import `src/core/` 或 `src/plugins/` 的内部文件。

```bash
./build.sh dev      # http://127.0.0.1:5173/  三入口导航；/scroll/、/story/、/history/
./build.sh check    # tsc + vitest + 文档相对链接
./build.sh build    # 类型检查 + 生产构建（三条入口）
./build.sh browser  # 构建后的无头 Chromium 冒烟
```
