#!/usr/bin/env python3
"""Regenerate video/tools/name-pinyin.json (cast name -> pinyin) for the English video prompts.

Optional helper: needs `pip install pypinyin` (in a venv). build-video-prompts.mjs works
without it — names missing from the table are kept in Chinese in the English prompt.
Usage (repo root): python3 video/tools/gen-name-pinyin.py
"""
import json, os, glob
from pypinyin import lazy_pinyin, Style, load_phrases_dict

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, '..', 'data', 'chapters')
OUT = os.path.join(HERE, 'name-pinyin.json')

# 姓氏/专名读音修正（pypinyin 默认读音不对的）
FIX = {'单于': 'Chanyu', '尉迟': 'Yuchi', '长孙': 'Zhangsun', '万俟': 'Moqi', '冒顿': 'Modu',
       '阏氏': 'Yanzhi', '可汗': 'Khagan', '龟兹': 'Qiuci', '吐蕃': 'Tubo', '解': 'Xie',
       '曾': 'Zeng', '仇': 'Qiu', '朴': 'Piao', '单': 'Shan', '乐毅': 'Yue Yi', '乐羊': 'Yue Yang',
       '召公': 'Shao Gong', '召公奭': 'Shao Gong Shi', '伍子胥': 'Wu Zixu', '纣': 'Zhou', '褒姒': 'Bao Si',
       '妺喜': 'Mo Xi', '妹喜': 'Mo Xi', '费仲': 'Fei Zhong', '樊哙': 'Fan Kuai', '郦食其': 'Li Yiji',
       '金日磾': 'Jin Midi', '万章': 'Wan Zhang', '秦始皇': 'Qin Shi Huang', '女娲': 'Nüwa'}

COMPOUND = set('诸葛 司马 欧阳 上官 慕容 宇文 独孤 拓跋 夏侯 东方 公孙 令狐 皇甫 尉迟 长孙 呼延 赫连 耶律 完颜 斛律 高阳 钟离 端木 澹台 叔孙 孟孙 季孙 子路 南宫 申屠 太史 百里 西门 公子 公孙 夏后 有扈 涂山 爱新'.split())
SURNAME = {'曾': 'Zeng', '单': 'Shan', '解': 'Xie', '仇': 'Qiu', '乐': 'Yue', '召': 'Shao', '查': 'Zha', '盖': 'Ge', '区': 'Ou', '覃': 'Qin', '尉': 'Yu', '万': 'Wan', '翟': 'Zhai', '燕': 'Yan', '纪': 'Ji', '缪': 'Miao', '贾': 'Jia', '秘': 'Bi'}
FOREIGN = {'成吉思汗': 'Genghis Khan', '忽必烈': 'Kublai', '窝阔台': 'Ögedei', '拖雷': 'Tolui', '铁木真': 'Temüjin', '蒙哥': 'Möngke',
           '马可·波罗': 'Marco Polo', '札木合': 'Jamukha', '者别': 'Jebe', '札兰丁': 'Jalal al-Din', '旭烈兀': 'Hülegü', '阿里不哥': 'Ariq Böke',
           '桑贾尔': 'Sanjar', '努尔哈赤': 'Nurhaci', '皇太极': 'Hong Taiji', '多尔衮': 'Dorgon', '多铎': 'Dodo', '鳌拜': 'Oboi', '义律': 'Charles Elliot',
           '伊东祐亨': 'Itō Sukeyuki', '颉利可汗': 'Illig Qaghan', '始毕可汗': 'Shibi Qaghan', '松赞干布': 'Songtsen Gampo', '禄东赞': 'Gar Tongtsen',
           '菩提达摩': 'Bodhidharma', '阔阔真': 'Kököchin', '兀鲁䚟': 'Oghuz', '亦思马因': 'Ismail', '塔察儿': 'Tachar', '别迭': 'Biedie',
           '古尔伯勒津': 'Gürbeljin', '冒顿': 'Modu', '呼韩邪单于': 'Huhanye Chanyu', '郅支单于': 'Zhizhi Chanyu', '阿史那': 'Ashina',
           '乙支文德': 'Eulji Mundeok', '药葛罗': 'Yaghlakar', '麴文泰': 'Qu Wentai'}

def py(s):
    return [x.replace('v', 'ü') for x in lazy_pinyin(s, style=Style.NORMAL, errors='ignore')]

def one(name):
    if name in FOREIGN:
        return FOREIGN[name]
    if name in FIX:
        return FIX[name]
    for suf, en in (('单于', 'Chanyu'), ('可汗', 'Qaghan')):
        if name.endswith(suf) and len(name) > len(suf):
            return one(name[:-len(suf)]) + ' ' + en
    if name[:2] in COMPOUND and len(name) >= 3:
        sur, given = name[:2], name[2:]
        return ''.join(py(sur)).capitalize() + ' ' + ''.join(py(given)).capitalize()
    p = py(name)
    if not p:
        return None
    if name[0] in SURNAME:
        p[0] = SURNAME[name[0]].lower()
    if len(p) == 1:
        return p[0].capitalize()
    return p[0].capitalize() + ' ' + ''.join(p[1:]).capitalize()

def roman(name):
    parts = [x for x in name.replace('·', '·').split('、') if x]
    return ' and '.join(filter(None, (one(x) for x in parts))) or None

names = set()
for f in sorted(glob.glob(os.path.join(DATA, '*.json'))):
    if f.endswith('index.json'):
        continue
    d = json.load(open(f, encoding='utf8'))
    for s in d['scenes']:
        for c in s.get('cast', []):
            names.add(c['name'])
out = {}
for n in sorted(names):
    if all('\u4e00' <= ch <= '\u9fff' or ch in '·、（）' for ch in n):
        r = roman(n.split('（')[0])
        if r:
            out[n] = r
json.dump(out, open(OUT, 'w', encoding='utf8'), ensure_ascii=False, indent=0, sort_keys=True)
print(f'{len(out)} names -> {OUT}')
