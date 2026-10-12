# 12 · 烽火内容站视觉协调

状态：**待确认**。本文只定方案。确认前不改页面、不改图、不改 `art-style.mjs`。

- 依据：`main` `e1ae16b`（PR #19 已合并）。范围是 `video/` 里面向用户的全部页面和视觉素材，不只是首页横幅。盘点在下面一节。`video/docs/`、`video/sources/`、`video/data/` 的 JSON 和 `video/tools/` 不是页面，不做出图对象。
- 美术仍是 AGENTS.md §5 / [art-style.md §5](../video/docs/art-style.md) 的简化版黑白红。提示词套 §5.1：共用正向 + 本图一句 + 共用负向。不写《影之刃》角色名，不把参照图放进仓库。
- 实测：无头 Chrome + SwiftShader，`prefers-reduced-motion: reduce`，像素比 1。1440×900 与 390×844。色值是截图像素。真实 GPU 未实测。box 上没有楷体，Mac 上字形会不同，宽度和色差不受影响。
- 问题截图（只这四张）：
  - 首页 1440：`/opt/cursor/artifacts/screenshots/main-home-1440.png`
  - 首页四篇封面 1440：`/opt/cursor/artifacts/screenshots/main-home-1440-cards.png`
  - 治国篇横幅 1440：`/opt/cursor/artifacts/screenshots/main-zhiguo-1440.png`
  - 首页 390：`/opt/cursor/artifacts/screenshots/main-home-390.png`

**目标：** `video/` 里用户看得到的页面和图都落到同一套黑白红：宣纸 `#eceae4`、五层灰、朱砂 `#b3241c` 只做一处。首页和四篇共用一条横幅，图的四边洇进纸色。四篇封面换成代表图。已经锁进色板的地图和成片不再重画。

**约束：** 朱砂 `#b3241c` 单帧不超过一成、一处。不改场景 `videoPrompt` 的校验句，避免 316 场提示词一起重生成。新 PR 都以 `main` 为基线，互不叠放（AGENTS.md §10 第 6 条）。验收只交截图，不录屏。

---

## 盘点：video/ 里用户看得到的东西

`video/` 下面向用户的 HTML 只有两页。图片、地图、海报、成片都在 `video/viewer/assets/`，地图用的笔触原件在 `video/data/maps/sprites/`。色相抽查：非透明像素里，通道极差 ≥ 22 且不像朱砂（红明显高于绿蓝）的记为偏色。抽查步长 4 像素。SwiftShader 与文件抽样都不是真实 GPU。

### 页面

| 页面 | 现状 | 改法 |
|---|---|---|
| `video/viewer/index.html` + `pian.css` | 内容站。色板变量已是七色。问题是横幅窄、首页底色台阶、图边是硬框，见 §0、§1。地图框和视频框另见下两节 | §1 的横幅和渐隐。地图、播放器、页脚用同一套纸色和渐隐，不另做一套皮肤 |
| `video/viewer/05-09-jingke-relations.html` | 荆轲关系图，独立一页，不走内容站 CSS。底 `#efe6d3` / `#f7f1e3`，墨 `#3a3329`，强调 `#a63a2e`，另外还有黛蓝 `#3e5c76`、草绿 `#3f5c4b`、金 `#b08d4f`、紫 `#6b5b8a`、灰褐 `#7a746b`。按钮有白底，卡片圆角 4–10px | 底改 `#eceae4`，字改 `#141414`。六类人只用墨的深浅区分，君主或敌对用一处 `#b3241c`，删掉蓝绿金紫。圆角改直角。不新画插图 |

### 内容站主图（要重画）

首页宽图、手机方图、四篇横幅、四篇封面。问题和提示词在 §0、§3。手机方图 `hero-fenghuo-m` 在统一横幅后停止使用。

### 界面小图（`video/viewer/assets/` 根上，成对的 webp/jpg/png）

抽查已在灰阶或纯朱砂里的，留着，不重画：`btn-ink`、`divider-brush`、`divider-mountain`、`empty-ink-boat`、`footer-mountains`、`loading-ink-drop`、`ink-black-panel`、`timeline-rod`、`seal-frame-square`、`seal-frame-tall`、`vermilion-brush-bar`、`vermilion-seal-fill`。印章和朱砂条整张都是红，只用在印和细线，不拿来铺底。

| 文件 | 现状 | 改法 |
|---|---|---|
| `timeline-node.png`（192×64，三态） | 约 7% 像素是 `#2d0907`（45,9,7），不在七色里。朱砂态约占 34% | 三态只许 `#141414`、`#eceae4`、`#b3241c`。重画这一张，不改交互 |
| `fenghuo-hero.jpg/webp`（1280×720） | 偏色约 0.1%，抽样有 (80,60,51) 这类褐边。`index.html` 已不引用，被 `hero-fenghuo-wide` 换掉 | 删掉。不留回退件 |
| `paper-fiber.*` | 色板内，但当前页面不用（底已经是 `#inkbg`） | 删掉 |
| `paper-ink-stains.*`、`ink-blot-corner.*` | 色板内。CSS 变量 `--tex-paper`、`--tex-blot` 写了，没有哪条规则用它们 | 删掉变量和文件。成片片头卡若还叠了 `paper-ink-stains`，那是烧进 mp4 的，见下节，本轮不拆 |

页脚山、空状态小船、载入墨滴已经是灰墨。它们若在页面上仍像一块矩形，跟主图一样加四边渐隐，不重新生成。

### 地图

| 素材 | 数量 | 现状 | 改法 |
|---|---|---|---|
| `video/viewer/assets/maps/<章>.webp` 及 `-m`、`-t` | 21×3 = 63 | `render-maps.py` 用纸 `#eceae4`、雾灰、淡灰、中灰、墨黑合成。抽查唐、秦、上古，偏色 0%，通道极差 ≤ 8。文字是 HTML，不在图里 | 不重渲染。去掉 `.dmap` 和 `.map-thumb` 的 1.5px / 1px 实线框，图的外圈约 8% 渐隐进纸 |
| `video/data/maps/sprites/*.png` | 21（山 8、浪 4、长岭 3，以及城、关、沙、泽、长城） | 抽查全部是纯灰，通道极差 0 | 不动。它们只被地图合成使用 |

### 章节海报和成片

`video/viewer/assets/chapter-videos/`：21 张海报 jpg、21 张 webp、21 条 mp4。播放器在内容站朝代长卷下面，`poster` 来自 `index.js`。

