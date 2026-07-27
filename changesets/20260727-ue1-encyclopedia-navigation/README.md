# changeset — UE1 탐색이 작동한다

> milestone UE1 · plan `plans/2026-07-27-ue1-encyclopedia-navigation.md` · 2026-07-27

## step-1 — 사이드바 내비 수리 + 실패 관측 가능화

**근본 원인**: 사이드바(`StaticUiBlocksNavTree` 등)는 `updateNavFilter` 를 호출하는데, 이 함수가 filter 상태만 바꾸고 `pageMode` 를 건드리지 않았다. `pageMode === "term"` 인 동안 화면은 용어 상세를 계속 렌더하므로 클릭이 무반응으로 보였다. 검색 경로의 `updateFilter` 에는 이미 페이지 전환 로직이 있었다 — 두 핸들러의 비대칭이 원인.

**수리** (`examples/ui-vocabulary-site/src/App.tsx`):
1. `updateNavFilter` 에 `updateFilter` 와 같은 nav-filter 페이지 전환을 추가 — `nav:docs-*` → docs, 그 외 → plus, `selectedTermId` 해제, 스크롤 최상단.
2. `navigateToNavigationPath` 의 조용한 `return` 에 `console.warn`(경로 문자열 포함) 추가 — 실패 관측 가능화.

**Verify (실행 관측)**:
- Playwright: `?page=term&id=accordion` 에서 Header Sections·Footers·FAQs 클릭 → 3/3 목록 착지, URL 반영(`?page=plus&filter=nav:plus-marketing-header-sections` 등), 콘솔 에러 0. `STEP1 VERIFY: PASS`.
- Failure probe: `navigation-model.ts` 의 Forms 컬렉션 경로를 일시 오염 후 text-field 상세의 "다른 위치" 클릭 → `navigation: no collection matches path "Plus / UI Blocks / Application UI / Forms" — check navigationCollections` 경고 실측. 오염 원복 확인(diff 0).

**발견**: Header Sections 착지 페이지는 이미 예제 8종(With stats·Centered·…)이 채워진 카탈로그다 — UE3 배치 1의 기반이 맨땅이 아니다.
