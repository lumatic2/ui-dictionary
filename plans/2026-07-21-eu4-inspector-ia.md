# PLAN — EU4 인스펙터 정보구조

> 생성: 2026-07-21 · 갈래: product · scope 결정: 기하값을 읽고 고칠 수 있고, 섹션 순서가 규약을 따르는 데까지
Status: approved (2026-07-20 — 사용자가 horizon 5 milestone을 그대로 승인)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 편집기 판독성과 조작감 (← `plans/horizons/2026-07-editor-legibility.md`)
- **milestone**: EU4 — 선택한 것의 값이 읽히고, 고칠 수 있다.
- **리서치 입력**: `research/2026-07-20-editor-ui-horizon-canvas-interaction.md` §1.4·§3.4, 함의 5

## 현 상태 실사 (계획 전 확인)

**선언은 "순서 재배치"였는데, 실사해보니 순서 이전에 기하값이 통째로 없다.**

- **위치·크기를 볼 수도 고칠 수도 없다.** `properties.ts:83 propertyFieldsForNode()`가 내놓는
  필드는 layout mode·sizing·gap·padding·token·prop·variant·override뿐이다. `bounds`의
  `x`·`y`·`width`·`height`가 **하나도 없다.** 인스펙터의 "Width/Height"는 숫자가 아니라
  `fixed|hug|fill` **사이징 모드**다 — 이름이 같아서 더 헷갈린다.
- **EU1에서 넣은 `rotation`도 인스펙터에 없다.** 회전은 되는데 각도를 읽을 방법이 없다.
- **섹션이 없다.** `PropertyInspector.tsx:81-107`은 `<label>` 평면 나열이다. 기하/구조/시각/내보내기
  구분이 없고 제목도 없다. 리서치가 확인한 Figma·Penpot 공통 순서와 대조할 대상 자체가 없다.
- **내보내기 섹션 없음.**
- 선택 종류별 노출은 **부분** — props·variants·overrides는 kind로 갈리지만, layout 5개 필드는
  종류와 무관하게 늘 나온다.

**"뭐가 뭔지 눈으로 판단이 안 간다"의 상당 부분이 여기일 수 있다** — 캔버스에서 요소를 골라도
그 요소가 어디에 얼마나 큰지 화면 어디에도 숫자로 안 나온다.

## Scope Boundary
- **포함**: 기하 필드(x·y·width·height·rotation) 읽기·쓰기, 섹션 구분과 규약 순서(기하→구조→시각→내보내기), 선택 종류별 노출 규칙, 다중선택 표시.
- **제외**:
  - 내보내기 **기능** 자체 — 섹션 자리와 현재 상태 표시까지. 실제 내보내기는 template-core 소관이며 EU 범위 밖.
  - Fill/Stroke/Effects 편집 — 현재 문서 모델에 stroke·effect가 없다. 없는 것을 인스펙터에 만들지 않는다.
  - 과업 관측 게이트 — EU5.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- rollback/cleanup: step별 독립 revert. 서명 재기준선은 근거와 함께 기록한다.

## 스캐폴딩 결정
- source-of-truth: **기하 편집은 기존 연산으로 커밋한다** — 위치·크기는 `transform-nodes`, 각도는
  `rotate-nodes`. 인스펙터 전용 경로를 새로 만들면 캔버스 드래그와 인스펙터가 서로 다른 문서 변경
  경로를 갖게 되고, 하나만 undo에 잡히는 사태가 난다.
- **기하는 `propertyFieldsForNode`에 섞지 않는다.** 그 함수는 `NodePropertyEdit`(prop/override/
  variant/token/layout) 계약을 따르고 검증도 그 축으로 돼 있다. 기하는 연산이 다르므로 별도로 낸다.
- 섹션 순서는 리서치가 **Figma·Penpot 일치**로 확인한 순서를 따른다(기하→구조→시각→내보내기).
  우리가 지어낸 순서가 아님을 문서에 남긴다.
