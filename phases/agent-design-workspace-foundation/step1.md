# Step 1: Workspace Shell And Visual Hierarchy

## Read
- `apps/agent-design/src/App.tsx`, `styles.css`, `DESIGN.md`.
- Existing renderer tests and AUC4 packaged evidence.

## Work
- Build the product title bar, global toolbar, workspace rail, canvas stage, inspector, and status surface.
- Move benchmark/fixture controls to a secondary diagnostics surface.

## Acceptance Criteria
```powershell
cd apps/agent-design; npm test -- --run
```
- Automated landmark/order assertions identify one coherent editing workspace.
- Existing canvas and inspector behavior remains available.

## Guardrails
- Do not redesign canonical operations or Electron authority.
- Do not claim UX improvement from colors alone.

