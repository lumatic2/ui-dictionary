# ROADMAP

> Last updated: 2026-07-07
> Status: System Model Core closed — next horizon pending planning discussion
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="system-model-core" status="closed" -->
Goal: (CLOSED 2026-07-07) Built the design system SSOT — tokens, pattern taxonomy, component recipes — consumed by both the website and coding agents. Details: `docs/horizons/2026-07-system-model-core.md`. Milestone history: `BACKLOG.md`.

**Next horizon is not yet authored.** Open it via a planning discussion (§B0.5). Leading candidates below.

## Next Candidates

<!-- harness:milestone id="AGI1" status="candidate" priority="P0" -->
### Agent Integration horizon (후보)
- DoD: Codex/Claude Code가 recipes/tokens/taxonomy를 실제 워크플로우(스킬·llms.txt·메타데이터 질의)로 소비해 외부 프로젝트 UI를 구현한다.
- Evidence: 소비 스킬/인덱스 + 외부 프로젝트 구현 사례
- Gap: SSOT는 존재하지만 에이전트가 이를 찾고 쓰는 진입점(스킬 연결, llms.txt)이 없다.
- Status: [ ]

<!-- harness:milestone id="PSS2" status="pending" priority="P1" -->
### PSS2 - Landing Page Design Quality (carried over)
- DoD: The `ui.askewly.com/` landing page feels like a finished public product page with a distinctive first viewport, polished responsive layout, interactive preview states, light/dark behavior, and Chrome evidence across desktop and mobile.
- Evidence: `docs/plans/2026-07-05-showcase-atlas-upgrade.md` (resume from Step 4); build/lint + Chrome screenshots
- Gap: Showcase Steps 0-3 done; remaining cards and integrated QA open. New items from SMC: hero pill-button reconciliation, dark-mode toggle activation, showcase reduced-motion fallback.
- Status: [ ]

<!-- harness:milestone id="FGB1" status="candidate" priority="P2" evidence="docs/horizons/2026-07-figma-bridge-candidate.md" -->
### FGB1 - Figma Bridge Candidate Horizon
- DoD: Figma's role is defined as both competitor and complement, with a concrete bridge model from Figma artifacts to Askewly Design tokens, patterns, implementation recipes, and coding-agent verification.
- Evidence: docs/horizons/2026-07-figma-bridge-candidate.md
- Gap: Now unblocked — the SMC token model exists to bridge against.
- Status: [ ]

## Archive Pointer

Completed or archived milestone history lives in `BACKLOG.md` (Public Site Shell closed 2026-07-07; System Model Core closed 2026-07-07).
