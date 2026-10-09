# 03 · 时钟

[目录](./README.md) · [上一章](./02-host-and-render-backend.md) · [下一章](./04-plugin-system.md)

> 本章前半描述十卡仍在用的 Pixi 舞台。文末「横版切片」是已经从 `src/index.ts` 导出、可以调用的 three.js 关卡。叙事宿主能播「易水寒」并走正史 / 野史；玩法模板、`PostStack`、景深和真实 GPU 验收仍未完成。

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
2. `world.step(1/60)`，然后 `drainImpacts()`。弓和墨弹只在这里拿到落点，再把箭形或罐形和几道湿墨写进墨层。
3. 按道具 id 更新马的侧影、舟的船身、旗的墨丝、盾的来袭。

固定步**结束之后**，同一帧调用 `draw()`：`ink.update()`（湿墨扩散一步）、重画 `props` 和 `actor`、`app.render()`。笔画进行中时，扩散发生在显示帧，不塞进 Matter 步，避免一帧 4 个物理步就扩散 4 次。

`pause()` 只暂停。`togglePause()` 翻转，并在暂停时 `endStroke()`，免得湿墨停在半截。`reset()` 和 `replay()` 都走 `restoreCourse`：清桥、卸靶、按本页重新 `mountPhysics`、`ink.clear()`、再 `paintSheet()`。`replay` 会把角色位置和速度放回去；`reset` 会把角色放回出生点。

## 和测试的关系

`tests/` 里的时钟用例驱动的是 `Engine` 和假宿主，不启动 Pixi。`tests/v2-core.test.ts` 直接 `new InkWorld()` 并 `step`，断言落点和墨桥裁切。浏览器里的 RAF 不在 vitest 范围内。

## 横版切片的玩法时钟

`Playfield.step(dt)` 在 `src/core/playfield.ts`，由 `InkView.frame(dt)` 调用。没有 `Matter.Runner`，也没有 three.js 自己的动画循环。数与 `InkStage` 相同：单帧间隔夹到 0.08 秒，固定步 1/60，每帧最多 4 步，第 5 步不会跑，剩余时间丢掉且 `alpha` 为 1。`pausedClock` 为真时跳过物理并把 `alpha` 设为 1。

`step(1/60)` 刚跑完一步时 `alpha` 为 0，画面用上一拍的位置。显示插值是 `sampleBodyLink`：x、y 在 `previous` 与 `current` 之间，z 保持登记时的层深。角色圆的 `inertia` 是 `Infinity`，网格旋转保持 0。断开的竹上段把 `rotation.z` 写成刚体角度。

过场帧时钟在 `CutscenePlayer`。`clock.fps` 为 60 时，`step` 推进一帧；第一拍从 −1 落到 0，所以第 0 帧的提示会触发。实时笔画每帧一个点。跳过（`fastForward`）把刚开始的实时笔画收成一次 `paint`，不按帧补中间点。`StoryStage` 播过场时不调用 `Playfield`。玩法节点只显示目标并等待 `confirm`，不会在同一帧里再推物理。`Playfield.pausedClock` 仍只给上下文丢失和调用方使用。
