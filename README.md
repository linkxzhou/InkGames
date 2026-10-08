# InkGames：PixiJS 水墨横版动作游戏引擎

> **2.0 迁移进行中**。已加入 PixiJS 8.22.0、Matter.js 0.20.0、单画布效果原型与十卡首页；现有 `src/` 旧能力插件和 `/inkcross/`、`/wuxia/` 仍暂留作回归，**十卡目前不是全部计划效果的完成证明**。设计与实施状态见 [2.0 计划](./plan/10-v2-pixi-matter-ink-game-engine-plan.md)；旧 [07](./plan/07-microkernel-plugin-plan.md) 是历史 v0.1 方案。

## 当前原型

```bash
./build.sh install
./build.sh dev       # / 为十卡效果首页；/inkcross/ 与 /wuxia/ 暂留为旧版演示
./build.sh check     # 类型检查 + 单元测试 + 相对链接
```

统一入口是 `build.sh`（详见 [AGENTS.md](./AGENTS.md)）。现有 `Engine` 的固定步/插件图、CPU 笔画与水刷侵蚀、场景和录制是迁移候选；旧 p5 宿主、原生 WebGL2 墨水管线及现有浏览器测试不代表 Pixi 版已完成。

## 新架构目标

- PixiJS（WebGL）统一掌管画布、显示树、资源、Filter、RenderTexture 和 Mesh；保留内核作为单一固定步驱动，禁用额外的 Pixi ticker/Matter Runner 逻辑时钟。
- Matter.js 是 2.0 物理目标，FSM 管 Idle/Run/Jump/Attack/Hurt；场景、物理、战斗、水墨与通用特效内建于 `src/core/`，`src/plugins/` 专注道具/载具效果组合。
- 水墨融合：墨点/笔迹写离屏 RenderTexture → 模糊 → alpha 阈值/色阶；破墨/溅射、刀光残影、动态背景与空气流场、水纹、蹄迹扬尘为引擎通用效果，十张首页卡片分别展示道具组合。
- CPU 笔画几何/物理 collider 为权威：水刷真实切断墨障、同一步更新碰撞，GPU 仅展示已提交结果。60 FPS 是待真实 GPU 测量的目标，非保证。

## 文档入口

- [2.0 实施计划与十卡示例清单](./plan/10-v2-pixi-matter-ink-game-engine-plan.md)
- [PixiJS 使用/设计文档索引](./docs/README.md)：01..10 区分旧原型接口与新目标
- [旧规划和审计索引](./plan/README.md)：历史方案、许可研究和待复验缺陷
- [旧路线研究附录](./docs/11-references-and-research.md)：其中 p5 结论仅供历史参考，不作 PixiJS 实测证明

`thirdparty/inkField` 的自定义许可禁止复用/公开再分发受限快照和实现；[thirdparty/inkEngine](./thirdparty/inkEngine/LICENSE) 是其可读还原版，书面授权文件不在仓库，未核实移植/再分发范围前不复制其中代码、shader 或演示素材。`thirdparty/inkwash` 为 MIT，移植时需保留许可。正式发布前检查源码、产物与仓库历史，并审计新依赖和素材许可。
