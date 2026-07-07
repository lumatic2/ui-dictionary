# Horizon - Figma Workflow (피그마 활용 방법론)

Date: 2026-07-07
Status: active
Objective link: `docs/OBJECTIVE.md` (성공 상태 — 에이전트가 "의도적으로 디자인된 느낌의 UI"를 만드는 작업 방식 확립; 이동 축 — 시각적 영감에서 → 구현 가능한 코드·에셋·에이전트 가이드로)
Preceding horizon: `docs/horizons/2026-07-figma-bridge.md` (closed 2026-07-07)

## Goal

Figma Bridge가 검증한 파이프(원격 MCP 완전 쓰기 채널, 토큰→variables 동기화, 브리지 계약) 위에서 **Claude Code × Figma를 함께 쓰는 활용 방법론**을 리서치 기반으로 확립하고, askewly 디자인 시스템 실작업 파일럿 1회로 검증해 재사용 가능한 운영 워크플로우(methodology 문서 + 스킬)로 만든다.

## Why Now

Figma Bridge horizon이 "연결이 되는가"를 닫았지만 "언제·어떻게 쓰는가"는 미정의다. 사용자는 고품질 디자인에 Figma가 필수라고 판단하며, askewly 디자인 시스템 구축의 작업 방식 자체가 이 방법론에 달려 있다. 후보 흐름(코드로 디자인 → Figma 투입 → 사람이 디테일 다듬기 → 회수 등)은 있으나 트렌드 지형을 모른 채 예단하지 않는다 — 리서치가 우선.

## 확정 결정 (2026-07-07 사용자)

- **리서치 방식**: deep-research식 다각 리포트 + 최근 30일 커뮤니티 펄스 병행. 리서치 노동은 sonnet 이하 위임(fable은 오케스트레이션·합성만).
- **범위**: 리서치→채택(FW1) + 파일럿→운영화(FW2). 2-milestone — 직전 2연속 인플레 회고 규칙 적용("실측→계약→실증 아크 = milestone 1개, step 여러 개").
- **파일럿 방향**: 예단하지 않음 — FW1 종료 시점에 리서치 결과를 보고 사용자가 결정 (code→Figma→사람 디테일링 / Figma→code 역방향 / 하이브리드).

## Milestones

### FW1 - 리서치 → 방법론 채택 (active)

DoD:

- 트렌드 리서치 재료(다각 리포트 + 커뮤니티 펄스)가 `docs/market/`에 존재하고, 후보 워크플로우 비교·평가가 askewly 적합성 기준으로 문서화된다.
- 파일럿 방향이 사용자 결정으로 확정되고, 채택 방법론이 `methodology/figma-workflow.md` 계약 문서로 기록된다(브리지 계약 `docs/design-system/figma-bridge-contract.md`와 정합).

Evidence:

- `docs/market/2026-07-07-figma-claude-workflows.md` + `docs/market/2026-07-07-figma-claude-community-pulse.md` + `methodology/figma-workflow.md`

Plan: `docs/plans/2026-07-07-figma-workflow-method.md`

### FW2 - 파일럿 실증 + 운영화 (pending)

DoD:

- FW1이 채택한 워크플로우로 askewly 실작업 1회 왕복이 실증된다(예: 코드 디자인 → Figma 투입 → 사용자 디테일링 → 결과 회수 — 방향은 FW1 결정을 따름). 증거 스크린샷·절차 기록 포함.
- figma-codex-workflow 스킬 갱신(백로그 큐 3건: 원격 MCP 주력 채널 명시 + whoami 계정 확인 규칙 + 계약 문서 링크)이 채택 방법론을 소비 좌표로 흡수한다.

Evidence:

- `docs/research/` 파일럿 사례 노트 + Figma/코드 양쪽 증거 + `~/projects/custom-skills/figma-codex-workflow/` 갱신·배포 기록

## Close Criteria

방법론 계약 문서가 존재하고, 그 방법론대로 askewly 실작업 파일럿 왕복 1건이 기록되고, 스킬이 그 방법론을 소비하도록 갱신되면 닫는다.

## 범위 제외

- PSS2 랜딩 품질 (Next Candidates 유지)
- Figma 파일 갤러리화, Figma를 유일 SoT로 만들기 (figma-bridge Non-Goal 승계)
- 파일럿 2회차 이상·전면 적용 (후속 horizon)

## Objective Impact

(close 시 기입)
