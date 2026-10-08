# 04 · 插件协议与适配边界

[目录](./README.md) · [上一章](./03-microkernel-and-loop.md) · [下一章](./05-world-scene-and-assets.md)

## 已实现 API（旧原型可复用）

`EnginePlugin.manifest` 声明 `requires/provides` 与版本，`Engine` 在构造时解析依赖、拓扑排序、拒绝重复 provider；初始化失败会回滚资源。`ctx.get()` 只能在合法生命周期读取已声明依赖。可在 `tests/core-plugins.test.ts` 观察已有测试，`./build.sh check` 检查当前原型；现有 p5/原生 GL 插件不是 Pixi 插件。

## 2.0 已实现的最小道具配置

`ITEM_PRESETS` 的十个条目各有 `id/action/effects/accent`，`getItemPreset(id)` 拒绝未知道具。`InkStage` 根据 `action` 组合 `InkWorld` 和 `InkEffects`：枪的直刺与刀剑弧线、弓/墨弹真实 Matter 投射物、战马蹄迹、旌旗风向与舟尾涟漪已区别处理。`tests/v2-core.test.ts` 验证配置和投射物首次命中/越界回收。**该配置并不是完备的 `itemId/version/requiresEffects/config` 插件协议**，枪/剑/刀的武器物理命中、旗帜 Mesh 及真正资源租约仍未实现。

## 2.0 设计目标与未实现项

场景、Pixi 宿主、Matter 权威世界和通用水墨效果属于内建 core；道具插件声明 `itemId/version/requiresEffects/config`，组合核心效果并明确生命周期、依赖冲突与资源租约。道具效果不得另起物理世界或 RAF，卸载墨色后保留权威碰撞。旧 `EnginePlugin.manifest` 仍是 p5 原型的能力插件协议，不适用于 2.0 道具。真正的道具安装/卸载 API、效果依赖校验、资源回滚及多实例隔离测试仍待实现；验收以 [2.0 计划](../plan/10-v2-pixi-matter-ink-game-engine-plan.md) 为准。