抽查上古、秦、唐三张海报：偏色 0.03%–0.21%，是 JPEG 边上的暖灰，不是另一套色。成片已经按 `chapter_grade.py` 锁过色板。

| 现状 | 改法 |
|---|---|
| `#chVideo .cv-frame` 是 16:9 硬框，1px 雾灰边，海报铺满 | 边改成约 8% 渐隐到 `#eceae4`，去掉实线框。海报文件不重出，除非渐隐之后仍能看出偏色 |
| 片头卡烧进了 `paper-ink-stains` 和朱印 | 本轮不重编码 21 条 mp4。要换片头纸纹就单开一轮，不跟版式 PR 绑在一起 |

### 不在这轮里的目录

`video/docs/` 没有位图。`video/sources/` 是史源摘要。`video/data/chapters`、`pian`、`maps` 的 JSON 是数据。这些不改画面。

---

## 0. 现状（截图实测）

页面宣纸是 `--paper: #eceae4`，即 rgb(236, 234, 228)。内容列 `--wrap: 1240px`，左右 padding 在 1440 下是 40px。

### 0.1 宽度

1440×900，图的盒模型（`getBoundingClientRect`）：

| 图 | 位置 | 宽 × 高 | 左右留白 | 占视口宽度 |
|---|---|---|---|---|
| 首页主图 `hero-fenghuo-wide` | x=140, y=57 | 1160 × 483 | 各 140px | 80.6% |
| 篇横幅（四篇相同，战场 / 治国 / 人物 / 地理） | x=140, y=57 | 1160 × 290 | 各 140px | 80.6% |
| 封面（四张） | 首张 x=140 | 278 × 348 | 列在 1160px 内，间距 16px | 单张 19.3% |

390×844：

| 图 | 位置 | 宽 × 高 | 左右留白 |
|---|---|---|---|
| 首页主图 `hero-fenghuo-m`（方图，不是宽图） | x=16, y=53 | 358 × 358 | 各 16px |
| 封面 | 单列 | 358 × 448 | 各 16px |

篇横幅高 290px，首页主图高 483px。同一视口里，篇横幅比首页矮 193px。两边都缩在 1160px 的列里，左右各空 140px，所以横幅看起来是一条窄带，不是铺开的纸。

素材本身没有被 `object-fit` 再切一刀：1160/483 = 2.40，对上 2400×1000；1160/290 = 4.00，对上 2400×600。硬边不是留白条，是画框本身。

### 0.2 色差

横幅和封面的 JPEG 四边，和 `#eceae4` 的通道差之和只有 2 到 5（人物横幅 2.7，治国封面 9.8）。图内的纸色是对的。硬边来自图外面的底。

同一张 1440 截图里，图框外 8px 与框内 8px：

| 位置 | 框外 | 框内中位 | 和 `#eceae4` 的差 |
|---|---|---|---|
| 首页主图左右外侧 | rgb(246, 246, 243)，整条都是这个值 | 纸色，中位差 0 | 框外通道差之和 **37**（+10 / +12 / +15） |
| 首页封面四周外侧 | 同样 rgb(246, 246, 243) | 纸色，中位差 0 | 框外 **37** |
| 治国篇、战场篇横幅左右外侧 | rgb(236, 234, 228) | 纸色，中位差 0 | 框外 **0** |

首页 `#hero` 没有不透明底，左右 140px 露的是 `#inkbg` 这块 WebGL 画布，显示成更亮、更冷的 246,246,243。篇页的 `.pb` 用 `background: var(--paper)` 铺满整段，把画布盖住，所以是 236,234,228。首页横幅因此和篇横幅不是一块底。

另外有几张图的墨碰到了位图边缘，渐隐也救不了被切掉的形：

| 文件 | 墨碰到的边 |
|---|---|
| `banner-renwu.jpg` | 顶、右 |
| `pian-zhiguo.jpg` | 左、顶 |
| `pian-renwu.jpg` | 左、右 |
| `pian-dili.jpg` | 左、右 |
| `hero-fenghuo-wide.jpg` | 顶（少量） |

---

## 1. 四点改法

### 1.1 所有图的边缘洇进纸色

图的父级先铺实色 `#eceae4`。渐隐只能落到这层纸上，不能落到 WebGL 的 246,246,243。

两步一起做：

1. **CSS 遮罩（现有图就能用）。** `.hero-art img`、`.pb-art img`、`.pc-img img` 四边各约 10% 从透明过渡到不透明，`mask-composite: intersect`。父级背景是 `#eceae4`。不另画描边，不加圆角、投影、模糊。
2. **新图画进纸里。** 提示词要求四边约一成已经是 `#eceae4`，墨不要顶到边。遮罩是兜底，画本身不再是一块矩形。

不改 `#inkbg` 的帧率、暂停和 reduced-motion。画布仍铺在内容下面；横幅段和封面区用纸色盖住它，避免再出现 37 的台阶。

### 1.2 首页横幅改成和篇横幅同一个组件

现在首页是 2.4:1 的 `hero-fenghuo-wide`，手机另用方图 `hero-fenghuo-m`。篇页是 4:1 的 `banner-*`，结构是左文右图。

改成一条 `.sheet`：

- 首页和四篇共用。整段 `width: 100%`，背景 `#eceae4`，不再缩进 `.wrap` 的 1160px。
- 图用同一比例 **2400×1000（12:5）**。1440 视口下高约 600px（现在篇横幅是 290px，首页内容盒是 483px）。左右留白从 140px 变为 0，高度不再是一条 290px 的窄带。
- 文字仍在左侧约 42%，压在留白上，不压焦墨。
- 手机不再换方图。390 下同一张宽图全宽，高约 163px。`hero-fenghuo-m` 停止引用，文件可留到出图 PR 再删。
- 题材不跟着版式走：首页右侧仍是烽火台和持矛武士。篇的右侧换成 §3 的代表物。

### 1.3 四篇封面代表图

封面仍是 4:5 竖幅，800×1000。和同篇横幅讲同一件事，红色上限相同。头顶、脚下留纸，四边渐隐。

