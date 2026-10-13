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
- 历史内容：`video/` 下 21 章（上古至清）、每章 5–30 个完整场景的剧情数据、史源摘要、开场分镜、音频提示、素材提示词与每场的水墨视频生成提示词，以及 `file://` 可直接打开的查看器 `video/viewer/index.html`。站点按四篇组织（战场、治国、人物、地理），朝代是篇内筛选，见 §12。
- 包管理：Yarn 4（`packageManager` 见 package.json）。`yarn.lock` 保持仓库原样，**不要提交对它的改动**（环境里的 Yarn 1 会改写 Yarn 4 锁，提交前还原）。

## 2. 目录速览

完整目录树与职责红线见 [docs/AGENTS.md §1](./docs/AGENTS.md#1-目录结构权威)。只记几个容易弄错的点：

| 路径 | 说明 |
|---|---|
| `src/` | 引擎源码，唯一公共出口 `src/index.ts`；不放示例数据，不 import `video/` |
| `apps/` | 示例页面，只依赖 `@inkgames/engine` |
| `video/data/chapters/*.json` | 章节数据（生成物，见 §4.3） |
| `video/data/pian/` | 四篇：定义、新场景、分类与提示词（见 §12） |
| `video/data/maps/` | 地名、场景落点、地图帧与示意疆域；由 `build-maps.mjs` 生成查看器地图 |
| `video/viewer/` | 查看器与 `data/*.js`（由 `build-viewer-data.mjs` 生成，`file://` 可用）；`data/pian/` 由 `build-pian.mjs` 生成 |
| `video/tools/` | 无依赖 Node 工具：`validate.mjs`、`art-style.mjs`、`build-video-prompts.mjs`、`build-art-prompts.mjs`、`build-source-digests.mjs`、`build-viewer-data.mjs`、`build-pian.mjs` |
| `video/sources/<chapter>/*.md` | 每场的原创史源摘要（只有短的公版古籍引文和书名卷次） |
| `thirdparty/` | 只读参考快照；大的克隆都在 [.gitignore](./.gitignore) 里 |
| `plan/` | `plan/10`（引擎计划）、`plan/11`（烽火内容站改版）、`plan/progress/`（进度记录）与 `plan/README.md` |

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
- 构图：侧视，地平线在下三分之一，三四层平涂灰阶，大量留白。页面图要有前中远三层，飞白可以破开外轮廓。
- 效果：只有命中或高潮才泼墨与朱红血雾，之后定格。页面静帧允许一处泼墨；场景视频镜头仍按原句，高潮才泼墨。
- 负面词：其他颜色、金色、精细纹理、CG 渐变、写实照片、3D、动漫脸、画面文字、**日本刀（武士刀）**、**细密皴纹**（后两项已写进 `NEG_STYLE_*`）。

### 5.1 强制：水墨简化版提示词

生成静帧、主图、横幅、卡片图、`videoPrompt` 与素材提示词时，必须套 [art-style.md §5](./video/docs/art-style.md) 的模板：共用正向 + 本类一句 + 共用负向。不要改色板、留白比例和红色上限。不要写角色名，不要把参照作品的图放进仓库或当作参考图。复杂城、山、天改成墨晕，不画实景。

墨分五层：焦 `#141414`、浓 `#3a3a3a`、重 `#6e6e6c`、淡 `#a8a8a4`、清 `#d2d1cc`，纸 `#eceae4`。朱砂 `#b3241c` 单帧不超过一成、一帧一处，只给血、旗、日、空白印。人物无五官，头身约 1:7。侧锋见棱角，飞白只跟动势。光是平的。

**共用正向：** 高反差黑白红武侠水墨剪影，简化版，暖宣纸底。复杂景物改成墨晕。人物侧视大剪影，无五官。地平线在下三分之一。

**共用负向：** 不要文字、印章里的字、金色、蓝青黄绿橙紫、写实、3D、动漫脸、五官、日本刀、现代建筑与器物、蒸汽机械、界画密线、细密皴纹、霓虹刀光、粒子和光斑。

**Shared positive:** High-contrast black-white-red wuxia ink silhouette, simplified, on warm xuan paper #eceae4. Replace complex scenery with ink wash. Side-view faceless silhouette. Horizon in the lower third.

**Shared negative:** No text, letters in seals, gold, blue, cyan, green, yellow, orange, purple, photograph, 3D, anime face, facial features, katana, modern objects, steampunk, dense ruled lines, dense texture strokes, neon blade light, particles, or lens flare. Vermilion under 10%, one place.

本类只追加一句（红的位置和上限写在句中）：

| 类 | 追加这一句 |
|---|---|
| 武将 | 肩宽，简单盔，甲只留大块，长兵器不与人相接。人高约五成。红只在旗或盔缨，不超过 6%。 |
| 刺客 | 偏瘦，斗笠压头，直剑收在身侧。人高四到五成，周围清墨。红不超过 3%，可以不用。 |
| 文士 | 瘦高宽袖，手藏袖中，不持兵器。左侧至少四成纸白。不用红。 |
| 女性 | 清瘦长裙，发髻只是一块形，不持兵器。红在裙裾或无字小印，不超过 4%。 |
| 帝王 | 简单高冠或冕旒，不持兵器，不戴西式尖冠。身后两根平涂柱。无字朱印不超过 6%。 |
| 山水 | 三四层平涂山，一条淡墨水，不画皴纹。上半几乎是纸。红不超过 2% 或不用。 |
| 城池 | 几块墙、一个门洞、屋顶一条斜线，无砖缝。素旗不超过 5%，旗上无字无徽记。 |
| 宫殿 | 柱、阶、檐是平涂块。无字朱印或帘边不超过 6%。 |
| 战场 | 成排剪影由焦到淡，矛竖着不相接。朱旗或落日不超过 8%。 |
| 夜景 | 纸仍是 `#eceae4`，不涂蓝黑。月是纸白圆，无光晕。灯火不超过 3%。 |
| 单挑 | 两人拉开，兵器离开对方身体，中间是纸和一条飞白。地上朱砂点不超过 8%。 |
| 军阵 | 只见阵，不见格斗。前排焦、后排淡。旗不超过 8%。 |
| 攻城 | 城是重墨块，人很小，云梯两条线，无人翻过垛口。城头红不超过 6%。 |
| 刺杀 | 一人将倒，另一人在三步外，剑尖不接触身体。斜向血雾不超过 8%。 |
| 主图宽 | 左半几乎空白。焦墨只在右侧四成：近景持矛武士，中景悬崖和烽火台，远景清墨山。烽火红不超过 6%。四边洇进纸。 |
| 横幅·战场 | 左半空白。右侧残阵：近一人、中成排、远烟和壁垒，矛不相接。朱旗不超过 8%。 |
| 横幅·治国 | 左半空白。右侧粗线棋局，不要十九路。一枚朱砂子不超过 6%。 |
| 横幅·人物 | 左半空白。右侧空龙座，龙是三四块大形，无鳞无金。无字印不超过 6%。 |
| 横幅·地理 | 左半空白。右侧关河：河、关门、穿门的路、两层远山。地平线一点红不超过 3%。 |
| 卡片 | 竖幅，头顶脚下都留纸。题材与同篇横幅相同，红的上限也相同。 |

English clause for the same row, in order: faceless general with weapon clear of any body; lean assassin, sword at the side; scholar, no weapon, empty paper on the left; woman, no weapon; ruler with a simple crown and two flat columns; flat mountain layers and one water stroke; wall blocks and one gate; flat palace blocks; ranks with upright spears; night kept on paper white, moon with no glow; two fighters apart; formation only; wall, small people, ladder of two lines; assassination with the sword not touching; wide hero, left half empty, spearman and beacon on the right; leftover ranks with upright spears; weiqi with a few thick strokes and one vermilion stone; empty dragon throne of three or four masses, no scales; pass, river and a road through the gate; vertical card, subject matching that banner.

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
3a. **流墨转场片段**（2026-10-11 起默认）：每对相邻镜头之间生成一段 3 s、720p、24 fps 的图生视频，`image_path` = 上一镜原始片段的末帧（`<ch>-last-NN.jpg`），参考图 = 下一镜原始片段的首帧，提示词模板：`Chinese ink-wash transition. Starting from <IMAGE_0>, the black ink of the scene melts and flows like ink dropped in water, swirling and spreading across the xuan paper, then the flowing ink gathers and settles into the exact composition of <IMAGE_1>, ending on <IMAGE_1>. One continuous fluid morph, no cut, no camera shake. Only black, grey, paper white and vermilion; no text, no modern elements.`。文件 `/workspace/chapter-video/<ch>/transitions/<ch>-tr-NN-MM.mp4`，记在剧本 `transitions`（`from`、`to`、`file`、`sourceFrames`、`prompt`，可选 `blendSec`、`trimStart`/`trimEnd`、`grade`）。
4. 逐帧调色锁回色板：`video/tools/chapter_grade.py`（灰阶 + 朱砂红，其余色相去色；可按镜 `grade.redScale` / `redMaskBelow`）。
5. 声音：edge-tts `zh-CN-YunjianNeural` 旁白，语速 rate −29%（2026-10-11 起，比原来的 −8% 慢约 1.3 倍，在合成时放慢，不做变速拉伸；`build-chapter-video.py --narration-rate` 可改）；原创程序合成的五声音阶配乐与按镜环境声（`video/tools/chapter_audio.py`，环境声名必须在其 `AMB` 表里）；旁白时配乐闪避，整轨 −16 LUFS、−1.5 dBTP，AAC 160k 立体声。
6. 合成：`python3 video/tools/build-chapter-video.py <ch>` —— 3 s 片名卡（朱印）→ 1.2 s 程序水墨洇染（`ink_transition.py`）→ 镜 1 → 流墨转场片段 → 镜 2 → … → 末镜 → 洇回空白纸面。**流墨转场**（默认 `--transition flow`）：转场片段与镜头一样先调色；镜 N 播完整个片段（放慢时也停在原末帧上），硬切进转场（转场首帧就是镜 N 末帧，`--flow-in-blend` 可加 ≤ 0.25 s 混合），转场最后 0.5 s（可按段 `blendSec`）柔和溶进镜 N+1 的开头；`--transition ink` 镜间也用程序洇染，`--transition fade` 退回旧的 0.7 s 交叉溶解。字幕烧在下三分之一，转场前淡出、转场后淡入；旁白只在本镜内，不进转场；配乐全程连续，环境声在转场里交叉淡化。末镜停 3 s，H.264 + AAC，**只出 mp4，不出 webm**；镜长按旁白伸长（见下“长度”），不截断旁白。
7. 写清单 `video/viewer/assets/chapter-videos/index.{json,js}`，查看器居中播放块（`file://` 可用）。

**规则**

- 色板与负面词同 §5；画面里不出现任何文字（字幕、片名、印章都是后期叠加）。
- **不出现现代元素**：所有提示词（静帧、动势、场景 `videoPrompt`、素材 `artPrompts`、`batch.jsonl`）的负面词都带 `no modern elements: no modern buildings, power lines, poles, roads, vehicles, glass, plastic, modern clothing, eyeglasses, watches, guns, electric lights, signs or lettering`（中文版见 `art-style.mjs` `NEG_MODERN_ZH`），校验器逐条检查；审片发现现代或时代错置的东西按变形镜头重生成。
- **不出现时代错置之物**（2026-10-11，据 22 段问题片段的审片）：负面词再带 `art-style.mjs` `negAnachronism(order)` 生成的一句——通用部分禁西式 / 尖顶王冠、礼帽、羽冠、尖顶兜帽、鸟居、日式建筑、武士刀、公路、登山杖、背包、飞机导弹、台灯灯罩灯泡、玻璃窗、玻璃马车、篷车、招牌匾额、旗上徽记、藏青天空与蓝 / 青 / 黄 / 橙色调；按朝代再禁佛塔与纸灯笼（到东汉）、线装书（到五代）、西洋帆船与蒸汽船（到明）。君王写简单高冠或冕旒，灯写青铜油灯一点朱红小火，船写平底木船篾席帆或楼船，车写两轮伞盖车，书写竹简。单镜额外负面词写在 `shots.txt` 第 7 列，用 `build_scripts.py --update-prompts` 刷新提示词（不动已出片章节的输出记录）；校验器检查每个提示词都带本章那一句。详见 [art-style.md §2.8](./video/docs/art-style.md)。
- `motionPrompt` 统一以 `keep his/her/their silhouette consistent, no morphing, no new figures, no text. Only black, grey, paper white and vermilion.` 结尾。
- 旁白 15–30 字，原创措辞，忠于场景数据与其史源；古籍只引短句。不用任何有版权的音乐或音效。
- **合成前的分段素材都留在 box、不提交**：静帧、镜头片段、转场片段、取出的首末帧、音频分轨等都放 `/workspace/chapter-video/<ch>/`（镜头在 `v2/`，转场在 `transitions/`，中间产物在 `v2/build/`），这样可以只重做某一段再重新拼接；仓库里只提交成片 mp4、海报、剧本和工具。合成前看接触表，**严重变形的镜头或转场重生成**（每段最多重试 2 次）；替换下来的旧件改名 `*-v2-old.*` 保留。

**长度**：镜数 = clamp(4 + ceil(场景数 / 2), 6, 16)，上古按 8 镜旧例。每镜片段 8 s，镜长 = max(片段长, 0.6 + 旁白时长 + 0.4 换气) s。流墨转场接在镜后、不重叠。超出 8 s 先放慢片段（minterpolate，最多 1.35 倍），仍不够再停末帧。校验器要求每镜 8–12.5 s。21 章都已按此出片。

**体积**：720p，每章 mp4 ≤ 30 MB。`build-chapter-video.py` 从 `--crf`（默认 28）起编码，放不下就加 CRF（最高 40），再取放得下的最低一档，写入剧本 `output.crf` 与 `output.sizeBytes`。不删镜、不缩短转场。

**校验器检查**：每份剧本的镜数符合公式、`sceneId` 属于本章且按时间线排序、`sourceShots` 在范围内、旁白 15–30 字、镜长 8–12.5 s（`clipSlowdown` ≤ 1.35）、`negative` / `imagePrompt` / `motionPrompt` 带现代元素禁令、`imagePrompt` 带风格块与负面词、`motionPrompt` 固定结尾、环境声已实现、`clip` 命名为 `<ch>-NN.mp4`；已合成的章节再查清单、文件与 30 MB 上限。

## 8. 三件套矩阵与推广路线（2026-10-10 定）

- 三件套：① 历史内容站「烽火」——`video/viewer/index.html` 改成水墨风格的公开内容站（不再是开发工具；开卷图 `video/viewer/assets/hero-fenghuo-wide.*` 与 `hero-fenghuo-m.*`）；② 每个场景用站内的分镜与 `videoPrompt` 做一支水墨短片；③ 用同一份内容做 InkGames 水墨游戏引擎，再用引擎做游戏。
- 推广路线：内容站 → 社交媒体短视频 → 游戏玩家。
- 三者共用 `video/data/` 与 [art-style.md](./video/docs/art-style.md)；站点的视觉同样只用黑白红色板，朱砂红只给印章、当前章节与少量强调。
- 内容站、短片和游戏都按四篇各做一条线（战场 / 治国 / 人物 / 地理）。范围、提示词、游戏类型和页面气质见 §12 与 [pian.md](./video/docs/pian.md)。

## 9. 现状

引擎已是 three.js + Matter.js。PixiJS、p5、Godot，以及按这些引擎迁移的步骤，都已作废，不要再做。历史内容在 `video/`，内容站按四篇。二十一朝开场短片已按 §7 出片。逐章重编码和旧的「本地提交，待审」记录以 git log 为准，不在这里维护。

## 10. 关键记忆与规则

**必须：**

1. 游戏文字一律原创。现代有版权的作品只按书名与卷/章引用，不抄段落；古籍只引短句并注明出处。
2. 没有可靠出处的民间故事标作“演义 / 异说 / 后世”，并在 `disc` 里说明来源与可信度。
3. `v1` 只标那 66 个首发场景。
4. `node video/tools/validate.mjs` 0 个错误，`./build.sh check` 全绿，才能提交或推送。
5. 视觉改动只交截图，必要时附改前改后对比。不要录屏。未在真实 GPU 上看过的结论写“未实测”。真实 GPU 验收在用户的 Mac 上。内容站版式以无头截图为准，字形在 Mac 上会不同（box 上没有楷体）。
6. 新 PR 一律以 `main` 为合并目标，不要把一个 PR 的分支再当成下一个 PR 的基线。小批量提交；提交作者用 `linkxzhou`。
7. 页面与图片遵循 §5 的简化版《影之刃》黑白红：宣纸 `#eceae4`、浓墨 `#141414`、灰阶、朱砂 `#b3241c` 不超过一成。提示词必须套 §5.1 的共用正负向和本类一句。内容站不用圆角卡片、投影、玻璃模糊；标题用楷体感字体、墨线分隔和朱印。页面底可以有很淡的纸纹和墨晕。首页横幅和篇横幅是同一个组件，图的四边渐隐进 `#eceae4`。
8. 章节视频按 §7：旁白 rate −29%（约慢 1.3 倍）、禁止现代元素和时代错置、镜头之间默认流墨转场。分镜静帧、镜头、转场和音频分轨留在本地 `/workspace/chapter-video/`，不提交；仓库只收成片 mp4、海报和剧本。
9. 多步任务按 plan-with-files 把进度记在 `plan/progress/<日期>-<任务>/` 的 `task_plan.md`、`findings.md`、`progress.md`。
10. 地图的海岸和大河用 Natural Earth（公有领域）。CHGIS / TGAZ 只用于人工在线核对，不下载、不抄坐标、不提交。

**禁止：**

1. 提交 PDF、语料原文或现代作品段落（`thirdparty/Chinese_History-master*` 已 gitignore）。
2. 提交大型第三方克隆（`thirdparty/inkField/`、`thirdparty/inkwash/` 等已 gitignore），修改 `thirdparty/` 下的快照。
3. 复制 inkField 的代码、shader、常量表或素材；inkEngine 的移植规则见 [docs/AGENTS.md §6](./docs/AGENTS.md#6-许可红线)。
4. 重新引入 PixiJS、p5 或第二套渲染库。
5. 在提示词里写《影之刃》角色名，或把其素材图片放进仓库。
6. 手改 `video/data/chapters/*.json`、`video/viewer/data/*.js` 或 `video/viewer/data/pian/` 而不改生成源。
7. 把无头 SwiftShader 结果写成“已验证”。
8. 提交改写过的 `yarn.lock`。
9. 把 CHGIS、TGAZ 或其它禁止再分发的地名库放进仓库。

## 11. 常见任务速查

| 任务 | 做法 |
|---|---|
| 新增或修改历史场景 | 改 `/workspace/gen/new/NN.yaml`（及英文分镜 `en/*.txt`），跑 `/workspace/gen/run.sh`；它会同步大纲、文档场景数、提示词、史源摘要、查看器数据并运行校验器 |
| 改美术风格 | 只改 `video/tools/art-style.mjs` 与 [art-style.md](./video/docs/art-style.md)，重跑提示词生成器；校验器会拦住没带新风格的提示词 |
| 新增引擎公共 API | 从 `src/index.ts` 导出，同步 `docs/NN-*.md` 与 `plan/10` 的状态（见 [docs/AGENTS.md §3](./docs/AGENTS.md#3-文档约定)） |
| 新增章节开场短片 | 按 §7：改 `/workspace/gen/chapter-videos/shots.txt` → `build_scripts.py --write`，静帧与片段放 `/workspace/chapter-video/<chapter>/v2/`，跑 `python3 video/tools/build-chapter-video.py <chapter>`（见 [chapter-videos.md](./video/docs/chapter-videos.md)）。若短片属于某一篇，镜头可标可选字段 `pian`，提示词按 §12 |
| 新增四篇场景或改归类 | 改 `video/data/pian/src/scenes/<pian>.json` 或 `src/overrides.json`，跑 `node video/tools/build-pian.mjs`（见 §12、[pian.md](./video/docs/pian.md)）。不要手改章节 JSON 来塞新场 |
| 改地图落点 | 改 `video/data/maps/places.json` 或 `scene-places.json`，跑 `node video/tools/build-maps.mjs`。重出图片再跑 `python3 video/tools/render-maps.py`。低置信保持 `placeless` 与待核验，不猜坐标。不要手改 `video/viewer/data/maps.js` |
| 查看器截图 | 用无头 Chromium 打开 `file://…/video/viewer/index.html#<chapter>`，截场景页与“水墨视频提示词”面板 |
| 重做内容站楷体子集 | 改完查看器文案或场景标题后跑 `./build.sh fonts`（`video/tools/subset-wenkai.mjs`）。只留霞鹜文楷 Medium 一份 woff2，缺字回退系统楷 |
| 多步任务规划（5+ 步） | 用 [plan-with-files](./skills/plan-with-files/SKILL.md) skill：计划文件放 `plan/progress/<date>-<task-slug>/`（`task_plan.md` / `findings.md` / `progress.md`），每阶段后更新，云端与本地 agent 共用 |
| 新增依赖 | 只允许 MIT / BSD / Apache / LGPL，登记到 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) |

## 12. 四篇（2026-10-12 定）

内容站首页先选篇，再在篇内用二十一朝筛选。细则、字段和操作步骤见 [video/docs/pian.md](./video/docs/pian.md)。这里只记不能破的规则。

**四条线**

| 篇 | 内容 | 短片与提示词 | 配乐 / 声响 | 游戏 | 页面 |
|---|---|---|---|---|---|
| 烽火：战场篇 | 战场上的战争 | 残阵与朱旗；军阵、旌旗、壁垒、攻城器械；不生成兵刃相接 | 战鼓、号角 | 动作 | 斜向笔锋，墨底，朱砂斜杠 |
| 烽火：治国篇 | 国策、改制、朝局 | 棋局；朝堂、奏疏、粮仓、渠堰、典章 | 钟、琴，庄严朝会 | 策略 | 格网、卷轴边栏、印章 |
| 烽火：人物篇 | 人物的一生和戏剧转折 | 龙座剪影 | 这个人的短动机反复 | 人物技能 | 竖幅肖像卡片 |
| 烽火：地理篇 | 河流、关隘、城址、路线如何塑造历史 | 关河；水墨地图、水系、边墙、行军路线 | 开阔长音 | 攻城夺城 | 长卷地形，灰山叠层 |

视觉仍只用黑白红色板，朱砂红不超过一成。提示词的风格参照、色板 Hex、运动约束、风格负面词、「不出现现代元素」和按朝代的「不出现时代错置之物」（`negAnachronism`）与 §5、§6 相同，由 `art-style.mjs` 写进每一篇的静帧、视频、配乐和声响。

**数据**

- 一场可有一个主篇和至多两个兼收。既有 316 场不改章节 JSON，分类写在 `video/data/pian/built/`。
- 新场景写在 `video/data/pian/src/scenes/<pian>.json`，id 为 `篇.朝代.短名`。叙事原创，出处标明正史或传说，书名加篇卷。每篇新场景主线至少 40。不要编造卷次。
- 改完源数据后只跑 `node video/tools/build-pian.mjs`。不要手改 `built/` 与 `video/viewer/data/pian/`。
- 开放全文和年号表可以在本地核对，不提交进仓库。非商业或许可不清的数据集不抄录、不随库分发。
- 朝代地图的海岸和大河来自 Natural Earth（公有领域）。成图由 `video/tools/render-maps.py` 合成并锁色板，文字不画进图片。CHGIS / TGAZ 只用于人工在线核对，不下载、不抄坐标、不提交。低置信落点保持待核验。

**短片**

已合成的章节开场短片保持朝代成片。篇页面只在选中一个朝代时播放它。以后为某一篇新做的镜头可在剧本里写可选 `pian`；缺省就是朝代片。校验器拒绝无效 id，不强迫旧镜头补标。
