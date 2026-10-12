#!/usr/bin/env node
/**
 * 地图数据：地名库、场景落点、帧、示意疆域、投影，以及 SVG 底图。
 * 几何来自 Natural Earth 1:50m（公有领域）海岸与大河，外加少量手描示意河段。
 * 不读取、不写、不引用 CHGIS。
 *
 *   node video/tools/build-maps.mjs
 * 可选：--ne-land /tmp/ne/land.geojson --ne-rivers /tmp/ne/rivers.geojson
 * 第一次会把裁切后的几何写到 video/data/maps/basemap/，之后不必再带原始文件。
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const MAPS = join(ROOT, 'video/data/maps');
const OUT_JS = join(ROOT, 'video/viewer/data/maps.js');
const OUT_SVG = join(ROOT, 'video/viewer/assets/maps');

const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
};

/** 坐标是常见遗址与城址的约数，供落点使用。页面图例写明疆域与部分河段为示意。人工抽检前 verify 多为 review。 */
const SEED = [
  ['zhuolu', '涿鹿', 115.22, 40.37, 'battlefield', 'legend', [], '传说涿鹿之野，今河北涿鹿一带。坐标约数，待核验。'],
  ['yangcheng', '阳城', 113.03, 34.45, 'capital', 'legend', ['登封'], '夏都阳城旧说在今登封一带，地点有争议。待核验。'],
  ['yin', '殷', 114.35, 36.12, 'capital', 'site', ['殷墟', '安阳'], '殷墟在今安阳小屯。'],
  ['bo', '亳', 115.65, 34.44, 'capital', 'region', ['商丘'], '三亳说法不一，这里暂取商丘一带，待核验。'],
  ['hao', '镐京', 108.73, 34.22, 'capital', 'site', ['镐', '丰镐'], '西周镐京，今西安西南。'],
  ['muye', '牧野', 113.85, 35.30, 'battlefield', 'region', [], '牧野旧说在今淇县一带。待核验。'],
  ['luoyi', '洛邑', 112.47, 34.68, 'capital', 'city', ['洛阳', '雒阳', '洛京'], '周汉洛阳，今洛阳市区一带。'],
  ['linzi', '临淄', 118.36, 36.83, 'city', 'city', [], '齐临淄。'],
  ['handan', '邯郸', 114.49, 36.61, 'city', 'city', [], '赵邯郸。'],
  ['ji', '蓟', 116.40, 39.92, 'city', 'city', [], '战国燕都蓟，今北京西南。与后来的大都、北京分列，以免混成一次迁都。'],
  ['xianyang', '咸阳', 108.72, 34.38, 'capital', 'site', ['渭城'], '秦咸阳城遗址在今咸阳东北。'],
  ['langya', '琅邪', 119.77, 35.58, 'city', 'site', ['琅琊'], '琅邪台在今青岛黄岛一带。'],
  ['shaqiu', '沙丘', 115.18, 37.28, 'region', 'region', [], '沙丘平台旧说在今广宗一带。待核验。'],
  ['julu', '巨鹿', 115.04, 37.27, 'battlefield', 'city', [], '巨鹿之战在今平乡、巨鹿一带。'],
  ['changan', '长安', 108.90, 34.30, 'capital', 'site', ['大兴'], '汉长安城在今西安西北。隋大兴、唐长安同区，本库用同一点。'],
  ['hongmen', '鸿门', 109.30, 34.40, 'battlefield', 'site', [], '鸿门在今临潼东。'],
  ['gaixia', '垓下', 117.55, 33.35, 'battlefield', 'region', [], '垓下旧说在今灵璧一带。待核验。'],
  ['baideng', '白登', 113.30, 40.10, 'battlefield', 'region', [], '白登在今大同东北。待核验。'],
  ['chengdu', '成都', 104.07, 30.67, 'city', 'city', [], '成都。'],
  ['hanzhong', '汉中', 107.03, 33.07, 'city', 'city', [], '汉中。'],
  ['guandu', '官渡', 114.05, 34.85, 'battlefield', 'region', [], '官渡在今中牟一带。待核验。'],
  ['chibi', '赤壁', 113.90, 29.73, 'battlefield', 'region', [], '赤壁地点有蒲圻、黄州等说。待核验，不选边。'],
  ['yiling', '夷陵', 111.33, 30.77, 'battlefield', 'city', ['猇亭'], '夷陵在今宜昌一带。'],
  ['jianye', '建业', 118.79, 32.06, 'capital', 'city', ['建康', '金陵', '南京', '应天'], '六朝建康与明南京，今南京。'],
  ['ye', '邺', 114.35, 36.28, 'city', 'site', [], '邺城在今临漳。'],
  ['xuchang', '许昌', 113.85, 34.04, 'city', 'city', ['许县'], '汉魏许县。'],
  ['luoyang', '洛阳', 112.45, 34.62, 'capital', 'city', [], '与洛邑同一城址区，汉魏以后的常用名。匹配时标题里的「洛阳」落这里。'],
  ['pingcheng', '平城', 113.30, 40.08, 'capital', 'city', ['大同'], '北魏平城，今大同。'],
  ['jiangling', '江陵', 112.18, 30.35, 'city', 'city', ['荆州'], '江陵。'],
  ['xiangyang', '襄阳', 112.14, 32.04, 'city', 'city', [], '襄阳。'],
  ['shouchun', '寿春', 116.78, 32.57, 'city', 'city', [], '寿春，今寿县。'],
  ['feishui', '淝水', 116.75, 32.62, 'battlefield', 'region', [], '淝水之战在寿春一带。'],
  ['taiyuan', '太原', 112.55, 37.87, 'city', 'city', ['晋阳'], '晋阳、太原。'],
  ['kaifeng', '开封', 114.35, 34.80, 'capital', 'city', ['汴梁', '汴京', '东京', '大梁'], '五代、北宋东京。'],
  ['linan', '临安', 120.16, 30.25, 'capital', 'city', ['杭州'], '南宋临安。'],
  ['yangzhou', '扬州', 119.42, 32.39, 'city', 'city', [], '扬州。'],
  ['suzhou', '苏州', 120.62, 31.32, 'city', 'city', [], '苏州。'],
  ['quanzhou', '泉州', 118.68, 24.87, 'city', 'city', [], '泉州。'],
  ['guangzhou', '广州', 113.26, 23.13, 'city', 'city', ['番禺'], '番禺、广州。'],
  ['guilin', '桂林', 110.29, 25.27, 'city', 'city', [], '桂林。'],
  ['changsha', '长沙', 112.94, 28.23, 'city', 'city', [], '长沙。'],
  ['nanchang', '南昌', 115.86, 28.68, 'city', 'city', [], '南昌。'],
  ['wuchang', '武昌', 114.31, 30.55, 'city', 'city', [], '武昌。'],
  ['dunhuang', '敦煌', 94.66, 40.14, 'city', 'city', [], '敦煌。'],
  ['jiuquan', '酒泉', 98.49, 39.73, 'city', 'city', [], '酒泉。'],
  ['wuwei', '武威', 102.64, 37.93, 'city', 'city', ['凉州'], '武威、凉州。'],
  ['zhangye', '张掖', 100.45, 38.93, 'city', 'city', [], '张掖。'],
  ['jincheng', '金城', 103.83, 36.06, 'city', 'city', ['兰州'], '金城，今兰州。'],
  ['yinchuan', '银川', 106.23, 38.49, 'capital', 'city', ['兴庆'], '西夏兴庆。'],
  ['dadu', '大都', 116.39, 39.91, 'capital', 'city', [], '元大都。'],
  ['beijing', '北京', 116.40, 39.90, 'capital', 'city', ['北平', '燕京'], '明清北京。'],
  ['shangdu', '上都', 116.18, 42.25, 'capital', 'site', [], '元上都，今正蓝旗一带。'],
  ['helins', '和林', 102.83, 47.20, 'capital', 'site', ['哈拉和林'], '哈拉和林。坐标约数，待核验。'],
  ['caishi', '采石', 118.45, 31.70, 'battlefield', 'city', [], '采石矶。'],
  ['yashan', '崖山', 113.08, 22.20, 'battlefield', 'site', ['崖门'], '崖门海战，今新会南。'],
  ['diaoyu', '钓鱼城', 106.32, 30.20, 'battlefield', 'site', [], '合川钓鱼城。'],
  ['changping', '长平', 112.92, 35.80, 'battlefield', 'region', [], '长平在今高平。'],
  ['maling', '马陵', 115.90, 34.70, 'battlefield', 'region', [], '马陵地点有争议。待核验。'],
  ['chengpu', '城濮', 115.45, 35.10, 'battlefield', 'region', [], '城濮旧说在今鄄城、濮城一带。待核验。'],
  ['pengcheng', '彭城', 117.19, 34.26, 'city', 'city', ['徐州'], '彭城，今徐州。'],
  ['hangu', '函谷关', 110.90, 34.63, 'pass', 'site', ['函谷'], '函谷关。'],
  ['tongguan', '潼关', 110.25, 34.50, 'pass', 'site', [], '潼关。'],
  ['yanmen', '雁门关', 112.88, 39.18, 'pass', 'site', ['雁门'], '雁门关。'],
  ['jiayuguan', '嘉峪关', 98.22, 39.80, 'pass', 'site', [], '嘉峪关。'],
  ['shanhaiguan', '山海关', 119.75, 40.00, 'pass', 'site', ['山海'], '山海关。'],
  ['juyong', '居庸关', 116.07, 40.29, 'pass', 'site', ['居庸'], '居庸关。'],
  ['jianmen', '剑门', 105.56, 32.21, 'pass', 'site', ['剑门关'], '剑门关。'],
  ['taishan', '泰山', 117.10, 36.25, 'mountain', 'site', [], '泰山。'],
  ['huashan', '华山', 110.09, 34.48, 'mountain', 'site', [], '华山。'],
  ['songshan', '嵩山', 113.03, 34.48, 'mountain', 'site', [], '嵩山。'],
  ['hengshan', '衡山', 112.70, 27.25, 'mountain', 'site', [], '南岳衡山。'],
  ['kunlun', '昆仑', 81.00, 36.00, 'mountain', 'legend', [], '早期文献里的昆仑，无定所。坐标只为图上有个传说点，待核验。'],
  ['tianshan', '天山', 86.00, 43.00, 'mountain', 'region', [], '天山，区域。'],
  ['huanghe', '黄河', 110.40, 35.60, 'river', 'region', ['河'], '黄河中游标注点。单字「河」只在新场景 places 数组里使用。'],
  ['changjiang', '长江', 112.50, 30.40, 'river', 'region', ['江'], '长江中游标注点。单字「江」只在新场景 places 数组里使用。'],
  ['huaihe', '淮河', 117.20, 32.90, 'river', 'region', [], '淮河流路在 50m 数据里没有单列，标注点为示意。'],
  ['weishui', '渭水', 108.80, 34.35, 'river', 'region', ['渭河'], '渭水示意点。'],
  ['hanshui', '汉水', 112.10, 32.00, 'river', 'region', ['汉江'], '汉水示意点。'],
  ['fenhe', '汾水', 111.60, 37.00, 'river', 'region', ['汾河'], '汾水示意点。'],
  ['zhujiang', '珠江', 113.20, 23.10, 'river', 'region', [], '珠江示意点。'],
  ['liaohe', '辽河', 123.20, 42.30, 'river', 'region', [], '辽河。'],
  ['tarim', '塔里木河', 82.50, 40.50, 'river', 'region', [], '塔里木河示意点。'],
  ['dongting', '洞庭', 112.90, 29.30, 'marsh', 'region', ['洞庭湖'], '洞庭。'],
  ['poyang', '鄱阳', 116.30, 29.10, 'marsh', 'region', ['鄱阳湖'], '鄱阳。'],
  ['taihu', '太湖', 120.20, 31.20, 'marsh', 'region', [], '太湖。'],
  ['yunmeng', '云梦', 113.00, 30.40, 'marsh', 'legend', [], '云梦泽为古代泽薮，范围示意。'],
  ['bohai', '渤海', 120.00, 38.80, 'sea', 'region', [], '渤海标注点。'],
  ['donghai', '东海', 123.00, 30.00, 'sea', 'region', [], '东海标注点。'],
];

