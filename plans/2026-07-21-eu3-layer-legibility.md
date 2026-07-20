# PLAN — EU3 레이어 패널 판독성

> 생성: 2026-07-21 · 갈래: product · scope 결정: 타입이 아이콘으로 갈리고, 검색으로 찾을 수 있는 데까지
Status: approved (2026-07-20 — 사용자가 horizon 5 milestone을 그대로 승인)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 편집기 판독성과 조작감 (← `plans/horizons/2026-07-editor-legibility.md`)
- **milestone**: EU3 — 1000개 트리에서 미아가 되지 않는다.
- **리서치 입력**: `research/2026-07-20-editor-ui-horizon-canvas-interaction.md` §1.3·§3.3, 함의 4

## 현 상태 실사 (계획 전 확인)

**ROADMAP이 선언한 Gap 3개 중 2개는 이미 있거나 부분적으로 있다.** 없는 것만 만든다.

| 선언 | 실사 결과 |
|---|---|
| 타입별 아이콘 | **부분** — `LayersPanel.tsx:230`이 글리프 5개(`⧉ ◇ T ⌗ ▭`)로 **7종**을 표현한다. `frame`·`image`·`shape`가 전부 `▭`로 뭉친다. 1000개 트리에서 프레임과 이미지가 같아 보인다. |
| 선택 시 부모 경로 펼침 유지 | **이미 있다** — `LayersPanel.tsx:54-67`이 선택 노드의 조상을 전부 펼치고, 지우지 않으므로 유지된다. **다만 이 동작을 지키는 테스트가 없다.** |
| 검색 | **없다** — `LayersPanel.tsx`에 검색 입력도 필터도 없다. 1000개 중 이름으로 찾을 방법이 없다. |

그래서 이 milestone은 **만들기 2 + 고정하기 1**이다. 이미 있는 것을 다시 만들지 않는다.

## Scope Boundary
- **포함**: 7종 전부 구분되는 타입 아이콘, 이름 검색과 그 결과 안에서의 트리 맥락, 부모 경로 펼침 유지를 테스트로 고정, 브라우저 실조작 관측.
- **제외**:
  - 인스펙터 정보구조 — EU4.
  - 과업 관측 게이트 — EU5.
  - 레이어 다중선택 범위 선택(Shift+클릭 range) — 현재 toggle 방식 유지. finding 큐.
  - 가상 스크롤·성능 — 1000행이 이미 렌더된다. 측정해서 문제일 때만.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- rollback/cleanup: step별 독립 revert. 서명 재기준선은 근거와 함께 기록한다.

## 스캐폴딩 결정
- source-of-truth: **노드의 `kind`가 아이콘을 정한다.** 아이콘 맵을 한 곳에 두고 `kind` 전체를 망라했는지 **타입 수준에서** 강제한다 — 새 kind가 생기면 컴파일이 거부해야 한다. 지금처럼 삼항 연쇄 끝의 `: '▭'` 폴백이면 빠진 종류가 조용히 흡수된다.
- 검색은 **필터가 아니라 트리 유지**다. 매칭된 행만 남기면 계층이 사라져 어디 있는 건지 모른다. 매칭 행 + 그 조상을 함께 보이고 조상은 펼친다.
- 검색은 문서를 바꾸지 않는다 — 패널 로컬 상태다. 연산을 만들지 않는다.
- 검증: 입력(검색어·선택)에서 기대값을 유도한다. 렌더 결과를 렌더 코드로 검사하지 않는다.
- 디자인: 화면 UI다 — `askewly-design` 스킬을 호출한다(전역 규약). 사람 확인은 EU5 과업 관측이 정본.
- 배포/운영: 해당 없음 — 로컬 편집기만 바뀐다. 서버·배포면·시크릿 무관.
- 검토 후 제외: 인증·결제·시크릿·마이그레이션 — 걸리지 않음.

## 결정 로그
- status: resolved
- **선언된 Gap 중 이미 있는 것은 다시 만들지 않는다** — 부모 경로 펼침은 구현이 아니라 회귀 방지 테스트로 닫는다. 실사 결과를 계획에 반영하는 것이 계획의 일이다.
- **아이콘 망라를 타입으로 강제한다** — 폴백 문자 하나가 세 종류를 삼키는 지금 구조가 문제의 원인이다.
- **검색은 계층을 보존한다** — 평평한 결과 목록은 "어디 있는지"를 못 답한다.
- 사용자 결정 필요 항목: 없음(범위는 horizon 승인에 포함).

## Step 트리

- [ ] **step-1 — 타입이 아이콘으로 갈린다**
  - Artifact: 7종(`frame`·`group`·`code-component`·`text`·`image`·`shape`·`instance`)이 서로 다른 아이콘을 갖고, 새 kind가 추가되면 컴파일이 거부한다.
  - Files: write `apps/agent-design/src/LayersPanel.tsx`, `styles.css`, `LayersPanel.test.tsx`.
  - Dependencies: 없음
  - Verify: 7종 각각의 아이콘이 서로 다르다(중복 0). `Record<CanvasNode['kind'], …>` 로 망라를 강제.
  - Failure probe: 두 종류를 같은 아이콘으로 되돌리면 테스트가 실패한다. 맵에서 한 종류를 빼면 컴파일이 거부한다.
  - Commit: changeset `layer-kind-icons`.

- [ ] **step-2 — 이름으로 찾는다**
  - Artifact: 검색 입력에 문자를 넣으면 매칭 행과 **그 조상**만 남고 조상은 펼쳐진다. 비우면 원래 트리로 돌아온다.
  - Files: write `apps/agent-design/src/LayersPanel.tsx`, `styles.css`, `LayersPanel.test.tsx`.
  - Dependencies: step-1
  - Verify: 알려진 이름으로 검색 → 매칭 행 수가 기대와 같고, 각 매칭의 조상이 모두 보인다. 검색 중에도 선택·이름변경이 동작한다.
  - Failure probe: 조상 보존을 빼고 매칭 행만 남기면 계층 테스트가 실패한다.
  - Commit: changeset `layer-search`.

- [ ] **step-3 — 판독성 게이트**
  - Artifact: 부모 경로 펼침 유지를 테스트로 고정하고, 브라우저에서 세 동작(아이콘 구분·검색·깊은 선택)을 실측한다.
  - Files: write `apps/agent-design/src/LayersPanel.test.tsx`, `evidence/editor-legibility/eu3-layers.md`.
  - Dependencies: step-2
  - Verify: 깊이 3 노드를 캔버스에서 선택 → 패널에서 그 행이 보이고 조상이 펼쳐져 있다. 브라우저 스크린샷.
  - Failure probe: 조상 펼침 effect를 지우면 테스트가 실패한다(이미 있는 동작이 **실재함**을 증명).
  - Commit: changeset `layer-legibility-gate`.

## 검증/DoD
- **DoD**: 타입이 아이콘으로 구분되고(7종 전부), 선택 시 부모 경로가 펼쳐지며, 검색이 계층을 보존한 채 동작한다.
- **Evidence**: `evidence/editor-legibility/eu3-layers.md` + 브라우저 스크린샷

## finding 큐
- 레이어 Shift+클릭 범위 선택 없음(현재 toggle).
- 1000행 가상 스크롤 미도입 — 측정 후 판단.

## 진행 로그
- 2026-07-21 작성. 실사에서 선언된 Gap 3개 중 2개가 이미/부분적으로 존재함을 확인해, 만들 것과 고정할 것을 나눴다.
