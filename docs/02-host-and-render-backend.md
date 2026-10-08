# 02 · 宿主与渲染

[目录](./README.md) · [上一章](./01-scope-and-engine-map.md) · [下一章](./03-microkernel-and-loop.md)

## 2.0：`InkStage` 拥有唯一的 Pixi 应用

`InkStage.create` 调用 `Application.init`，参数写死在 `src/core/ink-stage.ts`：

| 字段 | 值 | 原因 |
|---|---|---|
| `width` / `height` | 1280 / 720 | 横屏舞台。Matter 世界用同一套像素，测试里角色落在 y≈580–615。 |
| `preference` | `'webgl'` | 滤镜是 GLSL 300 ES，不走 WebGPU。 |
| `autoStart` | `false` | 关掉 Pixi ticker。权威步由舞台自己的 `requestAnimationFrame` 推进。 |
| `backgroundColor` | `0xf4efe4` | 纸色外的画布底。纸纹本身在 `InkWash` 的纹理里。 |
| `antialias` | `false` | 墨层是 RenderTexture，抗锯齿会把笔画边缘和纸纹搅在一起。 |
| `resolution` | `1` | 模拟分辨率另由 `InkWash` 的 `scale` 决定，不跟设备像素比走。 |

画布插进 `options.parent`，样式是 `width/height: 100%`、`objectFit: contain`。显示树只有三层，从下到上：`ink.view`（整张纸）、`props`（桥、靶、旗、舟）、`actor`（人物）。

`webglcontextlost` 时舞台暂停并清空累加器，状态文字提示刷新或重置。恢复事件**不会**重建 RenderTexture 和滤镜。这是已知缺口，见计划 P0。

`dispose()` 幂等：取消 RAF、卸监听、`world.dispose()`、`ink.dispose()`、`app.destroy(true, { children: true })`。

## 2.0 墨层不是第二条 GL 管线

`InkWash` 只用 Pixi 的 `renderer.render({ container, target, clear })` 写 RenderTexture。滤镜在 `src/core/ink-wash-filters.ts`，顶点着色器和旧滤镜同一套 Pixi v8 约定。不要在这些 pass 外面再调 `withGLState()`，也不要读 Pixi 私有字段。

十卡的模拟分辨率是画面的一半：`new InkWash(app, { width: 1280, height: 720, scale: 0.5, paper: 'xuan' })`。`/compare/` 用 `scale: 1`、800×600、`paper: 'neutral'`，方便和 inkEngine 对坐标。

## v0.1：p5 宿主和原生 WebGL2

`createP5Host()`（`src/plugins/p5-host.ts`）实现 `HostPort`：提供 `canvas`、`now`、`requestFrame`、`cancelFrame`，以及 `onContextLost` / `onContextRestored`。`Engine` 在 `init()` 成功后挂上这两个回调：丢失时若正在跑就 `pause()`，不产生半步；恢复时调用 `EngineOptions.onContextRestored`。GPU 资源要由应用重建，引擎不会自动重放插件的 `init`。

`createWebGL2RendererPlugin()` 和 `InkFluid`（`src/plugins/ink-fluid.ts`）仍是 `/inkcross/` 的墨水。原生 pass 包在 `withGLState()`（`src/plugins/gl-state.ts`）里，离开时恢复 p5 期望的混合状态。这条管线和 `InkWash` 无关，冒烟测试仍断言它的像素和墨量曲线。

## 容易踩的地方

- 再开一个 Pixi ticker 或 `Matter.Runner`，角色和墨就会各走各的步。
- 在 `apps/` 里拿 `stage.app.renderer.gl` 改状态。页面只应调用 `InkStage` 的 `act` / `replay` / `togglePause` / `reset` / `dispose`。
- 把 `resolution` 改成 `devicePixelRatio` 却不改 `InkWorld` 的米制。碰撞仍是 1280×720 的像素坐标。
