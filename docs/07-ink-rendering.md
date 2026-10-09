# 07 · 水墨

[目录](./README.md) · [上一章](./06-input-strokes-and-physics.md) · [下一章](./08-gameplay-and-persistence.md)

> 本章正文描述**现行代码**。文末「计划（未实现）」是 three.js + Matter.js 的目标，类还没有导出，不能当调用示例。

2.0 的画面由 `InkWash`（`src/core/ink-wash.ts`）在 Pixi RenderTexture 上运行 inkEngine 的整条笔刷管线。笔刷逐帧移植自 `thirdparty/inkEngine/ink-engine.js`，着色器由 `scripts/port-inkengine-shaders.mjs` 从同一快照转换而来，文件头写了归属。逐项对照见 [第 12 章](./12-inkengine-parity-audit.md)。旧的 `InkFluid` 仍只服务 `/inkcross/`，本节最后单列。

## 模块

| 文件 | 内容 | 对应 inkEngine |
|---|---|---|
| `src/core/ink-brush.ts` | `InkBrushEngine`：落笔初始化、每帧画什么、何时扩散/倒计时/提交 | `mousePressed`、`draw()`、`drawBrushStroke`、`drawBranch`、`drawSprayDots`、`drawDryBrush`、`drawMarker`、`drawGothic`、`drawFlyBrush` |
| `src/core/ink-random.ts` | p5 兼容的 `P5Random`（LCG）与 `P5Noise`（4 层倍频）、多项式 `inkSin` / `inkCos` | p5 `randomSeed` / `random` / `noise` |
| `src/core/ink-palette.ts` | 36 色 `INK_PALETTE`，名字与 id 和 inkEngine/index.html 的颜色菜单一致 | `COLOR_PALETTE`、`setBrushColorName` |
| `src/core/ink-shaders.ts` | 生成的 GLSL 3.00：feedback、encode、typeMapEncode、composite、realtime、mapFrag | 同名 `.frag` |
| `src/core/ink-wash-filters.ts` | 把上面的着色器包成 Pixi 滤镜，另加水刷用的 `wash` | — |
| `src/core/ink-paper.ts` | 纸纹：40px 纤维小块按页宽 1/500 的步长拼贴，再乘到底色 ×1.1 上 | `generatePaperTexture`、`createPaperStampTile` |

## 一帧做什么

和 inkEngine 的 `draw()` 同序：

1. 指针按下时 `press`：取笔画种子、按笔刷模式设初始尺寸、插值步数、弹簧系数和倒计时帧数 `maxUpdates`（大笔 30，其余 10，墨效 4/5 时 20）。
2. 每帧：墨色 `inkGray` 低通更新，`brushSize` 减 0.05（墨在用完），第 8 帧起按笔压分档，笔尖落在指针左上 10px（gothic 除外），然后按模式出笔：大笔/brushSP 是主线加 5/8/12 条分叉，marker 是一串横跨笔势的白底描边矩形，pen 是 80 个散点，dots 是喷点，fly 是 10–50 条平行毫，gothic 是向两侧飞散的粒子。
3. 这些线、点、矩形画进 `wet`（白底灰墨），然后跑一次 `feedback.frag`。
4. 提笔后再跑 `maxUpdates` 次 feedback，力度从 1 线性降到 0（速写笔再乘 0.4）。
5. 提交：`encode.frag` 按颜色把湿墨编进 `final`，`typeMapEncode.frag` 标记类型，`wet` 清回白色，`composite.frag` 把纸乘上墨写进 `display`。

随机抽取的顺序与原版一致：同一 `seed`（宿主页对应 `p.randomSeed(seed)`）得到同一笔画种子、同一批线段。`tests/ink-brush.test.ts` 锁了大笔、哥特、小笔、飞白在一条测试笔画上逐帧的线段数。

## 缓冲

全部是画面尺寸的 RGBA8 RenderTexture，分辨率 1。

| 纹理 | 内容 | 初值 |
|---|---|---|
| `stamp` | 这一帧的笔触，带 MSAA，画完叠到 `wet` 上 | 透明 |
| `wet` | 正在画的灰度湿墨（inkEngine 的 `newBufferBlack`） | 白 |
| `pingPong` | feedback 的输出，下一帧再与新输出混合 | 白 |
| `final` | 已提交的颜色（`finalBuffer`） | 白 |
| `typeMap` | R 0.5 普通墨 / 1 白墨，G 白墨不透明度 | 黑 |
| `display` | 纸 × 墨的合成结果，`view` 显示它 | 合成一次 |
| `force` | `mapFrag` 力场，每次 feedback 前按帧时钟重画笔画矩形 | — |
| `lastStroke` | 刚提交的湿墨，给 flow 的 `lastStrokeTex` | 白 |
| `bugsMask` / `bugsData` | 虫蚀轮廓的颜色和中心 | 透明 |
| `scratch` | 读写分离的临时目标 | — |

