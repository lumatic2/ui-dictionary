# BACKLOG

## Completed Horizons

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
