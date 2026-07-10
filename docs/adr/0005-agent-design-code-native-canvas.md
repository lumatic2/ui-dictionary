# ADR 0005 — Agent Design는 코드 네이티브 UI 캔버스이며 엔진은 benchmark로 선택한다

Date: 2026-07-10
Status: accepted

## Context

ADR 0004는 CLI를 앱보다 먼저 만들고 후속 앱이 CLI/core를 재사용하도록 정했다. 이후 사용자와 앱 정체성을 다시 확인한 결과, 목표는 단순한 프로젝트 진단 GUI가 아니라 기존 랜딩 데모가 예고한 **"에이전트 패널 달린 Figma"**, 즉 실제 UI code를 시각적으로 직접 조작하는 Agent Design 캔버스임이 확정됐다.

Figma와 OpenDesign 기술 분석은 서로 다른 구조를 드러냈다.

- Figma: C++/Wasm/WebGPU scenegraph, Electron, React code layers, derived-property/component/parameter runtime.
- OpenDesign: Electron + Next.js + Node daemon + SQLite/chokidar/agent adapters, sandboxed iframe와 DOM/source patch 편집.

Figma의 GPU 엔진을 그대로 복제하면 code-native UI의 DOM/CSS/접근성과 이중 구현 위험이 생기고, OpenDesign의 iframe/source patch만 채택하면 canonical canvas document가 없는 preview editor에 머문다. 반대로 품질 목표를 이유로 native/GPU/vector 가능성을 영구 배제하는 것도 근거가 없다.

## Decision

1. Agent Design의 제품 정체성은 **agent-native, code-native UI canvas**다.
2. 정본은 renderer와 독립적인 versioned canvas document/scenegraph다. React code component는 이 document의 1급 layer다.
3. 첫 milestone `AUC0 Canvas Engine Bake-off`에서 네 후보를 동일 fixture로 비교한다: DOM/React+overlay, DOM+WebGPU overlay, SVG+embedded DOM, CanvasKit/custom WebGPU.
4. 평가 기준은 1k/5k/10k layer FPS·pointer latency·Korean IME·responsive/instance/variant·browser pixel diff·memory/recovery·accessibility·source round-trip이다.
5. C++/Rust/Wasm/native는 영구 제외하지 않는다. benchmark가 증명한 hot path만 단계적으로 내린다.
6. renderer 선택 전 product engine 구현을 시작하지 않는다. AUC0 결과 ADR이 AUC1의 구현 gate다.

## Consequences

- 높은 품질은 기술 이름이 아니라 재현 가능한 성능·정확성·접근성·왕복 증거로 판정한다.
- v1이 general vector suite로 팽창하는 것은 막되, SVG/vector layer와 WebGPU/native acceleration을 확장 가능한 경계로 보존한다.
- CLI/core를 renderer에 복제하지 않고 local engine contract로 공유한다.
- AUC0는 탐색적이므로 각 후보를 독립 experiment로 기록하고, 최종 비교가 다음 구현 stack을 확정한다.

## Evidence

- `references/figma-product-architecture/ANALYSIS.md`
- `references/nexu-io-open-design/ANALYSIS.md`
- `docs/market/2026-07-10-agent-design-desktop-reverse-engineering.md`
