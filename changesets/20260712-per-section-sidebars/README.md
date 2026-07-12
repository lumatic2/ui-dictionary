# 섹션별 독립 사이드 네비게이션

- Date: 2026-07-12
- Milestone: PX Step 4 (`docs/plans/2026-07-12-px-public-experience.md`)
- Scope: `src/App.tsx`, `src/components/recipe-gallery.tsx`, `src/lib/recipe-gallery-data.ts`

## What

- **사이드바 3분기** (`visiblePageMode` 기준): Docs = 문서 트리 단독("Docs" 헤딩, 축 전환기 제거) / Patterns = PrimaryAxisNav에서 Documentation 항목 제외(Marketing·Application UI·Ecommerce만) + 기존 컬렉션 트리 / Recipes = 신규 `RecipesNav`.
- **Recipes 앵커 사이드바**: `recipeCollectionOrder` 10개 컬렉션 나열, 클릭 시 해당 섹션으로 scrollIntoView + active 상태. 갤러리 섹션에 `recipeCollectionAnchorId` id와 sticky header 보정(`scroll-mt-20`) 부여. recipes가 explore 레이아웃 그리드에 편입.
- Colors/home/pro/download 무사이드바 유지, collection id·딥링크·exposure 게이트 무접촉. term 페이지는 returnPageMode 기준으로 원 섹션 사이드바 유지.

## Verification

- [x] `npm run build` PASS (오케스트레이터 독립 재실행)
- [x] `npm run lint` 6-warning baseline 유지 (오케스트레이터 독립 재실행)
- [x] 브라우저 smoke (워커, dev :5178): docs 딥링크 → 문서 트리만+하이라이트 / docs발 term 페이지 → docs 사이드바 유지 / Patterns → 3축 전환기(+Ecommerce 전환 시 트리 갱신) / Recipes → 10 컬렉션, Overlays 클릭 시 scrollY 1524 이동+active / Colors → 무사이드바 — 전부 PASS
- [x] 실패 모드: 딥링크 하위호환·검색 리다이렉트 로직(updateQuery의 로컬 분기) 무접촉 확인