const CHAPTER_FRAME = {
  shanggu: ['core', 'zhuolu'], xia: ['core', 'yangcheng'], shang: ['core', 'yin'],
  xizhou: ['core', 'hao'], chunqiu: ['core', 'luoyi'], zhanguo: ['core', 'handan'],
  qin: ['han', 'xianyang'], donghan: ['han', 'luoyang'], sanguo: ['han', 'luoyang'],
  liangjin: ['han', 'luoyang'], nanbeichao: ['han', 'jianye'], sui: ['han', 'changan'],
  wudai: ['han', 'kaifeng'], beisong: ['han', 'kaifeng'], nansong: ['han', 'linan'],
  ming: ['han', 'beijing'],
  xihan: ['full', 'changan'], tang: ['full', 'changan'], liaojin: ['full', 'beijing'],
  yuan: ['full', 'dadu'], qing: ['full', 'beijing'],
};

const FRAMES = {
  core: { west: 104, east: 122, south: 29, north: 42 },
  han: { west: 97, east: 125, south: 18, north: 45 },
  full: { west: 73, east: 135, south: 15, north: 55 },
};

/** 椭圆示意疆域。页面写「疆域为示意，非精确边界」。 */
const TERR = {
  shanggu: [['中原传说范围', 114, 36.2, 6, 3.5]],
  xia: [['夏', 113.2, 34.8, 4.5, 2.8]],
  shang: [['商', 114.8, 35.6, 6, 3.2]],
  xizhou: [['西周', 110.5, 34.8, 7, 3.2]],
  chunqiu: [['诸夏', 114, 34.6, 8, 4]],
  zhanguo: [['战国', 113, 35.2, 9, 4.5]],
  qin: [['秦', 110, 34.5, 12, 6]],
  xihan: [['西汉', 102, 36, 16, 7]],
  donghan: [['东汉', 112, 33.5, 10, 6]],
  sanguo: [['魏', 114, 35.5, 6, 3.5], ['蜀', 105.5, 30.5, 4.5, 3.5], ['吴', 118, 30, 5, 3.5]],
  liangjin: [['晋', 112, 33.5, 9, 5]],
  nanbeichao: [['北朝', 113, 37.5, 7, 3.5], ['南朝', 116, 30.5, 7, 3.5]],
  sui: [['隋', 110, 34, 12, 7]],
  tang: [['唐', 105, 36, 18, 8]],
  wudai: [['中原', 114, 34.5, 5, 3], ['蜀', 104.5, 30.2, 4, 3]],
  beisong: [['北宋', 113, 34.5, 8, 5]],
  liaojin: [['辽', 120, 43, 7, 3.5], ['西夏', 106, 38, 4, 3], ['金', 118, 40, 6, 3.5]],
  nansong: [['南宋', 117, 28.5, 7, 5]],
  yuan: [['元', 105, 40, 22, 10]],
  ming: [['明', 112, 33, 14, 9]],
  qing: [['清', 105, 38, 24, 12]],
};

