# Plan - RC3 스튜디오 구성 ↔ 레시피 매핑

Date: 2026-07-19
Milestone: RC3 (`ROADMAP.md`, pending — Recipe Code Reuse 3/4)
Status: approved (2026-07-19)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-recipe-code-reuse.md` (3/4)

## Scope

① 스튜디오 구성 카탈로그 13항의 각 pv 섹션(hero·cards·faq·bookhero…)에 레시피/코드 자산 매핑을 데이터로 박고(`studio-data.default.json` 구성 후보에 `recipes` 필드) ② 수집 JSON에 매핑이 노출되게 하고 ③ design-brief·brief-studio 계약에 "구성 선택→매핑 자산으로 구현 출발" 지시를 배선한다 (표로 끝나지 않고 구현 지시까지 — 프리모템 3).

## 스캐폴딩 결정

- source-of-truth: `templates/studio-data.default.json`(매핑 데이터) + `templates/brief-studio.html`(수집 payload에 매핑 포함) + `docs/design-system/design-brief.md`·`brief-studio.md`(계약)
- 검증: 구성 13항 매핑 전수 존재 검사(스크립트) + 스튜디오 실구동 제출→수집 JSON에 recipes 필드 실측 + curl 배포
- 배포/운영: llms + 레포
- 검토 후 제외: 서버·관측(해당 없음), design(룩 변경 없음)

## 결정 로그

- [AI 기본값] 매핑 형태 = 구성 후보의 `recipes: {섹션키: 자산명}` — pv 시퀀스와 1:1, 자산 없는 섹션은 레시피 md 슬러그 폴백(코드 자산이 늘면 자동 격상).
- [AI 기본값] make-studio.py 검증에 "구성 후보 pv 키마다 recipes 매핑 존재" 추가 — 새 구성 추가 시 매핑 누락을 기계가 잡음.
- 그 외 예상 결정: 없음
- status: resolved

## Step 트리

- [ ] Step 1 — 매핑 데이터 + 수집 노출 (changeset)
  - Artifact: changeset
  - Files: `templates/studio-data.default.json`(13항 recipes 필드), `templates/brief-studio.html`(payload에 매핑 동봉), `templates/make-studio.py`(매핑 완전성 검증)
  - Dependencies: RC1(자산명 확정)
  - Verify: 스튜디오 실구동 → 구성 선택·제출 → 수집 JSON에 recipes 매핑 실측 + 13항 전수 검사 스크립트 PASS
  - Failure probe: 매핑 누락 구성 인위 주입 → make-studio 명시 에러
  - Commit: `feat(agent): RC3 step 1 — composition recipe map + payload`
- [ ] Step 2 — 계약 배선 + 배포 (changeset)
  - Artifact: changeset
  - Files: `docs/design-system/design-brief.md`(§DESIGN.md 매핑 저장 규칙), `docs/design-system/brief-studio.md`(구성→자산 출발 지시), llms
  - Dependencies: Step 1
  - Verify: curl 배포 + DESIGN.md 매핑 섹션 규칙 grep + 수동 추적 1건(수집 JSON→DESIGN.md 기록 형태 확인)
  - Failure probe: 자산 없는 구성 선택 시 지시가 문서-재구현 폴백을 명시하는지 확인
  - Commit: `feat(agent): RC3 step 2 — mapping contract + deploy`

## Scope Boundary

- Execution mode: continuous
- 중단점: blocked·error
- Rollback/cleanup: revert

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "데이터 매핑 + 계약 문서 — 검증 명확"
    target_roles: []
    execution_path: local_manual
  spec_delta: "스튜디오 수집 계약에 구성→레시피 자산 매핑 추가"
  perspectives:
    product: "고른 구성이 그 자리에서 구현 출발점으로 이어짐 — 브리프와 구현의 마지막 단절 제거"
    architecture: "SF1 데이터 경로 위 additive — HTML 직접 편집 금지 유지"
    security: "-"
    qa: "전수 검사 + 수집 실측 + 누락 실패 경로"
    skeptic: "매핑이 장식으로 남을 위험 (프리모템 3 — 수집→DESIGN.md→지시 배선을 DoD로)"
  dod:
    - "13항 매핑 전수 + 수집 JSON 실측"
    - "계약 배포 + 폴백 경로 확인 (실패 모드)"
```
