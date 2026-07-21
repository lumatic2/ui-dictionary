# PLAN — ECT4 이미지 노드가 실제로 칠해진다

> 생성: 2026-07-21 · 갈래: product · scope 결정: 렌더러 image kind 확장 + 두 경로 키 계약 일치까지
Status: approved (2026-07-21 — 사용자가 horizon 5 milestone 묶음을 승인, 위임 범위 A: horizon 전체 연쇄)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 편집기에서 색이 색으로 보이고, 바꿔진다 (← `plans/horizons/2026-07-editor-color-and-token-editing.md`)
- **milestone**: ECT4 — 사용자가 실제로 막혔던 그 노드에서 색이 칠해진다.
- **리서치 입력**: horizon 실사 2·5, horizon 결정 로그 3

> ⚠ **전제 정정 (ECT4 실측, 2026-07-21)**: 아래 "렌더러가 image kind에서 `tokenBindings`를
> 아예 참조하지 않는다"는 **사실이 아니다.** `<img>`도 `shared.style`을 받아 배경이 칠해진다.
> 이 plan은 승인 시점 기록이라 본문을 고치지 않고(승인 hash 보존) 여기에 정정을 붙인다.
> step-2는 "렌더러 확장"이 아니라 **"틀린 전제로 막아둔 이미지 노드를 열고, 실제로 칠해지는지
> 렌더 테스트로 고정"**하는 일이 됐다.

## 이 milestone의 출처

EU5에서 사용자가 막힌 노드가 **이미지 노드(`portrait`)**다. 그 노드의 시각 섹션은
"이 노드에 묶인 토큰이 없다"만 띄우고 끝났다(`evidence/editor-legibility/eu5-judgeability.md`).

ECT3이 묶기 경로를 만들지만, **렌더러가 image kind에서 `tokenBindings`를 아예 참조하지 않는다**
(`apps/agent-design/src/CanvasSurface.tsx:162-168`). 그래서 ECT3까지만 하면 **묶이긴 하는데 안 칠해지는** 상태가 된다.
사용자가 "렌더러까지 확장한다"를 고른 이유다(결정 3).

덤으로 같은 자리에서 **계약 불일치**가 드러났다. `template-core`의 `EXPECTED_KIND`는 허용 바인딩 키를
명시 제한하는데(`packages/template-core/src/tokens.ts:74-80`), canvas 렌더 경로는 별도로 키를 하드코드한다
(`CanvasSurface.tsx:59-69`). 같은 개념이 두 군데 따로 산다 — 한쪽에 키를 추가하면 다른 쪽이 조용히 뒤처진다.

## Scope Boundary
- **포함**: 이미지 노드의 색 바인딩 렌더 반영, 두 경로 키 계약 일치(단일 출처화 또는 대조 게이트), 미해결 바인딩 표시 일관성.
- **제외**:
  - 이미지 자체의 색 조작(틴트·필터·블렌드) — 배경/테두리 색이지 이미지 픽셀 처리가 아니다.
  - stroke·effect 신설 — 문서 모델에 없다(horizon 비목표).
  - 새 바인딩 키 추가 — 계약을 **일치**시키는 것이지 넓히는 게 아니다.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- rollback/cleanup: step별 독립 revert. 렌더 변경은 기존 스냅샷·스크린샷 증거와 대조해 의도치 않은 시각 변화가 없는지 확인한다.

