# Task Plan: 内容站墨线样式

## Goal

把 `video/viewer/index.html` 收成简化版《影之刃》黑白红，主图和篇横幅仍整图对齐容器，并按现行规则收紧根目录 `AGENTS.md`。

## Next Step

无。等待合并进 `main`。PR #16 已合并，后续改动另开以 `main` 为目标的 PR。

## Current Phase

Phase 5

## Phases

### Phase 1: Requirements & Discovery

- [x] 对照 `video/docs/art-style.md` 与现有查看器样式
- [x] 确认主图、篇卡、横幅已是剪影，地图色差是灰阶台阶
- **Status:** complete

### Phase 2: Planning & Structure

- [x] 只改 CSS，不动 `.hero-stage` / `.pb-stage` 的尺寸和 `object-fit`
- [x] 进度按 plan-with-files 记在本目录
- **Status:** complete

### Phase 3: Implementation

- [x] 去掉模糊、渐变、发光，场景卡与篇卡改飞白底边
- [x] 收紧 `AGENTS.md`
- **Status:** complete

### Phase 4: Testing & Verification

- [x] 1440 / 1024 / 768 / 390 复测比例与对齐
- [x] `validate.mjs` 与 `./build.sh check`
- [x] 1440 与 390 截图及改前改后对比
- **Status:** complete

### Phase 5: Delivery

- [x] 提交并推送
- [x] 因 PR #16 已合并，另开指向 `main` 的 PR
- **Status:** complete

## Key Questions

1. 主图要不要重画？不要。左侧留白承担标题，重画会破坏对齐。
2. PR #16 还能更新吗？不能，已经合并进 `main`。

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| 不重生成主图、横幅、篇卡 | 已符合色板，且构图是版式前提 |
| 不重调地图 | 抽样离色板约 3%，蓝色为 0，是 JPEG 灰阶 |
| 新 PR 以 `main` 为基线 | PR #16 已合并；规则要求不要叠放 PR |

## Errors Encountered

| Error | Attempt | Resolution |
|-------|---------|------------|
| `ManagePullRequest` 找不到 PR #16 | 1 | 该 PR 已合并。改为新建指向 `main` 的 PR |
| 进度先写成单文件 | 1 | `main` 上的 plan-with-files 约定是本目录三文件，已改过来 |

## Notes

- 真实 GPU 与 Mac 楷体未实测。
