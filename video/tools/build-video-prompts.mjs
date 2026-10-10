#!/usr/bin/env node
// 为每个场景生成 videoPrompt（水墨视频生成提示词，中文 + 英文），写回 chapters/*.json。
//
// 提示词完全由场景自己的数据推出，保证与场景一致：
// - 分镜：opening.shots（开场 5 镜）+ 正史结局一镜 + 落款一镜；
// - 镜头运动：opening.tracks.camera 的 label；水墨效果：opening.tracks.effects；
// - 构图：opening.tracks.strokes 的图层（far 远景 / sheet 中景 / actors 主体 / overlay 题字）与 label；
// - 人物：cast（时代服饰按章、阵营、身份推定）；声音：opening.tracks.audio；旁白与字幕：opening.tracks.text + strings；
// - 结局与引文：scene.endings 的 canon 结局、scene.<id>.quote 与 caption.source。
// 字段说明见 video/docs/content-schema.md §2.11。
//
// 用法：在仓库根目录运行 `node video/tools/build-video-prompts.mjs`
// 幂等：重复运行整体替换 videoPrompt，不影响其它字段。无第三方依赖。
import { STYLE_ZH, STYLE_EN, FIGURE_ZH, FIGURE_EN, NEG_STYLE_ZH, NEG_STYLE_EN, HIT_FX_ZH, HIT_FX_EN } from './art-style.mjs';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PINYIN = existsSync(join(root, 'tools', 'name-pinyin.json'))
  ? JSON.parse(readFileSync(join(root, 'tools', 'name-pinyin.json'), 'utf8')) : {};
const EN = existsSync(join(root, 'tools', 'video-prompt-en.json'))
  ? JSON.parse(readFileSync(join(root, 'tools', 'video-prompt-en.json'), 'utf8')) : {};
const missingEn = [];
const FPS_OUT = 24;
// 旁白语速：普通话纪录片约每秒 4.5 字；镜头时长 = 旁白时长 + 2 秒呼吸，至少 6 秒
const voSec = s => Math.max(6, Math.ceil(s.replace(/[，。、；：！？「」“”—…\s]/g, '').length / 4.5) + 2);
const SEAL_SEC = 6;

