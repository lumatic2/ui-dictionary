# BACKLOG

## Completed Horizons

### 2026-07-10 - Agent Design CLI

- CLI1 - 코어 조회 CLI + registry 계약: `@askewly/design`(packages/cli, TS+commander) — terms/tokens/recipes 질의, SSOT 번들, registry 계약 문서, pack fresh-env E2E (`changesets/20260710-cli-core-query/README.md`).
- CLI2 - 프로젝트 주입: init(DESIGN.md·tokens.css·askewly.css @theme 바인딩)·add(레시피 Code 발췌 주입+Checks/Anti-patterns 노트) — 외부 Vite 프로젝트 토큰 렌더 실증(hex 0) (`changesets/20260710-cli-inject/README.md`).
- CLI3 - 검증 + 공개: verify(색 리터럴 lint, exit 계약) + fresh-env 풀 루프(조회→주입→검증) E2E. npm publish는 사용자 보류 — 후속 큐 (`changesets/20260710-cli-verify/README.md`).
- Close: 부분 close(fallback) — 상세·Objective 임팩트·크기 회고: `docs/horizons/2026-07-agent-design-cli.md`. 시퀀스 잔여: H2 앱, H3 Docs (ADR 0004).
- 크기 회고: 3 milestone 모두 1 changeset — "단계적 기능 추가" 아크는 다음부터 milestone 1개로.

### 2026-07-10 - Docs Article Depth & Page Examples

- DA1 - Docs 카테고리 아티클 7종 심화: Layout/Styling/Interaction/Accessibility/Motion & Effects/UI Blocks/Component API를 카탈로그 폴백에서 한국어 서술형 아티클로 심화(tokens SSOT·pattern-taxonomy 파생, 카탈로그는 Related terms로 보존), 게이트 해제·ui.askewly.com 확인 (`changesets/20260710-docs-category-articles/README.md`).
- PE1 - Marketing Page Examples 공개: CF3 "별도 제작 필요" 판정과 달리 기저작 완성 페이지 예제 13종 발견 — 판정 통과 후 termIds 배정으로 4컬렉션 게이트 해제 (`changesets/20260710-page-examples-gate-open/README.md`).
- Close: docs nav 전체 실콘텐츠 + Marketing UI Blocks 축 게이트 0. Objective 임팩트·크기 회고는 `docs/horizons/2026-07-docs-depth-page-examples.md`.
- 크기 회고: 두 milestone 모두 1 changeset — horizon 실질 milestone 1개 크기(인플레 적발). "게이트 해제성" 작업은 다음부터 기존 milestone Gap/maintenance로.
- 후속 큐: DocsArticlePage 다크 모드 heading 대비(text-slate-950 하드코딩, 기존 22종 공통), 게이트 딥링크 설계 재검토(직접 URL은 렌더됨).

### 2026-07-10 - Content Fill

- CF1 - Docs Foundations And Agent Recipes 공개: Foundations 아티클 7종(한국어, tokens SSOT 파생) + Agent Recipes 표면(recipes/ 5종·llms.txt 링크 10/10 검증) 프로덕션 공개, Colors foundation 링크 부활 (`changesets/20260710-docs-shell-gate-open/README.md`).
- CF2 - Showcase Atlas Source-Quality 카드: 홈 Atlas 12칸 완성 — placeholder 카드 4종 인터랙티브 데모 + Dashboard 실마크업, 카드별 품질 판정(라이트/다크·reduced-motion) 통과 (`changesets/20260710-showcase-gate-open/README.md`).
- CF3 - Patterns 빈 컬렉션 배치: inbox 후보 9종 terms.yml 승격(terms 536) + 빈 컬렉션 4개(Blog/Contact/Content/Logo Clouds) 예제 풀 페이지로 공개, visual renderer 9종 (`changesets/20260710-collections-terms-promotion/README.md`).
- Close: 닫는 기준 충족 — 콘텐츠만 있으면 열리는 dev 껍데기 전부 공개(제거 0), Pro/Download는 계획대로 dev 보존. Objective 임팩트는 `docs/horizons/2026-07-content-fill.md` 참조.
- 크기 회고: 각 milestone 2~4 changesets — milestone-grade 유지. `roadmap_sync.py complete`의 인플레 적발이 Evidence 경로 1개만 세는 오탐 있었음(harness 스킬 개선 후보).

### 2026-07-10 - Structure-First Buildout

