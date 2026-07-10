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