const NE_RIVERS = ['Huang', 'Yangtze', 'Chang Jiang', 'Liao', 'Tarim'];
const RIVER_LABEL = { Huang: '黄河', Yangtze: '长江', 'Chang Jiang': '长江', Liao: '辽河', Tarim: '塔里木河' };

function ellipse(lon, lat, rx, ry, n = 28) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    pts.push([round(lon + Math.cos(t) * rx, 2), round(lat + Math.sin(t) * ry * 0.85, 2)]);
  }
  pts.push(pts[0]);
  return pts;
}
function round(n, d) { const p = 10 ** d; return Math.round(n * p) / p; }

function writeJson(path, obj) {
  writeFileSync(path, JSON.stringify(obj, null, 1) + '\n');
}

function seedPlaces() {
  const places = {};
  for (const [id, name, lon, lat, kind, precision, aliases, note] of SEED) {
    places[id] = {
      name, aliases, kind, lon, lat, precision,
      modern: note,
      src: { type: 'manual', note },
      verify: precision === 'site' || precision === 'city' ? 'review' : 'review',
    };
  }
  return { format: 'inkgames.places', version: 1, comment: '坐标是约数，verify 均为 review，待人工抽检。来源只写 manual 或 wikidata。', places };
}

function framesDoc() {
  const chapters = {};
  for (const [id, [frame, capital]] of Object.entries(CHAPTER_FRAME)) chapters[id] = { frame, capital };
  return { format: 'inkgames.map-frames', version: 1, frames: FRAMES, chapters };
}