- SFB1 - Structure Contract And Clean Production: blueprint v2(목표 IA·완성 판정·노출 규칙) 확정 + 프로덕션 노출 게이트 배포 — 빈 컬렉션 42·placeholder 카드 5·Download 진입 4 비노출, 전 라우트 크롤 스모크 0건 (`changesets/20260710-production-exposure-gate/README.md`).
- SFB2 - Shell Buildout (dev-only): blueprint v2 신설 껍데기 전부 dev-only 구현 — Docs Foundations 7+Agent Recipes, Colors 축+Palettes skeleton, Pro 하위 3탭+Download 앱 skeleton, prod 비노출 회귀 PASS (`docs/plans/2026-07-10-sfb2-shell-buildout.md`).
- SFB3 - Content Fill Batch 1: Colors Palettes: Colors 축 프로덕션 공개 — 큐레이션 팔레트 13종 실데이터·복사/내보내기·라이트/다크, 껍데기 누출 2건 차단 (`changesets/20260710-colors-axis-public/README.md`).
- Close: 닫는 기준 충족 — 구조 계약 + 껍데기 골조 + 첫 콘텐츠 채움 실증(SFB3가 Content Fill 프로세스 검증). 상세: `docs/horizons/2026-07-structure-first-buildout.md`.
- 노출 게이트 시스템(`src/lib/exposure.ts`) 확립: shell 플래그/빈 termIds로 dev 작성 → 완성 판정 → 게이트 해제 — 이후 6 milestone에서 검증된 패턴.

### 2026-07-09 - Standalone completions

- PGD1 - Palette Generator Data Engine: 큐레이션 seed 데이터 + 결정적 생성 규칙 + lock 보존 + 품질 게이트, Chrome smoke (`changesets/20260709-palette-generator-data-engine/README.md`).
- PSS2 - Landing Page Design Quality (Public Site Shell 이월): Landing CTA/Auth 라우팅 + production Pages Function smoke + 데스크톱/모바일 라이트/다크 QA (`changesets/20260709-askewly-auth-sso-routing/README.md`).

### 2026-07-07 - Figma Workflow

- FW1 - 리서치 → 방법론 채택: sonnet 위임 2건(다각 딥리서치 + 최근 30일 커뮤니티 펄스, `docs/market/2026-07-07-figma-claude-*.md`) — code↔canvas 양방향이 2026 상반기 최전선이며 "코드가 SSOT" 브리지 축이 유리함을 확인. 하이브리드 왕복(코드→Figma→사람→코드) 사용자 확정, `methodology/figma-workflow.md` 계약 문서화.
- FW2 - 파일럿 실증 + 운영화: 랜딩 hero 왕복 완주 — use_figma로 variables 바인딩 승격("Hero Pilot 2026-07-07" 페이지), 사용자 디테일링(152→128px), 속성 스냅숏 diff 회수 후 코드 반영+브라우저 재검증 (`docs/research/figma-roundtrip-pilot-2026-07.md`). figma-codex-workflow 스킬 갱신 3건+발견 3건 배포(custom-skills `10450ae`).
- Close: 닫는 기준 충족 — 방법론 계약 + 실작업 왕복 실증 1건 + 스킬 소비 좌표 흡수.
- 크기 회고: FW1=1 changeset(step-grade 인플레), FW2=2 changeset. horizon이 하루에 닫힘 — 다음 "리서치→채택→실증→운영화" 아크는 milestone 1개(step 4개)로.
- 후속 큐: CTA pill vs radius-sm 정합(사용자 보류 → PSS2 소재), Figma→코드 역방향 실증(FB 이월 유지), Hero Pilot 페이지 재사용/정리.

### 2026-07-07 - Figma Bridge

- FB1 - 연결 계층 + capability 지도: Figma 접근 6경로 실측 3라운드 — 원격 claude.ai MCP `use_figma`가 완전한 쓰기 채널(variables 생성·바인딩 round-trip 검증), 계정 이원화 발견(커넥터=SKKU student Full seat, REST/chrome=gmail), REST variables는 Enterprise 게이트로 제외 (`docs/research/figma-capability-map-2026-07.md`).
- FB2 - 브리지 모델 계약: Askewly SSOT 우위·파생 variables 모델, 컬렉션 2개(primitive 단일모드 + semantic light/dark) alias 매핑, DTCG 경로 그대로 이름 보존, idempotent upsert 규약, figma-codex-workflow 정합·갱신 지점 3건 (`docs/design-system/figma-bridge-contract.md` + ADR 0003).
- FB3 - 왕복 실증: 토큰 59개를 "Askewly Design Tokens" 파일(`xY42P22E7CtnvuxX8ZzZec`, 어스큐리 팀)에 동기화 — 1차 38+21 created, 2차 재실행 created 0/removed 0(idempotent PASS), light/dark 데모 프레임 바인딩 스크린샷 (`docs/research/figma-variables-sync-2026-07.md` + `scripts/generate-figma-variables-sync.mjs`).
- Close: 닫는 기준 충족 — capability 지도 + 브리지 계약 + 토큰→variables 실증 1건.
- 크기 회고: milestone 3개 전부 1 changeset로 닫힘 — 인플레 기준상 이 horizon도 milestone 1개 규모였다 (AG horizon과 동일 패턴 2연속: "실측→계약→실증" 류는 다음부터 milestone 하나로).
- 후속 큐: figma-codex-workflow 스킬 갱신 3건(계약 §5), Figma→코드 역방향 실증, PAT 재발급 선택지.

### 2026-07-07 - Agent Integration