| 篇 | 现在的模板句 | 改成 | 理由 |
|---|---|---|---|
| 战场 | 阵与旗 | **残阵**：近景一人持矛，中景成排剪影由焦到淡，远景烟和壁垒。矛竖着，不相接 | 首页已经用了烽火台。战场要看见阵，而不是再画一座台。不画兵刃相接 |
| 治国 | 柱、竹简、文臣 | **棋局**：矮几上的棋盘和棋子 | 用户指定围棋。棋盘只用几笔粗线，不画十九路密线，免得撞上「界画密线」 |
| 人物 | 一名无兵器的人 | **龙座**：侧视空座，龙是靠背上三四块大形 | 用户指定皇位。座是主体，不画金，不画鳞，不画五官。人不坐满画面 |
| 地理 | 河、三层山、一条路 | **关河**：河在近景，关门嵌在中景山里，路穿过门洞，远处再两层山 | 地理篇讲的是关隘和河流怎样卡住路。单画三层山分不出这篇 |

### 1.4 画面更接近黑白红水墨，但只加在页面图上

场景视频提示词的共用正向、共用负向一句不改，`validate.mjs` 不用为这批图重跑全库。

页面图在本图一句里另外要求：

- 前、中、远三层分开，分别用焦、重、清。
- 飞白可以破开外轮廓，仍然只沿边缘和动势，不铺皴。
- 一处泼墨，不铺满。
- 朱砂只做一处焦点，上限见各图。
- 四边约一成渐隐进 `#eceae4`。

仍禁止：其他色相、金色、文字、五官、日本刀、现代器物、细密皴纹、界画密线、粒子和光斑。

---

## 2. 线框

### 2.1 边缘怎么过渡

```
父级背景 #eceae4（不透明，盖住 #inkbg）

|<--10% 渐隐-->|<-------- 可见画面 -------->|<--10% 渐隐-->|
| 透明，露出纸 |  焦墨只在右侧四成，不顶边  | 透明，露出纸 |
        ^                                              ^
        遮罩 + 图里已经画成纸色                         同左

上下同样各约 10%。渐隐的尽头是纸，不是 WebGL 的 246,246,243。
```

### 2.2 首页和篇横幅统一之后

```
视口 1440，图全宽 1440×600（素材 2400×1000）

+------------------------------------------------------------------+
| 顶栏（纸色，高 56）                                              |
+------------------------------------------------------------------+
| #eceae4 铺满这一段                                               |
|                                                                  |
|  左 42%                         右 58%                           |
|  +------------------+           +------------------------------+ |
|  | 烽火 / 篇名      |           | 10% 渐隐                     | |
|  | 一句说明         |           |     近 / 中 / 远              | |
|  | 印章在字旁，不入图|           |     焦墨不越过右四成          | |
|  +------------------+           | 10% 渐隐                     | |
|                                                                  |
+------------------------------------------------------------------+
| 封面或朝代长卷，父级同样是 #eceae4                               |
+------------------------------------------------------------------+

390：同一张图，宽 390，高约 163。文字改到图下，不叠在焦墨上。
不再使用 358×358 的方图。
```

### 2.3 四张封面

```
战场 残阵                治国 棋局
+----------------+        +----------------+
| 纸             |        | 纸             |
|   远:烟,壁垒   |        |  远:两根柱晕   |
|   中:淡下去的阵|        |  中:一只宽袖   |
|   近:一人持矛  |        |  近:几、粗线盘 |
|   朱旗 <=8%    |        |  一枚朱砂子<=6%|
| 纸             |        | 纸             |
+----------------+        +----------------+

人物 龙座                地理 关河
+----------------+        +----------------+
| 纸             |        | 纸             |
|  远:两根柱     |        |  远:两层清墨山 |
|  中:龙形靠背   |        |  中:关门在山里 |
|   (大块,无鳞)  |        |  近:一条河     |
|  近:空座面     |        |  路穿过门洞    |
|  无字印 <=6%   |        |  一点红 <=3%   |
| 纸             |        | 纸             |
+----------------+        +----------------+

竖幅 4:5。主体完整，头上脚下是纸。四边再渐隐 10%。
```

---

## 3. 提示词

每张都是 art-style.md §5 的共用正向、本图一句、共用负向。本图一句是建议写进 AGENTS.md §5.1 表的新行。生成时整段复制，不要再改色板和红色上限。

共用正向（中文）：

> 高反差黑白红武侠水墨剪影，简化版，画在暖宣纸 `#eceae4` 上。复杂的城、山、天都改成墨晕，不画实景、不画照片。墨分五层：焦 `#141414`、浓 `#3a3a3a`、重 `#6e6e6c`、淡 `#a8a8a4`、清 `#d2d1cc`。人物是侧视大剪影，头身约 1:7，无五官。外轮廓粗笔侧锋、转折见棱角；飞白只沿动势。光是平的，没有体积光、没有光斑。地平线在下三分之一。

共用负向（中文）：

> 不要文字、字母、印章里的字、水印。不要金色、蓝色、青色、绿色、黄色、橙色、紫色。不要写实照片、3D、动漫脸、五官、日本刀、现代建筑、电线、公路、车辆、玻璃、塑料、现代衣服、眼镜、手表、枪、电灯。不要蒸汽机械、界画密线、细密皴纹、霓虹刀光、粒子、镜头光斑。朱砂 `#b3241c` 不超过画面一成，一帧只用一处。

Shared positive:

> High-contrast black-white-red wuxia ink silhouette, simplified, on warm xuan paper #eceae4. Replace any complex city, mountain or sky with ink wash; do not paint a real place or a photograph. Five ink weights only: scorched #141414, dense #3a3a3a, heavy #6e6e6c, pale #a8a8a4, clear #d2d1cc. Side-view silhouette, about seven heads tall, no facial features. Bold angular side-brush contour; dry-brush flying white only along motion. Flat light, no god rays, no lens flare. Horizon in the lower third.

Shared negative:

> No text, letters, characters inside seals, or watermark. No gold, blue, cyan, green, yellow, orange, or purple. No photograph, 3D, anime face, facial features, katana, modern buildings, power lines, roads, vehicles, glass, plastic, modern clothing, eyeglasses, watches, guns, or electric lights. No steampunk machinery, dense ruled lines, dense texture strokes, neon blade light, particles, or lens flare. Vermilion #b3241c stays under 10% of the frame and in one place only.

下面每张先给本图一句，再给可以整段复制的中文和英文。尺寸写在标题上，不写进画面。

### 3.1 首页横幅 `hero-fenghuo-wide` · 2400×1000

本图一句：左侧至少一半几乎是空白宣纸。焦墨只在右侧四成：近景一名持矛的无五官武士，中景悬崖和烽火台，远景清墨山。矛不与人相接。三层分开。飞白只破开袖缘和烽烟。崖下一处泼墨，不铺满。烽火一点朱砂不超过 6%。四边约一成渐隐进 `#eceae4`，不要矩形纸边。

