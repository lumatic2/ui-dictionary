# AUC2 Step 4 — Typed Properties And Korean Text

## Outcome

- Added kind-aware schemas and validated operations for props, overrides, variants, tokens, layout, and document token mode.
- Rejected unknown keys, type mismatch, malformed token references, invalid variants, and invalid modes before canonical mutation.
- Added a token-aware property inspector using the existing Askewly design contract.
- Kept contentEditable composition as a DOM-local draft and committed one invertible text operation at composition end.

## Evidence

- `cd packages/canvas-core && npm test && npm run build` — 35/35 tests and build passed.
- `cd apps/agent-design && npm test && npm run build` — 13/13 tests and build passed.
- Synthetic Korean composition proves no intermediate revision, one final operation, and undo restoration.
- Code commit: `18fc9d6`.

## Residual Live Check

Step 5 will distinguish actual Chrome Korean text entry from a genuine OS-level Microsoft IME manual composition pass; it will not report synthetic evidence as the latter.
