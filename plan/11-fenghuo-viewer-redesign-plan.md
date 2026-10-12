# 11 · 烽火内容站（video/viewer/index.html）改版计划：水墨图片化、居中修正、朝代轴压缩、朝代地图

状态：**已批准，按 §5 分四个 PR 实施**（2026-10-12）。本文是规格。实施时以本文为准，并同步 [plan/README.md](./README.md)、根目录 [AGENTS.md](../AGENTS.md) §8/§12 与 [video/README.md](../video/README.md)。

- 对象：`video/viewer/index.html`（1251 行，内联 CSS 第 9–288 行，脚本第 384 行起）、`video/viewer/pian.css`（120 行）、`video/viewer/assets/`、`video/viewer/data/`（生成物，不手改）。
- 依据：main `9063073`（PR #9 四篇改版合并后）；美术见 [video/docs/art-style.md](../video/docs/art-style.md)；四篇规则见 AGENTS.md §12 与 [pian.md](../video/docs/pian.md)。
- 现状截图：box 上 `/workspace/review/viewer-plan/`（无头 Chrome，1440×900 与 390×844；首页 + 四篇 + 选中秦）。box 上没有楷体，楷体回退为 Noto Serif CJK，Mac 上字形会不同，但版式问题一致。
- 编号说明：`plan/11-*`、`plan/12-*` 原来的文件已在 2026-10-10 迁到 `video/`，编号空出，本文取 11。
- 验收：**只用截图**（用户明确不要录屏）。AGENTS.md §10 第 5 条写的是“截图与录屏”，本计划按用户要求只交截图；实施 PR 里应把第 5 条改成“视觉类工作附并排对比截图；录屏按需”。

---

## 0. 现状诊断（截图核对）

| # | 现象 | 截图 | 根因（文件:行） |
|---|---|---|---|
| D1 | 全页墨渍斑点压在正文和卡片下，场景页像“脏纸” | `zhiguo-qin-desktop-scene.png` | `html::before` 整页 `paper-ink-stains` 透明度 .28（index.html:46）＋ `body::before/::after` 两块角落墨渍（:47–49） |
| D2 | 四张篇卡四种版式（墨底斜杠 / 格网居中 / 圆加梯形“i”字小人 / 三层灰山），彼此不成体系；人物卡的小人像信息图标 | `home-desktop-full.png` | pian.css:17–37 每篇各写一套；`SILHOUETTE`、`MAP_SVG`（index.html:435–437）是程序画的占位 |
| D3 | 篇页先列出全部场景卡，场景详情被推到很下面：页面高度 战场 10677 px、治国 19012、人物 20600、地理 32860（桌面）；人物篇手机 **70217 px** | `metrics.json`、`zhanchang-desktop-full.png` | `renderPianList()`（:537）在“全部朝代”下把本篇所有场景按朝代全部渲染，场景详情 `#scene` 接在列表后 |
| D4 | 朝代长卷在 1440 宽下仍出横向滚动条，“清”被切掉一半 | `zhanchang-desktop-dynasties.png` | 22 个按钮 `flex:1 0 54px`（:105）→ 22×54+4 = 1192 px > 内容宽 1160 px；手机 1192 vs 358 |
| D5 | 朝代年份丢了“前”：夏显示 2070、商 1600、西周 1046，看起来像公元 | 同上 | `spanShort()`（:827）正则 `前?\d+` 不认 `前 2070` 中间的空格 |
| D6 | 场景详情里漏出开发字段：`场景 id qin.shuwen`、`玩法模板 calligraphy`、道具 `figure / banner`、解锁 `event.shuwen`、出处标签 `canon / classic` | `zhiguo-qin-desktop-scene.png`、`zhiguo-qin-mobile-secnav-overlap.png` | `renderInfo()` :869、:870、:882；`srcText()` :428 直接输出 `s.kind` |
| D7 | 手机上场景内导航条 `#secnav` 钻到顶栏下面看不见 | `zhiguo-qin-mobile-secnav-overlap.png` | 顶栏在 ≤720 px 换成两行，实测高 92.75 px；`#secnav{top:50px}`（:270）仍按单行写 |
| D8 | 战场篇斜切卡片里各行左缘参差（次行比标题偏出几像素） | `crop-zhanchang-cards.png` | pian.css:66–67 每个子元素各自 `skewX(7deg)` 反斜，绕各自中心变换 |
| D9 | 人物篇卡片顶部“上古 · 新场”压在小人图标上 | `crop-renwu-top.png` | pian.css:77–79：图标 `top:10px;height:58px`，文字 `padding-top:28px` 起排 |
| D10 | 篇横幅四种结构：战场有 kicker“烽火”，其他没有；战场的朱砂斜杠穿过正文；地理篇标题贴着顶栏 | `zhanchang-desktop-top.png`、`crop-dili-top.png` | `renderBanner()`（:504–522）四个分支各拼一套；pian.css:41–55 |
| D11 | 篇页“本章”区：大号空心字（战/06）下面挤着“只看主线”，右侧计数孤零零飘在另一条基线 | `zhiguo-qin-desktop-chapter.png` | `.ch-head`（:128）与 `#pianTools`（pian.css:57）是两块互不对齐的东西 |
| D12 | 多处文字没有上下 / 左右居中（见 §2，含实测像素） | 多张 | 见 §2 |

---

## 1. 页面整理与水墨图片化（反馈 1）

### 1.1 原则

1. **一屏一个主角**：首页主角是开卷图，篇页主角是篇横幅（地理篇是地图），场景页主角是标题。其余元素降一级。
2. **图片承担气氛，HTML 承担文字**。所有字（标题、地名、印文、按钮字）都是 HTML 叠在图上，生成图里不放任何文字（AGENTS.md §6：生成的印章字、题字是乱码）。
3. **纹理减量**：纸纹只留一层很淡的纤维，墨渍只出现在“画框”里（开卷图、横幅、卡片图），不再铺在正文下面。
4. **四篇同骨架、异图像**：卡片和横幅的 DOM 结构统一，篇的差异由图片和一个 motif（朱砂斜杠 / 印 / 竖幅 / 山线）表达。
5. 只用色板七色；朱砂红每屏面积 < 10%，一屏最多两处红（当前篇标记 + 一处图中红）。

### 1.2 线框：首页（桌面 1440）

现状：

```text
+------------------------------------------------------------------------------+
| [seal]FengHuo  [z]Zhan [z]Zhi [r]Ren [d]Di                                   |  <- sticky bar 54px
+------------------------------------------------------------------------------+
| kicker                                  .  .  hero image (masked, 52% wide)  |
| FENG HUO  [4-char seal]            .  ink blot     smoke   /|  warrior       |
| subtitle                                  great wall    /  |                 |
| ===brush===                           .                                      |
| paragraph paragraph paragraph   . ink blots spread behind text .             |
| 4  21  493                                                                   |
| [choose] [random]                                                            |
+--------------------- hr cuts through image bottom ---------------------------+
| SI PIAN                                       right-aligned tiny caption     |
| ===brush===                                                                  |
| +--------------+ +--------------+ +--------------+ +--------------+          |
| |black + red / | | grid, centred| | text   ( o ) | | text         |          |
| |  slash     /  | |   [seal]     | |        |   | | |              |          |
| | ZHANCHANG /   | |  ZHIGUO      | | RENWU  |___| | | DILI  ~~~~~~ |          |
| | text     /    | |  text        | | text   "i"   | | ^^^ grey hills|         |
| +--------------+ +--------------+ +--------------+ +--------------+          |
|   4 cards = 4 different layouts; ink blots behind everything                 |
+------------------------------------------------------------------------------+
```

改版后：

