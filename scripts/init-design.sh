#!/usr/bin/env bash
# init-design.sh — bootstrap the design layer of a project
# Usage: init-design.sh [target_dir] [--style minimal|editorial|brutalist|glass]
#
# Idempotent: existing files are touched only if their hash matches the previously
# recorded template hash (i.e. user hasn't modified them).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="${1:-$(pwd)}"
STYLE="minimal"
for arg in "$@"; do
  case "$arg" in
    --style=*) STYLE="${arg#--style=}" ;;
    --style)   shift; STYLE="${1:-minimal}" ;;
  esac
done

[[ -d "$TARGET/.git" ]] || { echo "error: $TARGET is not a git repo" >&2; exit 2; }
[[ -f "$ROOT/design-md/$STYLE/DESIGN.md" ]] || { echo "error: unknown style '$STYLE'" >&2; exit 2; }

export PROJECT="$(basename "$TARGET")" STYLE
STATE="$TARGET/.design-harness.json"
[[ -f "$STATE" ]] || echo '{}' > "$STATE"

sha() { sha256sum "$1" | cut -c1-16; }

# render <src-relative-to-ROOT> <dst-relative-to-TARGET>
render() {
  local src="$ROOT/$1" dst="$TARGET/$2" new cur rec
  [[ -f "$src" ]] || { echo "[miss] template $1 not found" >&2; return 1; }
  mkdir -p "$(dirname "$dst")"
  new="$(envsubst < "$src")"
  if [[ -f "$dst" ]]; then
    cur=$(sha "$dst")
    rec=$(jq -r --arg k "$2" '.[$k] // ""' "$STATE")
    if [[ -n "$rec" && "$cur" == "$rec" ]]; then
      printf '%s' "$new" > "$dst"; echo "[upd] $2"
    else
      echo "[skip-user-modified] $2"
      return 0
    fi
  else
    printf '%s' "$new" > "$dst"; echo "[new] $2"
  fi
  local h; h=$(sha "$dst")
  local tmp; tmp=$(mktemp)
  jq --arg k "$2" --arg v "$h" '. + {($k): $v}' "$STATE" > "$tmp"
  mv "$tmp" "$STATE"
}

# 1) Choose template: explicit family if exists, else generic tmpl
if [[ -f "$ROOT/design-md/$STYLE/DESIGN.md" ]]; then
  # copy aesthetic-family file but render envsubst on it (name -> $PROJECT)
  src_rel="design-md/$STYLE/DESIGN.md"
else
  src_rel="templates/DESIGN.md.tmpl"
fi
render "$src_rel" "DESIGN.md"

# 2) Project AI hints
[[ -f "$ROOT/templates/claude-design-section.md.tmpl" ]] && \
  render "templates/claude-design-section.md.tmpl" "docs/CLAUDE-design.md" || true

# 3) Pre-commit lint hook (optional)
HOOK="$TARGET/.git/hooks/pre-commit.design"
cp "$ROOT/templates/hooks/design-lint.sh" "$HOOK" 2>/dev/null && chmod +x "$HOOK" || true

echo
echo "[ok] design harness applied (style=$STYLE) → $TARGET"
echo "    next: edit DESIGN.md sections 1-9, run \`node $ROOT/scripts/lint/index.js $TARGET/DESIGN.md\`"
