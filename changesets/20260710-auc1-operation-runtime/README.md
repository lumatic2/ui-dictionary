# AUC1 Deterministic Operation Runtime

Date: 2026-07-10
Milestone: AUC1 Step 2

## Contract

- Pure create/delete/update/reparent/reorder/select/viewport reducer.
- Invalid operations leave the input document untouched.
- Snapshot undo/redo plus invertible operations.
- Canonical key ordering and deterministic operation replay.
- 1k-operation recovery fixture.

## Verification

- [x] core build
- [x] all document and operation tests (12/12)
- [x] byte-identical replay
- [x] inverse + undo/redo
- [x] invalid operation rejection
- [x] 1k-operation recovery (batch replay 441ms test suite segment)
