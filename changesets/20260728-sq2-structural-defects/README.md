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
