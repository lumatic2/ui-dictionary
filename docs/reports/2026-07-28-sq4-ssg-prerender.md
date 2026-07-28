# SQ4 — SSG/prerender 완료 보고 (2026-07-28)

## 1. 결과

- **754 라우트**(용어 전부·컬렉션·docs·정적 페이지)가 빌드타임 프리렌더로 라우트별 고유 title·description·og·canonical + 첫 페인트 정적 콘텐츠를 정적 제공한다 — CF Pages CI(vite-node) 첫 실행 성공, 실배포 확인 완료.
- SPA 폴백 함수 6개를 asset-first 3계층(프리렌더 → 원 경로 → 셸, 앱 밖 404 유지)으로 전환. SPA·검색·legacy 리다이렉트·오너 언락 표면 무회귀.
- 부수 수리: 함수 없는 `/colors`·`/pro` 직접 진입이 종전 404 갭에서 처음으로 동작.

## 2. 이슈와 해결

- fresh 계획 검증자 적발을 계획 단계에서 흡수: Node .mjs 는 TS·alias 체인 임포트 불가 → vite-node 확정 · terms.yml raw `&`/`>` → 전수 이스케이프.
- 실행 중 실측 2건: ① ASSETS 바인딩 bare-경로 해석이 308/404/셸-폴백 세 가지로 갈림 → 슬래시-인덱스 우선 순서로 고정(/search 가 셸로 새던 결함 수리) ② 배포 직후 라이브 응답 혼재 = 구배포 엣지 캐시 — HTML max-age=0 으로 수렴 확인.
- exposure.ts 의 SHOW_UNFILLED 가 vite-node 아래서 DEV=true 로 평가 → 노출 게이트를 데이터 필드로 직접 재현.
- 크기 회고: step 3개·changeset 1디렉터리 — milestone 라벨 정합.

## 3. 증거

- evidence: `evidence/site-quality/sq4-ssg-prerender.md` (생성 실측·3계층 매트릭스·실배포 확인)
- 실표면: 실배포 `ui.askewly.com` — curl 로 9라우트 고유 title·canonical·og:url 확인 + 실브라우저(Playwright)로 프리렌더 착지→React 인계·legacy 쿼리 리다이렉트·검색 2티어(5+2)·Sign in 표시·콘솔 0에러.
- 재현: `cd examples/ui-vocabulary-site && npm run build` → "prerender: 754 routes" · `npx wrangler pages dev examples/ui-vocabulary-site/dist` 후 curl 매트릭스(scratchpad 세션 로그).
- 평가 못 함: 오너 로그인 후 전체 열람은 실계정 로그인이 필요해 이번 검증에선 Sign in 진입 경로 생존까지만 확인(클라이언트 코드 무변경이라 회귀 벡터 없음).
