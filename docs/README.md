# InkGames 文档

这些章节描述仓库里**已经能跑的代码**。还没做的事写在 [剩余工作](../plan/10-v2-pixi-matter-ink-game-engine-plan.md)，不写进「可以这样调用」的示例。历史检索留在 [第 11 章](./11-references-and-research.md)。和 inkEngine 的逐项对照在 [第 12 章](./12-inkengine-parity-audit.md)。

| 章 | 内容 |
|---|---|
| [01 范围](./01-scope-and-engine-map.md) | 两套并存的运行时，以及公共出口 |
| [02 宿主与渲染](./02-host-and-render-backend.md) | p5 宿主、旧 WebGL2、Pixi `InkStage` |
| [03 时钟](./03-microkernel-and-loop.md) | `Engine` 固定步，以及 `InkStage` 自己的 RAF |
| [04 插件与道具](./04-plugin-system.md) | 插件图、`ItemPreset`、十卡页面 |
| [05 场景](./05-world-scene-and-assets.md) | 旧场景服务与 `InkWorld` |
| [06 输入、笔和碰撞](./06-input-strokes-and-physics.md) | 笔画权威几何、Matter、水刷 |
| [07 水墨](./07-ink-rendering.md) | `InkWash`：移植的 inkEngine 笔刷、着色器、缓冲与选笔注意 |
| [08 玩法与录制](./08-gameplay-and-persistence.md) | 十卡里实际发生的事，以及旧录制 |
| [09 验证](./09-tooling-and-quality.md) | `build.sh`、测试、冒烟、对照截图 |
| [10 交付](./10-shipping-and-ecosystem.md) | 构建入口、许可、还不能发布的部分 |

公共类型和函数只从 [`src/index.ts`](../src/index.ts) 导出。应用代码用别名 `@inkgames/engine`，不要去 import `src/core/` 或 `src/plugins/` 的内部文件。

```bash
./build.sh dev      # http://127.0.0.1:5173/  十卡首页
./build.sh check    # tsc + vitest + 文档相对链接
./build.sh browser  # 构建后的无头 Chromium 冒烟
```
