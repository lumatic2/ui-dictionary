# 헤더 검색 수리 + 인덱스 확장

- Date: 2026-07-12
- Milestone: PX Step 1 (`docs/plans/2026-07-12-px-public-experience.md`)
- Scope: `App.tsx` `updateQuery`, `topbar-search.tsx`, `lib/search-suggestions.ts`

## What

- **버그 수정**: 자유 텍스트 검색 커밋이 no-explore 페이지(home/download/pro/colors/recipes)에서 결과 화면으로 이동하지 않던 결함 — `updateQuery`가 filter 기반으로 pageMode(docs/plus)를 전환하고 non-nav filter는 `plus-all`로 정규화.
- **기존 결함 추가 적발·수정**: PopoverContent가 Radix Portal로 렌더되어 outside-pointerdown 리스너가 모든 suggestion 클릭을 click 발화 전에 닫아버리던 결함 — `[data-slot="popover-content"]` 내부 타깃 허용.
- **인덱스 확장**: 신규 `page` suggestion 타입(`SearchDestination`) — Recipes(recipe-gallery-data 타이틀·컬렉션)·Colors(키워드) 커버, docs 매칭을 `docsArticlePages` title/breadcrumb로 보강. starter 항목을 현 표면(Recipe Gallery·Colors·Getting set up 추가)으로 갱신.

## Verification

- [x] `npm run build` PASS (오케스트레이터 독립 재실행)
- [x] `npm run lint` 6-warning baseline 유지 (오케스트레이터 독립 재실행)
- [x] Playwright 실클릭 smoke (워커, dev :5175): home에서 "checkout"+Enter → plus 결과 화면 이동 (suggestion 0건 쿼리로 자유 텍스트 경로 격리 재확인) / "bottom tab" → Recipes suggestion 클릭 → 갤러리 이동 / "typography" → Docs suggestion 클릭 → foundations-typography 이동
- [x] 실패 모드: 기존 category/group suggestion·Escape/화살표·collapse 동작 무회귀 (워커 관측), exposure 게이트 무접촉