/* ---------- 章：时代、服饰、场景细节 ---------- */
// [英文朝代名, 服饰(zh), 服饰(en), 场景细节(zh), 场景细节(en)]
const ERA = [
  ['Legendary antiquity (before c. 2070 BCE)', '兽皮与麻葛短衣，披发或束发，骨玉饰物，赤足或草履', 'animal hides and coarse hemp tunics, loose or simply tied hair, bone and jade ornaments, bare feet or straw sandals', '原始聚落、茅草屋、篝火、石器与陶器、莽莽山川与洪水', 'primitive settlements, thatched huts, bonfires, stone tools and pottery, vast wild mountains and rivers'],
  ['Xia dynasty (c. 2070–1600 BCE)', '麻布交领短衣，玉璋玉钺，初现的青铜饰物', 'hemp cross-collar tunics, jade blades and axes, early bronze ornaments', '夯土台基与宫室、陶器、绿松石器、黄河与伊洛平原', 'rammed-earth platforms and palaces, pottery, turquoise inlay, Yellow River plains'],
  ['Shang dynasty (c. 1600–1046 BCE)', '交领右衽窄袖衣，玄赭二色，青铜钺与戈，贵族高冠', 'narrow-sleeved cross-collar robes in black and ochre, bronze axes and dagger-axes, tall noble caps', '夯土宫殿、青铜礼器、甲骨占卜、战车', 'rammed-earth palaces, bronze ritual vessels, oracle-bone divination, chariots'],
  ['Western Zhou (1046–771 BCE)', '宽袖深衣，冕服，组玉佩，皮甲与青铜戈', 'wide-sleeved shenyi robes, ceremonial mian crowns, jade pendant sets, leather armour and bronze ge', '宗庙与明堂、礼乐编钟、车马、分封城邑', 'ancestral temples, ritual bells, chariots and horses, feudal walled towns'],
  ['Spring and Autumn period (770–476 BCE)', '深衣、皮弁，犀皮甲，青铜剑，乘战车', 'shenyi robes and leather caps, rhinoceros-hide armour, bronze swords, war chariots', '诸侯宫室、会盟高台、战车阵、城郭', 'feudal palaces, covenant platforms, chariot formations, walled cities'],
  ['Warring States period (475–221 BCE)', '深衣，胡服短衣，漆皮甲，青铜长剑与弩', 'shenyi robes, short "barbarian" riding tunics, lacquered leather armour, long bronze swords and crossbows', '列国都城、长城雏形、步骑大军、竹简', 'capital cities of rival states, early walls, massed infantry and cavalry, bamboo slips'],
  ['Qin dynasty (221–207 BCE)', '尚黑，长襦与袍，兵马俑式札甲，右偏发髻', 'black as the imperial colour, long robes, terracotta-army style lamellar armour, topknots worn to the right', '咸阳宫阙、驰道、长城、刻石、竹简与小篆', 'Xianyang palaces, imperial roads, the Great Wall, stone inscriptions, bamboo slips in small-seal script'],
  ['Chu-Han contention and Western Han (206 BCE–8 CE)', '曲裾深衣，进贤冠，汉式札甲，环首刀', 'curved-hem shenyi robes, jinxian scholar caps, Han lamellar armour, ring-pommel swords', '未央宫、长安城、军营帐幕、丝路驼队', 'Weiyang Palace, Chang\'an, army tents, Silk Road camel caravans'],
  ['Xin and Eastern Han (9–220)', '直裾袍，进贤冠或武弁，札甲，环首刀', 'straight-hem robes, scholar caps or military caps, lamellar armour, ring-pommel swords', '洛阳宫殿、太学、坞堡、西域城郭', 'Luoyang palaces, the Imperial Academy, fortified manors, Western Regions oasis towns'],
  ['Three Kingdoms (220–280)', '袍服，幅巾或纶巾，筒袖铠，环首刀与长戟', 'long robes, cloth headscarves, tube-sleeved armour, ring-pommel swords and long halberds', '城池、水寨与楼船、军帐、江河', 'walled cities, river fortresses and tower ships, army tents, great rivers'],
  ['Western and Eastern Jin (266–420)', '褒衣博带，宽衫，小冠，手执麈尾', 'loose wide-sleeved robes with broad sashes, small caps, flywhisk in hand', '江南园林、曲水、竹林、建康城', 'Jiangnan gardens, winding streams, bamboo groves, Jiankang city'],
  ['Northern and Southern dynasties (420–589)', '南朝褒衣博带；北朝裤褶、鲜卑帽，两裆铠', 'Southern court: loose robes with broad sashes; Northern: kuzhe trousers-and-jacket, Xianbei hoods, liangdang armour', '佛寺石窟、建康与洛阳、草原与城塞', 'Buddhist temples and grottoes, Jiankang and Luoyang, steppe and frontier forts'],
  ['Sui dynasty (581–618)', '幞头，圆领窄袖袍，明光铠初兴|女子高腰长裙、披帛', 'futou headscarves, round-collar narrow-sleeved robes, early mingguang plate armour|high-waisted long skirts with silk shawls', '大兴城、运河龙舟、宫殿斗拱', 'Daxing city, the Grand Canal and dragon boats, bracketed palace halls'],
  ['Tang dynasty (618–907)', '幞头，圆领袍，明光铠|女子高腰襦裙与披帛，高髻', 'futou headscarves, round-collar robes, mingguang plate armour|high-waisted ruqun with silk shawls, high chignon', '长安坊市、大明宫、驼队、边塞烽燧', 'Chang\'an wards and markets, Daming Palace, camel caravans, frontier beacon towers'],
  ['Five Dynasties and Ten Kingdoms (907–979)', '硬脚幞头，圆领袍，晚唐式铠甲', 'stiff-winged futou caps, round-collar robes, late-Tang style armour', '汴梁与金陵、江南园林、军镇', 'Bianliang and Jinling, Jiangnan gardens, military garrisons'],
  ['Northern Song (960–1127)', '展脚幞头，圆领大袖公服，褙子|女子褙子与抹胸，花冠或高髻', 'long-winged futou caps, wide-sleeved round-collar official robes, beizi jackets|women in beizi over a breast-wrap, floral crown or high chignon', '汴京街市、虹桥、书院、宫殿', 'Bianjing streets, arched bridges, academies, palace halls'],
  ['Liao, Western Xia and Jin (907–1234)', '契丹髡发、左衽窄袖袍与皮靴；党项秃发；女真辫发', 'Khitan shaved-crown hairstyles, left-lapel narrow-sleeved robes and leather boots; Tangut shaved heads; Jurchen braids', '草原毡帐、捺钵营地、城塞、雪原', 'steppe felt tents, seasonal royal camps, frontier forts, snowfields'],
  ['Southern Song (1127–1279)', '展脚幞头，公服，褙子，宋式铠甲', 'long-winged futou caps, official robes, beizi jackets, Song-style armour', '临安西湖、江上水军、山城、书斋', 'Lin\'an and West Lake, river navies, mountain citadels, scholar studios'],
  ['Yuan dynasty (1271–1368)', '蒙古质孙服、钹笠帽、辫发；汉人士人仍着宋式衣冠', 'Mongol jisun robes, bowl-shaped hats, braids; Han literati still in Song-style dress', '大都宫阙、草原毡帐、驿站、海船', 'Dadu palaces, steppe gers, relay stations, ocean junks'],
  ['Ming dynasty (1368–1644)', '乌纱帽，圆领袍与补服，飞鱼服|女子袄裙，鬏髻', 'black gauze caps, round-collar robes with rank badges, flying-fish robes|women in ao jackets and pleated skirts', '紫禁城、长城敌楼、宝船、江南城镇', 'the Forbidden City, Great Wall watchtowers, treasure ships, Jiangnan towns'],
  ['Qing dynasty (1636–1912)', '剃发留辫，长袍马褂，顶戴花翎，旗装', 'shaved forehead and queue, long gowns with magua jackets, official hats with peacock feathers, Manchu banner dress', '紫禁城、园林、炮台、海港', 'the Forbidden City, imperial gardens, coastal forts, harbours'],
];
// 阵营覆盖服饰
const CAMP_LOOK = [
  [/匈奴|月氏|突厥|东突厥|回纥|北匈奴/, '草原游牧装束：皮袍、毡帽、皮靴，佩弓刀', 'steppe nomad dress: fur-lined robes, felt hats, leather boots, bow and sabre'],
  [/契丹|辽|西辽/, '契丹装束：髡发、左衽窄袖袍、皮靴', 'Khitan dress: shaved crown, left-lapel narrow-sleeved robe, leather boots'],
  [/金|后金|女真/, '女真装束：辫发、左衽窄袖袍、貂帽', 'Jurchen dress: braids, left-lapel narrow-sleeved robe, sable hat'],
  [/西夏|党项/, '党项装束：秃发、圆领窄袖袍、毡冠', 'Tangut dress: shaved head, round-collar narrow-sleeved robe, felt crown'],
  [/蒙古|札答兰|克烈|伊利汗国|瓦剌/, '蒙古装束：辫发、质孙袍、钹笠帽、皮靴', 'Mongol dress: braids, jisun robe, bowl-shaped hat, leather boots'],
  [/吐蕃/, '吐蕃装束：赭面、长袍、高帽', 'Tibetan (Tubo) dress: ochre-painted face, long robe, tall hat'],
  [/鲜卑|北魏|北齐|北周|东魏|西魏|北朝|氐|前秦|前燕|后秦|汉赵|后赵/, '北朝胡汉混融装束：裤褶、鲜卑帽或小冠', 'Northern-dynasty mixed dress: kuzhe trousers-and-jacket, Xianbei hood or small cap'],
  [/高句丽/, '高句丽装束：折风帽、窄袖长袍', 'Goguryeo dress: feather-topped cap, narrow-sleeved long robe'],
  [/天竺/, '天竺僧侣或王族装束：袒右肩袈裟或缠头', 'Indian dress: monk\'s robe baring the right shoulder or turban'],
  [/花剌子模|塞尔柱/, '中亚伊斯兰装束：缠头巾、长袍、弯刀', 'Central Asian Islamic dress: turban, long robe, scimitar'],
  [/威尼斯|英国|荷兰/, '同时代欧洲人装束（依身份）', 'period European dress appropriate to rank'],
  [/日本|倭寇/, '同时代日本装束（依身份）', 'period Japanese dress appropriate to rank'],
  [/神话|传说/, '神话传说人物，造型取汉画像石与古籍描写，可略带超现实的墨韵', 'mythic figure based on Han stone reliefs and classical descriptions, slightly surreal ink treatment'],
];
const TYPE_LOOK = {
  ruler: ['君主装束，冠冕或礼服，神情威严', 'sovereign\'s regalia, crown or ceremonial robe, commanding presence'],
  minister: ['文臣朝服与官帽，持笏或文书', 'civil official\'s court robe and cap, holding a tablet or documents'],
  general: ['武将甲胄披挂，佩剑或执兵器', 'general in full armour, sword or weapon in hand'],
  scholar: ['文士衣冠，素色长衫，书卷气', 'scholar\'s plain long robe, bookish bearing'],
  royal: ['宫廷华服，发髻首饰精致', 'rich court dress, elaborate hair ornaments'],
  other: ['依身份的平民、工匠、侍从或兵卒衣着', 'commoner, artisan, attendant or soldier clothing as appropriate'],
};
const TYPE_EN = { ruler: 'ruler', minister: 'minister', general: 'general', scholar: 'scholar', royal: 'royal / consort', other: 'commoner' };

