# 05 · 场景与世界

[目录](./README.md) · [上一章](./04-plugin-system.md) · [下一章](./06-input-strokes-and-physics.md)

> 本章前半描述十卡仍在用的 Pixi 舞台。文末「横版切片」是已经从 `src/index.ts` 导出、可以调用的 three.js 关卡。叙事宿主能播「易水寒」并走正史 / 野史；玩法模板、`PostStack`、景深和真实 GPU 验收仍未完成。

## `InkWorld`：2.0 的权威场景

类在 `src/core/ink-world.ts`。构造时：

- `Matter.Engine.create({ enableSleeping: false })`，`gravity.y = 1`。
- 玩家是圆，半径 18，初始 `(180, 135)`，`friction: 0.6`，`restitution: 0.05`，标签 `'player'`。
- 地面矩形中心 `(640, 630)`、宽 1280、高 50，静态。
- 左右墙在 x=25 和 x=1255，挡住出画。

没有调用 `Matter.Runner`。调用方每固定步执行一次 `step(dt)`，内部是 `MatterEngine.update(this.physics, dt * 1000)`。

状态机 `state`：`'idle' | 'run' | 'jump' | 'attack' | 'hurt'`。`move(direction)` 把水平速度设成 `direction * 5`（direction 夹在 -1 到 1）。`jump()` 只在 `grounded` 时把竖直速度设成 -12：人在地面附近（y ≥ 585 且竖直速度很小），或站在某段墨桥顶上。`attack()` 锁定 14 步，`hurt()` 锁定 22 步；锁定期间不根据速度重写状态。

### 墨桥

`addBridge(x, y, width, locked?)` 返回 id，放进 `platforms` 和 `bridges`。几何是水平矩形，高 12，静态。`eraseBridge(x, y, radius)` 跳过 `locked`。竖直距离超出 `radius + 6` 的段保留；否则用圆在该高度的水平弦长裁掉一段，短于 3 像素的残段丢掉，其余换成新的矩形。返回被改过的 id。`clearBridges()` 卸掉全部桥体和映射，重置时用。

水刷页只有两座桥：`(300, 500, 420)` 可擦，`(920, 450, 240)` 锁定。别的道具页不放桥，避免每页都是同一段墨。

### 投射物

`launchProjectile(fromX, fromY, toX, toY)` 加一个半径 8 的圆，`collisionFilter.group = -1`（不撞玩家），速度指向目标、速率 14，竖直再减 3。`collisionStart` 里若打到非玩家物体，记下 `{ id, x, y }` 并立刻移除弹体。`drainImpacts()` 把队列交出去并清空。`step` 里年龄达到 150，或位置超出大约 `[-50, 1330] × [-50, 770]`，弹体被删掉且**不**产生命中，画面上也就没有墨晕。

`addBody` / `removeBody` 给弓靶和盾的来袭用。弓靶是静态圆 `(1040, 480, r=36)`。来袭从 x=1180 以速度 -7 飞向玩家。

`dispose()` 卸碰撞监听并清空复合。重复调用要由舞台保证只走一次；世界本身没有 disposed 旗标。

## v0.1 场景服务

`createScenePlugin`、`createCameraPlugin`、`createInputPlugin`、`createPointerPlugin` 在 `src/plugins/world.ts`。`parseSceneJSON` / `loadSceneJSON`（`src/plugins/scene-json.ts`）读关卡 JSON。`Scene2D`、`Camera2D`、`Rect`、`SceneMarker` 等类型从 `src/plugins/tokens.ts` 经 `src/index.ts` 导出。

这些服务不描述十卡舞台。十卡的远山、近山、地面是 `InkStage.paintSheet` 里写进 `InkWash` 的折线，锁定在墨层上，没有对应的 Matter 体（地面矩形才是脚底下的碰撞）。

## 横版切片：`Playfield`

`Playfield` 在 `src/core/playfield.ts`。单位与 `InkWorld` 相同：像素、Y 向下、`gravity.y = 1`。`InkWorld` 未改，十卡和 `tests/v2-core.test.ts` 仍用它。

`addPolyline` 按折线每段做 `Bodies.fromVertices`，厚度 28，静态，标签 `ground`。地面网格的 Z 起伏只在 `InkView` 里画，不写进 Matter。远景是贴着 `InkSurface.texture` 的平面。角色圆显示在 z = 40，脚的 x、y 来自刚体。

`CameraRig.follow` 每帧把焦点拉近 5%，再夹进关卡包围盒；关卡比视口短时居中。十卡 `InkStage` 的 ±48×36 限制留在那条舞台上，切片不用它。坐标仍是像素，没有改成米。过场镜头键是相对纸心的偏移，`x: 0` 表示居中。缓动 `inOutSine` 用平滑步多项式 `u*u*(3-2*u)`，不用 `Math.sin`。字幕平面放在 z = 1，盖住纸面，像素和纸对齐；放在 z = 120 会被透视放大。景深键记在姿态上，没有散景 pass。
