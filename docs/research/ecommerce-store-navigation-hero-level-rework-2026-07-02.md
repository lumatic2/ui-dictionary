# Ecommerce Store Navigation Hero-Level Rework - 2026-07-02

## Scope

Leaf: `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/store-navigation`

Local route: `/?filter=nav%3Aplus-ecommerce-store-navigation`

Goal: replace the previous shared `commerce-storefront-page` preview reuse with five Store Navigation-specific preview variants, using fresh Tailwind reference captures and fresh per-preview image assets.

## Tailwind Reference

- Chrome viewport: `docs/research/assets/ecommerce-store-navigation-hero-level-rework-2026-07-02/tailwind-store-navigation-chrome-viewport.png`
- Full desktop: `docs/research/assets/ecommerce-store-navigation-hero-level-rework-2026-07-02/tailwind-store-navigation-full-desktop.png`
- Mobile 390px: `docs/research/assets/ecommerce-store-navigation-hero-level-rework-2026-07-02/tailwind-store-navigation-mobile-390.png`

Observed examples:

1. With featured categories
2. With image grid
3. With simple menu and promo
4. With centered logo and featured categories
5. With double column and persistent mobile nav

## Local Implementation

Added five dedicated preview variants:

1. `commerce-store-nav-featured`
2. `commerce-store-nav-image-grid`
3. `commerce-store-nav-simple-promo`
4. `commerce-store-nav-centered-logo`
5. `commerce-store-nav-double-mobile`

Local captures:

- Desktop: `docs/research/assets/ecommerce-store-navigation-hero-level-rework-2026-07-02/local-store-navigation-desktop.png`
- Mobile 390px: `docs/research/assets/ecommerce-store-navigation-hero-level-rework-2026-07-02/local-store-navigation-mobile-390.png`

## Imagegen Assets

Each preview received a fresh generated image rather than reusing an existing preview asset.

Workspace assets:

- `examples/ui-vocabulary-site/public/assets/ecommerce-store-navigation/featured-categories-fashion.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-store-navigation/image-grid-accessories.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-store-navigation/simple-menu-promo-outerwear.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-store-navigation/centered-logo-home.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-store-navigation/persistent-mobile-travel.png`

Provenance: `docs/research/assets/ecommerce-store-navigation-hero-level-rework-2026-07-02/store-navigation-imagegen-provenance.md`

## Verification

- `npm run build`: passed, Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: passed, 527 terms.
- `npm run audit:visuals`: passed, 527 terms/variants, fallback variants 6, generic renderer variants 0, shared variants 0.
- `npm run lint`: passed with the existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- Chrome desktop smoke: all five expected titles present, five unique Store Navigation assets loaded, incomplete assets 0, horizontal overflow false.
- Mobile CDP smoke at 390px: `scrollWidth=390`, `bodyScrollWidth=390`, offenders `[]`.
