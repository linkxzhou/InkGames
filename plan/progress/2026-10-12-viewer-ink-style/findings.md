# Findings & Decisions

## Requirements

- 页面用宣纸 `#eceae4`、浓墨 `#141414`、灰阶、朱砂 `#b3241c`（不超过一成）。去掉圆角卡片、投影、渐变和多余装饰。
- 主图和横幅不遮挡、不截断，左右与容器对齐。
- 1440 与 390 截首页、四篇、提示词、地图，并附改前改后。只要截图。
- 更新根目录 `AGENTS.md`：删过期规则，补截图验收、PR 基线、黑白红、章节视频、`plan/progress/`、Natural Earth / CHGIS、不提交 `yarn.lock`。

## Research Findings

- 查看器里残留的现代样式是顶栏 `backdrop-filter`、场景卡径向渐变、关系图径向渐变、下拉渐变箭头、按钮 `brightness`、战场篇斜杠渐变、地图点发光。
- 主图宽图墨迹约从横向 0.475 起到右缘；横幅墨迹约从 0.54 起。宽屏标题叠在左侧留白。
- 地图 `qin.webp` 等离最近色板色约 3%，蓝色占比 0。纸纹、按钮墨块同类。
- `05-09-jingke-relations.html` 仍有圆角和投影，它不是内容站首页，本轮未改。

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| 场景卡去掉灰框，底边用已有飞白 SVG | 墨线、留白，不再像产品卡片 |
| 治国篇场景卡保留 1px 墨框 | 篇的页面气质是格网 |
| 地图点改为方点，地名用纸底 | 去掉发光和文字投影 |
| 地图缩略图改为 `contain` | 避免 `cover` 裁切 |

## Issues Encountered

| Issue | Resolution |
|-------|------------|
| 本分支起初没有 `skills/plan-with-files` | 技能在 `main` 的 `7ab975b`。进度改记到该技能约定的三文件目录 |
| `./build.sh check` 用 Yarn 1.22 改写 `yarn.lock` | `git checkout -- yarn.lock`，未提交 |

## Resources

- `video/docs/art-style.md`
- `video/viewer/index.html`
- `video/viewer/pian.css`
- `skills/plan-with-files/SKILL.md`（在 `main`）

## Visual/Browser Findings

- 1440 主图显示 1160×483，原图 2400×1000，比例都是 2.4。横幅 1160×290，原图 2400×600，比例都是 4。容器左右都是 100 与 1340。
- 390 主图 358×358（方图，比例 1），横幅 358×90（比例 4）。容器左右都是 0 与 390。
- 1024 与 768 同样无横向溢出，比例与容器左右差为 0。768 起主图换方图，这是原有断点。
