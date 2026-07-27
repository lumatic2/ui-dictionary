# changeset — UE5 페이지 분리 (라우팅 전환)

> milestone UE5 · plan `plans/2026-07-27-ue5-routing-split.md` · 2026-07-27

## step-1 — 라우터 골격 + URL 어댑터 + 하위호환 리다이렉트

- **react-router 8.3.0** 설치 (계획은 v7 표기 — 설치 시점 최신 메이저가 8, createBrowserRouter/RouterProvider/lazy API 동일 계열 확인).
- 신설 `src/lib/url-mapping.ts` — 경로 스킴 정본. 상태↔URL 순수 변환 3함수(`urlFromState`·`stateFromUrl`·`legacyRedirectPath`). 스킴: `/terms/:id` · `/patterns[/:slug]`(slug=컬렉션 id 에서 `plus-` 제거) · `/docs[/:slug]` · `/search?q=` · `/colors|recipes|pro|download`. 비컬렉션 필터는 `?filter=` 유지.
- 신설 `src/routes.tsx` — 전 경로가 기존 `<App/>` 을 렌더하는 어댑터 단계. `/` loader 가 구 쿼리 URL 을 새 경로로 redirect(auth/reason 파라미터 보존), `*` → `/`.
- `src/main.tsx` — RouterProvider 마운트.
- `src/App.tsx` URL 층 교체: popstate 리스너 → location 동기화 효과(자기 navigate 는 `lastSyncedUrlRef` 로 구분), 디바운스 replaceState → `navigate(replace)`, selectTerm/changePage/goHome/updateNavFilter/navigateFromHome/navigateToNavigationPath 의 수동 history 조작·`pushHistoryEntry` → `navigateToUrl`(push) 일원화, `getInitialSearchState` 경로 우선 파싱(+구 쿼리 폴백), auth 파라미터 정리도 navigate(replace) 로.

**Verify (실행 관측, `UE5 STEP1: PASS`)**: 새 경로 직행 2종 · 구 URL 4형태 리다이렉트(term/filter/q/docs) · 검색 리다이렉트 후 결과 렌더 · 상세→뒤로가기 · 사이드바 클릭이 경로 URL 생성 · 미지 경로→홈, 콘솔 에러 0. OAuth 리턴 `?auth=ok` → 파라미터 제거·Sign out 표시·JS 에러 0. build·lint exit 0.

**Failure probe**: `legacyRedirectPath` 의 term 분기 일시 오염 → `?page=term&id=accordion` 이 `/patterns` 로 잘못 착지함을 검증이 FAIL 로 적발, 원복 확인.

**배포 메모**: 경로 라우팅은 정적 호스팅에 SPA fallback(전 경로→index.html) 설정을 요구한다 — 배포 시점에 `docs/ui-vocabulary/deployment.md` 갱신 필요.

## step-2 — 화면 모듈 분리 + lazy 코드 분할

- **절단 1 (최대)**: `MarketingSectionPreview` + Hero/AppScreenshot/PhoneMockup + 변형 타입(약 17,200줄)을 `src/components/marketing-section-preview.tsx` 로 이동, `marketing-section-preview-lazy.tsx` 경유 lazy 로딩. App.tsx 23,507줄 → 약 6,300줄.
- **절단 2**: HomePage·ColorsPage·RecipeGallery·TermPage 를 App 에서 `lazy()` + Suspense 로 전환.
- **절단 3**: 목록 행(`term-result-row`)의 `TermVisual`(미니목 렌더러) lazy 화 + 행 href 를 구 쿼리에서 `/terms/:id` 경로로 교정.
- 공유 유틸 신설: `src/lib/preview-theme.ts`(테마 타입·훅), `src/lib/strings.ts`(slugify·toPascalCase) — App 과 분리 모듈이 함께 쓴다.
- **계획과의 편차 (정직 기록)**: 계획서는 `src/pages/*` 신설·"App.tsx 는 셸만"을 적었으나, 실제는 기존 컴포넌트 파일 경계를 살린 분리로 같은 효과(청크 분할·App 축소)를 더 작은 이동 diff 로 달성했다. Pro/Download/카탈로그 골격(약 6천 줄)은 App 에 잔류 — 완전 분리는 finding 큐로 이월.

**청크 실측 (build 출력, 전/후 동일 커맨드)**:
- 전(step-1 HEAD, stash 실측): `index 3,324.47 kB │ gzip 786.30 kB` — 사실상 단일 청크
- 후: `index 1,757.83 kB │ gzip 474.63 kB` (**-47% / gzip -40%**) + lazy 청크 `marketing-section-preview 941 kB`·`three-object-scene 882 kB`·`term-visual 281 kB`·`recipe-gallery 253 kB`·`term-page 20 kB`·`colors-page 7 kB`
- failure probe 등가: 전 측정 자체가 "lazy 를 동기로 되돌린 상태"(stash)의 실측 — 단일 3,324 kB 로 감소 소멸을 확인.

**Verify**: UE5 회귀 스위트 10항 전부 PASS(콘솔 에러 0) · `npx tsc -b` 에러 0 · `npm run lint` exit 0 · 뒤로가기·검색 상태 URL 왕복 유지(스위트 3b·4).