中文：

```
高反差黑白红武侠水墨剪影，简化版，画在暖宣纸 #eceae4 上。复杂的城、山、天都改成墨晕，不画实景、不画照片。墨分五层：焦 #141414、浓 #3a3a3a、重 #6e6e6c、淡 #a8a8a4、清 #d2d1cc。人物是侧视大剪影，头身约 1:7，无五官。外轮廓粗笔侧锋、转折见棱角；飞白只沿动势。光是平的，没有体积光、没有光斑。地平线在下三分之一。左侧至少一半几乎是空白宣纸。焦墨只在右侧四成：近景一名持矛的无五官武士，中景悬崖和烽火台，远景清墨山。矛不与人相接。三层分开。飞白只破开袖缘和烽烟。崖下一处泼墨，不铺满。烽火一点朱砂不超过 6%。四边约一成渐隐进 #eceae4，不要矩形纸边。不要文字、字母、印章里的字、水印。不要金色、蓝色、青色、绿色、黄色、橙色、紫色。不要写实照片、3D、动漫脸、五官、日本刀、现代建筑、电线、公路、车辆、玻璃、塑料、现代衣服、眼镜、手表、枪、电灯。不要蒸汽机械、界画密线、细密皴纹、霓虹刀光、粒子、镜头光斑。朱砂 #b3241c 不超过画面一成，一帧只用一处。
```

English:

```
High-contrast black-white-red wuxia ink silhouette, simplified, on warm xuan paper #eceae4. Replace any complex city, mountain or sky with ink wash; do not paint a real place or a photograph. Five ink weights only: scorched #141414, dense #3a3a3a, heavy #6e6e6c, pale #a8a8a4, clear #d2d1cc. Side-view silhouette, about seven heads tall, no facial features. Bold angular side-brush contour; dry-brush flying white only along motion. Flat light, no god rays, no lens flare. Horizon in the lower third. At least the left half is nearly empty paper. Scorched ink stays inside the right 40%: a faceless spearman in front, a cliff and beacon in the middle, pale mountains far away. The spear touches no one. Three depths stay separate. Flying white only breaks the sleeve edge and the beacon smoke. One ink splash under the cliff, not across the frame. One vermilion point in the beacon fire, under 6%. The outer tenth of each edge fades into #eceae4. No rectangular border. No text, letters, characters inside seals, or watermark. No gold, blue, cyan, green, yellow, orange, or purple. No photograph, 3D, anime face, facial features, katana, modern buildings, power lines, roads, vehicles, glass, plastic, modern clothing, eyeglasses, watches, guns, or electric lights. No steampunk machinery, dense ruled lines, dense texture strokes, neon blade light, particles, or lens flare. Vermilion #b3241c stays under 10% of the frame and in one place only.
```

手机用这一张裁切，不另出方图。

### 3.2 战场横幅 `banner-zhanchang` · 2400×1000

本图一句：左侧至少一半空白。右侧只画残阵。近景一名无五官武士，矛竖着；中景成排剪影由焦到淡，矛不相接；远景是清墨烟和一块壁垒。飞白沿旗边。地上一处泼墨。一面朱旗不超过 8%。四边约一成渐隐进 `#eceae4`，不要矩形纸边。

中文：

```
高反差黑白红武侠水墨剪影，简化版，画在暖宣纸 #eceae4 上。复杂的城、山、天都改成墨晕，不画实景、不画照片。墨分五层：焦 #141414、浓 #3a3a3a、重 #6e6e6c、淡 #a8a8a4、清 #d2d1cc。人物是侧视大剪影，头身约 1:7，无五官。外轮廓粗笔侧锋、转折见棱角；飞白只沿动势。光是平的，没有体积光、没有光斑。地平线在下三分之一。左侧至少一半空白。右侧只画残阵。近景一名无五官武士，矛竖着；中景成排剪影由焦到淡，矛不相接；远景是清墨烟和一块壁垒。飞白沿旗边。地上一处泼墨。一面朱旗不超过 8%。四边约一成渐隐进 #eceae4，不要矩形纸边。不要文字、字母、印章里的字、水印。不要金色、蓝色、青色、绿色、黄色、橙色、紫色。不要写实照片、3D、动漫脸、五官、日本刀、现代建筑、电线、公路、车辆、玻璃、塑料、现代衣服、眼镜、手表、枪、电灯。不要蒸汽机械、界画密线、细密皴纹、霓虹刀光、粒子、镜头光斑。朱砂 #b3241c 不超过画面一成，一帧只用一处。
```

English:

```
High-contrast black-white-red wuxia ink silhouette, simplified, on warm xuan paper #eceae4. Replace any complex city, mountain or sky with ink wash; do not paint a real place or a photograph. Five ink weights only: scorched #141414, dense #3a3a3a, heavy #6e6e6c, pale #a8a8a4, clear #d2d1cc. Side-view silhouette, about seven heads tall, no facial features. Bold angular side-brush contour; dry-brush flying white only along motion. Flat light, no god rays, no lens flare. Horizon in the lower third. At least the left half is empty. The right holds one subject: a formation after the clash. One faceless warrior in front, spear upright; ranks behind him fading from scorched to pale, spears not touching; far away, clear-ink smoke and one wall block. Flying white only along the banner edge. One splash on the ground. One vermilion banner, under 8%. The outer tenth of each edge fades into #eceae4. No rectangular border. No text, letters, characters inside seals, or watermark. No gold, blue, cyan, green, yellow, orange, or purple. No photograph, 3D, anime face, facial features, katana, modern buildings, power lines, roads, vehicles, glass, plastic, modern clothing, eyeglasses, watches, guns, or electric lights. No steampunk machinery, dense ruled lines, dense texture strokes, neon blade light, particles, or lens flare. Vermilion #b3241c stays under 10% of the frame and in one place only.
```

### 3.3 战场封面 `pian-zhanchang` · 800×1000

本图一句：竖幅。残阵完整，头顶和脚下都留纸。近景一名无五官武士，矛竖着；中景成排剪影由焦到淡，矛不相接；远景清墨烟和一块壁垒。飞白沿旗边。地上一处泼墨。一面朱旗不超过 8%。四边约一成渐隐进 `#eceae4`，不要矩形纸边。

中文：

