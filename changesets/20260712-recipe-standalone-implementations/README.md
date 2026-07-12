# FW Step 1b — Recipe Standalone Implementations

Target: milestone FW (`docs/plans/2026-07-12-fw-feed-wiring.md`, Step 1b).

## Outcome

The 7 recipes flagged by `changesets/20260712-code-asset-extraction/README.md`
as "no clean move target" (illustrative pseudocode or App.tsx closures
entangled in shared demo-catalog state) now each have a real, standalone
`src/components/<id>.tsx` implementation: a props-driven component matching
the recipe's anatomy/states/checks, plus a colocated `<Name>Demo` export that
supplies its own local state (repo convention — see `bottom-tab-bar.tsx`,
`action-sheet-destructive-confirmation.tsx`). `App.tsx` was not touched; its
existing in-place implementations continue to serve their current pages.

## Mapping

| Recipe | New file | Component | Demo export |
|---|---|---|---|
| `commerce/checkout-order-summary` | `src/components/checkout-order-summary.tsx` | `CheckoutOrderSummary` | `CheckoutOrderSummaryDemo` |
| `data-display/interactive-data-table` | `src/components/interactive-data-table.tsx` | `InteractiveDataTable` | `InteractiveDataTableDemo` |
| `feedback/actionable-toast` | `src/components/actionable-toast.tsx` | `ActionableToast` | `ActionableToastDemo` |
| `feedback/recoverable-empty-state` | `src/components/recoverable-empty-state.tsx` | `RecoverableEmptyState` | `RecoverableEmptyStateDemo` |
| `layout/responsive-content-grid` | `src/components/responsive-content-grid.tsx` | `ResponsiveContentGrid` | `ResponsiveContentGridDemo` |
| `layout/sidebar-application-shell` | `src/components/sidebar-application-shell.tsx` | `SidebarApplicationShell` | `SidebarApplicationShellDemo` |
| `data-display/stat-summary-grid` | `src/components/stat-summary-grid.tsx` | `StatSummaryGrid` | `StatSummaryGridDemo` |

Each recipe's frontmatter `code_asset` now points at its new file (previously
`App.tsx` or `home-page.tsx` as a whole file). Each recipe's `## Code` excerpt
was replaced with a real 20-40 line extract from the new component (matching
`docs/design-system/recipe-format.md`'s convention), instead of the prior
pseudocode that did not correspond to any real implementation.

## Design notes / how the recipe spec was realized

- **`checkout-order-summary`**: ported the recipe's own illustrative
  `Props`/JSX shape closely (it was already a coherent single-component
  design, just never built) — swapped raw `<button>` for shadcn `Button`,
  added a `paymentError` field to the `CheckoutOrder` type so the "payment
  failure preserves entered details" Check has something concrete to render.
  Demo: address/payment-method are set via two buttons; confirming without
  both stays disabled; first confirm attempt fails with a recoverable error,
  second attempt succeeds — exercises the Checks around duplicate-submit
  guard and failure-preserves-state without adding a full form.
- **`interactive-data-table`**: ported `App.tsx`'s `UsersTable`/selection-set
  structure (stable row `id` keys, checkbox selection, conditional bulk-action
  header) onto shadcn's `Table`/`Checkbox` primitives instead of the recipe's
  raw `<table>`/`<input type="checkbox">` sketch, since the site already has
  a `Table` primitive that gives proper `data-slot` semantics for free.
- **`actionable-toast`**: ported `App.tsx`'s `ToastCard` closure (timer
  cleanup effect, `role="status"`/`aria-live="polite"`, single Undo action)
  as the standalone component; the demo posts into a bounded (max 3),
  newest-first stack, mirroring the recipe's "stacked notifications with a
  bounded visible count" state.
- **`recoverable-empty-state`**: no real `App.tsx` counterpart existed (the
  Step 1 investigation found only an unrelated one-line "No results found"
  string), so this one was authored from the recipe spec directly — the
  `kind`-dispatched copy table from the recipe's own Code section, with an
  `InboxIcon` standing in for the recipe's undefined `EmptyIcon`. Demo lets
  you switch between all four `kind`s so each cause's distinct copy/action is
  visible, per the recipe's "cause-specific" Check.
