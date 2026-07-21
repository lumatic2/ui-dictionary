# Ecommerce Reviews Hero-Level Rework - 2026-07-02

## Scope

Leaf: `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/reviews`

Local route: `/?filter=nav%3Aplus-ecommerce-reviews`

Goal: replace the previous shared `commerce-review-page` reuse with four Reviews-specific variants, using current Tailwind desktop/mobile reference captures, local desktop/mobile captures, and fresh review avatar assets generated for this leaf.

## Tailwind Reference

- Full desktop: `docs/research/assets/ecommerce-reviews-hero-level-rework-2026-07-02/tailwind-reviews-full-desktop.png`
- Mobile 390px: `docs/research/assets/ecommerce-reviews-hero-level-rework-2026-07-02/tailwind-reviews-mobile-390.png`

Observed examples:

1. Multi-column
2. With summary chart
3. Avatars with separate description
4. Simple with avatars

## Local Implementation

Added four dedicated preview variants:

1. `commerce-review-multi-column`
2. `commerce-review-summary-chart`
3. `commerce-review-avatar-description`
4. `commerce-review-simple-avatars`

Local captures:

- Desktop: `docs/research/assets/ecommerce-reviews-hero-level-rework-2026-07-02/local-reviews-desktop.png`
- Mobile 390px: `docs/research/assets/ecommerce-reviews-hero-level-rework-2026-07-02/local-reviews-mobile-390.png`

## Asset Note

This pass uses fresh imagegen avatar assets created for Reviews rather than reusing images from other Ecommerce leaves.

- `examples/ui-vocabulary-site/public/assets/ecommerce-reviews/avatar-short-dark-hair.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-reviews/avatar-navy-overshirt.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-reviews/avatar-curly-hair.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-reviews/avatar-silver-hair.png`

For future leaf work: every preview that visually depends on imagery should get purpose-fit imagegen assets. Shared local placeholder reuse is acceptable only when the Tailwind reference itself is code-native, chart/form driven, or intentionally abstract.

## Verification

- `npm run build`: passed, Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: passed, 527 terms.
- `npm run audit:visuals`: passed, 527 terms/variants, fallback variants 6, generic renderer variants 0, shared variants 0.
- `npm run lint`: passed with existing shadcn Fast Refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- Chrome desktop smoke: all four expected titles present, review asset images 22, unique review assets 4, incomplete review assets 0, horizontal overflow false.
- Mobile CDP smoke at 390px: `scrollWidth=390`, `bodyScrollWidth=390`, offenders `[]`.