function writeTerritory() {
  const dir = join(MAPS, 'territory');
  mkdirSync(dir, { recursive: true });
  for (const [ch, parts] of Object.entries(TERR)) {
    writeJson(join(dir, ch + '.json'), {
      format: 'inkgames.territory', version: 1, chapter: ch,
      note: '手绘椭圆示意，不是边界。',
      parts: parts.map(([name, lon, lat, rx, ry], i) => ({
        id: ch + '-' + (i + 1), name, ring: ellipse(lon, lat, rx, ry),
      })),
    });
  }
}

function projectFrame(frame) {
  const lat0 = (frame.south + frame.north) / 2 * Math.PI / 180;
  const cos = Math.cos(lat0);
  let west = frame.west, east = frame.east, south = frame.south, north = frame.north;
  const w = (east - west) * cos, h = north - south;
  const aspect = w / h, target = 1.6;
  if (aspect > target) {
    const need = w / target;
    const pad = (need - h) / 2;
    south -= pad; north += pad;
  } else {
    const need = h * target / cos;
    const pad = (need - (east - west)) / 2;
    west -= pad; east += pad;
  }
  return { west, east, south, north, cos };
}
function xy(box, lon, lat) {
  return {
    x: round((lon - box.west) / (box.east - box.west), 4),
    y: round((box.north - lat) / (box.north - box.south), 4),
  };
}
function inside(p) { return p.x >= 0.02 && p.x <= 0.98 && p.y >= 0.02 && p.y <= 0.98; }

