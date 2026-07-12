# Batch mobile-nav — MS Step 2 (first mobile proof batch)

Target: milestone MS (`docs/plans/2026-07-12-ms-mobile-surface-batch.md`, Step 2), procedure `docs/research/reference-loop.md`.

## Scope

First of two mobile-surface RL batches (collect → dedup → adapt → verify → absorb) on a `mobile-apps` surface, `navigation`/structure-leaning theme (tab bar, bottom sheet detents, back/large-title header, segmented view switching, edge-swipe-back, navigation drawer, app-bar scroll behavior, safe area, adaptive split view). 10 candidates were collected upstream; this changeset covers stages 1 (staged into canonical `docs/research/loop/inbox.yml` with orchestrator adjudications folded in), 2 (pre-adapt dedup audit), 3 (adapt: 2 recipes + 1 term + 4 aliases + 2 related-only updates), 4 (full verification chain), and 5 (ledger row + inbox cleared).

## Contract

- 2 candidates promoted as **recipes**, both rendered inside the `DeviceFrame` component (`examples/ui-vocabulary-site/src/components/device-frame.tsx`, MS Step 1) via a colocated demo:
  - `bottom-tab-bar` (`recipes/navigation/bottom-tab-bar.md`) — a persistent bottom destination-switching bar (3-5 tabs, icon+label required, filled/outlined active state, optional critical-info badge). `term_refs: [tab-bar]` per the fixed adjudication. `code_asset`: `examples/ui-vocabulary-site/src/components/bottom-tab-bar.tsx`.
  - `bottom-sheet-detents` (`recipes/overlays/bottom-sheet-detents.md`) — candidate id renamed from `bottom-sheet` at staging time per fixed adjudication (the raw id/name collided too closely with the existing `mobile-bottom-sheet`/`standard-bottom-sheet` terms). One component implements both `standard` (no scrim, background stays interactive) and `modal` (scrim, blocking) structural modes via a `variant` prop, plus a collapsed/expanded detent pair cycled from a tap-labeled drag handle (never drag-only). `term_refs: [mobile-bottom-sheet, standard-bottom-sheet, modal-bottom-sheet]`. `code_asset`: `examples/ui-vocabulary-site/src/components/bottom-sheet-detents.tsx`.
  - Both recipes use semantic tokens only (`color.semantic.*`, `dimension.*`), no hex literals, no primitive token refs — confirmed by `validate-recipes.py`.
- `adaptive-split-view` promoted as a new **term** (`docs/ui-vocabulary/terms.yml`, `structure` category, `structure-panels` group) per fixed adjudication confirming a structural gap vs the existing `master-detail` term: `master-detail` is a static 2-column layout only, while `adaptive-split-view` covers the window-size-driven stack↔split adaptation (tab bar convertible to sidebar) plus user-customizable destinations. Added a symmetric `related` (`compare`) entry between the two.
- `pull-to-refresh-structural`: **no new artifact** — dropped before staging (exact duplicate of the existing `pull-to-refresh` term). No alias added since the collected wording didn't add anything the existing term doesn't already cover.
- 4 candidates resolved as **alias-only** additions (no new term):
  - `navigation-stack-header` → alias on `large-title-header` (EN "Navigation stack header" / KO "내비게이션 스택 헤더"); `large-title-header`'s description/`visual_anatomy` were also extended to note the paired back button and the HIG rule that back-navigation is distinct from sheet dismissal, since the candidate's anatomy included a back button the existing term's description didn't previously call out.
  - `segmented-view-switcher` → alias on `mobile-segmented-tabs` (EN "Segmented view switcher" / KO "세그먼트 뷰 전환기") — the existing term already covers same-screen view-mode switching via a segmented control, which is exactly this candidate's concept.
  - `edge-swipe-back-gesture` → alias on `edge-swipe-back` (EN "Edge swipe back gesture" / KO "가장자리 스와이프 백 제스처").
  - `mobile-navigation-drawer` → alias on `navigation-drawer` (EN "Mobile navigation drawer" / KO "모바일 내비게이션 드로어").
  - `safe-area-layout-pattern` → alias on `safe-area` (EN "Safe area layout pattern" / KO "세이프 에어리어 레이아웃 패턴").
