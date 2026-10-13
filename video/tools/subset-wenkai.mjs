#!/usr/bin/env node
/**
 * 把霞鹜文楷收成一份 Medium woff2。
 *
 * 扫描 video/viewer 里实际用这套楷画出的文字（静态页面、按钮文案、
 * 场景标题与副题、人物名、印章、地图标注、开场分镜旁白、关系页）。
 * 不收提示词正文、叙事段落和其它宋体正文。
 *
 * 用法（仓库根目录）：
 *   node video/tools/subset-wenkai.mjs
 *   ./build.sh fonts
 *
 * 需要 python3 的 fonttools 与 brotli：pip install fonttools brotli
 * 上游 TTF 用 WENKAI_TTF 指定，否则用缓存，缓存没有就从 v1.522 发布页下载。
 * 内容或页面文案变了之后重跑本脚本，再提交生成的 woff2。
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const VIEWER = path.join(ROOT, "video/viewer");
const OUT = path.join(VIEWER, "assets/fonts/lxgw-wenkai-medium.woff2");
const REGULAR = path.join(VIEWER, "assets/fonts/lxgw-wenkai-regular.woff2");
const VERSION = "v1.522";
const RELEASE = `https://github.com/lxgw/LxgwWenKai/releases/download/${VERSION}/LXGWWenKai-Medium.ttf`;

function loadViewerData() {
  const sandbox = { window: {} };
  const ctx = vm.createContext(sandbox);
  const load = (rel) => {
    const file = path.join(VIEWER, rel);
    vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: rel });
  };
  load("data/index.js");
  load("data/pian/index.js");
  load("data/maps.js");
  for (const name of fs.readdirSync(path.join(VIEWER, "data"))) {
    if (/^\d\d-/.test(name)) load(path.join("data", name));
  }
  for (const name of ["zhanchang", "zhiguo", "renwu", "dili"]) load(`data/pian/${name}.js`);
  return sandbox.window;
}

function resolveKey(entry, bundle, key) {
  if (key == null) return "";
  const local = entry && entry.strings && entry.strings.strings;
  const shared = bundle && bundle.strings && bundle.strings.strings;
  if (local && Object.prototype.hasOwnProperty.call(local, key)) return local[key];
  if (shared && Object.prototype.hasOwnProperty.call(shared, key)) return shared[key];
  return key;
}

function resolveVo(entry, value) {
  const strings = entry && entry.strings && entry.strings.strings;
  if (!strings || value == null || value === "") return value || "";
  if (Object.prototype.hasOwnProperty.call(strings, value)) return strings[value];
  const hit = Object.keys(strings).find((k) => k.endsWith("." + value));
  return hit ? strings[hit] : value;
}

function collectData(window) {
  const parts = [];
  const push = (value) => {
    if (value != null && value !== "") parts.push(String(value));
  };
  for (const chapter of window.HISTORY_GAME_INDEX.chapters) {
    push(chapter.name);
    push(chapter.short);
    push(chapter.no);
  }
  const chapters = window.HISTORY_GAME_CHAPTERS;
  for (const id of Object.keys(chapters)) {
    const bundle = chapters[id];
    const shared = (bundle.strings && bundle.strings.strings) || {};
    push(shared["chapter." + id + ".title"]);
    for (const entry of bundle.scenes || []) {
      const scene = entry.scene || {};
      push(resolveKey(entry, bundle, scene.title));
      push(resolveKey(entry, bundle, scene.subtitle));
      const onScreen = entry.videoPrompt && entry.videoPrompt.onScreenText && entry.videoPrompt.onScreenText.zh;
      const seal = onScreen && String(onScreen).match(/朱印「([^」]+)」/);
      if (seal) push(seal[1]);
      for (const person of entry.cast || []) push(person.name);
      const shots = (entry.opening && entry.opening.shots) || [];
      for (const shot of shots) push(shot.id);
      const lines = (entry.opening && entry.opening.tracks && entry.opening.tracks.text) || [];
      for (const line of lines) {
        const raw = line.vo
          ? resolveKey(entry, bundle, line.vo) || resolveKey(entry, bundle, "vo." + line.vo)
          : line.key
            ? resolveKey(entry, bundle, line.key)
            : "";
        push(resolveVo(entry, raw));
      }
    }
  }
  const pian = window.FENGHUO_PIAN;
  for (const item of (pian.series && pian.series.pians) || []) {
    push(item.name);
    push(item.fullName);
    push(item.seal);
  }
  for (const item of pian.catalog || []) push(item.title);
  const packs = window.FENGHUO_PIAN_PACKS || {};
  for (const id of Object.keys(packs)) {
    for (const scene of packs[id].scenes || []) {
      push(scene.title);
      push(scene.subtitle);
      for (const figure of scene.figures || []) {
        push(figure.name);
        push(figure.role);
      }
    }
  }
  const walkMap = (node) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(walkMap);
      return;
    }
    if (typeof node.text === "string" && (node.kind || node.x != null)) push(node.text);
    if (typeof node.name === "string" && node.place) push(node.name);
    if (typeof node.title === "string" && node.sc) push(node.title);
    for (const value of Object.values(node)) {
      if (value && typeof value === "object") walkMap(value);
    }
  };
  walkMap(window.FENGHUO_MAPS);
  return parts;
}

/* 这些 class / 结构在 index.html 与 pian.css 里设了 font-family: var(--kai)。
   子元素若另设了宋体或等宽，不收。 */
