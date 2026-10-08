# 06 · 输入、Matter 候选物理、FSM 与水刷

[目录](./README.md) · [上一章](./05-world-scene-and-assets.md) · [下一章](./07-ink-rendering.md)

## 已实现 API（旧原型）

`DrawStroke`/`EraseStroke`、`createStrokePlugin()`、`createWaterErosionPlugin()` 与 `createPhysicsPlugin()` 已实现 CPU 笔画裁切、圆—胶囊碰撞及球的重力。现有水刷 path 是**离散圆点**，非连续扫掠；当前物理不是 Matter.js，没有摩擦/通用 hurtbox，不能把旧测试当横版角色战斗的证明。

## 2.0 迁移中（仅基础实现）

`InkWorld` 已提供 Matter 固定步、角色五态基础 FSM、墨桥局部裁切与碰撞体替换，以及弓/墨弹共用的 `launchProjectile()` / `drainImpacts()`；投射物首次命中非玩家物体后移除，只把命中坐标交给视觉层。可通过 `./build.sh check` 运行 `tests/v2-core.test.ts` 验证 CPU 路径。**这不等于实现了高速武器 sweep、伤害/格挡、连续水刷、回放或浏览器中的 Pixi 效果**；2.0 阶段门槛以 [当前计划](../plan/10-v2-pixi-matter-ink-game-engine-plan.md) 为准。

## 设计目标

采集键盘、指针与可用的合并事件，转换为固定步的世界坐标意图；FSM 用 Idle/Run/Jump/Attack/Hurt 管理速度、跳跃宽限/缓冲、攻击窗、硬直与受击无敌帧，切换时仅发完成事件供墨效消费，不由动画决定是否命中。首选 Matter.js 固定步世界做角色、地面、平台、摩擦与击退；禁用 Matter Runner，在每一步明确积分与碰撞/回调顺序。Planck.js 仅作形状重建 spike 备选。

**可破坏墨障优先保留 CPU 权威算法**：在本步对水刷扫掠路径求侵蚀区间、验证锁定/干燥规则，得到有稳定 ID 的残段；再撤销/替换相应物理碰撞体、更新宽阶段与接触缓存语义，再执行物理和武器命中。Matter 对固定胶囊链/变宽笔画不必然提供原生等价形状：先测试多个静态细分/多边形近似的厚度、连接处、短碎段与重建成本，验证失败才重选实现或求解器，**不允许仅擦视觉**。权威形状只由 CPU 计算；GPU 不参与胜负。

攻击使用武器轨迹与稳定 ID hurtbox，在固定步对扫掠、相切、同一步水刷/接触先后、重击飞出与多目标去重做测试；物理随机性和不同平台的数值差异使跨机回放成为待验证目标，而非自动保证。

## 未实现项与验收

Matter/FSM 的基础原型已接入，但完整战斗命中/受击、连续水刷、通用 hitbox 与浏览器验收尚未实现。V1/V2 用“画桥→擦断→角色或球落下”“锁定/交叠桥水刷不留隐形平台”“高速刀光与水刷同一步”等回归案例；30/60/144Hz 可控驱动只对比固定步状态，跨浏览器严格一致需额外实测。参见 [plan/07](../plan/07-microkernel-plugin-plan.md)。
