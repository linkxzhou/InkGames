# 美术风格指南：黑白红武侠水墨剪影（简化版）

> 适用范围：`video/` 全部场景的视频生成提示词（`videoPrompt`）、素材提示词（`artPrompts`）、开场分镜与水墨效果用词；引擎侧的取舍见 [docs/13 · 美术风格与引擎影响](../../docs/13-art-style.md)。
> 生成器共用的风格常量在 [`video/tools/art-style.mjs`](../tools/art-style.mjs)，改风格只改那一个文件，再跑 `build-video-prompts.mjs` 与 `build-art-prompts.mjs`。

## 1. 参照：《影之刃》系列（灵游坊 / S-Game）

只作气质参照，**不复制、不引用其任何素材与图片，提示词里不出现其角色名**，提示词统一写作“高反差黑白红武侠水墨剪影风（类《影之刃》，简化版）”。

2026-10 查阅的公开资料（开发者访谈、媒体评测）里，这个系列的视觉大致是：

- **暗黑武侠的冷峻气质**：主题阴郁、画风粗粝，开发者自称“KUNGFUPUNK”，即传统中国元素混搭机关术等幻想设定（游戏陀螺对梁其伟的访谈）。
- **低饱和冷色大背景 + 红色（以及金色）高光**：访谈里明确提到“低饱和度、冷色大背景与红、金色高光的对比”是系列一以贯之的美术要素。
- **人物“大黑大白”的写意轮廓**：《影之刃3》以写意方式构建角色轮廓，用大黑大白的比例表现角色厚度，强调“力”与“形”（游民星空报道）。
- **场景用细密的界画线条再铺幽暗色彩**（《影之刃3》场景美术自述）；《影之刃零》的地图则是画在宣纸上的水墨图。
- **横版动作与动势**：前作为横版格斗，招式靠剪影姿态、刀光和拖影读出来。

我们取其中最适合历史短片与横版引擎的部分：**黑、白、红的高反差，剪影人物，泼墨与血雾的打击感，侧视的武侠戏剧感**。系列里的金色高光、蒸汽朋克机械、细密界画线条与复杂材质，**一律不用**。复杂实景改成墨晕，不画照片式的城、山、天。

### 1.1 色彩归纳（2026-10-12，只据公开文字，不临摹画面）

公开访谈和评测**没有给出官方色值或色板文件**。下面的占比和 Hex 是我们锁死的简化，不是从他们的宣传图吸色。吸色或临摹画面都不做。

| 范围 | 资料里实际说了什么 | 水墨简化版 |
|---|---|---|
| 人物轮廓 | 美术总监 Michael CTY（《影之刃3》，游民星空 2020-12-25）：少画繁复细节，写意轮廓，用大黑大白的比例出厚度，以「力」和「型」做骨架。服装按功能分层，不按装饰堆。 | 人物主体约七成是焦墨 `#141414`。内部只用浓墨 `#3a3a3a` 分一两块，不超过人物面积一成五。纸白是底，不是皮肤高光。 |
| 服饰、发丝 | 梁其伟（腾讯新闻 2023-06-26）：武侠要朴、要带一点尘土，破蓑衣、斗笠压住脸，不要高饱和的新绸缎。发丝和面容在原作里要质感；我们这里不画。 | 只留冠、髻、袖、甲的外轮廓。不画发丝，不画五官。袖摆可以有枯笔飞白。 |
| 兵刃 | 同一访谈里的意象是雨中一把剑、寒光一闪。评测把刀光写成黑灰底上最跳的一笔。 | 刃口一笔纸白或淡灰，刀身仍是焦墨。不画金色刃，不画日本刀。 |
| 红色点缀 | 梁其伟谈《影之刃零》（游戏陀螺）：从 2D 抽出的要素是低饱和、冷色大背景，对比红和金色高光。2014 年评测（360 游戏、益玩）：全场景黑与灰，技能和喷出的血最刺激。GameRant 引他的话：树上挂的红布是传统色，机械臂和炮是另一套。 | 只留朱砂 `#b3241c`。用在血、旗、落日、空白印。单帧不超过一成，一帧一处。金色高光不收。 |
| 天空、远景 | 2014 评测：黑与灰，阴暗。游民星空 2021-01：场景用《千里江山图》《清明上河图》式的界画密线再铺幽暗色，繁复里有疏离。 | 不画界画，不画实景天空。最远是清墨 `#d2d1cc` 的晕，然后淡墨 `#a8a8a4` 的山，中景重墨 `#6e6e6c` 的建筑块。层与层之间留纸。 |
| 雾、月、日 | 《影之刃零》的玩家向描述里出现过瘴气、浑浊天光、灰雾挡月、火把（当游网）。那些偏黄、偏紫的光不收。 | 雾是清墨晕开的毛边。月是纸白的圆，没有光晕。日只在地平线上一小块朱砂，不画橙黄圆日。 |
| 刀光、血、动作线、冲击 | 2014 评测：线与墨构成画面，血在黑灰里跳出来。《影之刃零》试玩描述有拖尾、暗红碎粒、火星、血像泼到墙上、烟像淡墨（当游网）。屏幕闪白和金属火星不收。 | 刀光是沿挥砍方向的枯笔飞白，纸白或焦灰，不是霓虹。血是斜向的朱砂点，面积见上。动作线最多两笔侧锋。冲击是一圈淡墨，不要光斑、不要粒子。 |

