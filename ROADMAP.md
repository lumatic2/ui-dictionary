# ROADMAP

> Last updated: 2026-07-10
> Status: Agent-Native UI Canvas — AUC3 complete; AUC4 pending planning gate
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="agent-native-ui-canvas" status="active" -->
Goal: Agent Design를 code-native UI canvas로 만든다 — evidence-based engine bake-off → canonical canvas → direct manipulation → canvas agent/code round-trip → packaged quality gate. Details: `docs/horizons/2026-07-agent-native-ui-canvas.md`.

## Active Milestones

<!-- harness:milestone id="AUC3" status="completed" priority="P1" evidence="changesets/20260710-auc3-step5-dual-cli-proof/README.md" -->
### AUC3 — Terminal Agent Live Canvas Round-trip
- DoD: user-owned Codex/Claude terminal → shared local bridge/MCP → atomic auto-apply → WebSocket canvas redraw + source watcher reverse sync + React code↔canvas drift gate.
- Evidence: changesets/20260710-auc3-step5-dual-cli-proof/README.md
- Gap: 캔버스와 에이전트가 아직 같은 정본 code/document를 편집하지 않는다.
- Status: [x]

- Completed at: 2026-07-10
- Summary: Terminal-owned Codex and Claude now share a guarded local bridge/MCP authority with atomic operations/source patches, audit/Undo, WebSocket canvas updates, watcher reverse sync, real CLI context smoke, and fresh Chrome/roundtrip evidence.
<!-- harness:milestone id="AUC2" status="completed" priority="P1" evidence="phases/agent-design-direct-manipulation/" -->
### AUC2 — Direct Manipulation And Property Runtime
- DoD: select/move/resize/reparent/reorder/guides, responsive constraints, typed props/token/mode/variant, Korean text edit + 5k interaction/a11y smoke.
- Evidence: phases/agent-design-direct-manipulation/
- Gap: AUC1 정본은 렌더·저장되지만 사람이 production operation으로 직접 조작하거나 properties를 편집할 수 없다.
- Status: [x]

- Completed at: 2026-07-10
- Summary: direct manipulation, responsive structure, typed properties, Korean text runtime, and 5k system-Chrome quality gates complete; OS Microsoft IME manual pass waived by user
<!-- harness:milestone id="AUC1" status="completed" priority="P0" evidence="docs/plans/2026-07-10-auc1-canonical-canvas-foundation.md" -->
### AUC1 — Canonical Canvas Foundation
- DoD: 채택 엔진 위에 versioned document, code-component layer, stable ID/source mapping, zoom/pan, save/reload, deterministic undo/redo 구현 + fresh-project render/reload 통합 smoke.
- Evidence: docs/plans/2026-07-10-auc1-canonical-canvas-foundation.md
- Gap: resolved — canonical document/runtime, DOM/WebGPU planes, persistence proof 완료.
- Status: [x]

- Completed at: 2026-07-10
- Summary: canonical document/operations/DOM+WebGPU/persistence 구현, 5k p95 3회와 reload pixel 0 검증
<!-- harness:milestone id="AUC0" status="completed" priority="P0" evidence="docs/adr/0006-agent-design-layered-dom-webgpu-engine.md" -->
### AUC0 — Canvas Engine Bake-off
- DoD: DOM/React overlay, DOM+WebGPU overlay, SVG+embedded DOM, CanvasKit/custom WebGPU 4후보를 동일 1k/5k/10k fixture와 성능·fidelity·IME·a11y·recovery·round-trip 기준으로 비교하고, 사용자 선택으로 renderer/engine ADR을 확정.
- Evidence: docs/adr/0006-agent-design-layered-dom-webgpu-engine.md
- Gap: resolved — 사용자 topology 확정과 ADR 0006 기록 완료.
- Status: [x]

- Completed at: 2026-07-10
- Summary: 4개 엔진 후보 실측 후 계층형 DOM + WebGPU topology 사용자 확정
## Next Candidates

<!-- harness:milestone id="AUC4" status="pending" priority="P2" -->
### AUC4 — Desktop Productization And Quality Gate
- DoD: Windows installer, trusted folder import, sandbox, crash recovery, diagnostics, packaged E2E가 AUC0 quality budget과 security boundary를 통과.
- Evidence: `phases/agent-design-desktop-productization/` + packaged-app E2E/installer/recovery evidence.
- Gap: 검증된 engine을 설치 가능한 신뢰 제품으로 닫아야 한다.
- Status: [ ]

## Archive Pointer

Completed or archived milestone history lives in `BACKLOG.md` (System Content Depth, Agent Design CLI, Docs Article Depth & Page Examples, Content Fill, Structure-First Buildout closed 2026-07-10; Figma Workflow, Figma Bridge, Public Site Shell, System Model Core, Agent Integration closed 2026-07-07).