/* ---------- 镜头、效果、声音词表 ---------- */
const CAMERA = {
  still: ['固定机位远景长镜，画面静止，墨色缓缓显现', 'locked-off wide shot, stillness as the ink slowly appears'],
  pan: ['缓慢横移（摇镜），沿画卷方向展开', 'slow lateral pan, unrolling like a handscroll'],
  push: ['缓慢推近，景深变浅，主体渐清', 'slow push-in, shallow depth of field, subject sharpening'],
  shake: ['手持式轻微震动，节奏急促', 'subtle handheld shake, urgent rhythm'],
  climax: ['急推特写后定格，轻微震屏', 'fast push to close-up, slight shake, then freeze-frame'],
};
const EFFECT = {
  fade: ['宣纸留白淡入', 'fade in from blank xuan paper'],
  flow: ['水墨流动晕染', 'flowing ink wash bleeding across the paper'],
  distort: ['热浪与烟气扭曲', 'heat-haze and smoke distortion'],
  mask: ['四角暗角收拢', 'vignette closing in from the corners'],
  freeze: ['画面定格成一幅水墨画', 'freeze into a still ink painting'],
  inkDisperse: ['墨点四散（如马蹄踏墨）', 'ink dispersing outward like hoofprints in wet ink'],
  metallic: ['兵刃金属寒光一闪', 'a cold metallic glint on the blade'],
  bambooBreak: ['竹简断裂、墨迹飞溅', 'bamboo slips snapping with ink spatter'],
};
const ELEM_INK = {
  火: ['平涂黑焰剪影，焰心一抹朱红', 'flat black flame silhouettes with a single vermilion core'], 烟: ['淡墨烟气横向飘散', 'pale ink smoke drifting sideways'],
  河水: ['湿笔横扫成水纹，墨在水中化开', 'wet horizontal strokes forming ripples, ink dissolving in water'], 江海: ['大笔湿墨铺出海面，浪头留白', 'broad wet-ink sea with white-paper wave crests'],
  洪水: ['浓淡墨层层涌动成洪流', 'layered dark and pale ink surging as a flood'], 雨: ['细密斜线笔触成雨', 'fine slanted strokes for rain'], 雪: ['留白为雪，枯笔点出雪片', 'blank paper as snow, dry-brush flakes'],
  骑兵: ['马蹄踏处墨点四溅', 'ink spatters where hooves strike'], 军阵: ['成排剪影由黑到灰逐层退远', 'rows of silhouettes stepping back from black to grey'], 长兵如林: ['枯笔竖线密如森林', 'dense dry-brush verticals like a forest of spears'],
  城墙雉堞: ['焦墨勾出城垛轮廓', 'scorched-ink outline of battlements'], 殿柱: ['黑色立柱剪影切分画面，纵深三层灰', 'black pillar silhouettes slicing the frame, three grey layers of depth'], 舟: ['舟影一笔带过，水痕拖尾', 'a boat in one stroke with a trailing wake'],
  月: ['月轮留白，四周淡墨烘染', 'moon left blank with pale wash around it'], 云: ['云气以淡墨晕染流动', 'clouds as moving pale wash'], 营帐: ['营帐三角黑块剪影，灯火留白', 'triangular black tent silhouettes with lamps left as paper white'],
  竹: ['竹叶撇笔，风中摇动', 'flicked bamboo leaves swaying'], 沙: ['干笔擦出沙地', 'dry-brush scumbled sand'], 潮: ['长线湿笔成潮水推进', 'long wet strokes advancing as tide'], 星: ['墨夜中留白点星', 'stars as untouched dots in an ink night'],
};
const TRANS = {
  still: ['宣纸留白淡入', 'fade in from blank xuan paper'], pan: ['沿画卷横向延展接入', 'continues sideways like an unrolling scroll'],
  push: ['墨点放大化入本镜', 'an ink dot expands into the shot'], shake: ['墨迹溅开切入', 'cut in on an ink splatter'],
  climax: ['浓墨泼满画面后切入', 'ink floods the frame, then cut'], pull: ['墨色收拢后拉开', 'ink contracts, then opens out'],
};
const LAYER = { far: ['远景', 'background'], terrain: ['中景', 'midground'], sheet: ['中景', 'midground'], actors: ['主体', 'foreground subject'], overlay: ['题字', 'calligraphy overlay'] };
const ELEM_EN = {
  远山: 'distant mountains', 云: 'clouds', 烟: 'smoke', 近山与地面: 'near hills and ground', 河水: 'river', 洪水: 'flood waters', 火: 'fire (splashed ink)',
  草: 'grass', 树: 'trees', 树冠: 'tree canopy', 众人: 'crowd', 沙: 'sand', 骑兵: 'cavalry', 军阵: 'army ranks', 长兵如林: 'forest of spears', 雨: 'rain',
  殿柱: 'palace pillars', 屋檐: 'palace eaves', 江海: 'sea', 浪头: 'breaking waves', 盾墙: 'shield wall', 地图卷: 'map scroll', 竹: 'bamboo', 营帐: 'army tents',
  月: 'moon', 关门: 'gate', 舟: 'boat', 城墙雉堞: 'crenellated city wall', 星: 'stars', 雪: 'snow', 卷轴: 'scroll', 潮: 'tide', 马: 'horse',
  banner: 'banners', spear: 'spear', bow: 'bow', sword: 'sword', blade: 'broadsword', shield: 'shield', 'war-horse': 'war horse', water: 'water',
  landscape: 'landscape', 'ink-bomb': 'ink burst', 'water-brush': 'brush', 'shield': 'shield', 皴法山石: 'textured rocks', 铜柱: 'bronze pillar', 匣: 'wooden box',
};
const BGM = {
  'xun-ancient': ['陶埙，古朴苍凉', 'xun clay ocarina, ancient and desolate'], xun: ['陶埙，低回苍凉', 'xun clay ocarina, low and mournful'],
  guqin: ['古琴，清远沉静', 'guqin zither, serene and distant'], 'bronze-drum': ['铜鼓，庄重原始', 'bronze drums, solemn and primal'],
  bianzhong: ['编钟，庄严典雅', 'bianzhong bronze bells, stately and ceremonial'], 'xiao-flute': ['洞箫，幽咽悠长', 'xiao flute, plaintive and long'],
  'hu-flute': ['胡笳，边塞悲凉', 'hujia reed pipe, bleak frontier mood'], 'zhu-theme': ['筑，激越悲壮', 'zhu struck zither, stirring and tragic'],
  'qin-zheng': ['秦筝，铿锵肃杀', 'Qin zheng zither, sharp and martial'], 'chu-drum': ['楚鼓，雄浑激昂', 'Chu drums, powerful and rousing'],
  pipa: ['琵琶，铿锵急切或婉转低回', 'pipa lute, tense tremolo or wistful phrases'], 'sanguo-drum': ['战鼓与号角，雄壮', 'war drums and horns, heroic'],
  'song-flute': ['笛子，清丽', 'dizi flute, clear and lyrical'], 'morin-khuur': ['马头琴，辽阔苍茫', 'morin khuur horse-head fiddle, vast steppe mood'],
  'ming-suona': ['唢呐与鼓，高亢', 'suona and drums, piercing and bold'], 'qing-horn': ['号角与弦乐，沉郁', 'horns and strings, sombre'],
};
const SND = { // amb / sfx
  'silence-room': ['寂静室内', 'quiet room tone'], 'wind-low': ['低风', 'low wind'], 'ink-drop': ['墨滴落纸', 'ink drop on paper'], 'wind-plain': ['旷野风声', 'wind over open plains'],
  'thunder-far': ['远雷', 'distant thunder'], 'flood-roar': ['洪水咆哮', 'roaring flood'], 'stone-crack': ['石裂', 'cracking stone'], 'wind-after': ['战后余风', 'lingering wind after battle'],
  'ink-hit': ['墨击重音', 'heavy ink-hit accent'], 'night-wind': ['夜风', 'night wind'], 'wind-chime': ['风铃', 'wind chimes'], birdsong: ['鸟鸣', 'birdsong'], footsteps: ['脚步声', 'footsteps'],
  'river-calm': ['平缓河水', 'calm river'], 'water-splash': ['水花', 'water splash'], 'wood-chop': ['伐木', 'wood chopping'], 'leaf-rustle': ['树叶沙沙', 'rustling leaves'],
  'crowd-murmur': ['人群低语', 'crowd murmur'], 'bronze-bell': ['青铜钟声', 'bronze bell'], 'camp-drums': ['军营鼓声', 'camp drums'], 'drum-far': ['远处鼓声', 'distant drums'],
  'battle-far': ['远处厮杀声', 'distant battle'], horn: ['号角', 'horn'], clash: ['兵刃相击', 'clashing weapons'], storm: ['暴风雨', 'storm'], thunder: ['雷声', 'thunder'],
  'thunder-roll': ['滚雷', 'rolling thunder'], 'banner-fall': ['旗倒', 'falling banner'], 'silk-rustle': ['衣袂摩挲', 'rustling silk'], hoofbeats: ['马蹄声', 'hoofbeats'], drum: ['鼓声', 'drum'],
  'palace-hall': ['宫殿回响', 'palace hall reverb'], 'wave-sea': ['海浪', 'sea waves'], 'bamboo-slip': ['竹简翻动', 'bamboo slips rustling'], plough: ['犁地', 'ploughing'],
  'earth-thud': ['夯土闷响', 'thud of earth'], step: ['脚步', 'step'], 'water-drip': ['滴水', 'dripping water'], 'rain-light': ['细雨', 'light rain'], 'door-creak': ['门轴吱呀', 'creaking door'],
  'river-release': ['河水决泄', 'river bursting free'], 'cart-wheel': ['车轮', 'cart wheels'], 'forest-birds': ['林中鸟鸣', 'forest birds'], 'guqin-pluck': ['琴弦一拨', 'single guqin pluck'],
  'drum-burst': ['急鼓', 'drum burst'], bowstring: ['弓弦', 'bowstring'], village: ['村落人声', 'village ambience'], 'fire-crackle': ['火焰噼啪', 'crackling fire'],
  'arrow-release': ['放箭', 'arrow release'], 'fire-roar': ['烈火', 'roaring fire'], 'bronze-pour': ['铜汁浇铸', 'pouring molten bronze'], 'war-drum': ['战鼓', 'war drums'],
  'water-surge': ['水势奔涌', 'surging water'], 'gate-close': ['城门闭合', 'gate slamming shut'], rope: ['绳索', 'rope'], 'wind-dry': ['干风', 'dry wind'], murmur: ['低语', 'murmuring'],
  oar: ['摇橹', 'oars'], 'bone-crack': ['骨裂（甲骨灼裂）', 'cracking oracle bone'], 'arrow-rain': ['箭雨', 'rain of arrows'], dice: ['骰子', 'dice'], arrow: ['箭矢破空', 'whistling arrow'],
  'horse-neigh': ['马嘶', 'horse neigh'], 'crowd-roar': ['众人呐喊', 'roaring crowd'], fire: ['火声', 'fire'], 'wood-crack': ['木裂', 'cracking wood'], 'wind-high': ['高处疾风', 'high wind'],
  chariot: ['战车', 'chariots'], 'war-cry': ['喊杀', 'war cries'], weeping: ['哭泣', 'weeping'], cattle: ['牛群', 'cattle'], bianzhong: ['编钟', 'bianzhong bells'], 'blade-ring': ['刀鸣', 'ringing blade'],
  'steppe-wind': ['草原风', 'steppe wind'], rooster: ['鸡鸣', 'rooster crow'], 'jade-chime': ['玉磬', 'jade chime'], 'guqin-room': ['琴室', 'guqin room tone'], 'hammer-strike': ['锤击', 'hammer strike'],
  'river-cold': ['寒江水声', 'cold river'], 'zhu-strike': ['击筑', 'struck zhu'], heartbeat: ['心跳', 'heartbeat'], 'dagger-unsheathe': ['匕首出鞘', 'dagger unsheathed'], 'stone-chisel': ['凿石', 'chiselling stone'],
  'metal-clang': ['金属撞击', 'metal clang'], 'wave-crash': ['浪击', 'crashing waves'], 'deer-call': ['鹿鸣', 'deer call'], 'rain-heavy': ['大雨', 'heavy rain'], 'fox-cry': ['狐鸣', 'fox cry'],
  'cup-clink': ['碰杯', 'clinking cups'], 'sword-clash': ['刀剑相击', 'sword clash'], 'chu-song': ['楚歌', 'Chu songs'], 'bell-toll': ['钟鸣', 'tolling bell'], 'wind-gust': ['阵风', 'wind gust'],
  'desert-wind': ['大漠风', 'desert wind'], 'camel-bell': ['驼铃', 'camel bells'], 'wheel-creak': ['车轮吱呀', 'creaking wheel'], cough: ['咳嗽', 'cough'], 'brush-drop': ['笔落', 'brush dropped'],
  'forest-cicada': ['林中蝉鸣', 'cicadas'], cicada: ['蝉鸣', 'cicada'], 'glass-break': ['碎裂', 'shattering'], 'crane-call': ['鹤唳', 'crane call'], 'grain-pour': ['倒粮', 'pouring grain'],
  chant: ['诵经', 'chanting'], abacus: ['算盘', 'abacus'], rain: ['雨声', 'rain'], bow: ['弓', 'bow'], 'string-snap': ['弦断', 'snapping string'], chain: ['锁链', 'chains'], 'sword-draw': ['拔剑', 'sword drawn'],
  pipa: ['琵琶一声', 'pipa phrase'], armor: ['甲片作响', 'rattling armour'], silence: ['静默', 'silence'], wind: ['风声', 'wind'], guqin: ['琴声', 'guqin'], crossbow: ['弩机', 'crossbow'],
  crow: ['乌鸦', 'crows'], blade: ['刀声', 'blade'], wheel: ['车轮', 'wheels'], cannon: ['炮声', 'cannon fire'], cricket: ['蟋蟀', 'crickets'], loom: ['织机', 'loom'], 'bronze-bell2': ['钟', 'bell'],
};
const COLOR = { black: ['墨黑', 'ink black'], white: ['白', 'white'], dark_gray: ['深灰', 'dark grey'], gold_orange: ['金橙', 'gold-orange'], blue_gray: ['蓝灰', 'blue-grey'],
  terra_cotta: ['赭石', 'terracotta ochre'], wine_red: ['酒红', 'wine red'], brown: ['咖啡色', 'brown'], green_dark: ['墨绿', 'deep green'], blue_dark: ['深蓝', 'deep blue'],
  red: ['朱红', 'vermilion'], brick_red: ['砖红', 'brick red'], gray_brown: ['灰褐', 'grey-brown'], sage_gray: ['鼠尾草灰', 'sage grey'], gray_green: ['青灰', 'grey-green'],
  khaki: ['卡其', 'khaki'], tan: ['驼色', 'tan'], beige: ['米色', 'beige'], silver: ['银灰', 'silver'], purple: ['紫', 'purple'], green: ['绿', 'green'], olive_green: ['橄榄绿', 'olive'],
  yellow: ['黄', 'yellow'], blue: ['蓝', 'blue'], orange: ['橙', 'orange'], light_gray: ['浅灰', 'light grey'], medium_gray: ['中灰', 'mid grey'], mauve_gray: ['淡紫灰', 'mauve grey'] };
