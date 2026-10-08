# InkGames：PixiJS 水墨横版动作引擎

桌面优先的横屏水墨动作演示。2.0 舞台用 PixiJS 8.22.0 画、Matter.js 0.20.0 做刚体；水墨层 `InkWash` 以 [inkEngine](./thirdparty/inkEngine/README.md) 的笔毫和 `min()` 扩散为参照，在自己的 RenderTexture 里实现。旧的 p5 + WebGL2 微内核仍保留在 `/inkcross/` 和 `/wuxia/`，供回归。

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

- [文档](./docs/README.md)：01–10 描述已经接上的 API；[第 12 章](./docs/12-inkengine-parity-audit.md) 是和 inkEngine 的逐项对照
- [剩余工作](./plan/10-v2-pixi-matter-ink-game-engine-plan.md)，以及 [删除了哪些旧计划](./plan/README.md)
- [旧路线检索附录](./docs/11-references-and-research.md)：p5 时代的笔记，不作 Pixi 实测证明
- [第三方与许可](./THIRD_PARTY_NOTICES.md)

`thirdparty/inkField` 的自定义许可禁止把该快照放进发布物。`thirdparty/inkEngine` 的算法可以按所有者声明的书面授权移植进 `src/`（授权书不在仓库里），快照本身仍然不要打进 `dist/`。`thirdparty/inkwash` 为 MIT。
