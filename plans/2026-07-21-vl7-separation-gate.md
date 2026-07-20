# PLAN — VL7 분리력 검증 (캘리브레이션)

> 생성: 2026-07-21 · 갈래: tooling · scope 결정: 처치 측정 · 기준선 대조 · 오판 축 보정까지
> milestone-레벨 durable plan doc.

Status: approved 2026-07-21 (horizon 전체 연쇄 승인)

## 북극성 → horizon → milestone → step (위계)

- **북극성**: 에이전트가 의도적으로 디자인된 UI를 만들게 한다 (← `OBJECTIVE.md`)
- **horizon**: 용어가 실제로 쓰이는 흐름 (← `plans/horizons/2026-07-vocabulary-in-use.md`)
- **milestone**: VL7 — 만든 것이 실제로 판정을 바꿨는지 수치로 확인한다. VL1이 박아둔 기준선이 대조 대상이다. 처치 측정·대조·보정 3개의 독립 changeset이고 통합검증은 군집별 향상 폭. milestone 규모.

## 중단점 · run 전 scope 결정 (확정)

- **결정**: step-1~3. 향상이 없으면 그 사실을 수치로 적고 축을 보정한다 — 통과할 때까지 무한 반복하지 않고, 2회 보정 후에도 향상이 없으면 finding으로 남기고 VL8로 넘긴다.
- execution mode: `continuous`
- **중단점(stop points)**: completed / 증거 있는 blocked / decision_required / risk_gate / user_stopped
- **진행 보고**: commentary only.
- rollback/cleanup: 측정 로그는 증거라 롤백 대상이 아니다. 축 보정만 changeset 단위 revert.

## 스캐폴딩 결정

- source-of-truth: 케이스 세트는 VL1이 만든 `evidence/vocabulary-in-use/cases.yml` 하나 — 여기서 새로 만들지 않는다(같은 자를 써야 대조가 성립한다). 측정 로그는 `evidence/vocabulary-in-use/vl7-runs/<run>.md`.
- 검증: 정답률 수치. 기준선(VL1, 현행 자산만) 대 처치(용어 배포 + 결정 데이터 + 재배선 프로토콜). 같은 케이스·같은 모델·같은 프롬프트 골격, 차이는 제공 자산 하나.
- 배포/운영: 해당 없음 — 측정만 한다.
- 측정 주체: 격리된 백그라운드 서브에이전트(sonnet). 부모는 이미 자산을 다 읽은 상태라 측정을 오염시킨다. 에이전트는 답과 근거만 반환하고 채점은 스크립트가 한다(자기채점 금지).
- 순환 논증: 정답 라벨이 외부 출처에서 왔다는 것은 VL1이 이미 보증한다. 이 milestone은 그 라벨을 **바꾸지 않는다** — 처치 결과에 맞춰 정답을 고치면 측정이 무의미해진다.
- 검토 후 제외: 화면·서버·데이터스토어·배포·관측·디자인 — 측정 로그와 데이터 보정만 만든다.

## 결정 로그

- 케이스 재작성 금지: VL1 세트를 그대로 쓴다 — 자를 바꾸면 대조가 무너진다.
- 합격선: **사전에 못 박지 않는다.** 선례가 없어 의미 있는 절대 기준이 없고, 미리 정하면 숫자를 맞추는 방향으로 데이터를 손보게 된다. 향상 폭을 보고하고 그 수치로 판정한다.
- 위임: 판정자 서브에이전트 사용 = use. 격리된 컨텍스트가 측정의 전제이며 부모 직접 판정은 불가.
- 그 외 사용자 소유 결정: 없음.
- status: resolved

## Step 트리

- [ ] **step-1 — 처치 측정**
  - Artifact: `evidence/vocabulary-in-use/vl7-runs/treatment.md` — 30건 케이스를 새 자산 전부(용어 조회·결정 군집·자산 매핑) 제공 조건에서 실행한 답과 근거
  - Files: 읽기 `evidence/vocabulary-in-use/cases.yml`·`vl1-baseline.md` / 쓰기 처치 로그
  - Dependencies: none
  - Verify: 30건 전부에 답과 **갈린 축**이 기록됨 — 근거 없이 답만 있는 건은 무효 처리하고 재실행
  - Failure probe: 처치 에이전트가 자산을 실제로 읽었는지 확인 — 응답에 인용된 축·용어 id가 실존하는지 대조한다. 지어낸 근거가 있으면 그 건은 무효이며 프롬프트 골격을 고친다
  - Commit: changeset `<n>-vl7-treatment-run`
- [ ] **step-2 — 기준선 대조 + 회귀 분리**
  - Artifact: `evidence/vocabulary-in-use/vl7-runs/comparison.md` — 케이스별 기준선/처치 답·정오·군집별 향상 폭, 그리고 **처치에서 오히려 틀려진 케이스** 목록
  - Files: 쓰기 대조 로그
  - Dependencies: step-1
  - Verify: 군집별·전체 향상 폭이 수치로 산출되고, 회귀 케이스가 평균에 묻히지 않고 따로 나열됨
  - Failure probe: 향상이 어디서 왔는지 분해 — 용어 배포만으로 오른 건과 결정 데이터로 오른 건을 구분한다. 구분이 안 되면 어느 자산이 일한 건지 모르는 것이므로 조건을 하나 더 쪼개 재측정한다
  - Commit: changeset `<n>-vl7-comparison`
- [ ] **step-3 — 오판 축 보정**
  - Artifact: 오판·회귀 케이스가 가리키는 군집의 축·규칙 수정 + 재측정 로그 `vl7-runs/after-fix.md`
  - Files: 쓰기 `docs/design-system/decisions/<해당 군집>.md`·재측정 로그
  - Dependencies: step-2
  - Verify: 재측정 정답률과 보정 전후 대조 + `python scripts/validate-decisions.py` 여전히 exit 0
  - Failure probe: 케이스에 맞추려고 규칙을 특수화하지 않았는지 자기점검 — 수정된 규칙마다 "케이스 밖 상황에도 성립하는 근거 출처가 있는가"를 확인하고, 출처 없이 케이스만 통과시키는 수정은 되돌린다(과적합 방지)
  - Commit: changeset `<n>-vl7-axis-correction`

## 검증/DoD

- **DoD**: 같은 케이스 세트에서 기준선 대비 처치 정답률과 군집별 향상 폭이 수치로 기록되고, 향상의 출처(용어 배포 / 결정 데이터)가 분해되며, 회귀 케이스가 0이거나 보정 후 사유가 남는다.
- Evidence: `evidence/vocabulary-in-use/vl7-separation.md`

## finding 큐

- (실행 중 append — 과적합 의심 규칙, 향상 없는 군집)

## 진행 로그 (append-only)

- 2026-07-21 plan 작성
