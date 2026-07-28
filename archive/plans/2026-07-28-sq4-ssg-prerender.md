# PLAN — SQ4: SSG/prerender (사이트 품질 4/4)

> 생성: 2026-07-28 · 갈래: product 기능/화면(빌드·배포 파이프라인 + SEO 표면) · scope: 주요 라우트 정적 프리렌더 — 라우트별 메타 + 첫 페인트 정적 콘텐츠, SPA·오너 언락 무회귀. goal `site-quality` 마지막 milestone.
Status: approved (사용자 승인 2026-07-28 "ㄱㄱ" — 방식 확정 + fresh 검증자 반영본)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — 공개 웹사이트 축의 도달성: 검색엔진·링크 미리보기·첫 페인트가 CSR 셸이 아니라 실내용이어야 한다.
- **goal**: `site-quality` · **milestone**: SQ4 (SQ3 구현 완료 후 착수 — SQ3 사람 관측은 병행 대기).
- **리서치 입력**: 조사 = 이 세션 실측 (별도 research 문서 불요). ① 빌드 = Cloudflare Pages Git 통합 CI(`cd examples/ui-vocabulary-site && npm ci && npm run build`, 출력 dist/) — 프리렌더는 build 안에서 돌아야 하고 Playwright 류 브라우저 의존은 CI 리스크. ② 현재 index.html 은 사이트 공통 메타 1장 — 라우트별 title/description/og/canonical 없음(런타임 usePageMeta 만). ③ **SPA 폴백 함수가 정적 파일을 가린다**: `functions/{terms,patterns,docs,get-started,recipes}/[[path]].js`·`search.js` 가 무조건 `/`(index.html)를 서빙 — Pages 는 함수가 정적 자산보다 우선이라, 프리렌더된 `dist/terms/x/index.html` 을 두어도 함수를 asset-first 로 바꾸지 않으면 절대 서빙되지 않는다. ④ 데이터 원천: `src/data/terms.generated.ts`(용어)·`src/lib/navigation-model.ts`(컬렉션)·`src/lib/documentation-pages.ts`(docs) — 전 라우트 메타·본문을 빌드타임에 계산 가능.

## Scope Boundary
- **포함**: ① 프리렌더 생성기(Node, 브라우저 무의존) — 라우트별 `dist/<route>/index.html`: 고유 title·description·og·canonical + 첫 페인트용 정적 콘텐츠(`#root` 안 — React 마운트 시 교체). 대상 = / · /get-started · /docs(+문서 slug) · /patterns(+컬렉션 slug) · /terms/:id 전 용어 · /colors · /recipes · /pro · /search(메타만) ② SPA 폴백 함수 asset-first 전환(정적 파일 있으면 그것, 없으면 index.html — 404.html 계약 유지) ③ 통합 검증 + 실배포 확인(정적 HTML 실서빙·SPA 회귀·오너 언락 무회귀).
- **제외**: SSR/hydration 프레임워크 전환 · 브라우저 스냅샷 프리렌더(사용자 확정 2026-07-28: 정적 셸+메타 방식) · 인터랙티브 데모의 정적 렌더(JS 로드 후 영역) · sitemap.xml(이미 있으면 갱신, 없으면 finding 큐로만).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 생성기는 빌드 산출물에만 쓴다(소스 무변경 산출) — 스크립트·함수 커밋 revert 로 원복. 함수 asset-first 가 잘못되면 증상 = 라우트 404/빈 페이지로 즉시 관측됨.

