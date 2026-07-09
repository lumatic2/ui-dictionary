# ROADMAP

> Last updated: 2026-07-10
> Status: Content Fill 시작 — CF1 active
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="content-fill" status="active" -->
Goal: dev 껍데기 중 콘텐츠만 있으면 열리는 것(Docs Foundations·Agent Recipes·Showcase 카드·Patterns 컬렉션)을 완성 판정→게이트 열기로 순차 공개한다. Details: `docs/horizons/2026-07-content-fill.md`. 직전 close: `docs/horizons/2026-07-structure-first-buildout.md`.

## Active Milestones

<!-- harness:milestone id="CF1" status="active" priority="P1" -->
### CF1 - Docs Foundations And Agent Recipes 공개
- DoD: Foundations 아티클 7종이 레포 SSOT 기반 실콘텐츠(실예시·라이트/다크·복붙 코드)로 작성 + Agent Recipes 표면이 recipes/ 5종·llms.txt와 연결 + 게이트 열어 프로덕션 공개(Colors foundation 링크 부활) + Chrome evidence + 배포 확인.
- Evidence: docs/plans/2026-07-10-cf1-docs-foundations.md + changeset README들 + Chrome evidence.
- Gap: Foundations/Agent Recipes가 dev skeleton — 재료(tokens/·knowledge/·recipes/)는 레포에 있는데 사이트 콘텐츠로 파생되지 않음.
- Status: [ ]

## Next Candidates

- CF2 - Showcase Atlas Source-Quality 카드: placeholder 카드 4+1을 토큰·레시피 기반 인터랙티브 데모로 채우거나 근거 있는 제거. (DoD: horizon doc)
- CF3 - Patterns 빈 컬렉션 배치: 우선 4개 컬렉션에 authoring workflow로 terms 채워 공개. (DoD: horizon doc)

<!-- harness:milestone id="SFB1" status="completed" priority="P1" evidence="changesets/20260710-production-exposure-gate/README.md" -->
### SFB1 - Structure Contract And Clean Production
- DoD: blueprint v2(목표 IA·완성 판정 기준·노출 규칙) 확정 + 프로덕션에서 빈 컬렉션·명목상 Templates·Download placeholder 비노출(데이터 보존) + 전 라우트 크롤 스모크 0건 + 배포 확인.
- Evidence: changesets/20260710-production-exposure-gate/README.md
- Gap: nav가 콘텐츠보다 넓게 약속함 — Plus 컬렉션 다수 termIds 빈 배열, Templates 16종 명목상, Docs 아티클 14/46, Download placeholder 자인.
- Status: [x]

- Completed at: 2026-07-10
- Summary: Blueprint v2 IA/노출정책 확정 + 프로덕션 노출 게이트 배포 (빈 컬렉션 42·placeholder 카드 5·Download 진입 4 비노출, ui.askewly.com 확인)
<!-- harness:milestone id="SFB2" status="completed" priority="P1" evidence="docs/plans/2026-07-10-sfb2-shell-buildout.md" -->
### SFB2 - Shell Buildout (dev-only)
- DoD: blueprint v2의 신설 껍데기 전부(Docs Foundations·Agent Recipes, Colors 축[Generator 승격+Palettes], Pro 하위[Packs/Templates/License], Download 앱 배포 페이지)가 노출 게이트 뒤에 구현되고, dev 서버 전 섹션 렌더 스모크 + 프로덕션 빌드 비노출 회귀 확인.
- Evidence: docs/plans/2026-07-10-sfb2-shell-buildout.md
- Gap: blueprint v2가 정의한 목표 구조 중 코드에 존재하지 않는 섹션들 — 증축 도면만 있고 골조가 없음.
- Status: [x]

- Completed at: 2026-07-10
- Summary: blueprint v2 신설 껍데기 전부 dev-only 구현 (Docs Foundations 7+Agent Recipes, Colors 축+Palettes skeleton, Pro 하위 3탭+Download 앱 skeleton) — dev 통합 스모크·prod 비노출 회귀 PASS
<!-- harness:milestone id="SFB3" status="completed" priority="P1" evidence="changesets/20260710-colors-axis-public/README.md" -->
### SFB3 - Content Fill Batch 1: Colors Palettes
- DoD: Colors > Palettes가 큐레이션 팔레트 실데이터 + 복사/내보내기 실동작으로 완성 판정(source-quality: 실데이터·라이트/다크·복붙 가능)을 통과하고, Colors 축 노출 게이트를 열어 프로덕션 공개 + Chrome evidence(데스크톱/모바일·라이트/다크) + 배포 확인.
- Evidence: changesets/20260710-colors-axis-public/README.md
- Gap: Palettes 뷰가 skeleton 슬롯 8개뿐 — 실데이터·상호작용 없음. Colors 축 전체가 게이트 뒤라 사용자가 못 봄.
- Status: [x]

- Completed at: 2026-07-10
- Summary: Colors 축 프로덕션 공개 — 큐레이션 팔레트 13종 실데이터·복사/내보내기·라이트/다크, 껍데기 누출 2건 차단, ui.askewly.com 확인
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
