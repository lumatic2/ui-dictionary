# Step 5: Integrated Workspace Quality Proof

## Read
- UX1 steps 1–4.
- AUC4 packaged E2E and security evidence scripts.

## Work
- Verify project entry, edit, preview, terminal round-trip, recovery, and adaptive layout in the new shell.
- Capture desktop and constrained-width screenshots plus keyboard/a11y evidence.

## Acceptance Criteria
```powershell
cd apps/agent-design; npm test -- --run; npm run build
cd ../agent-design-desktop; npm test; npm run verify:package; npm run verify:packaged-evidence
```
- Fresh Chrome visual checks show the same coherent workspace at target widths.
- Existing security, latency, restart, and package gates remain passing.

## Guardrails
- Do not substitute dev-server screenshots for packaged evidence.
- The prior Microsoft IME waiver remains an explicit waiver, not a pass.