function loadCatalog() {
  const raw = readFileSync(join(ROOT, 'video/viewer/data/pian/index.js'), 'utf8');
  const j = JSON.parse(raw.slice(raw.indexOf('{')).replace(/;\s*$/, ''));
  return j.catalog;
}
function loadNovels() {
  const dir = join(ROOT, 'video/data/pian/src/scenes');
  const out = {};
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    for (const sc of JSON.parse(readFileSync(join(dir, f), 'utf8'))) out[sc.id] = sc;
  }
  return out;
}
function loadSources() {
  const root = join(ROOT, 'video/sources');
  const bySlug = {};
  const walk = (dir) => {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      if (f.endsWith('.md') && f !== 'README.md') {
        const slug = f.replace(/\.md$/, '').split('-').slice(2).join('-');
        if (slug) bySlug[slug] = readFileSync(p, 'utf8');
      } else if (!f.includes('.')) {
        try { if (readdirSync(p)) walk(p); } catch { /* file */ }
      }
    }
  };
  walk(root);
  return bySlug;
}

function compileNames(places) {
  const rows = [];
  for (const [id, p] of Object.entries(places)) {
    const names = [p.name, ...(p.aliases || [])];
    for (const name of names) {
      if (name.length < 2 && !['河', '江'].includes(name)) continue;
      rows.push({ id, name, n: name.length, single: name.length < 2 });
    }
  }
  rows.sort((a, b) => b.n - a.n);
  return rows;
}
function matchPlaceField(text, rows) {
  const t = String(text || '').trim();
  const exact = rows.find(r => r.name === t);
  if (exact) return [exact.id];
  const hits = [];
  for (const row of rows) {
    if (row.single) continue;
    if (t.includes(row.name) && t.length <= row.name.length + 2) hits.push(row.id);
  }
  return [...new Set(hits)];
}
function matchText(text, rows, allowSingle) {
  const found = [];
  let mask = text;
  for (const row of rows) {
    if (row.single) {
      if (allowSingle && text.trim() === row.name) found.push(row.id);
      continue;
    }
    if (row.name && mask.includes(row.name)) {
      found.push(row.id);
      mask = mask.split(row.name).join('　'.repeat(row.name.length));
    }
  }
  return [...new Set(found)];
}

