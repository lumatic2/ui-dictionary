# Stats hero-level rework - 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/stats-sections`
- Local route: `/?filter=nav%3Aplus-marketing-stats`
- Target leaf: Marketing / Page Sections / Stats
- Reference inventory: 8 examples

## Reference Capture

Captured the Tailwind page visually before implementation:

- Desktop long capture: `docs/research/assets/stats-hero-level-rework-2026-07-02/tailwind-stats-desktop.png`
- Mobile 390 capture: `docs/research/assets/stats-hero-level-rework-2026-07-02/tailwind-stats-mobile-390.png`
- Reference metadata: `docs/research/assets/stats-hero-level-rework-2026-07-02/tailwind-stats-reference.json`

Tailwind visible example headings:

1. Simple
2. Simple grid
3. With background image
4. Split with image
5. Timeline
6. Stepped
7. With two column description
8. With description

## Local Rework

Updated `examples/ui-vocabulary-site/src/App.tsx` so Stats no longer repeats one generic four-card metric block. The renderer now follows the captured Tailwind shapes:

- Simple three-stat row.
- Centered intro plus subtle four-stat grid.
- Dark background-image panel with overlaid copy and metrics.
- Split image plus right-side copy and metrics.
- Four-column timeline.
- Stepped staggered metric cards.
- Dark two-column description plus metrics.
- White description plus metrics.

Fresh project assets were added under `examples/ui-vocabulary-site/public/assets/stats-sections/`:

- `background-team-v2.png`
- `split-team-v2.png`

Asset generation provenance is recorded in `docs/research/assets/stats-hero-level-rework-2026-07-02/stats-imagegen-provenance.md`.

## Local Evidence

- Before desktop: `docs/research/assets/stats-hero-level-rework-2026-07-02/local-stats-before-desktop.png`
- Before mobile 390: `docs/research/assets/stats-hero-level-rework-2026-07-02/local-stats-before-mobile-390.png`
- After desktop: `docs/research/assets/stats-hero-level-rework-2026-07-02/local-stats-after-desktop.png`
- After mobile 390: `docs/research/assets/stats-hero-level-rework-2026-07-02/local-stats-after-mobile-390.png`
- Chrome extension smoke: `docs/research/assets/stats-hero-level-rework-2026-07-02/local-chrome-smoke.json`
- Desktop smoke: `docs/research/assets/stats-hero-level-rework-2026-07-02/local-desktop-smoke.json`
- Mobile 390 smoke: `docs/research/assets/stats-hero-level-rework-2026-07-02/local-mobile-smoke.json`

Smoke checks confirmed:

- Local page exposes the 8 Tailwind Stats example headings.
- Stats image sources use the two `*-v2.png` assets.
- Desktop horizontal overflow is `false`.
- Mobile 390 horizontal overflow is `false`.

## Repeatable Rule

Only image-backed Stats previews received generated assets. Text-only metric, timeline, stepped, and description previews were implemented in code rather than decorated with extra imagery. This keeps the fresh-image rule tied to actual Tailwind reference usage instead of adding non-reference assets.

## Verification

- `cd examples/ui-vocabulary-site; npm run build`
- `cd examples/ui-vocabulary-site; npm run audit:visuals`
- `cd examples/ui-vocabulary-site; npm run lint`
- `python scripts\validate-ui-vocabulary.py`
- Chrome extension smoke on `http://127.0.0.1:5178/?filter=nav%3Aplus-marketing-stats`
- Headless desktop and mobile 390 after captures

Result: all commands passed. `npm run lint` still reports the pre-existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
