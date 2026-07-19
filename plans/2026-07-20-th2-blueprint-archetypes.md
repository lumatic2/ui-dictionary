# PLAN — TH2 청사진 6종 실재화

> 생성: 2026-07-20 · 갈래: product · scope 결정: 포맷당 2개의 구조적으로 구별되는 청사진과 그 규격 검증까지
Status: approved (2026-07-20)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 템플릿 제작 시스템 경화 (← `plans/horizons/2026-07-template-production-hardening.md`)
- **milestone**: TH2 — 카탈로그의 6이 실질 3인 상태를 끝내고, 각 포맷에 근거 있는 두 번째 아키타입을 준다.

## Scope Boundary
- **결정**: `formatPackCatalog`의 `-split` 생성기를 삭제하고 6개를 전부 명시 선언한다. 청사진 개수는 6에서 늘리지 않는다.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- **진행 보고**: commentary only. 미완 leaf는 턴 종료점이 아니다.
- rollback/cleanup: 타입 변경(step-1)과 청사진 추가(step-2)를 분리 커밋해 독립 revert 가능하게 둔다.

## 스캐폴딩 결정
- source-of-truth: 청사진 정본은 `packages/template-core/src/blueprints/registry.ts`의 명시 선언이다. 파생 생성기를 두지 않는다.
- 검증: Vitest — 구조적 구별 검증(같은 포맷의 두 청사진은 슬롯 개수 또는 그리드 열 수가 달라야 함) + 규격/안전영역 검증 + 컴파일 결정성.
- 배포/운영: 해당 없음 — core 패키지 내부 변경.
- 데이터 계약: 인포그래픽 B(다중 병렬 유닛)는 반복 데이터를 요구한다. 현 `TemplateRequest.content: Record<string,string>`은 배열을 담지 못하므로 반복 슬롯 표현을 타입에 추가한다.
- 디자인 근거: `research/2026-07-20-template-production-hardening-format-layout-taxonomy.md` — 세 포맷의 결정 축과 한국 명함 규격 이원화·도련/안전영역 수치.
- 검토 후 제외: 스튜디오 UI(TH3가 담당)·검증 스크립트(TH4)·소재 생성(TH5). 인증·DB·배포·관측 — 걸리지 않음.

## 결정 로그
- status: resolved
- 포맷별 구별 축은 리서치로 확정(사용자 재결정 불요): 명함=**방향**(가로 3-col ↔ 세로 2-col), 포스터=**이미지:텍스트 면적비 + 그리드**(hero ↔ Swiss/타이포 지배), 인포그래픽=**구조**(단일 초점 ↔ 다중 병렬 반복 유닛).
- 한국 명함 두 표준(90×50, 85×55)은 방향 축과 **직교**한다 — 규격 프리셋 검증으로 인코딩하고 청사진 분화 축으로는 쓰지 않는다(6개를 넘기지 않기 위해).
- 리서치가 지적한 "포스터 1080×1350은 인쇄 규격이 아닌 소셜 세로형"은 이번 범위에서 **바꾸지 않는다** — 기존 fixture·서명 호환을 깨므로 finding 큐로 넘긴다.

## Step 트리

- [ ] **step-1 — repeating-slot-contract**
  - Artifact: `TemplateSlot`/`TemplateRequest`가 반복 유닛(N개 동일 구조 슬롯 + 대응 콘텐츠)을 표현할 수 있고, 유효/무효 fixture가 구분된다.
  - Files: read/write `packages/template-core/src/types.ts`, `validation.ts`, `compiler.ts`; 신규 반복 fixture.
  - Dependencies: TH1 complete
  - Verify: `npm --prefix packages/template-core test` PASS + 반복 슬롯 fixture가 유효 장면으로 컴파일된다.
  - Failure probe: 반복 유닛 개수와 콘텐츠 항목 수가 불일치하는 요청이 명시 오류 코드로 거부된다.
  - Commit: changeset `template-repeating-slot-contract`.

- [ ] **step-2 — six-real-blueprints**
  - Artifact: `-split` 생성기가 삭제되고 6개 청사진이 명시 선언된다 — `business-card-minimal`/`business-card-vertical`, `product-poster-hero`/`product-poster-editorial`, `infographic-stats`/`infographic-comparison`.
  - Files: read/write `packages/template-core/src/blueprints/registry.ts`, `catalog.ts`, 관련 테스트.
  - Dependencies: step-1
  - Verify: 구조적 구별 테스트 PASS — 같은 포맷의 두 청사진에 대해 슬롯 개수 또는 그리드 열 수가 다름을 기계 검증. 6개 전부 컴파일 매트릭스 PASS.
  - Failure probe: 좌표만 다르고 슬롯 개수·열 수가 같은 청사진 쌍을 임시로 넣으면 구별 테스트가 FAIL한다 — 확인 후 되돌린다. (프리모템 2의 예방 장치가 실제로 작동하는지 증명)
  - Commit: changeset `template-six-blueprints`.

- [ ] **step-3 — print-spec-validation**
  - Artifact: 명함 규격 프리셋(90×50, 85×55)과 도련 3mm·안전영역 3mm 규칙이 검증으로 인코딩된다.
  - Files: read/write `packages/template-core/src/validation.ts`, 규격 상수 모듈, 테스트.
  - Dependencies: step-2
  - Verify: 규격 준수 청사진 PASS + 안전영역 침범 슬롯이 명시 오류로 거부된다.
  - Failure probe: 필수 텍스트 슬롯을 재단선 1mm 안쪽으로 옮기면 안전영역 위반으로 거부된다.
  - Commit: changeset `template-print-spec-validation`.

## 검증/DoD
- **DoD**: 6개 청사진이 명시 선언되고, 같은 포맷 내 두 청사진이 슬롯 개수 또는 그리드 열 수에서 구조적으로 다름이 기계 검증되며, 인쇄 규격·안전영역 위반이 명시 거부된다.
- **Evidence**: `evidence/template-production-hardening/th2-blueprints.md`

## finding 큐
- 포스터 캔버스 1080×1350을 인쇄 표준 비율(2:3 또는 1:√2)로 옮기는 건은 별도 후보.
- 명함 외 포맷의 인쇄 규격(포스터 18×24in 등) 프리셋도 후보.

## 진행 로그
- 2026-07-20 계획 작성, 승인 대기.
