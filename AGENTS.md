# AGENTS.md · InkGames

> 给编码 Agent 的入口文件：启动时先读这里。这里记录项目是什么、怎么构建、走过哪些路、哪些规则不能破。
> 细则不在这里重复，按链接去读：
> - 工程规范（目录职责、命名、代码约定、验证门槛、许可红线 §1–§6）：[docs/AGENTS.md](./docs/AGENTS.md)
> - 项目现状与阅读顺序：[README.md](./README.md)；引擎计划：[plan/10](./plan/10-three-matter-side-scroller-plan.md)、[plan/README.md](./plan/README.md)
> - 历史内容线：[video/README.md](./video/README.md)；美术风格：[video/docs/art-style.md](./video/docs/art-style.md)；引擎侧影响：[docs/13](./docs/13-art-style.md)
>
> 冲突时：本文件的“规则”一节 → `docs/AGENTS.md` → `plan/10` → `docs/01..13` → `video/docs/*`。

## 1. 项目概览

InkGames 是桌面优先的**横版水墨动作引擎 + 中国历史内容线**。

- 引擎：three.js `0.186.1`（WebGL）+ Matter.js `0.20.0`。Matter.js 在 X/Y 平面做 2D 物理，刚体 x、y 写进 three.js 模型，Z 固定。依赖只有这两个，见 [package.json](./package.json)。PixiJS 与 p5 已删除，不得再引入。
- 示例页：`apps/scroll/`（横版切片）、`apps/story/`（叙事宿主，易水寒样例）、`apps/history/`（历史动画）、`apps/gallery/`（参照画廊）、`apps/props/<id>/`（二十个道具页）。
- 历史内容：`video/` 下 21 章（上古至清）、每章 5–30 个完整场景的剧情数据、史源摘要、开场分镜、音频提示、素材提示词与每场的水墨视频生成提示词，以及 `file://` 可直接打开的查看器 `video/viewer/index.html`。
- 包管理：Yarn 4（`packageManager` 见 package.json，锁文件 `yarn.lock` 必须保留）。

## 2. 目录速览

