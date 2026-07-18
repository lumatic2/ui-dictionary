# PLAN — TPS1 템플릿 계약·장면 기반

> 생성: 2026-07-19 · 갈래: product · scope 결정: 편집 템플릿 계약과 최소 장면 원시 요소·검증 기반까지
Status: proposed (awaiting run approval)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 편집 가능한 템플릿 제작 시스템 (← `plans/horizons/2026-07-template-production-system.md`)
- **milestone**: TPS1 — 문서 계약과 실행 가능한 장면 기반이라는 두 독립 산출물을 통합 검증한다.

## Scope Boundary
- **결정**: 평면 시안/편집 템플릿 경계를 ADR로 고정하고, `CanvasDocument`에 필요한 최소 이미지·도형 표현과 `template-core` 계약을 만든다.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- **진행 보고**: commentary only. 미완 leaf는 턴 종료점이 아니다.
- rollback/cleanup: changeset 단위 revert; 새 패키지는 다른 앱에 연결하기 전 독립 제거 가능하게 유지한다.

## 스캐폴딩 결정
- source-of-truth: `docs/design-system/template-production-system.md`, ADR 0009, `packages/template-core/src/`, 최종 장면은 `packages/canvas-core`의 `CanvasDocument`.
- 검증: canvas-core/template-core TypeScript build, Vitest 계약·실패경로 테스트, 고정 fixture JSON.
- 배포/운영: 해당 없음 — 독립 로컬 패키지 계약이며 공개 배포를 하지 않는다.
- 데이터: `TemplateRequest + content + assetManifest + CanvasDocument`를 `TemplateProject`로 묶고 평면 이미지는 asset 참조일 뿐 장면 정본이 아니다.
- 디자인: 기존 `DESIGN.md` semantic token과 node `tokenBindings`만 사용한다.
- 검토 후 제외: 서버·DB·인증·결제 — 로컬 결정론적 코어에 필요 없음.

## 결정 로그
- status: resolved
- 2026-07-19 사용자 확정: 첫 형식 3종, JSON 장면+브라우저 미리보기, GPT Image 2는 소재/참고 역할, 고정 fixture 우선.
- 기존 `CanvasDocument`를 확장한다. 병렬 장면 모델은 만들지 않는다.

## Step 트리
- [ ] **step-1 — structured-template-contract**
  - Artifact: `docs/design-system/template-production-system.md`와 ADR 0009에 입력/출력, 편집성 기준, AI 경계, 형식 확장 규칙이 기록됨.
  - Files: research 문서, `docs/ARCHITECTURE.md`, 위 두 신규 문서.
  - Dependencies: none
  - Verify: 문서 링크·용어 grep, `git diff --check`.
  - Failure probe: 평면 PNG만 가진 사례가 템플릿 판정을 통과하지 않음을 계약 예제로 확인한다.
  - Commit: changeset `template-contract`.
- [ ] **step-2 — scene-primitives-and-core-scaffold**
  - Artifact: 최소 이미지·도형 node 지원, `@askewly/template-core` 타입/검증/fixture 패키지.
  - Files: `packages/canvas-core/src/{types,validation}.ts`, `packages/template-core/{package.json,tsconfig.json,src/**,fixtures/**}`.
  - Dependencies: step-1
  - Verify: `npm --prefix packages/canvas-core test && npm --prefix packages/template-core test && npm --prefix packages/template-core run build`.
  - Failure probe: 필수 콘텐츠 누락·깨진 asset 참조·지원하지 않는 형식 fixture가 invalid를 반환한다.
  - Commit: changeset `template-core-scaffold`.

## 검증/DoD
- **DoD**: 편집 템플릿과 평면 시안의 경계가 문서·타입·검증에 동일하게 나타나고, 유효/무효 fixture가 서로 구분된다.

## finding 큐
- CanvasDocument JSON Schema 공개 필요성은 TPS5 통합 소비 후 판단한다.

## 진행 로그
- 2026-07-19 계획 작성, 구현 승인 대기.