const ELEM_ZH = { banner: '旌旗', spear: '长枪', bow: '弓箭', sword: '长剑', blade: '大刀', shield: '盾牌', 'war-horse': '战马', water: '水', landscape: '山水', 'ink-bomb': '泼墨', 'water-brush': '毛笔' };
const yearEn = y => (y < 0 ? -y + ' BCE' : y + ' CE');
const whenEn = w => (w ? (w.end != null && w.end !== w.start ? yearEn(w.start) + '–' + yearEn(w.end) : (w.precision === 'circa' || w.precision === 'legend' ? 'c. ' : '') + yearEn(w.start)) : '');
const FEMALE = /皇后|王后|太后|后妃|^后$|妃|公主|夫人|女子|侍女|之女|宫女|女官|女将|女史|女诗人|女词人|才女|寡妇|女伶|女演员|女冠|姬|娘|母|妻|嫔|婆|姑|嫂|妾|^女|女$/;
const snd = (id, i) => (SND[id] || [id, id.replace(/-/g, ' ')])[i];
const assetId = a => (a || '').split('/').pop().replace(/\.ogg$/, '');

const NEG_ZH = '写实照片，3D 渲染，CG 质感，油画厚涂，赛博朋克，日式动漫脸，美颜网红脸，高饱和霓虹色，现代建筑，现代服饰，汽车电线，塑料质感，英文字母，乱码文字，错别字，水印，签名，logo，多余肢体，手指畸形，五官崩坏，人物变形闪烁，画面抖动撕裂';
const NEG_EN = 'photorealistic, 3D render, CGI look, thick oil paint, cyberpunk, anime faces, beauty-filter faces, neon oversaturated colours, modern buildings, modern clothing, cars, power lines, plastic texture, Latin letters, garbled text, misspelled characters, watermark, signature, logo, extra limbs, malformed hands, distorted faces, flickering characters, jitter and tearing';

