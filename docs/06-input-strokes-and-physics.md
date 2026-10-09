# 06 · 输入、笔和碰撞

[目录](./README.md) · [上一章](./05-world-scene-and-assets.md) · [下一章](./07-ink-rendering.md)

权威几何在 CPU。像素着色器不决定能不能站上去。旧的 Pixi 十卡输入、v0.1 命令录制与 `brush-model` / `geometry` / `physics` 插件都已随旧栈删除。

## 输入

切片页（`apps/scroll/`）自己监听键盘与指针，转成 `Playfield` 的调用：

| 输入 | 效果 |
|---|---|
| `A` / `D`（或左右箭头） | 固定步里 `move(-1)` / `move(1)`，都按住则不动 |
| `W`（或上箭头） | `jump()`，仅当 `Playfield` 认为角色着地 |
| `Space` | 攻击：设置扫掠区间并触发 `attack()` |
| 指针 | `InkView.pointer(clientX, clientY)` 把 CSS 坐标经 `Raycaster` 打到 z = 0 平面，得到世界像素坐标 |

`InkView.pointer` 用画布的 `getBoundingClientRect` 换到 NDC，再用 `CameraRig.active` 发一条射线与地面平面求交。画布被 `object-fit: contain` 留空时点在留白上会返回 `undefined`，这次输入丢掉。

`Playfield` 的输入只是状态（方向、是否跳跃、是否攻击），推进发生在固定步里；指针坐标只用于水刷与墨面绘制，不参与碰撞求解。

## 笔刷：`InkBrushEngine`

`src/core/ink-brush.ts` 逐帧移植 inkEngine 的笔刷：七种模式、八档尺寸、六种墨效、混色，输出与渲染库无关的 `InkDrawOp`（线、点、白底描边矩形）与 `InkShaderState`。它只告诉宿主这一帧要不要跑 feedback、倒计时或提交；真正画到纹理上是 `InkSurface` 的事。

```ts
import { InkBrushEngine } from '@inkgames/engine';

const engine = new InkBrushEngine();
engine.configure({ mode: 'brush', size: 'large', effect: 'mix', blend: 'mix' });
```

确定性约束：权威几何（笔画、侵蚀、碰撞）只用四则运算、`Math.sqrt` 和量化坐标，禁止 `Math.sin/cos/atan2/pow` 等超越函数；`ink-random.ts` 提供 LCG 随机与 4 层倍频噪声，以及多项式 `inkSin` / `inkCos`。同一 `seed` 得到同一批线段，`tests/ink-brush.test.ts` 锁的就是这些 CPU 笔触数据，不锁 GPU 图像。

## 笔画的三条来源

| 来源 | 说明 |
|---|---|
| 道具预设（`{ prop, parts?, placement }`） | 复用 `paintProp`，与文档里的道具语义一致 |
| 内联路径（`{ brush: '道具.部件', path, speed }`） | 走 `actionStroke` 取该部件的笔刷参数，再用 `samplePolyline` 按 `speed` 采样；`catmull` 会先插值 |
| 录制（`{ recording }`） | **未实现**：v0.1 `recording.ts` 已删除，2.0 新格式（G-04 `inkgames.ink-recording`）未做；`resolveStrokeCue` 遇到 `recording` 返回空数组 |

`mode: 'live'` 逐帧推进（观众看到「画」的过程），`mode: 'instant'` 一帧内画完（背景）。`StoryStage.paintPulses` 强制**同一墨面只有一个活动笔画**：同层重复 `begin`、游离 `point` / `end`、活动笔画期间插入 `instant` 都会被拒绝并计入 `rejectedPulses`，不会静默串色或串路径。`end` 会 `update()` 提交末点，`endOfStroke` 为真时才应用 `finish`。

## 碰撞

- 地面：折线每段一个静态 `Bodies.fromVertices`，厚度 28。地面网格的 Z 起伏只是画法，不参与碰撞。
- 单侧站立的坡由 `Footing` 结果表达，角色落地、跳跃、受击状态机在固定步里推进。
- 击退与扫掠：命中是**扫掠体**，不是单点距离；`SweepHit` 描述命中区间。`KNOCKBACK_CAP` / `KNOCKBACK_LOCK` 限制连续击退。
- 砍竹：`Playfield.cutBamboo` 把静态竿换成静态根 + 动态上段，`BambooView` 负责摆动与最多 `DROPLET_CAP`（256）个墨滴，墨滴不写回地面纹理。
- 水刷：先改 CPU 碰撞几何（擦桥），再做视觉减淡；锁定笔画不走这条擦除。

Matter 跨版本不是逐位确定，玩法回放锁定 `matter-js@0.20.0`；不承诺跨浏览器逐位相同。
