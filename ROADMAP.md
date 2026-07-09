# ROADMAP

> Last updated: 2026-07-10
> Status: Structure-First Buildout 시작 — SFB1 active
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="structure-first-buildout" status="active" -->
Goal: 목표 IA를 문서로 확정하고, 프로덕션은 미완 껍데기 비노출 클린 버전으로 유지하면서, dev에서 껍데기를 증축한 뒤 완성 판정 통과 콘텐츠부터 승격한다. Details: `docs/horizons/2026-07-structure-first-buildout.md`.

## Active Milestones

<!-- harness:milestone id="SFB1" status="active" priority="P1" -->
### SFB1 - Structure Contract And Clean Production
- DoD: blueprint v2(목표 IA·완성 판정 기준·노출 규칙) 확정 + 프로덕션에서 빈 컬렉션·명목상 Templates·Download placeholder 비노출(데이터 보존) + 전 라우트 크롤 스모크 0건 + 배포 확인.
- Evidence: docs/design-system/site-blueprint.md + changesets/<date>-clean-production/README.md
- Gap: nav가 콘텐츠보다 넓게 약속함 — Plus 컬렉션 다수 termIds 빈 배열, Templates 16종 명목상, Docs 아티클 14/46, Download placeholder 자인.
- Status: [ ]

## Next Candidates

- SFB2 - Shell Buildout (dev-only): blueprint 전 섹션 skeleton을 노출 게이트 뒤에 구현, dev 렌더 스모크. (DoD/Evidence: horizon doc 참조)
- SFB3 - Content Fill Batch 1: 우선 배치 1개를 완성 판정 통과시켜 프로덕션 승격. (DoD/Evidence: horizon doc 참조)

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
