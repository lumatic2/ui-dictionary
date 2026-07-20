# PLAN — TH7 캔버스 렌더 충실도

> 생성: 2026-07-20 · 갈래: product · scope 결정: 편집기·내보내기가 템플릿을 **디자인 그대로** 그리게 한다
Status: approved (2026-07-20)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 템플릿 제작 시스템 경화 (← `plans/horizons/2026-07-template-production-hardening.md`)
- **milestone**: TH7 — TH3이 적발한 렌더 충실도 공백을 닫는다. 템플릿이 편집기와 내보내기 산출물 양쪽에서 토큰 색·글꼴·이미지를 갖고 나타난다.

## 왜 TH4보다 먼저인가
- TH4는 exporter를 실제로 돌려 산출물을 파싱 검사하는 게이트다. 지금 exporter는 도형 채움에 `#000000` 리터럴을 쓰고 글자색을 담지 않는다 — 이 상태로 게이트를 세우면 **색이 빠진 산출물을 통과로 고정**한다. 게이트는 되돌리기 비싼 쪽이다.
- 충실도가 먼저 서면 TH4가 검사할 대상이 생긴다("SVG에 토큰 색이 실제로 들어갔는가"). 지금 검사 가능한 것은 `<svg` 문자열 존재뿐이다.
- TH5(생성 소재)는 이미지 렌더를 전제한다. 캔버스가 이미지를 안 그리면 생성 결과를 확인할 수 없다.

## Scope Boundary
- **포함**: DOM 렌더 경로의 토큰 해석(배경·채움·글자색·글꼴·타이포 크기), 이미지 노드 실렌더, 자산 URI 해석 경로, exporter의 토큰 반영.
- **제외**: WebGPU 렌더 경로의 픽셀 동등성(측정만 하고 별도 후보로 넘긴다), 편집기 chrome 자체의 테마, 새 청사진·새 토큰 세트 추가(hallmark 이식은 별도 milestone).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- **진행 보고**: commentary only. 미완 leaf는 턴 종료점이 아니다.
- rollback/cleanup: step별 독립 revert. dev 서버·다운로드 산출물은 각 실행 후 정리한다.

## 스캐폴딩 결정
- source-of-truth: 색·타이포의 정본은 `packages/template-core/src/tokens.ts`의 토큰 세트다. 편집기가 자기 chrome 토큰(`editorTokens.ts`)으로 템플릿을 칠하지 않는다.
- **조용한 폴백 금지**: 알 수 없는 토큰 세트·바인딩을 만나면 그럴듯한 기본색을 쓰지 않고 미해결로 드러낸다(TH3 step-1과 같은 규약, 이번엔 편집기에 적용).
- 검증: Vitest + Playwright computed style 실측 + 내보낸 SVG/HTML 문자열 검사.
- 배포/운영: 해당 없음 — 로컬 편집기와 라이브러리 패키지만 바뀐다. 배포면·서비스 구성 변경 없음. `apps/agent-design-desktop` 패키징은 이번 범위 밖(타입 변경 시 빌드 무회귀만 확인).
- 디자인: 사람이 조작하는 화면이므로 UI 변경 전 `askewly-design` 스킬을 호출한다.
- 검토 후 제외: 인증·저장 서버·결제·관측 — 걸리지 않음.

## 결정 로그
- status: resolved
- **자산(asset) 해석 경로**: `CanvasDocument`에는 `assetId`만 있고 URI 목록은 `TemplateProject.assets`에 있다. 두 안 중 하나를 고른다.
  - (A) `CanvasDocument`에 자산 목록을 싣는다 — 문서가 자족적이 되어 브리지·내보내기·재가져오기 어디서든 이미지가 산다. 대신 `packages/canvas-core` 타입 변경이 desktop·bridge·mcp에 파급된다.
  - (B) 편집기가 `TemplateProject`를 따로 들고 렌더에 prop으로 넘긴다 — 변경 범위는 작지만 문서만 오가는 경로(에이전트 브리지·스냅샷)에서는 이미지가 사라진다.
  - **확정: (A)를 채택한다.** 문서가 자족적이어야 브리지·스냅샷·재가져오기 어디서든 이미지가 산다 — (B)는 문서만 오가는 경로에서 이미지를 잃는 알려진 결함을 남긴다.
  - **되돌림 조건(기계적)**: 타입 변경으로 `packages/canvas-core`·`apps/agent-design`·`apps/agent-design-bridge`·`apps/agent-design-desktop`·`packages/agent-design-mcp`의 기존 테스트가 깨지고 그 복구가 이 milestone의 changeset 3개를 넘기면 (B)로 축소하고 그 사실을 evidence에 남긴다. 선택적 필드로 추가해 기존 문서를 무효화하지 않는 것을 우선한다.
