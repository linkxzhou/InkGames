# 02 · 宿主与渲染

[目录](./README.md) · [上一章](./01-scope-and-engine-map.md) · [下一章](./03-microkernel-and-loop.md)

> 本章前半描述十卡仍在用的 Pixi 舞台。文末「横版切片」是已经从 `src/index.ts` 导出、可以调用的 three.js 关卡。叙事宿主和真实 GPU 验收仍未实现。

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

## 横版切片：`InkView`

`new InkView({ canvas, width, height, seed, pixelRatio })` 在 `src/core/ink-view.ts`。默认 1280×720。`pixelRatio` 缺省时取 `min(2, devicePixelRatio)`；`apps/scroll/` 在 `?pose=` 截图时传 `1`。画布 CSS 是 `object-fit: contain`。渲染器是 `WebGLRenderer`，`outputColorSpace` 为线性，清屏色 `0xd6cebc`，不用 WebGPU。

墨水 pass 用 `RawShaderMaterial` 和 GLSL3，片元字符串来自现行 `ink-shaders.ts`，three.js 会自己加上 `#version 300 es`。皴法石头和竹用 `ShaderMaterial`，因为平移后的网格要走 three.js 的模型矩阵；墨水 pass 仍是 `RawShaderMaterial`。没有使用 `EffectComposer`。

`CameraRig` 的透视相机 fov 为 60°，放在 `z = inkCameraDistance(高度) / zoom`，默认 zoom 为 1。`camera.up` 是 `(0, -1, 0)`。`lookAt` 在这个 up 下会把视野滚 180° 并镜像 X，所以 `place()` 在 `lookAt` 之后把 `camera.scale.x` 设为 `-1`：世界 +x 在画面右侧，世界 +y 仍向下。负缩放会反转缠绕，角色、地面、竹和皴法填充用 `DoubleSide`，勾边外壳仍是 `BackSide`。正交相机只在 `useOrthographic` 打开时使用。层深仍是 `INK_LAYER_Z`：远景 −80、纸面 0、角色 40、文字 120。

`webglcontextlost` 把 `playfield.pausedClock` 设为真。恢复事件不重建渲染目标，也不能从 `snapshot()` 自动贴回。`dispose()` 幂等。Pixi 舞台和这张画布各用各的，不要共用一张 canvas。
