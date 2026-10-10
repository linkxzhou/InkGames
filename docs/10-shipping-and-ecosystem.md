# 10 · 交付与许可

[目录](./README.md) · [上一章](./09-tooling-and-quality.md) · [附录](./11-references-and-research.md)

## 构建产物

`vite.config.ts` 的 `root` 是 `apps/`。`build.outDir` 是仓库根的 `dist/`。多页入口：

- `apps/index.html` → 首页
- `apps/scroll/index.html` → 横版切片
- `apps/story/index.html` → 「易水寒」叙事演示
- `apps/history/index.html` → 上古「混沌开卷」历史动画
- `apps/gallery/index.html` → 参照画廊（构建会带上五张参照 PNG，只供并排显示）
- `apps/fx/index.html` → 二十四笔水墨动态
- `apps/props/<id>/index.html` → 二十个道具页

别名 `@inkgames/engine` 指向 `src/index.ts`。生产包不复制 `thirdparty/inkEngine` 或 `thirdparty/inkField`。原先的十卡首页、`/inkcross/`、`/wuxia/`、`/compare/` 不再打包（源文件已删除）。

`package.json` 的 `version` 是 `0.1.0`，`private: true`。**依赖只剩两个**：

| 依赖 | 版本 | 许可 |
|---|---|---|
| `three` | 0.186.1 | MIT |
| `matter-js` | 0.20.0 | MIT |

`@types/three@0.186.0` 与 `@types/matter-js@0.20.2` 作为开发依赖；这个版本的 three 包对类型仍按此配套。`pixi.js` 与 `p5` 已从 `package.json` 删除。全部登记在 [第三方清单](../THIRD_PARTY_NOTICES.md)。

## 现在可以交付的用法

桌面浏览器跑 `./build.sh dev`，从首页进入：

- `/scroll/`：键盘加指针操作角色，验证坡、洇染、皴法、断竹。
- `/story/`：看「易水寒」开场，做正史 / 野史选择，走检查点恢复。
- `/history/`：看纯程序生成的「混沌开卷」五幕。
- `/gallery/`：看五张程序水墨和旁边的参照图。
- `/fx/`：看二十四笔程序水墨动态，悬停循环，点击全屏。
- `/props/<id>/`：看一件历史道具，并触发砍、落、燃或流。

嵌入方若只用库，从 `@inkgames/engine` 引 `InkView` / `StoryStage` / `InkScene` / `InkSurface`，不要拷 `apps/` 里的示例逻辑。README 的快速上手可复制 `docs/01` 的 `InkView` 片段。

## 还不能当成发布完成的部分

- 真实 GPU 上的帧时间和上下文恢复；`InkScene` 目前不做恢复。
- 玩法模拟。`defineGameplay` 只有动词和说明，道具页不是一场可通关的战斗。
- 2.0 录制（`inkgames.ink-recording`）、多边形遮罩、景深 `PostStack`。
- `InkScene` 每层各持一张 `InkSurface`（内部多张 RT），没有内存预算。
- 把 `thirdparty/inkField` 或 `thirdparty/inkEngine` 的快照打进发布物。快照留在仓库里只供对照，构建不复制它们。

## 许可

`thirdparty/inkwash` 是 MIT。若把其中源码搬进 `src/`，保留版权与许可全文。

`thirdparty/inkField` 是自定义受限许可。不复制其中代码、着色器、常量表，不把它放进发布物。

`thirdparty/inkEngine` 是 inkField 的可读还原。仓库所有者说明已有 inkField 作者的书面授权，允许把其中算法移植进本仓库的 `src/`，以便水墨效果对齐。授权书本身不在仓库里，本文件不能代替那份授权。移植进 `src/` 的着色器和笔刷在文件头保留归属说明。不要修改 `thirdparty/` 里的文件，也不要把该快照再发布出去。细节以 [第三方清单](../THIRD_PARTY_NOTICES.md) 为准。

新增依赖仍只接受 MIT / BSD / Apache / LGPL（不修改、可独立分发），并写进清单。

## 其它许可来源

皴法勾边用的 classic Perlin 在 `src/core/classic-noise.ts`，来自 [stegu/webgl-noise](https://github.com/stegu/webgl-noise)（Stefan Gustavson，MIT），文件头保留版权说明。字幕 `InkText` 用 Canvas 纹理，没有安装 troika-three-text。`three` 与 `matter-js` 均为 MIT。

`thirdparty/inkEngine` 的快照、内嵌字体和 `demo.json` 仍然不进 `dist/`；`thirdparty/` 下的参考 PNG 只作为人工视觉对照，不进入运行时也不进入发布物（无头冒烟会断言图片请求为 0）。历史游戏的语料 PDF 不进仓库。真实 GPU 未实测。
