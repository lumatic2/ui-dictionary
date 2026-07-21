# Pagination Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/navigation/pagination`
- Local route: `/?filter=nav%3Aplus-navigation-pagination`
- Goal: replace one generic `pagination-page` preview with 3 dedicated Pagination variants based on fresh Tailwind desktop/mobile/full-page captures.

## Reference Evidence

- Chrome viewport capture: `docs/research/assets/navigation-pagination-hero-level-rework-2026-07-01/tailwind-pagination-chrome-viewport.png`
- Tailwind desktop: `docs/research/assets/navigation-pagination-hero-level-rework-2026-07-01/tailwind-pagination-desktop.png`
- Tailwind mobile: `docs/research/assets/navigation-pagination-hero-level-rework-2026-07-01/tailwind-pagination-mobile.png`
- Tailwind full desktop: `docs/research/assets/navigation-pagination-hero-level-rework-2026-07-01/tailwind-pagination-full-desktop.png`
- Local before desktop: `docs/research/assets/navigation-pagination-hero-level-rework-2026-07-01/local-pagination-before-desktop.png`
- Local after desktop: `docs/research/assets/navigation-pagination-hero-level-rework-2026-07-01/local-pagination-desktop.png`
- Local after mobile: `docs/research/assets/navigation-pagination-hero-level-rework-2026-07-01/local-pagination-mobile.png`
- Local full desktop: `docs/research/assets/navigation-pagination-hero-level-rework-2026-07-01/local-pagination-full-desktop.png`

## Implementation Notes

- Added 3 `pagination-*` preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every current Tailwind Pagination example title to a distinct local preview variant.
- Kept generic `pagination-page` for older shared surfaces, but removed it from this leaf route.
- Implemented separate structures for:
  - card footer with page buttons
  - centered page numbers on a dark surface
  - simple card footer
- Mobile pagination switches from full page numbers to `Previous` / `Next`, matching the Tailwind mobile reference behavior.

## Image Assets

No imagegen asset was needed for this leaf. The Tailwind reference is control-only: job-list rows, page buttons, page numbers, and footer surfaces.

Rule carried forward: future image-backed previews must generate a fresh purpose-fit imagegen asset per individual preview. Do not reuse imagery from another preview or leaf. Control-only references should document that imagegen was not needed instead of adding decorative images.

## Verification

- Chrome reference capture confirmed the current Tailwind example names on the live page:
  - `Card footer with page buttons`
  - `Centered page numbers`
  - `Simple card footer`
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `tabs.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- Chrome extension smoke on local route:
  - found all 3 Pagination titles.
  - horizontal overflow: false.
  - rendered width 2545, scroll width 2545, scroll height 1669.
