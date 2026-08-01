# Changeset — M13: 흡수 지식 사이트 반영 (레시피 소배치 + knowledge 노출)

Date: 2026-08-01 · Goal: `usage-and-site-surfacing` (연쇄 2/2) · Plan: `plans/2026-08-01-m13-knowledge-site-surfacing.md`

## step-1 — mobile-navigation 레시피 승격 소배치

- **신규 recipe**: `recipes/navigation/adaptive-navigation-container.md` — knowledge/mobile-navigation.md §1 컨테이너 결정표의 실동작 구현. 차별성: 기존 `bottom-tab-bar` 는 *단일 컨테이너의 계약*, 신규는 *컨테이너 간 선택 규칙*(resolver 1곳 → in-page-tabs / bottom-bar / rail 3분기).
- **code_asset**: `adaptive-navigation-container.tsx` — 목적지 수(2/4/6)×폭(compact/expanded) 컨트롤 + 발동 규칙 표시 + DeviceFrame(mobile/tablet) 렌더. semantic 토큰만.
- **갤러리 등록**: recipe-gallery-data.ts + recipe-gallery-demo-registry.ts.
- **2건째 판정**: `sheet-detent-flow` 미승격 — 계획의 판정 기준 적용(기존 레시피가 표면 계약 커버, 잔여는 행동 규칙 → knowledge §4 + step-2 docs 노출 몫).
- **ledger**: batch `20260801-mobile-nav-recipes` 행 — knowledge→recipe 내부 승격(외부 수집 없음) 선례 표기.
- 검증: validate-recipes 48 · build:data 48 · **build:catalog 48(승격 있어 실행)** · site build 755 · lint:colors 0 · audit:visuals 신규 0.

## step-2 — knowledge 4본 사람용 문서 노출 + 통합 스모크

- **내비 모델**: `NavigationCollectionId` 에 `docs-judgment-*` 4종 추가 + navigationCollections 4 엔트리(termIds 가 Related terms 를 구동).
- **docs 페이지**: documentation-pages.ts 에 신규 그룹 "Judgment guides" + 페이지 4건 — 각각 결정표 요약 + 정본(llms 원문 URL) 명시 + 관련 레시피 지시. 규칙 전문 비복제(이중 정본 방지 — "정본은 knowledge" 를 lead 에 박음).
- **프리렌더**: 755→759 routes. 프리렌더 셸의 generic title 은 기존 docs 페이지와 동일 동작(클라이언트 렌더) — 회귀 아님.
- 검증: site build 759 · 실브라우저 통합 스모크(docs 2페이지 실렌더 + 갤러리 데모 분기 전환 실조작) · M12 grep 재실행 0.
