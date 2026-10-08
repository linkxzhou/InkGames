# 01 · 范围与能力地图

[目录](./README.md) · [下一章](./02-host-and-render-backend.md)

## 已实现 API（旧原型）

`src/index.ts` 导出微内核、p5 宿主、原生 WebGL2 墨层、CPU 笔画/圆—胶囊碰撞与录制。《墨渡》可画桥/擦桥；《江湖夜行》是应用层自动战斗。**当前没有 PixiJS、Matter.js 宿主或通用横版战斗插件**。

## 设计目标（PixiJS 迁移）

桌面浏览器单 WebGL 画布的横版动作竖切片：PixiJS 负责画面、资源、RenderTexture、Filter/Mesh；Matter.js 首选负责重力、平台、动态角色和受击位移；FSM 控制 Idle→Run→Jump→Attack→Hurt；微内核只调度固定步及依赖；纸/墨/刀光独立视觉插件。Planck.js 是备选，不同时参与同一权威世界。首版先一关、单角色、一个攻击、可破坏墨障与重试，不承诺复杂 ECS、联机、移动端或完整流体。

水刷必须在 CPU 侧更新笔画、物理 collider，再驱动墨迹变化；阈值 shader/流场不能定义碰撞。60 FPS 是目标，必须在明确桌面硬件与真实 GPU 下实测，不因采用 PixiJS 就自动成立。

## 未实现项与实践

未实现 PixiJS 宿主/滤镜、物理适配、FSM、通用 hitbox、资产缓存和跨浏览器恢复。先画“键盘输入→固定步→状态→碰撞→事实事件→Pixi 显示”依赖图；对照 [迁移阶段](../plan/07-microkernel-plugin-plan.md)为每个能力指定所有者和验收。旧代码入口可通过 `./build.sh dev` 检查，但不代表新链路可运行。
