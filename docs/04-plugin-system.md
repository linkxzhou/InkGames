# 04 · 插件协议与适配边界

[目录](./README.md) · [上一章](./03-microkernel-and-loop.md) · [下一章](./05-world-scene-and-assets.md)

## 已实现 API（旧原型可复用）

`EnginePlugin.manifest` 声明 `requires/provides` 与版本，`Engine` 在构造时解析依赖、拓扑排序、拒绝重复 provider；初始化失败会回滚资源。`ctx.get()` 只能在合法生命周期读取已声明依赖。可在 `tests/core-plugins.test.ts` 观察已有测试，`./build.sh check` 检查当前原型；现有 p5/原生 GL 插件不是 Pixi 插件。

## 设计目标

宿主/渲染插件拥有 Pixi Application/Renderer，向场景与水墨插件提供受控显示/离屏能力；场景插件拥有 CPU entity/相机，物理插件封装 Matter 世界，FSM/战斗订阅 CPU 意图与碰撞事实；RenderTexture/Filter/Mesh 视觉插件仅消费已提交结果。插件服务提供相同版本契约并明确资源所有者，销毁时先释放 GPU 图层/滤镜/纹理，再销毁 Pixi 应用；物理世界不能由 Shader 或滤镜回读决定。Pixi `extensions` 若是全局注册，不直接作为每个 Engine 的隔离插件图。

物理候选 Planck.js 与 Matter.js 只能择一提供权威 `PhysicsToken`，并对胶囊链/碎段重建、固定步和接触事件做行为比较；不要写两个同时启动的 runner。资源卸载和 context lost 分别验证，多实例启动/清理不能串扰。

## 未实现项与实践

Pixi 渲染服务、物理服务、战斗/FSM token、运行时热插拔都未实现。先为新服务编写 manifest/失败回滚测试；迁移前不要在示例里实例化不存在的 `createPixi*Plugin()`。API 上线时同步 `src/index.ts`、对应章节和 [plan/07](../plan/07-microkernel-plugin-plan.md) 阶段状态。
