# Bento Grids hero-level rework - 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/bento-grids`
- Local route: `/?filter=nav%3Aplus-marketing-bento-grids`
- Target leaf: Marketing / Page Sections / Bento Grids
- Reference inventory: 3 examples

## Reference Capture

Captured the Tailwind page visually before implementation:

- Desktop viewport: `docs/research/assets/bento-grids-hero-level-rework-2026-07-02/tailwind-bento-grids-desktop-viewport.png`
- Desktop long capture: `docs/research/assets/bento-grids-hero-level-rework-2026-07-02/tailwind-bento-grids-desktop.png`
- Mobile 390 capture: `docs/research/assets/bento-grids-hero-level-rework-2026-07-02/tailwind-bento-grids-mobile-390.png`
- Reference metadata: `docs/research/assets/bento-grids-hero-level-rework-2026-07-02/tailwind-bento-grids-reference.json`

Tailwind visible example headings:

1. Three column bento grid
2. Two row bento grid
3. Two row bento grid with three column second row

## Local Rework

Replaced the previous placeholder-like Bento previews with three dedicated Tailwind-shaped treatments:

- Three-column light Bento: centered heading, mobile-friendly product card, performance bars, security icon cluster, API code panel.
- Two-row dark Bento: dark deployment dashboard proof, integrations card, security card, and performance metrics card.
- Two-row with three-column second row: light analytics dashboard, activity feed, keyboard/speed card, integrations card, and network/CDN card.

Fresh project assets were added under `examples/ui-vocabulary-site/public/assets/bento-grids/`:

- `mobile-deployments-v2.png`
- `dark-deployment-dashboard-v2.png`
- `light-analytics-dashboard-v2.png`

Asset generation provenance is recorded in `docs/research/assets/bento-grids-hero-level-rework-2026-07-02/bento-grids-imagegen-provenance.md`.

## Local Evidence

- Before desktop: `docs/research/assets/bento-grids-hero-level-rework-2026-07-02/local-bento-grids-before-desktop.png`
- Before mobile 390: `docs/research/assets/bento-grids-hero-level-rework-2026-07-02/local-bento-grids-before-mobile-390.png`
- After desktop viewport: `docs/research/assets/bento-grids-hero-level-rework-2026-07-02/local-bento-grids-after-desktop-viewport.png`
- After desktop long capture: `docs/research/assets/bento-grids-hero-level-rework-2026-07-02/local-bento-grids-after-desktop.png`
- After mobile 390: `docs/research/assets/bento-grids-hero-level-rework-2026-07-02/local-bento-grids-after-mobile-390.png`
- Chrome desktop smoke: `docs/research/assets/bento-grids-hero-level-rework-2026-07-02/local-chrome-smoke.json`
- Mobile 390 smoke: `docs/research/assets/bento-grids-hero-level-rework-2026-07-02/local-mobile-smoke.json`

Smoke confirmed:

- Local page exposes the same 3 Bento example headings.
- Bento image sources use the three `*-v2.png` assets.
- Desktop and mobile horizontal overflow are `false`.

## Repeatable Rule

For Bento-style image/proof cards, capture the Tailwind card composition first, then decide whether a sub-card should be code-native or image-backed. Image-backed proof cards get fresh leaf-specific generated assets; code/API/icon/chart cards should be built in HTML/CSS when that gives tighter parity and avoids unnecessary raster reuse.

## Verification

- `cd examples/ui-vocabulary-site; npm run build`
- `cd examples/ui-vocabulary-site; npm run audit:visuals`
- `cd examples/ui-vocabulary-site; npm run lint`
- `python scripts\validate-ui-vocabulary.py`
- Chrome extension desktop smoke on `http://127.0.0.1:5178/?filter=nav%3Aplus-marketing-bento-grids`
- Headless mobile 390 overflow smoke
- Headless Chrome desktop and mobile after captures

Result: all commands passed. `npm run lint` still reports the pre-existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.

