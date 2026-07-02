# Ecommerce Order History Pages Hero-Level Rework - 2026-07-02

## Scope

- Tailwind source: `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/order-history-pages`
- Local route: `/?filter=nav%3Aplus-ecommerce-page-examples-order-history-pages`
- Tailwind examples observed: `Simple`, `With invoice list and quick actions`, `With invoice panels`, `With invoice tables`, `With invoice list`
- Local variants implemented:
  - `commerce-order-history-simple-page`
  - `commerce-order-history-quick-actions-page`
  - `commerce-order-history-panels-page`
  - `commerce-order-history-tables-page`
  - `commerce-order-history-list-page`

## Reference Captures

- Tailwind desktop: `docs/research/assets/ecommerce-order-history-pages-hero-level-rework-2026-07-02/tailwind-order-history-pages-desktop.png`
- Tailwind mobile 390: `docs/research/assets/ecommerce-order-history-pages-hero-level-rework-2026-07-02/tailwind-order-history-pages-mobile-390.png`
- Local before desktop: `docs/research/assets/ecommerce-order-history-pages-hero-level-rework-2026-07-02/local-order-history-pages-before-desktop.png`
- Local before mobile 390: `docs/research/assets/ecommerce-order-history-pages-hero-level-rework-2026-07-02/local-order-history-pages-before-mobile-390.png`
- Local after desktop: `docs/research/assets/ecommerce-order-history-pages-hero-level-rework-2026-07-02/local-order-history-pages-after-desktop.png`
- Local after mobile 390: `docs/research/assets/ecommerce-order-history-pages-hero-level-rework-2026-07-02/local-order-history-pages-after-mobile-390.png`

## What Changed

- Replaced the previous shared `commerce-order-page` preview repeated across all five examples.
- Added five dedicated page-level order history renderers with distinct layouts:
  - `Simple`: product image grid that becomes a long mobile product history list.
  - `With invoice list and quick actions`: dark store nav plus grouped orders with right-side actions.
  - `With invoice panels`: invoice metadata panels plus product lines.
  - `With invoice tables`: desktop table layout plus summary cards.
  - `With invoice list`: compact invoice stream with metadata and product rows.
- Added a dedicated asset folder: `examples/ui-vocabulary-site/public/assets/ecommerce-order-history-pages/`.
- Generated fresh images for this leaf instead of reusing component-level `ecommerce-order-history` assets.

## Workflow Notes

- Port `5173` was serving `C:\Users\yusun\projects\development-dictionary`, not this repo. Use `http://127.0.0.1:5178` for this run's `ui-dictionary` dev server captures.
- Chrome extension screenshots were used for Tailwind/local desktop. Chrome headless viewport screenshots were used for mobile 390 evidence because native CDP full-page capture stalled in the local Node WebSocket path.
- Keep the mobile comparison rule: capture Tailwind mobile and local mobile for every leaf, even when the desktop frame looks close.

## Verification

- `npm run build` passed.
- `npm run audit:visuals` passed: 527 terms, 527 variants, 0 generic renderer variants, 0 shared variants.
- `npm run lint` passed with only pre-existing fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- `python scripts\validate-ui-vocabulary.py` passed.
- Chrome smoke saved: `docs/research/assets/ecommerce-order-history-pages-hero-level-rework-2026-07-02/local-chrome-smoke.json`.