- 색 리터럴 `node.fill`(현재 `#000000`)과 `tokenBindings.fill`이 공존한다 — 토큰이 있으면 토큰이 이긴다. 리터럴은 토큰 없는 자유 도형용으로 남긴다.
- 사용자 결정 필요 항목: 없음(범위·순서는 2026-07-20 사용자 승인).

## Step 트리

- [ ] **step-1 — 토큰 해석 일원화**
  - Artifact: 편집기가 템플릿 토큰 세트를 조회해 배경·채움·글자색·글꼴을 칠한다. 편집기 chrome 토큰으로의 조용한 폴백이 사라진다.
  - Files: write `apps/agent-design/src/CanvasSurface.tsx` 및 분리될 토큰 해석 모듈, 테스트; read `apps/agent-design/src/editorTokens.ts`, `packages/template-core/src/tokens.ts`.
  - Dependencies: TH3 complete
  - Verify: Playwright로 명함을 열어 캔버스 노드의 computed style이 토큰 값과 일치함을 관측(배경·강조 도형·글자색·글꼴 4종). 토큰 세트를 바꾸면 값이 함께 바뀐다.
  - Failure probe: 등록되지 않은 토큰 세트·정의 없는 바인딩을 주면 기본색으로 칠하지 않고 미해결 표시가 난다.
  - Commit: changeset `canvas-token-paint`.

- [ ] **step-2 — 이미지·타이포 실렌더**
  - Artifact: 이미지 노드가 실제 이미지로 그려지고, 텍스트가 `textStyle`(크기·굵기·행간)대로 그려진다. 자산 해석 경로가 결정 로그의 확정안대로 배선된다.
  - Files: write `apps/agent-design/src/CanvasSurface.tsx`, 자산 해석 지점(확정안에 따라 `packages/canvas-core/src/types.ts` 또는 `apps/agent-design/src/App.tsx`), 테스트.
  - Dependencies: step-1
  - Verify: Playwright로 6종을 열어 `<img>`가 실제 src로 렌더되고 자연 크기가 0이 아님을 관측. 텍스트 노드의 computed `font-size`가 청사진 값과 일치.
  - Failure probe: 존재하지 않는 `assetId`·깨진 URI를 주면 빈 상자로 조용히 넘어가지 않고 대체 표시와 진단이 난다.
  - Commit: changeset `canvas-image-typography`.

- [ ] **step-3 — 내보내기 충실도**
  - Artifact: HTML·SVG 내보내기가 토큰 색·글꼴·타이포를 담는다. 화면과 산출물이 같은 값을 쓴다.
  - Files: write `packages/template-core/src/exporters.ts`, 테스트.
  - Dependencies: step-2
  - Verify: 6청사진의 SVG·HTML에 각 청사진이 참조하는 토큰의 **실제 색 값**이 문자열로 존재함을 단언. 토큰 세트를 바꿔 내보내면 값이 함께 바뀐다.
  - Failure probe: 토큰이 해석되지 않는 프로젝트를 내보내면 검은색으로 대체하지 않고 명시적으로 거부한다.
  - Commit: changeset `export-token-fidelity`.

## 검증/DoD
- **DoD**: 편집기와 내보낸 SVG/HTML 양쪽에서 템플릿이 토큰 색·글꼴·타이포·이미지를 갖고 나타나며, 토큰 세트를 바꾸면 셋 다 함께 바뀐다. 해석 실패는 조용한 기본값이 아니라 진단으로 드러난다.
- **Evidence**: `evidence/template-production-hardening/th7-render-fidelity.md` + Playwright 스크린샷(warm·ink 각 1장 이상) + 내보낸 SVG 실물

## finding 큐
- WebGPU 렌더 경로와 DOM 경로의 픽셀 동등성은 이번 범위 밖 — 측정만 하고 남긴다.
- 편집기 chrome 자체의 다크모드는 별개 축이다.

## 진행 로그
- 2026-07-20 계획 작성. 순서 근거(TH4 선행 시 잘못된 계약 고정) 기록.
