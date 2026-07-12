# FW Step 1 — Code Asset Extraction

Target: milestone FW (`docs/plans/2026-07-12-fw-feed-wiring.md`, Step 1).

## Outcome

Inventoried all 23 `recipes/*/*.md` files. 13 already point at standalone
`examples/ui-vocabulary-site/src/components/*.tsx` files and were left untouched.
10 legacy recipes pointed at the monolithic `App.tsx` (7) or `home-page.tsx` (3).
Investigation (see "Findings" below) found that only **3 of the 10** have a
single, clean, standalone implementation that can be moved without rewriting.
The other **7 do not have a real backing implementation matching their recipe
contract** — their `## Code` sections are illustrative pseudocode that was
never actually built as a standalone component; the real UI in `App.tsx` in
that area is either a one-off closure entangled in a large shared-state
"variant catalog" function, or doesn't exist at all. Forcing an extraction
for those would mean authoring new code under a move label, which violates
the plan's move-not-rewrite constraint. Those 7 are reported, not forced.

## Mapping (recipe → old symbol → new file)

| Recipe | Old code_asset / symbol | New file | Notes |
|---|---|---|---|
| `application-ui/showcase-card` | `home-page.tsx` → `AtlasCard` (+ `LineArtIcon`) | `src/components/showcase-card.tsx` | `AtlasDemo` (shared across all 12 atlas demos) stays in `home-page.tsx`, exported and imported back. `atlasItems`/`AtlasItemId`/`atlasIconMap` relocated to new `src/lib/atlas-items.ts` data module (see "Extra move" below). |
| `marketing/landing-hero` | `home-page.tsx` → inline hero `<section>` in `HomePage()` | `src/components/landing-hero.tsx` (`LandingHero`) | Extracted the whole first-viewport `<section>` (background, `FloatingField`, title, subcopy, CTAs, `HeroSearch`, `ShowcaseAtlas`) verbatim into a new component with the same props as `HomePage`. `FloatingField`/`HeroSearch`/`ShowcaseAtlas` stay in `home-page.tsx` (shared/still only consumer is this hero), exported and imported back. |
| `docs/article-documentation-layout` | `App.tsx` → `DocsArticlePage` (lines 2239-2360) + its sole helper `DocsInteractiveElementPreview` (lines 1696-2011) | `src/components/article-documentation-layout.tsx` | Both functions moved verbatim (`DocsArticlePage` marked `export`; it was the only recipe-relevant symbol). `DocsInteractiveElementPreview` had no other caller, so it moved with it instead of staying behind as a "shared helper". `App.tsx` now imports `DocsArticlePage` from the new file; its one call site (line ~675) is unchanged. |
| `commerce/checkout-order-summary` | `App.tsx` (whole file) | — not extracted — | No standalone symbol. "Order summary" is repeated ad hoc across ~10 different checkout/cart template variants (`commerce-checkout-single-summary`, `-sidebar-summary`, `-split-summary`, `-mobile-overlay`, etc.), each a one-off JSX block, not one reusable component. |
| `data-display/interactive-data-table` | `App.tsx` (whole file) | — not extracted — | Real tables (`UsersTable`, `Shell`, `Header` closures at ~L11074-11158, and a second one at ~L13603) are local closures inside a large `if (variant === ...)` catalog function, closed over shared outer state (`selectedTableRows`, `activeNavItem`, `postedComment`, `theme`, `users`) — not standalone components with the recipe's `{ rows }` prop contract. |
| `docs/article-documentation-layout` | (see above, extracted) | | |
| `feedback/actionable-toast` | `App.tsx` (whole file) | — not extracted — | Real toast (`ToastCard` at ~L12899) is a closure inside a `variant.startsWith("toast-feedback-")` branch, closed over `toastStack`/`toastVisible`/`postedComment` — not the recipe's standalone `{ toast, onDismiss, onUndo }` component. |
| `feedback/recoverable-empty-state` | `App.tsx` (whole file) | — not extracted — | No component matching the recipe's `kind`-dispatched copy table (`firstUse`/`search`/`filtered`/`error`) exists. Closest real code is a single generic "No results found / Clear filters" line inside an unrelated template preview (~L20158) — not a match. |
| `layout/responsive-content-grid` | `App.tsx` (whole file) | — not extracted — | The `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` shape recurs ad hoc in several unrelated preview functions (marketing sections, template galleries); no single `{ items }` component like the recipe describes. |
| `layout/sidebar-application-shell` | `App.tsx` (whole file) | — not extracted — | The site's own real sidebar (~L604) is core `App()` page chrome, deeply entangled in that 23k-line component's state — not an isolated, movable unit. Other `<aside>` sidebar-shaped markup in the file is, again, one-off closures inside the variant-catalog functions. |
| `data-display/stat-summary-grid` | `home-page.tsx` (whole file) | — not extracted — | No `StatSummaryGrid` exists. The only stat-grid-shaped code in `home-page.tsx` is `DashboardShowcase` (dark "Live status" atlas showcase demo, `dashboardStats`/`dashboardServices`/`dashboardDeploys`), which is a different, unrelated decorative component (different anatomy: deploy log + service list + bar chart, not a labeled `<dl>` metric grid) — not an excerpt of the recipe's contract. |

