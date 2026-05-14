#!/usr/bin/env bash
# propagate.sh — propagate template updates into a previously-initialized target
# Usage: propagate.sh [target_dir]
#
# Iterates every entry in <target>/.design-harness.json. If the file's current
# hash matches the recorded hash (= user hasn't edited it), re-render from the
# matching template. Otherwise skip and warn.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="${1:-$(pwd)}"
STATE="$TARGET/.design-harness.json"
[[ -f "$STATE" ]] || { echo "error: no .design-harness.json in $TARGET" >&2; exit 2; }

export PROJECT="$(basename "$TARGET")"
# style is recovered from .design-harness.json meta (if absent, prompt)
STYLE=$(jq -r '.["__style__"] // "minimal"' "$STATE")
export STYLE

sha() { sha256sum "$1" | cut -c1-16; }

jq -r 'to_entries[] | select(.key | startswith("__") | not) | .key' "$STATE" |
while read -r dst_rel; do
  dst="$TARGET/$dst_rel"
  [[ -f "$dst" ]] || { echo "[gone] $dst_rel"; continue; }
  rec=$(jq -r --arg k "$dst_rel" '.[$k]' "$STATE")
  cur=$(sha "$dst")
  if [[ "$cur" != "$rec" ]]; then
    echo "[skip-user-modified] $dst_rel"
    continue
  fi
  # locate template source — convention: DESIGN.md ← design-md/<style>/DESIGN.md, else templates/<dst>.tmpl
  if [[ "$dst_rel" == "DESIGN.md" && -f "$ROOT/design-md/$STYLE/DESIGN.md" ]]; then
    src="$ROOT/design-md/$STYLE/DESIGN.md"
  elif [[ -f "$ROOT/templates/$dst_rel.tmpl" ]]; then
    src="$ROOT/templates/$dst_rel.tmpl"
  else
    echo "[no-template] $dst_rel"
    continue
  fi
  envsubst < "$src" > "$dst"
  new=$(sha "$dst")
  tmp=$(mktemp); jq --arg k "$dst_rel" --arg v "$new" '.[$k]=$v' "$STATE" > "$tmp"; mv "$tmp" "$STATE"
  echo "[upd] $dst_rel"
done

echo "[ok] propagate complete"
