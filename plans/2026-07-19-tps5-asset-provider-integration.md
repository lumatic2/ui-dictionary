# PLAN — TPS5 생성 소재 경계·통합 실연

> 생성: 2026-07-19 · 갈래: product · scope 결정: 오프라인 이미지 공급자 계약과 세 형식 전 구간 실연까지
Status: approved (2026-07-19)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 편집 가능한 템플릿 제작 시스템 (← `plans/horizons/2026-07-template-production-system.md`)
- **milestone**: TPS5 — 공급자 경계와 horizon 전 구간 통합검증을 분리해 실제 연결 가능성과 오프라인 완결성을 함께 증명한다.

## Scope Boundary
- **결정**: `ImageAssetProvider`와 GPT Image 2용 request/response adapter 계약은 만들되 네트워크 호출은 하지 않는다. 고정 응답·로컬 asset으로만 닫는다.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- **진행 보고**: commentary only. 미완 leaf는 턴 종료점이 아니다.
- rollback/cleanup: provider adapter와 E2E harness changeset을 독립 revert; secret/env 파일 생성 금지, 임시 output은 evidence 생성 후 정리한다.

## 스캐폴딩 결정
- source-of-truth: provider-neutral interface는 `packages/template-core`; GPT Image 2 adapter는 `packages/template-image-provider-openai`.
- 검증: frozen request/response contract tests, network-disabled integration test, 세 형식 Playwright E2E와 evidence manifest.
- 배포/운영: 라이브 배포·API key·비용 발생 없음. 실제 API 연결은 별도 사용자 승인과 예산 게이트가 필요한 후속 작업.
- 외부 API: OpenAI 공식 Image API/Responses API 계약만 참조하고 모델 출력은 asset manifest에 provenance로 기록한다.
- 관측: `evidence/template-production-system/`에 입력, 선택된 청사진, 장면 signature, export 목록, 실패경로를 남긴다.
- 검토 후 제외: 라이브 GPT 호출·자동 재시도·과금·원격 asset storage·기존 범용 캔버스 직접 연결.

## 결정 로그
- status: resolved
- 사용자 확정: 고정 fixture 먼저. 라이브 호출은 구현 승인과 별개의 비용/키 승인 경계다.
- GPT 이미지 출력은 대체 가능한 asset이며 `CanvasDocument`와 템플릿 구조를 소유하지 않는다.

## Step 트리
- [ ] **step-1 — offline-image-provider-boundary**
  - Artifact: provider-neutral interface, OpenAI adapter 직렬화 계약, frozen response→asset manifest 변환, 로컬 fallback.
  - Files: OpenAI 공식 docs, `packages/template-core/src/assets/**`, `packages/template-image-provider-openai/**`, contract tests.
  - Dependencies: TPS1~TPS4 complete
  - Verify: network 차단 상태에서 provider contract/build/test PASS, provenance manifest snapshot 일치.
  - Failure probe: timeout/거부/잘못된 mime·크기 응답이 구조를 손상하지 않고 명시 오류+fallback 결과를 낸다.
  - Commit: changeset `offline-image-provider`.
- [ ] **step-2 — three-format-end-to-end-proof**
  - Artifact: `DESIGN.md`+고정 brief에서 형식 선택→compile→asset 주입→브라우저 편집→HTML/SVG/JSON export까지 재현 가능한 증거.
  - Files: `scripts/verify-template-production-system.mjs`, app/core integration tests, `evidence/template-production-system/**`.
  - Dependencies: step-1
  - Verify: 단일 검증 명령이 3/3 형식과 의도된 실패경로를 PASS하고 evidence manifest를 생성한다.
  - Failure probe: 네트워크가 없어도 PASS해야 하며, fixture 하나를 훼손하면 검증 명령이 exit≠0이어야 한다.
  - Commit: changeset `template-production-e2e`.

## 검증/DoD
- **DoD**: 외부 호출 없이도 세 형식 전체 제작 루프가 재현되고, 실제 GPT Image 2 연결에 필요한 경계·provenance·실패 처리가 검증된다.

## finding 큐
- live GPT Image 2 연결, 범용 canvas 연결, 공개 hosting은 horizon close 후 사용자 승인 후보로 제시한다.

## 진행 로그
- 2026-07-19 계획 작성, 구현 승인 대기.