const KAI_CLASS = new Set([
  "seal", "pian-menu", "hero-sub", "btn", "ch-name", "back", "more", "sub2",
  "lane-label", "nseal", "nname", "tip-name", "lg-char", "vo", "sub", "sc-group",
  "map-label", "mk-label",
]);

function classesOf(raw) {
  return new Set(String(raw || "").split(/\s+/).filter(Boolean));
}

function inKai(stack) {
  const top = stack[stack.length - 1];
  if (!top) return false;
  if (top.classes.has("small") || top.classes.has("kicker") || top.classes.has("hero-p")) return false;
  if (top.classes.has("prompt") || top.id === "quote") return false;
  if ((top.classes.has("n") || top.classes.has("s") || top.classes.has("y")) && stack.some((el) => el.classes.has("sc"))) return false;
  if (top.tag === "span" && stack.some((el) => el.tag === "h4")) return false;
  for (const el of stack) {
    if ([...el.classes].some((name) => KAI_CLASS.has(name))) return true;
    if (el.id === "btitle" || el.id === "htitle") return true;
  }
  const has = (pred) => stack.some(pred);
  if (top.tag === "h1" && has((el) => el.classes.has("hero-title"))) return true;
  if (top.tag === "h2" && has((el) => el.classes.has("sec-h") || el.classes.has("card") || el.classes.has("scene-head") || el.classes.has("pb"))) return true;
  if (top.tag === "h3" && has((el) => el.classes.has("pian-card"))) return true;
  if (top.tag === "h4" && has((el) => el.classes.has("shot"))) return true;
  if (top.tag === "b" && has((el) => el.classes.has("stats") || el.classes.has("seg-h") || el.classes.has("map-pop"))) return true;
  if (top.tag === "em" && has((el) => el.classes.has("keys"))) return true;
  if (top.tag === "a" && has((el) => el.id === "secnav" || el.id === "pianNav")) return true;
  if (top.tag === "button" && has((el) => el.id === "viewToggle" || el.classes.has("map-pop"))) return true;
  if (top.classes.has("t") && has((el) => el.classes.has("sc"))) return true;
  if (top.tag === "summary") return true;
  if (top.tag === "label" && has((el) => el.id === "pianTools")) return true;
  if (top.tag === "span" && has((el) => el.classes.has("nm") || el.classes.has("who") || el.classes.has("map-thumb"))) return true;
  if (top.tag === "b" && has((el) => el.tag === "figcaption" || el.classes.has("figcaption"))) return true;
  return false;
}

function collectVisibleText(html) {
  const body = html.split("<body>")[1]?.split("<script")[0] || "";
  return [body.replace(/<!--[\s\S]*?-->/g, " ").replace(/<[^>]+>/g, " ")];
}

function collectHtmlKai(html) {
  const body = html.split("<body>")[1]?.split("<script")[0] || "";
  const parts = [];
  const stack = [];
  const re = /<!--[\s\S]*?-->|<\/([a-zA-Z0-9]+)>|<([a-zA-Z0-9]+)([^>]*)>|([^<]+)/g;
  let match;
  while ((match = re.exec(body))) {
    if (match[0].startsWith("<!--")) continue;
    if (match[1]) {
      const tag = match[1].toLowerCase();
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].tag === tag) {
          stack.splice(i);
          break;
        }
      }
      continue;
    }
    if (match[2]) {
      const tag = match[2].toLowerCase();
      const attrs = match[3] || "";
      const selfClosing = /\/>$/.test(attrs) || ["img", "br", "source", "input", "meta", "link"].includes(tag);
      if (!selfClosing) {
        const id = (attrs.match(/\sid="([^"]*)"/) || attrs.match(/^id="([^"]*)"/) || [])[1] || "";
        const cls = (attrs.match(/\sclass="([^"]*)"/) || attrs.match(/^class="([^"]*)"/) || [])[1] || "";
        stack.push({ tag, id, classes: classesOf(cls) });
      }
      continue;
    }
    if (match[4] && inKai(stack)) parts.push(match[4]);
  }
  return parts;
}

