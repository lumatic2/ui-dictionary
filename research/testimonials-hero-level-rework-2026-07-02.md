# Testimonials hero-level rework - 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/testimonials`
- Local route: `/?filter=nav%3Aplus-marketing-testimonials`
- Target leaf: Marketing / Page Sections / Testimonials
- Reference inventory: 8 examples

## Reference Capture

Captured the Tailwind page visually before implementation:

- Desktop long capture: `docs/research/assets/testimonials-hero-level-rework-2026-07-02/tailwind-testimonials-desktop.png`
- Mobile 390 capture: `docs/research/assets/testimonials-hero-level-rework-2026-07-02/tailwind-testimonials-mobile-390.png`
- Reference metadata: `docs/research/assets/testimonials-hero-level-rework-2026-07-02/tailwind-testimonials-reference.json`

Tailwind visible example headings:

1. Simple centered
2. With large avatar
3. With overlapping image
4. With background image
5. Side-by-side
6. With star rating
7. Grid
8. Subtle grid

## Local Rework

Updated `examples/ui-vocabulary-site/src/App.tsx` so Testimonials no longer use one generic quote-card grid. The renderer now follows the captured Tailwind shapes:

- Simple centered testimonial with small avatar.
- Dark panel with large portrait avatar.
- Overlapping portrait image and dark quote panel.
- Background-image quote card.
- Side-by-side dual testimonial columns.
- Star-rating testimonial.
- Dark testimonial grid.
- Subtle light testimonial grid.

Fresh project assets were added under `examples/ui-vocabulary-site/public/assets/testimonials/`:

- `simple-avatar-v2.png`
- `large-avatar-v2.png`
- `overlap-portrait-v2.png`
- `background-portrait-v2.png`
- `side-avatar-v2.png`
- `star-avatar-v2.png`
- `grid-avatar-v2.png`

Asset generation provenance is recorded in `docs/research/assets/testimonials-hero-level-rework-2026-07-02/testimonials-imagegen-provenance.md`.

## Local Evidence

- Before desktop: `docs/research/assets/testimonials-hero-level-rework-2026-07-02/local-testimonials-before-desktop.png`
- Before mobile 390: `docs/research/assets/testimonials-hero-level-rework-2026-07-02/local-testimonials-before-mobile-390.png`
- After desktop: `docs/research/assets/testimonials-hero-level-rework-2026-07-02/local-testimonials-after-desktop.png`
- After mobile 390: `docs/research/assets/testimonials-hero-level-rework-2026-07-02/local-testimonials-after-mobile-390.png`
- Chrome extension smoke: `docs/research/assets/testimonials-hero-level-rework-2026-07-02/local-chrome-smoke.json`
- Desktop smoke: `docs/research/assets/testimonials-hero-level-rework-2026-07-02/local-desktop-smoke.json`
- Mobile 390 smoke: `docs/research/assets/testimonials-hero-level-rework-2026-07-02/local-mobile-smoke.json`

Smoke checks confirmed:

- Local page exposes the 8 Tailwind Testimonials example headings.
- Local page loads 7 Testimonials-specific v2 image assets.
- Desktop horizontal overflow is `false`.
- Mobile 390 horizontal overflow is `false`.

## Repeatable Rule

Testimonials is an image-heavy leaf. Each image-backed preview gets a purpose-fit local asset instead of reusing a previous leaf asset. When a preview only needs repeated small avatars inside the same grid, use a grid-specific asset rather than borrowing a large-avatar or background-image asset from another preview.

## Verification

- `cd examples/ui-vocabulary-site; npm run build`
- `cd examples/ui-vocabulary-site; npm run audit:visuals`
- `cd examples/ui-vocabulary-site; npm run lint`
- `python scripts\validate-ui-vocabulary.py`
- Chrome extension smoke on `http://127.0.0.1:5178/?filter=nav%3Aplus-marketing-testimonials`
- Headless desktop and mobile 390 after captures

Result: all commands passed. `npm run lint` still reports the pre-existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
