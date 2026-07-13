# 20260713 EQ0 Step 4 Fresh-Clone Evidence

## Target

- ROADMAP milestone: EQ0 - Mac Reproducible Baseline
- Phase: `phases/askewlydesign-mac-baseline/step4.md`

## Scope

- Record a fresh-clone-equivalent Apple Silicon bootstrap and complete Mac test matrix at the tested implementation commit.
- Prove the production browser entry is empty and contains no implicit canvas, benchmark global, or stuck loading state.
- Preserve the explicit 5,000-node benchmark report and representative screenshots, including the unresolved pointer-latency debt.
- Exercise two sequential Electron development launches and verify clean shutdown with no clone-attributable orphan processes.
- Keep the Windows package gate explicitly not run pending Windows review.

## Verification

- [x] Fresh clone `npm run bootstrap:mac` passed in 129.82 seconds.
- [x] Fresh clone `npm run test:mac` passed 297/297 in 291.12 seconds.
- [x] Exclusive system-Chrome workflow completed at 5,000 nodes with no console errors; over-budget latency is recorded as an EQ1 limitation, not relabeled as a performance pass.
- [x] Two `npm run dev:mac` launch/shutdown cycles reached Electron readiness and left zero orphan processes.

The historical `validate:integration` gate remains red on the accepted report because all three 5k p95 traces exceed 16 ms and the reload screenshot has a 0.000003271 mismatch ratio. EQ0 records this signal; EQ1 owns the renderer and interaction remediation.

## Result

- Step 4 and EQ0 are complete. The Mac baseline is reproducible, production and benchmark entry paths are distinct, and the 5k latency limitation is routed honestly to EQ1.
