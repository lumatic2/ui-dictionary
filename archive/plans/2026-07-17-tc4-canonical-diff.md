# Plan - TC4 성문 판단 diff: HIG·Material·Polaris

Date: 2026-07-17
Milestone: TC4 (`ROADMAP.md`, active — Taste Corpus 4/4, horizon-run 연쇄)
Status: approved (2026-07-17 사용자 "ㄱㄱ" 연쇄 — horizon 구성 승인 포함)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-taste-corpus.md` (active, 4/4 — 마지막)
- Milestone: TC4 — 성문 판단 diff

## Scope

1급 디자인 시스템(Apple HIG·Material 3·Shopify Polaris)의 성문 원칙을 출처 기반으로 수집하고, 우리 시그니처·anti-patterns와 **diff만** 선별 흡수한다. 전량 수용 금지 — 채택은 갱신으로, 기각은 사유와 함께 기록(스타일 고정 금지 원칙과 충돌하는 항목은 기각). 채택·기각 각 1건 이상.

범위 밖: 세 시스템의 컴포넌트 스펙 흡수(원칙 층만), 시그니처 무단 개정(사용자 확인 계약 유지).

## 스캐폴딩 결정

- 작업 유형: tooling (taste ledger + 자산 갱신)
- source-of-truth: `research/taste/ledger.md` + 갱신 자산
- deploy: llms 재생성 → push → curl
- 테스트 표면: 전 인용 출처 URL+접근일, 채택/기각 사유 기록, 배포 curl

## Scope Boundary

- Execution mode: continuous
- 중단점: 새 사용자 소유 결정(시그니처 개정 후보 시 확인) / blocked·error / risk_gate.
- Rollback/cleanup: changeset revert.

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: selective
  delegation_decision:
    remote_background_agents: use
    reason: "성문 원칙의 정확한 출처 수집은 병렬 웹 조사 노동 — 위임 기본. diff 판정·흡수는 오케스트레이터."
    target_roles: ["researcher x1 (sonnet, background)", "gate(오케스트레이터)"]
    execution_path: claude_subagent
  spec_skip_reason: "taste-loop 계약 실행 배치."
  perspectives:
    product: "남이 증류한 판단과의 대조 — 자가 기준의 맹점 발견."
    architecture: "diff만 흡수 — 세 시스템의 스타일 어휘를 들여오지 않음."
    security: "공개 문서만."
    qa: "출처 검수 + 채택/기각 사유 + 배포 curl."
    skeptic: "전량 수용 위험 — 기각 ≥1을 DoD로 강제해 diff 실작동 증명."
  role_lanes:
    gate: "기각 사유의 논리(스타일 고정 금지와의 충돌 등) 검수"
  dod:
    - "채택 흡수 ≥1(자산 갱신) + 기각 ≥1(사유 기록) — ledger 완비"
    - "전 인용 출처 URL+접근일 + 배포 curl + 오경로 404"
    - "실패 모드: 시그니처 개정 후보 발생 시 반영 보류·사용자 확인 상정"
```

## Step 트리

- [ ] Step 1 — 성문 원칙 수집 (changeset)
  - Artifact: changeset (ledger 초안 기록)
  - Files: `research/taste/ledger.md` append(T-15~, 수집 원칙·출처)
  - Dependencies: 리서처 결과
  - Verify: 출처 URL+접근일 전 항목 + 무작위 1건 실 curl
  - Failure probe: 무출처 항목 폐기
  - Commit: `feat(agent): TC4 step 1 — canonical principles sourced`
- [ ] Step 2 — diff 판정 + 자산 반영 + 배포 (changeset)
  - Artifact: changeset
  - Files: ledger 갱신(채택/기각 판정), 갱신 자산, llms 재생성
  - Dependencies: Step 1
  - Verify: 채택≥1·기각≥1 → push → 배포 curl + 오경로 404
  - Failure probe: 기각 0이면 diff 형식화 의심 — 중단·재판정
  - Commit: `feat(agent): TC4 step 2 — diff absorption + deploy`

## 결정 로그

- [사용자 확정 2026-07-17] 대상 3종(HIG·Material·Polaris), diff만 선별 — horizon 승인.
- [AI 기본값] 원칙 층만(컴포넌트 스펙 제외), 리서처 1기 위임.
- 남은 사용자 소유 결정: 없음 (시그니처 후보 시 확인은 계획된 상호작용).
- status: resolved
