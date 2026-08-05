# 20260805-m29-docs-block-and-alias — M29 이식 경로 완결

> plan: `plans/2026-08-05-m29-docs-block-and-alias.md` · milestone: M29

## step-1 — `@/` alias 감지 + 안내

- 증상: 이식된 코드가 전부 `@/…` 로 import 하는데 킥스타트의 `Next steps` 는 그 alias 를 설정하라는 말을 하지 않았다. 신선 vite react-ts 프로젝트에서 `tsc -b` **6건 실패**, M28 라이브 E2E 두 번 모두 사람이 손으로 메웠다. (`@/` 의존은 `rewriteImports` 가 만드는 게 아니라 레지스트리 소스에 이미 있다.)
- 처리: `detectPathAlias(targetDir)` + `aliasStep(status, srcRel)` 두 순수 함수 추가. 설정이 **양쪽 다** 있으면 단계를 인쇄하지 않고, 없는 쪽 스니펫만 인쇄한다. `Next steps` 는 배열로 조립해 번호를 자동 부여(4단계 ↔ 5단계).
- **함정 ① JSONC**: tsconfig 는 주석을 허용해 `JSON.parse` 가 깨진다. 파서를 들이지 않고 `stripComments`(문자열 상태를 추적하는 20줄 스캐너)로 주석만 비운 뒤 원문 정규식으로 판정. 주석 처리된 `// "paths": { "@/*": … }` 는 **설정 없음**으로 읽힌다(테스트로 고정).
- **함정 ② 솔루션 tsconfig**: vite react-ts 템플릿의 루트 `tsconfig.json` 은 `references` 만 갖고 `compilerOptions` 는 `tsconfig.app.json` 이 소유한다. 루트에 `paths` 를 쓰면 `tsc -b` 가 무시하므로, **compilerOptions 를 실제로 소유한 파일을 지목**한다. 실행 확인: 스톡 프로젝트에서 안내가 `tsconfig.app.json` 을 지목.
- **실행이 잡은 결함 1건 (E2E 게이트의 값)**: 1차 스니펫이 `"baseUrl": "."` 를 포함했는데 **TypeScript 6.0.3 에서 `TS5101` 로 빌드가 깨진다**(deprecated). 미싱 모듈 6건을 deprecation 1건으로 바꾼 셈. `paths` 는 TS 4.4+ 부터 baseUrl 없이 tsconfig 상대로 해석되므로 `baseUrl` 을 뺐다. 테스트에 `not.toContain("baseUrl")` 로 고정.
- **신규 npm 의존 없음** (계획 기술결정 ⑥): `vite-tsconfig-paths` 를 권하지 않는다 — 인쇄되는 `npm i` 목록은 "이식된 파일이 실제로 import 하는 것"이라는 M28 계약이라, 빌드 도구 플러그인을 섞으면 그 계약이 흐려진다. 대신 `resolve.alias` + `fileURLToPath`(vite 가 이미 쓰는 Node 내장).
- 스니펫은 **이식이 실제로 일어난 위치**를 가리킨다 — `src/` 가 없는 프로젝트면 `["./*"]`·`new URL(".", …)`.
- 게이트: vitest **77/77**(신규 6) · `tsc --noEmit` exit 0 · **실표면 재현**(스니펫 수정 후 처음부터 다시): 빈 vite react-ts → `init . --block marketing-landing --color teal --yes` → **인쇄된 스니펫 그대로 적용** → **인쇄된 `npm i` 그대로** → `npx tsc -b` **exit 0**(M28 의 6건 무재현) → `npm run build` **exit 0** → 같은 디렉터리에서 재실행 시 alias 단계 **미인쇄**(4단계로 복귀).

## step-2 — docs-site 셸 흡수 실사 + 구성 확정

