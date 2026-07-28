# PLAN — TPS2 구성 청사진·결정론적 조립기

> 생성: 2026-07-19 · 갈래: product · scope 결정: 형식 선택과 장면 컴파일의 결정론적 코어까지
Status: approved (2026-07-19)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 편집 가능한 템플릿 제작 시스템 (← `plans/horizons/2026-07-template-production-system.md`)
- **milestone**: TPS2 — 구성 청사진 선택과 CanvasDocument 컴파일을 분리해 두 changeset과 통합 결정성 검증을 요구한다.

## Scope Boundary
- **결정**: 생성 모델 없이 같은 입력은 같은 청사진·node id·장면 서명을 만드는 코어를 닫는다.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- **진행 보고**: commentary only. 미완 leaf는 턴 종료점이 아니다.
- rollback/cleanup: 선택기와 컴파일러 changeset을 독립 revert; fixture 외 생성 파일은 테스트 종료 후 삭제한다.

## 스캐폴딩 결정
- source-of-truth: `packages/template-core/src/blueprints/`의 명시적 registry와 `compileTemplate()`.
- 검증: canonical JSON signature, overflow/누락 negative tests, TypeScript build.
- 배포/운영: 해당 없음 — 로컬 라이브러리 단계.
- 알고리즘: 규칙 기반 format→blueprint 후보 선택, 안정 정렬, seed 없는 결정론적 node id.
- 데이터: 청사진은 슬롯·제약·token role만 포함하고 실제 카피/asset은 입력에서 주입한다.
- 검토 후 제외: LLM ranking·원격 저장·실시간 협업 — 초기 코어의 재현성을 해친다.

## 결정 로그
- status: resolved
- 자동 생성보다 구조 선택을 먼저 한다. 공개 조사에서 공통으로 확인된 format/content/layout 분리를 채택한다.

## Step 트리
- [ ] **step-1 — blueprint-registry-and-selection**
  - Artifact: 3개 형식의 최소 기준 청사진 metadata, 슬롯/제약 타입, `selectBlueprint()`.
  - Files: TPS1 계약, `packages/template-core/src/{types,blueprints/**,selection.ts}`와 tests.
  - Dependencies: TPS1 complete
  - Verify: 형식·aspect·content density 조합의 선택 table test.
  - Failure probe: 알 수 없는 형식과 제약 불충족 요청이 조용한 fallback 없이 명시 오류를 낸다.
  - Commit: changeset `blueprint-selection`.
- [ ] **step-2 — deterministic-scene-compiler**
  - Artifact: `compileTemplate()`이 선택 결과와 콘텐츠·토큰·asset manifest를 유효한 `CanvasDocument`로 변환한다.
  - Files: `packages/template-core/src/{compiler,signature}.ts`, fixtures/tests; canvas-core validation 소비.
  - Dependencies: step-1
  - Verify: 동일 입력 2회 canonical signature 일치, 세 형식 fixture가 canvas validation PASS.
  - Failure probe: 텍스트 overflow·필수 슬롯 누락·유효하지 않은 token binding이 compile failure가 된다.
  - Commit: changeset `deterministic-template-compiler`.

## 검증/DoD
- **DoD**: 세 기준 fixture가 재현 가능한 유효 장면을 만들고 모든 실패경로가 원인 코드와 함께 거부된다.

## finding 큐
- 더 많은 청사진 추천·AI ranking은 사용 데이터가 생긴 뒤 별도 후보로 둔다.

## 진행 로그
- 2026-07-19 계획 작성, 구현 승인 대기.
