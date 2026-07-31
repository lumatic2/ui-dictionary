# BACKLOG

## Parked Horizons

### 2026-07-17 - Public Product & Monetization (parked)

- PX - Public Experience Pass: 검색 수리(+포털 클릭 결함 추가 적발)·전 표면 인덱싱, Getting set up 프로토콜, Vocabulary 그룹 통합, 섹션별 독립 사이드바, per-page meta/SEO. Completed 2026-07-12 (`archive/plans/2026-07-12-px-public-experience.md`, changesets #94–98).
- AM/AC/PG/PP 미착수. Park 사유(2026-07-17 사용자 판정): 수익화 전에 에이전트 워크플로우 채택 흐름이 먼저. 복귀 후보는 `docs/horizons/CANDIDATES.md`, 상세는 `docs/horizons/2026-07-public-product-monetization.md`.

## Completed Horizons

### 2026-07-12 - Quality & Dogfooding (H2.5)

- QA2 - AskewlyDesign Install & Dogfooding: 리네임 반영 재패키징+verify:package, 첫 실설치·언인스톨 lifecycle PASS, 설치본 CDP dogfooding에서 major 결함 4건 발견(#1 batch 계약 누락은 Step 6 해소, #2~#4 유지보수 등재), 적체 유지보수 4건 소진(다크모드·focus trap·실체화 undo 파일 삭제·packaged E2E registry/협업 통합) (`archive/plans/2026-07-12-qa2-install-dogfooding.md`, changesets #84–88).
- QA1 - Recipe Gallery & Visual QA: 전용 갤러리 섹션에서 recipe 35종 live render(19종 첫 실노출), 라이트/다크 70장 sweep + contrast 후보 7건 전수 판독(전부 오탐/AA 통과), 오버레이 격리 결함 G1/G2 수정, live-render 유보 계약 갱신 (`archive/plans/2026-07-12-qa1-recipe-gallery-visual-qa.md`, changesets #89–90).
- QA3 - Canvas Recipe Materialization: recipe 실체화가 빌드타임 marker 임베드된 실 standalone 소스 방출, 캔버스 Materialize 액션+데스크톱 IPC source-patch 채널 신설, packaged E2E 왕복 관측(identity 계약·재시작 단일 생존) — E2E가 Windows 스테이징 경로 콜론 결함 적발·봉합 (`archive/plans/2026-07-12-qa3-canvas-recipe-materialization.md`, changesets #91–93).
- Close: close criteria 3항목 충족(전 recipe 열람+design-qa, 설치·실사용+유지보수 소진, 실체화 왕복 E2E). 상세: `docs/horizons/2026-07-quality-dogfooding.md`.
- 크기 회고: milestone 당 changeset 5/2/3 — 인플레 없음.
- 오케스트레이션 회고: sonnet 워커 7기 + Fable 게이트·E2E. 게이트/E2E 적발: 브리지 batch 계약 누락(dev-only 검증 갭), SheetTitle 컨텍스트 크래시, 데모 폭0, Windows 스테이징 경로 — 전부 "유닛 통과 ≠ 실표면 동작"의 실증으로, packaged/브라우저 실구동 게이트가 매 milestone 실결함을 잡음.

### 2026-07-12 - Living Design System (H2)

- RL - Reference Loop Pipeline: 5단계 흡수 루프(수집→dedup→적응→검증→흡수) 표준화 — 절차 문서+inbox+ledger+audit 도구, 실증 3배치(commerce/internal-tools/documentation)로 recipe 6·용어 14·dedup 판정 10 (`archive/plans/2026-07-12-rl-reference-loop-pipeline.md`).
- MS - Mobile Surface Batch: DeviceFrame 표현 인프라 + 모바일 2배치(recipe 4) + 캔버스 모바일 뷰포트 preset(390×844, canonical update-node, 브라우저 E2E) (`archive/plans/2026-07-12-ms-mobile-surface-batch.md`).
- FW - Feed Wiring: 전 recipe 23종 code_asset 독립화(7종은 의사코드 적발→신규 구현), frontmatter→recipeCatalog build-time 생성기(결손=loud fail), Insert 팔레트 Recipes 섹션 + 모바일 뷰포트 삽입 E2E — 루프 산출이 사이트·llms.txt·CLI·캔버스 4곳 자동 도달 (`archive/plans/2026-07-12-fw-feed-wiring.md`).
- SD - Surface Depth 2세대 (구 CS+R2 병합): 4표면 심화 배치(recipe 12, 총 35) + agent-facing anti-patterns.md(12 클러스터, 35/35 커버) + gen-2 토큰 갭 4건 토큰화 (`archive/plans/2026-07-12-sd-surface-depth.md`).
- Close: close criteria 전부 충족 — 루프 9배치 반복 실증(각 배치 프로덕션 검증 체인 완주), 전 표면 카테고리 실콘텐츠(표면당 recipe 3~6), 신규 배치가 재작업 없이 registry/CLI/llms.txt 소비(build:catalog 배선). 상세: `docs/horizons/2026-07-living-design-system.md`.
- 크기 회고: 4 milestone이 각 4~6 changeset으로 전부 milestone-grade — 인플레 없음. CS+R2를 SD 하나로 병합한 판단이 적정(중복 범위 제거).
- 오케스트레이션 회고: sonnet 워커 21기(수집 9·배치 적응 9·구현/도구 3) + Fable 게이트로 4 milestone 단일 세션 완주. 게이트 적발: audit 스크립트 결함 2건, 수집 YAML 결함 4류(name 누락·따옴표 스칼라·빈 필드), FW 추출 불가 7종(의사코드) 재설계.

### 2026-07-12 - Canvas Production Environment (H1)

- UX3 - Agent Collaboration UX: 하이브리드 채널(MCP live context via /events 구독 + agent-canvas CLI, 단일 BridgeClient) + 양 호스트 경로 collaboration feed 계약(/audit 소비) + AgentPanel(actor activity·읽는 feed·canonical Undo·conflict 인라인) + dual-actor conflict-recovery E2E (`archive/plans/2026-07-12-ux3-agent-collaboration-ux.md`).
- UX4 - Product Polish And Validation: 상태/접근성/밀도 sweep + packaged 재증명 — 기존 evidence가 AUC4 셸 산출임을 적발하고 openDevFixture 벤치마크 진입 API로 재생성 (`archive/plans/2026-07-12-ux4-product-polish.md`).
- CR - Component Registry: @askewly/component-registry(shadcn 10+layout 6 큐레이션, registry:// source), 팔레트 v2 4섹션, list_components MCP tool+CLI, 실 bridge round-trip 증명 (`archive/plans/2026-07-12-cr-component-registry.md`).
- RT - Real-project Round-trip: marker-scan ingestion 신설(부재 적발)+데스크톱 배선, 무손실 반영 계약(재파생 일치+바이트 보존+conflict 무변이), registry 실체화(NEW_FILE_HASH 신규 파일 채널, 정체성=marker id), 재열기·병행 편집 연속성 E2E (`archive/plans/2026-07-12-rt-real-project-roundtrip.md`).
- AI - Askewly Identity: 에디터 크롬·캔버스 렌더가 tokens/askewly.tokens.json SSOT 파생(hex lint 고정), tokenBindings 실렌더+다크 전환 실효, H1 close 게이트(5k p95 median 11.60ms) (`archive/plans/2026-07-12-ai-askewly-identity.md`).
- Close: close criteria 충족 — packaged E2E(실프로젝트 open·양 에이전트 편집·watcher 반영·crash/restart·5k 예산·a11y·보안) + renderer/bridge E2E(registry 조립·무손실 왕복·연속성). 상세: `docs/horizons/2026-07-canvas-production-environment.md`. 잔여(비차단): packaged E2E에 registry/협업 시나리오 통합.
- 크기 회고: milestone 5개(승계 2 제외)가 각 3~6 step으로 전부 milestone-grade — 인플레 없음. 측정 프로토콜 교훈: 절대시간 게이트는 High priority+settle+median 통계로 상시 데스크톱 내성 확보(기준 불변).
- 오케스트레이션 회고: sonnet 워커 13기(구현 11·검증 1·리서치 1) + Fable 게이트 체제로 UX2~AI 6 milestone을 단일 세션에 완주. 게이트에서 워커 누락 실결함 2건·시스템 결함 3건 적발.

### 2026-07-12 - Canvas Product UX (superseded into Canvas Production Environment)

- UX1 - Workspace Foundation: 제품형 workspace shell, project entry/recent, toolbar, adaptive panels + packaged 품질 게이트 (`phases/agent-design-workspace-foundation/step5.md`). Completed 2026-07-11.
- UX2 - Visual Creation Workflow: 6 steps — canonical creation command layer(atomic batch), Layers tree projection, searchable Insert palette, align/distribute/tidy/group/ungroup + gap/padding, viewport(zoom anchor·space pan·fit)+단축키+help dialog, 대표 컴포지션 E2E. 게이트: core 52/52·renderer 45/45·desktop 42/42·package/packaged-evidence PASS(IME waiver 유지) (`archive/plans/2026-07-11-ux2-visual-creation-workflow.md`). Completed 2026-07-12.
- Close: 정상 종결이 아니라 **확장 흡수** — 2026-07-12 horizon 스케일 재조정(사용자 판정: 기존 horizon들이 milestone 크기)으로 UX3·UX4를 `docs/horizons/2026-07-canvas-production-environment.md`(+CR/RT/AI)로 승계.
- 크기 회고: UX2는 6 step/12 commits로 milestone-grade 적정. horizon 단위 인플레는 시퀀스 레벨에서 교정(3개 대형 horizon 큐 확립).

### 2026-07-10 - System Content Depth

- SCD1 - Principles 증류: 근거 경로가 붙은 원칙 8개를 `principles.md` 정본으로 확정하고 llms.txt + 한국어 Docs 아티클에 공개, 사용자 승인·Chrome/Cloudflare 검증 완료 (`changesets/20260710-principles-gate-open/README.md`).
- SCD2 - 레시피 커버리지: 실구현 code asset 기반 레시피 8종을 추가해 5→13종, pattern_group 10/10 커버. validator·llms 19자산·CLI 21/21·fresh `add` 2종·배포 확인 (`changesets/20260710-recipes-integration/README.md`).
- Close: Principles 사람/에이전트 이중 공개 + 전 pattern_group 레시피 + CLI 신규 레시피 실주입으로 horizon close criteria 전부 충족. 상세: `docs/horizons/2026-07-system-content-depth.md`.
- 크기 회고: SCD1 4 changesets, SCD2 5 changesets로 모두 milestone-grade. helper의 Evidence 단일 경로 기반 인플레 경고는 오탐.
- 다음 시퀀스 후보: 콘텐츠 위 앱(H2) — 새 제품 정체성·OS-level capability 결정은 다음 horizon 기획에서 사용자 승인 필요.

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
- SFB2 - Shell Buildout (dev-only): blueprint v2 신설 껍데기 전부 dev-only 구현 — Docs Foundations 7+Agent Recipes, Colors 축+Palettes skeleton, Pro 하위 3탭+Download 앱 skeleton, prod 비노출 회귀 PASS (`archive/plans/2026-07-10-sfb2-shell-buildout.md`).
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
- Evidence: `docs/horizons/2026-07-public-site-shell.md`, `phases/public-site-shell/index.json`, `archive/plans/2026-07-05-showcase-atlas-upgrade.md`, `docs/research/tailwind-reference-model.md` and RME evidence docs.

### 2026-07-04 - Design System Foundation

- DSF1 - Objective and Product Contract: reframed the project as Yusung's digital product design system across web, mobile, SaaS, commerce, dashboards, docs, human website, paid assets, and agent-facing guidance.
- DSF2 - Reference Strategy: defined source tiers, capture protocol, adaptation rules, and research queue for Tailwind, platform systems, product exemplars, and local design-system work.
- DSF3 - Surface Taxonomy: defined cross-surface taxonomy for websites, mobile apps, SaaS/dashboards, commerce, documentation, internal tools, components, axes, IA, and data model implications.
- DSF4 - Agent-Usable Design System Model: defined the four-layer model linking reference evidence, human previews, implementation assets, and agent recipes with access levels, staged build path, and verification requirements.
- Evidence: `docs/OBJECTIVE.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/research/design-system-reference-strategy.md`, `docs/design-system/surface-taxonomy.md`, `docs/design-system/agent-asset-model.md`

### 2026-07
- AD1 - AD1 — Default Routing 배선
  - Completed: 2026-07-17
  - Result: 진입 프로토콜 llms.txt 노출 + Claude(규칙+hook)·Codex(AGENTS.md) 라우팅 배선 — 양 에이전트 E2E 토큰 파생 PASS(14/14·16/16, 발명 0), silent 404·URL 구성 결함 적발·봉합 — changesets #99–101
  - Evidence: archive/plans/2026-07-17-ad1-default-routing.md

### 2026-07
- AD2 - AD2 — Style Signature
  - Completed: 2026-07-17
  - Result: 인터뷰 확정 시그니처(운용 원칙 5 + 비선호 5, 점수제 폐기) — entry-protocol 판정 단계 편입·llms.txt 배포, 실판정 1회 구동(발명 팔레트 FAIL 변별) — changesets #102–103
  - Evidence: archive/plans/2026-07-17-ad2-style-signature.md

- AD3 - AD3 — Real-work Dogfooding
  - Completed: 2026-07-17
  - Result: 실작업 dogfooding — DF-1·DF-2(bootcamp 2표면) 라우팅 관측+시그니처 PASS, DF-3 실사용 관측(동질화 적발→교정). DF-4 기회주의 건은 사용자 면제 2026-07-17(갭은 AD4에서 해소 완료) — changesets #104–107
  - Evidence: docs/research/dogfooding/ledger.md

- AD4 - AD4 — Gap-driven 확장
  - Completed: 2026-07-17
  - Result: 갭 4건 해소 — chat recipe(live gallery)+한글 break-keep 클러스터+판정-중심 프로토콜 재정렬(hook 불사용 확정), 배포 검증 — changesets #110–111
  - Evidence: archive/plans/2026-07-17-ad4-gap-driven-expansion.md

### 2026-07
- VI1 - VI1 — 표현 스택 지도
  - Completed: 2026-07-17
  - Result: 4티어 계보 리서치(30기법, 전 항목 출처) + 쇼케이스 12종 실코드 역산 + 기법→티어 결정 표 21행 knowledge 정본 llms 배포 — changesets #112–113
  - Evidence: archive/plans/2026-07-17-vi1-expressive-stack-map.md

- VI2 - VI2 — CSS·SVG 티어 recipes
  - Completed: 2026-07-17
  - Result: 선언 티어 recipe 4종(mesh gradient·glass panel·grain overlay·scroll-driven reveal) — 전부 의존성 0·토큰 파생, live 데모 브라우저 검증 + 배포 curl PASS — changesets #114–115
  - Evidence: archive/plans/2026-07-17-vi2-css-svg-recipes.md

- VI3 - VI3 — 모션 오케스트레이션 티어 recipes
  - Completed: 2026-07-17
  - Result: Motion 도입(+43KB gzip 실측) + ② 티어 recipe 3종(magnetic=수동 opt-in·spring drag=중단가능성·stagger=실무 기본) 인터랙션 실검증 — changesets #116–117
  - Evidence: archive/plans/2026-07-17-vi3-motion-recipes.md

- VI4 - VI4 — Canvas·WebGL·three.js 티어
  - Completed: 2026-07-17
  - Result: three.js/R3F lazy 도입(별도 청크 881KB·메인 +2.4KB gzip) + ③ 파티클·④ 3D 씬 recipe — lazy 실증·WebGL 폴백·reduced-motion 게이팅, 배포 검증 — changesets #118–119
  - Evidence: archive/plans/2026-07-17-vi4-canvas-webgl-tier.md

- VI5 - VI5 — 부품 층 계약 + 레퍼런스 흡수
  - Completed: 2026-07-17
  - Result: shadcn 재스타일 계약(동작 불가침·look=프로젝트 토큰) + 흡수 3분기 기준(실측 9종 분류) llms 배포 + toolshelf used 5건 — changesets #120–121
  - Evidence: archive/plans/2026-07-17-vi5-component-layer-absorption.md

### 2026-07
- TC1 - TC1 — 흡수 계약 개정
  - Completed: 2026-07-17
  - Result: taste 흡수 계약(갱신 없는 관찰=미소화·7필드·성립성 게이트 4문항) + ledger + RL 상호 배선 — changesets #122–123
  - Evidence: archive/plans/2026-07-17-tc1-taste-loop-contract.md

- TC2 - TC2 — 제품 배치: 사용자 큐레이션 5종
  - Completed: 2026-07-17
  - Result: 큐레이션 5종 관찰 12건(흡수 9·미소화 2·시그니처 제안 1) — anti-patterns 클러스터 14·15 신설+13 보강, recipe 5파일 갱신, 배포 검증 — changesets #124–126
  - Evidence: archive/plans/2026-07-17-tc2-curation-batch.md

- TC3 - TC3 — 표현 배치: Dribbble 조건부
  - Completed: 2026-07-17
  - Result: Dribbble 게이트 배치 — CRM 콘셉트 FAIL(3/4)→클러스터 16(콘셉트 대시보드 관성), 단일 액센트 차트 PASS→stat-grid 보강, 배포 검증 — changesets #128–129
  - Evidence: archive/plans/2026-07-17-tc3-dribbble-batch.md

- TC4 - TC4 — 성문 판단 diff: HIG·Material·Polaris
  - Completed: 2026-07-17
  - Result: 성문 판단 diff — 채택 3(서체 증식 금지·모션 규모 비례·verb-first)·기각 2(M3 색 역할=스타일 고정 금지 충돌, HIG 재질=중복), 배포 검증 — changesets #130–131
  - Evidence: archive/plans/2026-07-17-tc4-canonical-diff.md

### 2026-07
- ST1 - ST1 — 스튜디오 정비 (칩·크기·순서·해상도)
  - Completed: 2026-07-19
  - Result: 구현·실측 검증·배포 완료
  - Evidence: changeset + evidence/cascade-studio/

- ST2 - ST2 — 캐스케이드 + 스티키 라이브 미리보기
  - Completed: 2026-07-19
  - Result: 구현·실측 검증·배포 완료
  - Evidence: changeset + evidence/cascade-studio/

- ST3 - ST3 — 영상 파이프라인 (Pexels Videos)
  - Completed: 2026-07-19
  - Result: 구현·실측 검증·배포 완료
  - Evidence: changeset + evidence/cascade-studio/

- ST4 - ST4 — 카피·인터랙션 축 + 통합 실연
  - Completed: 2026-07-19
  - Result: 카피·인터랙션 축 + 통합 실연(영상 히어로) + 피드백-교정-재실연 루프 관측
  - Evidence: changesets/20260719-copy-axes/README.md, evidence/cascade-studio/baseball-selections.json, research/2026-07-19-st4-composition-patterns.md

- SP1 - SP1 — 브리프 v2 계약 (결정 공간 지도)
  - Completed: 2026-07-19
  - Result: 브리프 v2 배포 — 전략층 6·시각 축 14·스타일 타일 2단 구조 (리서치 2건 근거)
  - Evidence: changesets/20260719-brief-v2/README.md, research/2026-07-19-studio-depth-brief-practice.md, research/2026-07-19-studio-depth-tool-practice.md

### 2026-07
- SP2 - SP2 — 스튜디오 v2 (2단 구조 + 축 14종)
  - Completed: 2026-07-19
  - Result: 스튜디오 v2 실구동 — 타일 재정렬·강제필터 금지·수집 v2 검증
  - Evidence: changesets/20260719-studio-v2/README.md, evidence/studio-depth/v2-selections-test.json

- SP3 - SP3 — 이미지 파이프라인 (Pexels + 생성 옵션)
  - Completed: 2026-07-19
  - Result: Pexels ko-KR 실호출 6장 + 이미지 축 계약 배포, 키 User 전역 등록
  - Evidence: changesets/20260719-image-pipeline/README.md, templates/fetch-stock.py

### 2026-07
- SF1 - SF1 — 데이터 주도 스튜디오 주입 (자동화)
  - Completed: 2026-07-19
  - Result: 데이터 JSON + make-studio.py 1커맨드 주입 실증 — 실패 경로 포함
  - Evidence: evidence/studio-finish/sf1-injection-e2e.md

### 2026-07
- SF2 - SF2 — 구성 패턴 완편 (4유형 + 예약형)
  - Completed: 2026-07-19
  - Result: 구성 12유형+예약형 편입, 조건 노출 경계 실측
  - Evidence: evidence/studio-finish/sf2-composition-e2e.md, changesets/20260719-composition-types/README.md, changesets/20260719-booking-patterns/README.md

- SF3 - SF3 — 미리보기 고도화 (다크·반응형)
  - Completed: 2026-07-19
  - Result: 다크·모바일 토글 + 12조합 매트릭스 + 통합 루프 실측
  - Evidence: evidence/studio-finish/sf3-preview-e2e.md, changesets/20260719-preview-dark/README.md, changesets/20260719-preview-responsive/README.md

- SP4 - SP4 — 통합 E2E 실연
  - Completed: 2026-07-19
  - Result: 통합 실연 관측 — 14축 실선택·자유 조합·실사 적용, 갭 3건 기록
  - Evidence: changesets/20260719-integrated-e2e/README.md, evidence/studio-depth/dance-selections.json, evidence/studio-depth/dance-DESIGN.md

- VB1 - VB1 — Stitch 양식 리서치·정합
  - Completed: 2026-07-19
  - Result: 공식 스펙 확인(google-labs-code/design.md alpha) — flat 스키마·8섹션 채택, 3-tier는 확장 관례로 교정, 배포 반영
  - Evidence: changesets/20260719-stitch-alignment/README.md, research/2026-07-19-vb1-stitch-design-md.md

- VB2 - VB2 — 브리프 스튜디오
  - Completed: 2026-07-19
  - Result: 브리프 스튜디오 실구동+폴백+대화형 실연(실물 선택 3종→DESIGN.md→구현) 전부 관측
  - Evidence: changesets/20260719-brief-studio/README.md, evidence/visual-brief/cafe-brief-selections.json, evidence/visual-brief/cafe-DESIGN.md

- VB3 - VB3 — 크롬 상시 표시 게이트
  - Completed: 2026-07-19
  - Result: 사람 게이트 판정 표면 = 실물 브라우저(열기+서버 유지) 배포, E2E·실패경로 관측
  - Evidence: changesets/20260719-chrome-gate/README.md, evidence/visual-brief/vb3-live-gate-e2e.log

- VB4 - VB4 — 딥 브리프 선택 모드
  - Completed: 2026-07-19
  - Result: 딥 브리프 선택 모드 배포 — 발동 2경로 명문, 기본 게이트 불변
  - Evidence: changesets/20260719-deep-brief/README.md, docs/design-system/design-brief.md

- DB1 - DB1 — 브리프 계약 정본 + 프로토콜 배선
  - Completed: 2026-07-19
  - Result: 브리프 계약 4절 정본 + 프로토콜 0.5단계 배선, llms 59자산 배포
  - Evidence: changesets/20260718-design-brief-contract/README.md, docs/design-system/design-brief.md

### 2026-07
- TPS5 - TPS5 — 생성 소재 경계·통합 실연
  - Completed: 2026-07-19
  - Result: 오프라인 GPT Image 2 소재 경계 + 세 형식 전체 제작 루프
  - Evidence: evidence/template-production-system/tps5-e2e.md, evidence/template-production-system/e2e-manifest.json

### 2026-07
- TPS4 - TPS4 — 명함·제품 포스터·인포그래픽 팩
  - Completed: 2026-07-20
  - Result: 세 형식 6청사진 + 안전영역·CTA·연락처·데이터 무결성
  - Evidence: evidence/template-production-system/tps4-packs.md

- TPS3 - TPS3 — 브라우저 템플릿 스튜디오
  - Completed: 2026-07-20
  - Result: CanvasDocument 브라우저 렌더·텍스트 편집·JSON/HTML/SVG 왕복
  - Evidence: evidence/template-production-system/tps3-studio.md, changesets/20260719-template-studio-renderer/README.md, changesets/20260719-template-studio-edit-export/README.md

- TPS2 - TPS2 — 구성 청사진·결정론적 조립기
  - Completed: 2026-07-20
  - Result: 세 형식 청사진 선택 + 결정론적 CanvasDocument 컴파일·서명
  - Evidence: evidence/template-production-system/tps2-compiler.md, changesets/20260719-blueprint-selection/README.md, changesets/20260719-deterministic-template-compiler/README.md

- TPS1 - TPS1 — 템플릿 계약·장면 기반
  - Completed: 2026-07-20
  - Result: 구조화 템플릿 경계 + CanvasDocument image/shape + template-core 검증 기반
  - Evidence: evidence/template-production-system/tps1-contract.md, changesets/20260719-template-contract/README.md, changesets/20260719-template-core-scaffold/README.md

- RC1 - RC1 — 코드 자산 registry 파이프라인
  - Completed: 2026-07-20
  - Result: 27자산 registry 빌드+순수성 게이트+깨끗한 프로젝트 이식 실구동
  - Evidence: evidence/recipe-code-reuse/rc1-transplant.md, changesets/20260719-registry-pipeline/README.md, changesets/20260719-registry-llms/README.md

- RC2 - RC2 — 코드 출발 계약 + 에이전트 E2E
  - Completed: 2026-07-20
  - Result: 코드 출발 계약 배포 + headless 이식·프로젝트 토큰 재결합·브라우저 실증
  - Evidence: evidence/recipe-code-reuse/rc2-agent-e2e.md, changesets/20260719-code-first-contract/README.md, changesets/20260719-code-first-e2e/README.md

- RC3 - RC3 — 스튜디오 구성 ↔ 레시피 매핑
  - Completed: 2026-07-20
  - Result: 구성 13항 recipes 매핑+payload 노출+계약 배선 (피어 실측·독립 리뷰)
  - Evidence: evidence/recipe-code-reuse/rc3-composition-map.md, changesets/20260719-composition-recipe-map/README.md, changesets/20260719-composition-recipe-contract/README.md

- RC4 - RC4 — 통합 실연 (스튜디오→코드 조합→리스타일)
  - Completed: 2026-07-20
  - Result: 사용자 실선택 전 루프 + 사람 게이트 승인 — Close Criteria 5/5
  - Evidence: evidence/recipe-code-reuse/rc4-demo.md, changesets/20260719-rc4-demo/README.md

- DB2 - DB2 — skill 개정 + E2E
  - Completed: 2026-07-20
  - Result: skill 브리프 배선 + E2E 3경로(생략·발동·파생) 전부 관측 — 대화형 실연 포함
  - Evidence: changesets/20260718-brief-skill-e2e/README.md, evidence/design-brief/flower-DESIGN.md

- SE1 - SE1 — skill 신설 + 프로토콜 사람 게이트 개정
  - Completed: 2026-07-18
  - Result: entry-protocol 사람 게이트 배포 + askewly-design skill Claude·Codex 배포
  - Evidence: changesets/20260718-entry-protocol-human-gate/README.md, changesets/20260718-askewly-design-skill/README.md

- SE2 - SE2 — 전역 규칙 제거 + E2E 검증
  - Completed: 2026-07-18
  - Result: 전역 절 제거(grep 0) + 양 에이전트 E2E skill 발화·스크린샷 관측 (1차 FAIL→교정→PASS)
  - Evidence: changesets/20260718-global-routing-removal/README.md, changesets/20260718-skill-entry-e2e/README.md

## template-production-hardening (closed 2026-07-20 — 기준 7 미달 명시)

horizon 문서: `archive/horizons/2026-07-template-production-hardening.md` (닫는 기준 9항 대조·크기/분량/프리모템 회고 수록)
plan doc: `archive/plans/2026-07-20-th*.md` · 증거: `evidence/template-production-hardening/`

- TH1 — 코드 가독성 복구 + 회귀 방어망: 300자 초과 0, 복구 전후 서명 동일 (th1-legibility.md)
- TH2 — 청사진 6종 실재화: 좌표 변형 clone이 통과 불가한 기계 검증 (th2-blueprints.md)
- TH3 — AskewlyDesign 템플릿 편집 배선: 편집 표면을 단일화, template-studio 은퇴 (th3-studio.md)
- TH7 — 캔버스 렌더 충실도: 토큰 색·글꼴·이미지가 실제로 그려진다 (th7-render-fidelity.md)
- TH9 — 텍스트 맞춤: 글자 크기가 폭·줄 수를 본다. 넘침 2→0 (th9-text-fitting.md)
- TH4 — 검증 실체화: exporter 실행 + negative probe 5종 exit≠0 (th4-verification.md)
- TH5 — Codex imagegen 소재 공급자: 라이브 실호출 실증, 깨진 OpenAI 어댑터 제거 (th5-imagegen.md)
- TH10 — 편집기 결함 마감: 작업하다 잃는 결함 4종 차단 (th10-editor-defects.md)
- TH11 — 인쇄 규격 mm 기반 재정의: 규격 선언 계약·A계열·도련·재단 표시 (th11-print-spec.md)
- TH12 — 자기완결 산출물: 소재가 문서에 실린다(data URI) (th12-self-contained.md)
- TH6 — 실사용 실연 + close audit: 명함 1건 전 루프 통과, 결함 3건 계수 (th6-commission.md)

**미달로 닫힌 항목**: 닫는 기준 7(실사용) 중 편집기 축 — 사람이 화면을 읽지 못해 판단 불가.
이 미달이 `archive/horizons/2026-07-editor-legibility.md`의 개설 근거다.

## editor-legibility (closed 2026-07-21 — 닫는 기준 6항 중 5 PASS·1 미달)

horizon 문서: `archive/horizons/2026-07-editor-legibility.md` (닫는 기준 6항 대조·크기/프리모템 회고 수록)
plan doc: `archive/plans/2026-07-21-eu*.md` · 증거: `evidence/editor-legibility/`

- EU1 — 조작 종류가 구분되는 선택: 핸들 8개가 전부 같은 사각형이던 것을 모서리/변으로 가르고, 없던 회전을 문서 모델부터 신설 (eu1-selection.md)
- EU2 — 스냅·정렬 가이드·거리 측정: 가이드가 좌표를 보정하지 않던 결함 수정, Alt+호버 거리 측정 신설, 양방향 분리 게이트 (eu2-snap-measure.md)
- EU3 — 레이어 패널 판독성: 아이콘 폴백이 3종을 삼키던 것 마감, 계층 보존 검색 1000행→13행 (eu3-layers.md)
- EU4 — 인스펙터 정보구조: 위치·크기·각도가 통째로 없던 것을 신설, Figma·Penpot 공통 순서 적용 (eu4-inspector.md)
- EU5 — 판단 가능성 게이트: 사용자 관측 3건 중 2 성공·**색 토큰 변경 실패** (eu5-judgeability.md)

**미달로 닫힌 항목**: 닫는 기준 6(판단 가능성) — 화면에 "색" 단어 0건·견본 0개, 유일 경로가 자유 텍스트 입력.
이 미달이 `plans/horizons/2026-07-editor-color-and-token-editing.md`의 개설 근거다.
**이 결함은 probe 11건과 브라우저 계측이 전부 못 잡았고 사람이 한 번 만져서 나왔다** — 과업 관측 게이트를 유지할 근거.

## editor-legibility (EU1–EU5) — closed 2026-07-21

- EU1 — 조작 종류가 구분되는 선택: 핸들을 모서리/변으로 가르고 회전을 문서 모델부터 신설 (cs 192–194)
- EU2 — 스냅·정렬 가이드·거리 측정: 가이드가 좌표를 보정하게 고침, Alt+호버 거리 측정 신설 (cs 195–197)
- EU3 — 레이어 패널 판독성: 아이콘 망라·계층 보존 검색, 브라우저 1000행→13행 (cs 198–200)
- EU4 — 인스펙터 정보구조: 없던 기하 필드 신설 + Figma·Penpot 공통 섹션 순서 (cs 201–203)
- EU5 — 판단 가능성 게이트: 사용자 관측 3건 중 색 토큰 변경 **실패** (cs 204–205)

**미달로 닫힌 항목**: 닫는 기준 6(판단 가능성) — 화면에 "색" 단어 0건·견본 0개.
후보 `editor-color-and-token-editing`으로 `plans/horizons/CANDIDATES.md`에 적재됨.

### 2026-07
- ECT1 - ECT1 — 토큰이 조회되고, 실재가 검증된다
  - Completed: 2026-07-21
  - Result: 화면이 물어볼 수 있는 토큰 목록 API가 있고(두 어휘 격리 보장) + 편집기·템플릿 어휘가 같은 메타데이터 모양을 가지며 + 실재하지 않는 토큰은 저장되지 않는다.
  - Evidence: evidence/editor-color-and-token-editing/ect1-lookup.md — changesets 206/207/208/209 · 보고서 docs/reports/2026-07-21-ect1-token-lookup-and-validation.md

- ECT2 - ECT2 — 색이 색으로 보인다
  - Completed: 2026-07-21
  - Result: 이미 색 토큰이 묶인 노드에서 사람이 해석된 색 견본을 보고 목록에서 골라 색을 바꾼다 + 어휘 격리가 양방향으로 지켜지고 + 키보드로 완주된다.
  - Evidence: evidence/editor-color-and-token-editing/ect2-swatch.md

- ECT3 - ECT3 — 묶고 푼다
  - Completed: 2026-07-21
  - Result: 색이 안 묶인 노드에 색을 묶고 + 묶인 색을 풀어 원시 색으로 벗어나며 + 그 상태가 화면에 보이고 undo로 전 구간이 되돌아온다.
  - Evidence: evidence/editor-color-and-token-editing/ect3-bind-detach.md

- ECT4 - ECT4 — 이미지 노드가 실제로 칠해진다
  - Completed: 2026-07-21
  - Result: 이미지 노드에 묶은 색 토큰이 실제로 칠해지고(브라우저 계산값 대조) + 바인딩 없는 노드는 시각 회귀가 없으며 + 허용 바인딩 키의 정본이 하나다.
  - Evidence: evidence/editor-color-and-token-editing/ect4-image-render.md

### 2026-07
- ECT5 - ECT5 — 판단 가능성 재관측
  - Completed: 2026-07-22
  - Result: 사람이 사전 설명 없이 화면만 보고 과업 3건(색 토큰 변경·미바인딩 노드에 색 묶기·원시 색으로 벗어나기)을 수행한다. 과업별 성공/실패와 막힌 지점을 기록한다.
  - Evidence: evidence/editor-color-and-token-editing/ect5-judgeability.md

- VL1 - VL1 — 흐름 실사 + 기준선
  - Completed: 2026-07-22
  - Result: 배포본 실사·계수기·기준선 84.4% (changesets 222/223/224)
  - Evidence: evidence/vocabulary-in-use/vl1-flow-audit.md

- VL2 - VL2 — 어휘 배포
  - Completed: 2026-07-22
  - Result: 562개 배포·조회 2 fetch·끊긴 참조 91→0 (changesets 225/226/227)
  - Evidence: changesets/20260721-vocabulary-shard-generator, changesets/20260721-vocabulary-lookup-contract, changesets/20260721-llms-vocabulary-section

- VL3 - VL3 — 참조 복구 + 역방향 매핑
  - Completed: 2026-07-22
  - Result: 3자 매핑·무결성 게이트·폴백 규약 (changesets 228/229/230)
  - Evidence: changesets/20260721-term-asset-map, changesets/20260721-reference-integrity, changesets/20260721-no-asset-fallback

- VL4 - VL4 — 판별 데이터 계약
  - Completed: 2026-07-22
  - Result: 계약·검증기·첫 군집 (changesets 231/232/233)
  - Evidence: changesets/20260721-decision-format-contract, changesets/20260721-decision-validator, changesets/20260721-disclosure-family-decision

- VL5 - VL5 — 군집 채우기
  - Completed: 2026-07-22
  - Result: 6군집·축 26·규칙 32, 오판 3/3 정답 도달 (changesets 234/235/236)
  - Evidence: changesets/20260721-decision-miss-batch, changesets/20260721-decision-unverified-batch, changesets/20260721-decision-corpus-integrity

- VL6 - VL6 — 프로토콜 재배선
  - Completed: 2026-07-22
  - Result: 3단계 배선·우회 0·등재 (changesets 237-240)
  - Evidence: changesets/20260721-protocol-vocabulary-lookup, changesets/20260721-protocol-element-decision, changesets/20260721-protocol-asset-branch-and-record, changesets/20260721-protocol-publication

---

## design-output-gates (DOG1~DOG7) — closed 2026-07-22

> DOG1~DOG6 완료, DOG7 보류(사람 관측 판정 미획득). horizon 문서 `plans/horizons/2026-07-design-output-gates.md`.

<!-- harness:milestone id="DOG1" status="completed" priority="P0" evidence="evidence/design-output-gates/dog1-linter-precision.md" -->
### DOG1 — 검사기가 맞는 것만 잡는다
- DoD: 색 검사기가 SVG 내부와 주석 안의 색 리터럴을 위반으로 보고하지 않고, 한 줄에 여러 위반이 있으면 전부 보고한다.
- Evidence: evidence/design-output-gates/dog1-linter-precision.md
- Gap: 실행 실사에서 오탐 2종(SVG·주석)과 누락 1종(줄 단위 첫 매치만)이 나왔다 — 브리프는 검사기가 없다고 했으나 실은 있고, 정확도가 문제였다
- Scale: changesets>=3; surfaces: 규칙 엔진·예외 처리·회귀 fixture; capability: 무시당하지 않는 검사기
- Plan: archive/plans/2026-07-22-dog1-linter-precision.md
- Status: [x]

- Completed at: 2026-07-22
- Summary: 오탐 4→0·누락 1→0, 테스트 21→32 (changesets 247/248/249)
<!-- harness:milestone id="DOG2" status="completed" priority="P0" evidence="evidence/design-output-gates/dog2-publication.md" -->
### DOG2 — 남의 프로젝트에서 돈다
- DoD: `npx @askewly/design@<ver> verify <dir>` 가 이 레포 밖 임시 디렉터리에서 동작한다.
- Evidence: evidence/design-output-gates/dog2-publication.md
- Gap: `npm view @askewly/design` → E404. 패키지는 bin·files까지 준비됐는데 레지스트리에 없다
- Scale: changesets>=3; surfaces: 패키지 메타·배포·재배포 절차; capability: 남의 프로젝트에서 불리는 검사기
- Plan: archive/plans/2026-07-22-dog2-cli-publication.md
- Status: [x]

- Completed at: 2026-07-22
- Summary: @askewly/design@0.1.0 공개 배포·레포 밖 npx 실증·배포 절차 정본 (changesets 250/251/252)
<!-- harness:milestone id="DOG3" status="completed" priority="P1" evidence="evidence/design-output-gates/dog3-typography.md" -->
### DOG3 — 타이포 단계를 센다
- DoD: 한 화면에서 쓰인 font-size 고유값 개수를 세고 임계(5) 초과 시 보고한다.
- Evidence: evidence/design-output-gates/dog3-typography.md
- Gap: 타이포 검사기가 없다. Kraft의 4를 그대로 쓰면 우리 5단계 스케일이 자기 위반이 된다
- Scale: changesets>=3; surfaces: 정규화 규칙·CLI 표면·자기 자산 실측; capability: 잴 수 있는 타이포 규율
- Plan: archive/plans/2026-07-22-dog3-typography-scale.md
- Status: [x]

- Completed at: 2026-07-22
- Summary: 타이포 검사기·임계값 5 실측 확정·0.2.0 릴리스 (changesets 254/255/256)
<!-- harness:milestone id="DOG4" status="completed" priority="P1" -->
### DOG4 — 인쇄 근거가 에이전트 경로에 실린다
- DoD: 인쇄 규격이 docs/design-system/ 문서로 존재하고 llms.txt 경로에서 fetch되며, 매체별 게이트 차이가 분류 축으로 명시된다.
- Evidence: evidence/design-output-gates/dog4-print-publication.md
- Gap: print-spec.ts는 실재하는데 에이전트 정본 밖에 있다 — VL2와 동형 구조
- Scale: changesets>=3; surfaces: 문서 생성기·매체 분류·배포 등재; capability: 에이전트가 읽는 인쇄 규격
- Plan: archive/plans/2026-07-22-dog4-print-evidence-publication.md
- Status: [x]

- Completed at: 2026-07-22
<!-- harness:milestone id="DOG5" status="completed" priority="P1" -->
### DOG5 — 슬라이드 매체 신설
- DoD: 슬라이드 규격 계약이 존재하고, 기계 검증 가능 항목만 게이트가 되며, 각 항목의 근거 등급이 명시된다.
- Evidence: evidence/design-output-gates/dog5-slide-medium.md
- Gap: 슬라이드 자산 0건. 그런데 통용 규칙 대부분이 1차 출처 없는 통설이다
- Scale: changesets>=3; surfaces: 규격 계약·통설 옵트인 처리·배포 등재; capability: 정직한 슬라이드 게이트
- Plan: archive/plans/2026-07-22-dog5-slide-medium.md
- Status: [x]

- Completed at: 2026-07-22
<!-- harness:milestone id="DOG6" status="completed" priority="P0" -->
### DOG6 — 마무리 절차가 셋을 다 부른다
- DoD: 마무리 절차가 매체에 따라 다른 게이트를 지시하고, 검사기를 호출해 위반을 에이전트가 받아 고친 뒤 다시 잰다.
- Evidence: evidence/design-output-gates/dog6-wiring.md
- Gap: SKILL.md 마무리 절차에 verify 호출이 없다 — 검사기가 있어도 안 불린다(VL8과 같은 병리)
- Scale: changesets>=3; surfaces: entry-protocol·스킬 배선·자가 수정 루프; capability: 실제로 불리는 게이트
- Plan: archive/plans/2026-07-22-dog6-finish-procedure-wiring.md
- Status: [x]

- Completed at: 2026-07-22
<!-- harness:milestone id="DOG7" status="blocked" priority="P1" evidence="evidence/design-output-gates/dog7-observation.md" -->
### DOG7 — 사람 관측 게이트
- DoD: 사용자가 실제 디자인 작업 1건에서 새 마무리 절차를 겪고, 오탐이 성가신지와 차단 승격 가부를 발화로 답한다.
- Evidence: evidence/design-output-gates/dog7-observation.md
- Gap: 직전 2 horizon이 연속으로 사람 관측 게이트에서 미달·부분으로 닫혔다
- Scale: changesets>=2; surfaces: 관측·발견 결함 마감; capability: 사람이 무시하지 않는 게이트
- Plan: (미작성 — 관측 1회 실시로 대체, 판정 미획득)
- Status: [ ] **보류(2026-07-22)** — 관측 1회 실시했으나 verify 위반 0건이라 오탐률을 못 쟀고, 승격 질문이 사용자에게 전달되지 않아 판정 2건 다 미획득. 게이트는 **경고 유지**. 부활 조건: verify가 실제 위반을 뱉는 작업 1~2건 누적 + 승격 질문 재설계. 근거 `evidence/design-output-gates/dog7-observation.md`

## vocabulary-in-use (VL7–VL8) — closed 2026-07-21 (ROADMAP 에서 2026-07-28 이관)

### VL7 — 분리력 검증 (캘리브레이션)
- DoD: 같은 케이스 세트에서 기준선 대비 향상 폭이 군집별로 기록되고, 향상의 출처가 분해되며, 회귀 케이스가 0이거나 사유가 남는다.
- Evidence: changesets/20260721-vl7-treatment-comparison
- Plan: archive/plans/2026-07-21-vl7-separation-gate.md
- Completed: 2026-07-21 — 84.4%→96.9%, 회귀 0 (changeset 241)

### VL8 — 사람 관측 게이트
- DoD: 사용자가 사전 설명 없이 요구 한 문장을 던져 판정·근거·구현까지 가는 과업 3건의 성공/실패와 막힌 지점이 발화 인용과 함께 기록된다.
- Evidence: evidence/vocabulary-in-use/vl8-observation.md
- Plan: archive/plans/2026-07-21-vl8-human-observation.md
- Completed: 2026-07-21 — **미달로 닫음.** 과업 3건 중 1건만 수행·그 1건 실패 — 에이전트가 규정된 category 축 조회 대신 자기 키워드 grep 후 "사전 밖 개념"으로 단정했으나 실제로는 `장식·배경 효과` 그룹에 aurora-background 등 3건이 있었다. 사용자가 되물어 드러남. VL7의 96.9%는 후보가 이미 좁혀진 케이스라 이 결함을 구조상 못 잰다. 문서 추가로 닫히지 않아 `vocabulary-lookup-discipline` 후보 적재 (changeset 243, 보고서 docs/reports/2026-07-21-vl8-human-observation.md)

## real-use-lap RU1 — closed 2026-07-22 미달 (goal 은 PARK 2026-07-27, ROADMAP 에서 2026-07-28 이관)

### RU1 — 덱을 끝까지 만든다 (관측 장치)
- DoD: Askewly Design 소개 덱 PPTX가 존재하고 사용자가 쓸 수 있다고 판정하며, 발표 게이트(캔버스 프리셋 대조·본문 대비 AA)가 1회 이상 실제 실행되고, 제작 중 막힌 지점이 결함 장부에 전수 기록된다.
- Evidence: evidence/real-use-lap/ru1-deck-production.md
- Completed: 2026-07-22 — **미달로 닫음.** 덱 10장 제작·발표 게이트 첫 실행(프리셋 PASS·대비 7/7 PASS)·결함 10건 기록했으나 사용자 판정 "실제로 못 써 · 내가 원하는 제작 흐름도 아니다 · 문답이 훨씬 많았어야 했다 · Askewly Design 자체가 제대로 작동 안 하는 느낌". **기계가 통과시킨 산출물을 사람이 못 쓴다고 판정** — DOG7과 같은 구조의 재현. 최대 결함 D10: 규모 게이트가 "DESIGN.md 있으면 인터뷰 없음"으로 브리프를 건너뛰어 덱의 내용·청중·구성을 전부 에이전트가 추정했다(DESIGN.md는 룩을 소유하지 내용을 소유하지 않는다). RU2로 이월.

### 2026-07
- VI6 - VI6 — 지식 층 통합
  - Completed: 2026-07-28
  - Result: KG 19노드 전수 판정(흡수8/링크7/제외4) — motion-principles 신설, expressive-stack 정본 단일화, llms 재생성 (미배선 2건 finding)
  - Evidence: evidence/visual-impact-consolidation/vi6-knowledge.md

- VI7 - VI7 — 도구 층 배치
  - Completed: 2026-07-28
  - Result: 15카드 전수 판정(A완료1·A대기2·B8·C4) — absorption-criteria 9행, llms knowledge 3문서 배선 완결, shelf used 8건
  - Evidence: evidence/visual-impact-consolidation/vi7-placement.md

- VI8 - VI8 — 실증 확장
  - Completed: 2026-07-28
  - Result: recipe 2종 실구현(Playwright 5/5·콘솔0, oklch→hex 결함 수리) + three-scene 상호 링크 — goal visual-impact-consolidation 완주
  - Evidence: evidence/visual-impact-consolidation/vi8-recipes.md

### 2026-07
- SQ1 - SQ1 — 디자인 verify 위반 정리
  - Completed: 2026-07-28
  - Result: 색 위반 72→0(시각 무손실 토큰화)·VI8 finding 2건 해소 — 타이포 7건은 게이트 보정 후(사용자 확정)
  - Evidence: evidence/site-quality/sq1-verify-cleanup.md

### 2026-07
- DM1 - DM1 — 다크모드 지식·용어 자산화
  - Completed: 2026-07-31
  - Result: 다크모드 정의 정본 — knowledge/dark-mode.md llms 배선 + terms.yml 등재(전용 variant), 검증 전건 PASS
  - Evidence: evidence/dark-mode/dm1-knowledge.md

- SQ2 - SQ2 — 구조 결함 O5·O6·O7
  - Completed: 2026-07-31
  - Result: 구조 결함 3건 수리 — Get Started 시작 가이드·Docs 소개+허브·사이드바 Components 그룹, 사람 관측 통과
  - Evidence: evidence/site-quality/sq2-structural-defects.md

- SQ3 - SQ3 — O9 검색 결과 UI 재디자인
  - Completed: 2026-07-31
  - Result: 정답/연관 2티어 계층화 + hero/compact 행 재디자인(askewly-design 경유) — 순위·개수 보존, 사람 관측 통과
  - Evidence: evidence/site-quality/sq3-search-redesign.md

### 2026-07
- DM2 - DM2 — 사이트 셸 토큰 치환 + 하드코딩 색 스캐너
  - Completed: 2026-07-31
  - Result: 셸 998건 토큰 치환·마커 정리 + lint:colors --max 0 게이트 — 라이트 무손실 스크린샷 대조, 다크 차단 원인 제거
  - Evidence: evidence/dark-mode/dm2-shell-tokenization.md

### 2026-07
- QA2 - QA2 — Get Started 카드 직관화
  - Completed: 2026-07-31
  - Result: Primer 문법 재설계+일러스트 세트, 관측 7왕복 통과
  - Evidence: evidence/site-polish/qa2-get-started-cards.md

- DM3 - DM3 — 다크모드 활성화
  - Completed: 2026-07-31
  - Result: 3-상태 다크모드 활성화 — 기본 라이트(OS 무관)·FOUC 인라인·데모 전역 추종, 관측 1회차 결함 3종 수리 후 2회차 통과
  - Evidence: evidence/dark-mode/dm3-activation.md

### 2026-08
- M2 - M2 — 강조·상태색 시맨틱 토큰 신설 + "토큰 부재" 마커 전수 해소
  - Completed: 2026-08-01
  - Result: emphasis·status 토큰 18변수 신설(값 무손실 승격), 셸 마커 17건 치환, #5f22a8 소멸 — 색 예외 0. 보고서 docs/reports/2026-08-01-m2-accent-semantic-tokens.md
  - Evidence: evidence/dark-carryover/m2-accent-semantic-tokens.md

- M1 - M1 — 이월 유지보수 마감 (verify 타이포 게이트 보정 + SEO 메타 영어 통일)
  - Completed: 2026-08-01
  - Result: 타이포 위반 8→0(버킷 계수·사유 필수 마커 4건·임계 5→7 실측 재산정, @askewly/design 0.3.0 테스트 60건) + SEO 셸 메타·lang 영어 통일(콘텐츠 제외). 보고서 `docs/reports/2026-08-01-m1-carryover-maintenance.md`
  - Evidence: evidence/carryover-maintenance/m1-closeout.md

- SQ4 - SQ4 — SSG/prerender
  - Completed: 2026-08-01
  - Result: 754 라우트 정적 셸+메타 프리렌더(vite-node) + 폴백 asset-first — CF CI 실배포 확인, colors/pro 직접 진입 갭 부수 수리
  - Evidence: evidence/site-quality/sq4-ssg-prerender.md

- UE1 - UE1 — 탐색이 작동한다
  - Completed: 2026-08-01
  - Result: 탐색 수리 — 사이드바 착지·검색 전역화(제안+결과 2경로)·딥링크·뒤로가기·TOC sticky·스크롤 격리. 사람 관측 3회 왕복(결함 10건 적발, 좁은 5건 즉시 수리, 구조 5건 finding 큐), 3회차 통과. UE5(분리) 사용자 확정
  - Evidence: evidence/ui-encyclopedia/ue1-navigation.md
