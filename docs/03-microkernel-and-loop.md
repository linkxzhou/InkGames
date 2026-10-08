# 03 · 时钟

[目录](./README.md) · [上一章](./02-host-and-render-backend.md) · [下一章](./04-plugin-system.md)

两套时钟都是「渲染帧里累积，固定步追赶」。它们不要接到同一个世界上。

## `Engine`（v0.1）

构造见 `src/core/engine.ts`。默认：

| 选项 | 默认 | 含义 |
|---|---|---|
| `fixedHz` | 60 | `fixedDt = 1/60` |
| `maxStepsPerFrame` | 4 | 一帧最多追 4 个固定步，多出来的时间丢掉 |
| `maxFrameTime` | 0.25 秒 | 切后台回来时把单帧间隔夹到这个值，避免一次补几十步 |

`start()` 向宿主要帧。每帧：夹间隔、累加、跑固定步、再用 `alpha = accumulator / fixedDt` 调各插件的 `render`。

固定步内的阶段顺序是 `FIXED_PHASES`：`input` → `commands` → `geometry` → `collision` → `physics` → `gameplay`。渲染阶段是 `RENDER_PHASES`：`gpu` → `scene` → `ink` → `ui`。插件用 `manifest.fixedPhase` / `renderPhase` 报名，`resolvePlugins` 再按 `before` / `after` 调整。

命令和事件走同一个 `MessageBus`。正在派发时新塞进来的消息，步号是下一步，不会插进当前步。`dispose()` 逆序跑各插件 `ResourceScope` 里登记的清理；清理抛错会收成 `AggregateError`。

状态：`new` → `ready` → `running`，以及 `paused`、`disposed`。`init()` 不是 `new` 就抛错。初始化中途失败会先 `dispose` 再把原因包进 `lastError`。

## `InkStage`（2.0）

`frame(now)` 在 `src/core/ink-stage.ts`。单帧间隔夹到 0.08 秒（比 `Engine` 的 0.25 更紧），累加器按 `1/60` 扣，一帧最多 4 步。步数封顶后剩余累加器直接清掉，避免下一帧接着补。`paused` 时不调用 `fixedStep`，累加器清零。

每一步 `fixedStep` 做这些事：

1. 读 `A`/`D` 调 `world.move`，`W` 调 `world.jump`。
2. `world.step(1/60)`，然后 `drainImpacts()`。弓和墨弹只在这里拿到落点，再 `blot`。
3. 按道具 id 更新马的蹄印、舟的尾迹、旗的墨丝、盾的来袭。
4. 涟漪年龄加一，最多留 24 个。

固定步**结束之后**，同一帧调用 `draw()`：`ink.update()`（湿墨扩散一步）、重画 `props` 和 `actor`、`app.render()`。笔画进行中时，扩散发生在显示帧，不塞进 Matter 步，避免一帧 4 个物理步就扩散 4 次。

`pause()` 只暂停。`togglePause()` 翻转，并在暂停时 `endStroke()`，免得湿墨停在半截。`reset()` 和 `replay()` 都走 `restoreCourse`：清桥、卸靶、按本页重新 `mountPhysics`、`ink.clear()`、再 `paintSheet()`。`replay` 会把角色位置和速度放回去；`reset` 会把角色放回出生点。

## 和测试的关系

`tests/` 里的时钟用例驱动的是 `Engine` 和假宿主，不启动 Pixi。`tests/v2-core.test.ts` 直接 `new InkWorld()` 并 `step`，断言落点和墨桥裁切。浏览器里的 RAF 不在 vitest 范围内。
