# Batch documentation — RL Step 5 (third proof batch)

Target: milestone RL (`docs/plans/2026-07-12-rl-reference-loop-pipeline.md`, Step 5), procedure `docs/research/reference-loop.md`.

## Scope

Third and final proof-batch run of the 5-stage reference loop (collect → dedup → adapt → verify → absorb) on a `documentation` surface batch of 10 candidates (already collected upstream in `collect-documentation.yml`). This changeset covers stages 1 (staged into canonical `docs/research/loop/inbox.yml`), 2 (pre-adapt dedup audit), 3 (adapt: 2 recipes + 5 terms + 3 related-only updates + 1 term extension), 4 (full verification chain), and 5 (ledger row + inbox cleared).

## Contract

- 2 candidates promoted as **recipes** per fixed orchestrator adjudication:
  - `api-reference-three-column-layout` (`recipes/docs/api-reference-three-column-layout.md`) — a left-parameters / right-sticky-code-and-response layout, distinct from the existing `article-documentation-layout` recipe (referenced via `component_refs`) whose right rail is a static on-this-page label list, not an executable code/response panel. `code_asset`: `examples/ui-vocabulary-site/src/components/api-reference-layout.tsx`, built on the existing `tabs`/`badge` shadcn primitives.
  - `docs-code-block-with-tabs-and-copy` (`recipes/docs/docs-code-block-with-tabs-and-copy.md`) — language/package-manager tab switching plus a pinned copy button and locally scoped overflow scroll, distinct from `article-documentation-layout`'s single-sample `<pre>` block. `code_asset`: `examples/ui-vocabulary-site/src/components/docs-code-block.tsx`, built on the existing `tabs`/`button` shadcn primitives.
  - Both recipes use semantic tokens only (`color.semantic.*`, `dimension.*`, `typography.*`), no hex literals, no primitive token refs.
- `callout-admonition-system` promoted as a new **term** (`callout`, feedback category, `feedback-alerts-toasts` group) per fixed adjudication (check for an existing callout-ish term). The collector's dedup hint pointed at a "notification" term with source note "callout and actionable notification patterns" — inspection during Adapt showed that note is actually attached to the existing `upgrade-prompt` term, not a term about callouts; `terms.yml` had no distinct callout/admonition term. Added a `related` (`compare`) entry to `alert` (both are the nearest existing neighbor) with a symmetric back-link from `alert` to `callout`, distinguishing docs-body-embedded graded admonitions from app-level persistent status/error banners.
- `docs-toc-scroll-spy`: **no new term** per fixed adjudication — extended the existing `anchor-nav` term's `description`/`visual_anatomy` to explicitly cover IntersectionObserver-based scroll-spy active-section highlighting (the term already covered "active section" + "sticky side or top area" but not the scroll-driven highlight mechanism by name). Also added `anchor-nav` to `article-documentation-layout`'s `term_refs` and an `## Agent notes` line pointing at it as the extension target for that recipe's `onThisPage` rail.
- `docs-prev-next-breadcrumb-system`: **no new term** per fixed adjudication — added a symmetric `related` (`use-with`) entry between the existing `breadcrumb` and `pagination` terms, capturing that a documentation site's top breadcrumb + bottom prev/next links work as one combined linear-navigation contract.
- `doc-search-cmdk-grouped-results`: **no new term** per fixed adjudication — added a symmetric `related` (`compare`) entry between the existing `command-palette` and `search-suggestions` terms, capturing that a documentation Cmd/Ctrl+K search uses the command-palette overlay shell but groups results under section headers (Docs/Guides/API), the same grouping axis as `search-suggestions`.
- 4 remaining candidates re-checked against neighboring `terms.yml` entries during Adapt and confirmed clean, then promoted as new terms:
  - `versioned-docs-switcher` (selection, `selection-context` group) — checked against `workspace-switcher`/`account-switcher` (both switch organization/account context, not document version); added `related` (`compare`) to `workspace-switcher`.
  - `docs-changelog-page` (data-display, `data-display-misc` group) — checked against the existing `release-note-card` term, which covers a single release-item card but not the page-level date-grouping + category-filter + pagination composition; added a symmetric `related` (`use-with`) between the two.
  - `docs-feedback-widget` (feedback, `feedback-confirmation-help` group) — no existing docs-feedback term found; commerce-context review/rating terms are a different concept (noted in `anti_use`).
  - `interactive-api-playground` (structure, `structure-content-elements` group) — no existing executable-API-console term found; distinguished from the new `api-reference-three-column-layout` recipe's static reference in `anti_use`.
