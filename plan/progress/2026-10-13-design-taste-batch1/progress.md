# 进度

- 2026-10-13 从 `main` @ `9cd1ec8` 开分支 `cursor/design-taste-batch1-b351`。
- 改前截图：首页与易水寒，1440 与 390。眉题 `#6e6e6c` 对纸 4.25:1；390 上下拉 22×81；分区条在「视频提示词」被切断。
- 已改 `index.html`、`pian.css`、`05-09-jingke-relations.html`。`--mid` 不再作字色。
- 改后实测：小字 `#3a3a3a` / `#eceae4` = 9.45:1。下拉、篇按钮、朝代格、分区链接高 44px（主按钮 48px，避开笔触裁切后仍 ≥44）。390 上章/场在 `#dynasties` 正上方，各宽 146px。分区条两行，八项右缘 ≤367，视口 390。
- `./build.sh check` 通过（tsc、73 项测试、391 个文档链接）。`node video/tools/validate.mjs` 0 个错误。`yarn.lock` 已还原，不提交。