- 검증: 입력(타이핑한 값)에서 기대값을 유도한다. 커밋된 **연산**을 본다 — 렌더된 입력값을 되읽지 않는다.
- 디자인: 화면 UI다 — `askewly-design` 스킬을 호출한다(전역 규약). 사람 확인은 EU5가 정본.
- 배포/운영: 해당 없음 — 로컬 편집기와 라이브러리만. 서버·배포면·시크릿 무관.
- 검토 후 제외: 인증·결제·시크릿·마이그레이션 — 걸리지 않음.

## 결정 로그
- status: resolved
- **기하 필드를 만든다** — 순서 재배치보다 이게 먼저다. 없는 것을 재배치할 수는 없다.
- **기존 연산 재사용** — 인스펙터 전용 변경 경로를 만들지 않는다(undo 분열 방지).
- **없는 것은 만들지 않는다** — stroke·effect는 문서 모델에 없으므로 인스펙터에 자리를 만들지 않는다. 빈 섹션은 판독성을 낮춘다.
- 사용자 결정 필요 항목: 없음(범위는 horizon 승인에 포함).

## Step 트리

- [ ] **step-1 — 값이 보이고, 고쳐진다**
  - Artifact: 선택한 노드의 `x`·`y`·`width`·`height`·`rotation`이 숫자로 보이고, 타이핑하면 문서가 바뀐다.
  - Files: write `apps/agent-design/src/PropertyInspector.tsx`, `styles.css`, `App.test.tsx` 또는 새 테스트.
  - Dependencies: 없음
  - Verify: 각 필드에 값을 넣으면 그에 맞는 연산(`transform-nodes`/`rotate-nodes`)이 커밋되고, 값은 문서에서 읽어온 것과 같다. 잘못된 값(빈칸·문자·음수 크기)은 거부한다.
  - Failure probe: 커밋을 제거하면 테스트가 실패한다. 값을 문서가 아닌 로컬 상태에서만 읽으면 문서 갱신 후 표시가 안 따라오는 테스트가 실패한다.
  - Commit: changeset `inspector-geometry`.

- [ ] **step-2 — 섹션이 규약 순서를 따른다**
  - Artifact: 기하→구조→시각→내보내기 순서의 제목 있는 섹션. 순서가 테스트로 고정된다.
  - Files: write `apps/agent-design/src/PropertyInspector.tsx`, `styles.css`, 테스트.
  - Dependencies: step-1
  - Verify: DOM 상 섹션 제목의 등장 순서가 규약과 일치한다. 각 필드가 올바른 섹션에 속한다.
  - Failure probe: 두 섹션 순서를 바꾸면 테스트가 실패한다.
  - Commit: changeset `inspector-sections`.

- [ ] **step-3 — 선택 종류에 따라 달라진다 + 게이트**
  - Artifact: 선택 없음·단일·다중, 그리고 노드 종류에 따라 노출이 달라진다. 브라우저 실조작 관측.
  - Files: write `apps/agent-design/src/PropertyInspector.tsx`, 테스트, `evidence/editor-legibility/eu4-inspector.md`.
  - Dependencies: step-2
  - Verify: 다중선택 시 공통 필드만·개수 표시. code-component에만 Prop/Variant, instance에만 Override. 브라우저 스크린샷 3종.
  - Failure probe: 종류 조건을 제거하면 잘못된 종류에 필드가 나타나 테스트가 실패한다.
  - Commit: changeset `inspector-conditional-exposure`.

## 검증/DoD
- **DoD**: 기하→구조→시각→내보내기 순서를 따르고, 선택 종류에 따라 노출이 달라지며, **선택한 요소의 위치·크기·각도를 읽고 고칠 수 있다**.
- **Evidence**: `evidence/editor-legibility/eu4-inspector.md` + 선택 종류별 스크린샷

## finding 큐
- stroke·effect는 문서 모델에 없다 — 시각 섹션이 토큰 바인딩뿐이다.
- 내보내기는 자리만 만들고 기능은 template-core 소관.

## 진행 로그
- 2026-07-21 작성. 실사에서 기하값이 통째로 없음을 확인해 step-1을 "순서"가 아니라 "존재"로 잡았다.