## Extra move (required to keep lint clean)

Exporting `atlasItems`/`AtlasItemId`/`atlasIconMap` directly out of `home-page.tsx`
(a component file) tripped `oxlint`'s `react(only-export-components)` rule twice
(new warnings, since a component file mixing component and non-component
exports breaks Fast Refresh). To keep the lint diff at exactly the pre-existing
6 warnings, this pure atlas-item data (no JSX, no behavior) was relocated to a
new `src/lib/atlas-items.ts` module and both `home-page.tsx` and the new
`showcase-card.tsx` import from there instead. This is a data relocation, not a
logic change — same values, same shapes, same icons.

## Recipes left unchanged (not touched)

The frontmatter/body of the following recipes were **not edited** because no
clean extraction target exists: `checkout-order-summary`, `interactive-data-table`,
`actionable-toast`, `recoverable-empty-state`, `responsive-content-grid`,
`sidebar-application-shell`, `stat-summary-grid`. Their `code_asset` still points
at `App.tsx` / `home-page.tsx` as a whole file. Closing this gap for FW's
overall goal (recipe → canvas registry feed) will need either (a) authoring a
real standalone implementation for each as new, intentional work — not a move —
or (b) a follow-up decision to deprioritize/deprecate these 7 recipes for the
registry-feed milestone. Flagging for the milestone owner rather than forcing.

## Verification

| Command | Result |
|---|---|
| `python scripts/validate-recipes.py` | `recipes ok: 23`, exit 0 |
| `cd examples/ui-vocabulary-site && npm run build` | `tsc -b && vite build` succeeded, exit 0 (238→239 modules; no new chunks beyond the existing >500kB warning, which is pre-existing and unrelated) |
| `npm run lint` | 6 warnings, exit 0 — same 3 `src/components/ui/{button,badge,tabs}.tsx` shadcn warnings as baseline, plus the same 3 pre-existing `home-page.tsx` `only-export-components` warnings (now at shifted line numbers 1414/1523/1556 instead of 1517/1626/1659, because ~100 net lines were removed from `home-page.tsx` by the move — same warnings, no new ones added) |
| `node scripts/generate-llms-txt.mjs` | `wrote examples/ui-vocabulary-site/public/llms.txt (29 assets copied ...)`, exit 0 |

Baseline lint (`git stash` before these edits) confirmed 6 warnings at
`home-page.tsx:1517/1626/1659` + the 3 shadcn ones, establishing that the
post-change 6 warnings are the same set, not a new set of the same size.

## Notes

- No `git commit`/`push` performed per task instructions — working tree left
  dirty for review.
- `examples/ui-vocabulary-site/public/llms/**` and `public/llms.txt` changed
  as a side effect of running the required `generate-llms-txt.mjs` verification
  step (recipe `code_asset` paths changed, so the generated copies changed too).
- Recipe markdown files (`showcase-card.md`, `article-documentation-layout.md`,
  `landing-hero.md`) were re-normalized to LF line endings after editing —
  the repo's `generate-llms-txt.mjs` frontmatter parser requires exact `\n---`
  and the edit tool had introduced CRLF, which broke the generator until fixed.

## Next

Step 2 (recipe catalog generator) is already complete per
`changesets/20260712-recipe-catalog-generator/`. Before Step 3 (palette
consumption + E2E), the milestone owner should decide how to handle the 7
recipes above that could not be migrated — the catalog generator will still
emit entries for them (their `code_asset` still resolves to `App.tsx`/
`home-page.tsx`), so the Insert palette will offer them, but they will resolve
to a materialize/open-in-canvas source pointing at a 20k+ line file rather
than a focused component.
