# 07 · 水墨

[目录](./README.md) · [上一章](./06-input-strokes-and-physics.md) · [下一章](./08-gameplay-and-persistence.md)

画面全部由 three.js 路径产生。笔刷逐帧移植自 `thirdparty/inkEngine/ink-engine.js`，着色器由 `scripts/port-inkengine-shaders.mjs` 从同一快照转换而来，文件头写了归属。逐项对照见 [第 12 章](./12-inkengine-parity-audit.md)。Pixi 版 `InkWash` 与滤镜包装 `ink-wash-filters.ts` 已删除，管线现由 `InkSurface` 在 `WebGLRenderTarget` 上跑；`InkFluid`（原生 WebGL2 场）也已删除。

## 模块

| 文件 | 内容 | 对应 inkEngine |
|---|---|---|
| `src/core/ink-brush.ts` | `InkBrushEngine`：落笔初始化、每帧画什么、何时扩散/倒计时/提交 | `mousePressed`、`draw()`、`drawBrushStroke`、`drawBranch`、`drawSprayDots`、`drawDryBrush`、`drawMarker`、`drawGothic`、`drawFlyBrush` |
| `src/core/ink-random.ts` | 与 p5 数值兼容的 `P5Random`（LCG）与 `P5Noise`（4 层倍频）、多项式 `inkSin` / `inkCos`。**不依赖 p5 包** | p5 `randomSeed` / `random` / `noise` |
| `src/core/ink-palette.ts` | 36 色 `INK_PALETTE`，名字与 id 和 inkEngine/index.html 的颜色菜单一致 | `COLOR_PALETTE`、`setBrushColorName` |
| `src/core/ink-shaders.ts` | 生成的 GLSL 3.00：feedback、encode、typeMapEncode、composite、realtime、mapFrag | 同名 `.frag` |
| `src/core/ink-pass.ts` | three.js 宿主：`RawShaderMaterial` + 全屏三角形 + ping-pong 目标 | 原 Pixi 滤镜包装的替代 |
| `src/core/ink-raster.ts` | 把 `InkDrawOp` 光栅化进 `stamp`（线段、点、描边矩形） | Pixi `Graphics` 的替代 |
| `src/core/ink-paper.ts` | 纸纹：40px 纤维小块按页宽 1/500 的步长拼贴，再乘到底色 ×1.1 上 | `generatePaperTexture` |
| `src/core/ink-stroke.ts` | 与渲染库无关的笔画契约：`InkStrokeRequest`、`InkColor`、`InkFinish`、`inkPointerPath` | — |

## 一帧做什么

和 inkEngine 的 `draw()` 同序：

1. 指针按下时 `press`：取笔画种子、按笔刷模式设初始尺寸、插值步数、弹簧系数和倒计时帧数 `maxUpdates`（大笔 30，其余 10，墨效 4/5 时 20）。
2. 每帧：墨色 `inkGray` 低通更新，`brushSize` 减 0.05（墨在用完），第 8 帧起按笔压分档，笔尖落在指针左上 10px（gothic 除外），然后按模式出笔：大笔/brushSP 是主线加 5/8/12 条分叉，marker 是一串横跨笔势的白底描边矩形，pen 是 80 个散点，dots 是喷点，fly 是 10–50 条平行毫，gothic 是向两侧飞散的粒子。
3. 这些线、点、矩形画进 `wet`（白底灰墨），然后跑一次 `feedback.frag`。
4. 提笔后再跑 `maxUpdates` 次 feedback，力度从 1 线性降到 0（速写笔再乘 0.4）。
5. 提交：`encode.frag` 按颜色把湿墨编进 `final`，`typeMapEncode.frag` 标记类型，`wet` 清回白色，`composite.frag` 把纸乘上墨写进 `display`。

随机抽取的顺序与原版一致：同一 `seed`（宿主页对应 `p.randomSeed(seed)`）得到同一笔画种子、同一批线段。`tests/ink-brush.test.ts` 锁了大笔、哥特、小笔、飞白在一条测试笔画上逐帧的线段数。