function periodNeg(order) {
  const zh = [], en = [];
  if (order < 20) { zh.push('清代辫发与马褂'); en.push('Qing queues and magua jackets'); }
  if (order < 12) { zh.push('幞头与圆领袍'); en.push('futou caps and round-collar robes'); }
  if (order < 6) { zh.push('铁甲与马镫'); en.push('iron plate armour and stirrups'); }
  return [zh, en];
}

function lookFor(member, order) {
  const camp = member.camp || '';
  const t = TYPE_LOOK[member.type] || TYPE_LOOK.other;
  const fem = FEMALE.test(member.title || '') || /公主|皇后|太后|夫人|女$|姬$/.test(member.name);
  for (const [re, zh, en] of CAMP_LOOK) if (re.test(camp)) {
    if (fem && /游牧/.test(zh)) return ['草原贵妇装束：镶毛长袍、高冠、珠饰', 'steppe noblewoman: fur-trimmed robe, tall headdress, beads and jewellery'];
    return [zh, en];
  }
  const [mz, fz] = ERA[order][1].split('|'), [me, fe] = ERA[order][2].split('|');
  let z = fem ? (fz || mz) : mz, e = fem ? (fe || me) : me;
  // 文臣、学者、宗室与女子不披甲执兵：从时代服饰里去掉甲胄兵器
  const martial = member.type === 'general' || /将|兵|卒|勇士|刺客|侠|武士|守城/.test(member.title || '') ||
    (member.type !== 'ruler' && /率兵|率军|领兵|搏战|血战|力战|挥刀|拔剑|披甲/.test(member.bio || ''));
  if (fem || !martial) {
    z = z.split('，').filter(x => !/甲|铠|剑|刀|戈|戟|弩|钺|战车/.test(x)).join('，') || z;
    e = e.split(/,\s*|;\s*/).filter(x => !/armou?r|sword|\bge\b|halberd|crossbow|axe|chariot|dagger|blade/.test(x)).join(', ') || e;
  }
  const [tz, te] = fem && member.type === 'other' ? ['女子衣着，依身份', 'female dress appropriate to rank']
    : !fem && member.type === 'royal' ? ['宗室贵胄华服，玉佩冠带', 'noble prince\'s rich robes, jade pendants, formal cap and sash'] : t;
  return [z + '；' + tz, e + '; ' + te];
}
const nameEn = n => PINYIN[n] || n;
const sec = f => Math.round(f / 60);
const clip = (s, n) => (s.length > n ? s.slice(0, n).replace(/[，、；：,]$/, '') + '……' : s);
function firstSentences(text, max) {
  const parts = text.split(/(?<=[。！？])/);
  let out = '';
  for (const p of parts) { if ((out + p).length > max && out) break; out += p; }
  return clip(out || text, max + 20);
}