```text
+------------------------------------------------------------------------------+
| [seal]FengHuo     Zhan  Zhi  Ren  Di                         [search later]  |  bar 56px, one line
+------------------------------------------------------------------------------+
|                                   |##########################################|
|  kicker (12px, mid grey)          |#  IMG hero-fenghuo-wide (2400x1000)     #|
|                                   |#  left 40% of the image is empty paper, #|
|  FENG HUO   [seal-frame IMG]      |#  so no CSS mask is needed              #|
|  subtitle                         |#        smoke  /|  warrior silhouette   #|
|  [IMG divider-brush]              |#  wall ~~~~~~~~ |                       #|
|  one short paragraph (2 lines)    |##########################################|
|  4 pian | 21 dyn | 493 scenes     |                                          |
|  [IMG btn-ink] choose   random    |                                          |
+------------------------------------------------------------------------------+
|  [IMG divider-mountain: faint grey ridge line, full width, 120px]            |
|  SI PIAN                                         caption on same baseline    |
|  +-------------+  +-------------+  +-------------+  +-------------+          |
|  |IMG 4:5      |  |IMG 4:5      |  |IMG 4:5      |  |IMG 4:5      |          |
|  |army banners |  |court, slips |  |one faceless |  |river, ridge |          |
|  |red sun      |  |red seal     |  |silhouette   |  |aerial ink   |          |
|  |-------------|  |-------------|  |-------------|  |-------------|          |
|  |[seal] ZHAN  |  |[seal] ZHI   |  |[seal] REN   |  |[seal] DI    |          |
|  |genre . n    |  |genre . n    |  |genre . n    |  |genre . n    |          |
|  |scope 2 line |  |scope 2 line |  |scope 2 line |  |scope 2 line |          |
|  +-------------+  +-------------+  +-------------+  +-------------+          |
|  same skeleton; difference = image + one motif line at card bottom           |
+------------------------------------------------------------------------------+
| [IMG footer-mountains, 200px, fades into paper]                 footer text  |
+------------------------------------------------------------------------------+
```

图例：`IMG` = 新的水墨图片；`seal` = HTML 文字叠在 `seal-frame` 印框图上。

### 1.3 线框：首页（手机 390）

```text
BEFORE                                 AFTER
+----------------------------+         +----------------------------+
|[s]FengHuo                  |         |[s]FengHuo        [=] menu  |  one row 52px
|[z]Zhan [z]Zhi [r]Ren [d]Di |  92px   +----------------------------+
+----------------------------+         |IMG hero-fenghuo-m (1:1)    |
| hero image 16:9 (masked)   |         |  warrior / beacon          |
|  ink blots                 |         |                            |
| kicker                     |         |  FENG HUO  [seal]          |  title over the
| FENG HUO [seal 4 chars,    |         |  subtitle                  |  empty paper area
|  reads oddly]              |         +----------------------------+
| subtitle                   |         | 4 | 21 | 493               |
| paragraph 4 lines          |         | [choose]  [random]         |
| 4 21 493                   |         +----------------------------+
| [choose][random]           |         | +------------------------+ |
| SI PIAN                    |         | |IMG 16:9 crop of card   | |
| +------------------------+ |         | |[seal] ZHAN  genre      | |
| | black card, red slash  | |         | |scope 1 line            | |
| | ...                    | |         | +------------------------+ |
| +------------------------+ |         | (x4, same skeleton)        |
+----------------------------+         +----------------------------+
```

手机端四篇导航收进顶栏右侧菜单（或做成横向四格 tab 放在首屏下方），顶栏保持一行，顺带解决 D7。

### 1.4 线框：篇页（桌面 1440，以治国篇 · 选中“秦”为例）

现状：

```text
+------------------------------------------------------------------------------+
| bar                                              ch [06 Qin v]  sc [.... v]  |
+------------------------------------------------------------------------------+
| BANNER: 4 different structures (black+slash / double frame / sil / hills)    |
+------------------------------------------------------------------------------+
| ER SHI YI CHAO                                          caption              |
| [ALL] shang xia shang xizhou ... ming  qi|  <- cut off, horizontal scrollbar  |
| <=================== scrollbar ======================>                       |
+------------------------------------------------------------------------------+
|  06 (huge outline)  QIN                                                      |
|  [ ] primary only   span . n scenes                    count (far right)     |
|  ====brush====                                                               |
|  [ chapter video 16:9 ]                                                      |
|  [card][card][card]   <- "all dynasties": 170 cards here, 19 000 px          |
|  [card][card][card]                                                          |
|  ...                                                                         |
+------------------------------------------------------------------------------+
|  scene head: TITLE                                    [seal off-centre]      |
|  secnav: summary people tree shots video audio art prompt                    |
|  summary: "scene id qin.shuwen  template calligraphy  props figure banner"   |
|  ...                                                                         |
+------------------------------------------------------------------------------+
```

改版后：

```text
+------------------------------------------------------------------------------+
| bar: [seal]FengHuo  Zhan [Zhi] Ren Di                  ch [Qin v] sc [.. v]  |
+------------------------------------------------------------------------------+
| BANNER (one skeleton, 220px)                                                 |
| kicker . ZHIGUO PIAN                    |IMG banner-zhiguo 2400x600 (right) | |
| lead 1 line . genre . n scenes          |  court silhouettes, red seal      | |
+------------------------------------------------------------------------------+
| TIMELINE (22 columns, fits 1160px, no scrollbar; see section 3)              |
| ALL sg xia sh xz cq zg [QIN] xh dh sg lj nb sui tang wd bs ljn ns yuan ming qg|
| -o---o---o--o--o--o--o--[*]--o--o--o--o--o--o---o---o--o---o---o---o---o---o-|
+------------------------------------------------------------------------------+
| CHAPTER BAR:  QIN  -221 ~ -207 . 6 of 10 scenes    [x] primary only  [Map|List]|
+--------------------------------------+---------------------------------------+
| MAP (section 4)                      | SCENE LIST (compact rows)             |
|  IMG map-qin.webp + HTML markers     |  > Shu tong wen      -221   primary   |
|   (o) Xianyang  [*] Langya ...       |    Fen shu keng ru   -213   also      |
|                                      |    ...                                |
+--------------------------------------+---------------------------------------+
| [ chapter video, collapsible "play opening film" ]                           |
+------------------------------------------------------------------------------+
| SCENE  (opens below, or as its own state #sc=...; back link "<- Qin")        |
|  eyebrow                                       [seal 2x2 grid, centred]      |
|  TITLE / subtitle / when                                                     |
|  secnav (sticky, under bar)                                                  |
|  summary: time . entry -> exit . fork . sources (zh labels only)             |
+------------------------------------------------------------------------------+
```

“全部朝代”状态下不再把全部场景平铺：每朝一行，只显示前 4 张 + “展开其余 N 场”；地理篇在“全部”状态显示 21 张小地图组成的选朝网格（§4.7）。

### 1.5 线框：篇页（手机 390）

```text
BEFORE                                 AFTER
+----------------------------+         +----------------------------+
| bar (2 rows, 93px)         |         | bar (1 row, 52px)          |
+----------------------------+         +----------------------------+
| BANNER black, slash        |         | BANNER 160px, IMG 16:9 crop|
| text crossing red slash    |         | ZHIGUO PIAN . 170 scenes   |
+----------------------------+         +----------------------------+
| ER SHI YI CHAO             |         | DYNASTY GRID 7 x 3 (+ ALL) |
| [ALL] sg xia sh xz cq ->   |         | [ALL                     ] |
| <==== scrollbar ======>    |         | [sg][xia][sh][xz][cq][zg][qin]
+----------------------------+         | [xh][dh][sg][lj][nb][sui][tang]
| ZHI (outline) ZHIGUO       |         | [wd][bs][ljn][ns][yuan][ming][qing]
| [ ] primary only  count    |         +----------------------------+
| [card]                     |         | QIN . 6 scenes  [Map|List] |
| [card]   x 170 ...         |         | MAP full width (tap marker |
| [card]   38 000 px page    |         |  -> bottom sheet)          |
| ...                        |         | rows: title . year         |
| secnav hidden under bar    |         +----------------------------+
+----------------------------+         | scene ...  secnav top:52px |
                                       +----------------------------+
```

### 1.6 哪些元素换成水墨图片

```text
+---------------------------- page ----------------------------+
| [A] seal-frame (brand)                                       |
| [B] hero-fenghuo-wide / hero-fenghuo-m                       |
|     [C] divider-brush (under titles)   [D] btn-ink (primary) |
| [E] divider-mountain (section break)                         |
| [F] pian-<id> x4 (card images)                               |
| [G] banner-<id> x4 (pian page banner)                        |
| [H] timeline-rod + timeline-node sprite (dynasty axis)       |
| [I] map-<chapter> x21 (section 4) + map sprite kit           |
| [J] empty-ink-boat (no scene in this dynasty for this pian)  |
| [K] loading-ink-drop (pack / chapter loading)                |
| [L] paper-fiber (page background, replaces paper-ink-stains) |
| [M] seal-frame square / tall (all seals: scene, video, pian) |
| [N] footer-mountains                                         |
+--------------------------------------------------------------+
```

