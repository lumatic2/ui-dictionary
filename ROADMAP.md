# ROADMAP

> Last updated: 2026-07-07
> Status: System Model Core
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="system-model-core" -->
Goal: Build the design system itself — 3-tier tokens, pattern taxonomy, component recipes, and anti-patterns — as a single source of truth consumed by both the website and coding agents. Details: `docs/horizons/2026-07-system-model-core.md`

## Active Milestones

<!-- harness:milestone id="SMC0" status="completed" priority="P0" evidence="docs/market/design-system-format-survey.md; docs/market/format-survey-notes/" -->
### SMC0 - 시장 포맷 조사 (market beat)
- DoD: Radix Themes, shadcn registry, Vercel Geist, Material 3 tokens, W3C DTCG, and agent-facing format precedents are surveyed into a comparison table with adoption criteria for our token/recipe format.
- Evidence: docs/market/design-system-format-survey.md; docs/market/format-survey-notes/ (6 source notes)
- Gap: Designing the token/recipe schema without surveying existing formats risks a costly schema rework later.
- Status: [x]
- Completed at: 2026-07-07
- Summary: Surveyed six format precedents via parallel sonnet research agents, gate-checked the findings, and synthesized a comparison table plus 11 adoption criteria (DTCG-compatible SSOT, unidirectional 3-tier lint, semantic-layer light/dark, atomic recipe packaging, DESIGN.md as derived artifact, llms.txt index).

<!-- harness:milestone id="SMC1" status="completed" priority="P0" evidence="tokens/askewly.tokens.json; scripts/lint-tokens.mjs; scripts/generate-tokens.mjs; docs/plans/2026-07-07-token-ssot.md; docs/research/design-skills-impact-audit.md; docs/research/assets/smc1-token-ssot-2026-07-07/" -->
### SMC1 - 토큰 시스템 SSOT
- DoD: primitive -> semantic -> component 3-tier tokens exist as one machine-readable source; DESIGN.md and the site's token usage align with it; WCAG contrast and token-reference lint pass.
- Evidence: tokens/askewly.tokens.json; scripts/lint-tokens.mjs (92 checks PASS, failure-mode verified); scripts/generate-tokens.mjs; site tokens.css + hex migration (90 replacements, 0 brand hex residue); Chrome smoke screenshots; custom-skills SSOT guards deployed
- Gap: Tokens currently live informally in DESIGN.md and index.css without a machine-readable single source.
- Status: [x]
- Completed at: 2026-07-07
- Summary: Established tokens/askewly.tokens.json as the machine-readable SSOT with a 3-tier lint gate and generation pipeline deriving DESIGN.md frontmatter and site tokens.css; migrated 90 hardcoded brand hex usages to token references; added SSOT guards to design-bootstrap/harness/screen skills. Follow-ups queued: dark-mode toggle activation, design-bridge naming cross-check.

<!-- harness:milestone id="SMC2" status="completed" priority="P1" evidence="docs/design-system/pattern-taxonomy.md; docs/ui-vocabulary/groups.yml; docs/plans/2026-07-07-pattern-taxonomy.md; docs/research/assets/smc2-pattern-taxonomy-2026-07-07/" -->
### SMC2 - 패턴 분류 체계
- DoD: A cross-surface pattern taxonomy absorbs docs/design-system/surface-taxonomy.md and the ui-vocabulary data, with a schema linking each pattern to tokens, recipes, and examples.
- Evidence: pattern-taxonomy.md (canonical terms; surface 7, pattern_group 10, term axes); groups.yml 57 groups; terms.yml group field on 527/527; validator + site derive from data (assignment diff 0); Chrome smoke
- Gap: Surface taxonomy and vocabulary data exist separately and are not yet one navigable pattern system.
- Status: [x]
- Completed at: 2026-07-07
- Summary: pattern-taxonomy.md ended the four-document terminology drift (pattern_group fixed at 10) and the hardcoded group axis was promoted from search.ts into groups.yml + a required term field with validator enforcement, keeping site behavior identical. Follow-ups queued: category imbalance redesign, empty navigation collections cleanup.

<!-- harness:milestone id="SMC3" status="pending" priority="P1" -->
### SMC3 - 컴포넌트 레시피 + 안티패턴 첫 배치
- DoD: A recipe format (intent/tokens/states/checks/anti-patterns) is fixed and a first batch of recipes exists; one demo proves a site page and an agent implementation derive from the same recipe source.
- Evidence: first recipe batch; shared-consumption demo
- Gap: No implementation-ready recipe layer exists between reference notes and site code.
- Status: [ ]

## Next Candidates

<!-- harness:milestone id="PSS2" status="pending" priority="P1" -->
### PSS2 - Landing Page Design Quality (carried over)
- DoD: The `ui.askewly.com/` landing page feels like a finished public product page with a distinctive first viewport, polished responsive layout, interactive preview states, light/dark behavior, and Chrome evidence across desktop and mobile.
- Evidence: `docs/plans/2026-07-05-showcase-atlas-upgrade.md` (resume from Step 4); `examples/ui-vocabulary-site/src/components/home-page.tsx`; build/lint + Chrome screenshots
- Gap: Showcase Steps 0-3 are done; remaining cards (Scroll Narrative, Motion, Shader, Material, Image, Hero, Command Center, Commerce/Mobile) and integrated QA are open.
- Status: [ ]
- Paused: 2026-07-07 — carried over from the closed public-site-shell horizon; resume in a later product-surface horizon.

<!-- harness:milestone id="FGB1" status="candidate" priority="P2" evidence="docs/horizons/2026-07-figma-bridge-candidate.md" -->
### FGB1 - Figma Bridge Candidate Horizon
- DoD: Figma's role is defined as both competitor and complement, with a concrete bridge model from Figma artifacts to Askewly Design tokens, patterns, implementation recipes, and coding-agent verification.
- Evidence: docs/horizons/2026-07-figma-bridge-candidate.md
- Gap: Askewly Design needs to position itself against Figma without ignoring Figma's strength as a visual authoring and review surface. Depends on the SMC token model existing first.
- Status: [ ]

## Archive Pointer

Completed or archived milestone history lives in `BACKLOG.md` (Public Site Shell horizon closed 2026-07-07).
