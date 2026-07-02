# Ecommerce Order Summaries Hero-Level Rework - 2026-07-02

## Scope

Leaf: `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/order-summaries`

Local route: `/?filter=nav%3Aplus-ecommerce-order-summaries`

Goal: replace the previous shared `commerce-cart-page` reuse with four Order Summaries-specific variants, using current Tailwind desktop/mobile reference captures, local desktop/mobile captures, and fresh product/order assets generated for this leaf.

## Tailwind Reference

- Full desktop: `docs/research/assets/ecommerce-order-summaries-hero-level-rework-2026-07-02/tailwind-order-summaries-full-desktop.png`
- Mobile 390px: `docs/research/assets/ecommerce-order-summaries-hero-level-rework-2026-07-02/tailwind-order-summaries-mobile-390.png`

Observed examples:

1. With split image
2. With progress bars
3. With large images and progress bars
4. Simple with full order details

## Local Implementation

Added four dedicated preview variants:

1. `commerce-order-summary-split-image`
2. `commerce-order-summary-progress-bars`
3. `commerce-order-summary-large-images`
4. `commerce-order-summary-full-details`

Local captures:

- Desktop: `docs/research/assets/ecommerce-order-summaries-hero-level-rework-2026-07-02/local-order-summaries-desktop.png`
- Mobile 390px: `docs/research/assets/ecommerce-order-summaries-hero-level-rework-2026-07-02/local-order-summaries-mobile-390.png`

## Asset Note

This pass uses fresh imagegen assets created for Order Summaries rather than reusing product imagery from Shopping Carts, Product Features, Reviews, or other Ecommerce leaves.

- `examples/ui-vocabulary-site/public/assets/ecommerce-order-summaries/split-shelf.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-order-summaries/black-tumbler.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-order-summaries/minimal-watch.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-order-summaries/cream-shirt.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-order-summaries/green-shirt.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-order-summaries/amber-bottle.png`

Order Summaries previews should preserve the Tailwind rhythm: large confirmation split image first, order rows with progress bars, larger product image rows, then a compact full-detail receipt.

## Verification

- `npm run build`: passed, Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: passed, 527 terms.
- `npm run audit:visuals`: passed, 527 terms/variants, fallback variants 6, generic renderer variants 0, shared variants 0.
- `npm run lint`: passed with existing shadcn Fast Refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- Chrome desktop/local capture saved after implementation.
- Mobile CDP smoke at 390px: all four expected titles present, order asset images 8, unique order assets 6, incomplete order assets 0, `scrollWidth=390`, `bodyScrollWidth=390`, offenders `[]`.
