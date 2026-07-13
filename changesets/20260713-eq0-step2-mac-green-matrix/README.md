# 20260713 EQ0 Step 2 Mac Green Matrix

## Target

- ROADMAP milestone: EQ0 - Mac Reproducible Baseline
- Phase: `phases/askewlydesign-mac-baseline/step2.md`

## Scope

- Isolated renderer test files and disabled Node experimental web storage for deterministic jsdom behavior.
- Stabilized the source-watcher readiness test without increasing its event deadline.
- Canonicalized macOS temporary fixture roots and made Windows Squirrel path parsing host-independent with `node:path.win32`.

## Verification

- [x] Renderer: 84/84.
- [x] Bridge: 46/46, including watcher tests.
- [x] Desktop: 56/56 on macOS.
- [x] Root `npm run test:mac`: 297/297 across the EQ0 matrix.

## Result

- Step 2 complete. The supported Mac gate is green without excluding Windows-specific contract tests.
