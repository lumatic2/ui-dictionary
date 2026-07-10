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

## Evidence — 2026-07-11

- `npm test -- --run` — 18/18 renderer tests passed, including workspace landmark/order coverage.
- `npm run build` — TypeScript and Vite production build passed.
- Fresh system Chrome verified the product title bar, workspace toolbar, left rail, canvas stage, inspector, bottom status surface, and collapsed Development controls in one viewport.
- Implementation commit: `54fa4ef`.
