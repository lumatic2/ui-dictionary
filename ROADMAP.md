# ROADMAP

> Last updated: 2026-07-09
> Status: PSS2/PGD1 완료 — 다음 horizon 결정 필요
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="public-site-shell" status="completed" -->
Goal: 랜딩을 완성된 공개 제품 페이지로 유지하면서, 대표 interactive demo가 실제 품질 기준을 갖추도록 마무리한다. Details: `docs/horizons/2026-07-public-site-shell.md` (close 기록) + 직전 close: `docs/horizons/2026-07-figma-workflow.md` → `BACKLOG.md`.

## Active Milestones

- No active milestone. See `docs/roadmap-gap-2026-07-09.md` before starting the next implementation horizon.

## Recently Completed

<!-- harness:milestone id="PGD1" status="completed" priority="P2" evidence="changesets/20260709-palette-generator-data-engine/README.md" -->
### PGD1 - Palette Generator Data Engine
- DoD: Color Palette Generator uses a real palette data contract or generation rule set instead of only cycling a small hardcoded demo array; locked-color behavior, contrast/readability, duplicate avoidance, and export stability are verified in Chrome.
- Evidence: changesets/20260709-palette-generator-data-engine/README.md
- Gap: Current `Generate` cycles through local `paletteGeneratorSets` only. Need seed library/schema, generation behavior, quality gates, and UI copy that explains generation source cleanly.
- Status: [x]

- Completed at: 2026-07-09
- Summary: Palette generator now uses curated seed data, deterministic generation rules, lock preservation, quality gates, and Chrome smoke evidence.

<!-- harness:milestone id="PSS2" status="completed" priority="P1" evidence="changesets/20260709-askewly-auth-sso-routing/README.md" -->
### PSS2 - Landing Page Design Quality (carried over)
- DoD: The `ui.askewly.com/` landing page feels like a finished public product page with a distinctive first viewport, polished responsive layout, interactive preview states, light/dark behavior, and Chrome evidence across desktop and mobile.
- Evidence: changesets/20260709-askewly-auth-sso-routing/README.md
- Gap: Showcase Steps 0-3 done; remaining cards and integrated QA open. New items from SMC: hero pill-button reconciliation, dark-mode toggle activation, showcase reduced-motion fallback. FW 이월: CTA pill 정합은 Figma 배리에이션 탐색 활용 가능.
- Status: [x]

- Completed at: 2026-07-09
- Summary: Landing CTA/Auth routing, production Pages Function smoke, and desktop/mobile light/dark QA passed.

## Archive Pointer

Completed or archived milestone history lives in `BACKLOG.md` (Figma Workflow, Figma Bridge closed 2026-07-07; Public Site Shell, System Model Core, Agent Integration closed 2026-07-07).