- 산출: `research/2026-08-05-m29-docs-site-absorption-survey.md` (후보 8건 · 접근일 2026-08-06).
- **판정: 흡수 0건 → 자체 조합**(`block-contract` §3). 정통 docs 프레임워크 5종(Fumadocs·Nextra·Starlight·Docusaurus·VitePress)은 예외 없이 **자체 라우팅 + 자체 빌드 파이프라인을 소유한 SSG** 라 "React+Tailwind 파일 몇 개를 registry 로 복사"라는 배포 형태와 태생이 다르다 — Vue(VitePress)·Astro 컴포넌트(Starlight)는 언어가 다르고, Next.js 2종은 MDX 로더가 빌드에 박혀 있고, Docusaurus 는 Tailwind 가 아닌 Infima.
- 라이선스가 통과한 둘은 **셸을 담고 있지 않다**: shadcn/ui `apps/www` 는 셸이 Next.js 앱과 얽혀 있고(프리미티브 `@/components/ui/*` 는 애초에 우리가 얹혀 있는 바닥이라 흡수 대상이 아니다), `@mintlify/components` 는 Accordion·Callout·CodeBlock 등 **콘텐츠 위젯만** 있고 navbar·버전 스위처·사이드바·⌘K 가 없다. Tailwind Plus 는 상업 라이선스로 공개 registry 재배포와 충돌 → 기각.
- **parent 라이선스 재확인 2건**(계획 위임 결정대로 child 결과를 완료로 믿지 않음): child 가 "확인 못 함"으로 남긴 shadcn/ui·Mintlify 를 `raw.githubusercontent.com` LICENSE 원문으로 직접 대조 — 각각 **MIT © 2023 shadcn**, **MIT © 2022 Mintlify, Inc.** 확정. 둘 다 흡수하지 않으므로 판정은 불변, 기록으로만 남긴다. Nextra 는 원문 미대조이나 기각 사유가 라이선스가 아니라 결합도라 승격 무관.
- **구성표 확정** — docs 계열 asset **7종 전부 배치, 미사용 0**: 좌측 레일=`versioned-docs-switcher-navbar-sidebar-swap` · 검색=`doc-search-cmdk-grouped-results-panel` · 아티클=`docs-code-block`+`terminal-demo-panel`+`responsive-content-grid` · API=`api-reference-layout` · 체인지로그=`docs-changelog-category-filter-page`. 블록 원본 = 상단 navbar · 본문 prose·on-page 목차 · 3페이지 전환 상태 · `data.json`.
- 기준선 확보(step-3 의 "기존 자산 무변경" 증명용): `generate-registry` 재실행이 **멱등**(56 assets + index = 57 파일, git diff 0) · `check-llms-sync` PASS.

## step-3 — `docs-site` 블록 소스 + registry 등재 + 계약 §6

- 소스 6파일 — `page.tsx`(셸 + 3페이지 전환 + ⌘K 키 바인딩) · `docs-navbar.tsx` · `article-page.tsx` · `api-page.tsx` · `changelog-page.tsx` · `data.json`. 흡수분 0 이므로 §5 2중 표기 대상 없음(헤더에 자체 조합임과 그 사유를 남김).
- **상태 분리 계약**: 필터·페이지네이션·버전 상태는 **블록**이 쥐고, asset 은 **이미 좁혀진 데이터**를 받는다. `docs-changelog-category-filter-page` 는 스스로 필터링하지 않고 빈 그룹만 숨긴다 — "카테고리에 매치된다"의 정의가 소비자 태깅 스킴에 달렸기 때문이고, asset 이 그걸 추측하면 안 된다.
- **계약 실측으로 data 를 고친 1건**: `TerminalScene` 이 `{prompt, lines, result:{address,label}}` 인데 초안 `data.json` 은 `{command, result:[]}` 로 썼다 — asset 소스를 읽고 계약대로 교정. (추정으로 데이터를 쓰면 렌더 시점에 터진다.)
- 등재: `registry.json` 에 `tier:"block"` + `requiredCssVars` 20종. 생성기가 regDeps 를 **자동 해석** — 조합 asset 7종 URL + shadcn `badge`·`button`, npm dep `lucide-react`, files 6.
- **`requiredCssVars` 실사용 대조** (계획 기술결정 ⑤ — 선언이 좁으면 킥스타트 검사가 통과해 버리고 이식처에서 색이 빠진다): 블록은 `var(--…)` 를 직접 쓰지 않고 Tailwind 유틸리티로 참조하므로 **조합 asset + 그 shadcn primitive 까지 전이적으로** 스캔했다. 실사용 semantic 19종 + `--radius`(rounded-lg/md) = **선언 20종과 정확히 일치**. `--sidebar*`·`--chart-*` 사용 **0**(좌측 레일이 `sidebar` primitive 가 아니라 조합 마크업이라 불필요) — 그래서 `saas-app-shell` 의 28종이 아니라 `marketing-landing` 의 20종 집합이 맞다.
- 게이트: `generate-registry` 순수성 게이트 PASS · **기존 56 자산 diff 0**(신규 `docs-site.json` + 인덱스만) · `verify` 블록 5파일 **0건** · 사이트 `npm run build`(= `tsc -b` + vite) **exit 0** + prerender **759** · `tsc --noEmit -p tsconfig.app.json` exit 0(블록이 아직 미참조라 명시 실행) · oxlint 0건 · llms 재생성(210 assets).