## 스캐폴딩 결정
- source-of-truth: **허용 바인딩 키의 정본을 하나로 만든다.** 두 군데 하드코딩을 남겨두고 테스트로만 묶으면 다음 사람이 한쪽만 고친다. 단일 출처가 어려우면 **대조 게이트**(두 목록이 다르면 실패)를 최소한으로 둔다 — 어느 쪽이든 "조용히 뒤처짐"을 불가능하게 만드는 게 조건이다.
- **이미지 노드에 새 색 개념을 발명하지 않는다** — 기존 `background` 바인딩이 다른 노드에서 하는 일을 image kind에서도 하게 한다. 새 속성 신설은 범위 밖.
- 미해결 바인딩 표시는 **기존 규약을 따른다** — `data-token-unresolved`(`CanvasSurface.tsx:94-99,156`). 폴백 색으로 덮지 않는다(TPS3~TH3에서 결함을 세 milestone 숨긴 전례).
- 검증: **브라우저 계산값**으로 잰다. 렌더 코드가 아니라 `getComputedStyle`로 읽는다.
- 디자인: 렌더 결과가 바뀌므로 라이트/다크 스크린샷을 남긴다. 새 화면 UI는 없다(ECT2·ECT3에서 완료).
- 배포/운영: 해당 없음 — 로컬 편집기.
- 자기선언 도메인 — **시각 회귀**: 이미지 노드 렌더가 바뀌므로 기존 템플릿 산출물(명함 등)이 달라지지 않는지 확인한다. 바인딩이 없던 노드는 **이전과 똑같이** 보여야 한다.
- 검토 후 제외: 인증·결제·시크릿·데이터·서버·관측 — 걸리지 않음.

## 결정 로그
- status: resolved
- **허용 키 정본은 하나** — 단일 출처 또는 대조 게이트, 둘 중 하나는 반드시.
- **새 색 개념 발명 금지** — 기존 `background` 바인딩을 image kind에 적용.
- **폴백 색 금지** — 미해결은 미해결로 표시.
- 사용자 결정 필요 항목: 없음(범위는 horizon 승인 + 결정 3에 포함).

## Step 트리

- [ ] **step-1 — 허용 키의 정본이 하나가 된다**
  - Artifact: `EXPECTED_KIND`(template-core)와 canvas 렌더 경로의 키 목록이 단일 출처에서 나오거나, 어긋나면 실패하는 대조 게이트가 선다.
  - Files: write `packages/template-core/src/tokens.ts`, `apps/agent-design/src/CanvasSurface.tsx`, 각 테스트.
  - Dependencies: 없음
  - Verify: 두 경로가 인정하는 바인딩 키 집합이 정확히 같다. 한쪽에만 키를 추가하면 게이트가 실패한다.
  - Failure probe: 한쪽 목록에 `stroke`를 임시로 넣으면 대조 테스트가 실패한다(게이트가 실제로 문다는 증명).
  - Commit: changeset `binding-key-contract`.

- [ ] **step-2 — 이미지 노드가 칠해진다 + 게이트**
  - Artifact: 이미지 노드의 색 바인딩이 렌더에 반영된다. 바인딩이 없으면 이전과 똑같이 보인다. 미해결이면 표시된다.
  - Files: write `apps/agent-design/src/CanvasSurface.tsx`, `apps/agent-design/src/CanvasSurface.test.tsx`, `evidence/editor-color-and-token-editing/ect4-image-render.md`.
  - Dependencies: step-1
  - Verify: 이미지 노드에 색 토큰을 묶으면 **브라우저 계산값**이 그 토큰 값과 일치한다. 바인딩 없는 이미지 노드의 계산값이 변경 전과 동일하다(시각 회귀 없음). 미해결 바인딩은 `data-token-unresolved`가 붙고 폴백 색이 칠해지지 않는다. 기존 템플릿(명함) 렌더가 달라지지 않는다. 라이트/다크 스크린샷.
  - Failure probe: image kind 분기를 되돌리면 칠해짐 테스트가 실패한다. 폴백 색을 넣으면 "폴백 금지" 테스트가 실패한다.
  - Commit: changeset `image-node-token-render`.

## 검증/DoD
- **DoD**: 이미지 노드에 묶은 색 토큰이 실제로 칠해지고(브라우저 계산값 대조), 바인딩 없는 노드는 시각 회귀가 없으며, 허용 바인딩 키의 정본이 하나다.
- **Evidence**: `evidence/editor-color-and-token-editing/ect4-image-render.md` + 라이트/다크 스크린샷 + 계산값 대조 출력
- **회귀 게이트**: `npm run verify` + `npm run typecheck` + `npm test` 전부 PASS

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-21 작성.

## 주의 — 크기 회고 대상

이 milestone은 leaf 2개다. 완료 시 changeset이 2개 미만이면 **step 크기였다**는 뜻이므로
§A1 인플레 적발 규칙에 따라 완료 보고에 한 줄 남긴다.
