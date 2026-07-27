# PLAN — EU5 판단 가능성 게이트

> 생성: 2026-07-21 · 갈래: product · scope 결정: 사람이 설명 없이 과업 3건을 수행하는지 관측하는 데까지
Status: approved (2026-07-20 — 사용자가 horizon 5 milestone을 그대로 승인)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 편집기 판독성과 조작감 (← `plans/horizons/2026-07-editor-legibility.md`)
- **milestone**: EU5 — 사람이 화면만 보고 과업을 수행할 수 있는지 **실측**한다.
- **근거**: 이 horizon의 개설 이유 자체. 사용자 판정(2026-07-20) "뭐가 뭔지 눈으로 판단이 안 간다."

## 이 milestone은 다른 넷과 성격이 다르다

EU1~EU4는 내가 만들고 내가 검증했다. **EU5의 증거는 사용자의 행동이다.**
내가 대신 수행하면 그 순간 이 게이트는 자기 출력을 보는 동어반복이 된다 —
horizon 미리 쓰는 실패 회고 1번이 정확히 그 얘기다:

> "스크린샷을 보여주고 '괜찮나요?'라고 묻는 방식은 직전 horizon에서 이미 실패했다 —
> 판단할 수 있는 사람에게만 통하는 질문이었다."

그래서 **에이전트가 할 수 있는 것은 관측 준비까지이고, 관측 자체는 사용자 차례다.**
이건 blocked가 아니라 설계된 인계 지점이다.

## 현 상태 실사 (계획 전 확인)

- 기본 문서가 **1000노드 개발 fixture**(`Node 0`~`Node 999`)다. 이름도 내용도 의미가 없어
  "요소를 고르라"는 과업이 부자연스럽다. 실제 제작물로 관측해야 한다.
- `App.tsx:527` Templates 버튼 → `TemplateGallery` 로 실제 청사진(명함 등)을 열 수 있다.
  직전 horizon에서 명함 1건이 발주 가능한 SVG까지 갔으므로 **실물이 있다.**
- EU1~EU4가 넣은 것: 핸들 역할 분리·회전, 스냅·거리 측정, 레이어 아이콘·검색, 인스펙터 기하·섹션.
  과업 3건은 이 넷을 가로지른다.

## Scope Boundary
- **포함**: 관측용 시작 상태 준비, 과업 3건의 문구와 관측 규약, 사용자 수행 결과 기록, 막힌 지점의 finding 전환.
- **제외**:
  - **과업을 에이전트가 대신 수행하는 것** — 이 milestone의 존재 이유를 무효화한다.
  - 관측에서 나온 결함의 수정 — 결과를 보고 다음 milestone/horizon으로 잡는다. 관측과 수정을 같은 step에 두면 "고치면서 관측"이 돼 원래 판독성을 못 잰다.
- execution mode: continuous
  - 단, step-2는 설계된 정지 지점이다 — 증거의 소유자가 사용자이므로 에이전트가 이어서 수행할 수 없다.
- **중단점(stop points)**: completed / blocked / decision_required / risk_gate / secret_required / external_authority_required / **user_stopped**
- rollback/cleanup: 관측용 상태는 로컬 dev 서버만 쓴다. 문서 변경 없음.

## 스캐폴딩 결정
- source-of-truth: **사용자의 수행 결과가 정본이다.** 내 스크린샷·테스트는 이 게이트의 증거가 아니다.
- 과업은 horizon 닫는 기준 6이 지정한 3건 그대로 쓴다(요소 선택·크기 변경·색 토큰 변경). 내가 유리한 과업으로 바꾸지 않는다.
- **사전 설명 금지**를 규약에 박는다. 내가 "여기 이 핸들을 잡으세요"라고 말하는 순간 측정 대상이 사라진다.
- 관측 기록은 과업별 **성공/실패 + 막힌 지점**을 남긴다. "좋아 보인다" 같은 총평은 증거가 아니다.
- 검증: 사용자의 서술을 그대로 옮긴다. 내가 해석해 성공으로 만들지 않는다.
- 디자인: 화면 UI지만 이번 step은 새 UI를 만들지 않는다 — 관측이다.
- 배포/운영: 해당 없음 — 로컬 dev 서버만.
- 검토 후 제외: 인증·결제·시크릿·마이그레이션 — 걸리지 않음.

## 결정 로그
- status: resolved
- **에이전트는 과업을 대신 수행하지 않는다** — 대신하면 게이트가 무의미하다.
- **관측 대상은 개발 fixture가 아니라 실제 제작물** — 의미 없는 `Node 417`로는 "무엇을 고를지"조차 부자연스럽다.
- **관측에서 나온 결함은 여기서 고치지 않는다** — 고치면서 재면 원래 판독성을 못 잰다. finding으로 넘긴다.
- 사용자 결정 필요 항목: 과업 수행 자체(설계된 인계).

## Step 트리

- [ ] **step-1 — 관측 준비**
  - Artifact: 실제 제작물이 열린 편집기와, 과업 3건·관측 규약이 적힌 기록지.
  - Files: write `evidence/editor-legibility/eu5-judgeability.md`(관측 규약과 빈 결과표).
  - Dependencies: 없음
  - Verify: 편집기가 실제 템플릿 문서로 뜬다. 기록지에 과업 3건과 "사전 설명 없음" 규약이 있다.
  - Failure probe: 해당 없음(준비 단계). 대신 **내가 과업 수행 방법을 설명하면 규약 위반**임을 기록지에 명시한다.
  - Commit: changeset `judgeability-observation-setup`.

- [ ] **step-2 — 사용자 관측** ⏸ **여기서 정지한다(user_stopped)**
  - Artifact: 과업별 성공/실패와 막힌 지점.
  - Files: write `evidence/editor-legibility/eu5-judgeability.md`.
  - Dependencies: step-1
  - Commit: 없음 — 사용자 서술을 받은 뒤 step-3에서 함께 커밋한다.
  - Verify: 3건 각각에 결과와 막힌 지점이 기록된다.
  - Failure probe: 에이전트가 과업을 대신 수행하거나 방법을 미리 설명하면 이 게이트는 무효다 — 그 경우 결과를 폐기하고 다시 관측한다.
  - **정지 사유**: 증거의 소유자가 사용자다. 에이전트가 이어서 수행할 수 없다.

- [ ] **step-3 — 결과 판정과 다음 행선지**
  - Artifact: 닫는 기준 6 판정, 막힌 지점의 finding 전환, horizon close 대조.
  - Files: write `evidence/editor-legibility/eu5-judgeability.md`, `ROADMAP.md`, `plans/horizons/2026-07-editor-legibility.md`.
  - Dependencies: step-2
  - Verify: 실패한 과업이 있으면 그 사실을 그대로 적고, 무엇을 고쳐야 하는지 후속으로 넘긴다.
  - Failure probe: 실패를 성공으로 재해석하면 규약 위반. 직전 horizon은 기준 미달을 미달로 적고 닫았다 — 같은 규율을 유지한다.
  - Commit: changeset `judgeability-verdict`.

## 검증/DoD
- **DoD**: 사람이 **사전 설명 없이** 화면만 보고 과업 3건을 수행하고, 그 결과(성공/실패·막힌 지점)가 기록된다.
- **Evidence**: `evidence/editor-legibility/eu5-judgeability.md`

## finding 큐
- 관측 중 나온 것들을 여기 적재한다.

## 진행 로그
- 2026-07-21 작성. step-2가 설계된 정지 지점임을 계획에 못박았다.
