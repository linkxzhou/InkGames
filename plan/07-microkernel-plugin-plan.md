# 07 · PixiJS（WebGL）水墨横版动作引擎迁移基线

> **历史 v0.1 迁移方案，已被 [2.0 实施计划](./10-v2-pixi-matter-ink-game-engine-plan.md) 替代**；下文的微内核/能力插件分层、《墨渡》单关范围和 P0–P5 阶段不再是现行目标。旧 p5/WebGL2 实施记录及遗留缺陷参阅 [08](./08-inkfield-informed-optimization-plan.md)、[09](./09-src-contract-gap-and-apps-rework-plan.md)；当前可运行接口以 `src/index.ts` 为准。许可约束见 [工程规范](../AGENTS.md)。

## 状态与范围

- [x] 旧原型：`Engine` 固定步/插件图、CPU 笔画侵蚀/圆—胶囊物理、p5/原生 WebGL2 两个演示；**不属于 PixiJS 实现**。
- [ ] PixiJS WebGL 宿主与显示树、资源生命周期、单一帧驱动。
- [ ] 独立于墨插件的横版场景/碰撞/角色运动与状态机。
- [ ] Matter.js 物理适配、可破坏墨障 collider 同步；Planck.js 只作为经 spike 比较后的备选，不同时装两套权威求解器。
- [ ] 离屏墨迹融合、纸纹/刀光、动作特效及真实 GPU 性能验收。
- [ ] 录制/场景协议迁移、浏览器与许可审计、可交付示例。

**v0.1 竖切片**：单画布横版场景，角色 Idle→Run→Jump→Attack→Hurt；平台、重力、攻击命中和受击；画墨障/用水刷切断并影响物理；纸纹与墨迹融合、攻击刀光；可暂停、重试与逻辑录制。60 FPS 是目标，不是保证。移动端、全流体模拟、复杂 ECS、联机和跨平台逐位物理确定性不属于本阶段承诺。

## 权威层与显示层

```text
DOM/键盘/Pointer → 每固定步输入 → 状态机/技能意图
                    → CPU 笔画裁切与几何提交 → 替换 Matter collider
                    → Matter 固定步 → 命中/游戏规则 → 事实事件
                    → PixiJS Container（场景/角色/特效/UI）
                    → 墨迹 RenderTexture → blur → alpha threshold/color ramp → 纸张合成
```

保留 `src/core` 微内核及插件依赖图；替换 p5 host 和原生 WebGL2 全局画布 pass 的所有权。一个时间驱动：保留现有 `Engine` 的 RAF/固定步时，由它每帧显式更新 Pixi 显示树并渲染，禁用 Pixi 自动 ticker；不得同时让 Matter Runner 或 Pixi ticker 推进权威世界。每步先提交已批准的墨障几何与碰撞替换，再 `Matter.Engine.update`；状态机判定时序和 hitbox/受击优先级用测试固定。Matter 的不同版本/平台及接触排序并无自动跨机确定性保证：记录引擎版本、创建顺序、步输入与状态哈希；跨平台一致须单独证明，不能复用旧自研物理的承诺。

PixiJS `Application`/Renderer 负责唯一 WebGL 画布、显示树、RenderTexture/Filter/Mesh 和 context 恢复；插件只持有租约，不能在 Pixi context 外随意操作原生 GL。先用 Pixi 管理的资源及 Filter 完成效果；确需低级 pass 时先验证版本支持的扩展点和渲染状态，不直接复用旧 `withGLState()` 假设。CPU 世界坐标与 Pixi 显示坐标分离，相机仅影响视图，输入按画布 DOM 尺寸、DPR 与相机逆变换映射。context lost 时停止权威步并验证重建后的资源/RenderTexture/滤镜；恢复通知本身不算重建完成。

## 水墨视觉路线（非权威）

