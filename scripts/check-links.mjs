// 校验 README / docs / plan / video / AGENTS 中的本地相对链接
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (name.endsWith('.md')) yield path;
  }
}

const files = [
  join(root, 'README.md'),
  join(root, 'AGENTS.md'),
  ...walk(join(root, 'docs')),
  ...walk(join(root, 'plan')),
  ...walk(join(root, 'video')),
];

const missing = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const [, link] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (/^(https?:|mailto:|#)/.test(link)) continue;
    const target = resolve(dirname(file), link.split('#')[0]);
    if (!existsSync(target)) missing.push(`${file.replace(root + '/', '')} -> ${link}`);
  }
}

if (missing.length) {
  console.error('死链：\n' + missing.map(item => '  ' + item).join('\n'));
  process.exit(1);
}
console.log(`链接检查通过（${files.length} 个 Markdown 文件）`);
