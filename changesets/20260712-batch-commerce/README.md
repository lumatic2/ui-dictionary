# Batch commerce — RL Step 3 (first proof batch)

Target: milestone RL (`docs/plans/2026-07-12-rl-reference-loop-pipeline.md`, Step 3), procedure `docs/research/reference-loop.md`.

## Scope

First end-to-end run of the 5-stage reference loop (collect → dedup → adapt → verify → absorb) on a `commerce` surface batch of 10 candidates (already collected upstream in `20260712-commerce`). This changeset covers stages 1 (staged into canonical `docs/research/loop/inbox.yml`), 2 (dedup re-check + orchestrator adjudications), 3 (adapt: 2 recipes + 4 terms + 2 alias fixes + 1 related note), 4 (full verification chain), and 5 (ledger row + inbox cleared).

## Contract

- 2 candidates promoted as **recipes** per fixed orchestrator adjudication: `cart-drawer`, `shipping-method-selector` (`recipes/commerce/*.md`, `recipe-format.md` 8-section/frontmatter contract), each backed by a real `code_asset` implementation under `examples/ui-vocabulary-site/src/components/` (`cart-drawer.tsx` built on the existing `Sheet` overlay primitive the same way `topbar-search.tsx` builds on `popover`; `shipping-method-selector.tsx` built on the existing `radio-group` primitive). No hex literals, `tokens_used` limited to `color.semantic.*`/`dimension.*`/`typography.*` paths that exist in `tokens/askewly.tokens.json`.
- 1 candidate (`address-form-autocomplete`) judged a duplicate of the existing `address-autocomplete` term — no new term, no alias added (judged: the collected concept is a whole checkout form composition, not a synonym for the single autocomplete input; an alias would misleadingly narrow the existing term to a checkout-only context).
- 1 candidate (`sticky-order-total-bar`) judged to need no new term — added a `related` entry on the existing `cart-summary-bar` term pointing at `cart-summary`, with a note referencing the `checkout-order-summary` recipe (which is a recipe id, not a term id, so it could not be a `related.id` target directly; it is referenced in the note prose instead).
- Of the remaining 6 "likely new term" candidates, re-running dedup against `terms.yml` surfaced 2 real duplicates the automated audit's name/token-overlap heuristics missed (different wording, same concept):
  - `product-gallery` duplicates the existing `image-gallery` term (same gallery+active-thumbnail concept, already filed under the `data-commerce-billing` group) — added EN alias "Product gallery" / KO alias "상품 이미지 갤러리" instead of a new term.
  - `category-filter-facets` duplicates the existing `faceted-filter` term (same facet-group + applied-chip concept) — added EN alias "Category filter facets" / KO alias "카테고리 필터" instead of a new term.
  - The other 4 (`reviews-summary-block`, `order-history-list`, `product-quickview-modal`, `incentive-trust-strip`) cleared dedup and were promoted as new `terms.yml` entries with `related` comparisons against their nearest neighbors (`testimonial-section`, `order-status`, `product-card`/`modal-bottom-sheet` respectively) per authoring-workflow.md §3.
- `docs/research/loop/inbox.yml` restored to the empty template after promotion; `docs/research/loop/ledger.md` gained one batch row.

## Verification checklist

- [x] `node scripts/audit-recipe-candidates.mjs --input <batch file>` (pre-promotion, against the batch as collected) → exit 0, 4 warnings (`cart-drawer`~`drawer`, `shipping-method-selector`~`select`, `address-form-autocomplete`~`autocomplete`, `address-form-autocomplete`~`address-autocomplete` token similarity 0.67) — all non-fatal near-match warnings, consistent with the orchestrator's pre-stated result.
- [x] `python scripts/validate-recipes.py` → exit 0, `recipes ok: 15`.
- [x] `python scripts/validate-ui-vocabulary.py` → exit 0, `terms ok: 540`, `groups ok: 57 (57 in use)`.
- [x] `node scripts/generate-llms-txt.mjs` → exit 0; both new recipes appear under the generated `## Recipes` section (auto-discovered via `recipes/**/*.md` glob in `collectRecipes()` — see Amendments, `FIXED_ASSETS` is not the recipe registration point in the current script).
- [x] `cd examples/ui-vocabulary-site && npm run build` → exit 0, `generated ... terms.generated.ts (540 terms)`, `tsc -b && vite build` clean, no new TypeScript errors from the 2 new components.
- [x] `cd examples/ui-vocabulary-site && npm run lint` → exit 0, only the pre-existing shadcn `react-refresh/only-export-components` warnings (6, unchanged set/count from before this batch).
- [x] CLI data: `cd packages/cli && npm run build:data` → exit 0, `data bundled: terms=540 recipes=15`; confirmed `cart-drawer` present in `packages/cli/data/recipes.json`.

## Amendments (for orchestrator fold into `reference-loop.md`)

1. **§llms.txt registration is stale.** `scripts/generate-llms-txt.mjs`'s `## Recipes` section auto-discovers every file under `recipes/**/*.md` via `collectRecipes()`/`globSync` — it does not read `FIXED_ASSETS` for recipes. `FIXED_ASSETS` only holds non-recipe SSOT docs (principles, tokens, taxonomy, contracts). The RL procedure's instruction to manually add new recipes to `FIXED_ASSETS` does not apply to the current script; no edit was made there and none was needed — both new recipes appeared automatically.
2. **Dedup re-run after promotion is expected to "fail".** Re-running `audit-recipe-candidates.mjs` against `docs/research/loop/inbox.yml` after promoting matching content into `recipes/`/`terms.yml` correctly reports exact-overlap errors against the just-promoted items (they now match themselves). This is not a regression — dedup should be confirmed once before Adapt, not re-run against the same inbox after Adapt/Absorb. Worth a one-line clarification in the procedure so future batches don't mistake this for a validator regression.
3. **Automated dedup token-overlap missed 2 real duplicates** (`product-gallery`↔`image-gallery`, `category-filter-facets`↔`faceted-filter`) because the collected candidate names shared no normalized substring/token overlap with the existing term's id/name/aliases (different wording for the same concept). The audit tool did its job (schema + near-miss detection on token overlap); catching these required a manual read of neighboring `terms.yml` entries during Adapt. Not a script bug to fix in this batch — noting it as a batch-adjudication finding, and as a reminder that dedup_hints collected by upstream research need not be exhaustive.

## Result

All Stage 4 verification commands passed with the results listed above. Promoted: 2 recipes (`cart-drawer`, `shipping-method-selector`), 4 new terms (`reviews-summary-block`, `order-history-list`, `product-quickview-modal`, `incentive-trust-strip`), 2 alias-only updates (`image-gallery`, `faceted-filter`), 1 related-only update (`cart-summary-bar`). Duplicates filtered: 4 (`address-form-autocomplete` dropped, `sticky-order-total-bar` related-only, `product-gallery` and `category-filter-facets` alias-only). `docs/research/loop/inbox.yml` cleared back to the empty template; `docs/research/loop/ledger.md` row 1 filled in. No `git commit`/`push` performed.