- `app-bar-scroll-collapse-behavior`: **no new term** per fixed adjudication — added a symmetric `related` (`compare`) entry between the existing `top-app-bar` and `large-title-header` terms, capturing the general scroll show/hide rule (bar appears on scroll-up, hides on scroll-down) plus the screen-reader-active exception (don't hide the bar when a screen reader is active), which is distinct from `large-title-header`'s own title-collapse-on-scroll behavior.
- `docs/research/loop/inbox.yml` restored to the empty template after promotion; `docs/research/loop/ledger.md` gained the `20260712-mobile-nav` batch row.

## Verification checklist

- [x] `node scripts/audit-recipe-candidates.mjs` pre-adapt (run once against the staged `docs/research/loop/inbox.yml`, adjudications folded in at staging, before any Adapt edits) → exit 0, 9 candidates checked, 13 non-fatal near-match/substring duplicate-risk warnings — every candidate's stated `dedup_hints` neighbor triggers one, none fatal.
- [x] `python scripts/validate-recipes.py` → exit 0, `recipes ok: 21`.
- [x] `python scripts/validate-ui-vocabulary.py` → exit 0, `terms ok: 551`, `groups ok: 57 (57 in use)`.
- [x] `node scripts/generate-llms-txt.mjs` → exit 0; both new recipes appear under the generated `## Recipes` section (auto-discovered via `recipes/**/*.md` glob), confirmed present in `examples/ui-vocabulary-site/public/llms.txt`.
- [x] `cd examples/ui-vocabulary-site && npm run build` → exit 0, `terms.generated.ts` regenerated (551 terms), `tsc -b && vite build` clean, no new TypeScript errors from the 2 new components.
- [x] `cd examples/ui-vocabulary-site && npm run lint` → exit 0, only the pre-existing shadcn `react-refresh/only-export-components` warnings (6, unchanged set/count from before this batch: `button.tsx`, `tabs.tsx`, `badge.tsx`, `home-page.tsx` ×3).
- [x] CLI data: `cd packages/cli && npm run build:data` → exit 0, `data bundled: terms=551 recipes=21`; confirmed `bottom-tab-bar`/`bottom-sheet-detents` present in `packages/cli/data/recipes.json` and `adaptive-split-view` present in `packages/cli/data/terms.json`.

## Amendments

No new procedural amendments surfaced this batch. The prior batches' amendments held and were followed without incident:

1. `generate-llms-txt.mjs`'s `## Recipes` section auto-discovers `recipes/**/*.md` via glob — no `FIXED_ASSETS` edit needed or possible for recipes.
2. Pre-adapt dedup was captured once, before starting any Adapt edits.
3. No embedded double-quote marks were used inside unquoted YAML flow-sequence scalars in any new alias/related list.

One task-specific note for future mobile-surface collectors: the raw `bottom-sheet` candidate id/name were too close to the existing `mobile-bottom-sheet`/`standard-bottom-sheet`/`modal-bottom-sheet` term names for the audit to read as a distinct new recipe artifact. Renaming the candidate at staging time to `bottom-sheet-detents` — reflecting the actual differentiator (a detent-cycling shell implementing both existing structural terms rather than a third overlapping concept) — resolved this cleanly. This mirrors the general principle already in `reference-loop.md`/`authoring-workflow.md` (rename toward the real differentiator instead of the raw source-page name), not a new rule.

## Result

All Stage 4 verification commands passed with the results listed above. Promoted: 2 recipes (`bottom-tab-bar`, `bottom-sheet-detents`), 1 new term (`adaptive-split-view`, `related` compare ↔ `master-detail`). Duplicates filtered (no new artifact): 7 out of 10 collected — `pull-to-refresh-structural` (dropped, exact duplicate of `pull-to-refresh`), `navigation-stack-header` (alias on `large-title-header` + description/anatomy extension), `segmented-view-switcher` (alias on `mobile-segmented-tabs`), `edge-swipe-back-gesture` (alias on `edge-swipe-back`), `mobile-navigation-drawer` (alias on `navigation-drawer`), `safe-area-layout-pattern` (alias on `safe-area`), `app-bar-scroll-collapse-behavior` (related-only between `top-app-bar`/`large-title-header`). `docs/research/loop/inbox.yml` cleared back to the empty template; `docs/research/loop/ledger.md` gained the `20260712-mobile-nav` row. No `git commit`/`push` performed.