function build(bundle, entry, chapterTitle) {
  const scene = entry.scene, op = entry.opening, S = (entry.strings && entry.strings.strings) || {};
  const T = k => (k in S ? S[k] : k);
  const order = bundle.chapter.order;
  const era = ERA[order];
  const title = T(scene.title), subtitle = T(scene.subtitle), seal = T(scene.title.replace(/\.title$/, '.when'));
  const castById = new Map(entry.cast.map(c => [c.id, c]));
  const castByName = new Map(entry.cast.map(c => [c.name, c]));
  const tr = op.tracks;
  const palette = (bundle.chapter.look && bundle.chapter.look.palette) || [];
  const bgmCue = (tr.audio || []).find(a => a.bus === 'bgm' && a.asset);
  const bgm = bgmCue ? (BGM[assetId(bgmCue.asset)] || [assetId(bgmCue.asset), assetId(bgmCue.asset)]) : ['古琴', 'guqin'];
  const caption = (tr.text || []).find(t => t.kind === 'caption');
  const quote = S[scene.title.replace(/\.title$/, '.quote')] || (caption && T(caption.key)) || '';
  const qsrc = caption && caption.source ? '《' + caption.source.title + (caption.source.section ? '·' + caption.source.section : '') + '》' : '';
  const canonEnd = (scene.endings || []).find(e => e.kind === 'canon');
  const endText = canonEnd ? T(canonEnd.title) : '';

  const shots = [];
  const appearing = new Set();
  let t0 = 0;
  for (const [i, s] of op.shots.entries()) {
    const inS = x => x.at >= s.from && x.at < s.to;
    const strokes = (tr.strokes || []).filter(inS);
    const cams = (tr.camera || []).filter(inS).map(c => c.label).filter(l => CAMERA[l]);
    const cam = cams.length ? cams : [i === 0 ? 'still' : 'pan'];
    const fx = [...new Set((tr.effects || []).filter(inS).map(e => e.kind))].filter(k => EFFECT[k]);
    const groups = { far: [], mid: [], subj: [], over: [] }, groupsEn = { far: [], mid: [], subj: [], over: [] };
    const figs = [];
    for (const x of strokes) {
      const label = (x.label || '').replace(/（.*$/, '').replace(/[：:].*$/, '');
      if (!label) continue;
      const m = castByName.get(label);
      if (m) { if (!figs.includes(m)) figs.push(m); appearing.add(m.id); continue; }
      const key = x.layer === 'far' ? 'far' : x.layer === 'actors' ? 'subj' : x.layer === 'overlay' ? 'over' : 'mid';
      if (key === 'over') { if (!groups.over.includes(label)) { groups.over.push(label); groupsEn.over.push(label); } continue; }
      if (!ELEM_EN[label] && !/^[\u4e00-\u9fa5]{1,4}$/.test(label)) continue;
      const zhL = ELEM_ZH[label] || label;
      if (!groups[key].includes(zhL)) { groups[key].push(zhL); groupsEn[key].push(ELEM_EN[label] || label); }
    }
    const compZh = [
      groups.far.length && '远景：' + groups.far.join('、'),
      groups.mid.length && '中景：' + groups.mid.join('、'),
      (figs.length || groups.subj.length) && '主体：' + [...figs.map(f => f.name), ...groups.subj].join('、'),
      groups.over.length && '飞白题字「' + groups.over.join('」「') + '」',
    ].filter(Boolean).join('；') || '大面积留白，只有淡墨远山';
    const compEn = [
      groupsEn.far.length && 'background: ' + groupsEn.far.join(', '),
      groupsEn.mid.length && 'midground: ' + groupsEn.mid.join(', '),
      (figs.length || groupsEn.subj.length) && 'subject: ' + [...figs.map(f => nameEn(f.name)), ...groupsEn.subj].join(', '),
      groupsEn.over.length && 'dry-brush calligraphy 「' + groupsEn.over.join('」「') + '」',
    ].filter(Boolean).join('; ') || 'mostly empty paper with faint distant hills';
    const tr0 = TRANS[i === 0 ? 'still' : cam[0]] || TRANS.pan;
    const elemInk = [...new Set(strokes.map(x => (x.label || '').replace(/（.*$/, '')).filter(l => ELEM_INK[l]))].slice(0, 2);
    const inkZh = [tr0[0], ...elemInk.map(l => ELEM_INK[l][0]), ...fx.filter(k => k !== 'fade').map(k => EFFECT[k][0])];
    const inkEn = [tr0[1], ...elemInk.map(l => ELEM_INK[l][1]), ...fx.filter(k => k !== 'fade').map(k => EFFECT[k][1])];
    if (cam.includes('climax')) { inkZh.push(HIT_FX_ZH); inkEn.push(HIT_FX_EN); }
    const auds = (tr.audio || []).filter(inS).filter(a => a.asset && (a.bus === 'amb' || a.bus === 'sfx'));
    const ambs = [...new Set(auds.filter(a => a.bus === 'amb').map(a => assetId(a.asset)))];
    const sfxs = [...new Set(auds.filter(a => a.bus === 'sfx').map(a => assetId(a.asset)))];
    // 视频按“一镜一句旁白”对齐（规格里五个镜头与五句旁白一一对应）；过场动画的字幕时间轴另有安排
    const vo = S[`vo.${String(i + 1).padStart(2, '0')}`] || '';
    const cap = (tr.text || []).filter(inS).find(t => t.kind === 'caption');
    const dur = vo ? voSec(vo) : Math.max(6, Math.min(10, Math.round(sec(s.to - s.from) * 0.6)));
    const enNote = EN[scene.id]?.shots?.[i];
    if (!enNote) missingEn.push(`${scene.id} shot ${i + 1}`);
    const soundZh = [ambs.length && '环境：' + ambs.map(a => snd(a, 0)).join('、'), sfxs.length && '音效：' + sfxs.map(a => snd(a, 0)).join('、')].filter(Boolean).join('；') || '仅背景乐';
    const soundEn = [ambs.length && 'ambience: ' + ambs.map(a => snd(a, 1)).join(', '), sfxs.length && 'SFX: ' + sfxs.map(a => snd(a, 1)).join(', ')].filter(Boolean).join('; ') || 'music only';
    const textZh = [i === 0 && `片名「${title}」竖排书法与朱印「${seal}」`, cap && `引文「${T(cap.key)}」竖排楷书`, vo && '底部旁白字幕'].filter(Boolean).join('；');
    const textEn = [i === 0 && `vertical brush-calligraphy title 「${title}」 with vermilion seal 「${seal}」`, cap && `vertical kaishu quotation 「${T(cap.key)}」`, vo && 'Chinese subtitles at bottom'].filter(Boolean).join('; ');
    shots.push({
      n: i + 1, startSec: t0, durationSec: dur, figures: figs.map(f => f.id),
      camera: { zh: cam.map(c => CAMERA[c][0]).join('，再'), en: cam.map(c => CAMERA[c][1]).join(', then ') },
      composition: { zh: compZh, en: compEn },
      action: { zh: s.note || '', en: enNote || s.note || '' },
      ink: { zh: inkZh.join('；'), en: inkEn.join('; ') },
      sound: { zh: soundZh, en: soundEn },
      text: { zh: textZh, en: textEn },
      vo,
    });
    t0 += dur;
  }
  // 结局镜
  const endFig = shots.length ? shots[shots.length - 1].figures : [];
  const endVo = endText ? firstSentences(endText, 70) : '';
  const endEn = EN[scene.id]?.end;
  if (!endEn) missingEn.push(`${scene.id} end`);
  shots.push({
    n: shots.length + 1, startSec: t0, durationSec: endVo ? voSec(endVo) : 8, figures: endFig,
    camera: { zh: '缓慢拉远成全景，画面如长卷收束', en: 'slow pull-back to a wide shot, closing like a handscroll' },
    composition: { zh: '主体退为远景中的小小身影，四周大片留白；' + (endFig.length ? '人物：' + endFig.map(id => castById.get(id)?.name).join('、') : '山河远景'), en: 'the subject recedes into a tiny figure amid vast empty paper; ' + (endFig.length ? 'figures: ' + endFig.map(id => nameEn(castById.get(id)?.name || id)).join(', ') : 'distant landscape') },
    action: { zh: '正史结局：' + (endVo || '事件落幕'), en: 'Canonical outcome: ' + (endEn || endVo || '') },
    ink: { zh: '墨色由浓转淡，水痕慢慢洇开，余墨流向画外', en: 'ink fades from dense to pale, water marks spreading, residual ink drifting off-frame' },
    sound: { zh: '背景乐回落，余音与环境声', en: 'music settles, lingering tail and ambience' },
    text: { zh: '底部旁白字幕', en: 'Chinese subtitles at bottom' },
    vo: endVo,
  });
  t0 += shots[shots.length - 1].durationSec;
  // 落款镜
  shots.push({
    n: shots.length + 1, startSec: t0, durationSec: SEAL_SEC, figures: [],
    camera: { zh: '固定机位，空镜', en: 'locked-off empty frame' },
    composition: { zh: `空白宣纸上，左侧竖排楷书引文${quote ? '「' + quote + '」' : ''}${qsrc ? '，下署' + qsrc : ''}；右下角朱印「${seal}」`, en: `blank xuan paper; a vertical kaishu quotation${quote ? ' 「' + quote + '」' : ''}${qsrc ? ' signed ' + qsrc : ''}; vermilion seal 「${seal}」 at lower right` },
    action: { zh: '引文逐字写出，最后朱印落下', en: 'the quotation writes itself stroke by stroke; the vermilion seal stamps last' },
    ink: { zh: '毛笔逐笔书写，朱砂印泥微微渗开', en: 'brush writes stroke by stroke, vermilion seal paste slightly bleeding' },
    sound: { zh: '印章落纸一声，琴声收尾', en: 'a soft seal stamp, the music ends' },
    text: { zh: '引文与出处', en: 'quotation and its source' },
    vo: quote ? quote : '',
  });
  t0 += SEAL_SEC;

  // 人物
  const ordered = [...entry.cast].sort((a, b) => (appearing.has(b.id) ? 1 : 0) - (appearing.has(a.id) ? 1 : 0));
  const year = scene.when && scene.when.display;
  const characters = ordered.map(c => {
    const [lz, le] = lookFor(c, order);
    const hint = (c.title || '') + (c.bio || '');
    const ageZh = /少年|十几岁|年幼|幼主|幼子|童/.test(hint) ? '少年（十余岁）' : /老将|老臣|白发|老人|老妪|晚年|年老|七十|八十|老母/.test(hint) ? '老年' : '';
    const ageEn = /少年|十几岁|年幼|幼主|幼子|童/.test(hint) ? 'a teenager' : /老将|老臣|白发|老人|老妪|晚年|年老|七十|八十|老母/.test(hint) ? 'elderly' : '';
    return {
      id: c.id, name: c.name, nameEn: nameEn(c.name), onScreen: appearing.has(c.id),
      zh: `${c.name}（${c.camp}·${c.title}）：${lz}${ageZh ? '；' + ageZh : ''}；${FIGURE_ZH}；${c.bio}`,
      en: `${nameEn(c.name)} (${c.name}) — ${TYPE_EN[c.type] || 'figure'}, ${PINYIN[c.camp] || c.camp}; ${le}${ageEn ? '; ' + ageEn : ''}; ${FIGURE_EN}`,
    };
  });

  const style = { zh: STYLE_ZH, en: STYLE_EN };
  const setting = {
    zh: `${chapterTitle} · ${scene.when.era || ''}（${year}）。${era[3]}。`,
    en: `${era[0]}, ${whenEn(scene.when)} — ${era[4]}.`,
  };
  const vos = shots.map(s => s.vo).filter(Boolean);
  const ambAll = [...new Set((tr.audio || []).filter(a => a.bus === 'amb' && a.asset).map(a => assetId(a.asset)))];
  const sfxAll = [...new Set((tr.audio || []).filter(a => a.bus === 'sfx' && a.asset).map(a => assetId(a.asset)))];
  const sound = {
    zh: `背景乐：${bgm[0]}，随剧情由缓入急、高潮前骤停留白；环境声：${ambAll.map(a => snd(a, 0)).join('、')}；音效：${sfxAll.map(a => snd(a, 0)).join('、')}；旁白：普通话，沉稳舒缓的纪录片语气，逐镜如下。`,
    en: `Music: ${bgm[1]}, building gradually and cutting to silence before the climax; ambience: ${ambAll.map(a => snd(a, 1)).join(', ')}; SFX: ${sfxAll.map(a => snd(a, 1)).join(', ')}; narration: calm Mandarin documentary voice-over (lines given per shot, keep them in Chinese).`,
  };
  const onScreenText = {
    zh: `片头：右上竖排书法片名「${title}」，副题「${subtitle}」，朱印「${seal}」；旁白字幕：简体中文，底部居中，楷体或宋体，白底留边；${quote ? `引文：「${quote}」——${qsrc}，竖排楷书；` : ''}所有文字必须准确，不得出现错字、乱码或英文。`,
    en: `Title: vertical brush calligraphy 「${title}」, subtitle 「${subtitle}」, vermilion seal 「${seal}」 at upper right; subtitles: Simplified Chinese, bottom centre${quote ? `; quotation 「${quote}」 — ${qsrc}, vertical kaishu` : ''}; all Chinese text must be exact, no garbled or Latin text.`,
  };
  const [pnz, pne] = periodNeg(order);
  const negative = { zh: NEG_ZH + '，' + NEG_STYLE_ZH + (pnz.length ? '，时代错置：' + pnz.join('、') : ''), en: NEG_EN + ', ' + NEG_STYLE_EN + (pne.length ? ', anachronisms: ' + pne.join(', ') : '') };

  const shotLineZh = s => `镜头 ${s.n}（${s.startSec}–${s.startSec + s.durationSec} 秒，${s.durationSec} 秒）｜运镜：${s.camera.zh}｜构图：${s.composition.zh}｜动作：${s.action.zh}｜水墨效果：${s.ink.zh}｜声音：${s.sound.zh}${s.text.zh ? '｜屏幕文字：' + s.text.zh : ''}${s.vo ? '｜旁白：「' + s.vo + '」' : ''}`;
  const shotLineEn = s => `Shot ${s.n} (${s.startSec}–${s.startSec + s.durationSec} s, ${s.durationSec} s) | Camera: ${s.camera.en} | Composition: ${s.composition.en} | Action: ${s.action.en} | Ink FX: ${s.ink.en} | Sound: ${s.sound.en}${s.text.en ? ' | On-screen text: ' + s.text.en : ''}${s.vo ? ' | VO (Mandarin): 「' + s.vo + '」' : ''}`;
  for (const s of shots) { s.zh = shotLineZh(s); s.en = shotLineEn(s); }
  const shotsOut = shots.map(s => ({ n: s.n, startSec: s.startSec, durationSec: s.durationSec, figures: s.figures, vo: s.vo, zh: s.zh, en: s.en }));

  const zh = [
    `【水墨视频生成提示词】${chapterTitle} · ${title}（${subtitle}）`,
    `画幅与时长：16:9 横屏（1920×1080，竖屏可改 9:16 并保持主体居中），${FPS_OUT}fps，总长约 ${t0} 秒，共 ${shots.length} 个镜头；单镜时长超出生成器上限时可逐镜生成后剪辑。`,
    `风格：${style.zh}`,
    `时代与场景：${setting.zh}`,
    '人物：\n' + characters.map(c => '- ' + c.zh).join('\n'),
    '分镜：\n' + shots.map(s => s.zh).join('\n'),
    `声音：${sound.zh}`,
    `字幕与屏幕文字：${onScreenText.zh}`,
    `负面提示词：${negative.zh}`,
  ].join('\n\n');
  const en = [
    `[Ink-wash video prompt] ${era[0]} · ${EN[scene.id]?.title || subtitle} (「${title}」)`,
    `Format: 16:9 landscape (1920×1080; for 9:16 keep the subject centred), ${FPS_OUT} fps, about ${t0} s total, ${shots.length} shots; generate shot by shot and edit together if a shot exceeds the generator's limit.`,
    `Style: ${style.en}`,
    `Setting: ${setting.en}`,
    'Characters:\n' + characters.map(c => '- ' + c.en).join('\n'),
    'Storyboard:\n' + shots.map(s => s.en).join('\n'),
    `Sound: ${sound.en}`,
    `On-screen text: ${onScreenText.en}`,
    `Negative prompt: ${negative.en}`,
  ].join('\n\n');

  return {
    version: 1,
    generator: 'video/tools/build-video-prompts.mjs',
    aspectRatio: '16:9', resolution: [1920, 1080], fps: FPS_OUT, durationSec: t0,
    style, setting, characters, shots: shotsOut, sound, onScreenText, negative,
    narration: vos,
    prompt: { zh, en },
  };
}

const index = JSON.parse(readFileSync(join(root, 'data', 'chapters', 'index.json'), 'utf8'));
let n = 0, shotsN = 0;
for (const c of index.chapters) {
  const file = join(root, 'data', c.file);
  const bundle = JSON.parse(readFileSync(file, 'utf8'));
  const ct = (bundle.strings && bundle.strings.strings && bundle.strings.strings[bundle.chapter.title]) || c.id;
  for (const entry of bundle.scenes) {
    if (!entry.opening) continue;
    // 简化剪影风：素材里的“皴法”等精细笔法词换成剪影说法
    entry.videoPrompt = JSON.parse(JSON.stringify(build(bundle, entry, ct)).replaceAll('皴法山石', '山石剪影').replaceAll('textured rocks', 'rock silhouettes'));
    n++; shotsN += entry.videoPrompt.shots.length;
  }
  writeFileSync(file, JSON.stringify(bundle, null, 1));
}
console.log(`共 ${n} 个场景生成 videoPrompt，${shotsN} 个镜头`);
if (missingEn.length) console.log(`缺英文分镜 ${missingEn.length} 处（video/tools/video-prompt-en.json），例：${missingEn.slice(0, 5).join('；')}`);
