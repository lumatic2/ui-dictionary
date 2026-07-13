# 20260713 EQ0 Step 3 Production Fixture Separation

## Target

- ROADMAP milestone: EQ0 - Mac Reproducible Baseline
- Phase: `phases/askewlydesign-mac-baseline/step3.md`

## Scope

- Production now starts with an honest trusted-project entry state and never creates the 1k/5k fixture implicitly.
- `?benchmark=1` and desktop `--benchmark=1` are the explicit diagnostic entry contracts; browser and packaged integration scripts use them directly.
- Benchmark persistence uses an in-memory store and makes zero desktop-host calls.
- Desktop mutations require an exact active-project/bridge-project ID match. Project switches clear the old canvas, stale async responses are rejected, and snapshot failures expose retryable errors.
- In this step, `new` means a local React folder newly added to the trusted registry through **Open project**. Creating or scaffolding a new React codebase is intentionally outside EQ0.
- Unit editor workflows use a 200-node injected benchmark fixture for deterministic speed; the default and integration benchmark remain 1,000 nodes.

## Verification

- [x] Renderer full suite: 84/84.
- [x] Project authority regression: 2/2.
- [x] Renderer build and integration script syntax checks pass.
- [x] Root `npm run test:mac`: 297/297.

## Result

- Step 3 complete. Production content cannot be confused with fixtures, and project transitions fail closed.
