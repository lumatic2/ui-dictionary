# PLAN — ECT1 토큰이 조회되고, 실재가 검증된다

> 생성: 2026-07-21 · 갈래: product · scope 결정: UI는 손대지 않는다 — 조회 API·메타데이터·검증까지
Status: approved (2026-07-21 — 사용자가 horizon 5 milestone 묶음을 승인, 위임 범위 A: horizon 전체 연쇄)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 편집기에서 색이 색으로 보이고, 바꿔진다 (← `plans/horizons/2026-07-editor-color-and-token-editing.md`)
- **milestone**: ECT1 — 화면이 물어볼 수 있는 토큰 목록이 생기고, 없는 토큰은 저장되지 않는다.
- **리서치 입력**: `research/2026-07-21-editor-color-and-token-editing-reference.md` (Penpot·Webflow 점표기 그룹핑), horizon 실사 1·3

## 왜 이게 먼저인가

ECT2의 색 선택기는 "이 문서가 쓸 수 있는 색 토큰 목록"을 물어봐야 한다. **그 질문을 받을 API가 없다.**
`documentTokens()`는 `resolve(binding)` — 이름을 주면 값을 주는 함수뿐이고, **세트 안에 어떤 이름이 있는지 열거하는 경로가 없다**(`apps/agent-design/src/documentTokens.ts:21-30`).

그리고 검증이 실재를 안 본다. `validateNodePropertyEdit`의 token 분기는 `x.y` 정규식만 본다
(`packages/canvas-core/src/properties.ts:24,46-47`). 없는 토큰도 저장된다 — 조용히 거부가 아니라 **조용히 수용**이다.

UI를 먼저 지으면 이 두 결손 위에 짓게 된다.

## Scope Boundary
- **포함**: 토큰 열거 API, 편집기 세트 `kind` 메타데이터(생성기 경유), 토큰 실재 검증, 두 어휘 격리 보장.
- **제외**:
  - 인스펙터 UI 변경 일체 — ECT2. 이 milestone이 끝나도 화면은 그대로다.
  - 토큰 정의 생성·수정 — horizon 비목표(결정 2).
  - 렌더러 — ECT4.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- rollback/cleanup: step별 독립 revert. `editorTokens.ts`는 생성물이므로 되돌릴 때 생성기부터 되돌리고 재실행한다.

## 스캐폴딩 결정
- source-of-truth: **토큰 값의 정본은 지금 자리를 바꾸지 않는다.** 편집기 어휘는 `tokens/askewly.tokens.json` → 생성기 → `editorTokens.ts`, 템플릿 어휘는 `packages/template-core/src/tokens.ts`. 이 두 갈래를 이번에 통합하지 않는다 — 통합은 horizon 비목표인 토큰 정의 편집과 한 덩어리다.
- **`kind`는 손으로 적지 않고 SSOT에서 유도한다.** `editorTokens.ts`는 "GENERATED — do not edit by hand"(`editorTokens.ts:1`)다. 생성기가 SSOT의 토큰 그룹에서 kind를 유도해 내보낸다. 손으로 적으면 SSOT와 갈라진다.
- 검증: 입력(저장하려는 값)에서 기대값을 유도한다. 열거 API는 **세트 객체를 직접 읽어** 대조한다 — API 출력을 API로 검사하지 않는다.
- 배포/운영: 해당 없음 — 로컬 편집기·라이브러리. 서버·배포면·시크릿 무관.
- 자기선언 도메인 — **데이터(토큰 스키마)**: `kind`를 추가해도 기존 소비자(`resolve`)의 계약은 안 바뀐다. 평면 `Record<string,string>`을 읽는 기존 호출부가 깨지지 않게 **덧붙이는 형태**로 낸다.
- 자기선언 도메인 — **검증 계층**: 실재검사를 넣으면 **기존 문서가 소급 무효가 될 수 있다**. 저장 시점만 막고 이미 저장된 값은 읽기를 막지 않는다(문서를 못 여는 사태 방지).
- 검토 후 제외: 인증·결제·시크릿·마이그레이션·관측 — 걸리지 않음. 디자인(화면 UI) — 이 milestone은 화면을 안 건드리므로 해당 없음(ECT2에서 `askewly-design` 스킬 호출).

