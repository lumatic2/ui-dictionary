# Flyout Menus hero-level rework - 2026-07-02

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/marketing/elements/flyout-menus`
- Local route: `/?filter=nav%3Aplus-marketing-flyout-menus`
- Goal: upgrade the existing match-count implementation to the Hero Sections quality bar using fresh desktop and 390px mobile captures.

## Reference evidence

- Tailwind desktop: `docs/research/assets/flyout-menus-hero-level-rework-2026-07-02/tailwind-flyout-menus-desktop.png`
- Tailwind mobile 390: `docs/research/assets/flyout-menus-hero-level-rework-2026-07-02/tailwind-flyout-menus-mobile-390.png`
- Reference metadata: `docs/research/assets/flyout-menus-hero-level-rework-2026-07-02/tailwind-flyout-menus-reference.json`

The live Tailwind page exposes 7 public examples:

1. Stacked with footer actions
2. Full-width two-columns
3. Stacked with footer list
4. Full-width
5. Simple with descriptions
6. Two-column
7. Simple

## Implementation notes

- Replaced the shallow shared flyout renderer with variant-specific flyout panels.
- Matched the reference height rhythm: full-width/two-column previews are long canvases, stacked panels are medium/tall, and Simple is compact.
- Added dark canvas treatments for `Stacked with footer actions` and `Simple with descriptions`.
- Added dedicated footer action, footer list, full-width resource, two-column, description, and simple menu structures.
- Added mobile compact behavior and `min-w-0` layout guards inherited from the shared preview shell.

## Images

The Tailwind `Full-width two-columns` reference includes two image-backed resource cards. Two fresh non-reused imagegen assets were generated for this preview:

- `examples/ui-vocabulary-site/public/assets/flyout-menus/resource-desk-v2.png`
- `examples/ui-vocabulary-site/public/assets/flyout-menus/resource-lounge-v2.png`

Image generation provenance is recorded in `docs/research/assets/flyout-menus-hero-level-rework-2026-07-02/flyout-menus-imagegen-provenance.md`.

## Local evidence

- Before desktop: `docs/research/assets/flyout-menus-hero-level-rework-2026-07-02/local-flyout-menus-before-desktop.png`
- Before mobile 390: `docs/research/assets/flyout-menus-hero-level-rework-2026-07-02/local-flyout-menus-before-mobile-390.png`
- After desktop: `docs/research/assets/flyout-menus-hero-level-rework-2026-07-02/local-flyout-menus-after-desktop.png`
- After mobile 390: `docs/research/assets/flyout-menus-hero-level-rework-2026-07-02/local-flyout-menus-after-mobile-390.png`
- Chrome/CDP smoke: `docs/research/assets/flyout-menus-hero-level-rework-2026-07-02/local-flyout-menus-chrome-smoke.json`

## Verification

- `npm run build`
- `npm run lint`
- `npm run audit:visuals`
- `python scripts\validate-ui-vocabulary.py`
- Chrome/CDP route smoke found all 7 Flyout Menu example names, 2 unique flyout image assets, no missing examples, and no desktop or 390px mobile horizontal overflow.

Known lint output remains the pre-existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
