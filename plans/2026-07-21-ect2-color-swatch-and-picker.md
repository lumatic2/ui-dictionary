# PLAN — ECT2 색이 색으로 보인다

> 생성: 2026-07-21 · 갈래: product · scope 결정: **이미 묶여 있는** 색을 보고 바꾸는 데까지 — 새로 묶기는 ECT3
Status: approved (2026-07-21 — 사용자가 horizon 5 milestone 묶음을 승인, 위임 범위 A: horizon 전체 연쇄)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 편집기에서 색이 색으로 보이고, 바꿔진다 (← `plans/horizons/2026-07-editor-color-and-token-editing.md`)
- **milestone**: ECT2 — `Token · fill` 자유 텍스트가 스와치와 선택 목록으로 바뀐다.
- **리서치 입력**: `research/2026-07-21-editor-color-and-token-editing-reference.md` §1(Figma)·§2(Penpot)·§4(Webflow), 관찰 1·3·5

## 이 milestone이 정확히 되돌리는 것

EU5 관측 직후 계측한 두 수치가 이 milestone의 과녁이다(`evidence/editor-legibility/eu5-judgeability.md`):

| 계측 | EU5 | ECT2 목표 |
|---|---|---|
| 화면에 "색"이라는 단어 | 0건 | ≥1건 |
| 색 견본 | 0개 | 그 노드가 쓸 수 있는 색 토큰 수만큼 |

## Scope Boundary
- **포함**: 시각 섹션의 색 필드를 스와치+토큰 이름 컨트롤로 교체, 검색 가능한 선택 팝오버(자기 어휘 color 토큰만, 점표기 그룹), 사용자 언어 라벨, 키보드 조작.
- **제외**:
  - **미바인딩 노드에 새로 묶기 · detach** — ECT3. 이 milestone은 **이미 바인딩이 있는** 속성만 다룬다.
  - 이미지 노드 — ECT4(렌더러가 아직 안 읽는다).
  - `fontFamily` 토큰 컨트롤 — 색이 아니다. 자유 텍스트 그대로 둔다(범위를 색으로 좁힌다).
  - 토큰 정의 생성 — horizon 비목표.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- rollback/cleanup: step별 독립 revert. 스타일 추가는 `styles.css`에 국소화해 되돌리기 쉽게 둔다.

## 스캐폴딩 결정
- source-of-truth: **견본에 칠하는 색은 렌더러가 쓰는 그 함수에서 얻는다** — `documentTokens(setId).resolve()`(`apps/agent-design/src/documentTokens.ts:32`). 견본용 색 해석 경로를 따로 만들면 **견본과 캔버스가 다른 색을 보여주는** 사태가 난다. 이게 이 milestone에서 가장 조용히 틀리기 쉬운 지점이다.
- 목록은 ECT1의 열거 API에서 얻는다. UI가 옵션을 손으로 적으면 목록과 실재가 어긋난다 — **이미 한 번 난 사고**다(`documentTokens.ts:68-73`의 드롭다운 사고 기록).
- 그룹핑은 **이름 표기법에서 유도한다**(점표기 `surface.canvas` → `surface` 그룹). 리서치가 확인한 Penpot(점표기)·Webflow(슬래시) 방식이고, 우리 토큰은 이미 점표기다. 그룹 목록을 손으로 적지 않는다.
- 바인딩 상태 신호는 **형태+라벨**로 준다 — 색(Webflow 보라 하이라이트) 방식은 라이트/다크에서 대비 문제가 생긴다(리서치 관찰 5).
- 디자인: 화면 UI다 — 코드 쓰기 전에 `askewly-design` 스킬을 호출한다(전역 규약). 사람 확인은 ECT5가 정본.
- 검증: **브라우저 계산값**으로 잰다. 견본에 칠해진 색은 렌더 코드가 아니라 `getComputedStyle`로 읽어 토큰 값과 대조한다(자기 출력을 자기 코드로 검사하지 않는다 — 직전 horizon에서 3번 난 유형).
- 배포/운영: 해당 없음 — 로컬 편집기.
- 자기선언 도메인 — **접근성**: 팝오버는 키보드로 열고·이동하고·고르고·Esc로 닫을 수 있어야 한다. 포커스가 갇히면 안 된다(프리모템 6).
- 검토 후 제외: 인증·결제·시크릿·데이터 마이그레이션·서버·관측 — 걸리지 않음.

