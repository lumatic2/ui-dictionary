# PLAN — VL8 사람 관측 게이트

> 생성: 2026-07-21 · 갈래: tooling · scope 결정: 관측 준비 → 사용자 관측 실행 → 발견 결함 마감
> milestone-레벨 durable plan doc.

Status: approved 2026-07-21 (horizon 전체 연쇄 승인)

## 북극성 → horizon → milestone → step (위계)

- **북극성**: 에이전트가 의도적으로 디자인된 UI를 만들게 한다 (← `OBJECTIVE.md`)
- **horizon**: 용어가 실제로 쓰이는 흐름 (← `plans/horizons/2026-07-vocabulary-in-use.md`)
- **milestone**: VL8 — 계측이 못 잡는 것을 사람이 잡는다. 준비·관측·마감 3단계이고 통합검증은 사용자 과업 기록. milestone 규모.

## 중단점 · run 전 scope 결정 (확정)

- **결정**: step-1~3. 관측에서 나온 결함이 이 horizon 범위를 넘으면(예: 사이트 표면 필요) 마감하지 않고 `plans/horizons/CANDIDATES.md`에 후보로 적재한다.
- execution mode: `continuous`
- **중단점(stop points)**: completed / 증거 있는 blocked / **step-2 사용자 관측 대기** / decision_required / user_stopped
- **진행 보고**: commentary only.
- rollback/cleanup: step-3 수정만 changeset 단위 revert. 관측 기록은 증거라 롤백 대상 아님.

## 스캐폴딩 결정

- source-of-truth: 관측 기록 = `evidence/vocabulary-in-use/ed5-observation.md`.
- 검증: 사용자 과업 성공/실패와 막힌 지점. 성공률을 사후에 재해석하지 않고 관측한 그대로 적는다.
- 배포/운영: 해당 없음 — 사람 관측 기록만 남기고 배포 대상 산출물이 없다.
- 관측 설계: 사용자가 **요구 한 문장**을 던지고, 에이전트가 ① 어떤 요소인지 판정 ② 갈린 축과 기각 대안을 제시 ③ 그 요소로 구현까지 간다. 과업 3건 — (a) 대화에서 실제로 나온 예("정보가 많은데 펼치고 접혔으면"), (b) 오버레이 군집 1건, (c) 사용자가 즉석에서 지어내는 요구 1건(우리가 준비 못 한 입력에 대한 방어력 측정).
- **사전 설명 금지**: 직전 horizon EU5에서 확인된 방식 — 사용자에게 결정 계층의 존재나 사용법을 미리 설명하지 않는다. 설명이 필요하면 그 자체가 결함이다.
- 판정 실패의 정당한 형태: 축이 안 갈려서 에이전트가 **사용자에게 한 줄 되묻는 것**은 실패가 아니다(VL6 프로토콜이 규정한 정상 경로). 실패는 근거 없이 조용히 고르거나, 틀린 요소로 구현까지 가는 것이다. 이 구분을 관측 전에 기록해둔다.
- 검토 후 제외: 서버·데이터스토어·배포·관측 인프라 — 사람 관측이라 도구 추가 없음.

## 결정 로그

- 과업 (c)를 사용자가 즉석에서 정한다 — 이건 관측 설계의 일부이지 사전 결정이 아니다. step-2 진입 시 사용자에게 요청한다.
- 관측 시점: step-1 완료 직후 정지하고 사용자에게 요청. 다른 사용자 소유 결정 없음.
- 그 외 사용자 소유 결정: 없음.
- status: resolved

## Step 트리

- [x] **step-1 — 관측 준비**
  - Artifact: `evidence/vocabulary-in-use/ed5-observation.md` 스켈레톤 — 과업 3건 정의, 사전 설명 금지 프로토콜, 성공/실패 판정 기준(위 "정당한 실패" 구분 포함), 사용할 결정 자산 상태 스냅샷(군집 수·VL7 향상 폭)
  - Files: 읽기 `evidence/vocabulary-in-use/ed4-separation.md`·`docs/design-system/entry-protocol.md` / 쓰기 관측 기록 스켈레톤
  - Dependencies: none
  - Verify: 과업 3건이 서로 다른 군집을 건드리고, 판정 기준이 관측 전에 확정되어 문서에 있다(사후 기준 조정 방지)
  - Failure probe: 과업이 답을 유도하지 않는지 점검 — 요구 문장에 `아코디언`·`모달` 같은 요소 이름이 들어가면 판정할 게 없어진다. 3건 전부에서 요소 이름 0건을 확인
  - Commit: changeset `<n>-ed5-observation-setup` (코드 변경 없음 — 설계된 핸드오프)
- [x] **step-2 — 사용자 관측 실행**
  - Artifact: (설계된 정지 — 사람의 행동이 증거) 과업별 결과 기록 — 판정한 요소·제시한 근거·사용자 판단(맞나/틀리나)·막힌 지점
  - Files: 쓰기 `evidence/vocabulary-in-use/ed5-observation.md`
  - Dependencies: step-1
  - Verify: 과업 3건 전부에 성공/실패와 사유가 기록됨. **미달이면 미달로 적는다** — 직전 horizon이 기준 6 미달을 명시하고 닫은 선례를 따른다
  - Failure probe: 기록이 관측이 아니라 해석이 되지 않았는지 점검 — 사용자 발화를 그대로 인용하고, 우리 해석은 별도 문단으로 분리한다
  - Commit: changeset `<n>-ed5-observation-verdict`
- [x] **step-3 — 발견 결함 마감**
  - Artifact: 관측에서 나온 결함 중 이 horizon 범위 내의 것을 수정 + 범위 밖은 `CANDIDATES.md` 적재
  - Files: 쓰기 결함이 가리키는 파일(`decisions/*`·`entry-protocol.md`·`decision-format.md`)·`plans/horizons/CANDIDATES.md`
  - Dependencies: step-2
  - Verify: 수정 후 `python scripts/validate-decisions.py` exit 0 + VL7 케이스 재측정으로 회귀 0 확인
  - Failure probe: 관측에서 나온 결함을 "문서 한 줄 추가"로 덮지 않았는지 점검 — 사용자가 막힌 것이 정보 부족이 아니라 구조 문제였다면 문서 추가는 마감이 아니다. 그 경우 후보로 적재하고 미마감으로 남긴다
  - Commit: changeset `<n>-ed5-finding-closure`

## 검증/DoD

- **DoD**: 과업 3건의 성공/실패와 막힌 지점이 사용자 발화 인용과 함께 기록되고, 범위 내 결함이 마감되거나 미마감 사유가 명시되며, VL7 케이스 재측정에서 회귀가 0이다.
- Evidence: `evidence/vocabulary-in-use/ed5-observation.md`

## finding 큐

- (실행 중 append)

## 진행 로그 (append-only)

- 2026-07-21 plan 작성
- 2026-07-21 step-1 완료 (cs 242) — 관측 준비, 설계된 정지로 사용자 대기
- 2026-07-21 step-2 완료 (cs 243) — 관측 실행. **미달**: 과업 3건 중 1건만 수행·그 1건 실패. 조회 절차 미준수로 거짓 "사전 밖" 판정
- 2026-07-21 step-3 완료 (cs 243) — 범위 내 마감 없음. 두 결함 모두 문서 추가로 닫히지 않아 `vocabulary-lookup-discipline` 후보 적재(failure probe가 명시한 경우). VL7 재측정은 제품 자산 무변경으로 회귀 원인이 없어 생략
- 2026-07-21 보고서 `docs/reports/2026-07-21-vl8-human-observation.md`