## 결정 로그
- status: resolved
- **두 어휘를 통합하지 않는다** — 이미 코드에 규약으로 박힌 분리(`documentTokens.ts:12-16`)를 유지한다.
- **`kind`는 생성기가 만든다** — 손으로 적으면 SSOT와 갈라진다.
- **실재검사는 저장 시점만** — 기존 문서를 소급 무효화하지 않는다.
- 사용자 결정 필요 항목: 없음(범위는 horizon 승인에 포함).

## Step 트리

- [ ] **step-1 — 세트가 자기 토큰을 열거한다**
  - Artifact: `documentTokens(setId)`가 `listTokens()`를 내놓는다 — 각 항목은 `{ name, kind, value }`. 문서 자기 어휘의 토큰만 나온다.
  - Files: write `apps/agent-design/src/documentTokens.ts`, `apps/agent-design/src/documentTokens.test.ts`.
  - Dependencies: 없음
  - Verify: 템플릿 세트(`askewly.warm`)에서 열거한 이름 집합이 `template-core`의 세트 객체 키와 정확히 일치한다. 편집기 세트(`askewly.default`)도 `editorTokenMaps`와 일치한다. **교차 0건** — 템플릿 세트 열거에 편집기 토큰이 하나도 없고 그 역도 같다. `unknown` 세트는 빈 목록.
  - Failure probe: 열거를 두 어휘 합집합으로 바꾸면 교차 0건 테스트가 실패한다. 세트 객체에 토큰을 하나 추가하면 목록에도 나타난다(하드코딩된 목록이 아님을 증명).
  - Commit: changeset `token-enumeration`.

- [ ] **step-2 — 편집기 토큰이 자기 종류를 안다**
  - Artifact: 생성기가 `editorTokens.ts`에 토큰별 `kind`를 함께 내보내고, step-1의 열거가 그 값을 쓴다. 템플릿 어휘와 메타데이터 모양이 같아진다.
  - Files: write `apps/agent-design/scripts/generate-editor-tokens.mjs`, `apps/agent-design/src/editorTokens.ts`(생성물), `apps/agent-design/src/documentTokens.ts`, 테스트.
  - Dependencies: step-1
  - Verify: 생성기를 재실행한 산출물이 커밋된 파일과 **일치한다**(생성물 drift 없음). 모든 편집기 토큰이 `kind`를 갖고, 색 토큰만 필터하면 색만 남는다. 기존 `resolve()` 호출부가 그대로 동작한다.
  - Failure probe: SSOT에서 토큰 하나를 지우고 재생성하면 열거 결과에서도 사라진다. `kind`를 손으로 고쳐 두면 재생성 시 되돌아온다(생성물임을 증명).
  - Commit: changeset `editor-token-kind`.

- [ ] **step-3 — 없는 토큰은 저장되지 않는다**
  - Artifact: `validateNodePropertyEdit`의 token 분기가 형태검사에 더해 **실재검사**를 한다. 거부 사유가 사람이 읽는 문자열로 나온다.
  - Files: write `packages/canvas-core/src/properties.ts`, `packages/canvas-core/src/properties.test.ts`, 필요 시 `apps/agent-design/src/PropertyInspector.tsx`(검증 결과 전달 배선만 — 시각 변경 없음), `evidence/editor-color-and-token-editing/ect1-lookup.md`.
  - Dependencies: step-2
  - Verify: 실재하는 토큰은 저장된다. 실재하지 않는 토큰(`surface.nonexistent`)은 **저장되지 않고** 사유를 돌려준다. 형태가 틀린 값(`notatoken`)도 여전히 거부된다. **이미 저장된 미해결 바인딩이 있는 문서는 그대로 열린다.**
  - Failure probe: 실재검사를 제거하면 `surface.nonexistent` 저장이 통과해 테스트가 실패한다. 검증을 너무 세게 걸어 기존 fixture 문서가 안 열리면 그 테스트가 실패한다(양방향 게이트 — 프리모템 3의 교훈).
  - Commit: changeset `token-existence-validation`.

## 검증/DoD
- **DoD**: 화면이 물어볼 수 있는 토큰 목록 API가 있고(두 어휘 격리 보장), 편집기·템플릿 어휘가 같은 메타데이터 모양을 가지며, 실재하지 않는 토큰은 저장되지 않는다.
- **Evidence**: `evidence/editor-color-and-token-editing/ect1-lookup.md` + 테스트 출력 + `npm run verify`·`npm run typecheck` exit code
- **회귀 게이트**: `npm run verify` + `npm run typecheck` + `npm test`(apps/agent-design) 전부 PASS (horizon 닫는 기준 7)

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-21 작성.
