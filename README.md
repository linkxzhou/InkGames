# InkGames：水墨横版动作引擎

桌面优先的横屏水墨动作演示。横版切片用 **three.js 0.186.1 + Matter.js**（见 [引擎计划](./plan/10-three-matter-side-scroller-plan.md)）：位移和碰撞在 X/Y 平面，刚体的 x、y 写到模型上。页面在 `/scroll/`。叙事宿主还没有。真实 GPU 未实测。

十卡首页仍用 PixiJS 8.22.0 画、Matter.js 0.20.0 做刚体。水墨层 `InkWash` 在 Pixi RenderTexture 上运行从 [inkEngine](./thirdparty/inkEngine/README.md) 逐行移植的七种笔刷和着色器；每个道具按 `PROP_BRUSHES` 里自己的笔刷一笔一笔画出来。切片的 `InkSurface` 把同一条笔刷接到 three.js 渲染目标。旧的 p5 + WebGL2 微内核仍保留在 `/inkcross/` 和 `/wuxia/`，供回归。

十卡能玩的范围、以及还没做完的部分，以代码和文档为准。SwiftShader 截图只证明着色器能编过，不能写成真实 GPU 上的完成证明。

## 怎么跑

```bash
./build.sh install
./build.sh dev       # http://127.0.0.1:5173/  十卡首页；横版切片在 /scroll/
./build.sh check     # 类型检查 + 单元测试 + 相对链接
./build.sh browser   # 构建后的无头 Chromium 冒烟（SwiftShader）
node scripts/gpu-check.mjs   # 本机打开切片。加 --shots 做无头截图
```

统一入口是 `build.sh`，约定见 [AGENTS.md](./AGENTS.md)。

## 阅读顺序

- [文档](./docs/README.md)：01–10 写十卡现行 API，文末写已导出的横版切片；[第 12 章](./docs/12-inkengine-parity-audit.md) 是 Pixi 移植和 inkEngine 的对照
- [引擎计划](./plan/10-three-matter-side-scroller-plan.md)：M0–M4 已落地，M5 叙事宿主未做
- [历史游戏草案](./plan/README.md)：`plan/11` 故事与数据，`plan/12` 开场动画和引擎缺口
- [资料附录](./docs/11-references-and-research.md)：p5 时代的笔记，以及 2026-10-09 补上的 three.js / Matter.js 出处
- [第三方与许可](./THIRD_PARTY_NOTICES.md)

`thirdparty/inkField` 的自定义许可禁止把该快照放进发布物。`thirdparty/inkEngine` 的算法可以按所有者声明的书面授权移植进 `src/`（授权书不在仓库里），快照本身仍然不要打进 `dist/`。`thirdparty/inkwash` 为 MIT。
