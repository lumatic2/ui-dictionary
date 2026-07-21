# Tailwind-style page catalog plan

Date: 2026-07-01
Mode: product
Phase: `phases/tailwind-style-page-catalog`

## Scope

Rework UI Vocabulary from a card-grid encyclopedia surface into a Tailwind-style page catalog.

The direction is fixed:

- `Docs` explains concepts and implementation vocabulary.
- `Plus` is the practical catalog.
- `UI Blocks` are reusable screen sections and components.
- `Templates` are complete page examples, not mixed page/block buckets.
- `UI Kit` is component-system vocabulary.
- Term detail pages stay as one-page-per-term URLs.

This plan uses the local Tailwind research screenshots and analysis:

- `docs/research/assets/tailwind-docs-viewport.png`
- `docs/research/assets/tailwind-plus-viewport.png`
- `docs/research/assets/tailwind-ui-blocks-viewport.png`
- `docs/research/assets/tailwind-templates-viewport.png`
- `docs/research/assets/tailwind-ui-kit-viewport.png`
- `docs/research/2026-06-30-tailwind-site-structure-analysis.md`

## Current Card Audit

Card-like structure still remains in these surfaces:

- `examples/ui-vocabulary-site/src/components/term-card.tsx` is still a literal shadcn `Card` component and is used for term result grids.
- `examples/ui-vocabulary-site/src/App.tsx` still renders term results as a responsive card grid through `TermCard`.
- `PlusCatalogLanding` uses boxed `bg-card` panels for `UI Blocks`, `Templates`, and `UI Kit`.
- `DocsCatalogLanding` uses boxed `bg-card` tiles.
- Empty/recovery surfaces use `rounded-lg border bg-card`.
- `poster-view.tsx` intentionally uses card-like printable blocks and can stay out of this phase unless print export is redesigned later.
- Term names such as `product-card`, `price-card`, or `spotlight-card` are vocabulary entries, not UI shell card debt.

The problem is not that cards exist as UI vocabulary. The problem is that the app shell still explains the catalog by showing everything as repeated cards.

## Stop Points

- Stop before Step 2 if the page list taxonomy becomes ambiguous. Current decision: Templates are complete pages only.
- Stop before Step 4 only if the user wants to remove mini visuals from index/list rows entirely. Recommended: keep small visual thumbnails because this product teaches visual terms.
- Stop before deployment. Local implementation and smoke are allowed; production push requires explicit approval.

## Step Tree

- [ ] Step 0: Card debt audit and target IA contract
  - Verify: `rg -n "TermCard|bg-card|Card|grid.*TermCard" examples/ui-vocabulary-site/src`
- [ ] Step 1: Data taxonomy for complete-page Templates
  - Verify: `node ../../scripts/build-ui-vocabulary-data.mjs && python ../../scripts/validate-ui-vocabulary.py`
- [ ] Step 2: Replace Plus landing cards with Tailwind-like catalog rows and category pages
  - Verify: Chrome smoke on `?page=plus`
- [ ] Step 3: Replace result card grid with list/table-like catalog rows where appropriate
  - Verify: representative Plus path and Index search both remain usable
- [ ] Step 4: Build complete-page Template sections
  - Verify: `?page=plus&filter=nav%3Aplus-templates-*` shows page-level entries only
- [ ] Step 5: Docs/Term page polish and final smoke
  - Verify: `npm run build`, `npm run lint`, `npm run audit:visuals`, Chrome console error check

## Planning Gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  spec_delta: "UI Vocabulary IA moves from card-grid encyclopedia MVP toward Tailwind-style Docs/Plus page catalog. Existing PRD card-grid language is now legacy MVP behavior, not the target shell."
  perspectives:
    product: "Users first choose Docs concepts or Plus practical examples, then narrow to blocks/templates/components."
    architecture: "Keep YAML term source and generated TS data; add navigation/template metadata rather than hardcoding page lists in components."
    security: "No auth, secrets, payment, or external write operations."
    qa: "Run data validator, site build/lint, visual audit, and Chrome smoke across Plus, Docs, Template filter, term URL."
    skeptic: "If cards are only restyled but IA remains grid-first, the redesign will not solve the user's confusion."
  dod:
    - "Plus landing no longer presents the product primarily as repeated cards."
    - "Templates are complete page examples only."
    - "Term detail URLs and search still work."
    - "Chrome smoke shows no console errors."
```

