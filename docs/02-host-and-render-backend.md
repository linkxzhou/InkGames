# 02 · 宿主与渲染

[目录](./README.md) · [上一章](./01-scope-and-engine-map.md) · [下一章](./03-microkernel-and-loop.md)

> 本章正文描述**现行代码**。文末「计划（未实现）」是 three.js + Matter.js 的目标，类还没有导出，不能当调用示例。

## 2.0：`InkStage` 拥有唯一的 Pixi 应用

`InkStage.create` 调用 `Application.init`，参数写死在 `src/core/ink-stage.ts`：

| 字段 | 值 | 原因 |
|---|---|---|
| `width` / `height` | 1280 / 720 | 横屏舞台。Matter 世界用同一套像素，测试里角色落在 y≈580–615。 |
| `preference` | `'webgl'` | 滤镜是 GLSL 300 ES，不走 WebGPU。 |
| `autoStart` | `false` | 关掉 Pixi ticker。权威步由舞台自己的 `requestAnimationFrame` 推进。 |
| `backgroundColor` | `0xeae2d2` | 纸色外的画布底。纸纹本身在 `InkWash` 的纹理里。 |
| `antialias` | `false` | 画布本身不需要；笔触画进墨层时用的是 `stamp` 纹理自己的 MSAA。 |
| `resolution` | `1` | 墨层与画布同为 1280×720，对应 inkEngine 的 `pixelDensity: 1`。 |

画布插进 `options.parent`，样式是 `width/height: 100%`、`objectFit: contain`。显示树从下到上：纸层 `sheet.view`、可擦层 `marks.view`（`multiply`）、精灵容器（每个精灵是一张小墨层的 `view`，同样 `multiply`）。

`webglcontextlost` 时舞台暂停并清空累加器，状态文字提示刷新或重置。恢复事件**不会**重建 RenderTexture 和滤镜。这是已知缺口，见计划 P0。

`dispose()` 幂等：取消 RAF、卸监听、`world.dispose()`、逐个销毁精灵墨层、可擦层和纸层，最后 `app.destroy(true, { children: true })`。

## 2.0 墨层不是第二条 GL 管线

`InkWash` 只用 Pixi 的 `renderer.render({ container, target, clear })` 写 RenderTexture。滤镜在 `src/core/ink-wash-filters.ts`，片元着色器是 `src/core/ink-shaders.ts` 里生成的 inkEngine 移植。每个 pass 是一张铺在笔画外接矩形上的 `Sprite`，顶点着色器把片元在目标纹理里的像素坐标传给片元着色器。不要在这些 pass 外面再调 `withGLState()`，也不要读 Pixi 私有字段。

十卡的纸层是 `new InkWash(app, { width: 1280, height: 720, seed, background: INK_STAGE_PAPER, paper: true })`，可擦层和精灵用 `transparent: true`。`/compare/` 用 640×480、同样的纸色和种子 `1234567890`；`?scene=modes` 是 800×600、inkEngine 默认的 222 灰。

## v0.1：p5 宿主和原生 WebGL2

`createP5Host()`（`src/plugins/p5-host.ts`）实现 `HostPort`：提供 `canvas`、`now`、`requestFrame`、`cancelFrame`，以及 `onContextLost` / `onContextRestored`。`Engine` 在 `init()` 成功后挂上这两个回调：丢失时若正在跑就 `pause()`，不产生半步；恢复时调用 `EngineOptions.onContextRestored`。GPU 资源要由应用重建，引擎不会自动重放插件的 `init`。

`createWebGL2RendererPlugin()` 和 `InkFluid`（`src/plugins/ink-fluid.ts`）仍是 `/inkcross/` 的墨水。原生 pass 包在 `withGLState()`（`src/plugins/gl-state.ts`）里，离开时恢复 p5 期望的混合状态。这条管线和 `InkWash` 无关，冒烟测试仍断言它的像素和墨量曲线。

## 容易踩的地方

- 再开一个 Pixi ticker 或 `Matter.Runner`，角色和墨就会各走各的步。
- 在 `apps/` 里拿 `stage.app.renderer.gl` 改状态。页面只应调用 `InkStage` 的 `act` / `replay` / `togglePause` / `reset` / `dispose`。
- 把 `resolution` 改成 `devicePixelRatio` 却不改 `InkWorld` 的米制。碰撞仍是 1280×720 的像素坐标。

## 计划（未实现）

`InkView` 持有 three.js 的 `WebGLRenderer` 和 `Scene`。内部分辨率仍是 1280×720，画布 CSS 仍是 `object-fit: contain`。`devicePixelRatio` 的上限还没定。

渲染器用 WebGL，不用 WebGPU。水墨 pass 用 `RawShaderMaterial`，GLSL 版本为 GLSL3，这样 three.js 不会把内置属性块注入到已经移植好的片元里。`EffectComposer` 只用于最后的淡入、遮罩和可选景深，不拿来做墨的 ping-pong。

相机是侧视的 `PerspectiveCamera`，fov 为 π/3，放在 `z = inkCameraDistance(高度)`，朝原点看。`camera.up` 设为 `(0, -1, 0)`，使 three.js 的 Y 与现在的像素坐标一样向下。层深仍是 `INK_LAYER_Z`：远景 −80、纸面 0、角色 40、文字 120。这些是像素级视差，由透视相机产生大小差，不再给精灵手乘 `inkLayerScale`。变焦改相机到纸面的距离。正交相机只作调试。

`webglcontextlost` 时暂停。恢复后要重建渲染目标，并能从 `InkSurface.snapshot()` 贴回最近一帧。现行 Pixi 舞台做不到自动重建，这一点结转到计划里，还没有实现。

`dispose()` 仍然幂等：取消 RAF、卸监听、丢掉物理世界和渲染目标，再 `renderer.dispose()`。Pixi 和 three 不画在同一张画布上。
