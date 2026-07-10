# AUC0 Engine Topology Decision

Date: 2026-07-10
Milestone: AUC0

## Outcome

The user accepted the layered renderer topology recommended by the AUC0 bake-off: React DOM production content, WebGPU editor plane with DOM fallback, SVG vector islands, and threshold-triggered native/Wasm hot paths.

## Verification

- [x] ADR 0006 records the accepted user decision and evidence.
- [x] AUC0 plan Step 6 is complete.
- [x] Architecture and horizon no longer describe renderer selection as open.
- [x] Benchmark build and 12-cell result validation pass.
- [x] Three ordered harness ledger events exist for AUC0.
- [x] `.harness/work.json` records AUC0 completed.
- [x] ROADMAP/BACKLOG preserve the completed milestone and point to AUC1 planning.

## Residual gates

- OS-level Korean IME, WebGPU device-loss recovery, and packaged Windows GPU compatibility remain AUC2/AUC4 acceptance work.
- Electron main versus supervised Node sidecar remains an evidence-based lifecycle decision, not part of the renderer ADR.