保留为 CSS / SVG、**不**做成图片的：正文与表格、剧情树与人物关系图的节点和连线（要可读、要随数据变）、音频泳道、提示词面板、选择框。原因：这些是信息，不是气氛；做成图会糊、不可选、不可缩放。

### 1.7 素材清单（含尺寸、体积上限与生成提示词）

**通用风格尾巴**：每条提示词的正文后面都要接下面这段（实施时由 `art-style.mjs` 的 `STYLE_*`、`PALETTE_*`、`NEG_STYLE_*`、`NEG_MODERN_*` 拼出，不手抄；这里写出来是为了能直接拿去生成）：

- 中文尾巴：`画风：高反差黑白红武侠水墨剪影风（类《影之刃》，简化版）——纸白宣纸底，大块平涂与剪影，粗笔棱角边缘，枯笔飞白，少纹理、大面积留白；色板只用墨黑 #141414、焦灰 #3a3a3a、中灰 #6e6e6c、淡灰 #a8a8a4、雾灰 #d2d1cc、纸白 #eceae4、朱砂红 #b3241c；朱砂红面积不超过一成。负面：全彩，多色，金色高光，CG 渐变，写实照片，3D，动漫脸，细密皴纹，日本刀；画面内不出现任何文字、印章字、签名、水印；不出现任何现代元素：现代建筑、电线、电线杆、公路、车辆、玻璃、塑料、现代服饰、眼镜、手表、枪械、电灯、招牌或文字标识。`
- English tail: `in the style of high-contrast black-white-red wuxia ink silhouette art (Shadow-Blade-like, simplified): paper-white xuan ground, big flat shapes and silhouettes, bold angular brush edges, dry-brush flying-white, minimal texture, generous empty space; strict palette ink black #141414, charcoal #3a3a3a, mid grey #6e6e6c, pale grey #a8a8a4, fog grey #d2d1cc, paper white #eceae4, vermilion #b3241c, vermilion under 10% of the image. Negative: full colour, gold highlights, gradient-heavy CG, photo, 3D, anime faces, dense cun texture strokes, katana; no text, no seal characters, no signature, no watermark; no modern elements: no modern buildings, power lines, poles, roads, vehicles, glass, plastic, modern clothing, eyeglasses, watches, guns, electric lights, signs or lettering.`
- 带人物、建筑的图再接 `negAnachronism(order)`（首页与篇图用秦汉之前也不出错的通用写法：简单高冠、竹简、素面旗）。
- 透明底素材（标 α）：先在纯纸白底上生成，再用 `video/tools/` 新增的去底脚本按亮度抠成 alpha（纸白 → 透明），不要让模型直接出透明底。

| ID | 文件（`video/viewer/assets/`） | 用途 | 尺寸 | 上限 | 中文提示词（正文） | English prompt (body) |
|---|---|---|---|---|---|---|
| B1 | `hero-fenghuo-wide.webp`（+`.jpg`） | 首页开卷，桌面 | 2400×1000 | 220 KB | 横幅长卷构图，左侧四成是空白纸面；右侧群山上的长城，一座烽火台燃起朱红烽火，黑色狼烟斜向升起；最右悬崖上一名持长矛的武士黑色剪影背对观者；远山三层灰阶雾化。 | Wide scroll composition with the left 40% left as empty paper; on the right a great wall over layered mountains, one beacon tower burning a vermilion fire with black smoke rising diagonally; at far right a black silhouette of a spearman on a cliff, back to the viewer; three grey layers of misty far mountains. |
| B2 | `hero-fenghuo-m.webp` | 首页开卷，手机 | 1080×1080 | 120 KB | 方构图：上半是烽火台与斜升的狼烟、朱红烽火，下半三成是空白纸面留给标题；右下一名持矛武士小剪影。 | Square composition: upper half a beacon tower with vermilion fire and diagonal smoke, lower 30% empty paper reserved for the title; a small spearman silhouette at lower right. |
| F1 | `pian-zhanchang.webp` | 战场篇卡 | 800×1000 | 70 KB | 竖幅：低地平线上成排的军阵剪影由黑到灰退远，长戟如林，几面素面战旗，天边一轮朱红落日，前景斜向一道干笔扫过。 | Portrait: rows of army silhouettes receding from black to grey on a low horizon, a forest of halberds, a few plain banners, a vermilion setting sun, one diagonal dry-brush sweep in the foreground. |
| F2 | `pian-zhiguo.webp` | 治国篇卡 | 800×1000 | 70 KB | 竖幅：大殿台阶与殿柱的平涂剪影，阶下两列文臣剪影持笏俯首，前景一案竹简捆扎成卷，案角一方空白朱砂印（无字）。 | Portrait: flat silhouettes of palace steps and pillars, two rows of officials bowing with tablets below the steps, a desk of tied bamboo slips in the foreground, a blank vermilion seal (no characters) at the desk corner. |
| F3 | `pian-renwu.webp` | 人物篇卡 | 800×1000 | 70 KB | 竖幅肖像：一位宽袖高冠文士的半身黑色剪影，无五官，侧身回望，衣袖枯笔飞白；背后一层淡灰远山与大面积留白；肩后一小点朱红（衣带）。 | Portrait: a half-length black silhouette of a scholar in wide sleeves and a simple tall cap, no facial features, turning to look back, dry-brush sleeves; one pale grey mountain layer and lots of empty paper; a tiny vermilion sash accent. |
| F4 | `pian-dili.webp` | 地理篇卡 | 800×1000 | 70 KB | 竖幅俯瞰：一条大河以长横湿笔蜿蜒穿过群山块面，山脊用三层灰阶，河湾处一座小城墙剪影，一条细墨点线行军路线，起点一点朱红。 | Portrait bird's-eye view: a great river in long wet horizontal strokes winding through block-shaped ridges in three greys, a tiny walled town at a bend, a thin dotted ink march route starting from one vermilion dot. |
| G1–G4 | `banner-zhanchang/zhiguo/renwu/dili.webp` | 篇横幅 | 2400×600 | 各 130 KB | 同 F1–F4 主题，改成超宽横幅：左侧五成为空白纸面（放标题），主体在右三分之一，地平线在下三分之一。 | Same subjects as F1–F4 as an ultra-wide banner: left 50% empty paper for the title, subject in the right third, horizon in the lower third. |
| C1 | `divider-brush.webp` α | 标题下笔触 | 1200×40 | 12 KB | 一笔横向浓墨，起笔顿、收笔飞白，中段略细。 | A single horizontal stroke of thick ink, pressed start, flying-white finish, slightly thinner in the middle. |
| E1 | `divider-mountain.webp` α | 区块分隔 | 2400×120 | 35 KB | 一条极淡的雾灰远山脊线横贯画面，两端渐隐入纸白。 | One very faint fog-grey mountain ridge line across the whole width, fading into paper at both ends. |
| D1 | `btn-ink.webp` α | 主按钮底 | 480×96 | 12 KB | 一块横向浓墨刷块，边缘干笔毛糙，四角不规则。 | A horizontal block of thick ink brushed in one pass, dry ragged edges, irregular corners. |
| M1 | `seal-frame-square.webp` α | 方印底（字由 HTML 叠） | 256×256 | 18 KB | 一方空白朱砂印泥印面，边缘有残缺与不均匀的印泥，印面内无字。 | A blank vermilion seal impression, chipped edges and uneven paste, no characters inside. |
| M2 | `seal-frame-tall.webp` α | 竖长印（开卷、当前朝） | 128×256 | 14 KB | 同上，竖长方形。 | Same, tall rectangle. |
| H1 | `timeline-rod.webp` α | 朝代轴横杆 | 2400×24 | 16 KB | 一笔极长的横向墨线，粗细有轻微起伏，两端枯笔。 | One very long horizontal ink line with slight thickness variation, dry-brush ends. |
| H2 | `timeline-node.webp` α | 轴上节点精灵图 | 192×64（3 格：常态 / 悬停 / 当前） | 8 KB | 三个并排的墨点：一个小淡墨点、一个浓墨点、一个朱砂墨点，边缘自然晕开。 | Three ink dots side by side: a small pale one, a dense black one, a vermilion one, edges softly bleeding. |
| J1 | `empty-ink-boat.webp` α | 空状态（本篇本朝无场景） | 600×360 | 30 KB | 大片留白的水面上一叶小舟剪影，舟上一人垂钓，水面两三道淡灰横笔。 | A small boat silhouette with one angler on a vast empty water surface, two or three pale grey horizontal strokes. |
| K1 | `loading-ink-drop.webp` α | 载入中 | 256×256 | 12 KB | 一滴墨落在纸上刚刚晕开的圆形墨迹，中心浓、外圈淡。 | A drop of ink just landed on paper and spreading, dense centre, pale rim. |
| L1 | `paper-fiber.webp` | 页面底纹（可平铺） | 1024×1024 | 60 KB | 无缝平铺的宣纸纤维纹理，极淡，纸白底上只有雾灰细纤维，不要墨渍。 | Seamless tileable xuan paper fibre texture, very faint, only fog-grey fibres on paper white, no ink stains. |
| N1 | `footer-mountains.webp` α | 页脚 | 2400×200 | 40 KB | 页脚横幅：两层淡灰远山剪影从下方升起，上缘渐隐于纸白。 | Footer strip: two layers of pale grey mountain silhouettes rising from the bottom, top edge fading into paper. |

