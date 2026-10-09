# InkGames 文档

01–10 每章都有两层：

- **现行**：仓库里已经能跑的代码。示例只调用 [`src/index.ts`](../src/index.ts) 里现有的导出。
- **计划（未实现）**：所有者已决定的 three.js + Matter.js 架构。细节、里程碑和待确认问题在 [引擎计划](../plan/10-three-matter-side-scroller-plan.md)。历史游戏的叙事和缺口在 [plan/11](../plan/11-history-game-story-design.md)、[plan/12](../plan/12-history-game-engine-gaps.md)。计划里的类还不能 import。

历史检索和 2026-10-09 的出处在 [第 11 章](./11-references-and-research.md)。和 inkEngine 的逐项对照在 [第 12 章](./12-inkengine-parity-audit.md)，对照的是现行 Pixi 移植。

| 章 | 现行 | 计划（未实现） |
|---|---|---|
| [01 范围](./01-scope-and-engine-map.md) | p5 微内核与 Pixi `InkStage` | `InkView`、模块从哪进公共出口 |
| [02 宿主与渲染](./02-host-and-render-backend.md) | p5、旧 WebGL2、Pixi `InkStage` | `WebGLRenderer`、侧视相机、层深 |
| [03 时钟](./03-microkernel-and-loop.md) | `Engine` 与 `InkStage` 的固定步 | 玩法插值，以及过场帧时钟 |
| [04 插件与道具](./04-plugin-system.md) | 插件图、`ItemPreset`、十卡 | 与 plan/12 对齐的模块名 |
| [05 场景](./05-world-scene-and-assets.md) | `InkWorld` 与旧场景服务 | 像素坐标、Y 向下、视差 |
| [06 输入、笔和碰撞](./06-input-strokes-and-physics.md) | 键盘、笔刷、水刷、距离命中 | 坡、单向平台、击退、扫掠 |
| [07 水墨](./07-ink-rendering.md) | `InkWash` 与 inkEngine 管线 | 迁到 `InkSurface`，以及三样新画面 |
| [08 玩法与录制](./08-gameplay-and-persistence.md) | 十卡里实际发生的事 | 横版切片；叙事宿主留给 plan/12 |
| [09 验证](./09-tooling-and-quality.md) | `build.sh`、单测、SwiftShader 冒烟 | 引擎切片的单测和截图 |
| [10 交付](./10-shipping-and-ecosystem.md) | 现行依赖与还不能发布的部分 | three.js 尚未安装 |

公共类型和函数只从 [`src/index.ts`](../src/index.ts) 导出。应用代码用别名 `@inkgames/engine`，不要去 import `src/core/` 或 `src/plugins/` 的内部文件。

```bash
./build.sh dev      # http://127.0.0.1:5173/  十卡首页
./build.sh check    # tsc + vitest + 文档相对链接
./build.sh browser  # 构建后的无头 Chromium 冒烟
```
