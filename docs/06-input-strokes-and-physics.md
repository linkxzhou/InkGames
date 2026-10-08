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
| 指针（剑、刀） | 拖动：可擦层 `beginStroke` / `addPoint` / `endStroke`，笔刷是该道具的 `slash`，湿墨跟着显示帧扩散 |
| 指针（水刷） | 拖动：`wipe`，半径 52 |
| 指针（其余） | 点下即 `act(x, y)`，用页面坐标换到 1280×720 |

`local()` 用画布的 `getBoundingClientRect` 把 CSS 像素除回舞台像素。画布被 `object-fit: contain` 留空时，点在留白上会得到 `undefined`，这次输入丢掉。

## 2.0 笔：`InkBrushEngine`

`src/core/ink-brush.ts` 逐帧移植 inkEngine 的笔刷，七种模式、八档尺寸、六种墨效都在，取值见 [第 7 章](./07-ink-rendering.md)。它只产生绘制指令（线、点、白底描边矩形），并告诉 `InkWash` 这一帧要不要跑 feedback、倒计时或提交。

```ts
const engine = new InkBrushEngine();
engine.configure({ mode: 'brush', size: 'large', effect: 'mix', blend: 'mix' });
engine.setColor('black');
engine.press(80, 60, 100);                 // 指针坐标、落笔时的随机种子
const step = engine.frame(true, 96, 60, 80, 60); // down、指针、上一指针
// step.ops：本帧笔触；step.force：本帧 feedback 力度；step.commit：是否提交
```

大笔每帧：弹簧阻尼 `vel = (vel + (tip − pos)·spring)·friction`（大笔 0.6/0.5），拆成 `interpSteps + 偏移` 个小步；每个小步按尺寸和随机选分叉类型，画主线和 5/8/12 条分叉。线宽是 `墨量 − 速度`，墨量每帧减 0.05，所以越快越细、越画越干。

这支笔**不是**碰撞体。剑扫木桩用折线点到桩心的 `hypot < 56`。枪用 `distanceToSegment < 28`，并且 `Mark.hit` 只允许第一次。弓和墨弹只认 Matter 碰撞。盾的格挡要来袭距离小于 120。这些都是几何，不是武器扫掠体。

## 水刷

`wipe(x, y)`：

1. `world.eraseBridge(x, y, 52)` 改刚体。锁定桥跳过。
2. 可擦层 `marks.wash(x, y, 52)` 把这一圈的已提交墨往白色拉。锁定桥画在纸层上，所以它的墨还在。

人可以站上可擦的桥。桥段被裁掉之后，角色会掉下去。这是 Matter 的结果，不是着色器阈值。

## v0.1 笔画

`quantizeSample`、`startBrush`、`advanceBrush` 在 `src/plugins/brush-model.ts`。`createStrokePlugin` / `createWaterErosionPlugin`（`src/plugins/geometry.ts`）维护笔画存储和侵蚀。命令名是 `DrawStroke`、`EraseStroke`。侵蚀改的是 CPU 折线，再通知 `InkFluid` 重绘。冒烟测试比较的是这条管线的墨量，不是 `InkWash`。

## 确定性边界

笔画坐标、桥的裁切只用四则、`Math.sqrt` / `Math.hypot` 和量化。笔刷里的角度用 `inkSin` / `inkCos`（多项式），朝向用速度的单位向量，不调用 `Math.sin` / `cos` / `atan2` / `pow`。随机是 p5 兼容的 `P5Random`，种子来自调用方；同一组点、同一 `seed`，绘制指令完全一致，并与 inkEngine 在 `p.randomSeed(seed)` 后的那一笔一致，`tests/ink-brush.test.ts` 锁了这一点。

GPU 上的纸纹噪声和反馈着色器不参与碰撞。不要用读回的像素去改刚体。