## 스캐폴딩 결정
- source-of-truth: 라우트 스킴 = `src/lib/url-mapping.ts` · 메타 문구 = `src/lib/page-meta.ts` 와 동일 규칙(제목 "X — Askewly Design") · 콘텐츠 = terms.generated·navigation-model·documentation-pages(사본 금지 — 생성기가 같은 모듈을 임포트).
- 검증: 로컬 build 후 dist 검사(생성 파일 수 = 라우트 수·spot HTML 파싱) + `npx wrangler pages dev dist` 로 함수+정적 동시 서빙 실측 + Playwright(정적 첫 페인트 → React 교체 후 동작·오너 언락 경로·기존 스모크) + **실배포 확인**(curl: /terms/accordion HTML 에 고유 title, /search 는 SPA 폴백).
- 배포/운영: push = 완료 절차 일부(CF Pages 자동 빌드). 빌드 시간 증가는 실측해 evidence 에 기록.
- 자기선언 도메인 — **SPA 무회귀 계약**: 프리렌더는 부가 층이다 — JS 로드 후 동작(라우팅·검색·오너 언락·Pro 게이트)은 전부 기존 그대로. 프리렌더 없는 라우트(딥 쿼리·미지 경로)는 기존 폴백·404 계약 유지.
- 검토 후 제외: 브라우저 스냅샷 프리렌더 — CF CI 에 Chromium 설치·빌드 시간 급증·562 용어 비현실(사용자 확정으로 기각). react-dom/server SSR — App 이 window·canvas 의존이라 리스크 대비 이득 없음.

## 결정 로그
- status: resolved
- **방식 (사용자 확정 2026-07-28)**: 정적 셸+메타 생성 — Node 스크립트가 용어·컬렉션·문서 데이터에서 라우트별 index.html 생성(메타 + 첫 페인트 정적 콘텐츠, React 마운트 시 교체). CI 안전·전 용어 포함.
- **기술 결정**: ① 생성기는 postbuild 로 `npm run build` 에 편입(CF 빌드 커맨드 무변경) ② 함수 asset-first: 요청 경로의 정적 자산을 먼저 시도(<400), 없으면 index.html — 404.html 계약 유지 ③ `#root` 내 정적 콘텐츠는 createRoot 마운트가 통째로 교체하므로 hydration 불일치 이슈 없음 ④ 정적 콘텐츠 범위 = 텍스트 위주(h1·정의·핵심 링크) — 시각 데모는 JS 영역 ⑤ **TS 모듈 로딩 = `vite-node`**(fresh 검증자 적발: Node .mjs 는 terms.generated.ts·`@` alias 체인을 직접 임포트 불가, 레포 선례도 전무·TS 실행기 미설치): devDependency 로 vite-node 추가, 생성기는 TS(`scripts/prerender-ui-vocabulary.ts` — 사이트 vite.config alias 로 앱 모듈 임포트), postbuild 에서 `vite-node` 로 실행 ⑥ **삽입 문자열 전부 HTML 이스케이프 의무**(terms.yml 에 `Q&A list`·`홈 > 대시보드` 류 raw `&`/`>` 실재) — escape 유틸 필수 + 특수문자 보유 용어를 검증 표본에 명시 포함.
- **새 사용자 소유 결정: 없음.**

## Step 트리

- [x] **step-1 — 프리렌더 생성기 + 빌드 편입**
  - Artifact: `scripts/prerender-ui-vocabulary.ts`(레포 루트 scripts/) — `vite-node` 로 실행해 앱 모듈(terms.generated·navigation-model·documentation-pages·url-mapping)을 `@` alias 그대로 임포트 + `package.json` postbuild 훅(devDependency: vite-node). 라우트별 dist HTML 생성: 고유 title·meta description·og:title/description/url·canonical + `#root` 정적 첫 페인트(용어 = 한/영 이름·정의·카테고리, 컬렉션 = 제목·설명·항목 링크, docs = 제목·lead). **삽입 문자열 전수 HTML 이스케이프.**
  - Files: write scripts/prerender-ui-vocabulary.ts(신규), examples/ui-vocabulary-site/package.json(postbuild·devDependency). read src/data/terms.generated.ts, src/lib/navigation-model.ts, src/lib/documentation-pages.ts, src/lib/url-mapping.ts, dist/index.html(템플릿).
  - Risk: 기계적 (빌드 산출물 생성만 — 소스·런타임 무변경)
  - Verify: `npm run build` 후 dist 에 라우트 파일 전수 생성(개수 = 용어+컬렉션+문서+정적 페이지 합) + spot HTML 파싱(title·og·정적 h1 — **특수문자 보유 용어 "Q&A" alias 포함 표본**) + 빌드 시간 실측.
  - Failure probe: ① 용어 id URL 비안전 문자·중복 slug — 생성 경로 충돌 시 빌드 실패로 소리내기 ② vite-node 가 CF CI(npm ci) 에서 도는지 — devDependency 설치 확인.
  - Dependencies: 없음
  - Commit: changeset `sq4-ssg-prerender` (README 절: step-1).