```
高反差黑白红武侠水墨剪影，简化版，画在暖宣纸 #eceae4 上。复杂的城、山、天都改成墨晕，不画实景、不画照片。墨分五层：焦 #141414、浓 #3a3a3a、重 #6e6e6c、淡 #a8a8a4、清 #d2d1cc。人物是侧视大剪影，头身约 1:7，无五官。外轮廓粗笔侧锋、转折见棱角；飞白只沿动势。光是平的，没有体积光、没有光斑。地平线在下三分之一。竖幅。残阵完整，头顶和脚下都留纸。近景一名无五官武士，矛竖着；中景成排剪影由焦到淡，矛不相接；远景清墨烟和一块壁垒。飞白沿旗边。地上一处泼墨。一面朱旗不超过 8%。四边约一成渐隐进 #eceae4，不要矩形纸边。不要文字、字母、印章里的字、水印。不要金色、蓝色、青色、绿色、黄色、橙色、紫色。不要写实照片、3D、动漫脸、五官、日本刀、现代建筑、电线、公路、车辆、玻璃、塑料、现代衣服、眼镜、手表、枪、电灯。不要蒸汽机械、界画密线、细密皴纹、霓虹刀光、粒子、镜头光斑。朱砂 #b3241c 不超过画面一成，一帧只用一处。
```

English:

```
High-contrast black-white-red wuxia ink silhouette, simplified, on warm xuan paper #eceae4. Replace any complex city, mountain or sky with ink wash; do not paint a real place or a photograph. Five ink weights only: scorched #141414, dense #3a3a3a, heavy #6e6e6c, pale #a8a8a4, clear #d2d1cc. Side-view silhouette, about seven heads tall, no facial features. Bold angular side-brush contour; dry-brush flying white only along motion. Flat light, no god rays, no lens flare. Horizon in the lower third. Vertical. The formation is complete, with paper above and below. One faceless warrior in front, spear upright; ranks fading from scorched to pale, spears not touching; clear-ink smoke and one wall block far away. Flying white only along the banner edge. One splash on the ground. One vermilion banner, under 8%. The outer tenth of each edge fades into #eceae4. No rectangular border. No text, letters, characters inside seals, or watermark. No gold, blue, cyan, green, yellow, orange, or purple. No photograph, 3D, anime face, facial features, katana, modern buildings, power lines, roads, vehicles, glass, plastic, modern clothing, eyeglasses, watches, guns, or electric lights. No steampunk machinery, dense ruled lines, dense texture strokes, neon blade light, particles, or lens flare. Vermilion #b3241c stays under 10% of the frame and in one place only.
```

### 3.4 治国横幅 `banner-zhiguo` · 2400×1000

本图一句：左侧至少一半空白。右侧只画一局围棋。矮几上的棋盘只用几笔粗墨，不要十九路密线。数枚平涂黑子，一枚朱砂子不超过 6%。几旁可以露出一只宽袖，袖中无兵器，人无五官。近景是几和子，中景是袖，远景是两根平涂柱的墨晕。四边约一成渐隐进 `#eceae4`，不要矩形纸边。

中文：

```
高反差黑白红武侠水墨剪影，简化版，画在暖宣纸 #eceae4 上。复杂的城、山、天都改成墨晕，不画实景、不画照片。墨分五层：焦 #141414、浓 #3a3a3a、重 #6e6e6c、淡 #a8a8a4、清 #d2d1cc。人物是侧视大剪影，头身约 1:7，无五官。外轮廓粗笔侧锋、转折见棱角；飞白只沿动势。光是平的，没有体积光、没有光斑。地平线在下三分之一。左侧至少一半空白。右侧只画一局围棋。矮几上的棋盘只用几笔粗墨，不要十九路密线。数枚平涂黑子，一枚朱砂子不超过 6%。几旁可以露出一只宽袖，袖中无兵器，人无五官。近景是几和子，中景是袖，远景是两根平涂柱的墨晕。四边约一成渐隐进 #eceae4，不要矩形纸边。不要文字、字母、印章里的字、水印。不要金色、蓝色、青色、绿色、黄色、橙色、紫色。不要写实照片、3D、动漫脸、五官、日本刀、现代建筑、电线、公路、车辆、玻璃、塑料、现代衣服、眼镜、手表、枪、电灯。不要蒸汽机械、界画密线、细密皴纹、霓虹刀光、粒子、镜头光斑。朱砂 #b3241c 不超过画面一成，一帧只用一处。
```

English:

```
High-contrast black-white-red wuxia ink silhouette, simplified, on warm xuan paper #eceae4. Replace any complex city, mountain or sky with ink wash; do not paint a real place or a photograph. Five ink weights only: scorched #141414, dense #3a3a3a, heavy #6e6e6c, pale #a8a8a4, clear #d2d1cc. Side-view silhouette, about seven heads tall, no facial features. Bold angular side-brush contour; dry-brush flying white only along motion. Flat light, no god rays, no lens flare. Horizon in the lower third. At least the left half is empty. The right holds one weiqi game. The board on a low desk is a few thick ink strokes, not a dense nineteen-line grid. Several flat black stones and one vermilion stone, under 6%. A wide sleeve may show beside the desk, no weapon in it, no face. Desk and stones in front, the sleeve in the middle, two flat columns as ink wash far away. The outer tenth of each edge fades into #eceae4. No rectangular border. No text, letters, characters inside seals, or watermark. No gold, blue, cyan, green, yellow, orange, or purple. No photograph, 3D, anime face, facial features, katana, modern buildings, power lines, roads, vehicles, glass, plastic, modern clothing, eyeglasses, watches, guns, or electric lights. No steampunk machinery, dense ruled lines, dense texture strokes, neon blade light, particles, or lens flare. Vermilion #b3241c stays under 10% of the frame and in one place only.
```

### 3.5 治国封面 `pian-zhiguo` · 800×1000

本图一句：竖幅。棋局完整，头顶和脚下都留纸。矮几上的棋盘只用几笔粗墨，不要十九路密线。数枚平涂黑子，一枚朱砂子不超过 6%。一只宽袖在中景，袖中无兵器，人无五官。远景两根平涂柱的墨晕。四边约一成渐隐进 `#eceae4`，不要矩形纸边。

中文：

