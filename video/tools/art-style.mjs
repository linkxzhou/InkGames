// 统一美术风格（见 docs/art-style.md）：黑白红高反差武侠水墨剪影，参照《影之刃》系列气质并做简化。
// 视频提示词（build-video-prompts.mjs）与素材提示词（build-art-prompts.mjs）都从这里取风格、色板与负面词，
// 改风格只改这一个文件，再重跑两个生成器。

/** 色板：墨黑 + 四级灰 + 纸色 + 唯一的强调色朱砂红。与 docs/art-style.md 保持一致。 */
export const PALETTE = [
  { id: 'ink', zh: '墨黑', en: 'ink black', hex: '#141414' },
  { id: 'char', zh: '焦灰', en: 'charcoal grey', hex: '#3a3a3a' },
  { id: 'mid', zh: '中灰', en: 'mid grey', hex: '#6e6e6c' },
  { id: 'mist', zh: '淡灰', en: 'pale grey', hex: '#a8a8a4' },
  { id: 'fog', zh: '雾灰', en: 'fog grey', hex: '#d2d1cc' },
  { id: 'paper', zh: '纸白', en: 'paper white', hex: '#eceae4' },
  { id: 'red', zh: '朱砂红', en: 'vermilion red', hex: '#b3241c' },
];
const pal = (k) => PALETTE.map(p => `${p[k]} ${p.hex}`).join('、');
export const PALETTE_ZH = '色板只用黑白红：' + pal('zh') + '；朱砂红是唯一的强调色，只用于血、落日、旗帜与印章，单帧面积不超过一成';
export const PALETTE_EN = 'strict black-white-red palette: ' + PALETTE.map(p => `${p.en} ${p.hex}`).join(', ') + '; vermilion is the only strong accent, used only for blood, sun, banners and seals, under 10% of any frame';

export const STYLE_REF_ZH = '高反差黑白红武侠水墨剪影风（类《影之刃》，简化版）';
export const STYLE_REF_EN = 'in the style of high-contrast black-white-red wuxia ink silhouette art (Shadow-Blade-like, simplified)';

export const STYLE_ZH = `${STYLE_REF_ZH}：纸白或浅灰宣纸底，大块平涂、少纹理；人物为高反差黑色剪影，粗笔棱角边缘，枯笔飞白拖尾，面部几乎不画五官；背景只用三到四层灰阶平涂的远山、雾气、竹林与建筑剪影，大面积留白；横向侧视构图，武侠电影式的冷峻、肃杀与戏剧张力；动作以剪影姿态和运动拖影表达，命中或高潮时大块泼墨与朱红血雾喷溅；${PALETTE_ZH}。`;
export const STYLE_EN = `${STYLE_REF_EN}: paper-white or pale grey xuan ground, big flat shapes with minimal texture; characters as high-contrast black silhouettes with bold angular brush edges and dry-brush flying-white trails, almost no facial features; backgrounds limited to three or four flat grey layers of mountains, mist, bamboo and architecture in silhouette, with generous empty space; side-view wuxia staging, dark, cold and dramatic; action told through silhouette poses and motion trails, with big splash-ink and vermilion blood-spray accents only on hits or the climax; ${PALETTE_EN}.`;

/** 人物渲染规则（附加在每个人物描述后）。 */
export const FIGURE_ZH = '黑色剪影造型，只保留冠帽、袖摆、兵器与甲片的大轮廓，头身比约 1:7，姿态一眼可读';
export const FIGURE_EN = 'rendered as a black silhouette keeping only the big shapes of headgear, sleeves, weapon and armour plates, about 7 heads tall, pose readable at a glance';

/** 负面词：在原有基础上追加的风格禁忌。 */
export const NEG_STYLE_ZH = '全彩，多色，粉彩，马卡龙色，Q 版，萌系，大头娃娃，精细繁复纹理，大量渐变的 CG 质感，金色高光，蒸汽朋克机械，细密界画线条，细密皴纹，复杂五官，日本刀（武士刀）';
export const NEG_STYLE_EN = 'full colour, multicolour, pastel, candy colours, cute, chibi, big-head proportions, busy detailed textures, gradient-heavy CG, gold highlights, steampunk machinery, dense ruled-line detail, dense cun texture strokes, detailed faces, Japanese katana';

/** 高潮/命中时的墨效。 */
export const HIT_FX_ZH = '大块泼墨炸开，朱红血雾斜向喷溅后定格';
export const HIT_FX_EN = 'a big splash of ink bursts and a diagonal vermilion blood-spray hangs in a freeze-frame';

/** 素材图（透明底）的画风行。 */
export const ASSET_STYLE_ZH = `画风：${STYLE_REF_ZH}——大块黑色剪影与平涂灰阶，粗笔棱角边缘，枯笔飞白；少纹理、少装饰；${PALETTE_ZH}。`;

/**
 * AI 视频的生成方式与动势约束（2026-10-10 实测，见 docs/art-style.md §3 与根目录 AGENTS.md）：
 * 每镜先出一张风格静帧作首帧，再图生视频；平静氛围镜稳定，激烈动作会融化、倒流、变形。
 */
export const MOTION_ZH = '生成方式：每个镜头先按本风格出一张静帧作首帧，再图生视频；动势克制，只做衣袖与旗角轻摆、云雾缓移、镜头缓推，保持构图稳定，不变形，不新增物体；打斗、刺杀等激烈动作用关键帧静帧加剪辑表现，不让模型生成连续搏斗；运镜指令仅作参考';
export const MOTION_EN = 'Workflow: for each shot first render a still in this style as the first frame, then run image-to-video; keep motion restrained — sleeves and banner tips fluttering, cloud and mist drifting, a slow camera push; keep the composition stable, no morphing, no new objects; show fights and assassinations as keyframe stills plus editing rather than generated continuous combat; camera directions are a guide only';
/** 运动类负面词：实测失败模式。 */
export const NEG_MOTION_ZH = '人物融化变形，墨迹倒流，血液倒流，卷轴融化，画面中途新增物体，构图漂移，画面内文字与印章字';
export const NEG_MOTION_EN = 'melting or morphing figures, ink or blood flowing backwards, melting scrolls, objects appearing mid-shot, drifting composition, any text or seal characters inside the frame';

/** 现代元素禁令（2026-10-11 定）：所有提示词的负面词都必须带这一句，validate.mjs 逐条检查。 */
export const NEG_MODERN_ZH = '不出现任何现代元素：现代建筑、电线、电线杆、公路、车辆、玻璃、塑料、现代服饰、眼镜、手表、枪械、电灯、招牌或文字标识';
export const NEG_MODERN_EN = 'no modern elements: no modern buildings, power lines, poles, roads, vehicles, glass, plastic, modern clothing, eyeglasses, watches, guns, electric lights, signs or lettering';
