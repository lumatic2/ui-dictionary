# Textareas Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/textareas`
- Local route: `/?filter=nav%3Aplus-forms-textareas`
- Goal: replace one generic `textarea-page` preview with 5 dedicated Textareas variants based on fresh Tailwind desktop/mobile/full-page captures.

## Reference Evidence

- Chrome viewport capture: `docs/research/assets/forms-textareas-hero-level-rework-2026-07-01/tailwind-textareas-chrome-viewport.png`
- Tailwind desktop: `docs/research/assets/forms-textareas-hero-level-rework-2026-07-01/tailwind-textareas-desktop.png`
- Tailwind mobile: `docs/research/assets/forms-textareas-hero-level-rework-2026-07-01/tailwind-textareas-mobile.png`
- Tailwind full desktop: `docs/research/assets/forms-textareas-hero-level-rework-2026-07-01/tailwind-textareas-full-desktop.png`
- Tailwind full crops: `tailwind-textareas-full-part1.png` through `tailwind-textareas-full-part3.png`
- Local before desktop: `docs/research/assets/forms-textareas-hero-level-rework-2026-07-01/local-textareas-before-desktop.png`
- Local after desktop: `docs/research/assets/forms-textareas-hero-level-rework-2026-07-01/local-textareas-desktop.png`
- Local after mobile: `docs/research/assets/forms-textareas-hero-level-rework-2026-07-01/local-textareas-mobile.png`
- Local full desktop: `docs/research/assets/forms-textareas-hero-level-rework-2026-07-01/local-textareas-full-desktop.png`

## Implementation Notes

- Added 5 `textarea-*` preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every current Tailwind Textareas example title to a distinct local preview variant.
- Kept generic `textarea-page` for older shared surfaces, but removed it from this leaf route.
- Implemented separate structures for:
  - simple labeled textarea
  - avatar comment composer with bordered action footer
  - underline-style composer with action row
  - dark title/description composer with pill actions
  - write/preview tab composer

## Image Assets

Generated a fresh comment avatar asset for the avatar composer previews with built-in `image_gen`.

Project asset:

- `examples/ui-vocabulary-site/public/assets/textareas/comment-avatar.png`

Source/provenance:

- `docs/research/assets/forms-textareas-hero-level-rework-2026-07-01/comment-avatar-provenance.md`

Rule carried forward: this avatar is specific to the Textareas composer previews. Future image-backed previews should generate their own purpose-fit imagery rather than reusing this asset.

## Verification

- Chrome reference capture confirmed all 5 current Tailwind example names on the live page.
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `button.tsx`, `tabs.tsx`, `badge.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- Chrome extension smoke on local route:
  - found all 5 Textareas titles.
  - confirmed `/assets/textareas/comment-avatar.png` loaded at 256 x 256.
  - horizontal overflow: false.
