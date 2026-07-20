# PLAN — VL5 군집 채우기

> 생성: 2026-07-21 · 갈래: tooling · scope 결정: 펼침류 외 나머지 군집 14개를 4배치로 전부 작성
> milestone-레벨 durable plan doc.

Status: approved 2026-07-21 (horizon 전체 연쇄 승인)

## 북극성 → horizon → milestone → step (위계)

- **북극성**: 에이전트가 의도적으로 디자인된 UI를 만들게 한다 (← `OBJECTIVE.md`)
- **horizon**: 용어가 실제로 쓰이는 흐름 (← `plans/horizons/2026-07-vocabulary-in-use.md`)
- **milestone**: VL5 — 4개의 독립 배치(각각 별개 changeset)로 군집 14개를 채우고, 마지막에 전 군집 참조 무결성을 통합 검증한다. milestone 규모.

## 중단점 · run 전 scope 결정 (확정)

- **결정**: step-1~5. 15군집(VL4의 펼침류 포함) 전부가 정본화되면 닫는다.
- execution mode: `continuous`
- **중단점(stop points)**: completed / 증거 있는 blocked / decision_required / risk_gate / user_stopped
- **진행 보고**: commentary only.
- rollback/cleanup: 배치 단위 `git revert`. 각 배치는 신규 파일만 추가하므로 부분 롤백이 안전하다.

## 스캐폴딩 결정

- source-of-truth: `docs/design-system/decisions/<cluster-id>.md` (VL4 계약). 새로 찾은 근거는 `research/2026-07-21-ed2-cluster-axis-sources.md`에 누적하고 각 군집 파일이 백링크.
- 검증: `python scripts/validate-decisions.py`(전 군집) + 배치마다 판정 분리 종이 검증(요구 문장 → 서로 다른 답).
- 배포/운영: 해당 없음 — 등재는 VL6.
- 리서치: 배치마다 그 군집의 축 근거를 먼저 확인한다. VL4 리서치가 **제약 종료**로 닫혔고 미열람 소스 목록(NN/G Checkboxes vs Radio·Data Tables·Modal & Nonmodal, Doctolib Oxygen 원문, Smashing 2026-03 Modal vs Separate Page)이 남아 있다 — 해당 군집 배치에서 마저 연다.
- 군집 id 어휘: `pattern-taxonomy.md`의 `pattern_group` 10종과 충돌하지 않는 별도 네임스페이스(`decisions/<cluster-id>`). 군집은 분류가 아니라 **혼동 쌍의 묶음**이라 기존 축과 다르다 — 계약 문서에 이 구분을 명시.
- 검토 후 제외: 화면·서버·데이터스토어·배포·관측·디자인 — 정적 마크다운 자산만 추가.

## 결정 로그

- 군집 목록: 리서치 §5의 15개를 확정 목록으로 채택(2026-07-21). 작성 중 "실제로는 안 헷갈린다"고 판명되는 군집은 finding 큐로 빼고 사유를 기록한다 — 군집 수 감소는 사용자 결정 불요(닫는 기준은 ≥10군).
- 배치 경계: 성격이 비슷한 군집끼리 묶어 축을 공유하게 한다(오버레이류는 차단성·맥락 유지를 공유). 사용자 결정 불요.
- 그 외 사용자 소유 결정: 없음.
- status: resolved

## Step 트리

- [ ] **step-1 — 오버레이 배치 (3군)**
  - Artifact: `decisions/overlay-surfaces.md`(modal/drawer/bottom-sheet/full-page) · `decisions/floating-attachments.md`(popover/tooltip/flyout) · `decisions/notification-urgency.md`(toast/inline banner/confirmation modal)
  - Files: 읽기 `terms.yml` 해당 항목·리서치 §4·§5, 신규 소스(NN/G Modal & Nonmodal, Smashing 2026-03 Modal vs Separate Page) / 쓰기 위 3파일 + `research/2026-07-21-ed2-cluster-axis-sources.md`
  - Dependencies: none
  - Verify: `python scripts/validate-decisions.py` exit 0, 4 clusters
  - Failure probe: 세 군집이 서로 다른 축을 쓰는지 확인 — 축 id가 3군집에서 전부 동일하면 군집을 잘못 갈랐다는 신호이므로 병합을 검토한다
  - Commit: changeset `<n>-decision-overlay-batch`
