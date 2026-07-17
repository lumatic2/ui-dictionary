# Ecommerce Checkout Forms Hero-Level Rework - 2026-07-02

## Scope

Leaf: `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/checkout-forms`

Local route: `/?filter=nav%3Aplus-ecommerce-checkout-forms`

Goal: replace the previous shared `commerce-checkout-page` reuse with five Checkout Forms-specific variants, backed by current Tailwind desktop/mobile reference captures and local desktop/mobile verification.

## Tailwind Reference

- Full desktop: `docs/research/assets/ecommerce-checkout-forms-hero-level-rework-2026-07-02/tailwind-checkout-forms-full-desktop.png`
- Mobile 390px: `docs/research/assets/ecommerce-checkout-forms-hero-level-rework-2026-07-02/tailwind-checkout-forms-mobile-390.png`

Observed examples:

1. Single step with order summary
2. With mobile order summary overlay
3. Multi-step
4. With order summary sidebar
5. Split with order summary

## Local Implementation

Added five dedicated preview variants:

1. `commerce-checkout-single-summary`
2. `commerce-checkout-mobile-overlay`
3. `commerce-checkout-multi-step`
4. `commerce-checkout-sidebar-summary`
5. `commerce-checkout-split-summary`

Local captures:

- Desktop: `docs/research/assets/ecommerce-checkout-forms-hero-level-rework-2026-07-02/local-checkout-forms-desktop.png`
- Mobile 390px: `docs/research/assets/ecommerce-checkout-forms-hero-level-rework-2026-07-02/local-checkout-forms-mobile-390.png`

## Asset Note

No imagegen assets were needed for this leaf. The Tailwind reference is form, order-summary, progress, and split-layout driven rather than product-image driven, so this pass uses code-native form controls and summary panels.

## Verification

- `npm run build`: passed, Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: passed, 527 terms.
- `npm run audit:visuals`: passed, 527 terms/variants, fallback variants 6, generic renderer variants 0, shared variants 0.
- Chrome desktop smoke: all five expected titles present, `fieldCount=52`, `summaryCount=5`, horizontal overflow false.
- Mobile CDP smoke at 390px: `scrollWidth=390`, `bodyScrollWidth=390`, offenders `[]`.
