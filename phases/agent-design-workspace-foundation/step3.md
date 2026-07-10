# Step 3: Persistent Toolbar And Document Status

## Read
- `apps/agent-design/src/App.tsx`, `CanvasSurface.tsx`, `desktopHost.ts`.
- Canvas operation and bridge status contracts.

## Work
- Group Undo/Redo, viewport, preview, save/recovery, bridge status, and project identity into persistent controls.
- Add accessible labels, shortcuts, tooltips, disabled states, and non-color-only statuses.

## Acceptance Criteria
```powershell
cd apps/agent-design; npm test -- --run
```
- Toolbar order, accessible names, disabled states, and operation dispatch pass component tests.

## Guardrails
- Do not expose benchmark metrics as primary product status.
- Do not introduce silent autosave/recovery claims unsupported by the host.