```
高反差黑白红武侠水墨剪影，简化版，画在暖宣纸 #eceae4 上。复杂的城、山、天都改成墨晕，不画实景、不画照片。墨分五层：焦 #141414、浓 #3a3a3a、重 #6e6e6c、淡 #a8a8a4、清 #d2d1cc。人物是侧视大剪影，头身约 1:7，无五官。外轮廓粗笔侧锋、转折见棱角；飞白只沿动势。光是平的，没有体积光、没有光斑。地平线在下三分之一。竖幅。棋局完整，头顶和脚下都留纸。矮几上的棋盘只用几笔粗墨，不要十九路密线。数枚平涂黑子，一枚朱砂子不超过 6%。一只宽袖在中景，袖中无兵器，人无五官。远景两根平涂柱的墨晕。四边约一成渐隐进 #eceae4，不要矩形纸边。不要文字、字母、印章里的字、水印。不要金色、蓝色、青色、绿色、黄色、橙色、紫色。不要写实照片、3D、动漫脸、五官、日本刀、现代建筑、电线、公路、车辆、玻璃、塑料、现代衣服、眼镜、手表、枪、电灯。不要蒸汽机械、界画密线、细密皴纹、霓虹刀光、粒子、镜头光斑。朱砂 #b3241c 不超过画面一成，一帧只用一处。
```

English:

```
High-contrast black-white-red wuxia ink silhouette, simplified, on warm xuan paper #eceae4. Replace any complex city, mountain or sky with ink wash; do not paint a real place or a photograph. Five ink weights only: scorched #141414, dense #3a3a3a, heavy #6e6e6c, pale #a8a8a4, clear #d2d1cc. Side-view silhouette, about seven heads tall, no facial features. Bold angular side-brush contour; dry-brush flying white only along motion. Flat light, no god rays, no lens flare. Horizon in the lower third. Vertical. The game is complete, with paper above and below. The board is a few thick ink strokes, not a dense nineteen-line grid. Several flat black stones and one vermilion stone, under 6%. One wide sleeve in the middle ground, no weapon, no face. Two flat columns as ink wash far away. The outer tenth of each edge fades into #eceae4. No rectangular border. No text, letters, characters inside seals, or watermark. No gold, blue, cyan, green, yellow, orange, or purple. No photograph, 3D, anime face, facial features, katana, modern buildings, power lines, roads, vehicles, glass, plastic, modern clothing, eyeglasses, watches, guns, or electric lights. No steampunk machinery, dense ruled lines, dense texture strokes, neon blade light, particles, or lens flare. Vermilion #b3241c stays under 10% of the frame and in one place only.
```

### 3.6 人物横幅 `banner-renwu` · 2400×1000

本图一句：左侧至少一半空白。右侧只画一座空的龙座，侧视。龙是靠背上三四块大剪影，不画鳞，不描金。座面是纸白。座上没有人。近景是座，中景是龙形靠背，远景是两根平涂柱。座侧一块无字朱印不超过 6%。四边约一成渐隐进 `#eceae4`，不要矩形纸边。

中文：

```
高反差黑白红武侠水墨剪影，简化版，画在暖宣纸 #eceae4 上。复杂的城、山、天都改成墨晕，不画实景、不画照片。墨分五层：焦 #141414、浓 #3a3a3a、重 #6e6e6c、淡 #a8a8a4、清 #d2d1cc。人物是侧视大剪影，头身约 1:7，无五官。外轮廓粗笔侧锋、转折见棱角；飞白只沿动势。光是平的，没有体积光、没有光斑。地平线在下三分之一。左侧至少一半空白。右侧只画一座空的龙座，侧视。龙是靠背上三四块大剪影，不画鳞，不描金。座面是纸白。座上没有人。近景是座，中景是龙形靠背，远景是两根平涂柱。座侧一块无字朱印不超过 6%。四边约一成渐隐进 #eceae4，不要矩形纸边。不要文字、字母、印章里的字、水印。不要金色、蓝色、青色、绿色、黄色、橙色、紫色。不要写实照片、3D、动漫脸、五官、日本刀、现代建筑、电线、公路、车辆、玻璃、塑料、现代衣服、眼镜、手表、枪、电灯。不要蒸汽机械、界画密线、细密皴纹、霓虹刀光、粒子、镜头光斑。朱砂 #b3241c 不超过画面一成，一帧只用一处。
```

English:

```
High-contrast black-white-red wuxia ink silhouette, simplified, on warm xuan paper #eceae4. Replace any complex city, mountain or sky with ink wash; do not paint a real place or a photograph. Five ink weights only: scorched #141414, dense #3a3a3a, heavy #6e6e6c, pale #a8a8a4, clear #d2d1cc. Side-view silhouette, about seven heads tall, no facial features. Bold angular side-brush contour; dry-brush flying white only along motion. Flat light, no god rays, no lens flare. Horizon in the lower third. At least the left half is empty. The right holds one empty dragon throne, side view. The dragon is three or four large silhouette masses on the backrest, no scales, no gold. The seat is paper white. Nobody sits there. The seat is near, the dragon back is in the middle, two flat columns are far. One blank vermilion seal beside the throne, no characters, under 6%. The outer tenth of each edge fades into #eceae4. No rectangular border. No text, letters, characters inside seals, or watermark. No gold, blue, cyan, green, yellow, orange, or purple. No photograph, 3D, anime face, facial features, katana, modern buildings, power lines, roads, vehicles, glass, plastic, modern clothing, eyeglasses, watches, guns, or electric lights. No steampunk machinery, dense ruled lines, dense texture strokes, neon blade light, particles, or lens flare. Vermilion #b3241c stays under 10% of the frame and in one place only.
```

### 3.7 人物封面 `pian-renwu` · 800×1000

本图一句：竖幅。龙座完整，头顶和脚下都留纸。侧视空座，龙是靠背上三四块大剪影，不画鳞，不描金，座面是纸白，座上没有人。远景两根平涂柱。座侧一块无字朱印不超过 6%。四边约一成渐隐进 `#eceae4`，不要矩形纸边。

中文：

```
高反差黑白红武侠水墨剪影，简化版，画在暖宣纸 #eceae4 上。复杂的城、山、天都改成墨晕，不画实景、不画照片。墨分五层：焦 #141414、浓 #3a3a3a、重 #6e6e6c、淡 #a8a8a4、清 #d2d1cc。人物是侧视大剪影，头身约 1:7，无五官。外轮廓粗笔侧锋、转折见棱角；飞白只沿动势。光是平的，没有体积光、没有光斑。地平线在下三分之一。竖幅。龙座完整，头顶和脚下都留纸。侧视空座，龙是靠背上三四块大剪影，不画鳞，不描金，座面是纸白，座上没有人。远景两根平涂柱。座侧一块无字朱印不超过 6%。四边约一成渐隐进 #eceae4，不要矩形纸边。不要文字、字母、印章里的字、水印。不要金色、蓝色、青色、绿色、黄色、橙色、紫色。不要写实照片、3D、动漫脸、五官、日本刀、现代建筑、电线、公路、车辆、玻璃、塑料、现代衣服、眼镜、手表、枪、电灯。不要蒸汽机械、界画密线、细密皴纹、霓虹刀光、粒子、镜头光斑。朱砂 #b3241c 不超过画面一成，一帧只用一处。
```

