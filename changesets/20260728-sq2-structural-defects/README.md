# changeset — SQ2: 구조 결함 O5·O6·O7 수리

> Milestone: SQ2 (goal `site-quality`) · Plan: `plans/2026-07-28-sq2-structural-defects.md` · 2026-07-28

## step-1 — O5: Get Started 시작 가이드 착지

UE1 관측 O5(Get Started 착지 빈 페이지 — 노출 정책과 긴장) 를 사용자 결정(2026-07-28 "시작 가이드로 재정의")대로 수리.

- `src/components/get-started-page.tsx` 신설 — 시작 가이드 실콘텐츠: 탐색 경로 4카드(Patterns·Docs·Colors·Recipes) + 용어 검색 안내(Ctrl F) + 에이전트 진입(`/llms.txt` 링크). 타이포 5단계 이내(12/14/16/18/36), 색 전부 토큰.
- `landing-hero.tsx` — primary CTA "Get Started" 의 `SHOW_UNFILLED` 게이트 제거(실콘텐츠 착지라 정책 비대상), 착지를 `/download` → `/get-started` 로 전환. 프로덕션 히어로에 primary CTA 부활.
- 라우트 3면: `routes.tsx` APP_PATHS + `lib/url-mapping.ts`(UrlPageMode·STATIC_PAGES) + 레포 루트 `functions/get-started/[[path]].js`(SPA 폴백 — 직접 URL 진입 대비).
- PageMode 배선: `App.tsx`(union·lazy 렌더 분기·noExploreLayout 2곳), `lib/page-meta.ts`(문서 제목 "Get Started"), `lib/search-suggestions.ts`·`home-page.tsx`(destination union).
- `/download` 는 종전대로 게이트 뒤 유지 — 변경 없음.

검증: tsc·build PASS · 디자인 verify 신규 파일 위반 0(전체 잔존 7 = SQ1 이월 타이포 그대로) · Playwright 실브라우저 — 히어로 CTA 착지·카드→/patterns/marketing 이동·직접 URL 진입·llms 링크·콘솔 0에러.

## step-2 — O6: Docs 랜딩 소개+허브

UE1 관측 O6(Docs 랜딩 역할 불명) 을 사용자 결정(2026-07-28 "소개+허브 결합")대로 수리. fresh 검증자 지적대로 신규 파일이 아니라 기존 미배선 `DocsCatalogLanding`(docs-all 에서만 렌더, 구 vocabulary 시대 목업) 재작성.

- `App.tsx` `DocsCatalogLanding` 전면 재작성 — Askewly Design 소개 문단 + `docsNavGroups` 파생 그룹 카드 허브 5장(Getting started·Elements·Foundations·Vocabulary·Agent Recipes, shell 게이트 적용). 구 목업 상수 4종(docsLandingTabs·docsGettingStartedSteps·docsLandingCode·docsLandingItems) 제거 — 이 변경으로 죽는 코드.
- `/docs` 기본 착지 → 허브: `getDefaultFilterForPage`·`changePage`·`selectPrimaryAxis`(documentation 축)·siteTopNav "Docs"·`landing-hero.tsx` "Open Docs" 전부 `nav:docs-all` 로 전환.
- 허브 랜딩에서 docs-all 매칭 용어 수백 행 덤프 억제(`!isDocsLanding` 게이트) — 1차 스크린샷에서 허브가 14,000px 목록에 묻히는 것을 확인하고 수정.
- 기존 `/docs/:slug` 문서 딥링크·구 쿼리 URL(?page=docs&filter=…) 리다이렉트 무회귀.

검증: tsc·lint PASS · Playwright — /docs 허브 렌더·카드→문서 착지·딥링크(getting-started-setup)·topnav Docs→허브·legacy 리다이렉트→해당 문서·콘솔 0에러 · 풀페이지 스크린샷 육안 확인.