## 缓冲

全部是画面尺寸的 RGBA8 `WebGLRenderTarget`，分辨率 1。

| 纹理 | 内容 | 初值 |
|---|---|---|
| `stamp` | 这一帧的笔触，带 MSAA，画完叠到 `wet` 上 | 透明 |
| `wet` | 正在画的灰度湿墨（inkEngine 的 `newBufferBlack`） | 白 |
| `pingPong` | feedback 的输出，下一帧再与新输出混合 | 白 |
| `final` | 已提交的颜色（`finalBuffer`） | 白 |
| `typeMap` | R 0.5 普通墨 / 1 白墨，G 白墨不透明度 | 黑 |
| `display` | 纸 × 墨的合成结果，显示它 | 合成一次 |
| `force` | `mapFrag` 力场，每次 feedback 前按帧时钟重画笔画矩形 | — |
| `lastStroke` | 刚提交的湿墨，给 flow 的 `lastStrokeTex` | 白 |
| `bugsMask` / `bugsData` | 虫蚀轮廓的颜色和中心 | 透明 |
| `scratch` | 读写分离的临时目标 | — |

每个 pass 只覆盖当前笔画的外接矩形（加 3px，墨效 4/5 每帧再扩 3px）。在矩形外 inkEngine 的全屏 pass 不会改动像素，所以结果相同，SwiftShader 上快得多。

feedback 的输出 alpha 常小于 1。原版以 `(ONE, ONE_MINUS_SRC_ALPHA)` 把它叠在上一帧的 ping-pong 上，再叠回湿层。这一步决定了老墨会越压越深而不是越来越淡，所以 `pingPong` 是专用纹理，不能和别的 pass 共用。编码 pass 也照原版把 alpha 写回 1，并把 `1 − alpha` 加到颜色上。

## API

```ts
import { InkSurface } from '@inkgames/engine';

const surface = new InkSurface(renderer, { width: 640, height: 480, seed: 1234567890, background: [214, 206, 188], paper: true });
surface.paint({
  brush: { mode: 'brush', size: 'large', effect: 'wet', blend: 'mix' },
  color: 'sage_gray',
  points: [{ x: 100, y: 200 }, { x: 109, y: 199 } /* 每帧一个点 */],
  seed: 42,
});
scene.add(new Mesh(new PlaneGeometry(640, 480), new MeshBasicMaterial({ map: surface.texture, transparent: true })));
```

- `InkSurfaceOptions`：`width`、`height`、`seed`（纸、力场和默认笔画种子）、`background`、`paper`（纸纹开关）、`transparent`（白底无纸，供叠在别的纸上）。
- `setBrush({ mode, size, effect, blend })`、`setColor(name | [r, g, b])`、`strokePath(points, seed?)`、`paint(stroke)`。`points` 是笔尖落点；`inkPointerPath(points, mode)` 换算成 inkEngine 要的指针坐标（加 10px，gothic 不加）。
- `strokePath` 是同步的：按下、每帧一个点、停一帧、提起、倒计时、提交，全部在一次调用里跑完。
- `beginStroke` / `addPoint` / `endStroke` 给拖动用，每个显示帧调一次 `update()`。和 inkEngine 一样每帧只取最新的指针位置，提交前用 `realtime.frag` 在 `display` 上叠出湿墨。同一张墨面只允许一个活动笔画，宿主（`StoryStage.paintPulses`）负责拒绝并发并计数。
- `finish`（可选）：笔画提交后按 inkEngine 的顺序跑 metallic、distort、flow。
- `wash(x, y, radius)`：水刷。按距离把 `final` 往白色混，类型图在圈心清零，再重画这一块。
- `snapshot()` / `restore()`、`replayEffect(finish)`、`clear()`、`dispose()`（幂等）。
- `texture`：交给 three.js 材质作为 `map`。
- `parseVectorInk` / `compileVectorInk`：把手写的 `inkgames.vector-ink` 路径收成上面的 `paint` 笔画。格式见 [第 5 章](./05-world-scene-and-assets.md)。`scoreInkRgba` 在已经铺好纸色的两张 RGBA 上算平均绝对 RGB、16 像素窗的 SSIM，以及亮度梯度差。

