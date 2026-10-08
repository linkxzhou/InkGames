# 03 · 微内核、固定步与唯一时钟

[目录](./README.md) · [上一章](./02-host-and-render-backend.md) · [下一章](./04-plugin-system.md)

## 已实现 API（旧原型可复用）

`Engine`、`HostPort`、插件拓扑与资源作用域不依赖 p5；`Engine` 自己管理 RAF，固定阶段 `input → commands → geometry → collision → physics → gameplay`，渲染阶段 `gpu → scene → ink → ui`。宿主上下文丢失时暂停；恢复回调不自动重建资源。下例只运行无图形逻辑，**不包含 Pixi**：

```ts
import { Engine } from '../src/index';
import type { HostPort } from '../src/index';
const host: HostPort = {
  now: () => performance.now(),
  requestFrame: callback => requestAnimationFrame(callback),
  cancelFrame: handle => cancelAnimationFrame(handle),
};
const engine = new Engine({ host, fixedHz: 60 });
await engine.init();
engine.start();
// 离开页面时：await engine.dispose();
```

## 设计目标（PixiJS/Matter.js）

保留唯一的内核 RAF 与固定步；关闭 Pixi 的自动帧循环，**不启动** Matter Runner。每个固定步以显式 `dt` 更新 FSM/输入、权威笔画/collider，再调用物理求解、命中和规则；显示帧才更新 Pixi DisplayObject、滤镜 uniform 与离屏画面。不得把 Pixi ticker `deltaTime` 当权威物理步长，也不得在 `render()` 改写碰撞状态。角色可用渲染插值，不改变同一步命中结果。

时间钳制、最大补步数、后台暂停和 `gap` 的记录策略沿用现有内核约束；现有录制只记录已消费命令，**尚未序列化 gap/版本/物理世界**。Matter 接触回调的排序、重复 hit 和攻击/水刷优先级要转换为稳定 ID 的事实事件并写单测；不保证天然跨机逐位一致。

## 未实现项与验收

Pixi 驱动接线、Matter 固定步接入、FSM 调度、恢复后重新渲染均未实现。用 `tests/core-loop.test.ts` 检查旧时钟行为；迁移时新增“每帧仅渲染一次、每步物理仅调用一次、双 ticker 禁止、暂停不产生半步”的验证。旧 `./build.sh check` 通过仅说明旧原型逻辑基线。
