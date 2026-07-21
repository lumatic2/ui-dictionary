# PLAN — VL1 흐름 실사 + 기준선

> 생성: 2026-07-21 · 갈래: tooling · scope 결정: 현행 호출 경로 계측 · 갭 장부 · 기준선 정답률 측정까지
> milestone-레벨 durable plan doc.

Status: approved 2026-07-21 (horizon 전체 연쇄 승인)

## 북극성 → horizon → milestone → step (위계)

- **북극성**: 에이전트가 "일반적인 AI 결과물"이 아니라 의도적으로 디자인된 UI를 만들게 한다 (← `OBJECTIVE.md`)
- **horizon**: 용어가 실제로 쓰이는 흐름 (← `plans/horizons/2026-07-vocabulary-in-use.md`)
- **milestone**: VL1 — 고치기 전에 잰다. 현행 경로 계측·갭 장부·기준선 측정 3개의 독립 changeset이고, 통합검증은 "기준선 정답률 수치가 나왔는가". 직전 horizon에서 선언 Gap 3개 중 2개가 실제와 달랐던 실패를 구조적으로 막는 자리라 milestone 규모.

## 중단점 · run 전 scope 결정 (확정)

- **결정**: step-1~3. 발견한 결함은 이 milestone에서 고치지 않는다 — 장부에 적고 후속 milestone이 소비한다.
- execution mode: `continuous`
- **중단점(stop points)**: completed / 증거 있는 blocked / decision_required / risk_gate / user_stopped
- **진행 보고**: commentary only. 미완 leaf 는 턴 종료점이 아니다.
- rollback/cleanup: 산출물이 전부 증거 문서라 롤백 대상이 아니다. 계측 중 띄운 로컬 서버는 측정 종료 시 정리한다.

## 스캐폴딩 결정

- source-of-truth: 갭 장부 = `evidence/vocabulary-in-use/vl1-flow-audit.md`. 기준선 = `evidence/vocabulary-in-use/vl1-baseline.md` + 케이스 세트 `evidence/vocabulary-in-use/cases.yml`.
- 검증: 계측은 관측 기록(fetch 목록·해소 실패 목록·수치)으로, 기준선은 정답률 수치로 검증한다. 계측이 재현 가능하도록 사용한 커맨드를 장부에 적는다.
- 배포/운영: 해당 없음 — 측정만 하고 배포 자산을 만들지 않는다.
- 계측 방법: `askewly-design` 스킬 소스(`~/projects/custom-skills/promoted/askewly-design/SKILL.md`)가 지시하는 경로를 그대로 따라가며, ① 실제로 fetch되는 자산 목록과 순서 ② 각 자산이 지시하는 다음 fetch ③ 해소 불가능한 참조를 전부 기록한다. 배포본(`ui.askewly.com`) 기준으로 재며, 로컬 파일이 있다는 이유로 해소된 것으로 치지 않는다.
- 케이스 세트: VL7의 처치 측정과 **같은 세트**를 여기서 만든다. 정답 라벨은 외부 출처(NN/G·uxpatterns·Carbon·Fluent·Spectrum)에서 가져오며 `answer_source` URL 필수 — 우리 규칙으로 라벨링하면 순환 논증이라 측정이 무의미해진다.
- 측정 주체: 격리된 백그라운드 서브에이전트(sonnet). 부모는 이미 갭을 다 읽은 상태라 기준선을 오염시킨다. 에이전트는 답과 근거만 반환하고 채점은 스크립트가 한다(자기채점 금지).
- 검토 후 제외: 화면·서버·데이터스토어·배포·디자인 — 측정 산출물만 만든다. 관측 인프라 — 기존 도구(fetch·서브에이전트)로 충분해 새로 세우지 않는다.

## 결정 로그

- 계측 기준을 배포본으로 할 것인가 로컬로 할 것인가: **배포본 확정**. 근거: 에이전트가 실제로 겪는 것이 배포본이고, 로컬 기준으로 재면 끊긴 참조 81건이 전부 정상으로 보인다.
- 케이스 수: **30건** 확정(군집 15개 × 2건). 근거: 군집당 최소 2건이어야 그 군집이 갈리는지 볼 수 있고, 서브에이전트 실행 2회로 감당된다.
- 합격선: **사전에 못 박지 않는다.** 선례가 없어 의미 있는 절대 기준이 없고, 미리 정하면 숫자를 맞추는 방향으로 데이터를 손보게 된다. 향상 폭으로 판정한다.
- 그 외 사용자 소유 결정: 없음.
- status: resolved

