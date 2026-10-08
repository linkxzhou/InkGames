# 01 · 范围与能力地图

[目录](./README.md) · [下一章](./02-host-and-render-backend.md)

仓库里同时有两套能跑的运行时。它们不共享时钟，也不共享墨层。

| 运行时 | 入口 | 画面 | 物理 | 页面 |
|---|---|---|---|---|
| v0.1 微内核 | `Engine`（`src/core/engine.ts`） | p5 宿主 + 原生 WebGL2 `InkFluid` | 圆—胶囊，插件 `src/plugins/physics.ts` | `/inkcross/`、`/wuxia/` |
| 2.0 舞台 | `InkStage.create`（`src/core/ink-stage.ts`） | PixiJS 8.22.0，单画布 1280×720 | Matter.js 0.20.0，`InkWorld` | `/` 十卡，以及十个道具页、`/compare/` |

公共类型和函数只从 [`src/index.ts`](../src/index.ts) 导出。应用侧用别名 `@inkgames/engine`（见 `vite.config.ts`），不要从 `src/core/` 或 `src/plugins/` 直接 import。

## 2.0 从 `src/index.ts` 能拿到什么

- `InkStage`、`InkStageOptions`：一页一个舞台。`create({ parent, item, onStatus })` 自己 `await app.init`，失败会 `dispose`。
- `InkWash`、`InkWashOptions`、`InkStrokeStyle`、`InkPigment`，以及颜料常量 `INK_BLACK`、`INK_INDIGO`、`INK_CINNABAR`、`INK_PINE`、`INK_TEA`。
- `InkBrush`、`strokeSegments`、`BrushPoint`、`BrushSegment`、`InkBrushOptions`：弹簧笔尖和笔毫，纯 CPU，不碰 GPU。
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
      → 显示步：InkWash.update、Graphics 重画人物和道具
```

墨的碰撞不读像素。水刷先改 `InkWorld` 里的矩形刚体，再在已提交的墨层上做视觉减淡。`InkWash` 不拥有物理世界。

## 还不能当成完成的部分

真实桌面 GPU 的帧率、WebGL 上下文自动重建、七种笔刷里未移植的四种、光谱混色、2.0 自己的录制格式、按道具拆开的插件文件。清单在 [剩余工作](../plan/10-v2-pixi-matter-ink-game-engine-plan.md)。和 inkEngine 的逐项差距在 [第 12 章](./12-inkengine-parity-audit.md)。
