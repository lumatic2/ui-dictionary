# PLAN — ECT3 묶고 푼다

> 생성: 2026-07-21 · 갈래: product · scope 결정: 미바인딩 → 바인딩 → detach → 원시값 → 재바인딩 왕복까지
Status: approved (2026-07-21 — 사용자가 horizon 5 milestone 묶음을 승인, 위임 범위 A: horizon 전체 연쇄)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 편집기에서 색이 색으로 보이고, 바꿔진다 (← `plans/horizons/2026-07-editor-color-and-token-editing.md`)
- **milestone**: ECT3 — 안 묶인 것을 묶고, 묶인 것을 푼다.
- **리서치 입력**: `research/2026-07-21-editor-color-and-token-editing-reference.md` 관찰 2·4, horizon 결정 로그 1

## 왜 milestone 규모인가

"묶기 버튼 하나"가 아니다. **문서 모델·오퍼레이션·undo·UI 네 층이 동시에 걸린다.**

- 현재 `tokenBindings`는 `Record<string, string>`이고 `set-node-property`(token scope)는 **값 설정만** 한다(`packages/canvas-core/src/properties.ts:74`). **키를 지우는 연산이 없다** — detach는 새 동작이다.
- detach 후의 "원시 색" 상태를 문서가 표현할 수 있어야 한다. shape에는 `node.fill` 리터럴 폴백이 이미 있지만(`apps/agent-design/src/CanvasSurface.tsx:59-66`), 다른 노드 종류는 그 자리가 없다.
- undo 역함수(`packages/canvas-core/src/operations.ts:312-316`)가 새 연산을 되돌릴 수 있어야 한다.

리서치가 확인한 5개 시스템은 **전부** 미바인딩 어포던스를 갖는다(Figma 버튼 · Penpot 우클릭 · Framer "+" · Webflow 보라 점 · Tokens Studio 우클릭). 5/5 대비 우리는 0이다.

## Scope Boundary
- **포함**: 미바인딩 색 속성에 명시적 "묶기" 어포던스, detach 연산(바인딩 제거 + 원시값 상태), 원시 색 지정, 재바인딩, undo 왕복, detach 상태의 화면 표시.
- **제외**:
  - **이미지 노드** — ECT4. 렌더러가 아직 안 읽으므로 여기서 묶으면 안 칠해진다.
  - 토큰 정의 생성 — horizon 비목표(결정 2).
  - `fontFamily` 바인딩의 묶기/풀기 — 범위를 색으로 좁힌다.
  - 다중선택 일괄 바인딩 — horizon 비목표(EU4 이월 finding).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- rollback/cleanup: step별 독립 revert. 문서 모델에 필드를 더하면 기존 fixture 문서가 그대로 열리는지 매 step 확인한다.

## 스캐폴딩 결정
- source-of-truth: **detach는 새 연산으로 낸다** — 기존 `set-node-property`에 "빈 문자열이면 지움" 같은 암묵 규칙을 얹지 않는다. 암묵 규칙은 undo 역함수에서 조용히 틀린다.
- **원시 색은 기존 리터럴 자리를 쓴다** — shape의 `node.fill`. 새 필드를 만들기 전에 기존 자리로 표현되는지 먼저 본다(EU4에서 세운 "없는 것을 만들지 않는다" 규율).
- detach 상태는 **화면에 표시한다** — horizon 프리모템 2가 이 결정의 리스크(토큰 이탈이 조용히 쌓임)를 맡는다. 표시 없는 detach는 만들지 않는다.
- **detach된 노드 수를 evidence에 계측으로 남긴다** — 이 horizon이 디자인 시스템을 무너뜨리지 않았다는 걸 수치로 남기는 장치.
- 디자인: 화면 UI다 — `askewly-design` 스킬을 호출한다(전역 규약).
- 검증: 왕복을 **연산 수준**에서 고정한다. 화면 상태를 되읽지 않고 커밋된 연산 시퀀스와 문서 상태를 대조한다.
- 배포/운영: 해당 없음 — 로컬 편집기.
- 자기선언 도메인 — **문서 호환성**: 이전 버전 문서(바인딩만 있고 원시값 자리 없음)가 그대로 열려야 한다.
- 검토 후 제외: 인증·결제·시크릿·서버·관측 — 걸리지 않음.