`InkFinish`：

| 字段 | 行为 |
|---|---|
| `flow: { blendType, iterations, seed? }` | 一次 flow 提交。`blendVol = 100 * (1 + iterations * 0.1)`，写入 `final` 和 `typeMap` 后再合成。种子缺省时用笔画种子对 1000000 取余 |
| `distort: { displacementB?, displacementC?, extent? }` | `extent: 'frame'`（叙事里由 `StoryStage` 按 `params.extent` 传入）扭曲整幅，`'stroke'` 只扭曲这一笔的矩形及其上下镜像。B 默认 20，C 默认 50 |
| `metallic: { size?, tint? }` | 按 inkEngine 的阈值在已合成的画面上找深色点，画闪电形咬痕，再跑 `metallic.frag`。`size` 默认 10，`tint` 默认 `[0.72, 0.5, 0.35]` |

笔刷取值与 inkEngine/index.html 的菜单相同：

| 字段 | 取值 |
|---|---|
| `mode` | `brush`(1) `marker`(2) `gothic`(3) `pen`(4) `dots`(5) `fly`(6) `brushSP`(7) |
| `size` | `ultra-small` 0.1、`extra-small` 0.25、`small` 0.5、`medium` 1、`large` 2、`extra-large` 3、`extra-extra-large` 5、`huge` 10，或数字 |
| `effect` | `mix`(0) `sharpen`(1) `flyingWhite`(2) `wet`(3) `effect4`(4) `hair`(5) |
| `blend` | `mix`(0) `multiply`(1) `darken`(2) `spectral`(3) |
| 颜色 | `INK_COLOR_NAMES` 的 36 个名字，或 RGB（自定义色 33） |

## 选笔时要知道的几件事

这些都是原版行为，移植时保留：

- **亮色会被冲淡。** 明度（最大通道）高于 0.6 的颜色在编码时被推到 0.95，只剩一层淡色。`silver`、`gray_green`、`khaki`、`dusty_rose` 画出来都很浅；`dusty_rose` 其实是淡青。要看得清的灰蓝用 `sage_gray`、`blue`、`gray_brown` 或 `light_gray_new`（灰色 2/3/4 不做这一步）。
- **`medium_gray`（29）在编码里用画布底色上色**，等于橡皮，道具表里禁止使用。
- **尺寸 ≥ 4（`extra-extra-large`、`huge`）不画主线**，只剩随机旋转的分叉，成片是碎点。成块的浓墨用 `large` 加笔压 0.3–0.5（第 8 帧起升一档到 3），或叠几笔 `extra-large`。
- **笔压越过 0.7 会升三档**，`large` 会跳到 `huge`，同样只剩碎点。
- **运笔越快越细。** 线宽是 `尺寸 − 速度`，`small` 以每帧 12px 运笔几乎看不见。
- **`extra-small`（0.25）的线宽上限是 0.7px**，非常淡；要清楚的细线用 `ultra-small`（2px）。
- **`sharpen` 画出来是深色轮廓、浅色中间**；要实心用 `mix`。
- **gothic 的粒子用颜色本身的 RGB 写湿层**，浅色粒子留下的墨很少。

## 力场与纸

`force` 用移植的 `mapFrag`。每次 feedback 前把当前笔画矩形重画一遍，时间是 `frameCount / 60`，对应 `clock: 'frame'` 下的 `millis() * 0.001`。新墨层的 `frameCount` 从 2 开始（`InkSurface` 构造时）。矩形以外的力场留着上一次的值；feedback 只采样矩形内部。空闲时不重画整幅，所以游戏进行中纸上的旧墨不会自己继续流动。

