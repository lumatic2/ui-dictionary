# Ecommerce Promo Sections Hero-Level Rework - 2026-07-02

## Scope

Leaf: `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/promo-sections`

Local route: `/?filter=nav%3Aplus-ecommerce-promo-sections`

Goal: replace the previous shared `commerce-promo-page` reuse with eight Promo Sections-specific variants, backed by current Tailwind desktop/mobile reference captures and fresh preview-specific image assets.

## Tailwind Reference

- Full desktop: `docs/research/assets/ecommerce-promo-sections-hero-level-rework-2026-07-02/tailwind-promo-sections-full-desktop.png`
- Mobile 390px: `docs/research/assets/ecommerce-promo-sections-hero-level-rework-2026-07-02/tailwind-promo-sections-mobile-390.png`

Observed examples:

1. With image tiles
2. With fading background image and testimonials
3. Full-width with background image
4. Full-width with overlapping image tiles
5. With background image
6. With overlapping image tiles
7. With offers and split image
8. Full-width with background image and large content

## Local Implementation

Added eight dedicated preview variants:

1. `commerce-promo-image-tiles`
2. `commerce-promo-fading-testimonials`
3. `commerce-promo-full-background`
4. `commerce-promo-full-overlap`
5. `commerce-promo-background-image`
6. `commerce-promo-overlapping-tiles`
7. `commerce-promo-offers-split`
8. `commerce-promo-large-content`

Local captures:

- Desktop: `docs/research/assets/ecommerce-promo-sections-hero-level-rework-2026-07-02/local-promo-sections-desktop.png`
- Mobile 390px: `docs/research/assets/ecommerce-promo-sections-hero-level-rework-2026-07-02/local-promo-sections-mobile-390.png`

## Imagegen Assets

Each preview received a fresh generated image. One additional supporting tile was generated for multi-image promo layouts.

Workspace assets:

- `examples/ui-vocabulary-site/public/assets/ecommerce-promo-sections/image-tiles-home.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-promo-sections/fading-bedroom.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-promo-sections/full-background-outdoor.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-promo-sections/full-overlap-kitchen.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-promo-sections/background-skincare.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-promo-sections/overlap-apparel.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-promo-sections/offers-split-travel.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-promo-sections/large-content-furniture.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-promo-sections/supporting-desk.png`

Provenance: `docs/research/assets/ecommerce-promo-sections-hero-level-rework-2026-07-02/promo-sections-imagegen-provenance.md`

## Verification

- `npm run build`: passed, Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: passed, 527 terms.
- `npm run audit:visuals`: passed, 527 terms/variants, fallback variants 6, generic renderer variants 0, shared variants 0.
- `npm run lint`: passed with the existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- Chrome desktop smoke: all eight expected titles present, nine unique Promo Sections assets loaded, incomplete assets 0, horizontal overflow false.
- Mobile CDP smoke at 390px: `scrollWidth=390`, `bodyScrollWidth=390`, offenders `[]`.
