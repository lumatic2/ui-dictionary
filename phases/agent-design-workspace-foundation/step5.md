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

## Evidence — 2026-07-11
- Renderer 19/19, renderer production build, desktop 42/42, package 5 artifacts/5 resources/9 fuses, and packaged evidence PASS.
- Fresh system Chrome: Agent Design title, expected workspace landmarks, 2560px viewport, zero horizontal overflow; visual screenshot inspected.
- Packaged performance remains 5k p95 11.5ms, restart drift 0, watcher 130.2ms; IME remains explicitly user-waived.
