# ROADMAP

> Last updated: 2026-07-10
> Status: Agent-Native UI Canvas — AUC0 plan approval 대기
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="agent-native-ui-canvas" status="active" -->
Goal: Agent Design를 code-native UI canvas로 만든다 — evidence-based engine bake-off → canonical canvas → direct manipulation → canvas agent/code round-trip → packaged quality gate. Details: `docs/horizons/2026-07-agent-native-ui-canvas.md`.

## Active Milestones

<!-- harness:milestone id="AUC0" status="active" priority="P0" -->
### AUC0 — Canvas Engine Bake-off
- DoD: DOM/React overlay, DOM+WebGPU overlay, SVG+embedded DOM, CanvasKit/custom WebGPU 4후보를 동일 1k/5k/10k fixture와 성능·fidelity·IME·a11y·recovery·round-trip 기준으로 비교하고, 사용자 선택으로 renderer/engine ADR을 확정.
- Evidence: `docs/plans/2026-07-10-auc0-canvas-engine-bakeoff.md` + `experiments/canvas-engine-*` + comparative report + 후속 ADR.
- Gap: 품질 기준은 높게 확정됐지만 renderer/native 범위를 evidence 없이 선결할 수 없다.
- Status: [ ]

## Next Candidates

<!-- harness:milestone id="AUC1" status="pending" priority="P0" -->
### AUC1 — Canonical Canvas Foundation
- DoD: 채택 엔진 위에 versioned document, code-component layer, stable ID/source mapping, zoom/pan, save/reload, deterministic undo/redo 구현 + fresh-project render/reload 통합 smoke.
- Evidence: `phases/agent-design-canvas-foundation/` + document fixtures + desktop/browser smoke.
- Gap: 정본 document와 실제 canvas runtime이 아직 없다.
- Status: [ ]

<!-- harness:milestone id="AUC2" status="pending" priority="P1" -->
### AUC2 — Direct Manipulation And Property Runtime
- DoD: select/move/resize/reparent/reorder/guides, responsive constraints, typed props/token/mode/variant, Korean text edit + 5k interaction/a11y smoke.
- Evidence: `phases/agent-design-direct-manipulation/` + interaction benchmark + visual smoke.
- Gap: 랜딩 demo 수준 조작을 production canonical operation으로 승격해야 한다.
- Status: [ ]

<!-- harness:milestone id="AUC3" status="pending" priority="P1" -->
### AUC3 — Canvas Agent And Code Round-trip
- DoD: selection-bound agent context → exact diff → guarded apply → shared CLI verify + React code↔canvas 왕복 drift gate.
- Evidence: `phases/agent-design-canvas-agent/` + fresh-project round-trip evidence.
- Gap: 캔버스와 에이전트가 아직 같은 정본 code/document를 편집하지 않는다.
- Status: [ ]

<!-- harness:milestone id="AUC4" status="pending" priority="P2" -->
### AUC4 — Desktop Productization And Quality Gate
- DoD: Windows installer, trusted folder import, sandbox, crash recovery, diagnostics, packaged E2E가 AUC0 quality budget과 security boundary를 통과.
- Evidence: `phases/agent-design-desktop-productization/` + packaged-app E2E/installer/recovery evidence.
- Gap: 검증된 engine을 설치 가능한 신뢰 제품으로 닫아야 한다.
- Status: [ ]

## Archive Pointer

Completed or archived milestone history lives in `BACKLOG.md` (System Content Depth, Agent Design CLI, Docs Article Depth & Page Examples, Content Fill, Structure-First Buildout closed 2026-07-10; Figma Workflow, Figma Bridge, Public Site Shell, System Model Core, Agent Integration closed 2026-07-07).
