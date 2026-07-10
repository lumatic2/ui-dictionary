# Canvas Engine Bake-off — 2026-07

Status: comparative report complete; engine decision pending user gate.

## Decision question

Agent Design의 code-native UI canvas에서 production content, editor overlay, vector geometry, native/Wasm hot path를 각각 어떤 renderer가 소유해야 하는가?

## Shared contract

- Canonical fixture: deterministic 1k/5k/10k component/instance/group/frame/card/text/button nodes.
- Preserved data: stable ID, hierarchy, component reference, typed variant props, responsive mode, token binding, source reference.
- Trace: 90-frame pan/zoom + 90-frame selection mutation.
- Correctness: full JSON value round-trip, operation-log replay, source mapping count, synthetic Korean composition, semantic/focus coverage.
- Runtime: Windows 10/11, system Headless Chrome 149, 1440x900@1x. Actual Chrome separately confirmed WebGPU adapter, validation, and visible instanced draw.
- Evidence: [raw benchmark](../../experiments/canvas-engine-bakeoff/results/benchmark-results.json), [pixel diff](../../experiments/canvas-engine-bakeoff/results/pixel-diff.json), [screenshots](../../experiments/canvas-engine-bakeoff/results/screenshots/).

## Results

| Candidate | 5k pan p95 | 10k initial render | Semantic / focusable at 10k | DOM pixel mismatch at 1k | Main finding |
|---|---:|---:|---:|---:|---|
| DOM/React + DOM overlay | 8.5ms | 218.4ms | 10,001 / 1,285 | baseline | Best code/browser fidelity |
| DOM/React + WebGPU overlay | 8.4ms | 183.5ms | 10,001 / 1,285 | 1.92% | Fidelity kept; simple trace showed no p95 gain |
| SVG + embedded DOM | 8.5ms | 222.2ms | 2 / 1 | 0.86% | Vector fidelity, weak UI semantics |
| Custom WebGPU | 8.5ms | 65.0ms | 3 / 2 | 16.40% | Fast geometry, large fidelity rebuild cost |

All 12 cells passed the `≤16ms` 1k/5k interaction budget, full canonical round-trip, operation replay, source mapping, and synthetic Korean composition. Initial-render and heap values are single-run indicators affected by warm-up and allocation history; they are not confidence intervals.

## Correctness and risk

- DOM is the only candidate that naturally preserves production React layout, browser text/input behavior, and full semantic/focus surface.
- WebGPU overlay preserved DOM semantics and rendered correctly after a real WGSL alignment defect was caught by visible Chrome verification plus validation scopes. This confirms both its value and its added failure surface.
- SVG matched pixels closely but collapsed the component tree into one graphic semantic surface plus one embedded input.
- Full WebGPU omitted browser text, borders, controls, and per-node accessibility. Closing 16.4% pixel mismatch would require a text/layout/control engine, not cosmetic tuning.
- The Korean result is synthetic composition-event preservation plus visible Korean input in Chrome, not an OS-level Microsoft IME manual pass. That remains a desktop acceptance gate.
- No untrusted project code ran in this experiment. Renderer choice does not replace AUC1's isolated preview/host-authority boundary.

## Recommendation for user decision

Adopt a layered topology:

1. **Production content:** React DOM, backed by renderer-independent canonical document and stable source mappings.
2. **Editor plane:** WebGPU for guides, selection, multiplayer cursors, minimap, dense transient geometry; DOM fallback remains mandatory.
3. **Vector islands:** SVG/path tooling for icons, Bezier/path editing, and export—not the whole component tree.
4. **Native/Wasm seam:** keep geometry indexing, hit testing, operation compaction, and display-list preparation behind a portable boundary. Start in TypeScript; move a hot path to Rust/Wasm or C++/Wasm only when a representative desktop trace exceeds p95 `16ms` at 5k in three repeat runs, or main-thread work exceeds `8ms/frame` after virtualization/isolation.
5. **Full custom renderer:** reconsider only if DOM content itself—not overlays or indexing—fails the budget and the team accepts owning text shaping, accessibility, native-control fidelity, and platform recovery.

This is not a permanent exclusion of C++/WebGPU/vector. It is a narrow adoption rule: use each where the bake-off showed leverage, and require a measured threshold before taking on a second browser engine.

## Gate

The comparative work is complete. AUC0 remains active until the user chooses the renderer topology. After selection, record it in a follow-up ADR and only then close the harness milestone.
