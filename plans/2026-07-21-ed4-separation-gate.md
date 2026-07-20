# PLAN — ED4 분리력 검증 (캘리브레이션)

> 생성: 2026-07-21 · 갈래: tooling · scope 결정: 케이스 세트 · 기준선 대조 측정 · 오판 축 보정까지
> milestone-레벨 durable plan doc.

Status: 승인 대기

## 북극성 → horizon → milestone → step (위계)

- **북극성**: 에이전트가 의도적으로 디자인된 UI를 만들게 한다 (← `OBJECTIVE.md`)
- **horizon**: 요소 결정 계층 (← `plans/horizons/2026-07-element-decision-layer.md`)
- **milestone**: ED4 — 만든 것이 실제로 판정을 바꾸는지 수치로 확인한다. 케이스 작성·측정 실행·보정이 각각 독립 changeset이고 통합검증은 "기준선 대비 향상 폭". milestone 규모.

## 중단점 · run 전 scope 결정 (확정)

- **결정**: step-1~3. 향상 폭이 없으면 그 사실을 수치로 적고 축을 보정한다 — 통과할 때까지 무한 반복하지 않고, 2회 보정 후에도 향상이 없으면 finding으로 남기고 ED5로 넘긴다.
- execution mode: `continuous`
- **중단점(stop points)**: completed / 증거 있는 blocked / decision_required / risk_gate / user_stopped
- **진행 보고**: commentary only.
- rollback/cleanup: 케이스 세트·측정 로그는 evidence(기록)라 롤백 대상 아님. 축 보정만 changeset 단위 revert.

## 스캐폴딩 결정

- source-of-truth: 케이스 세트 = `evidence/element-decision-layer/ed4-cases.yml`(요구 문장·정답·정답 출처). 측정 로그 = `evidence/element-decision-layer/ed4-runs/<run>.md`.
- 검증: 정답률 수치. 기준선(결정 계층 미제공) 대 처치(제공) 대조. 같은 케이스·같은 모델·같은 프롬프트 골격, 차이는 결정 자산 제공 여부 하나.
- 배포/운영: 해당 없음 — 측정만 한다.
- **순환 논증 방지 (이 milestone의 핵심 설계 결정)**: 케이스의 정답을 우리가 쓴 규칙으로 정하면 100%가 나오는 게 당연해 아무것도 측정하지 못한다. 따라서 **정답 라벨은 외부 출처에서 가져온다** — NN/G 아티클의 사용 조건 예시, uxpatterns.dev의 `Choose X when` 예시, Carbon/Fluent/Spectrum 문서의 명시 조건. 케이스마다 `answer_source` URL 필수이며, 우리 결정 파일을 근거로 라벨링한 케이스는 세트에서 배제한다.
- 측정 주체: 백그라운드 서브에이전트(sonnet)를 판정자로 스폰한다. 기준선 에이전트에는 `terms.yml` 발췌 + 레시피 인덱스만, 처치 에이전트에는 거기에 결정 자산을 더해 준다. 에이전트는 답과 근거만 반환하고 채점은 스크립트가 한다(자기채점 금지).
- 검토 후 제외: 화면·서버·데이터스토어·배포·관측·디자인 — 측정 자산과 로그만 만든다.

## 결정 로그

- 케이스 수: **30건** 확정(군집 15개 × 2건). 근거: 군집당 최소 2건이어야 "그 군집이 갈리는가"를 볼 수 있고, 30건은 서브에이전트 2회 실행으로 감당된다. 사용자 결정 불요.
- 정답 출처 규율: 외부 출처 필수(위). 외부 출처로 라벨을 못 정하는 상황은 케이스에서 제외한다 — 애매한 케이스를 억지로 넣어 정답률을 흐리지 않는다.
- 위임: 판정자 서브에이전트 사용 = **use**. 부모가 직접 판정하면 이미 결정 자산을 읽은 상태라 기준선 측정이 오염된다. 격리된 컨텍스트가 측정의 전제. model=sonnet, background.
- 합격선: **사전에 못 박지 않는다.** 선례가 없어 의미 있는 절대 기준선이 없다 — 기준선 대비 향상 폭을 수치로 보고하고, 판정은 그 수치를 보고 내린다. 절대 합격선을 미리 정하면 숫자를 맞추는 방향으로 데이터를 손보게 된다.
- 그 외 사용자 소유 결정: 없음.
- status: resolved

