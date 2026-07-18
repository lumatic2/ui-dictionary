# BACKLOG

## Parked Horizons

### 2026-07-17 - Public Product & Monetization (parked)

- PX - Public Experience Pass: 검색 수리(+포털 클릭 결함 추가 적발)·전 표면 인덱싱, Getting set up 프로토콜, Vocabulary 그룹 통합, 섹션별 독립 사이드바, per-page meta/SEO. Completed 2026-07-12 (`docs/plans/2026-07-12-px-public-experience.md`, changesets #94–98).
- AM/AC/PG/PP 미착수. Park 사유(2026-07-17 사용자 판정): 수익화 전에 에이전트 워크플로우 채택 흐름이 먼저. 복귀 후보는 `docs/horizons/CANDIDATES.md`, 상세는 `docs/horizons/2026-07-public-product-monetization.md`.

## Completed Horizons

### 2026-07-12 - Quality & Dogfooding (H2.5)

- QA2 - AskewlyDesign Install & Dogfooding: 리네임 반영 재패키징+verify:package, 첫 실설치·언인스톨 lifecycle PASS, 설치본 CDP dogfooding에서 major 결함 4건 발견(#1 batch 계약 누락은 Step 6 해소, #2~#4 유지보수 등재), 적체 유지보수 4건 소진(다크모드·focus trap·실체화 undo 파일 삭제·packaged E2E registry/협업 통합) (`docs/plans/2026-07-12-qa2-install-dogfooding.md`, changesets #84–88).
- QA1 - Recipe Gallery & Visual QA: 전용 갤러리 섹션에서 recipe 35종 live render(19종 첫 실노출), 라이트/다크 70장 sweep + contrast 후보 7건 전수 판독(전부 오탐/AA 통과), 오버레이 격리 결함 G1/G2 수정, live-render 유보 계약 갱신 (`docs/plans/2026-07-12-qa1-recipe-gallery-visual-qa.md`, changesets #89–90).
- QA3 - Canvas Recipe Materialization: recipe 실체화가 빌드타임 marker 임베드된 실 standalone 소스 방출, 캔버스 Materialize 액션+데스크톱 IPC source-patch 채널 신설, packaged E2E 왕복 관측(identity 계약·재시작 단일 생존) — E2E가 Windows 스테이징 경로 콜론 결함 적발·봉합 (`docs/plans/2026-07-12-qa3-canvas-recipe-materialization.md`, changesets #91–93).
- Close: close criteria 3항목 충족(전 recipe 열람+design-qa, 설치·실사용+유지보수 소진, 실체화 왕복 E2E). 상세: `docs/horizons/2026-07-quality-dogfooding.md`.
- 크기 회고: milestone 당 changeset 5/2/3 — 인플레 없음.
- 오케스트레이션 회고: sonnet 워커 7기 + Fable 게이트·E2E. 게이트/E2E 적발: 브리지 batch 계약 누락(dev-only 검증 갭), SheetTitle 컨텍스트 크래시, 데모 폭0, Windows 스테이징 경로 — 전부 "유닛 통과 ≠ 실표면 동작"의 실증으로, packaged/브라우저 실구동 게이트가 매 milestone 실결함을 잡음.

### 2026-07-12 - Living Design System (H2)

- RL - Reference Loop Pipeline: 5단계 흡수 루프(수집→dedup→적응→검증→흡수) 표준화 — 절차 문서+inbox+ledger+audit 도구, 실증 3배치(commerce/internal-tools/documentation)로 recipe 6·용어 14·dedup 판정 10 (`docs/plans/2026-07-12-rl-reference-loop-pipeline.md`).
- MS - Mobile Surface Batch: DeviceFrame 표현 인프라 + 모바일 2배치(recipe 4) + 캔버스 모바일 뷰포트 preset(390×844, canonical update-node, 브라우저 E2E) (`docs/plans/2026-07-12-ms-mobile-surface-batch.md`).
- FW - Feed Wiring: 전 recipe 23종 code_asset 독립화(7종은 의사코드 적발→신규 구현), frontmatter→recipeCatalog build-time 생성기(결손=loud fail), Insert 팔레트 Recipes 섹션 + 모바일 뷰포트 삽입 E2E — 루프 산출이 사이트·llms.txt·CLI·캔버스 4곳 자동 도달 (`docs/plans/2026-07-12-fw-feed-wiring.md`).
- SD - Surface Depth 2세대 (구 CS+R2 병합): 4표면 심화 배치(recipe 12, 총 35) + agent-facing anti-patterns.md(12 클러스터, 35/35 커버) + gen-2 토큰 갭 4건 토큰화 (`docs/plans/2026-07-12-sd-surface-depth.md`).
- Close: close criteria 전부 충족 — 루프 9배치 반복 실증(각 배치 프로덕션 검증 체인 완주), 전 표면 카테고리 실콘텐츠(표면당 recipe 3~6), 신규 배치가 재작업 없이 registry/CLI/llms.txt 소비(build:catalog 배선). 상세: `docs/horizons/2026-07-living-design-system.md`.
- 크기 회고: 4 milestone이 각 4~6 changeset으로 전부 milestone-grade — 인플레 없음. CS+R2를 SD 하나로 병합한 판단이 적정(중복 범위 제거).
- 오케스트레이션 회고: sonnet 워커 21기(수집 9·배치 적응 9·구현/도구 3) + Fable 게이트로 4 milestone 단일 세션 완주. 게이트 적발: audit 스크립트 결함 2건, 수집 YAML 결함 4류(name 누락·따옴표 스칼라·빈 필드), FW 추출 불가 7종(의사코드) 재설계.

### 2026-07-12 - Canvas Production Environment (H1)

- UX3 - Agent Collaboration UX: 하이브리드 채널(MCP live context via /events 구독 + agent-canvas CLI, 단일 BridgeClient) + 양 호스트 경로 collaboration feed 계약(/audit 소비) + AgentPanel(actor activity·읽는 feed·canonical Undo·conflict 인라인) + dual-actor conflict-recovery E2E (`docs/plans/2026-07-12-ux3-agent-collaboration-ux.md`).
- UX4 - Product Polish And Validation: 상태/접근성/밀도 sweep + packaged 재증명 — 기존 evidence가 AUC4 셸 산출임을 적발하고 openDevFixture 벤치마크 진입 API로 재생성 (`docs/plans/2026-07-12-ux4-product-polish.md`).
- CR - Component Registry: @askewly/component-registry(shadcn 10+layout 6 큐레이션, registry:// source), 팔레트 v2 4섹션, list_components MCP tool+CLI, 실 bridge round-trip 증명 (`docs/plans/2026-07-12-cr-component-registry.md`).
- RT - Real-project Round-trip: marker-scan ingestion 신설(부재 적발)+데스크톱 배선, 무손실 반영 계약(재파생 일치+바이트 보존+conflict 무변이), registry 실체화(NEW_FILE_HASH 신규 파일 채널, 정체성=marker id), 재열기·병행 편집 연속성 E2E (`docs/plans/2026-07-12-rt-real-project-roundtrip.md`).
- AI - Askewly Identity: 에디터 크롬·캔버스 렌더가 tokens/askewly.tokens.json SSOT 파생(hex lint 고정), tokenBindings 실렌더+다크 전환 실효, H1 close 게이트(5k p95 median 11.60ms) (`docs/plans/2026-07-12-ai-askewly-identity.md`).
- Close: close criteria 충족 — packaged E2E(실프로젝트 open·양 에이전트 편집·watcher 반영·crash/restart·5k 예산·a11y·보안) + renderer/bridge E2E(registry 조립·무손실 왕복·연속성). 상세: `docs/horizons/2026-07-canvas-production-environment.md`. 잔여(비차단): packaged E2E에 registry/협업 시나리오 통합.
- 크기 회고: milestone 5개(승계 2 제외)가 각 3~6 step으로 전부 milestone-grade — 인플레 없음. 측정 프로토콜 교훈: 절대시간 게이트는 High priority+settle+median 통계로 상시 데스크톱 내성 확보(기준 불변).
- 오케스트레이션 회고: sonnet 워커 13기(구현 11·검증 1·리서치 1) + Fable 게이트 체제로 UX2~AI 6 milestone을 단일 세션에 완주. 게이트에서 워커 누락 실결함 2건·시스템 결함 3건 적발.

### 2026-07-12 - Canvas Product UX (superseded into Canvas Production Environment)

- UX1 - Workspace Foundation: 제품형 workspace shell, project entry/recent, toolbar, adaptive panels + packaged 품질 게이트 (`phases/agent-design-workspace-foundation/step5.md`). Completed 2026-07-11.
- UX2 - Visual Creation Workflow: 6 steps — canonical creation command layer(atomic batch), Layers tree projection, searchable Insert palette, align/distribute/tidy/group/ungroup + gap/padding, viewport(zoom anchor·space pan·fit)+단축키+help dialog, 대표 컴포지션 E2E. 게이트: core 52/52·renderer 45/45·desktop 42/42·package/packaged-evidence PASS(IME waiver 유지) (`docs/plans/2026-07-11-ux2-visual-creation-workflow.md`). Completed 2026-07-12.
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

### 2026-07
- AD1 - AD1 — Default Routing 배선
  - Completed: 2026-07-17
  - Result: 진입 프로토콜 llms.txt 노출 + Claude(규칙+hook)·Codex(AGENTS.md) 라우팅 배선 — 양 에이전트 E2E 토큰 파생 PASS(14/14·16/16, 발명 0), silent 404·URL 구성 결함 적발·봉합 — changesets #99–101
  - Evidence: docs/plans/2026-07-17-ad1-default-routing.md

### 2026-07
- AD2 - AD2 — Style Signature
  - Completed: 2026-07-17
  - Result: 인터뷰 확정 시그니처(운용 원칙 5 + 비선호 5, 점수제 폐기) — entry-protocol 판정 단계 편입·llms.txt 배포, 실판정 1회 구동(발명 팔레트 FAIL 변별) — changesets #102–103
  - Evidence: docs/plans/2026-07-17-ad2-style-signature.md

- AD3 - AD3 — Real-work Dogfooding
  - Completed: 2026-07-17
  - Result: 실작업 dogfooding — DF-1·DF-2(bootcamp 2표면) 라우팅 관측+시그니처 PASS, DF-3 실사용 관측(동질화 적발→교정). DF-4 기회주의 건은 사용자 면제 2026-07-17(갭은 AD4에서 해소 완료) — changesets #104–107
  - Evidence: docs/research/dogfooding/ledger.md

- AD4 - AD4 — Gap-driven 확장
  - Completed: 2026-07-17
  - Result: 갭 4건 해소 — chat recipe(live gallery)+한글 break-keep 클러스터+판정-중심 프로토콜 재정렬(hook 불사용 확정), 배포 검증 — changesets #110–111
  - Evidence: docs/plans/2026-07-17-ad4-gap-driven-expansion.md

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
  - Evidence: plans/2026-07-17-vi3-motion-recipes.md

- VI4 - VI4 — Canvas·WebGL·three.js 티어
  - Completed: 2026-07-17
  - Result: three.js/R3F lazy 도입(별도 청크 881KB·메인 +2.4KB gzip) + ③ 파티클·④ 3D 씬 recipe — lazy 실증·WebGL 폴백·reduced-motion 게이팅, 배포 검증 — changesets #118–119
  - Evidence: plans/2026-07-17-vi4-canvas-webgl-tier.md

- VI5 - VI5 — 부품 층 계약 + 레퍼런스 흡수
  - Completed: 2026-07-17
  - Result: shadcn 재스타일 계약(동작 불가침·look=프로젝트 토큰) + 흡수 3분기 기준(실측 9종 분류) llms 배포 + toolshelf used 5건 — changesets #120–121
  - Evidence: plans/2026-07-17-vi5-component-layer-absorption.md

### 2026-07
- TC1 - TC1 — 흡수 계약 개정
  - Completed: 2026-07-17
  - Result: taste 흡수 계약(갱신 없는 관찰=미소화·7필드·성립성 게이트 4문항) + ledger + RL 상호 배선 — changesets #122–123
  - Evidence: plans/2026-07-17-tc1-taste-loop-contract.md

- TC2 - TC2 — 제품 배치: 사용자 큐레이션 5종
  - Completed: 2026-07-17
  - Result: 큐레이션 5종 관찰 12건(흡수 9·미소화 2·시그니처 제안 1) — anti-patterns 클러스터 14·15 신설+13 보강, recipe 5파일 갱신, 배포 검증 — changesets #124–126
  - Evidence: plans/2026-07-17-tc2-curation-batch.md

- TC3 - TC3 — 표현 배치: Dribbble 조건부
  - Completed: 2026-07-17
  - Result: Dribbble 게이트 배치 — CRM 콘셉트 FAIL(3/4)→클러스터 16(콘셉트 대시보드 관성), 단일 액센트 차트 PASS→stat-grid 보강, 배포 검증 — changesets #128–129
  - Evidence: plans/2026-07-17-tc3-dribbble-batch.md

- TC4 - TC4 — 성문 판단 diff: HIG·Material·Polaris
  - Completed: 2026-07-17
  - Result: 성문 판단 diff — 채택 3(서체 증식 금지·모션 규모 비례·verb-first)·기각 2(M3 색 역할=스타일 고정 금지 충돌, HIG 재질=중복), 배포 검증 — changesets #130–131
  - Evidence: plans/2026-07-17-tc4-canonical-diff.md

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
