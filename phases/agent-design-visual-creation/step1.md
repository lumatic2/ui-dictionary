# Step 1: Canonical Creation Command Layer

## Work
- Add pure, deterministic planners for insert, duplicate, delete, group, align, distribute, and fit-selection.
- Compose existing canonical operations and preserve one logical Undo boundary per user command.

## Acceptance Criteria
```powershell
cd packages/canvas-core; npm test; npm run build
```
- Stable IDs/order, subtree handling, locked-node rejection, inverse operations, validation, and atomic failure pass.

## Guardrails
- No UI-only document mutations or random IDs.
- No general vector/path model expansion.

## Evidence — 2026-07-11
- Atomic batch operation keeps composed commands within one history/Undo boundary.
- Deterministic primitive factory plus delete-subtree, align, and distribute planners implemented; locked commands fail before mutation.
- `npm test` — canvas-core 39/39 PASS; `npm run build` PASS. Implementation: `23d9c2a`.
