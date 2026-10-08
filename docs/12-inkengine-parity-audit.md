# 12 · 与 inkEngine 的效果对照

[目录](./README.md) · [水墨实现](./07-ink-rendering.md) · [剩余工作](../plan/10-v2-pixi-matter-ink-game-engine-plan.md)

对照对象是 `thirdparty/inkEngine/`（`ink-engine.js`、`NAME-MAP.md`、`README.md`、`index.html`）。它是 inkField 的可读还原，回放录制时与原版逐像素一致。本仓库把它的笔刷与着色器移植进 `src/`，在 Pixi 上跑同一条管线；不把 `ink-engine.js` 嵌进页面，也不宣称逐像素相同。

书面授权由仓库所有者声明，授权书不在仓库内。移植的文件头写了归属：`src/core/ink-brush.ts`、`ink-random.ts`、`ink-palette.ts`、`ink-paper.ts`、`ink-shaders.ts`（由 `scripts/port-inkengine-shaders.mjs` 生成）、`ink-wash-filters.ts`、`ink-wash.ts`。`thirdparty/` 未改。

状态用词：

| 用词 | 含义 |
|---|---|
| 移植 | 逐行转写，随机抽取顺序和常数都保留 |
| 对齐 | 同一算法和数据流，实现方式换成 Pixi |
| 不同 | 有意换成另一做法，原因写在证据栏 |
| 缺失 | `src/` 里没有对应路径 |

证据是读源码、单测，以及无头 Chromium + SwiftShader 的截图与像素统计。没有独立显卡实测，Safari / Firefox 未测。

## 总表