- **`responsive-content-grid`**: same situation (no real counterpart, ad hoc
  grid shapes scattered across preview functions) — authored from the
  recipe's own Code section, swapping `StatusChip`/raw `<button>` (which
  don't exist in this codebase) for shadcn `Badge`/`Button`.
- **`sidebar-application-shell`**: no isolated counterpart existed (the
  site's real sidebar is core `App()` chrome). Authored from the recipe's
  Code section with an `onSelect` callback added (the recipe's sketch had no
  way to actually change `activeId`, which the demo needs to be interactive)
  and `PanelLeft`/icons imported from `lucide-react` to match the recipe's
  `PanelLeft` reference.
- **`stat-summary-grid`**: the recipe's own Code hardcoded `dashboardStats`
  inside the component itself, which conflicts with the recipe's own
  Anti-pattern ("Fake proof metrics: ... decorate ... with no data source").
  Resolved by lifting `stats`/`title`/`rangeLabel`/`reportHref` to props on
  the reusable component (so a real caller must supply real data) and moving
  the sample numbers into the colocated `StatSummaryGridDemo` only, where a
  labeled demo dataset is expected and appropriate.

No other recipe body content (Intent/Anatomy/States/Variants/Checks/
Anti-patterns/Agent notes) was changed — only frontmatter `code_asset` and the
`## Code` excerpt, per scope.

## Ambiguity resolutions (summary)

- 4 of the 7 recipes (`checkout-order-summary`, `interactive-data-table`,
  `actionable-toast`, plus adapting shadcn primitives for the others) had a
  real `App.tsx` closure to port structurally; 3 (`recoverable-empty-state`,
  `responsive-content-grid`, `sidebar-application-shell`) had no real
  precedent at all and were authored straight from the recipe's own `##
  Code`/`## Anatomy`/`## States` sections, since those sections are the
  spec of record per `docs/design-system/recipe-format.md`.
- Where a recipe's own Code excerpt referenced a component that doesn't
  exist in this codebase (`StatusChip`, `EmptyIcon`), it was swapped for the
  closest real primitive already in `src/components/ui/` or `lucide-react`.
- `stat-summary-grid`'s hardcoded sample data was moved out of the reusable
  component and into its demo, to satisfy the recipe's own anti-pattern
  against baking fake metrics into the primitive.

## Verification

| Command | Result |
|---|---|
| `python scripts/validate-recipes.py` | `recipes ok: 23`, exit 0 |
| `cd examples/ui-vocabulary-site && npm run build` | `tsc -b && vite build` succeeded, exit 0 (239 modules — unchanged from Step 1 baseline; the 7 new files are not yet imported by any page, per task scope) |
| `npm run lint` | 6 warnings, exit 0 — identical to the pre-existing baseline (`ui/button.tsx`, `ui/tabs.tsx`, `ui/badge.tsx`, and 3 in `home-page.tsx`); no new warnings from the 7 new files |
| `node scripts/generate-llms-txt.mjs` | `wrote examples/ui-vocabulary-site/public/llms.txt (29 assets copied ...)`, exit 0 |
| hex literal grep on all 7 new `.tsx` files | 0 matches |

## Notes

- No `git commit`/`push` performed per task instructions — working tree left
  dirty for review.
- Recipe markdown files were re-normalized to LF after editing (same CRLF
  snag as Step 1 — the edit tool introduces CRLF on Windows, which breaks
  `generate-llms-txt.mjs`'s frontmatter regex). New `.tsx` component files
  were left at the repo's existing CRLF convention (confirmed against
  `cart-drawer.tsx` as a baseline — CRLF is the norm for `.tsx` here).
- `examples/ui-vocabulary-site/public/llms/**` and `public/llms.txt` changed
  as a side effect of running the required `generate-llms-txt.mjs`
  verification step (recipe `code_asset` paths changed, so generated copies
  changed too).
- The 7 new components are not wired into `term-visual.tsx`, `App.tsx`, or
  `home-page.tsx` — per task scope, App.tsx/home-page.tsx were left
  untouched. They exist as standalone, recipe-backed files ready for FW
  Step 2's catalog generator to pick up via `code_asset`.

## Next

FW Step 2 (recipe catalog generator, already complete per
`changesets/20260712-recipe-catalog-generator/`) and Step 3 (palette
consumption + E2E) can now proceed against all 23 recipes having a real
standalone `code_asset`, closing the gap Step 1 flagged.