function suggest() {
  const placesDoc = JSON.parse(readFileSync(join(MAPS, 'places.json'), 'utf8'));
  const frames = JSON.parse(readFileSync(join(MAPS, 'frames.json'), 'utf8'));
  const boxes = {};
  for (const [id, fr] of Object.entries(frames.frames)) boxes[id] = projectFrame(fr);
  const rows = compileNames(placesDoc.places);
  const cat = loadCatalog();
  const novels = loadNovels();
  const sources = loadSources();
  const scenePlaces = {};
  let high = 0, review = 0;
  for (const item of cat) {
    const ch = frames.chapters[item.chapter];
    const box = boxes[ch.frame];
    const placeOf = (id) => placesDoc.places[id];
    const ok = (id) => { const p = placeOf(id); if (!p || p.lon == null) return false; return inside(xy(box, p.lon, p.lat)); };
    if (item.novel) {
      const sc = novels[item.id];
      const names = (sc && sc.places) || [];
      const resolved = [];
      const unresolved = [];
      for (const name of names) {
        const hit = matchPlaceField(name, rows);
        if (hit.length === 1 && ok(hit[0])) resolved.push(hit[0]);
        else unresolved.push(name);
      }
      const uniq = [...new Set(resolved)];
      if (uniq.length) {
        const rec = { at: uniq[0], confidence: 'high', via: 'places' };
        if (uniq.length > 1) rec.also = uniq.slice(1);
        if (unresolved.length) { rec.suggest = unresolved; rec.note = '部分地名未入地名库或超出本朝地图帧'; }
        scenePlaces[item.id] = rec; high++;
      } else {
        scenePlaces[item.id] = { placeless: true, reason: '待核验', suggest: names.length ? names : ['无地点字段'], confidence: 'low' };
        review++;
      }
      continue;
    }
    const titleHits = matchText((item.title || '') + (item.subtitle || ''), rows, false).filter(ok);
    if (titleHits.length === 1) {
      scenePlaces[item.id] = { at: titleHits[0], confidence: 'high', via: 'title' };
      high++;
      continue;
    }
    if (titleHits.length > 1) {
      scenePlaces[item.id] = { at: titleHits[0], also: titleHits.slice(1), confidence: 'high', via: 'title' };
      high++;
      continue;
    }
    const slug = item.id.split('.').slice(1).join('-');
    const body = sources[slug] || '';
    const bodyHits = matchText(body, rows, false).filter(ok);
    scenePlaces[item.id] = {
      placeless: true,
      reason: '待核验',
      confidence: 'low',
      suggest: bodyHits.slice(0, 6),
      note: bodyHits.length ? '只在史源摘要里提到，没有写进标题' : '标题和史源摘要都没有对上地名库',
    };
    review++;
  }
  const doc = {
    format: 'inkgames.scene-places', version: 1,
    comment: '高置信只来自标题、副标题或新场景 places 数组里的整名匹配，且落在本朝地图帧内。其余 placeless，reason 为待核验，suggest 只是候选。',
    high, review, scenes: scenePlaces,
  };
  writeJson(join(MAPS, 'scene-places.json'), doc);
  console.log(`scene-places：高置信 ${high}，待核验 ${review}，合计 ${high + review}`);
  return doc;
}

function dp(points, eps) {
  if (points.length < 3) return points;
  const sq = (a, b) => { const dx = a[0] - b[0], dy = a[1] - b[1]; return dx * dx + dy * dy; };
  const dist = (p, a, b) => {
    const l2 = sq(a, b);
    if (!l2) return Math.sqrt(sq(p, a));
    let t = ((p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p[0] - (a[0] + t * (b[0] - a[0])), p[1] - (a[1] + t * (b[1] - a[1])));
  };
  let idx = 0, max = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const d = dist(points[i], points[0], points[points.length - 1]);
    if (d > max) { max = d; idx = i; }
  }
  if (max > eps) {
    const left = dp(points.slice(0, idx + 1), eps);
    const right = dp(points.slice(idx), eps);
    return left.slice(0, -1).concat(right);
  }
  return [points[0], points[points.length - 1]];
}

function clipRing(ring, box) {
  const out = ring.filter(p => p[0] >= box.west - 1 && p[0] <= box.east + 1 && p[1] >= box.south - 1 && p[1] <= box.north + 1);
  return out.length >= 4 ? dp(out, 0.18) : [];
}

