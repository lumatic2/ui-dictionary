# AUC1 Semantic DOM Content Plane

Date: 2026-07-10
Milestone: AUC1 Step 3

## Contract

- `apps/agent-design` consumes `@askewly/canvas-core` without duplicating document rules.
- Every canonical node maps to a semantic DOM element with `data-canvas-id`.
- Code source mappings, focusable code/instance/text surfaces, and Korean composition are preserved.
- Editor selection remains outside project content DOM.

## Verification

- [x] install/build
- [x] 1k/5k DOM mapping tests
- [x] source mapping count (50/250)
- [x] Korean composition event
- [x] focusable surface count (5k: 1,135)
- [x] actual Chrome screenshot and console smoke (0 errors/warnings)