| 能力 | inkEngine | 状态 | `src` 里的证据 |
|---|---|---|---|
| 七种笔刷 | `drawBrushStroke`、`drawBranch`、`drawSprayDots`、`drawDryBrush`、`drawMarker`、`drawGothic`、`drawFlyBrush`，`BRANCH_OFFSETS_5/8/12`、`MARKER_LINES`、`buildFlyBranchConfig` | 移植 | `InkBrushEngine`。同一条测试笔画（`p.randomSeed(100)`，40 帧）两边的笔画种子都是 347340893；去掉 inkEngine 自己画的红色虚线路径后，大笔、marker、gothic、fly、brushSP 每帧的线段数逐帧相同，大笔第 6 帧的线段坐标与线宽差 ≤ 0.001px |
| 落笔参数 | `mousePressed` 按模式设 `initialSize`、`interpSteps`、`spring`、`friction`、`maxUpdates`，以及一串随机量 | 移植 | `press()`。被原版覆盖或丢弃的随机量（如 `indiffusionStrength` 先随机后固定为 0.45）照样抽取，保证后续数值对得上 |
| 每帧状态 | `draw()`：`inkGray`、墨量递减、笔压分档、笔尖偏移 −10px、哥特不偏移 | 移植 | `frame()` / `drawFrame()`。笔压梯度里的 `pow(·, 0.6)` 用牛顿法 `pow06` 代替 |
| 随机与噪声 | `crandom` → p5 `random`（LCG）与 `noise`（4 层倍频、余弦插值） | 移植 | `P5Random`、`P5Noise`。余弦用多项式，与 `Math.cos` 相差 < 1e-8（单测） |
| 线、点、矩形的光栅化 | p5 WEBGL，帧缓冲带 MSAA | 对齐 | Pixi `Graphics` 画进带 MSAA 的 `stamp`，再叠到湿层。只看笔触、不跑 feedback 时，同一笔 10 帧后湿层平均灰度 239.5（inkEngine）对 239.4（src） |
| 扩散 | `runFeedbackPass` + `feedback.frag` 的 6 个墨效分支 | 移植 | `INK_FEEDBACK_FRAGMENT`。输出 alpha < 1 时按 p5 的 `(ONE, ONE_MINUS_SRC_ALPHA)` 叠在专用 ping-pong 上再叠回湿层；同一笔 10 帧后湿层平均灰度 241.8 对 239.8，逐像素平均差 2.6 级 |
| 倒计时与提交 | `maxUpdates` 帧力度递减，`commitStroke`：encode → typeMap → final | 移植 | `INK_ENCODE_FRAGMENT`、`INK_TYPE_MAP_FRAGMENT`。p5 把编码结果拷到不透明白底时 alpha 变成 1、颜色加上 `1 − alpha`，编码 pass 末尾照做 |
| 36 色与色相抖动 | `COLOR_PALETTE`、`hueShift` / `satShift` / `briShift`，明度 > 0.6 推到 0.95 | 移植 | `INK_PALETTE`，encode/realtime 原样 |
| 混色 | mix / multiply / darken / spectral（38 段反射率） | 移植 | 都在 encode 着色器里；道具表目前只用 mix |
| 合成 | `composite.frag`：纸 × 墨，白墨走滤色 | 移植 | `INK_COMPOSITE_FRAGMENT` |
| 实时湿墨 | `realtime.frag` | 移植 | 拖动时 `update()` 用它叠出未提交的湿墨 |
| 纸 | `generatePaperTexture(40, 20, 15, 0.2)`，P2D 拼贴后乘到底色 ×1.1 | 移植 | `inkPaperPixels`，同样的 Canvas 2D 调用和种子 |
| 力场 | `updateForceMap` 每帧跑 `mapFrag`，时间来自 `millis()` | 不同 | 着色器移植，但每张墨层只在建表时画一次（时间 0）。它只让采样偏移约 ±0.1px，逐帧重画在 SwiftShader 上让每笔多一倍开销。原版从未上传的 6 个 uniform 同样为 0 |
| 全屏 pass | 每帧对整个画布跑 feedback | 不同 | 只跑笔画外接矩形。墨效 0–3 下矩形外像素原版也不变；墨效 4/5 的外扩按每帧 3px 预留 |
| 重叠处的残影 | 新笔第一帧与上一笔的 ping-pong 内容混合 | 不同 | 落笔时把上一笔的矩形填回白色，只在新旧笔重叠的第一帧略浅 |
| 镜头与分层 | EasyCam、4 层 z 平面、景深模糊 | 缺失 | 游戏页是平面画布。对照截图时宿主页打开 EasyCam（关掉时 inkEngine 的整幅画会缩到约 65% 并居中） |
| 后处理 | flow、distort、虫蚀 metallic、遮罩 | 缺失 | 合成之后没有这些 pass |
| 录制 | `mp` / `md` / `mr`、回放 | 不同 | `src/plugins/recording.ts` 只记录 v0.1 命令。2.0 的笔画用 `PropStroke`（笔刷、颜色、每帧指针点、种子）表达，对照页把它交给宿主页重画 |
| 旧流体 | 无 | 不同 | `src/plugins/ink-fluid.ts` 仍服务 `/inkcross/`，不是这条管线 |

## 道具怎么画

每个道具是一组指针笔画，笔刷取自 `src/plugins/prop-brushes.ts` 的 `PROP_BRUSHES`，路径在 `src/plugins/prop-paintings.ts`，见 [第 8 章](./08-gameplay-and-persistence.md)。对照页 `/compare/?prop=<id>` 用公共 API 画一个道具，并把笔画按 inkEngine API 导出（模式编号、尺寸、墨效、混色、颜色、指针坐标、种子）。`scripts/capture-parity.mjs` 让宿主页逐笔执行 `p.randomSeed(seed)`、`setBrush`、`setColor`、`strokePath`、`step`，两边同尺寸、同纸色、同纸纹种子，再并排截图。

## 并排时应该看到什么，以及不该声称什么

同一组笔画下，两边的每一笔应落在同一位置，有同样的笔势、分叉、飞白断口、点画分布和颜色。差别来自三处：力场不随时间流动，Pixi 与 p5 的线段光栅化和 MSAA 不同，以及着色器噪声的取样细节。所以墨色深浅和斑驳的位置会有出入，构图和笔性应当一致。

未实测：独立显卡、Safari、Firefox、以及「和 inkField 原版逐像素一致」。SwiftShader 截图只说明着色器能跑、构图和笔性可对。