function loadBasemap() {
  const dir = join(MAPS, 'basemap');
  mkdirSync(dir, { recursive: true });
  const landPath = join(dir, 'land.json');
  const riverPath = join(dir, 'rivers.json');
  const landArg = arg('--ne-land', '');
  const riverArg = arg('--ne-rivers', '');
  if (landArg && existsSync(landArg)) {
    const gj = JSON.parse(readFileSync(landArg, 'utf8'));
    const world = { west: 70, east: 140, south: 12, north: 56 };
    const rings = [];
    const take = (coords) => {
      for (const ring of coords) {
        const clipped = clipRing(ring, world);
        if (clipped.length >= 6) rings.push(clipped.map(p => [round(p[0], 2), round(p[1], 2)]));
      }
    };
    for (const f of gj.features) {
      const g = f.geometry;
      if (!g) continue;
      if (g.type === 'Polygon') take(g.coordinates);
      else if (g.type === 'MultiPolygon') for (const poly of g.coordinates) take(poly);
    }
    writeJson(landPath, { source: 'Natural Earth 1:50m land, public domain, clipped and simplified', rings });
    console.log('basemap land rings', rings.length);
  }
  if (riverArg && existsSync(riverArg)) {
    const gj = JSON.parse(readFileSync(riverArg, 'utf8'));
    const lines = [];
    for (const f of gj.features) {
      const name = f.properties && f.properties.name;
      if (!NE_RIVERS.includes(name)) continue;
      const coords = f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates;
      for (const line of coords) {
        const slim = dp(line, 0.2).map(p => [round(p[0], 2), round(p[1], 2)]);
        if (slim.length >= 2) lines.push({ name, label: RIVER_LABEL[name] || name, line: slim });
      }
    }
    // 手描示意：渭水、淮河、汉水。不冒充实测。
    lines.push(
      { name: 'Wei', label: '渭水', schematic: true, line: [[107.2, 34.4], [108.2, 34.35], [109.2, 34.4], [110.2, 34.55]] },
      { name: 'Huai', label: '淮河', schematic: true, line: [[113.5, 32.4], [115.2, 32.7], [117.2, 33.0], [119.0, 33.2]] },
      { name: 'Han', label: '汉水', schematic: true, line: [[107.0, 33.1], [109.5, 32.6], [111.5, 32.2], [113.5, 30.8]] },
    );
    writeJson(riverPath, { source: 'Natural Earth 1:50m rivers (Huang, Yangtze, Chang Jiang, Liao, Tarim) plus three schematic strokes', lines });
    console.log('basemap rivers', lines.length);
  }
  if (!existsSync(landPath) || !existsSync(riverPath)) {
    throw new Error('缺少 basemap。请传 --ne-land 与 --ne-rivers');
  }
  return {
    land: JSON.parse(readFileSync(landPath, 'utf8')),
    rivers: JSON.parse(readFileSync(riverPath, 'utf8')),
  };
}