资料（均为文字，未把宣传图放进仓库）：

- 游戏陀螺 / 陀螺科技对梁其伟的访谈：低饱和、冷色大背景、红与金色高光、KUNGFUPUNK。[youxituoluo.com/530799.html](http://www.youxituoluo.com/530799.html)
- 腾讯新闻 2023-06-26 专访：武侠要朴、要带尘土，不要高饱和戏装。[news.qq.com/rain/a/20230626A09UJA00](https://news.qq.com/rain/a/20230626A09UJA00)
- 游民星空 2020-12-25，Michael CTY：写意轮廓、大黑大白、力与型。[shouyou.gamersky.com/news/202012/1349494.shtml](https://shouyou.gamersky.com/news/202012/1349494.shtml)
- 游民星空 2021-01：阴郁粗粝；环境用界画密线（这一条我们改成墨晕，不照做）。[shouyou.gamersky.com/news/202101/1357660.shtml](https://shouyou.gamersky.com/news/202101/1357660.shtml)
- 360 游戏、益玩，2014 年《影之刃》评测：黑灰浓墨，技能和血最跳。
- PlayStation Blog（2023-05-24）与 GameRant：暗、冷、荒；红布是传统色，机械与炮是功夫朋克，不进入本项目。
- A9VG 对《影之刃零》的试玩：地图是水墨的，钢铁高塔是另一套，不进入本项目。

明暗关系收成一句：纸最亮，人最黑，中间只留三四层灰；红比最黑的人更「跳」，但面积小。对比靠黑白块，不靠彩色渐变。笔触是侧锋、见棱角、飞白只跟动势走。

## 2. 我们的简化版

一句话：**纸上只有黑、灰、白和一点红；人物是能一眼读懂的大剪影；背景是三四层平涂的灰；只有打击和高潮才泼墨见红。**

### 2.1 色板

| 名称 | Hex | 用途 |
|---|---|---|
| 墨黑 | `#141414` | 人物剪影、近景、兵器、主笔画 |
| 焦灰 | `#3a3a3a` | 近景次要物、剪影内部的少量分块 |
| 中灰 | `#6e6e6c` | 中景山石、建筑剪影 |
| 淡灰 | `#a8a8a4` | 远山第二层、烟 |
| 雾灰 | `#d2d1cc` | 最远层、雾、水面 |
| 纸白 | `#eceae4` | 底色、留白、月、雪、灯火 |
| 朱砂红 | `#b3241c` | **唯一强调色**：血、落日、旗帜、印章 |

规则：朱砂红单帧面积不超过一成；一帧里最多一处红；不出现其他色相（原各章的点缀色只留在数据里作为章节标识，不进入提示词）。

### 2.2 笔线

- 外轮廓用粗笔、侧锋，转折处见棱角，不画圆滑的匀线。
- 枯笔飞白只用在动势方向（衣摆、刀光、马尾、烟），作拖尾。页面静帧的飞白可以破开外轮廓；仍不铺皴。
- 剪影内部最多两三笔焦灰分块，交代臂、甲、袖的前后关系，不画衣纹细节。
- 不用界画尺线、不用皴法密点；山石用块面，不用皴擦。

### 2.3 构图

- 横向侧视为主，地平线放在画面下三分之一，便于和横版引擎镜头一致。
- 三到四个景深层：最远雾灰 → 淡灰山 → 中灰建筑/竹林 → 墨黑主体，层与层之间留白。
- 主体剪影占画面高度三到五成，四周至少三成留白。
- 一帧只讲一件事；群像以成排剪影由黑到灰逐层退远，不画细节人群。
- 页面图四边约一成是 `#eceae4`，不留矩形纸边。

### 2.4 人物

- 头身比约 1:7，武将略高壮，文士略瘦长，孩童 1:4～1:5；不做 Q 版。
- 剪影优先：只保留冠帽、发髻、袖摆、兵器、甲片的大轮廓，背光看也能认出身份与朝代。
- 面部几乎不画五官，最多一笔眉眼或一处留白；表情靠姿态。
- 时代服饰只取轮廓特征（深衣宽袖、幞头、圆领袍、辫发等），避免时代错置。
- 女性、文臣、学者默认不持兵器、不披甲。

### 2.5 效果

- 命中、高潮：大块泼墨炸开，朱红血雾斜向喷溅，随后定格。每场最多一到两次。页面静帧可以有一处泼墨；视频高潮镜的规则不改。
- 火：平涂黑焰剪影，焰心一抹朱红；烟：淡灰横向飘散。
- 水：长横笔湿墨，浪头留白；雨雪：细斜线或留白点。
- 转场：墨点放大、浓墨泼满画面、沿画卷横移；不用光效、粒子光晕、镜头光斑。

### 2.6 宜 / 忌

| 宜 | 忌 |
|---|---|
| 黑白灰 + 一点红 | 全彩、粉彩、霓虹色、金色高光 |
| 大块平涂与剪影 | 精细繁复纹理、大量渐变的 CG 质感、写实照片、3D 渲染 |
| 粗笔棱角、飞白拖尾 | 匀细勾线、动漫赛璐璐描边 |
| 极简面部、靠姿态表演 | 精细五官、美颜脸、Q 版萌系大头 |
| 三四层灰的远山雾竹与建筑剪影 | 界画式密集线条、满屏装饰 |
| 少量、符合时代的道具；中国样式刀剑（环首刀、长剑） | 蒸汽朋克机械、现代器物、日本刀（武士刀） |
| 山石用块面 | 细密皴纹 |

### 2.7 不出现现代元素（2026-10-11 定）

画面里只能有本朝及以前的东西。**所有提示词的负面词都必须带这一句**（`art-style.mjs` 的 `NEG_MODERN_ZH` / `NEG_MODERN_EN`）：

- 中文：`不出现任何现代元素：现代建筑、电线、电线杆、公路、车辆、玻璃、塑料、现代服饰、眼镜、手表、枪械、电灯、招牌或文字标识`
- 英文：`no modern elements: no modern buildings, power lines, poles, roads, vehicles, glass, plastic, modern clothing, eyeglasses, watches, guns, electric lights, signs or lettering`

`build-video-prompts.mjs`（`videoPrompt.negative` zh/en）、`build-art-prompts.mjs`（`artPrompts[].negative`）、章节片头剧本（`video/data/chapter-videos/*.json` 的 `negative`、每镜 `imagePrompt` 的 Negative 段与 `motionPrompt`）和批量文件 `/workspace/chapter-video/batch.jsonl` 都带这一句，`validate.mjs` 逐条检查。审片时发现电线杆样的直杆、路面、车辆、玻璃反光、招牌文字等，按变形镜头处理（重生成）。

### 2.8 不出现时代错置之物（2026-10-11 定）

审片（`/workspace/review/anachronism/report.md`，112 段片段，22 段有问题）发现模型反复画出：君王戴**西式尖顶王冠**（夏、商、春秋、战国、秦、东汉共 8 处）、多层**佛塔**（商、西汉）、日本**鸟居**样宫门、欧式大帆船与**蒸汽船**、美式**篷车**与欧式玻璃马车、**台灯 / 灯罩**、线装书、旗上**徽记**、像三 K 党的**尖顶兜帽**、像徒步者的**登山杖与背包**、像**喷气机**的飞鸟、高速公路样的直路，以及藏青天空与橙黄灯火。因此每个提示词在现代元素禁令后再带一句时代错置禁令，由 `art-style.mjs` 的 `negAnachronism(order, 'zh' | 'en')` 生成：

- 通用（每章都带，`NEG_ANACHRONISM_ZH/EN`）：western crown, spiked crown, european crown, top hat, feather headdress, native american headdress, hooded robes, pointed hood, klan hood, torii, japanese architecture, katana, highway, asphalt road, lane markings, trekking poles, backpack, hikers, jet, aircraft, missile, table lamp, lampshade, light bulb, glass lamp chimney, glass windows, glazed carriage, stagecoach, conestoga covered wagon, signboard, plaque with characters, emblem on flag, circular emblem, logo, navy blue sky, blue tint, cyan, yellow, orange。
- 按朝代（`NEG_ERA`，只在该物件尚未出现的章里禁止）：佛塔 / stupa / 多层楼阁塔到东汉为止（南北朝起佛塔是真实的）；纸灯笼、红灯笼到东汉为止；线装书到五代为止；西洋大帆船、方帆船、蒸汽船、格子桅杆、烟囱、铁甲舰到明为止（清的甲午海战要画铁甲舰）。
- 正面写法比负面词更管用：君王写“简单高冠”“冕旒（mian crown with bead tassels）”或“束发”，灯写“青铜油灯、一点朱红小火”，船写“平底木船、篾席硬帆”或“楼船”，车写“两轮伞盖车”，书写“竹简捆扎成卷”，旗写“素面无纹”。
- 单镜另加的负面词写在 `/workspace/gen/chapter-videos/shots.txt` 该行第 7 列，`build_scripts.py --update-prompts` 把它追加到该镜 `imagePrompt` 的 Negative 段末尾和 `motionPrompt` 的 `also avoid:` 里，只刷新提示词，不动已出片章节的 `output`、`transitions`、`grade`。

`validate.mjs` 检查每个 `videoPrompt.negative`（zh/en）、每张素材提示词的 `negative`（zh）和每个章节片头剧本的 `negative`、`imagePrompt`、`motionPrompt` 都带本章的 `negAnachronism` 整句。

## 3. AI 视频生成（2026-10-10 实测）

- 流程：每镜先出一张本风格静帧作首帧，再图生视频。
- 平静氛围镜可用：李白月下举杯 7/10，画面稳定，墨感真实。激烈动作失败：荆轲刺秦 4/10，卷轴融化、血液倒流、人物变形而不是运动。
- 所以提示词只要克制的动势（衣袖轻摆、云雾缓移、镜头缓推），并写明“保持构图稳定，不变形，不新增物体”；打斗与刺杀用关键帧静帧加剪辑，或交给 InkGames 引擎渲染。
- 印章字和题字会出乱码：生成画面里不放文字，片名、印章、字幕后期叠加。运镜指令不一定被遵守。
- 生成器据此：高潮镜改为“缓推到近景后定格成关键帧静帧”，不做急推与震屏；朱红血雾只给刺杀、交战类高潮镜（约 26 场），其余高潮只泼墨定格；落款镜只留空纸，引文与朱印后期叠加。
- 现代元素禁令见 §2.7，与运动负面词一起写进每个提示词。
- 这些约束在 `art-style.mjs` 的 `MOTION_*`、`NEG_MOTION_*` 里，由 `build-video-prompts.mjs` 写进每个 `videoPrompt`，`validate.mjs` 逐场检查。

## 4. 在数据里的落点

- `videoPrompt.style`、`videoPrompt.negative`、人物描述末尾的剪影规则、高潮镜的墨效，全部来自 `art-style.mjs`。
- `artPrompts[].prompt` 的“画风”一行与负面词同源；素材仍是透明底，以便引擎分层合成。
- 开场分镜的“水墨效果”词表（火、营帐、军阵、殿柱等）已改为剪影说法。

## 5. 可直接复用的提示词模板（2026-10-12）

生成任何静帧，先写「共用正向」，再接本类的一句，最后接「共用负向」。不要改色板、留白比例和红色上限。不要写《影之刃》的角色名，不要把他们的图当参考图。

**共用正向（中文）**

高反差黑白红武侠水墨剪影，简化版，画在暖宣纸 `#eceae4` 上。复杂的城、山、天都改成墨晕，不画实景、不画照片。墨分五层：焦 `#141414`、浓 `#3a3a3a`、重 `#6e6e6c`、淡 `#a8a8a4`、清 `#d2d1cc`。人物是侧视大剪影，头身约 1:7，无五官。外轮廓粗笔侧锋、转折见棱角；飞白只沿动势。光是平的，没有体积光、没有光斑。地平线在下三分之一。

**共用负向（中文）**

不要文字、字母、印章里的字、水印。不要金色、蓝色、青色、绿色、黄色、橙色、紫色。不要写实照片、3D、动漫脸、五官、日本刀、现代建筑、电线、公路、车辆、玻璃、塑料、现代衣服、眼镜、手表、枪、电灯。不要蒸汽机械、界画密线、细密皴纹、霓虹刀光、粒子、镜头光斑。朱砂 `#b3241c` 不超过画面一成，一帧只用一处。

**Shared positive (English)**

High-contrast black-white-red wuxia ink silhouette, simplified, on warm xuan paper #eceae4. Replace any complex city, mountain or sky with ink wash; do not paint a real place or a photograph. Five ink weights only: scorched #141414, dense #3a3a3a, heavy #6e6e6c, pale #a8a8a4, clear #d2d1cc. Side-view silhouette, about seven heads tall, no facial features. Bold angular side-brush contour; dry-brush flying white only along motion. Flat light, no god rays, no lens flare. Horizon in the lower third.

**Shared negative (English)**

No text, letters, characters inside seals, or watermark. No gold, blue, cyan, green, yellow, orange, or purple. No photograph, 3D, anime face, facial features, katana, modern buildings, power lines, roads, vehicles, glass, plastic, modern clothing, eyeglasses, watches, guns, or electric lights. No steampunk machinery, dense ruled lines, dense texture strokes, neon blade light, particles, or lens flare. Vermilion #b3241c stays under 10% of the frame and in one place only.

### 5.1 人物

每类都是共用正向 + 下面这一句 + 共用负向。人物四周留白不少于画面三成。焦墨占人物约七成，浓墨分块不超过人物一成五。

| 类 | 正向要补的一句 | 红用在哪 | English clause |
|---|---|---|---|
| 武将 | 一名无五官的武将剪影，肩宽，简单盔或高冠，甲只留大块轮廓，长兵器竖持或斜持，不与任何人相接。侧视，人高占画面五成，脚下是重墨地面一笔。 | 旗或盔缨一小块，不超过 6% | One faceless general, broad shoulders, simple helmet or tall crown, armour as large plates only, a long weapon held clear of any other body. Side view, figure about half the frame height, one heavy-ink ground stroke. |
| 刺客 | 一名偏瘦的无五官剪影，斗笠或包头压住头部，窄袖，一把直剑收在身侧，姿态前倾。人高占画面四到五成，周围清墨雾。 | 不用红；若必须，只在刃口下一滴，不超过 3% | One lean faceless assassin, wide hat or wrapped head, narrow sleeves, a straight sword held at the side, weight forward. Figure 40–50% of frame height, clear-ink mist around. |
| 文士 | 一名瘦高的无五官文士，宽袖，双手藏在袖里，不持兵器，不披甲，布冠或方巾。人高占画面五成，左侧留出至少四成纸白。 | 不用红 | One tall lean faceless scholar, wide sleeves, hands hidden, no weapon, no armour, cloth cap. Figure about half the frame height, at least 40% empty paper on the left. |
| 女性 | 一名无五官的女性剪影，身形清瘦，长裙或深衣的外轮廓，发髻只是头上的一块形，不持兵器。姿态稳，不画腰肢细节。 | 裙裾或一枝小印，不超过 4%，印面无字 | One faceless woman, slim, the outer shape of a long robe, hair only as a knot mass, no weapon. Calm pose, no body detail. |
| 帝王 | 一名无五官的君王剪影，简单高冠或冕旒，宽袖端坐或侧立，不持兵器，不戴西式尖冠。身后是两根重墨柱的平涂块，不是宫殿照片。 | 冠前或座侧一块空白朱印，无字，不超过 6% | One faceless ruler, simple tall crown or a crown with bead tassels, wide sleeves, seated or standing, no weapon, no western spiked crown. Two flat heavy-ink columns behind, not a photographed palace. |

### 5.2 场景

没有特写人物。留白不少于四成。远、中、近三层必须都能分开。

| 类 | 正向要补的一句 | 红用在哪 | English clause |
|---|---|---|---|
| 山水 | 三四层平涂的山，最近重墨，最远清墨晕开，中间一条淡墨的水。不画树叶、不画皴纹。地平线在下三分之一，上半几乎是纸。 | 不用红，或地平线上一小点，不超过 2% | Three or four flat mountain layers, heavy ink near, clear ink far, one pale stroke of water. No leaves, no texture strokes. Horizon in the lower third, the upper half almost bare paper. |
| 城池 | 城是几块重墨的墙和一门洞，屋顶是一条斜线，不要砖缝和窗格。城前留纸。 | 一面素旗，不超过 5%，旗上无徽记无字 | A city as a few heavy-ink wall blocks and one gate opening, roofs as single slanted strokes, no bricks, no window lattice. Empty paper in front. |
| 宫殿 | 柱、阶、屋檐都是平涂的重墨块，地面一条纸白。不要藻井和金饰。 | 空白朱印或帘边一条，不超过 6%，无字 | Columns, steps and eaves as flat heavy-ink blocks, one paper-white floor stroke. No ceiling pattern, no gold ornament. |
| 战场 | 成排的无五官剪影由焦到淡退远，矛竖着，不相接。地面一条重墨。烟是横向的清墨。 | 一面朱旗或落日一小块，不超过 8% | Ranks of faceless silhouettes receding from scorched to pale ink, spears upright, not touching. One heavy ground stroke. Smoke as a horizontal clear-ink band. |
| 夜景 | 纸仍然是 `#eceae4`，夜不涂成蓝黑。月亮是纸白的圆，没有光晕。建筑只剩更黑的一块剪影。 | 一盏青铜灯的火，或月旁不用红；火不超过 3% | The paper stays #eceae4; night is not painted blue-black. The moon is a paper-white disc with no glow. Buildings are one darker silhouette. |

### 5.3 战斗

不画兵器相接的瞬间，只画之前或之后。人仍无五官。飞白方向必须和动作一致。

| 类 | 正向要补的一句 | 红用在哪 | English clause |
|---|---|---|---|
| 单挑 | 两人剪影拉开距离，一人前倾、一人稳立，刀或剑已离开对方身体。中间是纸，上面一条飞白。 | 地上数点朱砂，不超过 8%，不画血河 | Two silhouettes apart, one leaning in, one planted, blades clear of the other body. Paper between them and one flying-white stroke. |
| 军阵 | 只见阵，不见格斗。前排焦墨，后排淡成雾。旗在阵侧。 | 一阵旗，不超过 8% | The formation only, no melee. Front rank scorched ink, rear rank fading into mist. Banners at the side. |
| 攻城 | 城墙是重墨块，城下人很小，云梯是两条线。不画人翻过垛口。 | 城头一小块朱砂如火或旗，不超过 6% | The wall is a heavy-ink block, people small beneath it, a ladder as two lines. Nobody climbing over the parapet. |
| 刺杀 | 一人已倒或将倒的剪影，另一人站在三步之外，剑尖不接触身体。地上墨滩。 | 斜向的朱砂血雾，不超过 8%，然后像要定格 | One figure already falling, the other three steps away, the sword tip not touching the body. A pool of ink on the ground. |

### 5.4 页面图（主图、横幅、卡片）

站点图还要遵守留白，否则标题会压住主体。左侧纸上可以有极淡的清墨，不能有焦墨。横幅比例是 12:5（2400×1000）。手机用同一张宽图裁切，不再另出方图。关系图、地图、海报也只用这七色；地图和已合成的成片不因页面改版重出。

| 类 | 正向要补的一句 | 红用在哪 | English clause |
|---|---|---|---|
| 主图（宽 12:5） | 左侧至少一半几乎是空白宣纸。焦墨只在右侧四成：近景一名持矛的无五官武士，中景悬崖和烽火台，远景清墨山。矛不与人相接。三层分开。飞白只破开袖缘和烽烟。崖下一处泼墨，不铺满。四边约一成渐隐进 `#eceae4`，不要矩形纸边。 | 烽火一点，不超过 6% | At least the left half is nearly empty paper. Scorched ink stays inside the right 40%: a faceless spearman in front, a cliff and beacon in the middle, pale mountains far away. The spear touches no one. Three depths stay separate. Flying white only breaks the sleeve edge and the beacon smoke. One ink splash under the cliff. The outer tenth of each edge fades into #eceae4. |
| 横幅·战场（12:5） | 左侧至少一半空白。右侧只画残阵。近景一名无五官武士，矛竖着；中景成排剪影由焦到淡，矛不相接；远景是清墨烟和一块壁垒。飞白沿旗边。地上一处泼墨。四边约一成渐隐进 `#eceae4`。 | 一面朱旗，不超过 8% | At least the left half is empty. The right holds a formation after the clash. One faceless warrior in front, spear upright; ranks fading from scorched to pale, spears not touching; far away, clear-ink smoke and one wall block. Flying white only along the banner edge. One splash on the ground. |
| 横幅·治国（12:5） | 左侧至少一半空白。右侧只画一局围棋。矮几上的棋盘只用几笔粗墨，不要十九路密线。数枚平涂黑子。几旁可以露出一只宽袖，袖中无兵器，人无五官。近景是几和子，中景是袖，远景是两根平涂柱的墨晕。四边约一成渐隐进 `#eceae4`。 | 一枚朱砂子，不超过 6% | At least the left half is empty. The right holds one weiqi game. The board is a few thick ink strokes, not a dense nineteen-line grid. Several flat black stones. A wide sleeve may show beside the desk, no weapon, no face. Desk and stones in front, the sleeve in the middle, two flat columns far away. |
| 横幅·人物（12:5） | 左侧至少一半空白。右侧只画一座空的龙座，侧视。龙是靠背上三四块大剪影，不画鳞，不描金。座面是纸白。座上没有人。近景是座，中景是龙形靠背，远景是两根平涂柱。四边约一成渐隐进 `#eceae4`。 | 座侧一块无字朱印，不超过 6% | At least the left half is empty. The right holds one empty dragon throne, side view. The dragon is three or four large silhouette masses on the backrest, no scales, no gold. The seat is paper white. Nobody sits there. Two flat columns far away. |
| 横幅·地理（12:5） | 左侧至少一半空白。右侧只画关河。近景一条淡墨河，中景一座关门嵌在重墨山里，一条路穿过门洞，远景再两层清墨山。不画皴，不画车马细部。四边约一成渐隐进 `#eceae4`。 | 地平线上一小点朱砂，不超过 3% | At least the left half is empty. The right holds one pass and one river. A pale river in front, a gate set into a heavy-ink mountain, one road through the gate, two more clear-ink ranges far away. No texture strokes, no carriage detail. |
| 卡片·战场（4:5） | 竖幅。残阵完整，头顶和脚下都留纸。近景一名无五官武士，矛竖着；中景成排剪影由焦到淡，矛不相接；远景清墨烟和一块壁垒。飞白沿旗边。地上一处泼墨。四边约一成渐隐进 `#eceae4`。 | 一面朱旗，不超过 8% | Vertical. The formation is complete, with paper above and below. One faceless warrior in front, spear upright; ranks fading from scorched to pale; clear-ink smoke and one wall block far away. |
| 卡片·治国（4:5） | 竖幅。棋局完整，头顶和脚下都留纸。矮几上的棋盘只用几笔粗墨，不要十九路密线。数枚平涂黑子。一只宽袖在中景，袖中无兵器，人无五官。远景两根平涂柱的墨晕。四边约一成渐隐进 `#eceae4`。 | 一枚朱砂子，不超过 6% | Vertical. The game is complete, with paper above and below. The board is a few thick ink strokes, not a dense nineteen-line grid. One wide sleeve in the middle ground, no weapon, no face. Two flat columns far away. |
| 卡片·人物（4:5） | 竖幅。龙座完整，头顶和脚下都留纸。侧视空座，龙是靠背上三四块大剪影，不画鳞，不描金，座面是纸白，座上没有人。远景两根平涂柱。四边约一成渐隐进 `#eceae4`。 | 座侧一块无字朱印，不超过 6% | Vertical. The throne is complete, with paper above and below. Empty seat in side view. The dragon is three or four large masses, no scales, no gold, nobody sitting. Two flat columns far away. |
| 卡片·地理（4:5） | 竖幅。关河完整，头顶和脚下都留纸。近景一条淡墨河，中景关门嵌在重墨山里，路穿过门洞，远景两层清墨山。不画皴。四边约一成渐隐进 `#eceae4`。 | 地平线上一小点朱砂，不超过 3% | Vertical. The pass and river are complete, with paper above and below. A pale river in front, a gate in a heavy-ink mountain, a road through the opening, two clear-ink ranges far away. |

---

## English summary

**Reference.** S-Game's *Shadow Blade* series is used only as a mood reference — no assets or images are copied and its characters are never named. Prompts call the look "high-contrast black-white-red wuxia ink silhouette art (Shadow-Blade-like, simplified)". Public interviews and press describe the series as dark, gritty wuxia ("kungfupunk") with low-saturation cool backgrounds against red and gold highlights, bold black-and-white character silhouettes, and finely ruled-line environments; we keep only the black-white-red contrast, silhouettes, splash/blood-spray hits and side-view drama, and drop gold highlights, steampunk machinery, ruled-line detail and rich materials.

**Simplified rules.** Palette: ink black #141414, charcoal #3a3a3a, mid grey #6e6e6c, pale grey #a8a8a4, fog grey #d2d1cc, paper white #eceae4, and vermilion #b3241c as the only accent (blood, sun, banners, seals; under 10% of a frame, one red area per frame). Lines: bold angular side-brush contours, dry-brush trails only along motion, no ruled lines or texture strokes. Composition: side view, horizon in the lower third, three or four flat grey depth layers, subject 30–50% of frame height with plenty of empty paper. Characters: ~7 heads tall, silhouette-first (headgear, sleeves, weapon, armour plates), almost no facial features, period costume reduced to outline. Effects: big ink splash plus diagonal vermilion blood-spray freeze on hits or the climax only; flat black flames with a red core; no glows or particles. No modern elements: every prompt's negative carries "no modern elements: no modern buildings, power lines, poles, roads, vehicles, glass, plastic, modern clothing, eyeglasses, watches, guns, electric lights, signs or lettering" (`NEG_MODERN_EN` / `NEG_MODERN_ZH`), checked by `validate.mjs`. Generators read these constants from `video/tools/art-style.mjs`.