**替换 / 退役**：`paper-ink-stains.*`（D1 根因）、`ink-blot-corner.*` 停用；`fenghuo-hero.*` 由 B1/B2 取代（保留文件一个版本以防回退）；`ink-black-panel`、`vermilion-seal-fill`、`vermilion-brush-bar` 保留（按钮悬停、印、当前卡底线）。

**体积预算**

| 场景 | 预算 | 组成 |
|---|---|---|
| 首页首屏 | ≤ 550 KB | B1 220 + F1–F4 4×70 + C1/D1/M1 ≈ 40 |
| 篇页首屏（不含地图） | ≤ 300 KB | G 130 + H1/H2 24 + E1 35 + 印 30 |
| 地图（§4） | 每朝桌面 ≤ 160 KB、手机 ≤ 60 KB；21 朝合计 ≤ 4.6 MB，按需加载 | |
| 站点外壳新图合计 | ≤ 1.6 MB | 不含地图与章节短片 |

所有图同时出 `.webp` 与 `.jpg` 兜底（沿用 `image-set()` 写法与 `@supports not` 回退，index.html:32–37、:285–287）；α 图出 webp（带透明）+ png 兜底。全部是相对路径，`file://` 可用。

### 1.8 层级、间距、字号的整理

- **间距刻度**：只用 4 / 8 / 12 / 16 / 24 / 32 / 48 / 72 px，写成 `--s1…--s8`；区块之间 72（桌面）/ 48（手机），区块标题与内容 16，卡片内 12。
- **字号刻度**（楷体用于标题与印，宋体用于正文）：48–108 开卷标题 / 40–64 场景标题 / 28–34 区块标题 / 20 卡片标题 / 15 正文 / 13 说明 / 12 标签。去掉 11 px 及以下的字（现在 `.yr`、`.ct`、`.sc .n`、`.ncamp` 是 10–11 px，手机上几乎读不出）。
- **字距**：横排标题 `letter-spacing` 统一 ≤ .12em；居中或右对齐的字一律补偿尾随字距（§2 通则）。
- **颜色层级**：正文墨黑、说明中灰、禁用淡灰；朱砂只给当前篇、当前朝、当前场景与印。
- **去掉开发信息**（D6）：`场景 id`、`玩法模板`、英文道具名、解锁 id 移到 `?dev=1` 才显示；出处标签 `canon/classic/legend` 改中文“正史 / 经典 / 演义”；`audioMeta` 的 bgm/amb/vo/sfx 英文缩写同样只在 dev 模式出现。
- **篇页信息架构**（D3）：“全部朝代”只出朝代分组摘要（每朝前 4 张 + 展开）；选中一朝才出完整列表与地图；场景详情打开后可用“← 返回秦”回到列表位置。目标页高：任何篇页首屏到场景标题 ≤ 2 屏（选中一朝时）。
- **背景**（D1）：`html::before` 改 `paper-fiber` 平铺、透明度 .5 以内且纹理本身极淡；删 `body::before/::after` 角落墨渍；横幅和卡片图自带的墨气足够。

---

## 2. 文字未上下 / 左右居中（反馈 2）

实测方法：无头 Chrome 里对每个元素取文本节点的 `Range.getClientRects()`，算文字外框到元素边框四边的距离（gapL/gapR/gapT/gapB）。差值 > 1 px 视为不居中。数据在 `/workspace/review/viewer-plan/measure.js` 的输出里。

**通则（先做）**：中文标题普遍用了 `letter-spacing`，浏览器把字距加在**每个字后面**，最后一个字后面也有，所以居中文字整体左移（横排）或上移（竖排）半个字距。统一处理：

```css
/* 需要居中的、带字距的文字：在起始侧补同样的字距 */
.ls-center{ padding-inline-start: var(--ls); letter-spacing: var(--ls); }
/* 竖排 */
.ls-center-v{ padding-block-start: var(--ls); letter-spacing: var(--ls); }
```

| # | 位置 | 实测 / 现象 | 修法 |
|---|---|---|---|
| C1 | `.seal-l` 开卷印“正史野史”（index.html:77，HTML :308） | 67×67 印内 gapT 4.4 / gapB 16.2，**偏上 6 px**；左右 7.8 / 6.2。竖排 4 字靠 `writing-mode:vertical-rl`＋固定宽高＋`letter-spacing:.05em` 挤出两列，行盒高度不等于印面 | 改成显式 2×2 网格：`<span class="seal seal-4"><i>正</i><i>史</i><i>野</i><i>史</i></span>`，`.seal-4{display:grid;grid-template:1fr 1fr/1fr 1fr;grid-auto-flow:column;direction:rtl;place-items:center;letter-spacing:0;line-height:1}`，子项 `direction:ltr`。底图换 M1 |
| C2 | `.scene-head .seal-m` 场景印（:158、:278，JS :858） | 4 字印“书同文字”gapT 0.3 / gapB 18.3，**偏上 9 px**；2 字印“开卷”居中正常 | 同 C1，JS 按字数出 1 / 2 / 4 格网格（3 字补成 2+1 居中） |
| C3 | `#chapTabs button.active .nm` 当前朝代朱印（:106、:112） | 印块固定 104 px 高，单字“秦”贴在最底：gapT 75.6 / gapB 6——一长条红块里只有底部一个字 | 当前态的红底只包住文字：把红底挪到 `.nm > span`，`span{padding:4px 3px}`，高度随字数；同时 §3 把 `.nm` 高度从 104 改为按最长 3 字计算 |
| C4 | `#chapTabs .nm` 常态（:106） | 竖排 20 px 字放在 20 px 宽盒里，gapL −4 / gapR −5（字溢出盒子）；`justify-content:flex-end` 把尾随字距留在底部，名字离菱形节点忽近忽远 | 列宽改由 grid 决定（§3），`.nm` 去掉 `height:104px`，用 `.ls-center-v`；名字底部到节点固定 8 px |
| C5 | `.btn`（:86） | `inline-flex; align-items:center` 但没有 `justify-content:center`；楷体 16 px＋`.12em` 字距，右侧多 1.9 px；gapT 9 / gapB 10 | 加 `justify-content:center; line-height:1`，套 `.ls-center`；有固定宽度时（手机两按钮等宽）才不会偏 |
| C6 | `.tabs button`、`.seg-h button`（:233） | 30 px 高按钮 gapT 5.1 / gapB 6.9，文字偏上 0.9 px（普通 block + 行高 1.75 的半行距不对称） | `display:inline-flex;align-items:center;justify-content:center;line-height:1` |
| C7 | `.pian-card.zhiguo` 的 `h3 / .pk / .pg`（pian.css:25–27） | 居中对齐，但字距 .14 / .28 / .2em 未补偿：分别左偏 2.4 / 1.7 / 1.4 px；且四张卡只有这一张居中，其余左对齐 | 新卡片骨架统一左对齐（§1.2）；若保留居中，套 `.ls-center` |
| C8 | 人物篇场景卡 `.sc`（pian.css:77–79） | 文字居中，但 `.n`（“上古 · 新场”）从 28 px 起排，压在 10–68 px 的小人图标上（D9） | 卡片改为上下两段 grid：`grid-template-rows:72px auto`，图标在第一行居中，文字全部在第二行；或去掉图标改用 F3 缩略图 |
| C9 | 战场篇斜切卡 `.sc > *`（pian.css:66–67） | 每个子元素各自反斜，左缘参差 2–4 px（D8） | 只包一层：`<button class="sc"><span class="sc-in">…</span></button>`，`.sc{transform:skewX(-7deg)}`、`.sc-in{display:block;transform:skewX(7deg)}`；子元素不再单独变换 |
| C10 | `.sec-h`（:99–101） | 标题与右侧说明 `align-items:flex-end`：楷体 34 px 行高 1.2 与 13 px 说明底边对齐而不是基线对齐，说明看起来“掉下去” | `align-items:baseline` |
| C11 | `.ch-head` + `#pianTools`（:128、pian.css:57） | 大号空心“06 / 战”与名称底对齐，下一行“只看主线”挤在空心字下面，计数在最右另一条基线（D11） | 合成一条“章节条”：`display:grid;grid-template-columns:auto 1fr auto auto;align-items:center`：朝代名 · 年代与场数 · 只看主线 · 地图/列表切换；空心大数字改成横幅背景里的淡字或删去 |
| C12 | `.meta b` 字段名（:171）＋ `renderInfo()`（:869） | 一行里塞两个“字段名 + 值”（场景 id … 玩法模板 …），`min-width:4.2em` 只对齐第一个，第二个字段名漂在行中 | 改 `<dl class="meta">` 两列网格 `grid-template-columns:5em 1fr`，每行一个字段；开发字段移除（§1.8） |
| C13 | `.lg-char`（:209）、`.nseal`（:200） | 16 / 17 px 小印 gapT 1 / gapB 0，字偏下 0.5–1 px（`display:grid` 但行高继承 1.75） | `line-height:1` |
| C14 | `#chVideo .cv-seal`（:126） | 22×40 竖印 gapL 3 / gapR 2，基本可接受；与 C1 同类问题 | 换成 `seal-frame-tall`，并加 `line-height:1;letter-spacing:0` |
| C15 | 首页 `.hero-txt` 与开卷图（:72、:91–95） | 文字列宽 0.9fr 但图片绝对定位、靠渐变遮罩“让位”，桌面上标题块整体偏左上、视觉上不在左半屏中线 | B1 自带左侧留白后去掉 mask；`#hero .wrap` 改两栏 `grid-template-columns:minmax(0,5fr) minmax(0,7fr);align-items:center`，文字块在左栏垂直居中 |