function collectLiterals(source) {
  const withoutBlocks = source.replace(/<!--[\s\S]*?-->/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");
  const parts = [];
  const re = /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g;
  let match;
  while ((match = re.exec(withoutBlocks))) {
    const text = match[0].slice(1, -1);
    if (/[\u3400-\u9fff]/.test(text) || text.length <= 24) parts.push(text);
  }
  return parts;
}

function uniqueChars(parts) {
  const chars = new Set();
  for (const part of parts) {
    for (const ch of part) {
      if (!/\s/.test(ch)) chars.add(ch);
    }
  }
  return [...chars].sort((a, b) => a.codePointAt(0) - b.codePointAt(0));
}

async function sourceTtf() {
  if (process.env.WENKAI_TTF) return process.env.WENKAI_TTF;
  const cached = path.join(os.tmpdir(), `LXGWWenKai-Medium-${VERSION}.ttf`);
  if (fs.existsSync(cached) && fs.statSync(cached).size > 1_000_000) return cached;
  process.stderr.write("下载 " + RELEASE + "\n");
  const response = await fetch(RELEASE);
  if (!response.ok) throw new Error("下载霞鹜文楷失败：" + response.status);
  const bytes = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(cached, bytes);
  return cached;
}

function subset(ttf, textFile) {
  const probe = spawnSync("python3", ["-c", "import fontTools, brotli"], { encoding: "utf8" });
  if (probe.status !== 0) {
    throw new Error("需要 python3 的 fonttools 与 brotli：pip install fonttools brotli");
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const run = spawnSync("python3", [
    "-m", "fontTools.subset", ttf,
    "--text-file=" + textFile,
    "--flavor=woff2",
    "--output-file=" + OUT,
    "--layout-features=vert,vrt2",
    "--recommended-glyphs",
    "--notdef-glyph",
    "--notdef-outline",
    "--name-IDs=*",
    "--drop-tables+=DSIG",
  ], { encoding: "utf8" });
  if (run.stdout) process.stdout.write(run.stdout);
  if (run.stderr) process.stderr.write(run.stderr);
  if (run.status !== 0) throw new Error("pyftsubset 失败");
}

function report(chars, textFile) {
  const read = spawnSync("python3", ["-c", `
from fontTools.ttLib import TTFont
font = TTFont(${JSON.stringify(OUT)})
cmap = font.getBestCmap() or {}
text = open(${JSON.stringify(textFile)}, encoding="utf-8").read()
miss = [ch for ch in text if ord(ch) not in cmap]
print(len(font.getGlyphOrder()))
print(len(cmap))
print(" ".join(f"U+{ord(ch):04X}:{ch}" for ch in miss))
`], { encoding: "utf8" });
  if (read.status !== 0) throw new Error(read.stderr || "读 woff2 失败");
  const lines = read.stdout.trim().split("\n");
  const bytes = fs.statSync(OUT).size;
  console.log(JSON.stringify({
    scannedChars: chars.length,
    glyphs: Number(lines[0]),
    cmap: Number(lines[1]),
    bytes,
    missingFromFont: lines[2] ? lines[2].split(" ").filter(Boolean) : [],
    output: path.relative(ROOT, OUT),
  }, null, 2));
}

const dataWindow = loadViewerData();
const indexHtml = fs.readFileSync(path.join(VIEWER, "index.html"), "utf8");
const relationsHtml = fs.readFileSync(path.join(VIEWER, "05-09-jingke-relations.html"), "utf8");
const parts = [
  ...collectData(dataWindow),
  ...collectHtmlKai(indexHtml),
  ...collectLiterals(indexHtml.slice(indexHtml.lastIndexOf("<script>"))),
  ...collectLiterals(relationsHtml),
  ...collectVisibleText(relationsHtml),
];
const chars = uniqueChars(parts);
const textFile = path.join(os.tmpdir(), "inkgames-wenkai-chars.txt");
fs.writeFileSync(textFile, chars.join(""));
const ttf = await sourceTtf();
subset(ttf, textFile);
if (fs.existsSync(REGULAR)) fs.rmSync(REGULAR);
report(chars, textFile);
