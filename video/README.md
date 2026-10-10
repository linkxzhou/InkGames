# video · 历史水墨视频与游戏内容

这里放 InkGames 历史线的全部**内容**：上古至清 21 章、209 个场景的剧情数据，史源摘要，开场动画分镜与音频提示，水墨素材提示词，每个场景的水墨视频生成提示词，以及浏览这些数据的单页查看器。引擎代码不在这里，在 `src/`、`apps/`（引擎计划见 [plan/10](../plan/10-three-matter-side-scroller-plan.md)）。

2026-10-10 从 `plan/11-history-game-data/`、`plan/11-history-game-*.md`、`plan/12-history-game-*.md` 迁来，文件名按下面的规则统一。

## 目录

```
video/
├── README.md                    本文件：目录、命名规则、工作流
├── docs/                        设计文档
│   ├── story-design.md          故事与玩法设计（原 plan/11-history-game-story-design.md）
│   ├── chapter-outline.md       章节大纲：21 章场景表（原 plan/11-history-game-chapter-outline.md）
│   ├── content-schema.md        JSON 数据契约，含 artPrompts / videoPrompt（原 plan/11-history-game-content-schema.md）
│   ├── engine-gaps.md           开场动画管线与引擎缺口（原 plan/12-history-game-engine-gaps.md）
│   └── production-plan.md       历史动画制作计划（原 plan/12-history-game-ink-animation-production-plan.md）
├── data/
│   ├── chapters/
│   │   ├── index.json           章节索引与总数
│   │   └── NN-<dynasty>.json    每章一个数据包：00-shanggu … 20-qing
│   ├── examples/
│   │   └── 05-09-zhanguo-jingke.json   荆轲（易水寒）完整样例
│   └── corpus-catalog.json      语料书目（只有目录，不含 PDF）
├── sources/
│   ├── README.md                史源摘要的写法与版权规则
│   └── NN-<dynasty>/NN-MM-<scene-id>.md   每个场景一份史源摘要
├── tools/
│   ├── validate.mjs             数据校验器（0 错误才能提交）
│   ├── build-art-prompts.mjs    生成 artPrompts（水墨素材提示词）
│   ├── build-video-prompts.mjs  生成 videoPrompt（水墨视频提示词，中英双语）
│   ├── build-source-digests.mjs 生成 sources/ 下的史源摘要
│   ├── build-viewer-data.mjs    chapters/*.json → viewer/data/*.js
│   ├── gen-name-pinyin.py       可选：重建 name-pinyin.json（需 pypinyin）
│   └── name-pinyin.json         人名拼音表，供英文提示词使用
└── viewer/
    ├── index.html               查看器，双击即可用（file://）
    ├── 05-09-jingke-relations.html   荆轲人物关系图
    └── data/                    生成的 window 全局脚本（index.js + NN-<dynasty>.js），勿手改
```

## 命名规则

- 一律小写 kebab-case，不带 `11-`、`12-` 这类 plan 编号前缀。
- 章用两位数字加朝代拼音：`NN-<dynasty>`，`NN` 是 `00`–`20`（与 `chapter.order` 一致），如 `12-sui`、`16-liaojin`。
- 场景用大纲编号加场景 id：`NN-MM-<scene-id>`，`NN-MM` 是 [章节大纲](docs/chapter-outline.md) 里的 ID（`outlineId`），`<scene-id>` 是 `scene.id` 点号后面的部分，如 `05-09-jingke`、`12-08-yanmen`。大纲编号一旦分配就不改，新增场景接着往后编号；章内顺序按年代，由数据里的 `order` 决定。
- 文档放 `docs/`，用内容命名（`story-design.md`），不用序号。
- 生成物（`viewer/data/*.js`、`sources/NN-*/`、数据里的 `artPrompts`、`videoPrompt`）都由 `tools/` 下的脚本产出，不手改。

## 工作流

在仓库根目录：

```bash
node video/tools/build-art-prompts.mjs     # 重写每个场景的 artPrompts
node video/tools/build-video-prompts.mjs   # 重写每个场景的 videoPrompt
node video/tools/build-source-digests.mjs  # 重写 sources/NN-*/ 史源摘要
node video/tools/build-viewer-data.mjs     # 刷新 viewer/data/*.js
node video/tools/validate.mjs              # 必须 0 个错误
./build.sh check                           # 类型检查、单测（含 tests/narrative.test.ts 读取本目录数据）、文档链接
```

然后双击 `video/viewer/index.html`（或 `?chapter=sui&scene=sui.yanmen` 直接定位场景）。查看器只用 `<script>` 加载 `viewer/data/*.js`，不发请求，所以 file:// 下可用。

## 迁移时的取舍

- `plan/12-history-game-engine-gaps.md` 与 `plan/12-history-game-ink-animation-production-plan.md` 讲的都是历史动画（开场过场、混沌开卷、E0–E4），没有与通用引擎计划混写的段落，所以整份迁入 `docs/engine-gaps.md`、`docs/production-plan.md`，正文不改，只修链接。通用引擎计划仍是 `plan/10`。
- 查看器从 `plan/11-history-game-data/index.html` 移到 `viewer/index.html`，数据脚本从 `data/*.js` 移到 `viewer/data/*.js`，相对路径不变，file:// 照常可用。

## 水墨视频提示词

美术风格：高反差黑白红武侠水墨剪影（类《影之刃》，简化版），见 [docs/art-style.md](docs/art-style.md)；所有提示词的风格行、色板与负面词由 `tools/art-style.mjs` 统一给出。

查看器每个场景都有“水墨视频提示词”面板：中/英切换、复制整段、复制负面提示词、逐镜复制，以及导出本章或全部场景（Markdown / JSON）。字段说明见 [content-schema.md §2.11](docs/content-schema.md#211-水墨视频生成提示词videoprompt)。

## 内容规则

- 每个场景都有正史线和第二条线（野史、演义、传说或后世解读），每条线都标出处，精确到书名加卷、篇或回。没有把握的日期与出处标 `verify: 'pending'`（查看器里显示为“待核验”），不硬写。
- 语料（`/workspace/hist/` 下的 PDF、OCR 文本）**不进仓库**。数据里只记 `corpus.file` 与页码。
- 现代有版权的作品（《明朝那些事儿》《大秦帝国》《五千年演义》等）只概述、只引页码，不抄原文。引文只用公版古籍，而且要短。
- 运行时（`src/core/content-catalog.ts`、`apps/story`、`apps/history`、`tests/narrative.test.ts`）直接读 `video/data/`，改字段前先看 [content-schema.md](docs/content-schema.md)。