- AG1 - llms.txt 발견 계층: `scripts/generate-llms-txt.mjs`가 SSOT 10개 자산(토큰·분류·계약·레시피 5종)을 `public/llms/` 사본 + 링크만 담은 `llms.txt`로 파생(C-10, 실패모드 exit≠0 검증). 실배포 10/10 링크 실콘텐츠 확인 (`https://ui.askewly.com/llms.txt`).
- AG2 - custom-skills 소비 계층: design-screen §2 레시피 소비 규칙(로컬 recipes/ 우선, 외부는 llms.txt) + design-harness §4 발견 인덱스 참조 (custom-skills `4b176a8`, 지난 세션 guard `3213342` 위에). setup.sh 재배포 + 소비 smoke PASS.
- AG3 - 외부 프로젝트 실전 실증: sonnet 에이전트가 live llms.txt 진입점만으로(로컬 접근 0) development-dictionary에 VS Code 활용 가이드 페이지 구현(`7aa2685`, 색 리터럴 0, 레시피 3종 계약 준수). Fable 독립 게이트 PASS (`docs/research/ag3-external-proof-2026-07-07.md`).
- Close: 닫는 기준 충족 — 발견(llms.txt)·소비(스킬) 진입점 존재 + 외부 실증 1건 기록.
- 후속 큐: showcase-card 정적 콘텐츠 variant 명시 여부(레시피 확장 pass), generate-tokens.mjs semantic 변수 블록 방출(design-bridge 재사용), MCP 서버 판단(C-11 유지 중).

### 2026-07-07 - System Model Core

- SMC0 - 시장 포맷 조사: DTCG/Radix/shadcn/Geist/Material 3/에이전트 포맷 선례 6종을 sonnet fan-out으로 조사, 비교표 + 채택 기준 11개 확정 (`docs/market/design-system-format-survey.md`).
- SMC1 - 토큰 시스템 SSOT: `tokens/askewly.tokens.json`(DTCG stable 객체 포맷) + 3-tier lint + 생성 파이프라인(DESIGN.md·tokens.css 파생) + 브랜드 hex 90건 치환 + design 스킬 SSOT guard 배포.
- SMC2 - 패턴 분류 체계: `pattern-taxonomy.md` 정본화(용어 4중 혼선 종결, pattern_group 10종), group 축 57종을 코드에서 `groups.yml`+terms.yml 필수 필드로 승격(배정 diff 0).
- SMC3 - 컴포넌트 레시피 첫 배치: `recipe-format.md` 계약 + `validate-recipes.py` + 레시피 5종(4개 pattern_group, 2-depth 참조 체인) + 공용 소비 데모(레시피·토큰만으로 에이전트가 hero 구현, 색 리터럴 0).
- Close: 닫는 기준 충족 — 토큰 SSOT·분류 체계·레시피 배치 존재 + 같은 SSOT에서 사이트 표면과 에이전트 산출물 파생을 데모로 증명 (`docs/research/assets/smc3-recipes-2026-07-07/`).
- 후속 큐: 다크 토글 활성화, category 편중 재설계, 빈 navigation 컬렉션 정리, hero pill 버튼 정합화, 컨테이너 폭·버튼 규격 토큰화, showcase reduced-motion fallback.

### 2026-07-07 - Public Site Shell

- PSS1 - Homepage And Site IA Shell: shipped the real `ui.askewly.com/` public homepage with product identity, search/command affordance, UI previews, and Docs/Patterns/Showcase/Resources/Pro navigation while preserving Plus/Docs work.
- RME1~RME5 - Reference model consolidation: Tailwind reference model, Around template-system capture, local design work audit, mobile platform baseline (HIG/Material), and product-system exemplar map (Vercel/Stripe/Linear/Radix/Around).
- PSS2 - Landing Page Design Quality was paused mid-horizon (showcase Steps 0-3 done, Matter.js physics card committed) and carried over as a pending candidate for a later product-surface horizon.
- Close rationale: the horizon's close criteria (public homepage/site shell exists in code, next vertical slice can start from the new IA) were met by PSS1.
- Evidence: `docs/horizons/2026-07-public-site-shell.md`, `phases/public-site-shell/index.json`, `docs/plans/2026-07-05-showcase-atlas-upgrade.md`, `docs/research/tailwind-reference-model.md` and RME evidence docs.

### 2026-07-04 - Design System Foundation

- DSF1 - Objective and Product Contract: reframed the project as Yusung's digital product design system across web, mobile, SaaS, commerce, dashboards, docs, human website, paid assets, and agent-facing guidance.
- DSF2 - Reference Strategy: defined source tiers, capture protocol, adaptation rules, and research queue for Tailwind, platform systems, product exemplars, and local design-system work.
- DSF3 - Surface Taxonomy: defined cross-surface taxonomy for websites, mobile apps, SaaS/dashboards, commerce, documentation, internal tools, components, axes, IA, and data model implications.
- DSF4 - Agent-Usable Design System Model: defined the four-layer model linking reference evidence, human previews, implementation assets, and agent recipes with access levels, staged build path, and verification requirements.
- Evidence: `docs/OBJECTIVE.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/research/design-system-reference-strategy.md`, `docs/design-system/surface-taxonomy.md`, `docs/design-system/agent-asset-model.md`
