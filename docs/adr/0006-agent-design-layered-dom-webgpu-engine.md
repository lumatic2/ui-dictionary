# ADR 0006 — Agent Design는 계층형 DOM + WebGPU 캔버스 엔진을 사용한다

Date: 2026-07-10
Status: accepted

## Context

ADR 0005는 renderer-independent canonical document를 정하고 production canvas 구현 전에 네 후보를 동일 fixture로 비교하도록 요구했다. AUC0는 DOM/React+DOM overlay, DOM/React+WebGPU overlay, SVG+embedded DOM, custom WebGPU를 1k/5k/10k canonical scene에서 측정했다.

네 후보 모두 5k interaction p95 16ms 예산을 통과했지만 fidelity와 ownership cost는 달랐다. DOM은 production React semantics와 focus surface를 보존했다. SVG는 DOM baseline과 픽셀이 가까웠지만 component semantics가 거의 사라졌다. Full WebGPU는 10k initial draw 잠재력을 보였지만 text, layout, native controls, accessibility를 별도 엔진으로 재구현해야 했다. DOM+WebGPU는 DOM fidelity를 유지하면서 editor 전용 GPU plane을 분리했다.

사용자는 2026-07-10 AUC0 비교 보고서를 검토하고 추천한 계층형 DOM + WebGPU topology를 확정했다.

## Decision

1. **Canonical document:** renderer-independent versioned document가 stable ID, hierarchy, component/instance, typed props, responsive constraints, tokens, variants, source mapping을 소유한다.
2. **Production content plane:** 실제 React/HTML/CSS는 semantic DOM으로 렌더한다. 브라우저 layout, text shaping, input/IME, native controls, accessibility tree를 재구현하지 않는다.
3. **Editor plane:** selection, guides, multiplayer cursors, minimap, dense transient geometry처럼 project content와 독립적인 editor visuals는 WebGPU를 우선 사용한다. WebGPU unavailable/device-loss 시 DOM overlay fallback을 필수로 유지한다.
4. **Vector islands:** SVG/path tooling은 icon, Bezier/path editing, vector export처럼 vector 정밀도가 필요한 격리된 surface에 사용하며 전체 component tree renderer가 되지 않는다.
5. **Native/Wasm seam:** geometry indexing, hit testing, operation compaction, display-list preparation을 portable engine boundary 뒤에 둔다. TypeScript로 시작하고 대표 desktop trace가 5k에서 p95 16ms를 3회 초과하거나 virtualization/isolation 후에도 main-thread work가 8ms/frame을 넘을 때 Rust/C++/Wasm 승격을 검토한다.
6. **Full custom renderer:** DOM content 자체가 위 기준을 지속적으로 실패하고 팀이 text shaping, accessibility, native-control fidelity, recovery ownership을 명시적으로 수용할 때만 재검토한다.
7. Electron main 대 supervised Node sidecar lifecycle은 이번 renderer 결정에 포함하지 않는다. typed host authority와 sandbox boundary를 유지한 채 AUC1/AUC4의 실제 filesystem, watcher, crash-recovery evidence로 결정한다.

## Consequences

- AUC1은 DOM content plane과 WebGPU editor plane을 분리한 contract로 구현할 수 있다.
- WebGPU는 품질 표식이 아니라 제한된 acceleration layer다. GPU failure가 document editing이나 save/recovery를 막아서는 안 된다.
- C++/Rust/Wasm은 제외되지 않지만 측정된 hot path와 재현 가능한 threshold 없이 도입하지 않는다.
- SVG와 custom WebGPU experiment는 탈락 산출물이 아니라 vector/native 확장 seam의 회귀 fixture로 유지한다.
- OS-level Korean IME, device-loss recovery, packaged GPU compatibility는 후속 desktop acceptance gate로 남는다.

## Evidence

- `docs/research/canvas-engine-bakeoff-2026-07.md`
- `experiments/canvas-engine-bakeoff/results/benchmark-results.json`
- `experiments/canvas-engine-bakeoff/results/pixel-diff.json`
- `experiments/canvas-engine-dom/README.md`
- `experiments/canvas-engine-dom-webgpu/README.md`
- `experiments/canvas-engine-svg/README.md`
- `experiments/canvas-engine-webgpu/README.md`
