# AUC1 Integrated Canvas Foundation

Date: 2026-07-10
Milestone: AUC1 Step 5

## Outcome

- Checksum-protected snapshot contains the valid base document plus active operation log.
- Reload rebuilds history deterministically and preserves post-reload undo/redo.
- Browser adapter proves the contract without deciding Electron main versus Node sidecar.
- Structural-sharing viewport/selection operations and persistent WebGPU buffers keep 5k interaction within budget.

## Verification

- [x] canvas core build + 18/18 tests
- [x] Agent Design build + 8/8 tests
- [x] 5k WebGPU trace p95 `[9.3, 8.4, 8.5]ms` across three final-gate runs
- [x] 5k node/source mapping counts `5000/250`
- [x] save → reload revision `3`, undo `2`, redo `3`
- [x] reload canvas pixel diff `0`
- [x] system Chrome automated console errors `0`
- [x] actual Chrome UI flow: WebGPU active, revision/selection recovery, errors/warnings `0`

## Evidence

- `apps/agent-design/results/integration-results.json`
- `apps/agent-design/results/screenshots/5k-webgpu.png`
- `apps/agent-design/results/screenshots/before-reload.png`
- `apps/agent-design/results/screenshots/after-reload.png`
- `apps/agent-design/results/screenshots/reload-diff.png`

## Residual gates

- The synthetic Korean composition contract is not an OS-level Microsoft IME manual pass; that remains AUC2.
- Browser local storage is only a contract adapter. Atomic filesystem saves and crash recovery belong to the eventual desktop host.
- Packaged GPU compatibility and real device loss remain AUC4.
