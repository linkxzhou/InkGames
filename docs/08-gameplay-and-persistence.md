# 08 · 玩法与录制

[目录](./README.md) · [上一章](./07-ink-rendering.md) · [下一章](./09-tooling-and-quality.md)

十卡是同一张 1280×720 的纸，加上各自的一句交互。开场都会画远山、近山和地面（锁定）。人物是 `Graphics` 线稿，每帧跟 `player.position` 走，不进墨层。

| 页 | 动作 | 实际发生的事 |
|---|---|---|
| 剑 `sword` | `swing` | 拖动写飞白。空格或按钮挥一条飞白弧。弧上有点距木桩 `(900, 540)` 小于 56 才在桩上 `blot`。挥空没有溅墨。 |
| 刀 `blade` | `swing` | 拖动是湿笔。开场有青、朱两团。挥刀用更宽的湿笔扫过，重叠处 `min` 压色。 |
| 枪 `spear` | `thrust` | 点击定落点，枯笔直线。三个靶心只在第一次被线段擦到（距离 < 28）时记朱砂，并标 `hit`。 |
| 弓 `bow` | `projectile` | 点击是瞄准点。箭体飞在 Matter 里，撞上靶或地面才晕开。飞行途中不画墨。 |
| 盾 `shield` | `guard` | 约 30 步后从右侧生成来袭。距离 ≥ 120 时空格无效，不画环。贴身格挡才用常量表画一圈墨点并移除来袭。没格开会 `hurt()`，仍然不画环。 |
| 马 `war-horse` | `gallop` | 空格切换奔跑。只有奔跑时每 8 步在蹄下 `blot`，尘点画在 `props` 上。停下不再加新印。 |
| 旗 `banner` | `wind` | 风向在东、西、停之间转。旗面是 `props` 上的折线，另外每 18 步在天上写一条短墨丝。 |
| 墨弹 `ink-bomb` | `blast` | 和弓共用投射物。命中后三团湿墨（黑、朱、青）叠在落点。未命中不伪造爆炸。 |
| 水刷 `water-brush` | `erase` | 角色出生在左桥上方。拖动同时裁刚体和减淡可擦墨。右桥锁定。 |
| 舟 `boat` | `wake` | 空格开停。走动时每 10 步在船尾 `blot` 湿墨，涟漪画在 `props`。停下不再添尾迹。 |

`replay()` 重画本页开场墨，角色留在原地。`reset()` 连角色一起放回出生点，并关掉马、舟和风。

没有伤害数值、连击或关卡切换。状态文字来自 `onStatus`，页面把它写进 `#status`。

## 录制

`createRecorder`、`createReplay`、`parseRecording`（`src/plugins/recording.ts`）记录的是 v0.1 的命令流，给 `Engine` 用。`InkStage` 没有把按键和 `strokePath` 写成同一份 JSON，也不能重放 inkEngine 的 `mp` / `md` / `mr`。

要复现一条 2.0 笔画，调用方自己保存 `BrushPoint[]` 和 `InkStrokeStyle.seed`，再调用 `strokePath`。`tests/ink-brush.test.ts` 用这个办法锁笔毫，不锁 GPU 图像。
