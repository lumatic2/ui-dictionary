# PLAN — ED1 판별 데이터 계약

> 생성: 2026-07-21 · 갈래: tooling · scope 결정: 포맷 계약 + 검증기 + 첫 군집(펼침류) 1개까지
> milestone-레벨 durable plan doc.

Status: 승인 대기

## 북극성 → horizon → milestone → step (위계)

- **북극성**: 에이전트가 "일반적인 AI 결과물"이 아니라 의도적으로 디자인된 UI를 만들게 한다 (← `OBJECTIVE.md`)
- **horizon**: 요소 결정 계층 (← `plans/horizons/2026-07-element-decision-layer.md`)
- **milestone**: ED1 — 판별 축을 담는 데이터 포맷을 정하고, 기계 검증기를 세우고, 첫 군집을 실제로 채운다. 3개의 독립 changeset(계약 문서·검증기·데이터)이고 통합검증은 "검증기가 첫 군집을 통과하는가" — milestone 규모.

## 중단점 · run 전 scope 결정 (확정)

- **결정**: step-1~3 전부. 두 번째 군집부터는 ED2.
- execution mode: `continuous`
- **중단점(stop points)**: completed / 증거 있는 blocked / decision_required / risk_gate / user_stopped
- **진행 보고**: commentary only. 미완 leaf 는 턴 종료점이 아니다.
- rollback/cleanup: changeset 단위 `git revert`. 신규 파일만 추가하므로 기존 자산 파괴 없음. 임시 자원 없음.

## 스캐폴딩 결정

- source-of-truth: 판별 데이터 정본 = `docs/design-system/decisions/<cluster-id>.md` (YAML frontmatter + 마크다운 본문 — `recipes/`와 같은 관례). 포맷 계약 정본 = `docs/design-system/decision-format.md` (`recipe-format.md`와 짝).
- 검증: `python scripts/validate-decisions.py` — ① frontmatter 필수 필드 ② `candidates`의 모든 id가 `docs/ui-vocabulary/terms.yml`에 실존 ③ 모든 축에 `source` + `confidence` 존재 ④ `rules`가 가리키는 `pick`이 `candidates` 안에 있음. 기존 `validate-recipes.py`·`validate-ui-vocabulary.py`와 같은 자리·같은 호출 방식.
- 배포/운영: 이 milestone은 배포 없음 — llms.txt 등재는 ED3 소관. (해당 없음 — ED3에서 처리)
- 데이터 스키마: frontmatter 키 = `id · name · question · candidates · axes[] · rules[] · default · term_refs · source_refs · last_verified`. 축 레코드 = `id · question · values · source · confidence(high|medium|low)`. 규칙 레코드 = `when(축→값) · pick · because`. 근거: 선례 조사에서 uxpatterns.dev의 4단 구조(결정 규칙·매트릭스·choose-when·기본값)가 가장 가까운 형식 모델로 확인됨(`research/2026-07-21-element-decision-layer-…md` §2).
- 문서 본문 계약: frontmatter가 기계 판정용, 본문은 사람이 읽는 비교 매트릭스 + 기각 사유 서술. 레시피와 동일한 이중 구조.
- 검토 후 제외: 화면·서버·데이터스토어·관측 — 정적 마크다운 자산과 파이썬 검증기만 추가하므로 걸리지 않는다. 디자인 — 사람이 보는 표면을 만들지 않는다(사이트는 horizon 범위 밖).

## 결정 로그

- 데이터 형식: YAML 단독 파일 vs 마크다운+frontmatter → **마크다운+frontmatter 확정**(2026-07-21). 근거: 레포의 `recipes/`가 이미 이 형식이고, llms.txt가 마크다운을 배포하며, 사람이 읽는 비교 서술과 기계가 읽는 축을 한 파일에 둘 수 있다. 사용자 결정 불요 — 레포 관례에서 도출됨.
- 저장 위치: `docs/ui-vocabulary/` vs `docs/design-system/` → **`docs/design-system/decisions/` 확정**. 근거: 소비처가 에이전트 프로토콜이고 `entry-protocol.md`가 같은 폴더에 산다. `terms.yml`은 용어 원본 데이터지 판정 자산이 아니다.
- 첫 군집: **펼침류**(accordion/tabs/disclosure/disclosure-card/stepper/drawer) 확정. 근거: 사용자가 대화에서 직접 든 예시이고, NN/G 원문 근거가 가장 두껍다.
- 그 외 사용자 소유 결정: 없음.
- status: resolved

