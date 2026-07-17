# Shopping Carts Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/shopping-carts`
- Local route: `/?filter=nav%3Aplus-ecommerce-shopping-carts`
- Goal: replace the shared generic `commerce-cart-page` preview with six Shopping Carts variants based on fresh Tailwind captures and preview-specific generated cart item imagery.

## Reference Evidence

- Tailwind Chrome viewport: `docs/research/assets/ecommerce-shopping-carts-hero-level-rework-2026-07-01/tailwind-shopping-carts-chrome-viewport.png`
- Tailwind full desktop: `docs/research/assets/ecommerce-shopping-carts-hero-level-rework-2026-07-01/tailwind-shopping-carts-full-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/ecommerce-shopping-carts-hero-level-rework-2026-07-01/tailwind-shopping-carts-mobile-390.png`
- Local desktop: `docs/research/assets/ecommerce-shopping-carts-hero-level-rework-2026-07-01/local-shopping-carts-desktop.png`
- Local mobile 390px: `docs/research/assets/ecommerce-shopping-carts-hero-level-rework-2026-07-01/local-shopping-carts-mobile-390.png`

## Tailwind Examples

- `Drawer`
- `Two column with quantity dropdown`
- `Single column`
- `With extended summary`
- `Dialog`
- `Popover`

## Implementation Notes

- Added six dedicated Shopping Carts variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every Shopping Carts example title to its own preview variant.
- Kept the older `commerce-cart-page` renderer for unrelated legacy routes, but removed it from this leaf.
- Desktop previews now cover drawer, two-column cart with order summary, single-column cart, extended summary, dialog, and popover compositions.
- Mobile previews use narrower cart surfaces and compact item rows to avoid right-edge clipping.

## Image Assets

Each preview received a fresh purpose-fit imagegen asset. These assets are not reused from another leaf.

- `examples/ui-vocabulary-site/public/assets/ecommerce-shopping-carts/drawer-backpack.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-shopping-carts/two-column-sling-bag.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-shopping-carts/single-column-duffel.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-shopping-carts/extended-summary-tote.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-shopping-carts/dialog-tech-pouch.png`
- `examples/ui-vocabulary-site/public/assets/ecommerce-shopping-carts/popover-pencil-case.png`

Provenance: `docs/research/assets/ecommerce-shopping-carts-hero-level-rework-2026-07-01/shopping-carts-imagegen-provenance.md`

Note: repeated cart rows inside a single preview may reuse that preview's own generated product image to preserve cart rhythm. The rule remains one fresh generated asset per preview, not one generated asset per repeated cart row.

## Verification

- Chrome reference inspection confirmed the current Tailwind page title and six visible example names.
- Chrome local route smoke:
  - found all six Shopping Carts titles.
  - loaded 11 local cart item images from six preview-specific asset files.
  - unique local Shopping Carts asset count: 6.
  - desktop horizontal overflow: false.
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `tabs.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- `git diff --check` for touched files: pass with only the existing `App.tsx` LF to CRLF warning.

