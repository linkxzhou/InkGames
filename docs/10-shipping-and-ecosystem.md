# 10 · 交付与许可

[目录](./README.md) · [上一章](./09-tooling-and-quality.md) · [附录](./11-references-and-research.md)

## 构建产物

`vite.config.ts` 的 `root` 是 `apps/`。`build.outDir` 是仓库根的 `dist/`。多页入口：

- `apps/index.html` → 十卡首页
- `apps/<道具>/index.html` → 十个演示
- `apps/inkcross/index.html`、`apps/wuxia/index.html` → 旧演示，仍打进包，供冒烟
- `apps/compare/index.html` → 水墨对照，不在首页卡片里

别名 `@inkgames/engine` 指向 `src/index.ts`。生产包不复制 `thirdparty/`。

`package.json` 的 `version` 仍是 `0.1.0`，`private: true`。依赖：PixiJS 8.22.0（MIT）、Matter.js 0.20.0（MIT）、p5 ^2.3.4（LGPL-2.1，未改其源码）。登记在 [第三方清单](../THIRD_PARTY_NOTICES.md)。

## 现在可以交付的用法

桌面浏览器打开 `./build.sh dev`，从首页进入任意一卡，用键盘和指针完成该页文案里的那一个动作。嵌入方若只用库，从 `@inkgames/engine` 引 `InkStage` 或单独引 `InkWash`。不要把 `apps/demo.ts` 当成引擎的一部分拷进别的项目后再改内部类。

## 还不能当成发布完成的部分

- 真实 GPU 上的帧时间和上下文恢复。
- 道具各自的插件包和资源租约。
- 2.0 录制、武器扫掠、除矩形以外的墨障。
- 把 `thirdparty/inkField` 或 `thirdparty/inkEngine` 的快照打进发布物。快照留在仓库里只供对照，构建不复制它们。

## 许可

`thirdparty/inkwash` 是 MIT。若把其中源码搬进 `src/`，保留版权与许可全文。当前 `InkFluid` 是独立实现。

`thirdparty/inkField` 是自定义受限许可。不复制其中代码、着色器、常量表，不把它放进发布物。

`thirdparty/inkEngine` 是 inkField 的可读还原。仓库所有者说明已有 inkField 作者的书面授权，允许把其中算法移植进本仓库的 `src/`，以便水墨效果对齐。授权书本身不在仓库里，本文件不能代替那份授权。移植进 `src/` 的着色器和笔刷在文件头保留归属说明。不要修改 `thirdparty/` 里的文件，也不要把该快照再发布出去。细节以 [第三方清单](../THIRD_PARTY_NOTICES.md) 为准。

新增依赖仍只接受 MIT / BSD / Apache / LGPL（不修改、可独立分发），并写进清单。