1. 优先做最小原型：将本帧墨粒/笔迹绘到受控分辨率的离屏 RenderTexture；对**离屏结果**按顺序做模糊与 alpha 阈值/色阶 Filter，再作为 Sprite 合成。不要把粒子与整个场景一起模糊；渲染目标不得边读边写，换帧/resize/destroy 释放旧纹理。
2. 阈值 shader 从模糊后的 alpha 用 `smoothstep` 形成融合边缘，中心/边缘通过色阶映射；输入需检查预乘 alpha、透明边缘和滤镜 padding，避免黑边与裁切。示例中的 `discard` 仅是思路，不保证性能或兼容；大范围全屏高斯模糊 + 多 RenderTexture **不能承诺高性能**，先测分辨率、滤镜半径、draw calls、GPU 占用和视觉质量。
3. 纸张底色/纹理先做有授权的静态材质，墨迹在**指定图层**测试 multiply 的预乘/透明结果；角色/UI 不盲目全部 multiply。墨障视觉只消费 CPU 几何已提交的增删事实：锁定或没命中时不能仅洗掉墨层，交叠笔画须按 ID/遮罩对账。
4. 刀光先用可维护的 Pixi Mesh 轨迹（曲线采样后构网格），用独立来源的噪声纹理做飞白、速度控制干湿并短暂留痕；不要预设旧版 `SimpleRope` 在目标 Pixi 版本可用。流场、植物网格与背景雾先列延后实验；shader 驱动的画面风和 CPU 粒子受力分离，不能让 GPU 噪声改变命中判定。
5. 现有 R16F 湿墨/压力 pass 属 p5+原生 GL **旧原型**，不照搬为 Pixi 管线；只有证明 Pixi 扩展点、格式兼容、资源所有权和性能后才考虑进阶流体。

## 里程碑与准入

| 阶段 | 实施范围 | 完成证据 |
|---|---|---|
| P0 基线与迁移审计 | 冻结 PixiJS 大版本和 Matter.js 版本/许可；保留旧样例可用；列旧 API 的去留与场景/录制迁移表 | 依赖锁版本、评估记录、旧测试基线和许可清单；不声称已迁移 |
| P1 Pixi 宿主 | 单 WebGL 画布、唯一 RAF、相机/坐标、资源清理、resize/context lost | 空场景与无墨场景可运行；浏览器截图/异常/资源测试 |
| P2 横版动作 | Matter.js adapter、平台/角色、FSM 与 hitbox、命中/受击 | 固定步行为测试；同一步事件先后和暂停/重试测试；禁用 Runner 第二时钟 |
| P3 侵蚀与碰撞 | 笔画裁切、动态 collider replace、物理接触处理、视觉事实事件 | 画桥→水刷切桥→角色/球落下；锁定/重叠/高速水刷无隐形平台；回放记录版本 |
| P4 水墨视觉 | RenderTexture 模糊阈值、纸纹/混合、刀光 Mesh/飞白 | 显示与 CPU 缺口对齐、无滤镜边框/黑边；固定桌面真实 GPU 记录帧时与显存 |
| P5 交付 | 示例、docs、打包与第三方审核 | `./build.sh check`、独立浏览器验收、桌面兼容矩阵；受限快照及 Git 历史审计 |

每阶段记录 `[x]/[~]/[ ]` 和证据链接；旧 `plan/09` 墨量对账偏差是 P3/P4 必复验风险，不因换渲染器自动消失。`./build.sh browser` 的现有 p5 冒烟只能证明旧版行为，迁移后须更新断言。SwiftShader 可做功能正确性，不代表真实 GPU 60 FPS。公开发布前 `thirdparty/inkField` 受限内容不得进入公开仓库或产物；inkwash MIT、PixiJS/Matter/可选滤镜的**实际安装版本与传递依赖**需逐项审查并更新 `THIRD_PARTY_NOTICES.md`。

## 决策待验证

- PixiJS 固定版本下 WebGL-only 初始化、Filter/RenderTexture 的可用 API、上下文丢失后的重建能力；Shader 语法与绑定以锁定版本实测为准。
- Matter.js 胶囊链/可破坏墨障的形状映射和重建成本；若不合适评估 Planck.js，不能靠视觉遮罩代替权威 collider。
- 锁定/干燥墨障能否擦除、交叠笔画如何分层、墨迹混合模式与 UI 叠层规则。
- 可接受帧预算/目标设备、截屏容差、资产许可及最低浏览器版本；目标帧率必须以实机数据确认。