- [ ] **step-2 — 선택 입력 배치 (3군)**
  - Artifact: `decisions/single-choice-input.md`(radio/select/segmented/switch) · `decisions/on-off-input.md`(checkbox/switch/toggle chip) · `decisions/large-option-set.md`(combobox/select/radio)
  - Files: 읽기 `terms.yml`·NN/G Listbox vs Dropdown·NN/G Checkboxes vs Radio 원문·Atlassian Forge 가이드라인·Doctolib Oxygen(가능하면 원문) / 쓰기 위 3파일 + 리서치 누적 파일
  - Dependencies: step-1
  - Verify: validator exit 0, 7 clusters · 항목 수 임계값마다 출처 URL 존재(근거 없는 수치는 `confidence: low`)
  - Failure probe: 항목 수 축만으로 판정이 끝나버리지 않는지 확인 — "옵션 3개인데 즉시 반영되어야 함"이 segmented/switch로 갈리는지 본다. 항목 수 단일 축으로 뭉개지면 즉시성 축을 추가
  - Commit: changeset `<n>-decision-input-batch`
- [ ] **step-3 — 표시·페이징 배치 (4군)**
  - Artifact: `decisions/collection-display.md`(table/list/card grid) · `decisions/load-more-strategy.md`(pagination/infinite scroll/load more) · `decisions/absence-and-waiting.md`(empty state/skeleton/spinner) · `decisions/card-vs-text-expand.md`(disclosure-card/accordion/더보기)
  - Files: 읽기 `terms.yml`·NN/G Data Tables 원문·uxpatterns Table vs List vs Cards / 쓰기 위 4파일 + 리서치 누적 파일
  - Dependencies: step-2
  - Verify: validator exit 0, 11 clusters
  - Failure probe: `card-vs-text-expand`가 VL4의 펼침류와 중복되지 않는지 확인 — 후보·축이 대부분 겹치면 별도 군집이 아니라 펼침류의 하위 규칙으로 흡수한다
  - Commit: changeset `<n>-decision-display-batch`
- [ ] **step-4 — 탐색·흐름 배치 (4군)**
  - Artifact: `decisions/finding-things.md`(search field/command palette/filter panel) · `decisions/navigation-scope.md`(breadcrumb/section tabs/sidebar nav) · `decisions/long-form-strategy.md`(wizard/single long form/accordion form) · `decisions/mobile-view-switch.md`(segmented/tab bar/top tabs)
  - Files: 읽기 `terms.yml`·uxpatterns Search vs Command Palette·모바일 혼동 소스 / 쓰기 위 4파일 + 리서치 누적 파일
  - Dependencies: step-3
  - Verify: validator exit 0, 15 clusters
  - Failure probe: `mobile-view-switch`와 `navigation-scope`·`single-choice-input`의 segmented 중복 판정 — 같은 후보가 두 군집에서 서로 **모순되는** 규칙을 갖는지 대조한다. 모순이면 상위 축(전역 전환 vs 화면 내 전환)을 명시해 해소
  - Commit: changeset `<n>-decision-navigation-batch`
- [ ] **step-5 — 전 군집 무결성 통합**
  - Artifact: 검증기에 **교차 군집 검사** 추가(같은 term id가 여러 군집에서 모순 규칙을 갖는지) + `docs/design-system/decisions/README.md` 군집 인덱스
  - Files: 쓰기 `scripts/validate-decisions.py`·`docs/design-system/decisions/README.md`
  - Dependencies: step-4
  - Verify: `python scripts/validate-decisions.py` exit 0 · 군집 ≥10 · 참조 무결성 위반 0 · 교차 모순 0
  - Failure probe: 고의 모순 fixture(같은 term을 두 군집에서 상반된 조건으로 pick) 투입 → exit 1 확인
  - Commit: changeset `<n>-decision-corpus-integrity`

## 검증/DoD

- **DoD**: 군집 ≥10개가 검증기를 통과하고, 모든 후보가 `terms.yml` 실존 id이며, 모든 축에 출처와 confidence가 있고, 교차 군집 모순이 0이다.
- Evidence: `evidence/vocabulary-in-use/ed2-cluster-corpus.md`

## finding 큐

- (실행 중 append — 병합/기각한 군집과 사유를 여기 적는다)

## 진행 로그 (append-only)

- 2026-07-21 plan 작성
