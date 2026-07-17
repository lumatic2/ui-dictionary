# Plan - VI1 표현 스택 지도

Date: 2026-07-17
Milestone: VI1 (`ROADMAP.md`, active — Expressive Stack 1/5)
Status: approved (2026-07-17 사용자 "응 좋아 진행" — horizon 구성·범위 2회 조정 후 승인, horizon-run 연쇄)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-expressive-stack.md` (active, 1/5)
- Milestone: VI1 — 표현 스택 지도

## Scope

웹 화면 시각 표현의 4개 렌더링 티어(CSS·SVG / 모션 오케스트레이션 / Canvas 2D·물리 / WebGL·three.js) 기법 계보를 출처 기반으로 조사·정본화하고, 에이전트가 소비할 **기법→티어 결정 표**("이 효과는 뭘로 만드나")를 knowledge로 배포한다. 자체 쇼케이스 12종의 티어 역산 포함.

범위 밖: recipe 구현(VI2~VI4), three.js 도입(VI4), shadcn 가이드(VI5), 차트·데이터 시각화.

## 스캐폴딩 결정

- 작업 유형: learning + tooling 혼합 (리서치 산출물 + knowledge 정본 changeset)
- source-of-truth: `docs/research/2026-07-17-expressive-stack-genealogy.md`(리서치 기록, 동결) + `knowledge/expressive-stack.md`(살아있는 정본, llms 배포)
- deploy: generate-llms-txt.mjs → push → Cloudflare → 배포 curl
- 테스트 표면: llms.txt 링크 무결성, 배포 curl 200, 전 인용 출처 URL+접근일 검수(전역 인용 규칙 2026-07-17)

## Scope Boundary

- Execution mode: continuous
- 중단점: ① 새 사용자 소유 결정 ② blocked/error ③ risk_gate. push·배포는 승인에 포함.
- Rollback/cleanup: changeset 단위 revert, 리서치 doc은 기록으로 동결.

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: use
    reason: "티어별 계보 리서치는 병렬 웹 조사 노동 — 위임 기본 원칙. 합성·결정 표·게이트는 오케스트레이터."
    target_roles: ["researcher x2 (sonnet, background: CSS·SVG+모션 / Canvas+WebGL)", "gate(오케스트레이터 — 출처 검수·합성)"]
    execution_path: claude_subagent
  spec_skip_reason: "VI1 계약은 horizon doc·ROADMAP DoD에 기록 — 신규 지식 자산 추가로 기존 spec 변경 없음."
  perspectives:
    product: "사용자 실질 수요('이건 뭘로 만든 거지?')에 시스템이 답하게 됨 — VI2~VI4 선정의 입력."
    architecture: "research=동결 기록, knowledge=살아있는 정본으로 분리 — 중복 서술 대신 인용."
    security: "외부 인용만 — secret 없음. 출처 규칙 준수."
    qa: "출처 없는 항목 반입 금지 검수 + llms 배포 curl."
    skeptic: "리서처 환각 출처 위험 — 게이트가 URL 샘플 검증. 결정 표가 과단순화되면 VI2~4에서 수정 루프."
  role_lanes:
    gate: "출처 샘플 검증 + 티어 판정 일관성 검수 + 쇼케이스 역산 실코드 대조 (오케스트레이터)"
  dod:
    - "리서치 doc: 4티어 기법 계보, 전 항목 출처 URL+접근일 — 무출처 항목 0"
    - "knowledge/expressive-stack.md: 기법→티어 결정 표 + 쇼케이스 12종 역산 — llms.txt 노출 + 배포 curl 200"
    - "실패 모드: 오경로 curl 404 유지 + 리서처 출처 URL 샘플 실검증(무작위 3건)"
```

## Step 트리

- [ ] Step 1 — 계보 리서치 정본화 (changeset)
  - Artifact: research 기록 + changeset
  - Files: `docs/research/2026-07-17-expressive-stack-genealogy.md`(신규 — 위임 리서치 2건 합본 + 쇼케이스 12종 티어 역산)
  - Dependencies: 리서처 에이전트 2기 결과
  - Verify: 전 항목 출처 URL+접근일 존재 grep, 출처 무작위 3건 실 curl, 쇼케이스 역산은 실코드 grep 근거
  - Failure probe: 무출처 항목 발견 시 해당 항목 폐기(추정 반입 금지)
  - Commit: `feat(agent): VI1 step 1 — expressive stack genealogy research`
- [ ] Step 2 — knowledge 정본 + 결정 표 + llms 배포 (changeset)
  - Artifact: changeset
  - Files: `knowledge/expressive-stack.md`(신규 — 4티어 정의·기법→티어 결정 표·에이전트 판정 절차), `scripts/generate-llms-txt.mjs`(knowledge 노출 필요 시), llms 재생성
  - Dependencies: Step 1
  - Verify: llms.txt에 노출 → push → 배포 curl 200 + 오경로 404
  - Failure probe: 결정 표에 "티어 불명" 케이스의 기본 판정 규칙(하위 티어 우선) 명시 여부 grep
  - Commit: `feat(agent): VI1 step 2 — expressive-stack knowledge + tier decision table`

## 결정 로그

- [사용자 확정 2026-07-17] 범위 = "화면 표시 대다수" 4티어 전부, three.js 정식 도입은 VI4(lazy-load 조건 GO).
- [사용자 확정 2026-07-17] horizon 구성 5 milestone (VI5 = 부품 계약+흡수 병합).
- [AI 기본값] 리서치 위임 2분할(선언·모션 / 캔버스·GPU), 워커=sonnet background.
- 남은 사용자 소유 결정: 없음.
- status: resolved