English:

```
High-contrast black-white-red wuxia ink silhouette, simplified, on warm xuan paper #eceae4. Replace any complex city, mountain or sky with ink wash; do not paint a real place or a photograph. Five ink weights only: scorched #141414, dense #3a3a3a, heavy #6e6e6c, pale #a8a8a4, clear #d2d1cc. Side-view silhouette, about seven heads tall, no facial features. Bold angular side-brush contour; dry-brush flying white only along motion. Flat light, no god rays, no lens flare. Horizon in the lower third. Vertical. The throne is complete, with paper above and below. Empty seat in side view. The dragon is three or four large masses on the backrest, no scales, no gold, the seat paper white, nobody sitting. Two flat columns far away. One blank vermilion seal beside the throne, under 6%. The outer tenth of each edge fades into #eceae4. No rectangular border. No text, letters, characters inside seals, or watermark. No gold, blue, cyan, green, yellow, orange, or purple. No photograph, 3D, anime face, facial features, katana, modern buildings, power lines, roads, vehicles, glass, plastic, modern clothing, eyeglasses, watches, guns, or electric lights. No steampunk machinery, dense ruled lines, dense texture strokes, neon blade light, particles, or lens flare. Vermilion #b3241c stays under 10% of the frame and in one place only.
```

### 3.8 地理横幅 `banner-dili` · 2400×1000

本图一句：左侧至少一半空白。右侧只画关河。近景一条淡墨河，中景一座关门嵌在重墨山里，一条路穿过门洞，远景再两层清墨山。不画皴，不画车马细部。地平线上一小点朱砂不超过 3%。四边约一成渐隐进 `#eceae4`，不要矩形纸边。

中文：

```
高反差黑白红武侠水墨剪影，简化版，画在暖宣纸 #eceae4 上。复杂的城、山、天都改成墨晕，不画实景、不画照片。墨分五层：焦 #141414、浓 #3a3a3a、重 #6e6e6c、淡 #a8a8a4、清 #d2d1cc。人物是侧视大剪影，头身约 1:7，无五官。外轮廓粗笔侧锋、转折见棱角；飞白只沿动势。光是平的，没有体积光、没有光斑。地平线在下三分之一。左侧至少一半空白。右侧只画关河。近景一条淡墨河，中景一座关门嵌在重墨山里，一条路穿过门洞，远景再两层清墨山。不画皴，不画车马细部。地平线上一小点朱砂不超过 3%。四边约一成渐隐进 #eceae4，不要矩形纸边。不要文字、字母、印章里的字、水印。不要金色、蓝色、青色、绿色、黄色、橙色、紫色。不要写实照片、3D、动漫脸、五官、日本刀、现代建筑、电线、公路、车辆、玻璃、塑料、现代衣服、眼镜、手表、枪、电灯。不要蒸汽机械、界画密线、细密皴纹、霓虹刀光、粒子、镜头光斑。朱砂 #b3241c 不超过画面一成，一帧只用一处。
```

English:

```
High-contrast black-white-red wuxia ink silhouette, simplified, on warm xuan paper #eceae4. Replace any complex city, mountain or sky with ink wash; do not paint a real place or a photograph. Five ink weights only: scorched #141414, dense #3a3a3a, heavy #6e6e6c, pale #a8a8a4, clear #d2d1cc. Side-view silhouette, about seven heads tall, no facial features. Bold angular side-brush contour; dry-brush flying white only along motion. Flat light, no god rays, no lens flare. Horizon in the lower third. At least the left half is empty. The right holds one pass and one river. A pale river in front, a gate set into a heavy-ink mountain in the middle, one road through the gate, two more clear-ink ranges far away. No texture strokes, no carriage detail. One vermilion dot on the horizon, under 3%. The outer tenth of each edge fades into #eceae4. No rectangular border. No text, letters, characters inside seals, or watermark. No gold, blue, cyan, green, yellow, orange, or purple. No photograph, 3D, anime face, facial features, katana, modern buildings, power lines, roads, vehicles, glass, plastic, modern clothing, eyeglasses, watches, guns, or electric lights. No steampunk machinery, dense ruled lines, dense texture strokes, neon blade light, particles, or lens flare. Vermilion #b3241c stays under 10% of the frame and in one place only.
```

### 3.9 地理封面 `pian-dili` · 800×1000

本图一句：竖幅。关河完整，头顶和脚下都留纸。近景一条淡墨河，中景关门嵌在重墨山里，路穿过门洞，远景两层清墨山。不画皴。地平线上一小点朱砂不超过 3%。四边约一成渐隐进 `#eceae4`，不要矩形纸边。

中文：

```
高反差黑白红武侠水墨剪影，简化版，画在暖宣纸 #eceae4 上。复杂的城、山、天都改成墨晕，不画实景、不画照片。墨分五层：焦 #141414、浓 #3a3a3a、重 #6e6e6c、淡 #a8a8a4、清 #d2d1cc。人物是侧视大剪影，头身约 1:7，无五官。外轮廓粗笔侧锋、转折见棱角；飞白只沿动势。光是平的，没有体积光、没有光斑。地平线在下三分之一。竖幅。关河完整，头顶和脚下都留纸。近景一条淡墨河，中景关门嵌在重墨山里，路穿过门洞，远景两层清墨山。不画皴。地平线上一小点朱砂不超过 3%。四边约一成渐隐进 #eceae4，不要矩形纸边。不要文字、字母、印章里的字、水印。不要金色、蓝色、青色、绿色、黄色、橙色、紫色。不要写实照片、3D、动漫脸、五官、日本刀、现代建筑、电线、公路、车辆、玻璃、塑料、现代衣服、眼镜、手表、枪、电灯。不要蒸汽机械、界画密线、细密皴纹、霓虹刀光、粒子、镜头光斑。朱砂 #b3241c 不超过画面一成，一帧只用一处。
```

English:

