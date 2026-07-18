# PLAN — TPS4 명함·제품 포스터·인포그래픽 팩

> 생성: 2026-07-19 · 갈래: product · scope 결정: 첫 3개 형식의 실사용 구성·검증·카탈로그까지
Status: proposed (awaiting run approval)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 편집 가능한 템플릿 제작 시스템 (← `plans/horizons/2026-07-template-production-system.md`)
- **milestone**: TPS4 — 인쇄물 2종과 데이터 서술형 1종의 서로 다른 제약을 세 changeset으로 구현하고 교차 검증한다.

## Scope Boundary
- **결정**: 각 형식 2개 청사진(총 6개)과 고정 콘텐츠 fixture를 제공한다. 범용 자유 배치는 하지 않는다.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- **진행 보고**: commentary only. 미완 leaf는 턴 종료점이 아니다.
- rollback/cleanup: format pack별 changeset 독립 revert; 공통 compiler 계약 변경은 TPS2 회귀검증 후에만 허용한다.

## 스캐폴딩 결정
- source-of-truth: `packages/template-core/src/packs/<format>/`의 청사진·규칙·fixture.
- 검증: pack별 unit/visual fixture tests, template-studio Playwright, 세 형식 catalog matrix.
- 배포/운영: 해당 없음 — 로컬 pack과 스튜디오 catalog 편입까지만.
- 디자인: `DESIGN.md` token role을 형식별 typography/color/spacing binding으로 해석한다.
- 정확성: 인포그래픽 수치 블록은 값·단위·출처 label을 함께 요구하고 장식용 차트가 원값을 바꾸지 못한다.
- 검토 후 제외: 실물 인쇄 발주·PDF preflight·외부 data fetch — 첫 편집 시스템 범위 밖.

## 결정 로그
- status: resolved
- 명함, 제품 포스터, 인포그래픽을 첫 세로축으로 사용자 확정(2026-07-19).

## Step 트리
- [ ] **step-1 — business-card-and-product-poster-packs**
  - Artifact: 명함/제품 포스터 각 2개 청사진, 필수 슬롯·안전영역·대비 규칙, preview fixtures.
  - Files: `packages/template-core/src/packs/{business-card,product-poster}/**`, tests, studio catalog data.
  - Dependencies: TPS2, TPS3 complete
  - Verify: pack tests + 4개 fixture browser render/편집 smoke.
  - Failure probe: 안전영역 침범·CTA/연락처 누락·저대비 텍스트가 형식 검증에서 거부된다.
  - Commit: changeset `print-format-packs`.
- [ ] **step-2 — infographic-pack-and-data-integrity**
  - Artifact: 인포그래픽 2개 청사진, stat/sequence/comparison block, 값·단위·출처 보존 검사.
  - Files: `packages/template-core/src/packs/infographic/**`, validators/tests, studio catalog data.
  - Dependencies: step-1
  - Verify: 원본 데이터와 scene text/chart props의 일치 test + browser render smoke.
  - Failure probe: 출처 없는 수치·합계 불일치·잘못된 단위가 compile/export를 차단한다.
  - Commit: changeset `infographic-pack`.
- [ ] **step-3 — cross-format-catalog-and-variants**
  - Artifact: 6개 청사진 catalog, 형식/비율/밀도 필터, 모든 fixture 통합 matrix.
  - Files: template-core catalog API, `apps/template-studio` selector, integration tests/evidence script.
  - Dependencies: step-2
  - Verify: catalog 6/6 선택·compile·render·edit·export matrix PASS.
  - Failure probe: 형식과 호환되지 않는 ratio/slot 조합이 선택 목록과 직접 API 양쪽에서 차단된다.
  - Commit: changeset `template-pack-catalog`.

## 검증/DoD
- **DoD**: 6개 청사진이 형식 고유 제약을 지키며 동일 core와 studio에서 편집·내보내기되고 교차 matrix가 PASS한다.

## finding 큐
- 소셜 카드·프레젠테이션·보고서는 첫 3종 실사용 피드백 후 후보화한다.

## 진행 로그
- 2026-07-19 계획 작성, 구현 승인 대기.