function svgFor(ch, box, terr, base) {
  const W = 1600, H = 1000;
  const pt = (lon, lat) => {
    const p = xy(box, lon, lat);
    return [round(p.x * W, 1), round(p.y * H, 1)];
  };
  const dRing = (ring) => ring.map((p, i) => { const [x, y] = pt(p[0], p[1]); return (i ? 'L' : 'M') + x + ' ' + y; }).join('') + 'Z';
  const dLine = (line) => line.map((p, i) => { const [x, y] = pt(p[0], p[1]); return (i ? 'L' : 'M') + x + ' ' + y; }).join('');
  let body = `<rect width="${W}" height="${H}" fill="#eceae4"/>`;
  for (const ring of base.land.rings) {
    const vis = ring.some(p => p[0] > box.west && p[0] < box.east && p[1] > box.south && p[1] < box.north);
    if (!vis) continue;
    body += `<path d="${dRing(ring)}" fill="#d2d1cc" stroke="#a8a8a4" stroke-width="1"/>`;
  }
  for (const part of terr.parts) {
    body += `<path d="${dRing(part.ring)}" fill="#a8a8a4" fill-opacity="0.35" stroke="#6e6e6c" stroke-width="1.5"/>`;
  }
  for (const river of base.rivers.lines) {
    const vis = river.line.some(p => p[0] > box.west && p[0] < box.east && p[1] > box.south && p[1] < box.north);
    if (!vis) continue;
    body += `<path d="${dLine(river.line)}" fill="none" stroke="#6e6e6c" stroke-width="${river.schematic ? 1.25 : 2}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" overflow="hidden">${body}</svg>\n`;
}

function build() {
  const places = JSON.parse(readFileSync(join(MAPS, 'places.json'), 'utf8'));
  const sceneDoc = JSON.parse(readFileSync(join(MAPS, 'scene-places.json'), 'utf8'));
  const frames = JSON.parse(readFileSync(join(MAPS, 'frames.json'), 'utf8'));
  const base = loadBasemap();
  const cat = loadCatalog();
  const byId = Object.fromEntries(cat.map(c => [c.id, c]));
  const boxes = {};
  for (const [id, fr] of Object.entries(frames.frames)) boxes[id] = projectFrame(fr);
  mkdirSync(OUT_SVG, { recursive: true });
  const chapters = {};
  for (const [ch, meta] of Object.entries(frames.chapters)) {
    const box = boxes[meta.frame];
    const terr = JSON.parse(readFileSync(join(MAPS, 'territory', ch + '.json'), 'utf8'));
    if (process.argv.includes('--svg')) writeFileSync(join(OUT_SVG, ch + '.svg'), svgFor(ch, box, terr, base));
    const cap = places.places[meta.capital];
    const capital = { place: meta.capital, name: cap.name, ...xy(box, cap.lon, cap.lat) };
    const labels = [];
    for (const river of base.rivers.lines) {
      const mid = river.line[Math.floor(river.line.length / 2)];
      const p = xy(box, mid[0], mid[1]);
      if (!inside(p)) continue;
      if (labels.some(l => l.text === river.label)) continue;
      labels.push({ text: river.label, x: p.x, y: p.y, kind: 'river', schematic: !!river.schematic });
    }
    const markers = [];
    const placeless = [];
    for (const [id, rec] of Object.entries(sceneDoc.scenes)) {
      const item = byId[id];
      if (!item || item.chapter !== ch) continue;
      if (rec.placeless) { placeless.push(id); continue; }
      const p = places.places[rec.at];
      const pos = xy(box, p.lon, p.lat);
      if (!inside(pos)) { placeless.push(id); continue; }
      markers.push({
        sc: id, place: rec.at, name: p.name, x: pos.x, y: pos.y,
        pians: [item.primary, ...(item.also || [])], primary: item.primary,
        year: item.year, prec: p.precision, title: item.title, subtitle: item.subtitle || '',
        also: rec.also || [],
      });
    }
    markers.sort((a, b) => (a.year || 0) - (b.year || 0) || a.title.localeCompare(b.title, 'zh'));
    const placed = [];
    const sides = ['e', 'w', 'ne', 'nw', 'se', 'sw', 'n', 's'];
    for (const m of markers) {
      let side = 'e';
      for (const s of sides) {
        const dx = s.includes('e') ? 0.04 : s.includes('w') ? -0.04 : 0;
        const dy = s.includes('s') ? 0.03 : s.includes('n') ? -0.03 : 0;
        const hit = placed.some(o => Math.hypot(o.x + o.dx - (m.x + dx), o.y + o.dy - (m.y + dy)) < 0.045);
        if (!hit) { side = s; placed.push({ x: m.x, y: m.y, dx, dy }); break; }
      }
      m.side = side;
    }
    chapters[ch] = {
      img: 'assets/maps/' + ch + '.webp', imgM: 'assets/maps/' + ch + '-m.webp',
      thumb: 'assets/maps/' + ch + '-t.webp', w: 1600, h: 1000, frame: meta.frame,
      capital, labels, markers, placeless,
    };
  }
  const body = { version: 1, chapters };
  const hash = createHash('sha256').update(JSON.stringify(body)).digest('hex').slice(0, 16);
  writeFileSync(OUT_JS, '/* inkgames.maps ' + hash + ' */\nwindow.FENGHUO_MAPS = ' + JSON.stringify(body) + ';\n');
  console.log('maps.js', hash, 'chapters', Object.keys(chapters).length);
}

mkdirSync(MAPS, { recursive: true });
writeJson(join(MAPS, 'places.json'), seedPlaces());
writeJson(join(MAPS, 'frames.json'), framesDoc());
writeTerritory();
suggest();
build();
