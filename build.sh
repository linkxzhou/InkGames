#!/usr/bin/env bash
# InkGames 统一构建入口：安装依赖 / 开发预览 / 构建 / 测试 / 检查 / 清理
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

PORT="${PORT:-5173}"
HOST="${HOST:-127.0.0.1}"

log()  { printf '\033[1;34m[inkgames]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[inkgames]\033[0m %s\n' "$*" >&2; }
fail() { printf '\033[1;31m[inkgames]\033[0m %s\n' "$*" >&2; exit 1; }

require() {
  command -v "$1" >/dev/null 2>&1 || fail "缺少命令：$1。$2"
}

ensure_tools() {
  require node "请安装 Node.js >= 20"
  require yarn "请安装 yarn（例如 corepack enable）"
  local major
  major="$(node -p 'process.versions.node.split(".")[0]')"
  [ "$major" -ge 20 ] || fail "需要 Node.js >= 20，当前 $(node -v)"
}

ensure_deps() {
  ensure_tools
  if [ ! -d node_modules ] || [ package.json -nt node_modules/.yarn-state.yml ] 2>/dev/null; then
    cmd_install
  fi
}

cmd_install() {
  ensure_tools
  log "安装依赖（yarn install）"
  yarn install || fail "依赖安装失败：请检查网络或 registry 配置后重试 ./build.sh install"
}

cmd_dev() {
  ensure_deps
  log "启动开发服务器：http://${HOST}:${PORT}/ （2.0 十卡首页；旧 /inkcross/、/wuxia/ 暂留）"
  if [ "${OPEN:-0}" = "1" ] && command -v open >/dev/null 2>&1; then
    ( sleep 2; open "http://${HOST}:${PORT}/" ) &
  fi
  exec yarn dev --host "$HOST" --port "$PORT" --strictPort
}

cmd_typecheck() {
  ensure_deps
  log "类型检查（tsc --noEmit）"
  yarn typecheck
}

cmd_build() {
  ensure_deps
  log "类型检查 + 生产构建 -> dist/"
  yarn build
  log "构建完成：$(du -sh dist 2>/dev/null | cut -f1) （dist/）"
}

cmd_preview() {
  cmd_build
  log "预览构建产物：http://${HOST}:4173/ （2.0 十卡首页）"
  exec yarn preview --host "$HOST"
}

cmd_test() {
  ensure_deps
  log "运行单元测试（vitest）"
  yarn test
}

cmd_links() {
  log "校验文档相对链接"
  node scripts/check-links.mjs
}

cmd_check() {
  cmd_typecheck
  cmd_test
  cmd_links
  log "全部检查通过"
}

cmd_browser() {
  ensure_deps
  log "构建后在 Chromium(headless + SwiftShader) 中冒烟：十卡、对照页、墨渡、江湖"
  yarn build
  node scripts/browser-smoke.mjs
}

cmd_clean() {
  log "清理 dist/ 与缓存"
  rm -rf dist node_modules/.vite node_modules/.vitest .vite
}

usage() {
  cat <<'EOF'
用法: ./build.sh <命令>

  install     安装依赖（yarn install）
  dev         启动 Vite：/ 十卡效果首页（旧 /inkcross/、/wuxia/ 暂留）
              环境变量：PORT=5173 HOST=127.0.0.1 OPEN=1（自动打开浏览器，仅 macOS）
  typecheck   TypeScript 严格类型检查
  build       类型检查 + 生产构建（输出 dist/）
  preview     构建后启动预览服务器 http://127.0.0.1:4173/
  test        运行 vitest 单元测试
  browser     构建后在无头 Chromium 中做 WebGL2/页面冒烟验证
  links       校验 README/docs/plan 的本地相对链接
  check       typecheck + test + links（提交前必跑）
  clean       清理 dist/ 与缓存
EOF
}

case "${1:-help}" in
  install)   cmd_install ;;
  dev)       cmd_dev ;;
  typecheck) cmd_typecheck ;;
  build)     cmd_build ;;
  preview)   cmd_preview ;;
  test)      cmd_test ;;
  browser)   cmd_browser ;;
  links)     cmd_links ;;
  check)     cmd_check ;;
  clean)     cmd_clean ;;
  help|-h|--help) usage ;;
  *) usage; fail "未知命令：$1" ;;
esac