- `docs/research/loop/inbox.yml` restored to the empty template after promotion; `docs/research/loop/ledger.md` gained the third batch row (3/3 proof batches complete per RL Step 5 DoD).

## Verification checklist

- [x] `node scripts/audit-recipe-candidates.mjs` pre-adapt (run once against the staged `docs/research/loop/inbox.yml`, before any Adapt edits, per the internal-tools batch's amendment to capture pre-adapt output before starting Adapt) → exit 0, 3 warnings: `versioned-docs-switcher`~`switch`, `docs-prev-next-breadcrumb-system`~`breadcrumb`, `docs-prev-next-breadcrumb-system`~`pagination` — all non-fatal near-match substring warnings, matching the input's pre-stated "3 benign substring warnings" exactly.
- [x] `python scripts/validate-recipes.py` → exit 0, `recipes ok: 19`.
- [x] `python scripts/validate-ui-vocabulary.py` → exit 0, `terms ok: 550`, `groups ok: 57 (57 in use)`.
- [x] `node scripts/generate-llms-txt.mjs` → exit 0; both new recipes appear under the generated `## Recipes` section (auto-discovered via `recipes/**/*.md` glob, consistent with the commerce/internal-tools batches' finding that `FIXED_ASSETS` is not the recipe registration point).
- [x] `cd examples/ui-vocabulary-site && npm run build` → exit 0, `terms.generated.ts` regenerated (550 terms), `tsc -b && vite build` clean, no new TypeScript errors from the 2 new components.
- [x] `cd examples/ui-vocabulary-site && npm run lint` → exit 0, only the pre-existing shadcn `react-refresh/only-export-components` warnings (6, unchanged set/count from before this batch).
- [x] CLI data: `cd packages/cli && npm run build:data` → exit 0, `data bundled: terms=550 recipes=19`; confirmed `api-reference-three-column-layout`/`docs-code-block-with-tabs-and-copy` present in `packages/cli/data/recipes.json` and all 5 new terms (`callout`, `versioned-docs-switcher`, `docs-changelog-page`, `docs-feedback-widget`, `interactive-api-playground`) present in `packages/cli/data/terms.json`.

## Amendments (for orchestrator fold into `reference-loop.md`/authoring docs)

No new procedural amendments surfaced this batch. The two prior batches' amendments held and were followed without incident:

1. `generate-llms-txt.mjs`'s `## Recipes` section auto-discovers `recipes/**/*.md` via glob — no `FIXED_ASSETS` edit needed or possible for recipes (commerce batch finding, re-confirmed).
2. Pre-adapt dedup was captured once, before starting any Adapt edits, avoiding the stash/restore step the internal-tools batch needed (internal-tools batch amendment, followed successfully this time).
3. No embedded double-quote marks were used inside unquoted YAML flow-sequence scalars in any new `visual_anatomy`/alias list (internal-tools batch amendment, avoided proactively).

One collection-quality observation worth noting for future collectors (not a script bug): the `callout-admonition-system` candidate's `dedup_hints` pointed at a source note ("callout and actionable notification patterns") that turned out to be attached to `upgrade-prompt`, not a term actually named/about callouts. The automated audit tool doesn't check source-note prose, so this kind of hint requires a manual read during Adapt — consistent with the commerce batch's finding that dedup_hints are not exhaustive and a manual neighbor-read is still required.

## Result

All Stage 4 verification commands passed with the results listed above. Promoted: 2 recipes (`api-reference-three-column-layout`, `docs-code-block-with-tabs-and-copy`), 5 new terms (`callout`, `versioned-docs-switcher`, `docs-changelog-page`, `docs-feedback-widget`, `interactive-api-playground`). Duplicates filtered (no new artifact): 3 (`doc-search-cmdk-grouped-results` related-only between `command-palette`/`search-suggestions`; `docs-toc-scroll-spy` folded into an `anchor-nav` extension + `article-documentation-layout` term_refs addition; `docs-prev-next-breadcrumb-system` related-only between `breadcrumb`/`pagination`). `docs/research/loop/inbox.yml` cleared back to the empty template; `docs/research/loop/ledger.md` row 3 filled in — RL Step 5 DoD (3 ledger entries) satisfied. No `git commit`/`push` performed.
