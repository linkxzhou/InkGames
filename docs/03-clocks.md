# 03 · 时钟

[目录](./README.md) · [上一章](./02-host-and-render-backend.md) · [下一章](./04-plugin-system.md)

**只剩两套时钟**，都从 `src/core/fixed-clock.ts` 导出：玩法固定步（`advanceFixedClock`）与过场帧时钟（`advanceFrameClock`）。旧的 `Engine` 微内核时钟已随 `engine.ts` 删除。

## 玩法固定步：`advanceFixedClock`

`Playfield.step(dt)` 在 `src/core/playfield.ts`，由 `InkView.frame(dt)` 调用。没有 `Matter.Runner`，也没有 three.js 自己的动画循环。

| 常数 | 值 | 含义 |
|---|---|---|
| `FIXED_DT` | 1/60 | 固定步长 |
| `MAX_FRAME_SEC` | 0.08 | 单帧间隔夹到 0.08 秒；切后台回来时不会一次补几十步 |
| `MAX_FIXED_STEPS` | 4 | 一帧最多追 4 步，第 5 步不跑，剩余时间丢掉且 `alpha` 为 1 |

`step(1/60)` 刚跑完一步时 `alpha` 为 0，画面用上一拍的位置。显示插值是 `sampleBodyLink`：x、y 在 `previous` 与 `current` 之间，z 保持登记时的层深。角色圆的 `inertia` 是 `Infinity`，网格旋转保持 0。断开的竹上段把 `rotation.z` 写成刚体角度。`pausedClock` 为真时跳过物理并把 `alpha` 设为 1。

每一步 `stepOnce` 会读输入、推进 Matter 世界、处理击退与扫掠、更新竹的断口；固定步结束后 `InkView.frame` 再调 `TerrainSeep.update`、`InkSurface.update`、`CameraRig.follow`，最后 `render`。

## 过场帧时钟：`advanceFrameClock`

过场以 60 Hz 逻辑帧为准，但**按真实经过时间追赶**，与玩法固定步不同：

| 常数 | 值 | 含义 |
|---|---|---|
| `FRAME_CLOCK_MAX_GAP_SEC` | 2 | 单帧间隔上限 |
| `FRAME_CLOCK_MAX_STEPS` | 90 | 每渲染帧最多追赶的工作预算 |

它返回 `{ frame, carry, steps, dropped }`。关键点是 `carry`：60 Hz 的一帧约 16.67 ms，显示器给的回调常常略低，若直接取整会有一半回调算 0 步，成片就会慢到约 **0.5 倍速**（这是 2026-10-09 实测到的真实缺陷）。携带小数余数后，无头 SwiftShader 下 8.0 秒墙钟推进 8 帧秒（ratio 1.000）。只有当单帧间隔超过 2 秒或需要的步数超过 90 时才丢时间并把 `dropped` 置真。

这样慢机只丢渲染帧，不会把 90 秒的成片拉长；`/history/` 的状态栏会在发生丢弃时显示计数。

## 过场播放器：`CutscenePlayer`

`clock.fps` 为 60 时，`step()` 推进一帧；第一拍从 −1 落到 0，所以第 0 帧的提示会触发。实时笔画每帧一个点，`end` 脉冲带 `endOfStroke` 标记，只有它才应用 `finish`（flow / distort / metallic）。

跳过（`fastForward`）把刚开始的实时笔画收成一次 `instant` 画完，**不按帧补中间点，也不重放跨越的效果**，因此跳过结果仍不等于顺播；安全点重放（G-08）未做，这是待办。

`StoryStage` 播过场时不调用 `Playfield`。玩法节点只显示目标并等待 `confirm`，不会在同一帧里再推物理。

## 和测试的关系

`tests/frame-clock.test.ts` 覆盖两个时钟：固定步的四步封顶与夹取、帧钟的墙钟追赶、进位而非取整、抖动平均后精确、到片尾夹取与不倒退、超预算丢弃并标记。`tests/playfield.test.ts`、`tests/cutscene-pulses.test.ts` 分别在 CPU 上驱动 `Playfield` 与 `CutscenePlayer`，都不启动 GL。浏览器里的 RAF 不在 vitest 范围内。