## step-4 — 사이트 데모 배선 + 실브라우저 관측 (사람 게이트)

- 배선: `recipe-gallery-demo-registry.ts`(+`DocsSiteDemo`)·`recipe-gallery-data.ts`(Docs 컬렉션). 카드 클릭 시 데모 마운트·콘솔 0.
- 관측은 **갤러리 카드가 아니라 소비자 전체 화면**에서 했다 — 빈 vite 에 이식해 `vite preview` 로 띄움. 판단이 정직해진다.
- **사용자 지목 A — 다크에서 코드 패널이 흰색으로 뒤집힘 → 어둡게 수정.** `bg-foreground`/`text-background` 의미 반전이 원인. `dark:bg-muted dark:text-foreground` 를 덧붙였다(터미널은 7곳). **새 토큰을 만들지 않았다** — requiredCssVars 가 늘면 배포된 소비자 계약이 바뀐다.
- **계획 대비 드리프트(확장) 2건 — 정직한 기록**:
  - ① Files 범위: step-4 계획은 배선 2파일 + evidence 였는데 **asset 3종**(`docs-code-block`·`api-reference-layout`·`terminal-demo-panel`)을 고쳤다. 계획서가 "지목이 asset 에 걸릴 수 있다"고 미리 경고한 범위 안이지만 파일은 더 넓다. `terminal-demo-panel` 은 `marketing-landing` 도 쓰므로 그 블록의 다크 터미널도 같이 어두워진다 — 같은 종류의 개선이라 의도적으로 포함.
  - ② **CLI 를 다시 건드렸다**(step-1 소관 파일). 아래 B·C 는 관측 중 발견한 이식 경로 결함이고, 0.4.2 출고가 step-5 라 같은 릴리스에 실린다.
- **지점 B (계획 밖 발견, 지목보다 큼) — 다크 스위치가 둘로 갈라져 있었다.** 생성된 `askewly-brand.css` 가 `.dark{}` 로 토큰 값만 정의하고 **`dark:` 유틸리티를 그 클래스에 묶는 선언이 없었다** — Tailwind v4 기본은 `prefers-color-scheme`. 이식된 shadcn primitive **9종 18곳**이 `dark:` 를 쓰므로 하중을 받는다. 발견 경위가 결정적: **관측하려고 내가 `@custom-variant` 를 손으로 넣고서야 다크가 보였다** = `@/` alias 와 같은 종류의 누락. → `renderBrandCss` 가 `@custom-variant dark (&:where(.dark, .dark *));` 를 토큰보다 앞에 내고, `Next steps` 에 "`dark` 를 `<html>` 에 붙이면 토큰·유틸리티가 같은 스위치" 단계 추가.
- **지점 C — `color-scheme` 미선언.** 토큰은 우리가 그리는 것만 칠한다. 스크롤바·네이티브 컨트롤·오버스크롤 지면은 브라우저 소유라 다크에서 흰색으로 남았다. `:root`/`.dark` 에 각각 선언.
- **지점 D — OS 다크 기본값은 의도적 미조치.** `prefers-color-scheme` 자동 적용은 앱의 명시적 토글과 충돌한다(사용자가 라이트를 골라도 OS 가 이김). 스위치를 하나로 두고 인쇄된 안내가 켜는 법을 말하게 했다.
- 게이트: **인쇄된 안내만으로 재현**(수기 보완 0) → build exit 0 · 실측 computed style 다크 `color-scheme: dark`·`--background #0f1219`·`pre` 배경 `rgb(30,36,46)`, 라이트로 떼면 `color-scheme: light` 로 따라옴 · 라이트 회귀 없음 · 콘솔 0 · registry 재생성 diff = 수정 asset 3종만(다른 54종 무변경) · verify 0건 · 사이트 build+prerender 759 · vitest **80/80**(신규 3) · tsc exit 0 · oxlint 0건.
- 남긴 finding: 같은 반전을 쓰는 나머지 **9개 파일**(marketing hero·colors-page·contrast-duo-card 등) — 범위 밖.