**验收**：`measure.js` 跑上表全部选择器，桌面与手机每项 |gapL−gapR| ≤ 1 px、|gapT−gapB| ≤ 1 px（印、按钮、标签、居中标题）；左对齐元素只查上下。

---

## 3. 朝代时间轴压缩，去掉横向滚动条（反馈 3）

### 3.1 现状与目标

```text
BEFORE (1440 wide, content 1160px; 22 buttons x 54px + 4 = 1192px  -> overflow 32px)

  ALL  sg  xia  sh  xz  cq  zg  qin  xh  dh  sg  lj  nb  sui tang wd  bs  ljn ns yuan ming qi|
  |##| |  | |  | |  | |  | |  | |  | |  | |  | |  | |  | |  | |  | |  | |  | |  | |  | |  | |  | |  | |  | |
  |##|  name column fixed 104px tall (vertical), "liao.xixia.jin" = 6 glyphs           |  |
  -o-----o-----o-----o-----o-----o-----o-----o-----o-----o-----o-----o-----o-----o-----o-----o--|--
  all  lgd  2070  1600  1046  770  475  221  206  9   184 266 420 581 618 907 960 907 1127 1206 13|
                     ^ "BC" sign lost (spanShort bug)                                  cut here ^
  <====================================== scrollbar ===========================================>

AFTER (same 1160px; grid 56px + 21 x 1fr = 52.6px each; nothing overflows)

  ALL   sg   xia  sh   xz   cq   zg  [QIN]  xh   dh   sg   lj   nb   sui tang  wd   bs  ljn  ns  yuan ming qing
  ===o====o====o====o====o====o====o====*====o====o====o====o====o====o====o====o====o====o====o====o====o====o===
  all  lgd -2070-1600-1046 -770 -475 -221 -206   9  184  266  420  581  618  907  960  916 1127 1206 1368 1636
  names: max 3 glyphs, 18px, height ~66px (was 104px); counts shown on hover / active only
```

（图中拼音为占位：sg 上古、xia 夏、sh 商、xz 西周、cq 春秋、zg 战国、qin 秦、xh 西汉、dh 东汉、sg 三国、lj 两晋、nb 南北朝、wd 五代、bs 北宋、ljn 辽夏金、ns 南宋。）

### 3.2 具体做法

1. **改 grid、去掉滚动**（index.html:103–114，删 `fitTrack` / `--trackw` :731–732）：

```css
@media (min-width:1024px){
  #chapTabs{display:grid;grid-template-columns:56px repeat(21,minmax(0,1fr));
            grid-template-rows:auto 16px auto auto;overflow:visible;padding:8px 0 12px}
  #chapTabs::before{grid-row:2;grid-column:1/-1;align-self:center;position:static;width:auto;
            height:10px;top:auto;background:url(assets/timeline-rod.webp) center/100% 100% no-repeat}
  #chapTabs button{grid-row:1/span 4;display:grid;grid-template-rows:subgrid;justify-items:center;min-width:0;padding:0}
  #chapTabs .nm{font-size:18px;height:auto;letter-spacing:.08em;padding-block-start:.08em;align-self:end;margin-bottom:8px}
  #chapTabs .yr{font-size:12px} #chapTabs .ct{font-size:12px;visibility:hidden}
  #chapTabs button:is(:hover,:focus-visible,.active) .ct{visibility:visible}
}
```

   数字：1160 px 内容宽 → “全部”56 px、每朝 (1160−56)/21 = **52.6 px**；1024 px 视口（内容 944）→ **42.4 px**。竖排 18 px 字需要约 22 px 列宽，年份“前2070”12 px 约 36 px，两档都放得下。名字高度按最长 3 字：3 × (18 + 1.4) + 8 ≈ **66 px**（原 104 px），整条轴总高从 ~170 px 降到 ~130 px。
2. **显示名缩短**（不改数据，只在 viewer 里映射，`aria-label` 与 `title` 仍用全名）：楚汉·西汉 → 西汉，新·东汉 → 东汉，五代十国 → 五代，辽·西夏·金 → 辽夏金。其余原名已 ≤ 3 字。实现：`build-viewer-data.mjs` 在 `INDEX.chapters[]` 增加 `short` 字段（生成源改，不手改 data）。
3. **年份修正**（D5，:827）：`spanShort` 改为先 `s.replace(/\s+/g,"")` 再匹配 `/前?\d+/`，输出 `前2070` 或用 `−2070`；辽夏金的起点按 `INDEX` 里的 span（907 是辽始年，与五代同年属实，不是 bug，hover 提示写全称与区间）。
4. **721–1023 px（平板）**：同一 grid，竖排 16 px；`.yr` 只给当前朝与“全部”显示，其余 hover 才显示；22 列在 768 px（内容约 707）时每列 31.5 px，够放 16 px 竖排字。
5. **≤ 720 px（手机）**：不再横向滚动，改 7 × 3 网格（21 朝恰好三行）＋“全部”占一整行：

