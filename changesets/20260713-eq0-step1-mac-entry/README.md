# 20260713 EQ0 Step 1 Mac Entry

## Target

- ROADMAP milestone: EQ0 - Mac Reproducible Baseline
- Phase: `phases/askewlydesign-mac-baseline/step1.md`

## Scope

- Added root `bootstrap`, `build`, `test:mac`, and `dev:mac` entry commands without changing package-manager topology.
- Added an Apple Silicon Electron runtime check and process-group supervision for the Mac launcher.
- Kept Windows packaging commands separate from the non-packaged Mac development path.

## Verification

- [x] Root helper tests: 8/8.
- [x] `npm run bootstrap` completes the required install/build chain.
- [x] `npm run build` builds every EQ0 package from the root.
- [x] Electron v43.1.0 resolves as arm64 on this Mac.

## Result

- Step 1 complete. Fresh-clone timing and launch evidence are recorded by Step 4.
