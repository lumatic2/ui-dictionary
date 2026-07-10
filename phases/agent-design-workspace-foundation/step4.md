# Step 4: Adaptive Panel Workspace

## Read
- Workspace shell and canvas sizing CSS.
- `CanvasSurface.tsx` focus and pointer behavior.

## Work
- Add collapsible left/right panels, constrained-width behavior, and stable future slots for Layers/Insert and Agent Activity.
- Preserve focus and canvas interaction when panels change.

## Acceptance Criteria
```powershell
cd apps/agent-design; npm test -- --run
```
- Panel toggle, narrow layout, focus restoration, and canvas regression tests pass.

## Guardrails
- No decorative mobile redesign; this remains a desktop production tool.
- Avoid nested-card visual structure and oversized rounded controls.