```text
+--------------------------------------+
| [ ALL  all dynasties . 170 scenes  ] |
| [sg ][xia][sh ][xz ][cq ][zg ][QIN]  |   each chip: 358/7 = 51px wide, 40px tall,
| [xh ][dh ][sg ][lj ][nb ][sui][tang] |   horizontal 14px name, no year
| [wd ][bs ][ljn][ns ][yuan][ming][qing]|  active chip = seal-frame-tall bg, paper text
+--------------------------------------+   total height ~ 36 + 3 x 44 = 168px
```

   ```css
   @media (max-width:720px){
     #chapTabs{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;overflow:visible}
     #chapTabs::before{display:none}
     #chapTabs button[data-id="*"]{grid-column:1/-1}
     #chapTabs button{min-height:40px;flex-direction:row;justify-content:center}
     #chapTabs .nm{writing-mode:horizontal-tb;font-size:14px;height:auto;letter-spacing:0}
     #chapTabs .dot,#chapTabs .yr,#chapTabs .ct{display:none}
   }
   ```
   本篇在该朝 0 场时按钮置灰（现已有 `disabled`，:532），手机上保持可见以免网格错位。
6. `selectChapter()` 里把当前朝滚到中间的代码（:795）在桌面不再需要，保留给 721–1023 以外的兜底即可。

**验收**：1440、1280、1024、768、390 五个宽度截图；脚本断言 `#chapTabs.scrollWidth <= clientWidth` 且 `documentElement.scrollWidth == innerWidth`；年份显示带“前”；当前朝印块高度 = 文字高度 + 8 px。

---

## 4. 每个朝代一张地图，并把场景标在地图上（反馈 4）

### 4.1 总体结构

```text
data sources (committed, licence-clean)          build (Node, no deps)           viewer
---------------------------------------          ---------------------           ------------------------------
video/data/maps/places.json   (gazetteer) --+
video/data/maps/scene-places.json          --+--> video/tools/build-maps.mjs --> video/viewer/data/maps.js
video/data/maps/frames.json  (bbox/proj)   --+        |  projects lon/lat         (window.FENGHUO_MAPS:
video/data/maps/territory/<ch>.json        --+        |  -> x,y in 0..1          per chapter: image, size,
Natural Earth coast/rivers (public domain) --+        |  label placement         markers[], labels[], routes[])
                                                      v
                                          video/tools/render-map.mjs (headless Chrome, SVG -> PNG)
                                                      |  base geometry + ink sprite kit (AI-generated)
                                                      v
                                          video/tools/grade-image.py (palette lock, like chapter_grade.py)
                                                      v
                                          video/viewer/assets/maps/<ch>.webp / <ch>-m.webp
```

### 4.2 为什么底图不能直接让模型画

生成模型画出的“地图”河道与海岸是随意的，场景坐标投上去会落到海里或河对岸。所以**几何来自真实地理数据，水墨感来自素材与后期**：

1. **几何层**（准确）：Natural Earth 1:10m（公有领域）的海岸线、主要河流（黄河、长江、淮河、渭水、汉水、汾水、济水古道按需手描、海河、珠江、辽河、塔里木河）、湖泊（洞庭、鄱阳、太湖、巢湖；古云梦泽、巨野泽按需手描并标“示意”）。不使用任何现代国界、省界、城市点、道路。
2. **疆域层**（示意）：每朝一个手写的粗略多边形（20–60 个顶点，`territory/<ch>.json`），只表达“大致范围”，页面图例写“疆域为示意，非精确边界”。并立政权（三国、南北朝、五代、辽夏金、南宋）用 2–4 个多边形、深浅不同的灰。**不**采用 CHGIS 数据（禁止再分发），也不采用 GPL 的 historical-basemaps 之类数据集。
3. **水墨层**（AI 生成的可复用素材包，见 4.3）：山块、浪纹笔、城墙小剪影、关隘、长城段、纸纹，按几何层的位置程序化摆放（山块按 Natural Earth 地形或手标山脉中线摆）。
4. **后期**：与章节片头同一套调色思路，锁回色板（灰阶＋朱砂，其他色相去色），出 webp。
5. **可选风格化**：若父代理的图像工具支持“以图生图 + 低强度”，可对合成结果做一次 ≤ 0.35 强度的水墨风格化，但必须过几何校验（河流遮罩 IoU ≥ 0.85，见 4.8），不过就用未风格化版本。

底图里**不烘焙任何文字**：地名、河名、都城名、图例全部是 HTML。

### 4.3 地图素材包（只在构建时使用，不进站点首屏；生成时同样接 §1.7 的风格尾巴）

| 文件（`video/data/maps/sprites/`，或留 box 不提交，见风险） | 尺寸 | 中文提示词 | English prompt |
|---|---|---|---|
| `mountain-01..08.png` α | 512×256 | 一组块面山峦剪影，三层灰阶，从左到右由高到低，底部平齐，无皴纹 | a cluster of block-shaped mountain silhouettes in three greys, descending left to right, flat bottom, no texture strokes |
| `ridge-long-01..03.png` α | 1024×128 | 一条横向连绵的山脊带，淡灰，边缘干笔 | a long horizontal mountain ridge band in pale grey, dry-brush edges |
| `wave-01..04.png` α | 256×64 | 两三道湿墨横笔组成的水纹，浪头留白 | two or three wet ink horizontal strokes forming water ripples, white crests |
| `city-wall.png` α | 128×96 | 俯视角的方形城墙小剪影，四门，墨黑 | a tiny square walled city seen from above, four gates, ink black |
| `capital-wall.png` α | 160×120 | 同上，双重城墙，略大 | same with double walls, slightly larger |
| `pass.png` α | 96×96 | 两山夹一座关楼的小剪影 | a tiny pass gate tower between two peaks |
| `great-wall-seg.png` α | 512×64 | 一段沿山脊起伏的城墙墨线，带几座烽燧 | a segment of wall following a ridge with a few beacon towers, ink line |
| `marsh.png` α | 256×128 | 几笔芦苇与淡墨水面，表示古泽 | a few reed strokes and pale ink water for an ancient marsh |
| `desert-dots.png` α | 256×128 | 稀疏的淡灰点与短横，表示沙碛 | sparse pale grey dots and short dashes for desert gravel |
| `paper-map.png` | 2048×1280 | 略旧的宣纸，边缘淡淡的雾灰晕，无墨渍 | slightly aged xuan paper, faint fog-grey vignette at edges, no ink stains |

### 4.4 地图帧与投影

为避免 21 张图各说各话，统一用少数几个“帧”（`frames.json`），朝代切换时同一帧内位置不跳：

| 帧 | 经纬范围（E, N） | 用于 |
|---|---|---|
| `core`（中原） | 104–122°E，29–42°N | 上古、夏、商、西周、春秋、战国 |
| `han`（汉地） | 97–125°E，18–45°N | 秦、东汉、三国、两晋、南北朝、隋、五代、北宋、南宋、明 |
| `full`（全域） | 73–135°E，15–55°N | 西汉（西域）、唐、辽夏金、元、清 |

投影：等距圆柱，横向乘 cos(帧中心纬度)；构建时把 bbox 按 16:10 外扩。图片 1600×1000（桌面）与 800×500（手机）。`x = (lon − W) / (E − W)`、`y = (N − lat) / (N − S)`，存为 0–1 的四位小数。帧分配是初稿，校验器发现场景地点出帧就报错，再调帧。

### 4.5 数据格式

`video/data/maps/places.json`（地名库，人工维护）：

```json
{
  "format": "inkgames.places", "version": 1,
  "places": {
    "xianyang": {
      "name": "咸阳", "aliases": ["渭城"], "kind": "capital",
      "lon": 108.71, "lat": 34.38, "precision": "site",
      "modern": "陕西咸阳市东北（秦咸阳城遗址）",
      "src": { "type": "wikidata", "id": "Q…" },
      "verify": "done"
    }
  }
}
```

- `kind`：`capital | city | pass | river | mountain | battlefield | region | sea | marsh`。
- `precision`：`site`（遗址可定点）| `city` | `region`（只知大致区域，画成淡墨圆晕，半径存 `r` 公里）| `legend`（传说地，如昆仑，画“无定所”）。
- `src.type`：`wikidata`（CC0，记 QID）| `manual`（手工，`note` 写依据，如“史记正义：在今某县东”）。**CHGIS/TGAZ 只用于人工在线核对，不落地、不抄坐标**（见 `video/sources/reference/README.md` 许可红线）。

`video/data/maps/scene-places.json`（场景 → 地点，覆盖全部 493 条目录）：

```json
{
  "qin.shuwen":      { "at": "xianyang" },
  "qin.xunyou":      { "at": "langya", "route": ["xianyang", "langya", "shaqiu"] },
  "shanggu.hundun":  { "placeless": true, "reason": "创世神话，无地点" },
  "dili.shanggu.hekunlun": { "at": "kunlun-legend", "also": ["huanghe"] }
}
```

