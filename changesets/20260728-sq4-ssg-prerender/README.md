# changeset — SQ4: SSG/prerender

> Milestone: SQ4 (goal `site-quality`) · Plan: `plans/2026-07-28-sq4-ssg-prerender.md` · 2026-07-28

## step-1 — 프리렌더 생성기 + 빌드 편입

- `scripts/prerender-ui-vocabulary.ts`(레포 루트) 신설 — vite-node 로 실행해 앱 데이터 모듈(terms.generated·navigation-model·documentation-pages·search)을 `@` alias 그대로 임포트(계획 기술 결정 ⑤). 라우트별 `dist/<route>/index.html` 생성: 고유 title·meta description·og:title/url/description·twitter·canonical + `#root` 첫 페인트 정적 콘텐츠(용어 = 카테고리·한/영 이름·정의·설명, 컬렉션 = 경로·항목 링크, docs = 브레드크럼·제목·lead·섹션 제목, 허브·정적 페이지 포함).
- 노출 게이트 재현: exposure.ts 는 vite-node 아래서 DEV=true 라 쓰지 않고 데이터 필드로 직접 판정(shell 문서 제외·plus-templates 게이트·빈 termIds 컬렉션 제외).
- 안전장치: 템플릿 앵커 부재·중복 라우트·비안전 경로문자 = 빌드 실패로 소리내기. 삽입 문자열 전수 HTML 이스케이프(기술 결정 ⑥).
- `package.json` — postbuild 훅(`vite-node ../../scripts/prerender-ui-vocabulary.ts`) + devDependency `vite-node`. CF 빌드 커맨드 무변경.

검증: `npm run build` — 754 라우트 생성 311ms(빌드 시간 영향 미미) · spot HTML 4종(title·og:url·canonical 고유값) · "Spacing &amp; layout" 이스케이프 확인 · dist index.html 수 = 754.

## step-2 — SPA 폴백 함수 asset-first 전환

- `functions/{terms,patterns,docs,get-started,recipes}/[[path]].js`·`functions/search.js` 전면 재작성 — 서빙 순서: ① 트레일링 슬래시(디렉터리 index) 변형 ② 원 경로(3xx 는 내부 추적 — 클라이언트 URL 불변) ③ SPA 셸. 앱 밖 미지 경로 404.html 계약 유지.
- 순서 근거(실측 2026-07-28, wrangler pages dev): ASSETS 바인딩의 bare-경로 해석이 환경·경로에 따라 308(디렉터리)·404·셸-폴백 세 가지로 갈렸다 — bare 우선이면 `/search` 가 프리렌더 대신 셸을 서빙. 슬래시-인덱스 우선으로 세 환경 전부에서 결정적.
- `/colors`·`/pro`(함수 없는 라우트)는 프리렌더 파일이 생기며 Pages 정적 서빙(308→슬래시)으로 직접 진입이 **처음으로 가능해짐**(종전엔 404 갭).
- `docs/ui-vocabulary/deployment.md` §SPA 에 Prerender+asset-first 절 추가.

검증: wrangler pages dev 3계층 매트릭스 — 프리렌더 8라우트 고유 title·미지 앱 경로=셸·미지 최상위=404 · 실브라우저(Playwright): 정적 첫 페인트→React 인계(용어 h1·홈 히어로·docs 허브·검색 2티어), 콘솔 0에러.
