# InkGames：水墨横版动作引擎

桌面优先的横屏水墨动作引擎，**three.js + Matter.js**（见 [引擎计划](./plan/10-three-matter-side-scroller-plan.md)）。位移和碰撞在 X/Y 平面，Matter 的刚体 x、y 每帧写到 three.js 模型上，Z 固定。

依赖只剩 `three@0.186.1` 与 `matter-js@0.20.0`。曾经的 PixiJS 十卡舞台、p5 微内核与原生 WebGL2 渲染插件已于 2026-10-09 从 `src/`、`apps/` 和 `package.json` 中删除。

## 入口

| 入口 | 页面 | 说明 |
|---|---|---|
| 横版切片 | `/scroll/` | 坡、洇染、皴法、断竹。M0–M4 已落地 |
| 叙事宿主 | `/story/` | 只读播放「易水寒」开场，可走正史 / 野史，支持检查点恢复。M5 部分完成 |
| 历史动画 | `/history/` | 上古「混沌开卷」五幕，30 fps，画面全部由引擎笔刷生成，不加载参考图 |
| 参照画廊 | `/gallery/` | 五张程序水墨，旁边是参照图。不是描图，也不是逐像素重合 |
| 历史道具 | `/props/<id>/` | 二十件道具各自一页，Matter.js 做砍、落、燃、流 |

水墨层：切片用 `InkView` + `InkSurface`（three.js 渲染目标上跑从 [inkEngine](./thirdparty/inkEngine/README.md) 逐行移植的七种笔刷与着色器）；叙事用 `StoryStage` 的多层墨面；历史动画用 `InkScene` 的程序分件墨层。

`defineGameplay` 只给剧情节点贴动词和目标，不模拟决斗。`PostStack`、景深、2.0 录制回放、`InkScene` 的上下文恢复、真实配音与真实 GPU 验收都还没完成。SwiftShader 截图只证明着色器能编过，不能写成真实 GPU 上的完成证明。

## 怎么跑

```bash
./build.sh install
./build.sh dev       # http://127.0.0.1:5173/  首页；/scroll/、/story/、/history/、/gallery/、/props/
./build.sh check     # 类型检查 + 单元测试 + 相对链接
./build.sh browser   # 构建后的无头 Chromium 冒烟（SwiftShader，三页 + 零图片请求）
node scripts/gpu-check.mjs   # 本机打开切片、叙事、历史、画廊与道具。加 --shots 做无头截图
```

统一入口是 `build.sh`。Agent 入口与关键记忆见 [AGENTS.md](./AGENTS.md)，工程规范见 [docs/AGENTS.md](./docs/AGENTS.md)。

## 阅读顺序

- [文档](./docs/README.md)：01–10 写现行 API；[第 12 章](./docs/12-inkengine-parity-audit.md) 是与 inkEngine 的对照（总表为 Pixi 时代的历史记录）
- [引擎计划](./plan/10-three-matter-side-scroller-plan.md)：M0–M4 已完成，M5 部分完成，§7 记录 Pixi/p5 清理结果
- [历史水墨视频 / 游戏内容](./video/README.md)：`video/docs/` 故事、大纲、数据格式与引擎缺口，`video/data/` 章节数据，`video/viewer/` 查看页
- [历史动画制作计划](./video/docs/production-plan.md)：纯程序水墨的实施与 E0–E4 状态
- [资料附录](./docs/11-references-and-research.md)：p5 时代的笔记，以及 2026-10-09 补上的 three.js / Matter.js 出处
- [第三方与许可](./THIRD_PARTY_NOTICES.md)

`thirdparty/inkField` 的自定义许可禁止把该快照放进发布物。`thirdparty/inkEngine` 的算法可以按所有者声明的书面授权移植进 `src/`（授权书不在仓库里），快照本身仍然不要打进 `dist/`。`thirdparty/inkwash` 为 MIT。`thirdparty/` 下的参考 PNG 只作人工视觉对照，不进运行时也不进发布物。
