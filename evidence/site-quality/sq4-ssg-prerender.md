# SQ4 — SSG/prerender evidence (2026-07-28)

> Milestone: SQ4 (goal `site-quality`) · Plan: `plans/2026-07-28-sq4-ssg-prerender.md` · Changeset: `changesets/20260728-sq4-ssg-prerender/`

## 1. 프리렌더 생성 실측

- `npm run build` postbuild(`vite-node scripts/prerender-ui-vocabulary.ts`) — **754 라우트** 생성, 311ms(로컬). 홈·/get-started·/docs+문서·/patterns+컬렉션·용어 전부·/colors·/recipes·/pro·/search.
- 라우트별 고유 title·meta description·og:title/url/description·twitter·canonical + `#root` 첫 페인트 정적 콘텐츠(React 마운트 시 교체).
- 노출 게이트 재현(shell 문서·plus-templates·빈 termIds 제외 — exposure.ts 는 vite-node 아래서 DEV 라 데이터 필드로 직접 판정). 이스케이프 실측: docs 허브 "Spacing &amp; layout".
- 안전장치 동작: 템플릿 앵커 부재·중복 라우트·비안전 경로 = 빌드 실패.

## 2. 3계층 서빙 (wrangler pages dev 실측 → 함수 설계 근거)

- ASSETS 바인딩의 bare-경로 해석이 **환경·경로에 따라 308/404/셸-폴백 세 가지**로 갈리는 것을 실측 — bare 우선이면 `/search` 가 셸을 서빙. 함수 순서를 슬래시-인덱스 우선 → 원 경로(3xx 내부 추적) → 셸로 고정.
- 로컬 매트릭스: 프리렌더 8라우트 고유 title · 미지 앱 경로(/terms/zzz) = SPA 셸 · 미지 최상위 = 404.html. 실브라우저: 정적 첫 페인트 → React 인계(용어·홈·docs 허브·검색 2티어), 콘솔 0에러.
- 부수 수리: 함수 없는 `/colors`·`/pro` 직접 진입이 프리렌더 파일 + Pages 정적 서빙(308)으로 **처음 동작**(종전 404 갭).

## 3. 실배포 확인 (push 0174786 후)

- CF Pages CI 에서 vite-node 프리렌더 첫 실행 **성공** — 폴링 8회차에 `/terms/accordion` 정적 HTML 라이브 확인.
- 라이브 스팟(캐시버스터·재검증 포함): terms/accordion·docs·docs 문서·patterns 허브·컬렉션·get-started·search·recipes·colors 전부 고유 title — canonical·og:url 라우트별 정확. 초기 혼재 응답은 구배포 엣지 캐시(HTML max-age=0 이라 수렴 확인).
- 라이브 실브라우저: 프리렌더 착지 → React 인계 정상(용어 상세 인터랙션·검색 2티어 5+2) · 구 쿼리 URL(`/?page=term&id=accordion`) 리다이렉트 유지 · Sign in(오너 언락 클라이언트 경로) 표시·콘솔 0에러.
- 404 계약 유지: 미지 최상위 경로 404.

## 4. 회귀 게이트

- build·lint PASS · 디자인 verify 비악화(사이트 소스 무변경 — functions·scripts 만).
- SPA 폴백·legacy 리다이렉트·검색·오너 언락 표면 무회귀(위 라이브 실측).
