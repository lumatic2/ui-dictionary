# BACKLOG

## Completed Horizons

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
