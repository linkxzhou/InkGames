# 06 · 输入、笔和碰撞

[目录](./README.md) · [上一章](./05-world-scene-and-assets.md) · [下一章](./07-ink-rendering.md)

权威几何在 CPU。像素着色器不决定能不能站上去。

## 2.0 输入

`InkStage.installInput` 监听 `keydown` / `keyup` 和画布上的 `pointerdown` / `pointermove` / `pointerup`。监听都放进 `observers`，`dispose` 时成对卸掉。

| 输入 | 效果 |
|---|---|
| `A` / `D`（或左右箭头） | 固定步里 `move(-1)` / `move(1)`，都按住则不动 |
| `W`（或上箭头） | `jump()`，仅当 `InkWorld` 认为角色着地 |
| `Space` | `preventDefault` 后 `act()`，落点默认在角色右侧 |
| 指针（剑、刀） | 拖动：`beginStroke` / `addPoint` / `endStroke`，湿墨跟着显示帧扩散 |
| 指针（水刷） | 拖动：`wipe`，半径 52 |
| 指针（其余） | 点下即 `act(x, y)`，用页面坐标换到 1280×720 |

`local()` 用画布的 `getBoundingClientRect` 把 CSS 像素除回舞台像素。画布被 `object-fit: contain` 留空时，点在留白上会得到 `undefined`，这次输入丢掉。

## 2.0 笔：`InkBrush`

`src/core/ink-brush.ts`。`mode`：`'brush'`（大笔）、`'pen'`（枯笔）、`'fly'`（飞白刷）。`effect`：`'mix' | 'sharpen' | 'flyingWhite' | 'wet'`。`size` 必须为正，否则构造抛错。

每收到一个采样点：

```text
vel += (target - pos) * spring
vel *= friction
再把这段拆成 interp 个小步
```

大笔 `spring = 0.6`、`friction = 0.5`、`interp = 8`。参考实现默认插值是 15；这里改小是为了 SwiftShader 上一条笔画能在一帧里盖完。枯笔和飞白刷 `interp = 6`。

每个小步在垂直于速度的方向上铺 8 根笔毫（枯笔 5 根）。每根是 `BrushSegment`：`x0,y0,x1,y1,width,alpha`。坐标经 `quantize`（`src/core/ink-noise.ts`，步长 1/64）。飞白、枯笔、飞白刷随速度丢掉一部分笔毫。`strokeSegments(points, options)` 是同一支笔的同步版本，给 `strokePath` 用。

这支笔**不是**碰撞体。剑扫木桩用折线点到桩心的 `hypot < 56`。枪用 `distanceToSegment < 28`，并且 `Mark.hit` 只允许第一次。弓和墨弹只认 Matter 碰撞。盾的墨环要来袭距离小于 120。这些都是几何，不是武器扫掠体。

## 水刷

`wipe(x, y)`：

1. `world.eraseBridge(x, y, 52)` 改刚体。锁定桥跳过。
2. `ink.wash(x, y, 52)` 只把 `committed` 往白色拉。`locked` 层不动，所以右侧青桥的墨还在。
3. 记一个涟漪，画在 `props` 上，不写进墨层。

人可以站上可擦的桥。桥段被裁掉之后，角色会掉下去。这是 Matter 的结果，不是着色器阈值。

## v0.1 笔画

`quantizeSample`、`startBrush`、`advanceBrush` 在 `src/plugins/brush-model.ts`。`createStrokePlugin` / `createWaterErosionPlugin`（`src/plugins/geometry.ts`）维护笔画存储和侵蚀。命令名是 `DrawStroke`、`EraseStroke`。侵蚀改的是 CPU 折线，再通知 `InkFluid` 重绘。冒烟测试比较的是这条管线的墨量，不是 `InkWash`。

## 确定性边界

笔画坐标、桥的裁切只用四则、`Math.sqrt` / `Math.hypot` 和量化。盾的墨环用常量表 `RING`（含 `0.707`），运行时不调用 `sin` / `cos`。`InkBrush` 的随机是 `InkRng`，种子来自调用方。同一组点、同一 `seed`，`strokeSegments` 的输出应一致，`tests/ink-brush.test.ts` 锁了这一点。

GPU 上的纸纹噪声和反馈着色器不参与碰撞。不要用读回的像素去改刚体。
