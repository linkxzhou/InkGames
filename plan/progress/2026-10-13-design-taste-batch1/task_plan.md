# 第一批 design-taste：字色、热区、首页字号、手机分区条

## 目标

只修评审第一批，不开第二批（地图碰撞、封面重出、字号收档、自托管楷体都不做）。

1. 12–16px 小字（眉题、年份、卡片说明、次要文字）从 `#6e6e6c` 改为 `--char #3a3a3a`，对纸 `#eceae4` ≥ 4.5:1。`--mid` 只留点、线、非文字。
2. 章/场下拉、按钮、分区条链接点按区域 ≥ 44px。390 宽把章/场选择器从顶栏挪到长卷上方，各 `min-height:44px`、`flex:1`。
3. 首页眉题 14px、字距 0.18em；说明正文（`.hero-p`、`.ps`）16px、行高 1.75。统计标签 14px、`--char`。
4. 手机分区条不截断：两行换行，`overflow:visible`，每项 ≥ 44px。

## 阶段

- [done] 改前截图（1440 / 390）
- [done] 改 `video/viewer/index.html`、`pian.css`、`05-09-jingke-relations.html`
- [done] 改后截图、对比度、`./build.sh check`、校验器 0 错误
- [in_progress] 提交并开 PR 指向 main
