# InkGames 文档 · PixiJS 迁移路线

> **状态**：以下 01..10 是先前的 v0.1 迁移指南，插件/核心划分和单关范围尚未按 2.0 重写；新目标与实施证据以 [InkGames 2.0 计划](../plan/10-v2-pixi-matter-ink-game-engine-plan.md) 为准。PixiJS/Matter.js 已安装，首页及十条效果路由已有初步实现，旧 p5/WebGL2 页面暂留；新页面尚未完成浏览器验收。各章「已实现」仅指旧原型，不指 2.0 完成；历史资料见 [plan 索引](../plan/README.md)。

| 章节 | 新目标与边界 |
|---|---|
| [01 范围](./01-scope-and-engine-map.md) | 横版动作竖切片、权威逻辑和显示职责 |
| [02 Pixi 宿主](./02-host-and-render-backend.md) | 单 WebGL 画布、时钟、坐标、资源与恢复 |
| [03 固定步](./03-microkernel-and-loop.md) | 复用微内核、避免 Pixi/Matter 双循环 |
| [04 插件](./04-plugin-system.md) | manifest、Pixi/物理/水墨适配与生命周期 |
| [05 场景](./05-world-scene-and-assets.md) | CPU 世界与 Pixi 显示树分离，资源/相机 |
| [06 输入物理](./06-input-strokes-and-physics.md) | Matter 候选、FSM、攻击、水刷与碰撞事务 |
| [07 水墨表现](./07-ink-rendering.md) | RenderTexture 融合、纸张、Mesh 刀光、流场 |
| [08 玩法录制](./08-gameplay-and-persistence.md) | 角色规则、VFX 事件与录制版本 |
| [09 验证](./09-tooling-and-quality.md) | CPU/视觉一致性与真实 GPU 性能 |
| [10 交付](./10-shipping-and-ecosystem.md) | 竖切片、依赖及许可证验收 |
| [11 旧研究附录](./11-references-and-research.md) | 2026-10-08 p5/GL 等资料；保留时间与验证边界 |

阅读时先看 [当前代码入口](../src/index.ts)，用 `./build.sh check` 检查当前源码，用 `./build.sh dev` 打开十卡首页（旧演示仍可通过旧路由进入）。**不能**把旧测试、旧截图或研究中的效果当 Pixi 新方案的实现证据。当前首个门槛是 [2.0 V0](../plan/10-v2-pixi-matter-ink-game-engine-plan.md) 的参考版授权核验与 Pixi/Matter 技术 spike，尚未完成。
