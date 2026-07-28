# Plan - ST4 카피·인터랙션 축 + 통합 실연

Date: 2026-07-19
Milestone: ST4 (`ROADMAP.md`, pending — Cascade Studio 4/4)
Status: approved (2026-07-19)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-cascade-studio.md` (active, 4/4)
- Milestone: ST4 — 카피·인터랙션 축 + 실연

## Scope

① 신규 축: 히어로 헤드라인 후보 3~4(에이전트 생성 카피 — 미리보기에 실물 렌더), 서브 카피 후보, CTA 구성(1개/2개·문구), 마우스 인터랙션 종류(부양/글로우/자석/밑줄 확장 — 만져보는 데모) ② design-brief v2 축 표 갱신 + 배포 ③ 통합 실연 1회(사용자) → 갭 기록 → horizon close.

## 스캐폴딩 결정

- 작업 유형: tooling
- source-of-truth: `templates/brief-studio.html`·`docs/design-system/design-brief.md`
- deploy: llms + 레포
- 테스트 표면: 실구동 + 대화형 실연

## 결정 로그

- [사용자 확정] 히어로 문구·설명·CTA 개수·마우스 인터랙션 선택화.
- [AI 기본값] 카피 후보는 전략층 키워드 파생 3~4안, 미리보기 히어로에 즉시 반영(ST2 캐스케이드 활용).
- [계획된 상호작용] 실연 의뢰는 사용자 참여 — 시점 대기 허용.
- 그 외 예상 결정: 없음
- status: resolved

## Step 트리

- [ ] Step 1 — 카피·인터랙션 축 구현 + 계약 배포 (changeset)
  - Artifact: changeset
  - Files: `templates/brief-studio.html`, `docs/design-system/design-brief.md` (축 표 갱신), llms
  - Dependencies: ST2(미리보기 반영), ST3
  - Verify: 실구동 — 헤드라인 선택이 미리보기 히어로에 반영, 인터랙션 데모 4종 작동 + curl
  - Failure probe: 카피 축 미선택 시 더미 유지(제출 차단 안 함 — 선택 축 수 계약 갱신)
  - Commit: `feat(agent): ST4 step 1 — copy + interaction axes + deploy`
- [ ] Step 2 — 통합 실연 + horizon close (changeset)
  - Artifact: changeset (evidence)
  - Files: `evidence/cascade-studio/`, horizon doc·ROADMAP
  - Dependencies: Step 1 + 사용자 의뢰
  - Verify: 폭포+미리보기+영상+카피 전 루프 관측, Close Criteria 4/4 대조
  - Failure probe: 갭 미화 금지 기록
  - Commit: `feat(agent): ST4 step 2 — integrated E2E + horizon close`

## Scope Boundary

- Execution mode: continuous
- 중단점: step-2 실연 사용자 참여 대기 / blocked·error
- Rollback/cleanup: revert

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: expansion
  delegation_decision:
    remote_background_agents: skip
    reason: "축 추가 + 실연 — 직접"
    target_roles: []
    execution_path: local_manual
  spec_delta: "카피·인터랙션까지 선택 공간 편입"
  perspectives:
    product: "문구를 눈으로 비교 — 마지막 추정 영역 제거"
    architecture: "기존 축 패턴 재사용"
    security: "-"
    qa: "미리보기 반영 실측 + 미선택 경로"
    skeptic: "카피 후보 품질 — 키워드 파생 규칙 명시로 방어"
  dod:
    - "실구동 + 실연 관측"
    - "실패 모드 확인 + 갭 기록"
```