完整目录树与职责红线见 [docs/AGENTS.md §1](./docs/AGENTS.md#1-目录结构权威)。只记几个容易弄错的点：

| 路径 | 说明 |
|---|---|
| `src/` | 引擎源码，唯一公共出口 `src/index.ts`；不放示例数据，不 import `video/` |
| `apps/` | 示例页面，只依赖 `@inkgames/engine` |
| `video/data/chapters/*.json` | 章节数据（生成物，见 §4.3） |
| `video/viewer/` | 查看器与 `data/*.js`（由 `build-viewer-data.mjs` 生成，`file://` 可用） |
| `video/tools/` | 无依赖 Node 工具：`validate.mjs`、`art-style.mjs`、`build-video-prompts.mjs`、`build-art-prompts.mjs`、`build-source-digests.mjs`、`build-viewer-data.mjs` |
| `video/sources/<chapter>/*.md` | 每场的原创史源摘要（只有短的公版古籍引文和书名卷次） |
| `thirdparty/` | 只读参考快照；大的克隆都在 [.gitignore](./.gitignore) 里 |
| `plan/` | 只剩 `plan/10`（引擎计划）与 `plan/README.md`（含历史内容迁到 `video/` 的指针） |

## 3. 构建与检查

`build.sh` 是唯一入口（子命令：`install dev typecheck build preview test browser links check clean`），不要另写一套命令：

```bash
./build.sh install          # yarn 安装
./build.sh dev              # Vite 开发服务器
./build.sh check            # 类型检查 + vitest + 文档相对链接，提交前必跑
./build.sh browser          # 构建后的无头 Chromium 冒烟（SwiftShader）
node video/tools/validate.mjs   # 历史内容校验器，必须 0 个错误
```

无头 SwiftShader 通过不等于真实 GPU 验收；真实 GPU 验收在用户的 Mac 上做（`node scripts/gpu-check.mjs`）。

## 4. 历史内容线怎么工作

### 4.1 数据形状

- 每个场景都是完整场景（`detail: 'full'`）：时间线与入口/出口锚点、人物与关系、开场分镜（笔画/镜头/五句旁白/音频提示）、正史线、第二条线（野史/演义/异说/后世）、抉择、结局、对照卡、出处、`artPrompts`、`videoPrompt`。格式见 [content-schema.md](./video/docs/content-schema.md)，章节表见 [chapter-outline.md](./video/docs/chapter-outline.md)。
- `v1: true` 只标首版发布批次的 66 个场景，不随扩写增加。
- 场景在章内按年代排序；`待核验` 只留给真正没查实的日期与出处。

### 4.2 校验器会拦什么

`video/tools/validate.mjs` 检查：结构与引用、每章 5–30 场、年代顺序、标题唯一、模板套话、出处标签重复、近似重复场景（白名单 `NEAR_OK` 需写明理由），以及**美术风格**——每个 `videoPrompt`（zh/en）必须带 `art-style.mjs` 的风格块、全部色板 Hex、风格负面词与运动约束；每张素材提示词必须带画风行、色板与负面词；章节数据、查看器 `data/*.js` 与文档里不得出现旧的彩色水墨措辞（五色墨、金橙、蓝灰、皴法山石等）。

### 4.3 生成链

章节 JSON 由场景规格（YAML）经 `gen2.py` 生成，再依次跑 `build-art-prompts.mjs`、`build-video-prompts.mjs`、`build-source-digests.mjs`、`build-viewer-data.mjs`、`validate.mjs`。**注意：YAML 规格、`gen2.py` 与英文分镜译文目前在共享 box 的 `/workspace/gen/`（入口 `run.sh`），不在仓库里**；只改 JSON 会在下次生成时被覆盖。改风格只改 `video/tools/art-style.mjs`，再重跑两个提示词生成器。

## 5. 美术风格（摘要，全文见 [art-style.md](./video/docs/art-style.md)）

**简化版黑白红武侠水墨剪影**，以《影之刃》（灵游坊 S-Game）为气质参照，但更简单。只作参照：不复制其素材图片，提示词里不写其角色名，统一写作“高反差黑白红武侠水墨剪影风（类《影之刃》，简化版）/ in the style of high-contrast black-white-red wuxia ink silhouette art (Shadow-Blade-like, simplified)”。

色板（与 `art-style.mjs` 的 `PALETTE` 一致）：

| 名称 | Hex | 用途 |
|---|---|---|
| 墨黑 | `#141414` | 人物剪影、近景、兵器 |
| 焦灰 | `#3a3a3a` | 剪影内部少量分块 |
| 中灰 | `#6e6e6c` | 中景山石与建筑剪影 |
| 淡灰 | `#a8a8a4` | 远山第二层、烟 |
| 雾灰 | `#d2d1cc` | 最远层、雾、水 |
| 纸白 | `#eceae4` | 底色与大面积留白 |
| 朱砂红 | `#b3241c` | 唯一强调色：血、落日、旗、印；单帧面积不超过一成 |

- 人物：无五官的大剪影，头身比约 1:7，只留冠帽、袖摆、兵器、甲片的大轮廓；女性与文臣默认不持兵器。
- 笔线：粗笔侧锋、转折见棱角；枯笔飞白只做动势拖尾；山石用平涂块面。
- 构图：侧视，地平线在下三分之一，三四层平涂灰阶，大量留白。
- 效果：只有命中或高潮才泼墨与朱红血雾，之后定格。
- 负面词：其他颜色、金色、精细纹理、CG 渐变、写实照片、3D、动漫脸、画面文字、**日本刀（武士刀）**、**细密皴纹**（后两项已写进 `NEG_STYLE_*`）。

## 6. AI 视频怎么做（2026-10-10 实测）

- 流程：每个镜头先出一张本风格静帧作**首帧**，再**图生视频**。
- 平静氛围镜可用：“李白月下举杯”7/10，画面稳定，墨感真实。
- 激烈动作失败：“荆轲刺秦”4/10，卷轴融化、血液倒流、人物变形而不是运动。
- 因此 `videoPrompt` 只写克制的动势（衣袖轻摆、云雾缓移、镜头缓推），并明确“保持构图稳定，不变形，不新增物体”；打斗与刺杀用关键帧静帧加剪辑，或交给 InkGames 引擎渲染。
- 印章字与题字生成后是乱码：生成画面里不放文字，片名、印章、字幕后期叠加。
- 运镜指令不一定被遵守，只作参考。
- 生成器据此：高潮镜改为“缓推到近景后定格成关键帧静帧”，不做急推与震屏；朱红血雾只给刺杀、交战类高潮镜（约 26 场），其余高潮只泼墨定格；落款镜只留空纸，引文与朱印后期叠加。
- 这些约束是 `art-style.mjs` 的 `MOTION_ZH/EN` 与 `NEG_MOTION_ZH/EN`，生成器写进每个 `videoPrompt`，校验器逐场检查。
- 章节开场短片的流程与规则见 §7。

## 7. 章节片头视频制作规范（2026-10-10 定）

每朝一支 16:9 片头，放在查看器朝代长卷之下、场景卡之上。细节、状态表与逐镜旁白见 [chapter-videos.md](./video/docs/chapter-videos.md)，这里只记规则。

**流程**

1. 剧情树 → 开场分镜 → 场景 `videoPrompt` → 章节剧本 `video/data/chapter-videos/<ch>.json`（镜头按时间线排，每镜带 `sceneId`、`sourceShots`、`zh` 字幕、`narration` 旁白、`ambience`、`imagePrompt`、`motionPrompt`、`durationSec: 8`、`status`）。剧本源在 box 的 `/workspace/gen/chapter-videos/shots.txt`，`build_scripts.py --write` 生成 JSON 与扁平批量文件 `/workspace/chapter-video/batch.jsonl`（每行 `{ch,n,id,imagePrompt,motionPrompt}`）。
2. 每镜一张本风格 16:9 静帧（`GenerateImage`，只有父代理能调用）。
3. 图生视频 720p、8 s（`GenerateVideo`，同上）：动势丰富但受控——神话或历史氛围、墨晕、风、雾、流水、旗帜、缓慢运镜；**不拍兵刃与肢体接触**，交战与刺杀只拍之前或之后的氛围（旗、雾、血红落日、定住的一团泼墨）。
4. 逐帧调色锁回色板：`video/tools/chapter_grade.py`（灰阶 + 朱砂红，其余色相去色；可按镜 `grade.redScale` / `redMaskBelow`）。
5. 声音：edge-tts `zh-CN-YunjianNeural` 旁白，语速 rate −29%（2026-10-11 起，比原来的 −8% 慢约 1.3 倍，在合成时放慢，不做变速拉伸；`build-chapter-video.py --narration-rate` 可改）；原创程序合成的五声音阶配乐与按镜环境声（`video/tools/chapter_audio.py`，环境声名必须在其 `AMB` 表里）；旁白时配乐闪避，整轨 −16 LUFS、−1.5 dBTP，AAC 160k 立体声。
6. 合成：`python3 video/tools/build-chapter-video.py <ch>` —— 3 s 片名卡（朱印）、**1.2 s 水墨洇染转场**（`video/tools/ink_transition.py`：片名卡 → 首镜、镜与镜之间、末镜 → 空白纸面；`--transition fade` 退回旧的 0.7 s 交叉溶解）、字幕烧在下三分之一、末镜停 3 s，H.264 + AAC，**只出 mp4，不出 webm**；镜长按旁白伸长（见下“长度”），不截断旁白。
7. 写清单 `video/viewer/assets/chapter-videos/index.{json,js}`，查看器居中播放块（`file://` 可用）。

**规则**

- 色板与负面词同 §5；画面里不出现任何文字（字幕、片名、印章都是后期叠加）。
- **不出现现代元素**：所有提示词（静帧、动势、场景 `videoPrompt`、素材 `artPrompts`、`batch.jsonl`）的负面词都带 `no modern elements: no modern buildings, power lines, poles, roads, vehicles, glass, plastic, modern clothing, eyeglasses, watches, guns, electric lights, signs or lettering`（中文版见 `art-style.mjs` `NEG_MODERN_ZH`），校验器逐条检查；审片发现现代或时代错置的东西按变形镜头重生成。
- `motionPrompt` 统一以 `keep his/her/their silhouette consistent, no morphing, no new figures, no text. Only black, grey, paper white and vermilion.` 结尾。
- 旁白 15–30 字，原创措辞，忠于场景数据与其史源；古籍只引短句。不用任何有版权的音乐或音效。
- 原始静帧与片段不进仓库，放 `/workspace/chapter-video/<ch>/`（新一轮片段放 `v2/`）；合成前看接触表，**严重变形的镜头重生成**（每镜最多重试 2 次）。

**长度**：镜数 = clamp(4 + ceil(场景数 / 2), 6, 16)；每镜 8 s 片段，镜长 = max(8, 0.6 + 旁白时长 + 0.4 换气 + 1.2 转场) s，超出 8 s 的部分先把片段放慢（minterpolate 补帧，最多 1.35 倍），仍不够再停留末帧；校验器要求每镜 8–12.5 s。场景越多片子越长。上古按 8 镜旧例保留。按 2026-10-10 的实际场景数（共 241 镜，其余 20 章 233 镜）：

| 章 | 场景 | 镜数 | 估计时长 |
|---|---|---|---|
| 上古（`shanggu`） | 7 | 8（旧例） | 1:07（实测，新规则） |
| 夏（`xia`） | 5 | 7 | 0:58 |
| 商（`shang`） | 7 | 8 | 1:05 |
| 西周（`xizhou`） | 9 | 9 | 1:12 |
| 春秋（`chunqiu`） | 18 | 13 | 1:42 |
| 战国（`zhanguo`） | 22 | 15 | 1:56 |
| 秦（`qin`） | 10 | 9 | 1:12 |
| 楚汉 · 西汉（`xihan`） | 20 | 14 | 1:49 |
| 新 · 东汉（`donghan`） | 14 | 11 | 1:27 |
| 三国（`sanguo`） | 26 | 16 | 2:04 |
| 两晋（`liangjin`） | 12 | 10 | 1:20 |
| 南北朝（`nanbeichao`） | 14 | 11 | 1:27 |
| 隋（`sui`） | 10 | 9 | 1:12 |
| 唐（`tang`） | 26 | 16 | 2:04 |
| 五代十国（`wudai`） | 10 | 9 | 1:12 |
| 北宋（`beisong`） | 18 | 13 | 1:42 |
| 辽 · 西夏 · 金（`liaojin`） | 11 | 10 | 1:20 |
| 南宋（`nansong`） | 14 | 11 | 1:27 |
| 元（`yuan`） | 11 | 10 | 1:20 |
| 明（`ming`） | 26 | 16 | 2:04 |
| 清（`qing`） | 26 | 16 | 2:04 |

表中估计时长按旧规则（8 s 一镜、0.7 s 交叉溶解）：3.7 + 8 × 镜数 + 3 − 0.7 × 镜数。新规则（−29% 旁白、1.2 s 水墨转场、末尾洇回纸面 0.8 s）：时长 = 4.2 + Σ镜长 + 3 + 2.0 − 1.2 × (镜数 + 1)，镜长平均约 8.7 s 时 ≈ 8 + 7.5 × 镜数；上古 8 镜实测 67.3 s（旧 65.1 s），16 镜约 2 分 08 秒。

**体积**：720p、crf 28–30，约 0.2 MB/s；每章 mp4 上限 30 MB（校验器拦截）；16 镜的章若超限就把该章 crf 提到 30，不删镜。

**校验器检查**：每份剧本的镜数符合公式、`sceneId` 属于本章且按时间线排序、`sourceShots` 在范围内、旁白 15–30 字、镜长 8–12.5 s（`clipSlowdown` ≤ 1.35）、`negative` / `imagePrompt` / `motionPrompt` 带现代元素禁令、`imagePrompt` 带风格块与负面词、`motionPrompt` 固定结尾、环境声已实现、`clip` 命名为 `<ch>-NN.mp4`；已合成的章节再查清单、文件与 30 MB 上限。

## 8. 三件套矩阵与推广路线（2026-10-10 定）

- 三件套：① 历史内容站「烽火」——`video/viewer/index.html` 改成水墨风格的公开内容站（不再是开发工具；开卷图 `video/viewer/assets/fenghuo-hero.{webp,jpg}`）；② 每个场景用站内的分镜与 `videoPrompt` 做一支水墨短片；③ 用同一份内容做 InkGames 水墨游戏引擎，再用引擎做游戏。
- 推广路线：内容站 → 社交媒体短视频 → 游戏玩家。
- 三者共用 `video/data/` 与 [art-style.md](./video/docs/art-style.md)；站点的视觉同样只用黑白红色板，朱砂红只给印章、当前章节与少量强调。

## 9. 意图史（按 git log 核对）

| 日期 | 事件 | 提交 / PR |
|---|---|---|
| 2026-10-08 | 初始提交：p5 + PixiJS 8 + Matter.js 的水墨引擎骨架；`thirdparty/inkField`（p5.js 水墨）是最初的观感参照 | `d407e45` |
| 2026-10-08 | 加入 `thirdparty/inkEngine`：inkField 混淆代码的可读还原（据所有者说明与原版逐像素一致）；inkField 本体许可受限，只借思想；`inkwash` 为 MIT | `87eff33`，PR #1 `3c6afa9` |
| 2026-10-08/09 | 在 PixiJS 8 + Matter.js 上移植 inkEngine 笔刷与 shader 管线（PR #2），以及 flow、distort、metallic 与分层相机（PR #3） | PR #2 `42d747b`，PR #3 `b38acde` |
| 2026-10-09 | 历史游戏故事设计与 21 章 157 场数据、校验器、查看器（当时在 `plan/11-*`、`plan/12-*`） | `e6fa08f`、`127e8f1`、`e068583` |
| 2026-10-09 | 转向 three.js 0.186.1 + Matter.js：PR #4 加 `InkSurface` 与 `/scroll/` 切片（M1–M4）；PR #5 加叙事层 `/story/`、Canvas 字幕与 WebGL 上下文恢复（M5 宿主） | PR #4 `c7d90d4`，PR #5 `4e3cec4` |
| 2026-10-09/10 | PR #6：二十件历史道具与参照画廊，并清理 Pixi/p5 旧代码（以草稿 PR 开出，后合并） | PR #6 `71a37f8`（含 `937c0eb`） |
| 2026-10-10 | PR #7：用矢量墨稿重画画廊五幅，效果不满意；结论是**缺的是美术素材，不是引擎能力** | PR #7 `a4e138d` |
| — | 讨论过改用 Godot 4，否决（不在 git 里） | — |
| 2026-10-10 | 参照 Adobe Stock 的 24 种水墨动效（PR #8）**暂停**，未合入 main | PR #8 |
| 2026-10-10 | 历史内容从 `plan/11-*`、`plan/12-*` 迁到 `video/`，文件名改为小写 kebab-case；加 `videoPrompt` 面板与导出；史源摘要放 `video/sources/` | `a646f64`、`0e29639`、`56912f0`、`fffbd69` |
| 2026-10-10 | 审计并按朝代体量重排为每章 5–30 场，审计记录 [audit-2026-10-10.md](./video/docs/audit-2026-10-10.md) | 审计批次 |
| 2026-10-10 | 美术方向改为类《影之刃》的简化黑白红剪影；校验器强制风格；随后继续扩写各章 | `9cb7672`、`75a2e61` 及之后 |
| 2026-10-10 | 定下“内容站 → 视频 → 游戏”三件套（§8）；查看器改版为黑白红水墨内容站（开卷、二十一朝长卷、场景卡），页面不再显示“首发”标记（数据里的 `v1` 字段保留） | 本次改版提交 |
| 2026-10-10 | 上古片头（有声，65 s）上线；定下章节片头制作规范（§7）：镜数随场景数增长、8 s 一镜、每章 ≤ 30 MB；其余 20 章剧本写好（233 镜，待出片） | `ee43529` 及之后 |
| 2026-10-11 | 上古片头改版（67.3 s）：旁白放慢到 rate −29%（约 1.3 倍长），镜长随旁白伸长（片段 minterpolate 放慢 ≤ 1.35 倍）；1.2 s 水墨洇染转场取代交叉溶解（`ink_transition.py`，`--transition fade` 可退回）；所有提示词加“不出现现代元素”负面词并由校验器检查；其余章节待按新规则重建 | 本地提交，待审 |

## 10. 关键记忆与规则

**必须：**

1. 游戏文字一律原创。现代有版权的作品只按书名与卷/章引用，不抄段落；古籍只引短句并注明出处。
2. 没有可靠出处的民间故事标作“演义 / 异说 / 后世”，并在 `disc` 里说明来源与可信度。
3. `v1` 只标那 66 个首发场景。
4. `node video/tools/validate.mjs` 0 个错误，`./build.sh check` 全绿，才能提交或推送。
5. 视觉类工作交付时附**并排对比截图与录屏**；未在真实 GPU 上看过的结论写“未实测”。真实 GPU 验收在用户的 Mac 上。
6. 推送走用户 Mac 上的仓库：在 box 打 `git bundle` → 拷到 Mac → `git fetch` bundle → `git merge --ff-only` → `git push origin main`。只快进；不碰用户 `thirdparty/` 下的改动与未跟踪目录。
7. 小批量提交；提交作者用 `linkxzhou`。

**禁止：**

1. 提交 PDF、语料原文或现代作品段落（`thirdparty/Chinese_History-master*` 已 gitignore）。
2. 提交大型第三方克隆（`thirdparty/inkField/`、`thirdparty/inkwash/` 等已 gitignore），修改 `thirdparty/` 下的快照。
3. 复制 inkField 的代码、shader、常量表或素材；inkEngine 的移植规则见 [docs/AGENTS.md §6](./docs/AGENTS.md#6-许可红线)。
4. 重新引入 PixiJS、p5 或第二套渲染库。
5. 在提示词里写《影之刃》角色名，或把其素材图片放进仓库。
6. 手改 `video/data/chapters/*.json` 或 `video/viewer/data/*.js` 而不改生成源。
7. 把无头 SwiftShader 结果写成“已验证”。

## 11. 常见任务速查

| 任务 | 做法 |
|---|---|
| 新增或修改历史场景 | 改 `/workspace/gen/new/NN.yaml`（及英文分镜 `en/*.txt`），跑 `/workspace/gen/run.sh`；它会同步大纲、文档场景数、提示词、史源摘要、查看器数据并运行校验器 |
| 改美术风格 | 只改 `video/tools/art-style.mjs` 与 [art-style.md](./video/docs/art-style.md)，重跑提示词生成器；校验器会拦住没带新风格的提示词 |
| 新增引擎公共 API | 从 `src/index.ts` 导出，同步 `docs/NN-*.md` 与 `plan/10` 的状态（见 [docs/AGENTS.md §3](./docs/AGENTS.md#3-文档约定)） |
| 新增章节开场短片 | 按 §7：改 `/workspace/gen/chapter-videos/shots.txt` → `build_scripts.py --write`，静帧与片段放 `/workspace/chapter-video/<chapter>/v2/`，跑 `python3 video/tools/build-chapter-video.py <chapter>`（见 [chapter-videos.md](./video/docs/chapter-videos.md)） |
| 查看器截图 | 用无头 Chromium 打开 `file://…/video/viewer/index.html#<chapter>`，截场景页与“水墨视频提示词”面板 |
| 新增依赖 | 只允许 MIT / BSD / Apache / LGPL，登记到 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) |
