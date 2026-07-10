# Horizon - Agent-Native UI Canvas

Date: 2026-07-10
Status: active — AUC0 complete; AUC1 Canonical Canvas Foundation plan awaits user approval.

## Goal

Agent Design를 사람이 실제 React UI를 시각적으로 구성·직접 조작하고, 선택 영역에 결합된 에이전트와 함께 production code로 왕복하는 고품질 데스크톱 캔버스로 만든다. 기술 prestige가 아니라 동일 fixture의 성능·정확성·접근성·code round-trip 증거로 캔버스 엔진을 선택하고, 그 정본 document 위에 조작·에이전트·패키징을 단계적으로 쌓는다.

## Why Now

직전 System Content Depth horizon이 Principles 8개와 recipes 13종/pattern_group 10종을 채워 앱이 소비할 실제 콘텐츠를 마련했다. 기존 CLI는 조회·주입·검증 엔진을 제공하지만, 제품 비전인 "에이전트 패널 달린 Figma"는 아직 랜딩의 축소 데모뿐이다.

Figma/OpenDesign 역설계 결과, Figma의 C++/Wasm/WebGPU scenegraph를 그대로 복제하거나 OpenDesign의 iframe/source-patch editor를 그대로 가져오는 양극단 모두 우리 목표와 맞지 않는다. 높은 품질을 보장하려면 renderer를 선결하지 않고 engine bake-off부터 해야 한다.

## Confirmed Decisions

- 제품 정체성: agent-native, code-native UI canvas (사용자 확정 2026-07-10).
- 품질 전략: C++/WebGPU/vector를 영구 제외하지 않고, shared benchmark로 채택 범위와 native/Wasm hot path를 결정한다 (사용자 확정 2026-07-10).
- 정본 경계: renderer-independent canonical canvas document/scenegraph.
- 범위 경계: UI composition/editor가 v1이며 general vector illustration·multiplayer cloud editor·general chat은 제외.
- 선행 계약: ADR 0005. AUC0 결과의 후속 renderer ADR 없이는 AUC1 구현 금지.
- 엔진 topology: production content=semantic DOM, editor plane=WebGPU+DOM fallback, vector islands=SVG, native/Wasm=측정 임계치 기반 hot path (사용자 확정, ADR 0006).

## Milestones

### AUC0 - Canvas Engine Bake-off — completed

DoD: 동일한 representative UI fixture와 benchmark runner로 ① DOM/React+editor overlay ② DOM+WebGPU overlay ③ SVG+embedded DOM ④ CanvasKit/custom WebGPU 후보를 비교한다. 각 후보는 1k/5k/10k layer pan/zoom·drag/resize pointer latency·Korean IME·responsive frame·nested component/variant·browser screenshot diff·memory/recovery·accessibility·source round-trip 결과를 남긴다. 최종 comparative report가 후보별 fit/non-fit과 native/Wasm hot-path threshold를 제시하고, 사용자 선택으로 renderer/engine topology ADR을 확정한다.

Evidence: `docs/plans/2026-07-10-auc0-canvas-engine-bakeoff.md` + `experiments/canvas-engine-*` + `docs/research/canvas-engine-bakeoff-2026-07.md` + `docs/adr/0006-agent-design-layered-dom-webgpu-engine.md`.

### AUC1 - Canonical Canvas Foundation — active (planning gate)

DoD: AUC0 채택 엔진 위에 versioned canvas document, frame/code-component/text/group/instance node, stable ID/source mapping, zoom/pan, save/reload, deterministic undo/redo를 구현한다. fresh project에서 document→render→reload가 구조·픽셀 gate를 통과한다.

Evidence: `phases/agent-design-canvas-foundation/` + canvas document fixtures + real desktop/browser smoke.

### AUC2 - Direct Manipulation And Property Runtime — pending

DoD: select/multi-select, move, resize, reparent, reorder, align/guides, responsive constraints, typed props, token binding, mode/variant, Korean text edit가 canonical operations로 동작한다. 5k-layer interaction budget과 keyboard/accessibility smoke를 통과한다.

Evidence: `phases/agent-design-direct-manipulation/` + interaction benchmark + desktop visual smoke.

### AUC3 - Canvas Agent And Code Round-trip — pending

DoD: 선택된 canvas node/project context가 DESIGN.md·tokens·recipes·checks와 함께 agent에 전달되고, 제안 변경은 exact diff → 사용자 apply → shared CLI/core verify로 닫힌다. React code→canvas→agent revision→code/browser 왕복에서 structure/pixel drift가 허용 기준 이내다.

Evidence: `phases/agent-design-canvas-agent/` + fresh-project round-trip artifacts + failure-mode evidence.

### AUC4 - Desktop Productization And Quality Gate — pending

DoD: Windows installer, trusted folder import, sandboxed project preview, crash/autosave recovery, update/diagnostics boundary, representative end-to-end flow를 검증한다. renderer에 Node/Electron authority가 노출되지 않고 AUC0 성능 budget을 packaged build에서도 유지한다.

Evidence: `phases/agent-design-desktop-productization/` + packaged-app E2E + installer/recovery/security evidence.

## Close Criteria

Windows packaged Agent Design에서 fresh React project를 열거나 만들고 → canvas에서 실제 UI를 구성·직접 조작하고 → 선택-bound agent로 수정하고 → exact diff를 검토·적용하고 → browser verification까지 닫는 흐름이 동작한다. canonical document/code mapping, quality budgets, accessibility, recovery, CLI/core parity가 모두 evidence로 남아야 한다.

## Scope Exclusions

- arbitrary pen/path/vector illustration suite;
- multiplayer/cloud teams/comments/version history;
- account/payment/Pro enforcement;
- slides/video/image general artifact generation;
- ADR 0006 threshold를 통과하지 않은 full custom content renderer 도입.

## Backlinks

- Objective: `docs/OBJECTIVE.md`
- Gap: `docs/roadmap-gap-2026-07-10-e.md`
- CLI-first boundary: `docs/adr/0004-agent-design-cli.md`
- Canvas/benchmark decision: `docs/adr/0005-agent-design-code-native-canvas.md`
- Layered renderer decision: `docs/adr/0006-agent-design-layered-dom-webgpu-engine.md`
- Technology evidence: `references/figma-product-architecture/ANALYSIS.md`, `references/nexu-io-open-design/ANALYSIS.md`
- Market synthesis: `docs/market/2026-07-10-agent-design-desktop-reverse-engineering.md`
