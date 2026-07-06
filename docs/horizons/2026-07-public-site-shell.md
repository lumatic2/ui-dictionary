# Horizon - Public Site Shell

Date: 2026-07-04

## Goal

Turn `ui.askewly.com/` from the existing Tailwind Plus-style catalog entry into the public homepage and site shell for Askewly Design.

## Why Now

The reference model work is complete enough to define what the public website should be. Continuing leaf-page polishing before the homepage and top-level site IA exist would make the app feel like a Tailwind clone with scattered pages instead of a coherent product.

## Milestones

### PSS1 - Homepage And Site IA Shell

DoD:

- `ui.askewly.com/` renders a real public homepage, not the Plus catalog landing.
- The homepage first viewport shows product identity, product promise, search/command affordance, and multiple real UI previews.
- Top-level navigation exposes Docs, Patterns, Showcase, Resources, and Pro, with detailed surfaces/components/foundations/recipes/assets nested below those sections.
- Existing Tailwind-derived work remains accessible through the new IA instead of being discarded.
- Build/lint verification passes.

Evidence:

- `docs/design-system/site-blueprint.md`
- `phases/public-site-shell/index.json`
- `examples/ui-vocabulary-site/src/App.tsx`
- `examples/ui-vocabulary-site/src/components/home-page.tsx`
- `cd examples/ui-vocabulary-site && npm run build`
- `cd examples/ui-vocabulary-site && npm run lint`

## Close Criteria

This horizon closes when the public homepage/site shell exists in code and the next vertical-slice implementation can start from the new IA.

## Objective Impact

This horizon moves the Objective from reference/model planning toward the public product surface: the website starts to present Askewly Design as a product, not only as a vocabulary/catalog implementation.
