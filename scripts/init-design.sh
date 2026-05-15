#!/usr/bin/env bash
# init-design.sh — bootstrap the design layer of a project
# Usage: init-design.sh [target] [--style minimal|editorial|brutalist|glass] [--stack vite-react|vanilla]
#
# Idempotent: hash-tracked sync via .design-harness.json — user-modified files preserved.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="${1:-$(pwd)}"
[[ "${TARGET:0:1}" == "-" ]] && TARGET="$(pwd)"
STYLE="minimal"
STACK=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --style=*) STYLE="${1#--style=}"; shift ;;
    --style)   STYLE="${2:-minimal}"; shift 2 ;;
    --stack=*) STACK="${1#--stack=}"; shift ;;
    --stack)   STACK="${2:-}"; shift 2 ;;
    *) shift ;;
  esac
done

[[ -d "$TARGET/.git" ]] || { echo "error: $TARGET is not a git repo" >&2; exit 2; }
[[ -d "$ROOT/design-md/$STYLE" ]] || { echo "error: unknown style '$STYLE'" >&2; exit 2; }

# JSON helpers (node-based — no jq dependency)
json_get() { # json_get <file> <key>
  node -e "const d=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));process.stdout.write(String(d[process.argv[2]]??''))" "$1" "$2"
}
json_set() { # json_set <file> <key> <value>
  node -e "const fs=require('fs'),f=process.argv[1];const d=fs.existsSync(f)?JSON.parse(fs.readFileSync(f,'utf8')):{};d[process.argv[2]]=process.argv[3];fs.writeFileSync(f,JSON.stringify(d,null,2)+'\n')" "$1" "$2" "$3"
}
json_merge_scripts() { # json_merge_scripts <package.json> <scripts.json>
  node -e "
const fs=require('fs');
const pkgPath=process.argv[1], addPath=process.argv[2];
const pkg=JSON.parse(fs.readFileSync(pkgPath,'utf8'));
const add=JSON.parse(fs.readFileSync(addPath,'utf8'));
pkg.scripts=Object.assign({},pkg.scripts||{},add);
fs.writeFileSync(pkgPath,JSON.stringify(pkg,null,2)+'\n');
" "$1" "$2"
}
json_has_deps_vite_react() { # check package.json for both vite and react
  node -e "
const f=process.argv[1];
if(!require('fs').existsSync(f))process.exit(1);
const p=JSON.parse(require('fs').readFileSync(f,'utf8'));
const all=Object.assign({},p.dependencies||{},p.devDependencies||{});
process.exit(('vite' in all && 'react' in all)?0:1);
" "$1"
}

json_has_dep() { # json_has_dep <package.json> <dep-name>
  node -e "
const f=process.argv[1], name=process.argv[2];
if(!require('fs').existsSync(f))process.exit(1);
const p=JSON.parse(require('fs').readFileSync(f,'utf8'));
const all=Object.assign({},p.dependencies||{},p.devDependencies||{});
process.exit((name in all)?0:1);
" "$1" "$2"
}

# Auto-detect stack if not given
if [[ -z "$STACK" ]]; then
  if json_has_deps_vite_react "$TARGET/package.json" 2>/dev/null; then
    STACK="vite-react"
  elif json_has_dep "$TARGET/package.json" "next" 2>/dev/null; then
    STACK="nextjs"
  else
    STACK="vanilla"
  fi
fi

export PROJECT="$(basename "$TARGET")" STYLE STACK
STATE="$TARGET/.design-harness.json"
[[ -f "$STATE" ]] || echo '{}' > "$STATE"

sha() { sha256sum "$1" | cut -c1-16; }
state_set() { json_set "$STATE" "$1" "$2"; }
state_get() { json_get "$STATE" "$1"; }

