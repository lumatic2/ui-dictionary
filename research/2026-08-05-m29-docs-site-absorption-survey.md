# docs-site 블록 — 셸 흡수 실사 + 구성 확정

> 2026-08-06 작성 · 소비처: `plans/2026-08-05-m29-docs-block-and-alias.md` step-2 · milestone M29
> 목적: 세 번째 블록 `docs-site` 를 **외부 공개 조합에서 흡수할지, 자체 조합할지** 판정하고 구성을 확정한다.
> 판정 기준 정본: `docs/design-system/block-contract.md` §5(흡수·표기)·§2(허용 import 표면), `docs/design-system/absorption-criteria.md`.

## 0. 흡수 후보가 통과해야 하는 제약 (실사 기준)

블록은 **소비자 프로젝트로 파일이 복사되는** 형태로 배포된다(shadcn registry). 따라서:

1. **라이선스**가 재배포를 허용해야 한다(MIT/Apache-2.0 급). 불명확·상업 제한 → **기각**(추정 금지, §5).
2. **프레임워크 결합 금지** — Next.js `app/` 라우팅, `next/link`, MDX 빌드 파이프라인, 파일시스템 콘텐츠 로더에 의존하면 이식 불가.
3. **허용 import 표면**(§2): `react`·`lucide-react`·`@/components/ui/*`·`@/lib/utils`·블록 내 상대경로·등재 code asset(`@/components/<name>`)·선언된 npm 패키지.
4. **색은 semantic CSS 변수로만** — hex 하드코딩 소스는 restyle 비용이 든다(§4).
5. 라우팅 없음. 콘텐츠는 `data.json` 목업.

## 1. 외부 후보 실사

조사 8건. 접근일 **2026-08-06** (전건 공통). 라이선스 열 끝의 표시 — **[재확인]** = parent 가 LICENSE 원문을 직접 열어 대조함 · **[조사]** = 위임 조사 결과만.