## 결정 로그
- status: resolved
- **견본 색과 캔버스 색은 같은 함수에서 온다** — 별도 해석 경로 금지.
- **목록·그룹을 손으로 적지 않는다** — 열거 API와 이름 표기법에서 유도.
- **범위를 색으로 좁힌다** — `fontFamily` 토큰은 이번에 안 건드린다.
- 사용자 결정 필요 항목: 없음. 라벨 문구("채움 색" 등)는 사용자 언어 원칙을 따르되 ECT5 관측에서 실증한다.

## 선행 milestone 의존 (plan 간 — step `Dependencies` 필드는 같은 plan의 leaf만 가리킨다)

- **ECT1 step-1(열거 API)·step-2(`kind`)가 먼저다.** 이 milestone의 목록·필터가 그 위에 선다.
  ECT1 없이 착수하면 UI가 옵션을 손으로 적게 되고, 그게 이미 한 번 난 사고다.

## Step 트리

- [ ] **step-1 — 색이 견본으로 보인다**
  - Artifact: 시각 섹션의 색 바인딩이 자유 텍스트 대신 **해석된 색을 칠한 견본 + 토큰 이름**으로 보인다. 라벨이 사용자 언어다(`Token · fill` → "채움 색").
  - Files: write `apps/agent-design/src/PropertyInspector.tsx`, `apps/agent-design/src/styles.css`, `apps/agent-design/src/PropertyInspector.test.tsx`.
  - Dependencies: 없음
  - Verify: 견본의 계산된 배경색이 `documentTokens().resolve(binding)` 값과 일치한다. 화면 텍스트에 "색"이 ≥1건 등장한다. 해석 실패한 바인딩은 견본 대신 **미해결 표시**가 뜬다(조용한 회색 폴백 금지).
  - Failure probe: 토큰 값을 바꾸면 견본 색도 따라 바뀐다(하드코딩이 아님을 증명). 견본을 별도 팔레트에서 칠하게 바꾸면 캔버스 대조 테스트가 실패한다.
  - Commit: changeset `color-swatch`.

- [ ] **step-2 — 목록에서 고른다**
  - Artifact: 견본을 누르면 선택 팝오버가 열린다. 그 문서 어휘의 **color 토큰만**, 각각 견본과 함께, 점표기 그룹으로, 검색 가능하게.
  - Files: write `apps/agent-design/src/PropertyInspector.tsx`(또는 새 `TokenColorPicker.tsx`), `styles.css`, 테스트.
  - Dependencies: step-1
  - Verify: 템플릿 문서에서 편집기 토큰 **0건**, 편집기 문서에서 템플릿 토큰 **0건**(양방향). `fontFamily` 토큰 0건. 검색어를 넣으면 목록이 줄고 그룹 계층이 보존된다. 고르면 `set-node-property` 연산이 커밋되고 캔버스 색이 바뀐다.
  - Failure probe: 어휘 필터를 제거하면 교차 0건 테스트가 양방향 모두 실패한다. kind 필터를 제거하면 `type.heading`이 색 목록에 나타나 실패한다.
  - Commit: changeset `token-color-picker`.

- [ ] **step-3 — 키보드로도 되고, 사람이 본다**
  - Artifact: 팝오버를 키보드로 열고·이동하고·고르고·Esc로 닫는다. 포커스가 갇히지 않는다. 브라우저 실조작 관측 + 계측.
  - Files: write `apps/agent-design/src/PropertyInspector.tsx` 또는 `TokenColorPicker.tsx`, 테스트, `evidence/editor-color-and-token-editing/ect2-swatch.md`.
  - Dependencies: step-2
  - Verify: 키보드만으로 색 변경 1회 완주. Esc로 닫으면 포커스가 견본으로 돌아온다. 브라우저 계측: "색" 단어 ≥1, 견본 개수 = 그 어휘의 color 토큰 수. 라이트·다크 스크린샷 2종.
  - Failure probe: Esc 핸들러를 제거하면 닫힘 테스트가 실패한다. 포커스 복귀를 제거하면 복귀 테스트가 실패한다.
  - Commit: changeset `color-picker-keyboard`.

## 검증/DoD
- **DoD**: 이미 색 토큰이 묶인 노드에서, 사람이 **해석된 색 견본을 보고 목록에서 골라** 색을 바꿀 수 있다. 어휘 격리가 양방향으로 지켜지고 키보드로도 완주된다.
- **Evidence**: `evidence/editor-color-and-token-editing/ect2-swatch.md` + 라이트/다크 스크린샷 + 브라우저 계측 수치(EU5 대비표)
- **회귀 게이트**: `npm run verify` + `npm run typecheck` + `npm test` 전부 PASS

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-21 작성.