纸纹按 `generatePaperTexture(40, 20, 15, 0.2)`：用 Canvas 2D 画 100 个半径 0.75 的浅点做小块，横向每 `宽/500` 像素、纵向每 20 像素盖一次，纵向按 `noise` 抖 15px，最后以 MULTIPLY 乘到 `min(255, 底色 × 1.1)` 上。

## 分层

三个宿主各有一套分层，都沿用 `INK_LAYER_Z`（远景 −80、纸面 0、角色 40、文字 120）：

- **切片**（`InkView`）：远山 / 背景平面、`InkSurface` 墨面（洇染与笔画）、角色与竹落在 z = 40。相机以 0.05 的比例跟上角色，再夹进关卡包围盒；没有景深模糊。
- **叙事**（`StoryStage`）：按 `opening.layers` 建墨层平面，另有 `InkText`（z = 1，字幕题字）与淡出平面（z = 2）。
- **历史动画**（`InkScene`）：每个分件一张透明墨面，`order` 决定遮挡先后。

## 图片显影（对照实验）

`InkAnimation`、`animationPose`、`validateAnimation` 仍从 `src/index.ts` 导出（图片显影材质、镜头边界求值、镜头数据校验），供对照实验使用；它不是现行历史动画方向，`/history/` 已不再调用。

## 程序水墨分件场景（2026-10-09）

`InkScene` 从 `src/index.ts` 导出：`new InkScene(canvas)` 固定 1280×720 正交画布；`await add({ id, width, height, strokes, pivot? })` 用真实 `InkSurface.paint` 把原创路径画到透明墨面，并在层间让出一帧，避免一次性阻塞；`pose(id, { x, y, scale, rotation, opacity, order })` 设置分件变换，`clip(id, rect | null)` 设矩形遮罩，`wash(id, steps)` 在图层自己的墨面上跑真实漫水，`render()` 出图，`dispose()` 幂等释放墨面、几何与材质。它不加载任何外部图片，输入只是 `InkStrokeRequest[]` 与 `pivot`。

局限必须写明：墨层是**预绘制的确定性笔画结果**，播放中只做分件变换与一次性漫水，没有逐帧新反馈；`InkScene` 未接入 `StoryStage`、`CutscenePlayer` 轨道或 `CutsceneTick`；每层各保留一张 `InkSurface`（内部多张 RT），GPU 内存按层累加；上下文丢失后不重建墨面，也没有活动笔画或随机状态。这些是待办，不是已完成能力。

`LayerKey` 的 `clip` 与 `order` 在关键帧处**切换而非插值**，避免出现半个开口的遮罩或半透明的遮挡顺序。天裂当前用矩形收缩表现，任意多边形遮罩仍未实现。

`/history/` 用 `InkScene` 展示上古「混沌开卷」五幕：30 fps 展示、名义 90 秒、保留原剧本字幕，提供播放/暂停/重播/进度拖动/跳镜与 `?frame=` 定位。人物、山水、火与五色石均为原创路径分件，不用参考图。分件与关键帧抽在 `apps/history/chaos-data.ts`，是原创表现数据；`validatePresentation` / `poseAt`（`src/core/ink-presentation.ts`，已导出）负责校验与求值，`apps/history/procedural.ts` 只做“校验 → 逐层绘制 → 每帧按帧号求位”。求值纯由帧号决定、不累计积分，因此跳帧与顺播同值。

无头 Chromium + SwiftShader 已验证三页绘制完成、无 JS/shader 错误、无图片请求，且跨镜头跳转（s2、s5）字幕与姿态正确；真实 GPU 观感、性能、连续墨扩散、关节绑定与遮罩质量均未实测。

## 调用时注意

- `strokePath` 在主线程里连续跑完整笔（几十到上百帧的 pass）。SwiftShader 上很慢，真实 GPU 上快得多，但没有实测数据。
- 着色器里的 `hash` 用了 `sin`，只影响显示。CPU 侧的笔刷只用四则、`Math.sqrt` / `Math.hypot` 和多项式正余弦。
- 透明墨层叠在纸上时用 `multiply`（在 three.js 里由材质透明度与合成顺序表达），等价于直接画在纸上。