# render <src-relative-to-ROOT> <dst-relative-to-TARGET>
render() {
  local src="$ROOT/$1" dst="$TARGET/$2" new cur rec
  [[ -f "$src" ]] || { echo "[miss] $1" >&2; return 1; }
  mkdir -p "$(dirname "$dst")"
  new="$(envsubst < "$src")"
  if [[ -f "$dst" ]]; then
    cur=$(sha "$dst")
    rec=$(state_get "$2")
    if [[ -n "$rec" && "$cur" == "$rec" ]]; then
      printf '%s' "$new" > "$dst"; echo "[upd] $2"
    else
      echo "[skip-user-modified] $2"; return 0
    fi
  else
    printf '%s' "$new" > "$dst"; echo "[new] $2"
  fi
  state_set "$2" "$(sha "$dst")"
}

# 1) DESIGN.md
render "design-md/$STYLE/DESIGN.md" "DESIGN.md"

# 2) docs/CLAUDE-design.md
render "templates/claude-design-section.md.tmpl" "docs/CLAUDE-design.md"

# 3) pre-commit hook
HOOK_SRC="$ROOT/templates/hooks/design-lint.sh"
HOOK_DST="$TARGET/.git/hooks/pre-commit.design"
if [[ -f "$HOOK_SRC" ]]; then
  cp "$HOOK_SRC" "$HOOK_DST" && chmod +x "$HOOK_DST"
  echo "[hook] $HOOK_DST"
  # Wire into main pre-commit if absent
  MAIN="$TARGET/.git/hooks/pre-commit"
  if [[ ! -f "$MAIN" ]]; then
    printf '#!/usr/bin/env bash\nexec "$(dirname "$0")/pre-commit.design"\n' > "$MAIN"
    chmod +x "$MAIN"
    echo "[hook] $MAIN (created chain)"
  elif ! grep -q "pre-commit.design" "$MAIN"; then
    echo "[warn] $MAIN exists but does not chain pre-commit.design — add manually"
  fi
fi

# 4) gitignore append
GI="$TARGET/.gitignore"
[[ -f "$GI" ]] || touch "$GI"
while IFS= read -r line || [[ -n "$line" ]]; do
  [[ -z "$line" || "$line" == "#"* ]] && { echo "$line" >> "$GI.tmp.$$" 2>/dev/null || true; continue; }
  if grep -qxF "$line" "$GI"; then :
  else echo "$line" >> "$GI"; fi
done < "$ROOT/templates/gitignore.append"
rm -f "$GI.tmp.$$"
echo "[gi]  .gitignore"

# 5) Stack-specific
if [[ "$STACK" == "vite-react" ]]; then
  render "templates/playwright.config.ts.tmpl" "playwright.config.ts"
  render "templates/tests/design.spec.ts.tmpl" "tests/design.spec.ts"

  PKG="$TARGET/package.json"
  if [[ -f "$PKG" ]]; then
    before=$(sha "$PKG")
    json_merge_scripts "$PKG" "$ROOT/templates/package.json.scripts.json"
    after=$(sha "$PKG")
    if [[ "$before" != "$after" ]]; then echo "[pkg] scripts merged"
    else echo "[pkg] scripts already present"; fi
  else
    echo "[warn] package.json missing — skip scripts merge"
  fi
elif [[ "$STACK" == "nextjs" ]]; then
  PKG="$TARGET/package.json"
  if [[ -f "$PKG" ]]; then
    before=$(sha "$PKG")
    json_merge_scripts "$PKG" "$ROOT/templates/package.json.scripts.nextjs.json"
    after=$(sha "$PKG")
    if [[ "$before" != "$after" ]]; then echo "[pkg] scripts merged (nextjs)"
    else echo "[pkg] scripts already present"; fi
  else
    echo "[warn] package.json missing — skip scripts merge"
  fi
  echo "[note] add to app/globals.css:  @import \"./theme.generated.css\";"
  echo "[note] then:  npm run build:design"
fi

# 6) Meta
state_set "__style__" "$STYLE"
state_set "__stack__" "$STACK"

echo
echo "[ok] design harness booted (style=$STYLE, stack=$STACK) → $TARGET"
echo "     verify: node $ROOT/scripts/lint/index.js $TARGET/DESIGN.md"
