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

## step-2 — URL 딥링크 계약

**갭**: URL 초기 파서(`getInitialSearchState`)·popstate 동기화는 이미 있었으나, `?q=` 단독 딥링크가 page="home" 으로 남아 검색 결과 레이아웃이 렌더되지 않았다 (홈은 결과를 안 그림).

**수리** (`App.tsx` `getInitialSearchState`): query 가 있고 page 가 home 으로 풀리면 `nav:docs-*` → docs, 그 외 → plus 로 착지시킨다. 기존 파라미터 4종(`page`·`id`·`q`·`filter`) 스키마는 그대로 — 추가지 교체가 아니다.

**Verify (실행 관측, STEP2 VERIFY: PASS)**:
- ① `?filter=nav:plus-marketing-header-sections` 직행 → Header Sections 카탈로그 렌더 PASS
- ② `?q=아코디언` 직행 → 검색 결과에 아코디언 행 PASS (수리 전 홈 폴백이던 케이스)
- ③ 기존 `?page=term&id=accordion` 하위호환 PASS
- ③b 잘못된 `?id=no-such-term` → 빈 상세 폴백 렌더, 콘솔 에러 0 (failure probe)
- ④ 목록→상세(pushState)→뒤로가기 → 목록 복귀 PASS (popstate 실동작 확인)

## step-3 — 통합 E2E + 사람 관측

- 통합 시나리오(홈→검색→상세→사이드바→목록→딥링크 새 탭) Playwright 5항 PASS, 콘솔 에러 0.
- 회귀 게이트: `npm run build` exit 0 · `npm run lint` exit 0 (경고는 기존 항목).
- 경로 메모: 검색 추천 결과는 설계상 검색 결과 페이지로 착지 — 상세는 결과 행 2번째 클릭.
- 사람 관측: evidence 에 대기 상태로 기록 — 관측 완료 후 이 milestone 을 닫는다.

## step-3 보강 — 사람 관측 1회차(미달) 결함 수리 O1~O4

관측 1회차에서 결함 7건 적발(발화 원문은 evidence). 좁은 수리 4건 즉시 반영:
- O1 뒤로가기: `changePage`·`updateNavFilter`·`navigateFromHome`·`navigateToNavigationPath` 에 `pushHistoryEntry()` — 이동 전 현재 URL 을 히스토리에 push, 새 URL 은 디바운스 replaceState 가 채움.
- O2 검색 0건: `search-suggestions.ts` 의 용어 제안이 현재 필터 밖을 배제하던 것을 "필터 안 우선 → 전체 사전" 2-pass 로 교정.
- O3 TOC: "On this page" aside 4곳(App.tsx 3 + article-documentation-layout.tsx 1) sticky 화.
- O4 스크롤 체이닝: 좌측 내비 aside 에 `overscroll-contain`.

검증: F1·F1b·F2(한/영)·F3 전부 PASS, 콘솔 에러 0, build·lint exit 0. O5~O7 은 구조 결함 — plan finding 큐.

## step-3 보강 2 — 관측 2회차: O8 수리, O9·분리 결정 등록

- O8: 검색 *결과 리스트*(`search.ts` `searchTerms`)가 제안(O2)과 별도 경로로 여전히 필터에 갇혀 "0개 결과". "검색어 있으면 전체 사전 검색, 동점이면 필터 안 우선"으로 교정. 검증 4항 PASS(아코디언·헤더·accordion·docs-scope), build·lint exit 0.
- O9(결과 화면 UI 품질)·라우팅 분리 확정(→ ROADMAP UE5 pending)은 finding 큐·ROADMAP 에 기록.
