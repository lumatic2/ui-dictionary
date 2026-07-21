# PLAN — VL5 군집 채우기 (좁힌 판)

> 생성: 2026-07-21 · 갈래: tooling · scope 결정: 기준선이 실제로 틀린 자리 + 미확인 3군집만
> Supersedes: `plans/2026-07-21-vl5-cluster-corpus.md` (15군집 4배치 → 6군집 2배치)

Status: approved 2026-07-21 (사용자 확정 — "오판 난 자리로 좁힌다")

## 북극성 → horizon → milestone → step (위계)

- **북극성**: 에이전트가 의도적으로 디자인된 UI를 만들게 한다 (← `OBJECTIVE.md`)
- **horizon**: 용어가 실제로 쓰이는 흐름 (← `plans/horizons/2026-07-vocabulary-in-use.md`)
- **milestone**: VL5 — VL1 기준선이 가리킨 자리에만 판별 축을 채운다. 배치 2개 + 무결성 통합의 3 changeset이고 통합검증은 전 군집 검증 + 교차 모순 0. milestone 규모.

## 왜 좁혔나

VL1 기준선 측정(`evidence/vocabulary-in-use/vl1-baseline.md`): **27/32 = 84.4%, 12군집 중 8군집 만점.** 만점 군집에 판별 축을 다는 것은 비용만 들고 향상이 없다. 틀린 3건은 전부 **임계값이 있는 규칙**이었다 — 스크롤이 필요할 만큼 길면 / 공간이 있으면 / 단일 모듈이면. 축의 값어치는 "어떤 요소가 있는지"가 아니라 **"어디서 갈리는지"**에 있다.

## 중단점 · run 전 scope 결정 (확정)

- **결정**: step-1~3. 만점 8군집은 다루지 않는다. 다룰 군집 6개 — 오판 3군집(오버레이·단일 선택 입력·기다림/비어있음) + 미확인 3군집(내비게이션 범위·많은 선택지·카드형 펼침).
- execution mode: `continuous`
- **중단점(stop points)**: completed / 증거 있는 blocked / decision_required / risk_gate / user_stopped
- **진행 보고**: commentary only.
- rollback/cleanup: 배치 단위 `git revert`. 신규 파일만 추가하므로 부분 롤백이 안전하다.

## 스캐폴딩 결정

- source-of-truth: `docs/design-system/decisions/<cluster-id>.md` (VL4 계약). 새 근거는 `research/2026-07-21-vl5-cluster-axis-sources.md`에 누적하고 각 군집 파일이 백링크.
- 검증: `python scripts/validate-decisions.py`(전 군집) + 군집마다 **임계값이 실제로 갈리는지** 종이 검증(기준선이 틀린 그 케이스를 규칙에 통과시켜 정답이 나오는지).
- 배포/운영: 해당 없음 — 등재는 VL6.
- 축 작성 방향: 일반 상식으로 이미 맞히는 구분은 적지 않는다. **모델이 못 맞힌 임계값**을 명시하는 데 지면을 쓴다(예: "스크롤이 필요할 만큼 길면 side-panel/full-page", "단일 모듈이면 spinner, 전체 화면이면 skeleton").
- 미확인 3군집: 축을 쓰기 전에 외부 원문을 먼저 확보한다. 못 찾으면 그 군집은 **만들지 않고** 사유를 남긴다 — 근거 없는 축은 통념의 배포처가 될 뿐이다.
- 검토 후 제외: 화면·서버·데이터스토어·배포·관측·디자인 — 정적 마크다운 자산만 추가.

## 결정 로그

- 군집 범위: 15 → 6 확정(2026-07-21 사용자 판정 "오판 난 자리로 좁힌다"). 근거는 VL1 기준선.
- 만점 8군집 처리: 만들지 않는다. 다른 상황에서 틀릴 가능성은 있으나, 그건 VL8 사람 관측이나 이후 케이스 추가로 드러날 때 다룬다 — 지금 지어서 채우지 않는다.
- 미확인 군집에서 원문을 못 찾으면: **만들지 않는다.** 사용자 결정 불요 — 인용 규율에서 도출.
- 그 외 사용자 소유 결정: 없음.
- status: resolved

