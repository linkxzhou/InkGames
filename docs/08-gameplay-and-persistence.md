# 08 · 横版玩法、VFX 事件与录制

[目录](./README.md) · [上一章](./07-ink-rendering.md) · [下一章](./09-tooling-and-quality.md)

## 已实现 API（旧原型）

`createInkCrossPlugin()` 提供《墨渡》球/目标/墨量基础规则；`createRecorder()`、`parseRecording()`、`createReplay()` 记录和回放固定步命令。现有录制不含物理引擎版本/seed/gap/完整场景；`apps/wuxia/main.ts` 战斗是应用层自动演示，**不是横版战斗公共 API**。

## 设计目标

角色状态机按固定步处理 Idle/Run/Jump/Attack/Hurt，攻击窗决定武器命中与击退，伤害/胜负只读 CPU 事实。刀光、飞墨、屏幕震动和音频订阅命中/状态切换事实；Pixi Container 管显示和 UI，镜头抖动不修改物理位置。输入到状态、碰撞、伤害、触发、胜负定义固定先后；暂停与重试销毁/重建 Pixi 资源及 Matter body，避免旧接触回调泄漏。浏览器音频仍需用户交互后启动。

升级录制 schema 时保存场景、插件/物理版本与配置、角色初态、量化输入、命令顺序与暂停/gap；旧版本录制要么显式迁移要么拒绝，不能偷偷在新 Matter 世界重放并声称等价。逻辑状态哈希不包含 GPU 特效；跨浏览器数值确定性先测后承诺。

## 未实现项与验收

FSM、战斗 hitbox、VFX 绑定、版本化存档和新录制格式均未实现。P2 起先在无渲染测试中证明“输入→攻击命中→Hurt→击退→胜负”；P5 验证暂停、重试、保存/重放和 UI/音频不影响碰撞。同一命中事件只能触发一次墨效、一次伤害。