## Step 트리

- [ ] **step-1 — 케이스 세트 + 기준선 측정**
  - Artifact: `evidence/element-decision-layer/ed4-cases.yml`(30건 — 요구 문장·정답 요소·`answer_source` URL·소속 군집) + 기준선 실행 로그
  - Files: 읽기 `research/2026-07-21-…prior-art.md`·외부 출처 원문·`docs/design-system/decisions/*` (케이스 작성 시엔 참고 금지, 군집 커버리지 확인용으로만) / 쓰기 `ed4-cases.yml`·`ed4-runs/baseline.md`
  - Dependencies: none
  - Verify: 30건 전부 `answer_source` 보유 + 군집 15개 전부 ≥2건 커버 + 기준선 정답률 수치 산출
  - Failure probe: 순환 논증 검사 — 케이스 30건의 `answer_source` 중 우리 레포 내부 경로가 하나라도 있으면 그 케이스를 교체한다. 또한 기준선이 이미 만점이면 그 군집은 애초에 안 헷갈리는 것이므로 **군집 자체를 finding으로 뺀다**(ED2 군집 선정 오류의 사후 적발 장치)
  - Commit: changeset `<n>-ed4-cases-and-baseline`
- [ ] **step-2 — 처치 측정 + 대조**
  - Artifact: `ed4-runs/treatment.md` + `ed4-runs/comparison.md`(케이스별 기준선/처치 답·정오·군집별 향상 폭)
  - Files: 쓰기 위 2파일
  - Dependencies: step-1
  - Verify: 30건 전부 두 조건에서 답이 기록됨 + 군집별·전체 향상 폭 수치 산출 + 처치 답에 근거(갈린 축)가 기록됨
  - Failure probe: 처치 조건에서 **정답이 오히려 틀려진 케이스**를 따로 뽑는다 — 향상 평균에 묻히는 회귀가 진짜 결함이다. 0건이 아니면 그 케이스를 step-3 보정 대상으로 넘긴다
  - Commit: changeset `<n>-ed4-treatment-comparison`
- [ ] **step-3 — 오판 축 보정**
  - Artifact: 오판·회귀 케이스가 가리키는 군집의 축·규칙 수정 + 재측정 로그 `ed4-runs/after-fix.md`
  - Files: 쓰기 `docs/design-system/decisions/<해당 군집>.md`·`ed4-runs/after-fix.md`
  - Dependencies: step-2
  - Verify: 재측정 정답률 + 보정 전후 대조. `python scripts/validate-decisions.py` 여전히 exit 0
  - Failure probe: 케이스에 맞추려고 규칙을 특수화하지 않았는지 자기점검 — 수정된 규칙마다 "이 규칙이 케이스 밖 상황에도 성립하는 근거 출처가 있는가"를 확인한다. 출처 없이 케이스만 통과시키는 수정은 되돌린다(과적합 방지)
  - Commit: changeset `<n>-ed4-axis-correction`

## 검증/DoD

- **DoD**: 30건 케이스 세트가 외부 출처 라벨로 존재하고, 기준선/처치 정답률과 군집별 향상 폭이 수치로 기록되며, 회귀 케이스가 0이거나 보정 후 사유가 남는다.
- Evidence: `evidence/element-decision-layer/ed4-separation.md`

## finding 큐

- (실행 중 append — 기준선 만점 군집, 과적합 의심 규칙)

## 진행 로그 (append-only)

- 2026-07-21 plan 작성
