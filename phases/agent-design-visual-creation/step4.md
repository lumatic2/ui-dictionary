# Step 4: Layout And Arrangement Controls

## Work
- Expose align, distribute, tidy gap, group/ungroup, layout mode, padding/gap, and sizing commands.

## Acceptance Criteria
```powershell
cd packages/canvas-core; npm test
cd ../../apps/agent-design; npm test -- --run
```
- Exact bounds, responsive constraints, mixed/locked selection, disabled states, and one-command history pass.

## Guardrails
- Do not flatten responsive constraints into absolute positioning silently.
- Multi-node commands must be atomic.