## Step 트리

- [ ] **step-1 — 포맷 계약 문서**
  - Artifact: `docs/design-system/decision-format.md` — frontmatter 스키마·축/규칙 레코드 정의·본문 구조·파일 위치 규약·`recipe-format.md`와의 관계 명시
  - Files: 읽기 `docs/design-system/recipe-format.md`·`pattern-taxonomy.md`·`agent-asset-model.md` / 쓰기 `docs/design-system/decision-format.md`
  - Dependencies: none
  - Verify: 문서에 스키마 필수 필드 전부 정의됨 + `pattern-taxonomy.md` 용어(term/pattern/surface)와 충돌하는 신조어 0건 (grep으로 대조)
  - Failure probe: 계약이 실존 데이터를 못 담는 경우를 잡는다 — 펼침류 후보 6종을 계약대로 종이 위에서 표현해보고, 표현 불가 필드가 나오면 계약을 고친다
  - Commit: changeset `<n>-decision-format-contract`
- [ ] **step-2 — 검증기**
  - Artifact: `scripts/validate-decisions.py` — 위 4가지 검사 수행, 위반 시 파일·필드를 짚어 exit 1
  - Files: 읽기 `scripts/validate-recipes.py`·`scripts/validate-ui-vocabulary.py`(호출 관례·출력 형식 맞추기) / 쓰기 `scripts/validate-decisions.py`
  - Dependencies: step-1
  - Verify: `python scripts/validate-decisions.py` 실행 — 데이터 0건 상태에서 exit 0 + "0 clusters" 보고
  - Failure probe: 고의로 깨뜨린 fixture 4종(존재하지 않는 term id / 축에 source 누락 / rules의 pick이 candidates 밖 / frontmatter 필수 필드 누락)을 각각 넣어 **4건 모두 exit 1 + 원인 지목**을 확인한다. 하나라도 통과하면 검증기 결함
  - Commit: changeset `<n>-decision-validator`
- [ ] **step-3 — 첫 군집(펼침류)**
  - Artifact: `docs/design-system/decisions/disclosure-family.md` — 후보 6종, 축 최소 4개(섹션 수·동시 열람 필요성·콘텐츠 길이/균등성·순차성), 각 축에 NN/G 출처 URL + confidence, 규칙과 기본값, 본문 비교 매트릭스
  - Files: 읽기 `docs/ui-vocabulary/terms.yml`(후보 6종 항목)·`research/2026-07-21-element-decision-layer-…md` §4 / 쓰기 `docs/design-system/decisions/disclosure-family.md`
  - Dependencies: step-1, step-2
  - Verify: `python scripts/validate-decisions.py` exit 0 + "1 cluster" · 축 4개 이상 · 근거 없는 숫자 임계값에 `confidence: low` 표기 확인
  - Failure probe: 판정이 실제로 갈리는지 종이 검증 — 요구 문장 5개("FAQ 20개", "설정 4묶음을 나란히 비교", "부가 정보 한 덩어리", "가입 3단계", "목록 유지한 채 상세 편집")를 규칙에 통과시켜 **서로 다른 답이 5개 나오는지** 확인. 두 문장이 같은 답으로 뭉치면 축이 부족한 것 — 축을 추가한다
  - Commit: changeset `<n>-disclosure-family-decision`

## 검증/DoD

- **DoD**: `python scripts/validate-decisions.py`가 exit 0으로 1개 군집을 검증하고, 그 군집의 규칙이 서로 다른 요구 문장 5개를 서로 다른 요소로 가른다(step-3 failure probe 기록). 계약 문서·검증기·데이터 3자가 서로를 참조한다.
- Evidence: `evidence/element-decision-layer/ed1-data-contract.md`

## finding 큐

- (실행 중 append)

## 진행 로그 (append-only)

- 2026-07-21 plan 작성
