# Banners hero-level rework - 2026-07-02

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/marketing/elements/banners`
- Local route: `/?filter=nav%3Aplus-marketing-banners`
- Goal: upgrade the existing match-count implementation to the Hero Sections quality bar using fresh desktop and 390px mobile captures.

## Reference evidence

- Tailwind desktop: `docs/research/assets/banners-hero-level-rework-2026-07-02/tailwind-banners-desktop.png`
- Tailwind mobile 390: `docs/research/assets/banners-hero-level-rework-2026-07-02/tailwind-banners-mobile-390.png`
- Reference metadata: `docs/research/assets/banners-hero-level-rework-2026-07-02/tailwind-banners-reference.json`

The live Tailwind page exposes 13 public examples:

1. With button
2. On dark
3. On brand
4. With background glow
5. With link
6. Left-aligned
7. Bottom aligned
8. Floating at bottom
9. Floating at bottom centered
10. Privacy notice right-aligned
11. Privacy notice centered
12. Privacy notice left-aligned
13. Privacy notice full width

## Implementation notes

- Replaced the shallow shared banner card with variant-specific banner canvases.
- Matched reference height rhythm: announcement banners use short 256px-style canvases, privacy notices use taller 400px-style canvases.
- Added dedicated dark, brand, background glow, link-only, left-aligned, bottom-aligned, floating bottom, centered floating, and privacy notice alignments.
- Added mobile wrapping behavior so each banner remains readable at 390px without horizontal overflow.

## Images

No imagegen asset was generated for this leaf. The Tailwind reference contains zero preview images, and all visual structure is banner layout, color, spacing, and alignment.

## Local evidence

- Before desktop: `docs/research/assets/banners-hero-level-rework-2026-07-02/local-banners-before-desktop.png`
- Before mobile 390: `docs/research/assets/banners-hero-level-rework-2026-07-02/local-banners-before-mobile-390.png`
- After desktop: `docs/research/assets/banners-hero-level-rework-2026-07-02/local-banners-after-desktop.png`
- After mobile 390: `docs/research/assets/banners-hero-level-rework-2026-07-02/local-banners-after-mobile-390.png`
- Chrome/CDP smoke: `docs/research/assets/banners-hero-level-rework-2026-07-02/local-banners-chrome-smoke.json`

## Verification

- `npm run build`
- `npm run lint`
- `npm run audit:visuals`
- `python scripts\validate-ui-vocabulary.py`
- Chrome/CDP route smoke found all 13 Banner example names, zero image assets, no missing examples, and no desktop or 390px mobile horizontal overflow.

Known lint output remains the pre-existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
