# 05 · CPU 世界、Pixi 显示树、相机与资源

[目录](./README.md) · [上一章](./04-plugin-system.md) · [下一章](./06-input-strokes-and-physics.md)

## 已实现 API（旧原型）

`createScenePlugin()`、`createCameraPlugin()`、`createInputPlugin()`、`parseSceneJSON()` 与 `loadSceneJSON()` 提供圆体/笔画的最小场景格式；加载前会解析校验，但写入不是事务回滚。可对照 [旧墨渡场景测试数据](../tests/fixtures/inkcross-scene.json)；目前没有通用角色组件/异步资源管理或 Pixi 显示树。

## 设计目标

CPU 关卡持有稳定实体 ID、状态机、碰撞/物理与墨障数据；Pixi Container 层级只持显示对象和绘制顺序，绝不作为权威 transform。每固定步将物理位置写回世界快照，渲染阶段从快照/插值驱动角色、平台、背景与墨障显示；相机统一给输入逆变换、世界图层和墨层，UI 仍在屏幕空间。背景视差不能带动 collider。

Pixi Assets 作为资源加载/缓存候选；按实际 Pixi 版本确认全局缓存行为，以场景租约记录素材/Filter/RenderTexture 的引用和销毁边界。纸张纹理/刀光噪声图须有来源和许可，丢 context/resize 时纹理重建并能回到有效状态。场景 JSON 先保留 v1 并引入新 schema 版本，增补角色/攻击/材质引用前制定迁移和加载失败回滚，不能把旧 `circles/strokes/goal` 解析器宣称能读新结构。

## 未实现项与验收

实体映射、Pixi 场景适配（显示对象）、资源租约、事务切关和新 schema 均未实现。测试同一个 world 点在相机 pan/zoom、CSS 缩放/DPR/resize 下输入与渲染对齐，连切关卡后没有漏掉 Pixi 对象或物理 body。基础无墨场景必须可运行。
