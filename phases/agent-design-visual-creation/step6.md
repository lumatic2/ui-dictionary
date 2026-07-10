# Step 6: Representative Composition Quality Proof

## Work
- Complete a fresh-project insert→layers→arrange→properties→keyboard→Undo/reload→source continuity workflow.

## Acceptance Criteria
```powershell
cd packages/canvas-core; npm test; npm run build
cd ../../apps/agent-design; npm test -- --run; npm run build
cd ../agent-design-desktop; npm test; npm run verify:package; npm run verify:packaged-evidence
```
- Creation E2E, 5k performance, a11y, packaged security/recovery, and fresh Chrome visual evidence pass.

## Guardrails
- Dev-server screenshots do not replace packaged evidence.
- Existing IME waiver remains a waiver, not a pass.
