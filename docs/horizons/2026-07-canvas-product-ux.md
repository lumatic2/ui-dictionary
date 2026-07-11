# Horizon — Canvas Product UX

Date: 2026-07-11
Status: active — UX1·UX2 complete; UX3 Agent Collaboration UX pending (MCP vs CLI 채널 결정은 사용자 소유 — 재료: `docs/research/2026-07-12-agent-canvas-control-mcp-vs-cli.md`).

## Goal

Agent Design를 기능 검증용 캔버스에서 반복 사용 가능한 전문 제작 환경으로 전환한다. 사용자는 프로젝트를 열고, 화면 구조를 이해하고, UI를 만들고, Codex/Claude의 변경을 확인·되돌리는 전체 흐름을 별도 설명 없이 수행할 수 있어야 한다.

## Why Now

이전 Agent-Native UI Canvas horizon은 canonical document, 계층형 DOM+WebGPU renderer, 직접 조작, terminal-agent 왕복, Windows 패키징을 실증했다. 그러나 현재 renderer shell은 `AUC3`, fixture 크기, benchmark, bridge revision 같은 개발자용 제어가 전면에 있고 시작·제작·상태·복구 흐름이 하나의 제품 경험으로 조직되지 않았다. 다음 병목은 엔진 능력이 아니라 사용자가 그 능력을 발견하고 신뢰하는 방식이다.

## Confirmed Decisions

- 우선순위: 전문 편집기 기본기 → agent collaboration → visual polish.
- 시장 재조사는 생략한다. 기존 Figma/OpenDesign 연구와 구현된 제품의 실제 UX gap을 근거로 한다.
- 기존 Electron security, canonical document, bridge/MCP authority 경계는 유지한다.
- 개발용 benchmark와 diagnostics는 제품의 주 정보구조에서 분리하되 제거하지 않는다.
- Horizon 실행은 UX1→UX2→UX3→UX4 순서로 연쇄한다. 새로운 사용자 소유 결정이나 security regression이 생기면 중단한다.

## Milestones

### UX1 — Workspace Foundation

시작 화면, project open/recent 흐름, 제품형 workspace shell, toolbar, persistent status, panel layout을 구축한다. 기존 캔버스·bridge·preview 기능은 새 정보구조 안에서 회귀 없이 동작해야 한다.

### UX2 — Visual Creation Workflow

레이어 탐색, component insertion, zoom/pan/selection, alignment/spacing, properties, shortcuts를 발견 가능한 제작 루프로 연결한다.

### UX3 — Agent Collaboration UX

선택 영역의 agent context, Codex/Claude 연결·작업 상태, 변경 요약/diff, conflict, audit/Undo를 사람이 이해할 수 있는 collaboration surface로 만든다.

### UX4 — Product Polish And Validation

empty/loading/error/recovery states, accessibility, density, visual consistency, packaged workflow E2E를 닫고 Horizon 전체 품질을 검증한다.

## Close Criteria

처음 실행한 사용자가 프로젝트를 열고, 캔버스 구조를 탐색하고, 컴포넌트를 수정하고, terminal agent 변경을 확인·되돌리고, 오류나 복구 상태를 이해하는 대표 흐름을 완료한다. packaged Windows app에서 keyboard/a11y, security authority, interaction latency, screenshot consistency, restart recovery가 evidence로 남아야 한다.

## Objective Impact Target

Objective의 “사람이 직접 만드는 캔버스와 에이전트가 같은 정본 document/code를 편집하는 제작 환경” 축을 기술적 가능 상태에서 반복 사용 가능한 제품 상태로 이동시킨다.

## Backlinks

- Objective: `docs/OBJECTIVE.md`
- Predecessor: `docs/horizons/2026-07-agent-native-ui-canvas.md`
- Gap review: `docs/roadmap-gap-2026-07-11.md`
- UX1 plan: `docs/plans/2026-07-11-ux1-workspace-foundation.md`
- UX2 plan: `docs/plans/2026-07-11-ux2-visual-creation-workflow.md`
