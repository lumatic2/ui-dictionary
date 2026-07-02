# Form Layouts Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/form-layouts`
- Local route: `/?filter=nav%3Aplus-forms-form-layouts`
- Goal: replace one generic `form-layout-page` preview with 4 dedicated Form Layouts variants based on fresh Tailwind desktop/mobile/full-page captures.

## Reference Evidence

- Chrome viewport capture: `docs/research/assets/forms-form-layouts-hero-level-rework-2026-07-01/tailwind-form-layouts-chrome-viewport.png`
- Tailwind desktop: `docs/research/assets/forms-form-layouts-hero-level-rework-2026-07-01/tailwind-form-layouts-desktop.png`
- Tailwind mobile: `docs/research/assets/forms-form-layouts-hero-level-rework-2026-07-01/tailwind-form-layouts-mobile.png`
- Tailwind full desktop: `docs/research/assets/forms-form-layouts-hero-level-rework-2026-07-01/tailwind-form-layouts-full-desktop.png`
- Tailwind full crops: `tailwind-form-layouts-full-part1.png`, `tailwind-form-layouts-full-part2.png`, `tailwind-form-layouts-full-part3.png`, and `tailwind-form-layouts-full-part4.png`
- Local before desktop: `docs/research/assets/forms-form-layouts-hero-level-rework-2026-07-01/local-form-layouts-before-desktop.png`
- Local after desktop: `docs/research/assets/forms-form-layouts-hero-level-rework-2026-07-01/local-form-layouts-desktop.png`
- Local after mobile: `docs/research/assets/forms-form-layouts-hero-level-rework-2026-07-01/local-form-layouts-mobile.png`
- Local full desktop: `docs/research/assets/forms-form-layouts-hero-level-rework-2026-07-01/local-form-layouts-full-desktop.png`

## Implementation Notes

- Added 4 `form-layout-*` preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every Tailwind Form Layouts example title to a distinct local preview variant.
- Kept generic `form-layout-page` for older shared surfaces, but removed it from this leaf route.
- Implemented separate structures for:
  - stacked white profile/settings form with narrow centered field column
  - dark two-column layout with left section descriptions and right fields
  - light two-column layout with separate white cards and card footers
  - labels-on-left layout with row dividers and aligned controls

## Image Assets

No imagegen asset was needed for this leaf. The Tailwind reference is a control-only form layout with avatar/upload placeholders, not real photos, product imagery, screenshots, or illustrations.

Rule carried forward: when a future preview visibly needs imagery, generate a fresh purpose-fit imagegen asset for that individual preview. Do not reuse an image from another preview or leaf.

## Verification

- Chrome reference capture confirmed all 4 Tailwind example names on the live page.
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `tabs.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- Chrome extension smoke on local route:
  - found all 4 Form Layouts titles.
  - horizontal overflow: false.