每个 pass 只覆盖当前笔画的外接矩形（加 3px，墨效 4/5 每帧再扩 3px）。在矩形外 inkEngine 的全屏 pass 不会改动像素，所以结果相同，SwiftShader 上快得多。

feedback 的输出 alpha 常小于 1。p5 以 `(ONE, ONE_MINUS_SRC_ALPHA)` 把它叠在上一帧的 ping-pong 上，再叠回湿层。这一步决定了老墨会越压越深而不是越来越淡，所以 `pingPong` 是专用纹理，不能和别的 pass 共用。编码 pass 也照 p5 的拷贝方式把 alpha 写回 1，并把 `1 − alpha` 加到颜色上。

## API

```ts
const wash = new InkWash(app, { width: 640, height: 480, seed: 1234567890, background: [214, 206, 188], paper: true });
app.stage.addChild(wash.view);
wash.paint({
  brush: { mode: 'brush', size: 'large', effect: 'wet', blend: 'mix' },
  color: 'sage_gray',
  points: [{ x: 100, y: 200 }, { x: 109, y: 199 } /* 每帧一个点 */],
  seed: 42,
});
```

- `InkWashOptions`：`width`、`height`、`seed`（纸、力场和默认笔画种子）、`background`（inkEngine 的 `canvasBackgroundColor`，纸是它 ×1.1）、`paper`（纸纹开关）、`transparent`（白底无纸，给用 `blendMode = 'multiply'` 叠在别的纸上的图层）。
- `setBrush({ mode, size, effect, blend })`、`setColor(name | [r, g, b])`、`strokePath(points, seed?)`、`paint(stroke)`：与 inkEngine 的 `setBrush().setColor().strokePath()` 对应。`points` 是笔尖落点；`inkPointerPath(points, mode)` 换算成 inkEngine 要的指针坐标（加 10px，gothic 不加）。
- `strokePath` 是同步的：按下、每帧一个点、停一帧、提起、倒计时、提交，全部在一次调用里跑完。
- `beginStroke` / `addPoint` / `endStroke` 给拖动用，每个显示帧调一次 `update()`。和 inkEngine 一样每帧只取最新的指针位置，提交前用 `realtime.frag` 在 `display` 上叠出湿墨。
- `finish`（可选）：笔画提交后按 inkEngine 的顺序跑 metallic、distort、flow。见下。
- `wash(x, y, radius)`：水刷。按距离把 `final` 往白色混，类型图在圈心清零，再重画这一块。
- `clear()`、`dispose()`（幂等）。

`InkFinish`：

| 字段 | 行为 |
|---|---|
| `flow: { blendType, iterations, seed? }` | 一次 flow 提交。`blendVol = 100 * (1 + iterations * 0.1)`，写入 `final` 和 `typeMap` 后再合成。种子缺省时用笔画种子对 1000000 取余 |
| `distort: { displacementB?, displacementC?, extent? }` | `extent: 'frame'` 扭曲整幅，`'stroke'`（默认）只扭曲这一笔的矩形及其上下镜像。B 默认 20，C 默认 50 |
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

`force` 用移植的 `mapFrag`。每次 feedback 前把当前笔画矩形重画一遍，时间是 `frameCount / 60`，对应 `clock: 'frame'` 下的 `millis() * 0.001`。新墨层的 `frameCount` 从 2 开始，因为对照用的宿主页在 `ready` 之后先 `step(2)`。矩形以外的力场留着上一次的值；feedback 只采样矩形内部。`mapFrag` 里那 6 个从未被上传的 uniform 仍然是 0。空闲时不重画整幅，所以游戏进行中纸上的旧墨不会自己继续流动。

纸纹按 `generatePaperTexture(40, 20, 15, 0.2)`：用 Canvas 2D 画 100 个半径 0.75 的浅点做小块，横向每 `宽/500` 像素、纵向每 20 像素盖一次，纵向按 `noise` 抖 15px，最后以 MULTIPLY 乘到 `min(255, 底色 × 1.1)` 上。种子相同、浏览器相同时，纸与 inkEngine 宿主页一致。

