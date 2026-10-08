# 07 · 水墨

[目录](./README.md) · [上一章](./06-input-strokes-and-physics.md) · [下一章](./08-gameplay-and-persistence.md)

2.0 的画面在 `InkWash`（`src/core/ink-wash.ts`）和 `src/core/ink-wash-filters.ts`。算法结构对照 inkEngine 的反馈、类型图和正片叠底，着色器文件头写了归属。逐项哪些对齐、哪些没有，见 [第 12 章](./12-inkengine-parity-audit.md)。旧的 `InkFluid` 仍只服务 `/inkcross/`，本节后面单列。

## 缓冲

模拟宽高是 `round(width * scale)`、`round(height * scale)`，至少 2。十卡 `scale` 为 0.5，对照页为 1。

| 纹理 | 内容 | 清空色 |
|---|---|---|
| `wet` | 正在画的灰度湿墨，越黑越浓 | 白 |
| `scratch` | 读写分离的临时目标 | — |
| `stamp` | 这一笔的笔毫，RGB 黑、alpha 为覆盖率 | 画之前 clear |
| `committed` | 可被水刷减淡的干墨 RGB | 白 |
| `locked` | 山、地面、锁定桥，水刷不改 | 白 |
| `typeMap` | R 类别，G 浓度，B 笔画序号 | 黑 |
| `paperTexture` | 纸纹，线性采样 | — |
| `forceTexture` | 静态力场，RG 约在 128±45 | — |

`view` 是一张铺满显示尺寸的 `Sprite`，滤镜只有合成。人物和道具画在它上面，不进这些纹理。

## 一条笔画的寿命

`strokePath(points, style, layer, settleFrames)` 是同步的，开场落墨用它：

1. 若还有未提交的实时笔，先 `commit`。
2. `strokeSegments` 得到笔毫。
3. 笔毫画进 `stamp`（线宽至少 0.9 个模拟像素，避免半分辨率下发丝消失），`deposit` 用 `wet *= (1 - cover * 0.92)` 叠上去。重叠越叠越暗。
4. `settleFrames` 次 `feedback`。`wet` 效果的扩散系数是 0.62，其余 0.45。
5. `commit`：按颜料把暗度染进 `committed` 或 `locked`，`min` 进已有干墨；类型图只在「有墨且该像素还没写过」时写入；湿层填回白色。

`beginStroke` / `addPoint` / `endStroke` 给拖动用。`addPoint` 只盖章，不扩散。之后每一显示帧 `update()` 扩散一次。`endStroke` 之后再空转 14 帧就提交。暂停会立刻 `endStroke`。

`blot(x, y, radius, style, layer, settleFrames)` 画三个错开的黑圆（alpha 0.55 / 0.35 / 0.28），再走同一套扩散和提交。坐标和半径乘 `scale`。

`wash(x, y, radius)` 只读 `committed`，按距离 `smoothstep` 往白色混。锁定层不受影响。

`clear()` 把湿、干、锁定填白，类型图填黑，笔画序号回到 1。`dispose()` 幂等，销毁纹理和滤镜。

## 颜料

```ts
interface InkPigment { readonly r: number; readonly g: number; readonly b: number }
interface InkStrokeStyle extends InkBrushOptions {
  readonly pigment: InkPigment;
}
```

提交时 `tinted = mix(白, pigment, 暗度)`，再和目标层取 `min`。后画上去的更暗颜色会压住更浅的。没有光谱混合，也没有 36 色表。常量：

| 名字 | RGB |
|---|---|
| `INK_BLACK` | 0.07, 0.07, 0.08 |
| `INK_INDIGO` | 0.12, 0.16, 0.28 |
| `INK_CINNABAR` | 0.42, 0.16, 0.12 |
| `INK_PINE` | 0.16, 0.24, 0.20 |
| `INK_TEA` | 0.38, 0.28, 0.16 |

类型图：颜料亮度 `0.299r+0.587g+0.114b > 0.75` 时类别写 1，否则 0.5。合成时类别大于 0.75 走滤色（浅墨），否则纸色乘墨色。边缘按干墨亮度梯度再压暗一档。

## 反馈在做什么

`feedback.frag` 的 mix 分支（`uEffect < 0.5`）移植了「先 `min(当前, 力场偏移采样)`，再向四邻渗」的结构。四邻偏移是 1.6 个纹素，参考着色器更紧。力场采样是静态噪声，不随时间变，所以同一条 `strokePath` 在同一种子下不会自己流动。

`sharpen` 是邻域反差的一小步。`flyingWhite` 用噪声把缝隙抬亮。`wet` 沿一个方向压暗并加少量颗粒。这三支都比参考 pass 短。

纸纹：`paper: 'neutral'` 底是 222 灰，`'xuan'` 底是 `(236, 228, 210)`。纤维用 `valueNoise`，幅度约 34，再加点斑。这不是 inkEngine 的 p5 拼贴纸。

## 旧墨水：`InkFluid`

`src/plugins/ink-fluid.ts` 是纳维–斯托克斯风格的 R/RG16F 场，由 `createInkFluidPlugin()` 接到 v0.1 渲染阶段。它和 `InkWash` 的 `min()` 扩散不是同一个模型。水刷的剪刀矩形会清掉活动墨、湿场和已经沉下去的 `fixedInk`，否则固定步跑得快时桥面擦完仍是深色；矩形外面的湿墨还会回渗。锁定笔画不走这条擦除。

## 调用时注意

- `strokePath` 在主线程里连续渲染多帧。开场若堆太多 `settleFrames`，SwiftShader 上会卡住首帧。十卡开场因此把大多数笔画的结算压在 8 帧以内，模拟分辨率减半。
- 实时笔的颜料要等 `commit` 才进入干层。`update` 期间合成用的是当前 `uPigment`。
- `wash` 不改类型图。被洗掉的区域类型仍可能记着旧笔画号，但亮度为白，乘上纸色后看不出来。
- 着色器里的 `hash` 用了 `sin`，只影响显示。CPU 笔毫不调用它。
