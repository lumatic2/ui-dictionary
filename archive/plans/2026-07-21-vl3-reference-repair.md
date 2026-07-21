# PLAN — VL3 참조 복구 + 역방향 매핑

> 생성: 2026-07-21 · 갈래: tooling · scope 결정: 3자 매핑 생성 · 무결성 검사 · 자산 없을 때 폴백 규약까지
> milestone-레벨 durable plan doc.

Status: approved 2026-07-21 (horizon 전체 연쇄 승인)

## 북극성 → horizon → milestone → step (위계)

- **북극성**: 에이전트가 의도적으로 디자인된 UI를 만들게 한다 (← `OBJECTIVE.md`)
- **horizon**: 용어가 실제로 쓰이는 흐름 (← `plans/horizons/2026-07-vocabulary-in-use.md`)
- **milestone**: VL3 — 용어를 골랐는데 만들 수가 없으면 아무것도 안 바뀐 것과 같다. 매핑 생성·무결성 검사·폴백 규약 3개 표면이고 통합검증은 "끊긴 참조 0 + 폴백 경로로 실제 1건 구현". milestone 규모.

## 중단점 · run 전 scope 결정 (확정)

- **결정**: step-1~3. 481개 미커버 용어에 레시피·코드 자산을 새로 만드는 것은 범위 밖 — 참조가 해소되고 폴백 경로가 있는 상태까지다.
- execution mode: `continuous`
- **중단점(stop points)**: completed / 증거 있는 blocked / decision_required / risk_gate / user_stopped
- **진행 보고**: commentary only.
- rollback/cleanup: 매핑은 생성물이라 생성기 revert 후 재생성. 폴백 규약 문서는 diff 단위 revert.

## 스캐폴딩 결정

- source-of-truth: 매핑은 **파생물** — `terms.yml`의 id, 레시피 frontmatter의 `term_refs`, 레지스트리(`r/registry.json`)에서 생성한다. 손으로 관리하는 네 번째 목록을 만들지 않는다(드리프트 원천).
- 검증: `node scripts/audit-vocabulary-reach.mjs`(VL1 step-2에서 만든 계수기)를 확장해 ① 배포본 기준 끊긴 `term_refs` 0 ② 매핑의 양방향 일치(레시피→용어와 용어→레시피가 같은 집합) ③ 레지스트리 자산과 레시피의 대응.
- 배포/운영: 매핑 파일과 폴백 규약을 llms.txt에 등재(VL2 생성기 확장). push는 사용자 승인 지점.
- 폴백 규약: 레시피·코드 자산이 없는 용어를 골랐을 때 에이전트가 무엇을 근거로 구현하는가 — 용어의 `visual_anatomy`(부위), `when_to_use`/`anti_use`(경계), 그리고 같은 그룹의 인접 레시피(구조 참고)를 조합하는 절차. "자산이 없으니 감으로"가 아니라 명시된 재료 목록에서 시작하게 한다.
- 검토 후 제외: 화면·서버·데이터스토어·관측·디자인 — 정적 생성물·문서만 추가한다.

## 결정 로그

- 매핑을 손으로 쓸 것인가 생성할 것인가: **생성 확정**. 근거: 세 원본(용어·레시피·레지스트리)이 각자 갱신되므로 네 번째 손 목록은 반드시 드리프트한다.
- 끊긴 참조 해소 방법: VL2의 용어 배포가 선행하므로, 참조는 **배포된 용어 조회 경로를 가리키게** 하면 해소된다. 레시피 본문을 대량 수정하지 않고 생성기가 링크를 부여한다. 근거: 45개 파일 수기 편집은 회귀 위험이 크다.
- 481개 미커버 용어: 자산 제작은 별건으로 남긴다(horizon 범위 밖 명시). 이 milestone은 폴백 경로 확보까지.
- 그 외 사용자 소유 결정: 없음.
- status: resolved

## Step 트리

- [ ] **step-1 — 3자 매핑 생성**
  - Artifact: `scripts/generate-term-asset-map.mjs` + 생성물 `docs/ui-vocabulary/term-asset-map.json` — 용어별로 어떤 레시피·코드 자산이 있는지, 없으면 없다고 명시
  - Files: 읽기 `docs/ui-vocabulary/terms.yml`·`recipes/*/*.md`·`examples/ui-vocabulary-site/public/r/registry.json` / 쓰기 생성기 + 매핑
  - Dependencies: none
  - Verify: 매핑 항목 수 = 562 + 레시피→용어와 용어→레시피 양방향 집합 일치 + 커버리지 수치가 VL1 장부와 대조 가능
  - Failure probe: 존재하지 않는 레시피를 가리키는 용어를 고의로 넣어 생성기가 **명시 에러로 거부**하는지 확인. 조용히 빈 값으로 넘어가면 매핑이 거짓말을 하게 된다
  - Commit: changeset `<n>-term-asset-map`
- [ ] **step-2 — 끊긴 참조 해소 + 무결성 검사**
  - Artifact: 레시피 `term_refs`가 배포된 용어 조회 경로로 해소되도록 생성기 배선 + `audit-vocabulary-reach.mjs`에 무결성 검사 3종 추가
  - Files: 쓰기 `scripts/generate-llms-txt.mjs`(또는 VL2 생성기)·`scripts/audit-vocabulary-reach.mjs`
  - Dependencies: step-1
  - Verify: `node scripts/audit-vocabulary-reach.mjs` — 배포본 기준 끊긴 `term_refs` **0건**(VL1 계측 시점 81건) + 양방향 일치 위반 0 + 레지스트리 대응 위반 0
  - Failure probe: 해소를 가장하지 않았는지 검사 — 실제로 배포 경로 3개를 골라 응답 첫 줄을 확인한다. 링크만 생기고 대상이 없으면 0건은 거짓이다
  - Commit: changeset `<n>-reference-integrity`
- [ ] **step-3 — 자산 없는 용어의 폴백 규약**
  - Artifact: `docs/design-system/no-asset-fallback.md` — 재료 목록(anatomy·경계·인접 레시피)과 구현 절차, 그리고 이 경로로 실제 컴포넌트 1건을 구현한 증거
  - Files: 읽기 `docs/ui-vocabulary/terms.yml`(대상 용어)·`docs/design-system/recipe-format.md` / 쓰기 폴백 규약 문서 + 구현 증거
  - Dependencies: step-2
  - Verify: 481개 중 임의 용어 1개를 골라 규약대로 구현 — 산출 컴포넌트가 그 용어의 `visual_anatomy` 부위를 전부 갖고 `anti_use`를 하나도 범하지 않음을 대조 기록
  - Failure probe: 규약이 "레시피를 만들어라"로 순환하지 않는지 검사 — 폴백은 자산이 **없는** 상황의 경로이므로, 절차 어느 단계도 존재하지 않는 레시피를 요구하면 안 된다
  - Commit: changeset `<n>-no-asset-fallback`

## 검증/DoD

- **DoD**: 배포본 기준 끊긴 `term_refs`가 0이고, 용어↔레시피↔코드자산 매핑이 생성물로 존재하며 양방향이 일치하고, 자산 없는 용어를 폴백 규약으로 실제 구현한 증거가 있다.
- Evidence: `evidence/vocabulary-in-use/vl3-reference-repair.md`

## finding 큐

- (실행 중 append)

## 진행 로그 (append-only)

- 2026-07-21 plan 작성
