# 02 · 宿主与渲染

[目录](./README.md) · [上一章](./01-scope-and-engine-map.md) · [下一章](./03-clocks.md)

**渲染后端只有 three.js。** 上一版描述的 Pixi `InkStage`、p5 宿主、原生 WebGL2 `InkFluid` 与 `withGLState()` 都已随旧栈删除。现在有三个宿主：`InkView`（切片）、`StoryStage`（叙事）、`InkScene`（历史动画）。三者各自持有一个 `WebGLRenderer`，不共用画布。

## 共同约定

- 三个宿主都用 `WebGLRenderer`，`outputColorSpace` 为线性（`LinearSRGBColorSpace`），不使用 WebGPU / TSL，也没有使用 `EffectComposer`。
- 水墨 pass 用 `RawShaderMaterial` + GLSL3，片元字符串来自 `src/core/ink-shaders.ts`（从 inkEngine 移植，文件头有归属），three.js 自己加 `#version 300 es`。皴法石头和竹用 `ShaderMaterial`，因为平移后的网格要走 three.js 的模型矩阵。
- 画布 CSS 一律 `object-fit: contain`，逻辑坐标仍是 1280×720 像素；`pixelRatio` 缺省取 `min(2, devicePixelRatio)`，截图 pose 传 `1`。
- 层深沿用 `INK_LAYER_Z`：远景 −80、纸面 0、角色 40、文字 120。

## `InkView`（横版切片）

`new InkView({ canvas, width, height, seed, pixelRatio })` 在 `src/core/ink-view.ts`。`CameraRig` 的透视相机 fov 60°，放在 `z = inkCameraDistance(高度) / zoom`，默认 zoom 为 1。

`camera.up` 是 `(0, -1, 0)`。`lookAt` 在这个 up 下会把视野滚 180° 并镜像 X，所以 `place()` 在 `lookAt` 之后把 `camera.scale.x` 设为 `-1`：世界 +x 在画面右侧，世界 +y 仍向下。负缩放会反转缠绕，角色、地面、竹和皴法填充用 `DoubleSide`，勾边外壳仍是 `BackSide`。正交相机只在 `useOrthographic` 打开时使用。

`webglcontextlost` 把 `playfield.pausedClock` 设为真并停住 `frame`。`webglcontextrestored` 调用 `rebuildGpu`：丢掉旧的 `InkSurface` 与 `TerrainSeep`，新建一套，把丢失前的墨面 `snapshot()` 和洇染干缓冲贴回去，再把远景的 `uMap` 和地面的 `uSeep` 指到新纹理，然后画一帧，不推进物理。拆失效缓冲留下的 `INVALID_OPERATION` 会在这一帧之前清掉，`glError` 只记这一帧自己的错误。`simulateContextLoss` 必须先拍快照再 `loseContext`，丢失之后读不回像素。`WEBGL_lose_context` 在创建渲染器时就取好。`apps/scroll/` 把这两步挂在 `window.__sliceLose` / `__sliceRestore`。真实 GPU 上的丢失恢复未实测。

## `StoryStage`（叙事宿主）

一个场景包一张画布。构造时按 `opening.layers` 建若干 `InkSurface` 平面（`kind: 'screen'` 跳过，缺 `sheet` 时补一张纸层），另加一张 `InkText` 平面（z = 1，字幕与题字）和一张淡出平面（z = 2）。`opening.canvas.paper` 决定纸色。

`webglcontextrestored` 同样调用 `rebuildGpu`：重建每层 `InkSurface`、贴回 `captureRestorePoint()` 采集的快照、刷新材质与 `InkText` 纹理，然后按当前 `DirectorView` 重画一帧。`simulateContextLoss` / `simulateContextRestore` 用 `WEBGL_lose_context`，供无头冒烟使用。

`StoryStage` 不跑 `Playfield`：过场期间只推进 `SceneDirector`，玩法节点只显示目标文字。

## `InkScene`（历史动画）

`new InkScene(canvas)` 固定 1280×720 正交画布，清屏色 `0xdcd4be`。`add({ id, width, height, strokes, pivot? })` 为每个分件建一张透明 `InkSurface`，用真实 `InkSurface.paint` 逐笔绘制，笔与笔之间让出一帧避免一次性阻塞。`pose` / `clip` / `wash` / `render` / `dispose` 见第 7 章。

`InkScene` **目前不做上下文恢复**：`webglcontextlost` 后不再绘制，恢复回调只清 `lost` 标志并重画当前帧，不重建墨面，也不重放笔画。这是待办，不是已完成能力。

## 容易踩的地方

- 再开一个 three.js 动画循环或 `Matter.Runner`，角色和墨就会各走各的步。三个宿主各自只有一个 RAF。
- 在 `apps/` 里拿 `renderer.getContext()` 改 GL 状态。页面只应调用宿主的公开方法。
- 把 `pixelRatio` 调大却不改 `Playfield` 的像素坐标。碰撞始终是 1280×720 的逻辑像素。
- 三张画布共用同一张 canvas 或同一个 `WebGLRenderer`。