## 결정 로그
- status: resolved
- **detach는 별도 연산** — 암묵 규칙 금지(undo 안전).
- **원시 색은 기존 리터럴 자리 우선** — 새 필드는 기존 자리로 안 될 때만.
- **표시 없는 detach 금지** — 이탈이 조용히 쌓이지 않게 한다.
- 사용자 결정 필요 항목: 없음(원시값 허용 여부는 horizon 결정 1에서 확정 — 탈출구 있음).

## 선행 milestone 의존 (plan 간 — step `Dependencies` 필드는 같은 plan의 leaf만 가리킨다)

- **ECT2 step-2(선택 팝오버)가 먼저다.** step-1의 묶기 어포던스는 그 팝오버를 재사용한다.
  따로 만들면 같은 목록이 두 벌 생기고 한쪽만 어휘 필터를 갖게 된다.

## Step 트리

- [ ] **step-1 — 안 묶인 것을 묶는다**
  - Artifact: 색 바인딩이 없는 노드의 시각 섹션에 **명시적 묶기 어포던스**가 있다. 누르면 ECT2의 선택 팝오버가 열리고, 고르면 바인딩이 생긴다.
  - Files: write `apps/agent-design/src/PropertyInspector.tsx`, `styles.css`, 테스트.
  - Dependencies: 없음
  - Verify: 바인딩 0개인 노드에서 어포던스가 보이고, 고르면 `tokenBindings`에 키가 생기며 캔버스 색이 바뀐다. 문구가 "이 노드에 묶인 토큰이 없다"는 막다른 길이 아니라 **행동 가능한 안내**다.
  - Failure probe: 어포던스를 제거하면 미바인딩 노드에서 바인딩 생성 경로가 없어져 테스트가 실패한다.
  - Commit: changeset `bind-new-token`.

- [ ] **step-2 — 묶인 것을 푼다**
  - Artifact: detach 연산 신설. 바인딩을 풀면 그 시점의 해석된 색이 원시값으로 남고, 그 상태가 화면에 표시된다. undo로 되돌아온다.
  - Files: write `packages/canvas-core/src/operations.ts`, `packages/canvas-core/src/properties.ts`, `packages/canvas-core/src/types.ts`(필요 시), `apps/agent-design/src/PropertyInspector.tsx`, 각 테스트.
  - Dependencies: step-1
  - Verify: detach 후 `tokenBindings`에서 키가 사라지고 원시값이 그 색을 유지한다(**화면 색이 안 변한다** — 푸는 것이지 바꾸는 게 아니다). undo하면 바인딩이 정확히 복원된다. detach 상태가 화면 텍스트/형태로 구분된다.
  - Failure probe: undo 역함수를 제거하면 왕복 테스트가 실패한다. detach 시 색이 바뀌면 "색 보존" 테스트가 실패한다.
  - Commit: changeset `detach-token-binding`.

- [ ] **step-3 — 원시 색을 고치고, 다시 묶는다 + 게이트**
  - Artifact: detach 상태에서 원시 색을 직접 바꿀 수 있고, 다시 토큰에 묶을 수 있다. 왕복 전체가 테스트로 고정된다.
  - Files: write `apps/agent-design/src/PropertyInspector.tsx`, 테스트, `evidence/editor-color-and-token-editing/ect3-bind-detach.md`.
  - Dependencies: step-2
  - Verify: 미바인딩 → 바인딩 → detach → 원시값 변경 → 재바인딩 **5단계 왕복**이 연산 시퀀스로 고정되고, 각 단계마다 undo가 정확히 한 단계씩 되돌린다. 이전 버전 fixture 문서가 그대로 열린다. **detach된 노드 수 계측**을 evidence에 기록한다.
  - Failure probe: 왕복 중 한 연산을 빼면 시퀀스 테스트가 실패한다. 구 fixture를 열지 못하면 호환성 테스트가 실패한다.
  - Commit: changeset `raw-color-and-rebind`.

## 검증/DoD
- **DoD**: 색이 안 묶인 노드에 색을 묶을 수 있고, 묶인 색을 풀어 원시 색으로 벗어날 수 있으며, 그 상태가 화면에 보이고 undo로 전 구간이 되돌아온다.
- **Evidence**: `evidence/editor-color-and-token-editing/ect3-bind-detach.md` + 5단계 왕복 테스트 출력 + detach 계측
- **회귀 게이트**: `npm run verify` + `npm run typecheck` + `npm test` 전부 PASS

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-21 작성.