- [x] **step-2 — SPA 폴백 함수 asset-first 전환**
  - Artifact: `functions/{terms,patterns,docs,get-started,recipes}/[[path]].js`·`functions/search.js` — 요청 경로 정적 자산 우선, 미존재 시 index.html 폴백. 앱 밖 경로 404.html 계약 유지.
  - Files: write functions/terms/[[path]].js, functions/patterns/[[path]].js, functions/docs/[[path]].js, functions/get-started/[[path]].js, functions/recipes/[[path]].js, functions/search.js. read docs/ui-vocabulary/deployment.md(§SPA — 갱신 포함).
  - Risk: 위험 (배포면 라우팅 — wrangler pages dev 로컬 실측 + 실배포 스팟 체크로 격리)
  - Verify: `npx wrangler pages dev` 로 ① 프리렌더 라우트 = 정적 HTML(고유 title) ② 프리렌더 없는 앱 경로 = index.html 폴백 ③ 미지 경로 = 404.html — 3계층 실측.
  - Failure probe: ASSETS.fetch 가 디렉터리 경로(`/terms/accordion`)를 `…/index.html` 로 해석 못 하는 경우 — trailing-slash/index 해석 실측, 필요시 함수에서 명시 매핑.
  - Dependencies: step-1
  - Commit: changeset `sq4-ssg-prerender` (README 절: step-2).

- [x] **step-3 — 통합 검증 + 실배포 확인 (SQ4 마감)**
  - Artifact: 통합 검증 + `evidence/site-quality/sq4-ssg-prerender.md` + push·실배포 확인.
  - Files: write evidence/site-quality/sq4-ssg-prerender.md. 실행: build·lint·verify 비악화·Playwright(정적 첫 페인트→React 교체 후 검색·내비 동작, 오너 언락 경로 무회귀, 기존 스모크 4라우트)·push·실배포 curl+실브라우저.
  - Risk: 기계적 (검증·기록·배포 확인)
  - Verify: 실배포에서 ① `curl /terms/accordion` HTML 에 고유 title·정적 본문 ② 실브라우저로 동일 라우트 인터랙션 정상 ③ 구 쿼리 URL 리다이렉트·404 계약 무회귀 ④ 오너 로그인 경로 200(회귀 없음 — 세션 fetch 는 클라이언트 그대로).
  - Failure probe: CF 캐시가 구 index.html 을 물고 있는 경우 — 번들 해시 폴링 후 정적 HTML 도 재확인.
  - Dependencies: step-2
  - Commit: changeset `sq4-ssg-prerender` (README 절: step-3).

## 검증/DoD
- **DoD**: 주요 라우트(홈·용어·패턴·docs)가 prerender 되어 최초 페인트·SEO 메타가 정적 제공되고, SPA 폴백·오너 언락 회귀 없음(실배포 확인 포함).
- **Evidence**: `evidence/site-quality/sq4-ssg-prerender.md`
- **회귀 게이트**: SPA 3계층 폴백(정적/폴백/404) 실측 + 기존 스모크·검색·오너 언락 무회귀 + verify 비악화.

## 수치 출처
- 빌드·배포 구조 = `docs/ui-vocabulary/deployment.md` + 이 세션 실측(functions 우선순위·index.html 메타 판독). 용어 수 = terms.generated(562 용어 계열).

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-28 작성 — 방식 결정(정적 셸+메타 생성) AskUserQuestion 매듭. 핵심 발견: SPA 폴백 함수가 정적 자산보다 우선이라 asset-first 전환 없이는 프리렌더가 서빙되지 않음(step-2 근거).
- 2026-07-28 fresh 계획 검증자(sonnet) 지적 반영 — 생성기의 TS 모듈 임포트 불가(Node .mjs·alias 체인·실행기 부재 실측) → vite-node 실행 방식으로 확정 · HTML 이스케이프 의무화(terms.yml raw `&`/`>` 실재) · auth 프록시 함수 제외는 정확 판정(이상 없음) · og:image 루트-상대라 서브디렉터리 무해 확인.