## Step 트리

- [ ] **step-1 — 현행 경로 계측**
  - Artifact: `evidence/vocabulary-in-use/vl1-flow-audit.md` — 호출부터 구현까지 실제 fetch 순서·자산 목록·각 자산이 지시하는 다음 단계·컨텍스트 비용(바이트) 기록
  - Files: 읽기 `~/projects/custom-skills/promoted/askewly-design/SKILL.md`·`docs/design-system/entry-protocol.md`·배포본 `llms.txt` / 쓰기 갭 장부
  - Dependencies: none
  - Verify: 장부에 fetch 체인이 끊김 없이 기록되고, 각 단계마다 "여기서 용어 사전이 등장하는가"가 명시적으로 답해져 있다
  - Failure probe: 문서를 읽고 추정한 경로가 아니라 실제로 따라간 경로인지 검사 — 배포 URL을 하나 이상 실제로 fetch해 응답 첫 줄을 장부에 붙인다. 응답을 못 붙인 단계는 "미확인"으로 표기하고 추정으로 메우지 않는다
  - Commit: changeset `<n>-vl1-flow-audit`
- [ ] **step-2 — 갭 장부 계수**
  - Artifact: 같은 장부에 수치 절 추가 — 끊긴 `term_refs` 전수(파일·이름), 용어 커버리지(레시피/코드자산이 가리키는 용어 비율), 프로토콜의 용어 언급 횟수, 자산 없는 용어 수
  - Files: 읽기 `recipes/*/*.md`·`docs/ui-vocabulary/terms.yml`·`examples/ui-vocabulary-site/public/llms.txt` / 쓰기 갭 장부 + 계수 스크립트 `scripts/audit-vocabulary-reach.mjs`
  - Dependencies: step-1
  - Verify: `node scripts/audit-vocabulary-reach.mjs` 실행 결과가 장부 수치와 일치 — 손으로 센 숫자가 아니라 재현 가능한 계측이어야 한다
  - Failure probe: 스크립트가 배포본 기준으로 세는지 확인 — 로컬 파일 존재를 해소로 치면 끊긴 참조가 0으로 나온다. 로컬만 있는 참조를 고의로 넣어 **끊김으로 계수되는지** 확인한다
  - Commit: changeset `<n>-vl1-reach-audit-script`
- [ ] **step-3 — 케이스 세트 + 기준선 측정**
  - Artifact: `evidence/vocabulary-in-use/cases.yml`(30건 — 요구 문장·정답 요소·`answer_source` URL·소속 군집) + `evidence/vocabulary-in-use/vl1-baseline.md`(현행 자산만 준 조건의 정답률)
  - Files: 읽기 `research/2026-07-21-element-decision-layer-…md`·외부 출처 원문 / 쓰기 케이스 세트·기준선 기록
  - Dependencies: step-2
  - Verify: 30건 전부 `answer_source` 보유 + 군집 15개 전부 ≥2건 커버 + 기준선 정답률이 군집별·전체로 산출됨
  - Failure probe: 순환 논증 검사 — `answer_source`에 우리 레포 내부 경로가 하나라도 있으면 그 케이스를 교체한다. 또한 기준선이 이미 만점인 군집은 애초에 안 헷갈리는 것이므로 장부에 표시해 VL5 군집 선정에서 뺀다
  - Commit: changeset `<n>-vl1-cases-and-baseline`

## 검증/DoD

- **DoD**: 현행 경로가 실제 fetch 응답과 함께 기록되고, 갭 수치가 재현 가능한 스크립트로 계수되며, 외부 출처 라벨 30건 케이스의 기준선 정답률이 군집별로 나온다.
- Evidence: `evidence/vocabulary-in-use/vl1-flow-audit.md`, `vl1-baseline.md`

## finding 큐

- (실행 중 append)

## 진행 로그 (append-only)

- 2026-07-21 plan 작성