```
High-contrast black-white-red wuxia ink silhouette, simplified, on warm xuan paper #eceae4. Replace any complex city, mountain or sky with ink wash; do not paint a real place or a photograph. Five ink weights only: scorched #141414, dense #3a3a3a, heavy #6e6e6c, pale #a8a8a4, clear #d2d1cc. Side-view silhouette, about seven heads tall, no facial features. Bold angular side-brush contour; dry-brush flying white only along motion. Flat light, no god rays, no lens flare. Horizon in the lower third. Vertical. The pass and river are complete, with paper above and below. A pale river in front, a gate in a heavy-ink mountain, a road through the opening, two clear-ink ranges far away. No texture strokes. One vermilion dot on the horizon, under 3%. The outer tenth of each edge fades into #eceae4. No rectangular border. No text, letters, characters inside seals, or watermark. No gold, blue, cyan, green, yellow, orange, or purple. No photograph, 3D, anime face, facial features, katana, modern buildings, power lines, roads, vehicles, glass, plastic, modern clothing, eyeglasses, watches, guns, or electric lights. No steampunk machinery, dense ruled lines, dense texture strokes, neon blade light, particles, or lens flare. Vermilion #b3241c stays under 10% of the frame and in one place only.
```

---

## 4. 文档要改的条目

这些句子放在文档 PR 里。不要改 `video/tools/art-style.mjs` 里写进每个场景 `videoPrompt` 的共用块，也不要为此重跑 316 场。

### AGENTS.md

- §5 构图、效果两条后面各加一句：页面图要有前中远三层，飞白可以破开外轮廓，允许一处泼墨；场景视频镜头仍按原句，高潮才泼墨。
- §5.1 的表：`主图宽` 换成 §3.1 的一句。`横幅`、`卡片` 两行拆成战场残阵、治国棋局、人物龙座、地理关河四对，红色上限分别是 8%、6%、6%、3%。删掉「柱、竹简与文臣」「一名无兵器的人」「河、三层山和一条路」作为页面图的现行句。
- §5.1 英文那一行按上表改。
- §10 第 7 条补一句：首页横幅和篇横幅是同一个组件，图的四边渐隐进 `#eceae4`。
- §12 表的「短片与提示词」列：战场写成残阵与朱旗；治国加上棋局；人物从「无五官的剪影肖像」改为龙座剪影；地理写成关河。页面列的版式（斜杠、格网、竖幅、长卷）不动。

### art-style.md

- §2.2 笔线：页面静帧的飞白可以破开外轮廓；仍不铺皴。
- §2.3 构图：页面图四边约一成是 `#eceae4`，不留矩形纸边。
- §2.5 效果：页面静帧可以有一处泼墨；视频高潮镜的规则不改。
- §5 共用正向、共用负向的原文不动。
- §5.4 主图、横幅、卡片三行换成 §3 的九张图（首页一张，四篇横幅，四篇封面）。横幅比例从 4:1 改为 12:5（2400×1000）。

`plan/README.md` 的索引表加一行，指向本文。这一行跟文档 PR 走，不在本方案的提交里。

---

## 5. 分 PR

五支都从最新 `main` 开，目标都是 `main`。不要从另一支的分支上再开。可以同时做。合并顺序不影响另一支能不能合。地图 63 张和 21 条成片不单开出图 PR。

| PR | 分支上只放 | 动哪些文件 | 不动 |
|---|---|---|---|
| A 内容站版式 | 全宽 `.sheet`、父级 `#eceae4`、主图 / 封面 / 地图 / 海报框的渐隐、去掉地图和播放器的实线框、页脚和空状态若像矩形也渐隐、删掉没用的 `--tex-paper` / `--tex-blot` | `video/viewer/index.html`、`video/viewer/pian.css` | 不换主图和封面，不改关系图，不重编码 mp4 |
| B 文档 | §4 的条目，并写明关系图、地图、海报也只用这七色 | `AGENTS.md`、`video/docs/art-style.md`、`plan/README.md` | 不改 `art-style.mjs`，不重生成场景提示词，不改页面 |
| C 横幅 | 按 §3.1–§3.2、§3.4、§3.6、§3.8 出图，webp + jpg | `hero-fenghuo-wide.*`、四张 `banner-*`；可删 `hero-fenghuo-m.*` | 不改封面，不改 CSS |
| D 封面 | 按 §3.3、§3.5、§3.7、§3.9 出图，webp + jpg | 四张 `pian-*` | 不改横幅，不改 CSS |
| E 其余页面和边角素材 | 关系图改成七色、直角；重画 `timeline-node`；删 `fenghuo-hero`、`paper-fiber`、`paper-ink-stains`、`ink-blot-corner` | `video/viewer/05-09-jingke-relations.html`、`timeline-node.png`（及 webp）、上述退役文件 | 不改 `index.html` 的横幅结构，不重渲染地图，不重编码 mp4 |

A 先合上时，旧图会被遮罩裁软，窄带会变宽，底色台阶会消失，地图和播放器不再是硬框。C、D 后合上也只是换图。B 只改文档。E 单独改关系图和边角文件，不依赖 A。

---

## 6. 验收（只交截图）

无头 Chrome，1440×900 与 390×844，像素比 1。每张 PR 交改前改后，不录屏。真实 GPU 未看过就写未实测。

| PR | 截哪些 | 过关 |
|---|---|---|
| A | 首页 1440、任一页横幅 1440、首页 390、封面区 1440、地理篇地图 1440、任一章开场视频海报 1440 | 横幅宽等于视口宽。图框外采样和 `#eceae4` 的通道差之和 ≤ 8（现在首页是 37）。主图、地图、海报四边看得到渐隐，没有新的描边、圆角、投影 |
| B | 不交画面。文档 PR 没有截图项 | 条目与 §3、§4 和盘点一致；`validate.mjs` 仍是 0 错误 |
| C | 首页 1440、四篇横幅各一张 1440、首页 390 | 右四成才有焦墨；首页是烽火，战场是残阵，治国是粗线棋盘加一枚朱砂子，人物是空龙座，地理是关河。红只有一处。墨不顶边 |
| D | 首页封面区 1440，必要时每张封面裁一块 | 与同篇横幅是同一件事。竖幅上下有纸。治国封面的墨不再顶到左缘和上缘 |
| E | 关系图 1440 和 390、内容站时间轴节点特写一张 | 画面上不再出现蓝、绿、金、紫和圆角。节点只有墨、纸、朱砂三色 |

A 的色差用和 §0 相同的方法：框外 8px 的通道差之和。SwiftShader 上量。Mac 上再看一次之前，结论写未实测。
