#!/usr/bin/env bash
# pre-commit.design — run desing-manual lint on DESIGN.md changes
set -e
if git diff --cached --name-only | grep -q '^DESIGN.md$'; then
  HARNESS="${DESIGN_HARNESS_ROOT:-$HOME/projects/desing-manual}"
  if [[ -f "$HARNESS/scripts/lint/index.js" ]]; then
    node "$HARNESS/scripts/lint/index.js" "./DESIGN.md" || {
      echo "DESIGN.md lint failed. Fix issues or amend." >&2
      exit 1
    }
  fi
fi
