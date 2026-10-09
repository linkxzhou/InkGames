# InkGames：水墨横版动作引擎

桌面优先的横屏水墨动作演示。**计划中的引擎是 three.js + Matter.js**（见 [引擎计划](./plan/10-three-matter-side-scroller-plan.md)）：横版动作的位移和碰撞在 X/Y 平面，Matter.js 把刚体的 x、y 写到 three.js 模型上。这一切换还没有进 `src/`。

现在能跑的 2.0 舞台用 PixiJS 8.22.0 画、Matter.js 0.20.0 做刚体。水墨层 `InkWash` 在 Pixi RenderTexture 上运行从 [inkEngine](./thirdparty/inkEngine/README.md) 逐行移植的七种笔刷和着色器；每个道具按 `PROP_BRUSHES` 里自己的笔刷一笔一笔画出来。旧的 p5 + WebGL2 微内核仍保留在 `/inkcross/` 和 `/wuxia/`，供回归。

十卡能玩的范围、以及还没做完的部分，以代码和文档为准，不把 SwiftShader 冒烟写成真实 GPU 上的完成证明。

## 怎么跑

```bash
./build.sh install
./build.sh dev       # http://127.0.0.1:5173/  十卡首页
./build.sh check     # 类型检查 + 单元测试 + 相对链接
./build.sh browser   # 构建后的无头 Chromium 冒烟（SwiftShader）
```

统一入口是 `build.sh`，约定见 [AGENTS.md](./AGENTS.md)。

## 阅读顺序

- [文档](./docs/README.md)：01–10 分开写现行代码和计划中的 three.js 架构；[第 12 章](./docs/12-inkengine-parity-audit.md) 是和 inkEngine 的逐项对照
- [引擎计划](./plan/10-three-matter-side-scroller-plan.md)：three.js + Matter.js，待确认后再实现
- [历史游戏草案](./plan/README.md)：`plan/11` 故事与数据，`plan/12` 开场动画和引擎缺口
- [资料附录](./docs/11-references-and-research.md)：p5 时代的笔记，以及 2026-10-09 补上的 three.js / Matter.js 出处
- [第三方与许可](./THIRD_PARTY_NOTICES.md)

`thirdparty/inkField` 的自定义许可禁止把该快照放进发布物。`thirdparty/inkEngine` 的算法可以按所有者声明的书面授权移植进 `src/`（授权书不在仓库里），快照本身仍然不要打进 `dist/`。`thirdparty/inkwash` 为 MIT。
