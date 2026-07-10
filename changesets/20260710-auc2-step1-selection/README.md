# AUC2 Step 1 — Accessible Selection

## Outcome

- Added deterministic hierarchy paint order, point hit-test, marquee hit-test, selection reduction, traversal, and multi-selection bounds to `@askewly/canvas-core`.
- Connected DOM stable IDs to canonical `select-nodes` operations for click, Shift multi-select, marquee, Escape clear, and arrow traversal.
- Derived editor bounds, focus, `aria-selected`, and visual state from canonical selection.

## Evidence

- `cd packages/canvas-core && npm test && npm run build` — 22/22 tests passed and TypeScript build passed.
- `cd apps/agent-design && npm test && npm run build` — 9/9 tests passed and Vite production build passed.
- Code commit: `51b206b`.

## Next

Step 2 adds pointer-captured move/resize preview and commits exactly one invertible operation per gesture.