- 既有 316 场章节数据里**没有地点字段**（只有标题、旁白、史源摘要）；新场景 177 场有 `places`（中文名数组）。做法：`build-maps.mjs --suggest` 用地名库的 `name + aliases` 去匹配场景标题、副标题、旁白与 `video/sources/<ch>/*.md`，生成候选表 `scene-places.suggest.json`，人工确认后写入 `scene-places.json`。新场景的 `places` 直接按别名解析，解析不到的列入报告。
- 不改章节 JSON（遵守 AGENTS.md：不手改生成物）；地点数据独立成文件，`build-maps.mjs` 读取。

`video/viewer/data/maps.js`（生成物）：

```js
window.FENGHUO_MAPS = { version: 1, chapters: { qin: {
  img: "assets/maps/qin.webp", imgM: "assets/maps/qin-m.webp", w: 1600, h: 1000, frame: "han",
  capital: { place: "xianyang", x: 0.4013, y: 0.4120 },
  labels: [ { text: "渭水", x: 0.38, y: 0.43, kind: "river", rot: -8 } ],
  markers: [ { sc: "qin.shuwen", place: "xianyang", x: 0.4013, y: 0.4120, side: "e",
               pians: ["zhiguo"], primary: "zhiguo", year: -221, prec: "site" } ],
  routes: [ { sc: "qin.xunyou", pts: [[0.40,0.41],[0.70,0.36],[0.62,0.30]] } ],
  placeless: [ "…" ]
} } };
```

`side` 是构建时算好的标签方位（8 方向贪心避让：依次试 e、w、ne、nw、se、sw、n、s，选与已放标签和标记都不重叠的第一个；都重叠就进聚合）。

### 4.6 页面上的地图与交互

```text
+--------------------------------------------------------------+------------------------+
|  MAP . QIN  (frame han)                 [rivers][routes][?]  | SCENES (6)             |
|  +--------------------------------------------------------+  |  > Shu tong wen  -221  |
|  |      ~~~ desert ~~~                                    |  |    Xun you       -210  |
|  |                    ^^ ridge ^^^         (o) Langya     |  |    ...                 |
|  |    ~~~~~ Wei he ~~~~~[#]Xianyang ----route----->(o)   |  |                        |
|  |                       capital                   |      |  | hover a row  -> marker |
|  |        (o)  Chang jiang ~~~~~~~~~~~~~~~         v      |  |   pulses               |
|  |   (3) <- cluster badge                       (o)Shaqiu |  | hover a marker -> row  |
|  |                                                        |  |   highlights           |
|  |  .------------------------------.                      |  |                        |
|  |  | SHU TONG WEN        -221     |  <- popup on hover / |  |                        |
|  |  | Zhiguo . primary            |     focus / tap       |  |                        |
|  |  | one-line subtitle            |                      |  |                        |
|  |  | [open scene ->]              |                      |  |                        |
|  |  '------------v-----------------'                      |  |                        |
|  |              (*) Xianyang                              |  |                        |
|  +--------------------------------------------------------+  |                        |
|  legend: [#] capital  (o) scene  (*) current  ~~ river       |                        |
|          territory is schematic                              |                        |
|  placeless: [Hun dun kai juan]  (scenes without a place)     |                        |
+--------------------------------------------------------------+------------------------+
```

- **结构**：`<figure class="dmap" style="aspect-ratio:16/10">` 里一张 `<img>`（`loading="lazy"`，选中该朝才设 `src`），上面一层 `<ol class="dmap-marks">`，每个标记是 `<li><button class="mk" style="left:40.13%;top:41.20%">`，标签是按钮里的 `<span class="mk-label">`（楷体 13 px，`paint-order:stroke` 式纸白描边用 `text-shadow` 实现）。河名、山名、都城名同样是 HTML 标签层，可随字号缩放、可被读屏读到、可选中复制。
- **标记样式**（只用色板）：普通场景 = 墨点（H2 精灵常态）；当前场景 = 朱砂点（H2 第三格）＋外圈；都城 = 小方印框；`precision:region` = 淡墨圆晕（半径按比例尺）；路线 = SVG 折线，墨色 1.5 px 虚线，起点一点朱砂。
- **按篇过滤**：只画 `pians` 含当前篇的标记；勾选“只看主线”时只画 `primary === 当前篇`。“全部朝代”状态不显示单朝地图（地理篇除外，见 4.7）。
- **交互**：
  - 悬停 / 键盘聚焦标记 → 弹出卡片（标题、年份、主线或兼收、副标题一行、“打开场景”）；点击标记 = 与点击场景卡同一函数（设 `view.sc`、`writeHash()`、`openScene()`）。
  - 悬停列表行 → 对应标记加脉冲外圈；反之亦然（共享 `data-sc`）。
  - 同一点 ≤ 18 px（按 1440 宽算）内的多个场景合并成聚合标记“(3)”，点开是一个小列表。
  - 键盘：标记按年份排 DOM 顺序，Tab 依次走；Esc 关弹窗；弹窗 `role="dialog"` 不抢焦点，悬停卡用 `role="tooltip"`。
  - `prefers-reduced-motion` 下不做脉冲。
- **手机**：地图满宽，标签只显示都城与当前场景（其余点击才出），点按标记出底部弹层（bottom sheet），不出悬浮卡；标记点击区 ≥ 32 px。
- **无地点场景**：图下“无定所”一栏（J1 风格的小插画 + 场景名按钮），不硬塞到地图某个角落。

### 4.7 各篇怎么用地图

| 篇 | 地图位置 | 强调 |
|---|---|---|
| 战场 | 章节条下，地图 / 列表二选一，默认列表 | 战场点用墨菱形；有 `route` 的战役画行军线；当前战场朱砂；可开“关隘”图层 |
| 治国 | 默认列表，地图在侧栏 | 都城、迁都（多个 capital 用连线表示先后）、渠堰粮仓类场景；标签写地名 |
| 人物 | 默认列表，地图在侧栏 | 标签写**人物名**而不是地名（数据里取场景主角）；一人多场时连成生平路线 |
| 地理 | **地图是主视图**，放在横幅之下、列表之上，桌面全宽 | 河流、山脉、关隘、长城图层默认全开；路线默认显示；“全部朝代”时显示 21 张缩略地图网格当选朝器（每张 320×200 webp ≤ 25 KB，可由主图缩出） |

地理篇“全部朝代”状态：

```text
+--------+--------+--------+--------+--------+--------+--------+
| [map]  | [map]  | [map]  | [map]  | [map]  | [map]  | [map]  |
| Shanggu| Xia  4 | Shang 2| Xizhou | Chunqiu| Zhanguo| Qin  4 |
+--------+--------+--------+--------+--------+--------+--------+
| ... 7 x 3 thumbnails, number = scenes of this pian ...       |
+--------------------------------------------------------------+
```

### 4.8 校验规则（加进 `video/tools/validate.mjs`，0 错误才能提交）

1. 目录里每个场景（493 条）在 `scene-places.json` 有记录：`at` 指向存在的地名，或 `placeless:true` 且写了 `reason`。
2. 每个地名有 `lon/lat`（`legend` 精度除外）、`precision`、`src`；`src.type` 只能是 `wikidata | manual`；`manual` 必须有 `note`；不允许 `chgis`。
3. 场景的投影坐标在本朝帧内：`0.02 ≤ x,y ≤ 0.98`；出帧报错并提示改帧或改地点。
4. `route` 至少两点，点都存在，相邻点距离 > 0。
5. 疆域多边形闭合、顶点 ≤ 80、不自交；每朝至少一个都城（上古 / 夏可为 `legend`）。
6. `maps.js` 与源数据同步（构建器输出的哈希写进文件头，校验器重算比对），禁止手改。
7. 地图图片：存在、尺寸 1600×1000 与 800×500、体积 ≤ 160 KB / 60 KB；色板检查——像素 HSV 饱和度 > 0.25 的必须落在朱砂色相 ±12° 内，且朱砂像素 ≤ 10%（复用 `chapter_grade.py` 的判定思路，写成 `video/tools/check-image-palette.py`）。
8. 生成图不得含文字：人工审图签字记在 `video/data/maps/review.md`（OCR 只作辅助，不作判定）。
9. 几何校验（只对做了 AI 风格化的图）：把 Natural Earth 河流按同一投影栅格化成遮罩，与成图暗线做 IoU，≥ 0.85 才放行。
10. 页面级：每个可见标记 `left/top` 落在图片框内；两标签不重叠（构建时保证，页面脚本断言一次）。

