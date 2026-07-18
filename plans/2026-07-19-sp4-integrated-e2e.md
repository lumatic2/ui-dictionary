# Plan - SP4 통합 E2E 실연

Date: 2026-07-19
Milestone: SP4 (`ROADMAP.md`, pending — Studio Depth 4/4)
Status: approved (2026-07-19)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-studio-depth.md` (active, 4/4)
- Milestone: SP4 — 통합 실연

## Scope

사용자 실의뢰 1건으로 v2 전 루프 관측: 전략층 질문 → 스튜디오 v2(타일→축 14종→실사 이미지) → DESIGN.md v2 → 구현(실사 적용) → 실물 브라우저 게이트. 관측·갭 기록 → horizon close.

## 스캐폴딩 결정

- 작업 유형: tooling (E2E evidence)
- source-of-truth: `evidence/studio-depth/`
- deploy: 해당 없음 — E2E evidence는 레포 커밋만, 배포 표면 없음
- 테스트 표면: 대화형 실연

## 결정 로그

- [계획된 상호작용] 실연 의뢰는 사용자 참여 — 시점 대기 허용.
- 그 외 예상 결정: 없음
- status: resolved

## Step 트리

- [ ] Step 1 — 통합 실연 + evidence (changeset)
  - Artifact: changeset (evidence)
  - Files: `evidence/studio-depth/` write
  - Dependencies: SP1~SP3 완료 + 사용자 의뢰
  - Verify: 선택 JSON v2 + DESIGN.md v2 + 실사 적용 결과물 + 실물 게이트 관측
  - Failure probe: 실연 중 마찰·갭을 그대로 기록(다음 horizon 입력 — 미화 금지)
  - Commit: `feat(agent): SP4 — integrated live E2E`
- [ ] Step 2 — horizon close 처리 (changeset)
  - Artifact: changeset
  - Files: horizon doc·ROADMAP·BACKLOG
  - Dependencies: Step 1
  - Verify: Close Criteria 4/4 대조
  - Failure probe: 미충족 항목 있으면 close 보류·사유 기록
  - Commit: `feat(agent): SP4 — horizon close`

## Scope Boundary

- Execution mode: continuous
- 중단점: 실연 사용자 참여 대기 / blocked·error
- Rollback/cleanup: 해당 없음

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "대화형 실연 — 직접"
    target_roles: []
    execution_path: local_manual
  spec_delta: "없음 — 검증 milestone"
  spec_skip_reason: "산출물은 evidence"
  perspectives:
    product: "확장이 실제 사용감으로 검증"
    architecture: "-"
    security: "-"
    qa: "전 루프 관측 + 갭 정직 기록"
    skeptic: "실연 1회로 일반화 한계 — 갭 기록이 보완"
  dod:
    - "전 루프 관측 evidence"
    - "실패 모드: 갭 미화 금지 기록"
```
