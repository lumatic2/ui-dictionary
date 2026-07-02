# Feeds Hero-Level Rework - 2026-07-01

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/lists/feeds`
- Local route: `/?filter=nav%3Aplus-application-lists-feeds`
- Goal: replace one generic `list-page` preview with 3 dedicated Feeds variants based on fresh Tailwind desktop/mobile/full-page captures.

## Reference Evidence

- Chrome viewport capture: `docs/research/assets/lists-feeds-hero-level-rework-2026-07-01/tailwind-feeds-chrome-viewport.png`
- Tailwind desktop: `docs/research/assets/lists-feeds-hero-level-rework-2026-07-01/tailwind-feeds-desktop.png`
- Tailwind mobile: `docs/research/assets/lists-feeds-hero-level-rework-2026-07-01/tailwind-feeds-mobile.png`
- Tailwind full desktop: `docs/research/assets/lists-feeds-hero-level-rework-2026-07-01/tailwind-feeds-full-desktop.png`
- Tailwind full crops: `tailwind-feeds-full-part1.png` and `tailwind-feeds-full-part2.png`
- Local before desktop: `docs/research/assets/lists-feeds-hero-level-rework-2026-07-01/local-feeds-before-desktop.png`
- Local after desktop: `docs/research/assets/lists-feeds-hero-level-rework-2026-07-01/local-feeds-desktop.png`
- Local after mobile: `docs/research/assets/lists-feeds-hero-level-rework-2026-07-01/local-feeds-mobile.png`
- Local full desktop: `docs/research/assets/lists-feeds-hero-level-rework-2026-07-01/local-feeds-full-desktop.png`

## Implementation Notes

- Added 3 `feed-list-*` preview variants in `examples/ui-vocabulary-site/src/App.tsx`.
- Mapped every Tailwind Feeds example title to a distinct local preview variant.
- Kept generic `list-page` for older shared surfaces, but removed it from this leaf.
- Implemented separate structures for:
  - simple application timeline with icon markers and right-aligned dates
  - dark invoice activity feed with comments, avatars, and comment composer
  - mixed item type feed with comments, assigned events, tags, avatar markers, and timeline rail

## Image Assets

Generated fresh avatar assets for this leaf with built-in `image_gen`; originals remain under `C:\Users\yusun\.codex\generated_images\019f1a9a-1c5f-7a40-81e5-606a8918e471`.

Project assets:

- `examples/ui-vocabulary-site/public/assets/feeds/chelsea-hagon.png`
- `examples/ui-vocabulary-site/public/assets/feeds/alex-curren.png`
- `examples/ui-vocabulary-site/public/assets/feeds/eduardo-benz.png`
- `examples/ui-vocabulary-site/public/assets/feeds/jason-meyers.png`

Rule carried forward: Feeds does not reuse avatar assets from Stacked Lists, Tables, or Grid Lists. Within this leaf, generated avatars repeat only where the reference itself repeats the same actors in the feed.

## Verification

- Chrome reference capture confirmed all 3 Tailwind example names on the live page.
- `npm run build` in `examples/ui-vocabulary-site`: pass. Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: pass, 527 terms.
- `npm run lint` in `examples/ui-vocabulary-site`: pass with existing shadcn fast-refresh warnings in `badge.tsx`, `tabs.tsx`, `button.tsx`.
- `npm run audit:visuals` in `examples/ui-vocabulary-site`: pass, 527 terms/variants, generic renderer variants 0, shared variants 0.
- Chrome extension smoke on local route:
  - found all 3 Feeds titles.
  - `/assets/feeds/*` images loaded with `complete: true`, natural size 256 x 256.
  - horizontal overflow: false.