## Step 트리

- [ ] **step-1 — 오판 배치 (3군)**
  - Artifact: `decisions/overlay-surfaces.md`(modal/drawer/bottom-sheet/full-page) · `decisions/single-choice-input.md`(radio/select/segmented/switch) · `decisions/waiting-and-absence.md`(skeleton/spinner/progress-bar/empty-state)
  - Files: 읽기 `evidence/vocabulary-in-use/vl1-baseline.md`(틀린 케이스)·`cases.yml`·`terms.yml` 해당 항목·기존 확보 원문 / 쓰기 위 3파일 + `research/2026-07-21-vl5-cluster-axis-sources.md`
  - Dependencies: none
  - Verify: `python scripts/validate-decisions.py` exit 0, 4 clusters(VL4 펼침류 포함) + 기준선이 틀린 3케이스(overlay-3·single-choice-3·waiting-3)를 규칙에 넣으면 **정답이 나온다**
  - Failure probe: 케이스에 맞춘 특수 규칙이 아닌지 검사 — 각 임계값마다 케이스 밖 상황 2개를 넣어 답이 뒤집히지 않는지 본다. 케이스 하나만 통과시키는 규칙은 과적합이라 되돌린다
  - Commit: changeset `<n>-decision-miss-batch`
- [ ] **step-2 — 미확인 배치 (3군, 원문 확보된 것만)**
  - Artifact: `decisions/navigation-scope.md` · `decisions/large-option-set.md` · `decisions/card-vs-text-expand.md` 중 **외부 원문을 확보한 것만**. 못 찾은 군집은 `research/` 에 "확인 실패 — <무엇을 찾았고 왜 부족한가>" 로 기록
  - Files: 읽기 외부 출처 원문 / 쓰기 확보된 군집 파일 + 리서치 누적 파일
  - Dependencies: step-1
  - Verify: 만든 군집 전부 validator 통과 + 모든 축에 출처 URL·confidence. 못 만든 군집은 사유가 리서치 파일에 있다
  - Failure probe: 분량을 채우려고 근거를 늘려 잡지 않았는지 검사 — 각 축의 `source_quote`가 그 축을 **직접** 말하는 문장인지 대조한다. 옆 이야기를 끌어다 붙인 축은 지운다
  - Commit: changeset `<n>-decision-unverified-batch`
- [ ] **step-3 — 전 군집 무결성 통합**
  - Artifact: 검증기에 교차 군집 검사 추가(같은 term이 여러 군집에서 모순 규칙을 갖는지) + `docs/design-system/decisions/README.md` 군집 인덱스(만점 군집을 왜 안 만들었는지 한 줄 포함)
  - Files: 쓰기 `scripts/validate-decisions.py`·`docs/design-system/decisions/README.md`
  - Dependencies: step-2
  - Verify: `python scripts/validate-decisions.py` exit 0 · 참조 무결성 위반 0 · 교차 모순 0
  - Failure probe: 고의 모순 fixture(같은 term을 두 군집에서 상반된 조건으로 pick) 투입 → exit 1 확인
  - Commit: changeset `<n>-decision-corpus-integrity`

## 검증/DoD

- **DoD**: 다룬 군집이 전부 validator를 통과하고, 기준선이 틀린 3케이스가 규칙으로 정답에 도달하며, 과적합 probe를 통과하고, 교차 모순이 0이며, 안 만든 군집(만점 8 + 원문 미확보분)의 사유가 인덱스와 리서치에 남는다.
- Evidence: `evidence/vocabulary-in-use/vl5-cluster-corpus.md`

## finding 큐

- `popover.md` 레시피와 Polaris 가이드의 충돌(VL1 floating-2에서 드러남) — 오버레이/떠있는 것 군집 작성 시 정리

## 진행 로그 (append-only)

- 2026-07-21 plan 작성 (VL1 기준선 반영해 15군집 → 6군집으로 좁힘)
