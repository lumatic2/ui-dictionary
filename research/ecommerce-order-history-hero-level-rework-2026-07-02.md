# Ecommerce Order History Hero-Level Rework - 2026-07-02

## Scope

Leaf: `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/order-history`

Local route: `/?filter=nav%3Aplus-ecommerce-order-history`

Goal: replace the previous shared `commerce-order-page` reuse with four Order History-specific variants, using current Tailwind desktop/mobile reference captures, local desktop/mobile captures, and fresh product thumbnail assets generated for this leaf.

## Tailwind Reference

- Full desktop: `docs/research/assets/ecommerce-order-history-hero-level-rework-2026-07-02/tailwind-order-history-full-desktop.png`
- Mobile 390px: `docs/research/assets/ecommerce-order-history-hero-level-rework-2026-07-02/tailwind-order-history-mobile-390.png`

Observed examples:

1. Invoice panels
2. Invoice table
3. Invoice list
4. Invoice list with quick actions

## Local Implementation

Added four dedicated preview variants:

1. `commerce-order-history-panels`
2. `commerce-order-history-table`
3. `commerce-order-history-list`
4. `commerce-order-history-quick-actions`

Local captures:

- Desktop: `docs/research/assets/ecommerce-order-history-hero-level-rework-2026-07-02/local-order-history-desktop.png`
- Mobile 390px: `docs/research/assets/ecommerce-order-history-hero-level-rework-2026-07-02/local-order-history-mobile-390.png`

## Asset Note

This pass uses fresh imagegen product thumbnails created for Order History rather than reusing product imagery from previous Ecommerce leaves.

- `examples/ui-vocabulary-site/public/assets/ecommerce-order-history/olive-pullover.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-order-history/yellow-tote.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-order-history/navy-pouch.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-order-history/black-pen-set.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-order-history/taupe-mug.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-order-history/tan-wallet.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-order-history/kraft-sketchbooks.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-order-history/black-rain-boots.png`

Order History previews should preserve the Tailwind rhythm: invoice metadata, product rows with thumbnails, delivery state, invoice actions, and explicit quick reorder actions.

## Verification

- `npm run build`: passed, Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: passed, 527 terms.
- `npm run audit:visuals`: passed, 527 terms/variants, fallback variants 6, generic renderer variants 0, shared variants 0.
- `npm run lint`: passed with existing shadcn Fast Refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- Mobile CDP smoke at 390px: all four expected titles present, order history asset images 16, unique history assets 8, incomplete history assets 0, `scrollWidth=390`, `bodyScrollWidth=390`, offenders `[]`.