| 후보 | 라이선스 | 결합도 | 스타일 | 판정 |
|---|---|---|---|---|
| **Fumadocs** [repo](https://github.com/fuma-nama/fumadocs) · [LICENSE](https://github.com/fuma-nama/fumadocs/blob/dev/LICENSE) | MIT [조사] | `fumadocs-ui` 는 Next.js App Router 전용 설계. v15.2 부터 Vite 계열(TanStack Start·React Router·Waku) 실험 지원이지만 공식 대상은 여전히 **완결된 라우팅 프레임워크**이고, 셸 컴포넌트가 `layout.tsx` 트리·route group 관례를 전제한다 | Tailwind | **기각** — "파일 몇 개 복사"로 못 뗀다. 레이아웃 패턴만 참고 |
| **Nextra** [repo](https://github.com/shuding/nextra) | MIT [조사] — LICENSE 원문 대조 못 함 | Next.js App Router 전용(v4 에서 Pages Router 지원 폐지). **MDX 처리가 Next.js webpack/turbopack 커스텀 로더**에 박혀 있어 셸 UI 만 분리 불가 | Tailwind + 테마 전용 CSS | **기각** — 빌드 파이프라인 정면 결합 |
| **Astro Starlight** [repo](https://github.com/withastro/starlight) · [LICENSE](https://github.com/withastro/starlight/blob/main/LICENSE) | MIT [조사] | Astro 컴포넌트·콘텐츠 컬렉션·파일시스템 라우팅에 완전 결합. **핵심 셸이 `.astro` 파일이고 React 가 아니다** | Astro CSS(Tailwind 선택) | **기각** — 언어 자체가 다름 |
| **Docusaurus** [repo](https://github.com/facebook/docusaurus) · [LICENSE](https://github.com/facebook/docusaurus/blob/main/LICENSE) | MIT [조사] (코드 한정 — `/docs` 문서는 CC) | React 기반이나 자체 SSG: React Router·webpack·MDX 로더가 프레임워크 내장. `docusaurus.config.js` + 플러그인 없이 컴포넌트만 떼기 어려움 | **Infima**(Meta 자체 CSS, Tailwind 아님) | **기각** — 파이프라인 결합 + restyle 비용 |
| **VitePress** [repo](https://github.com/vuejs/vitepress) · [LICENSE](https://github.com/vuejs/vitepress/blob/main/LICENSE) | MIT [조사] | Vue SSG, Vite 파이프라인 + 파일시스템 라우팅 결합 | Vue SFC 스타일 | **기각** — Vue |
| **shadcn/ui `apps/www`** [repo](https://github.com/shadcn-ui/ui) · [LICENSE.md](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md) | **MIT · © 2023 shadcn** [재확인 — parent 가 `raw.githubusercontent.com/shadcn-ui/ui/main/LICENSE.md` 원문 대조, 2026-08-06] | 문서 사이트 자체가 Next.js App Router 앱 — **셸(navbar+사이드바+검색)이 앱 구조에 얽혀 있다.** 반면 `@/components/ui/*` 프리미티브는 애초에 우리가 얹혀 있는 하부 레이어 | Tailwind + shadcn (우리 스택과 일치) | **해당 없음** — 흡수 *대상*이 아니라 이미 깔린 바닥. 셸은 결합 때문에 기각 |
| **Mintlify components** [repo](https://github.com/mintlify/components) | **MIT · © 2022 Mintlify, Inc.** [재확인 — parent 가 `raw.githubusercontent.com/mintlify/components/main/LICENSE` 원문 대조, 2026-08-06] | 결합도 낮음(React 18/19 + Tailwind 컴포넌트). **그러나 navbar·버전 스위처·사이드바·⌘K 셸이 이 레포에 없다** — Accordion·Callout·CodeBlock 등 콘텐츠 위젯만 | Tailwind | **기각(필요 없음)** — 라이선스는 통과하나 셸을 안 담고, 콘텐츠 위젯 자리는 우리 등재 asset(`docs-code-block` 등)이 이미 채운다 |
| **Tailwind Plus (UI Blocks)** [라이선스](https://tailwindcss.com/plus/license) | **상업 라이선스** — 오픈소스 아님, 사이트 빌더 재판매 금지 조항 | 낮음(스니펫 복사형) | Tailwind | **기각** — 우리 재배포 경로(공개 registry)와 정면 충돌. 열람 참고만 |

**child 가 "확인 못 함"으로 남긴 2건은 parent 가 해소했다** — shadcn/ui·Mintlify 둘 다 MIT 확정. 다만 아래 판정에서 **둘 다 흡수하지 않으므로** 이 확인은 판정을 바꾸지 않고 기록으로만 남는다. Nextra 는 원문 대조를 안 했으나 **기각 사유가 라이선스가 아니라 결합도**라 승격에 영향 없다.

## 2. 채택안 — 자체 조합 (흡수 0건)

**흡수할 만한 완결형 후보가 없다.** 정통 docs 프레임워크 5종(Fumadocs·Nextra·Starlight·Docusaurus·VitePress)은 **예외 없이 자체 라우팅 + 자체 빌드 파이프라인을 소유한 정적 사이트 생성기**다 — "React+Tailwind 파일 몇 개를 registry 로 복사"라는 우리 배포 형태와 태생이 다르다. 언어가 다르거나(Vue·Astro), 콘텐츠 로더가 빌드에 박혀 있거나(Next.js 2종), Tailwind 가 아니다(Infima).

라이선스가 통과한 둘(shadcn/ui·Mintlify)은 **셸을 담고 있지 않다** — 전자는 셸이 Next.js 앱과 얽혀 있고, 후자는 콘텐츠 위젯만 있다. 즉 우리가 필요한 **docs 셸 골격은 어느 후보도 이식 가능한 형태로 갖고 있지 않다.**

→ **`block-contract` §3(자체 조합) 경로로 간다.** `marketing-landing`(M27)과 같은 결말이고, 같은 이유다 — 프레임워크 결합·유료 벽. 흡수분이 0 이므로 §5 의 2중 표기(파일 헤더 + §6 행) 대상도 없다.

**단, 흡수 0 은 "참고 0"이 아니다.** Fumadocs·shadcn/ui 문서 사이트의 셸 레이아웃(상단 얇은 navbar + 좌측 그룹 사이드바 + 우측 on-page 목차 3열)은 이 장르의 사실상 표준이고, 그 **구조**는 코드를 가져오지 않고도 따를 수 있다. 아래 구성표가 그 형태다.

## 3. 구성표 — 셸 + 3페이지에 무엇이 앉는가

우리 registry 의 docs 계열 asset **7종**을 실측(파일·export·props 계약 확인 2026-08-06)해 배치했다.

| 자리 | 조합되는 등재 asset | 무엇을 소유하나 | 근거 |
|---|---|---|---|
| **셸 — 좌측 레일** | `versioned-docs-switcher-navbar-sidebar-swap` | 버전 드롭다운 + 사이드바 트리 + stale 배너를 **하나의 상태 계약**으로 소유(버전 변경이 사이드바 데이터 소스를 갈아끼운다) | props: `versions`·`activeVersionId`·`sidebarByVersion`·`onVersionChange` — 완전 controlled, 블록이 상태를 쥐면 그대로 쓰인다 |
| **셸 — 상단 바** | (블록 원본) | 브랜드·검색 트리거(⌘K)·페이지 전환·테마 자리 | 등재 asset 에 docs navbar 가 없다. `saas-app-shell` 의 `site-header.tsx` 와 같은 급의 블록 원본 |
| **검색 오버레이** | `doc-search-cmdk-grouped-results-panel` | ⌘K 다이얼로그 + 그룹 결과 + 최근 질의/추천 | `open`/`onOpenChange` controlled — 셸이 ⌘K 키 바인딩만 붙이면 된다 |
| **페이지 ⓐ 아티클** | `docs-code-block` · `terminal-demo-panel` · `responsive-content-grid` | 본문 prose(블록 원본) + 패키지 매니저 탭 코드블록 + 터미널 데모 + 하단 "관련 문서" 그리드 | `docs-code-block` 은 `variants[]`(npm/pnpm/yarn) + 복사 버튼, `terminal-demo-panel` 은 `scenes[]` 타이핑 재생 |
| **페이지 ⓑ API 레퍼런스** | `api-reference-layout` | method·path·중첩 파라미터 표·언어별 샘플 탭·응답 | props: `method`·`path`·`params`(nested 재귀)·`samples`·`response` |
| **페이지 ⓒ 체인지로그** | `docs-changelog-category-filter-page` | 카테고리 칩 필터 + 날짜 그룹 + 페이지네이션 | controlled(`activeCategoryId`·`page`) — 블록이 상태를 쥔다 |

**7종 전부 배치됐다 — 미사용 0.** (`responsive-content-grid` 는 docs 전용 자산은 아니지만 아티클 하단 "관련 문서" 자리에 그대로 맞는다.)

**블록 원본이 되는 부분**: 상단 navbar · 아티클 본문 prose 와 on-page 목차 · 3페이지 전환 상태 · `data.json` 목업 콘텐츠.

### 필요한 shadcn primitive (전건 사이트에 실존 확인 2026-08-06)

`select` · `tabs` · `badge` · `command` · `pagination` · `button` — 조합 asset 들이 이미 쓰는 것들이고 registry 가 `registryDependencies` 로 자동 해석한다.

## 4. `requiredCssVars` 초안

`marketing-landing` 과 동일한 **표준 shadcn 20종**을 기준선으로 잡는다(`--background --foreground --card --card-foreground --popover --popover-foreground --primary --primary-foreground --secondary --secondary-foreground --muted --muted-foreground --accent --accent-foreground --destructive --destructive-foreground --border --input --ring --radius`).

⚠ **확정은 소스 실측 후** (계획 기술결정 ⑤): 블록 파일에서 실제 참조되는 `var(--…)` 를 전수 grep 해 선언과 대조한다. 선언이 실사용보다 좁으면 킥스타트의 필수 변수 검사가 통과해 버리고 이식처에서 색이 빠진다 — 계약이 조용히 거짓이 되는 유일한 경로다. 사이드바 계열(`--sidebar*`)은 shadcn `sidebar` primitive 를 쓰지 않으면 불필요하므로, 좌측 레일을 `sidebar` primitive 로 감쌀지 여부에 따라 갈린다.

## 5. 기준선 (step-3 의 "기존 자산 무변경" 증명용)

- `node scripts/generate-registry.mjs` → `56 assets -> public/r/`(index 포함 57 파일), 재실행 후 `git status` **비어 있음** = 재생성 멱등 확인(2026-08-06).
- `node scripts/check-llms-sync.mjs` → PASS (watched: 4 paths).