## 游戏里的分层

`InkStage` 用三类墨层，见 [第 8 章](./08-gameplay-and-persistence.md)：

- 远山：单独一张透明墨层，放在 z = −80，绕画面中心缩放，相机移动时比纸层少跟一段。
- 纸层（z = 0，不缩放）：近山、地面、河、靶和本页道具，开场画一次，水刷不改。屏幕坐标等于世界坐标减去相机偏移。
- 可擦层：同样在 z = 0。`transparent` 的 `InkWash`，`multiply` 叠在纸层上，放可擦桥、挥击、溅墨、尘迹、水纹。重播和重置只清这一层。
- 精灵（z = 40）：会动或拿在手里的东西各自画在一张小的透明墨层上。缩放绕落点（脚、蹄、龙骨、旗杆根、箭镞），所以脚还踩在 z = 0 的地面上。飞行中的箭和墨罐绕刚体中心缩放。

`inkLayerScale(height, z)` 和 `INK_LAYER_Z` 是这套深度。相机以 0.05 的比例跟上角色，偏移限制在水平 48 px、垂直 36 px，避免纸的边缘露出太多。指针换算会把这个偏移加回去。没有景深模糊，也没有 EasyCam 在回放时收到的 1.1 倍变焦。

## 旧墨水：`InkFluid`

`src/plugins/ink-fluid.ts` 是纳维–斯托克斯风格的 R/RG16F 场，由 `createInkFluidPlugin()` 接到 v0.1 渲染阶段。它和 `InkWash` 不是同一个模型。水刷的剪刀矩形会清掉活动墨、湿场和已经沉下去的 `fixedInk`，否则固定步跑得快时桥面擦完仍是深色；矩形外面的湿墨还会回渗。锁定笔画不走这条擦除。

## 调用时注意

- `strokePath` 在主线程里连续跑完整笔（几十到上百帧的 pass）。十卡开场在 SwiftShader 上要 18–35 秒；真实 GPU 上快得多，但没有实测。
- 着色器里的 `hash` 用了 `sin`，只影响显示。CPU 侧的笔刷只用四则、`Math.sqrt` / `Math.hypot` 和多项式正余弦。
- 透明墨层叠在纸上时用 `multiply`，等价于直接画在纸上，只在与纸层笔画重叠处少了一次编码混色。

## 计划（未实现）

计划中的墨面叫 `InkSurface`。它接替 `InkWash` 的缓冲和 pass 顺序，宿主从 Pixi `RenderTexture` 换成 `WebGLRenderTarget`。`InkBrushEngine`、调色板、纸纹、36 色和 `ink-shaders.ts` 里的片元文本留下。`ink-wash-filters.ts` 的 Pixi 包装换成 `RawShaderMaterial`。

ping-pong 仍是两张专用目标。每个 pass 仍只覆盖笔画外接矩形。片元里的 Y 翻折先保留，等对照页的一笔决定 three.js 渲染目标要不要翻。中间纹理不做额外的 sRGB 往返，避免墨被伽马再处理一次。这一步未实测。

`texture` 可以贴在 z 平面上，也可以交给地形材质。`snapshot()` / `restore()` 给过场跳过和上下文恢复用。

三样新画面的数据流见 [引擎计划](../plan/10-three-matter-side-scroller-plan.md)。摘要：

1. **洇染与留白。** 脚步或 `effects.inkDisperse` 把接触点盖进一张 512×256 的动态纹理，再按烘焙的高度和法线向下坡渗。渗流用 `min()` 保留更深的墨。没有墨的地方是纸色。渗流不参与碰撞。
2. **皴法与勾边。** 山石材质分披麻皴和斧劈皴。外壳沿法线挤出，宽度随相机距离变化：拉近更粗，拉远更细，再用 Perlin 噪声做毛边。山石不用全屏 `OutlinePass`。噪声实现计划移植 MIT 的 [stegu/webgl-noise](https://github.com/stegu/webgl-noise)，现在还没拷进仓库。
3. **断竹。** 风中的摆动是顶点着色器里的正弦，显示用。砍断由扫掠命中决定：上段变成 Matter 刚体，断口撕开，墨滴是最多 256 个点，不写回地面。

叙事上触发洇染和断竹的接口是 `inkDisperse` 与 `bambooBreak`，对应过场里的 `EffectCue.kind`。历史游戏把这个接入标成 P1。引擎切片里脚步和砍竹会先接上。