---

## 5. 实施阶段

| 阶段 | 内容 | 依赖 | 谁做 |
|---|---|---|---|
| P0 快修（只动 CSS/JS，不需要新图） | §2 C1–C15；D5 年份；D6 去开发字段；D7 手机 secnav（顶栏一行化或 `top:var(--bar-h)` 用 JS 量）；D8/D9；背景减量（D1） | 无 | 云端 agent |
| P1 朝代轴 | §3 全部（grid、短名、平板与手机网格）；`build-viewer-data.mjs` 加 `short` | P0 | 云端 agent |
| P2 版式重构 | 首页两栏 hero、统一篇卡与横幅骨架（先用灰块占位图）、章节条、“全部朝代”折叠、场景详情返回 | P0 | 云端 agent |
| P3 站点素材出图 | §1.7 B1–N1 生成 → 去底 → 调色锁色板 → 压缩 → 审图（无字、无现代物） | 提示词定稿 | **父代理 / 用户用图像工具生成**；后处理脚本由云端 agent 写 |
| P4 素材接入 | 替换占位图、体积核对、`image-set` 兜底 | P2、P3 | 云端 agent |
| P5 地点数据 | 地名库、`--suggest` 候选、人工确认 493 条、帧分配、疆域多边形、校验规则 1–6 | 无（可与 P0 并行） | 云端 agent 起草；**用户或人工抽检**坐标与疆域 |
| P6 地图出图 | 地图素材包生成（4.3）；`render-map.mjs` 合成 21 张；调色；可选风格化 + 几何校验 | P5、素材包 | 素材包由父代理生成；合成脚本与批量出图由云端 agent |
| P7 地图交互 | §4.6–4.7 页面、按篇过滤、聚合、手机底部弹层、地理篇缩略图网格 | P5、P6（可先用纯几何 SVG 底图开发） | 云端 agent |
| P8 文档与收尾 | 更新 `plan/README.md`、AGENTS.md §2/§10/§12、`video/README.md`、`pian.md`；`node video/tools/validate.mjs` 0 错误；`./build.sh check` 全绿 | 全部 | 云端 agent |

建议的 PR 切分：PR-A = P0+P1（小而快，用户立刻能看到滚动条与居中问题消失）；PR-B = P2+P4；PR-C = P5+P7（先用 SVG 底图）；PR-D = P6 换上正式地图图片。

---

## 6. 验收（只交截图，不交录屏）

统一截图集：首页、四篇（全部朝代）、四篇（选中秦）、场景页（治国 · 书同文），各 1440×900 与 390×844；P1 另加 1280 / 1024 / 768。每项交“改前 | 改后”并排图，存 `/workspace/review/viewer-redesign/<阶段>/`，在 PR 描述里贴出。box 上的无头截图只证明版式；字形与真实观感在用户 Mac 上看（box 无楷体），未在 Mac 看过的写“未实测”。

| 项 | 通过标准 |
|---|---|
| 反馈 1 页面整理 | 首页首屏只有：顶栏、开卷（标题 + 图）、四篇卡露出上沿；四张篇卡同骨架、同高、同对齐；正文区域下面没有墨渍斑点；场景页无英文 id / 模板名 / canon 等标签；选中一朝时篇页高度 ≤ 3 屏到场景标题；首页首屏图片合计 ≤ 550 KB（DevTools 截图或脚本输出截图） |
| 反馈 2 居中 | §2 表内选择器在两种宽度下 |Δ| ≤ 1 px（附 `measure.js` 输出截图）；印章 2×2 文字在印框正中（放大 200% 截图） |
| 反馈 3 朝代轴 | 1440 / 1280 / 1024 下无横向滚动条，21 朝与“全部”全部可见；768 下同样无滚动；390 下为 7×3 网格且页面无横向溢出（`documentElement.scrollWidth == innerWidth` 截图）；年份带“前” |
| 反馈 4 地图 | 21 朝每朝一张图，图内无文字；每张截图里能看到本篇本朝的全部标记、都城、主要河流 HTML 标签；悬停（桌面）与点按（手机）弹出卡片的截图；点开场景后当前标记变朱砂的截图；地理篇默认显示地图、“全部”显示 21 缩略图网格的截图；`validate.mjs` 0 错误截图 |

---

## 7. 风险与对策

| 风险 | 对策 |
|---|---|
| 生成地图地理不准，标记落到错处 | 几何来自 Natural Earth，AI 只出素材与可选低强度风格化，并做 IoU 几何校验（§4.2、§4.8-9） |
| 许可：CHGIS 禁止再分发、CBDB/shiji-kb 非商业、historical-basemaps 为 GPL | 坐标只取 Wikidata（CC0）或手工并注明依据；CHGIS 只在线人工核对；疆域手写示意；校验器禁 `chgis` 来源 |
| 疆域边界有争议、各朝变化大 | 只画示意多边形，图例写明“示意”；不画现代国界省界；有争议的地点 `verify:"待核验"` 并在弹窗显示 |
| 316 个既有场景没有地点字段，人工量大 | `--suggest` 自动候选 + 分朝批量确认；先做 v1 的 66 场和地理篇 56 场主线，其余逐步补；校验器在过渡期允许 `placeless` 带 `reason:"待补"`，但统计数字写进 README |
| 生成图出现乱码文字、印文、现代或时代错置物 | 提示词全部禁字；印、题字一律 HTML；审图清单逐张签字；变形或错置按规则重生成（每张最多 2 次） |
| 色彩跑出色板（橙火、蓝天） | 统一调色脚本锁色板，像素检查进校验器 |
| 体积膨胀、`file://` 离线打开变慢 | §1.7 预算；地图按需加载、`loading="lazy"`；手机用 800 宽版本 |
| 22 列在 1024 以下太挤 | 平板档 16 px 竖排、隐藏非当前年份；≤ 720 换 7×3 网格 |
| `subgrid` 老浏览器不支持 | `@supports not (grid-template-rows:subgrid)` 回退为固定行高（名字区 66 px） |
| box 无楷体，截图字形与 Mac 不同 | 版式验收在 box，字形与观感验收在 Mac；或在 box 安装开源楷体（LXGW WenKai，OFL）仅用于截图，不随站点分发 |
| 地图素材包放仓库会增大体积 | 素材包与中间件留 box（同章节片头规则：分段素材不提交），仓库只提交成图、数据与脚本 |
| 手改生成物 | `maps.js`、`data/*.js` 都由构建器生成；校验器比对哈希 |

---

## 8. 分工小结

- **云端 agent 实现**：P0、P1、P2、P4、P5（起草数据与候选、写校验）、P6 的合成与调色脚本及批量出图、P7、P8；所有截图。
- **图像生成（父代理或用户用图像工具单独做）**：§1.7 的 B1–N1 共 22 张站点素材；§4.3 地图素材包约 30 张；可选的地图风格化。生成后交给云端 agent 做去底、调色、压缩与接入。
- **需要用户拍板 / 抽检**：篇卡与开卷图的最终取舍；地点坐标与疆域示意的抽检（建议每朝抽 3 个点）；手机端四篇导航放菜单还是首屏 tab；“全部朝代”折叠后每朝显示几张（建议 4）。

## 附：本计划引用的现状截图（box）

`/workspace/review/viewer-plan/`：`home-desktop-full.png`、`home-mobile-top.png`、`zhanchang-desktop-top.png`、`zhanchang-desktop-dynasties.png`、`crop-zhanchang-cards.png`、`crop-zhiguo-top.png`、`crop-renwu-top.png`、`crop-dili-top.png`、`zhiguo-qin-desktop-scene.png`、`zhiguo-qin-desktop-chapter.png`、`zhiguo-qin-mobile-secnav-overlap.png`、`crop-mobile-sheet.png`、`metrics.json`；测量脚本 `shoot.js`、`measure.js`、`scene.js`、`m2.js`。
