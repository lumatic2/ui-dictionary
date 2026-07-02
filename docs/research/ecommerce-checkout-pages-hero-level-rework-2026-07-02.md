# Ecommerce Checkout Pages Hero-Level Rework - 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/checkout-pages`
- Local route: `/?filter=nav%3Aplus-ecommerce-page-examples-checkout-pages`
- Goal: replace the shared `commerce-checkout-page` placeholder with five dedicated checkout page variants based on the captured Tailwind examples.

## Reference captures

- Desktop: `docs/research/assets/ecommerce-checkout-pages-hero-level-rework-2026-07-02/tailwind-checkout-pages-desktop.png`
- Mobile 390px: `docs/research/assets/ecommerce-checkout-pages-hero-level-rework-2026-07-02/tailwind-checkout-pages-mobile-390.png`
- Local before desktop: `docs/research/assets/ecommerce-checkout-pages-hero-level-rework-2026-07-02/local-checkout-pages-before-desktop.png`
- Local before mobile: `docs/research/assets/ecommerce-checkout-pages-hero-level-rework-2026-07-02/local-checkout-pages-before-mobile-390.png`
- Local after desktop: `docs/research/assets/ecommerce-checkout-pages-hero-level-rework-2026-07-02/local-checkout-pages-after-desktop.png`
- Local after mobile: `docs/research/assets/ecommerce-checkout-pages-hero-level-rework-2026-07-02/local-checkout-pages-after-mobile-390.png`

## Implemented examples

- With order summary sidebar -> `commerce-checkout-sidebar-summary-page`
- Single step with order summary -> `commerce-checkout-single-step-page`
- With mobile order summary overlay -> `commerce-checkout-mobile-overlay-page`
- Multi-step -> `commerce-checkout-multi-step-page`
- Split with order summary -> `commerce-checkout-split-summary-page`

## Implementation notes

- Added five dedicated Checkout Pages preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Preserved the generic `commerce-checkout-page` renderer for unrelated overview/template usages.
- Recreated the captured Tailwind structures with checkout form sections, order summary sidebar, top promo/nav bar, stepper, multi-step split layout, and purple split summary.
- Generated fresh checkout page assets under `examples/ui-vocabulary-site/public/assets/ecommerce-checkout-pages/`.
- Caught and replaced two bad generated candidates before implementation: a magenta building image and a duplicated apparel set where object products were required.
- Imagegen provenance is recorded in `docs/research/assets/ecommerce-checkout-pages-hero-level-rework-2026-07-02/checkout-pages-imagegen-provenance.md`.

## Verification

- `cd examples/ui-vocabulary-site; npm run build` -> passed.
- `cd examples/ui-vocabulary-site; npm run audit:visuals` -> passed. Result: 527 terms, 527 variants, fallback variants 6, generic renderer 0, shared variants 0.
- `cd examples/ui-vocabulary-site; npm run lint` -> passed with only pre-existing shadcn fast-refresh warnings in `badge.tsx`, `button.tsx`, and `tabs.tsx`.
- `python scripts\validate-ui-vocabulary.py` -> passed. Result: 527 terms.
- Chrome smoke on local route -> passed with 5 expected headings, 15 checkout asset references, all three expected generated assets present, and 0 broken image tags.
- `git diff --check` on touched Checkout Pages files -> passed with only the existing LF/CRLF warning for `App.tsx`.

