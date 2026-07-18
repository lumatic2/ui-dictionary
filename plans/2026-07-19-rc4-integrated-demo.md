# Plan - RC4 통합 실연 (스튜디오→코드 조합→리스타일)

Date: 2026-07-19
Milestone: RC4 (`ROADMAP.md`, pending — Recipe Code Reuse 4/4)
Status: proposed

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-recipe-code-reuse.md` (4/4)

## Scope

실의뢰 1건으로 전 루프를 관측한다: 브리프 스튜디오(전략층→18축, 구성 선택)→수집 JSON의 레시피 매핑→registry 코드 자산 fetch·조합 스캐폴드→프로젝트 토큰 리스타일→실물 브라우저 게이트. 갭 미화 없이 기록 → horizon close.

## 스캐폴딩 결정

- source-of-truth: 이번 실연 산출물은 scratchpad(데모) + `evidence/recipe-code-reuse/`(기록)
- 검증: 전 루프 관측 + Close Criteria 5항 대조 + 피드백 즉시 교정·재실연(ST4 전례)
- 배포/운영: 해당 없음 — 실연 데모는 배포하지 않음
- 검토 후 제외: 서버·데이터(실연 — 해당 없음)

## 결정 로그

- [계획된 상호작용] 실연 의뢰·선택·게이트 판정은 사용자 참여 — 시점 대기 허용.
- [AI 기본값] 의뢰 업종은 실연 시점에 사용자가 정함(없으면 코드 자산 커버리지가 넓은 업종 제안).
- 그 외 예상 결정: 없음
- status: resolved

## Step 트리

- [ ] Step 1 — 통합 실연 + horizon close (changeset)
  - Artifact: changeset (evidence)
  - Files: `evidence/recipe-code-reuse/rc4-demo.md`(+선택 JSON·스크린샷), horizon doc·ROADMAP
  - Dependencies: RC1~RC3 + 사용자 의뢰
  - Verify: 전 루프 관측 + Close Criteria 5항 선언/실측/판정 대조 + 프리모템 대조 + 크기 회고
  - Failure probe: 루프 중 단절(매핑 미사용·리맵 생략 등) 발견 시 미화 없이 기록·즉시 교정·재실연
  - Commit: `feat(agent): RC4 — integrated demo + horizon close`

## Scope Boundary

- Execution mode: continuous
- 중단점: 사용자 실연 참여 대기 / blocked·error
- Rollback/cleanup: 실연 서버·임시 파일 정리

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: hold
  delegation_decision:
    remote_background_agents: skip
    reason: "대화형 실연 — 직접"
    target_roles: []
    execution_path: local_manual
  spec_delta: "없음 — 실증 milestone"
  spec_skip_reason: "계약 변경은 RC1~RC3에서 완료 — RC4는 검증·기록"
  perspectives:
    product: "루프가 실사용감으로 검증돼야 close (SE2·ST4 교훈)"
    architecture: "-"
    security: "-"
    qa: "Close Criteria 전항 실측 대조"
    skeptic: "실연은 통과하나 다음 실의뢰에서 재현 안 될 위험 — 계약·자동 검증이 RC1~RC3에 있으므로 실연은 확인"
  dod:
    - "전 루프 1회 관측 + 갭 정직 기록"
    - "Close Criteria 5항 대조 → horizon close"
```
