# CTA Sections hero-level rework - 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/cta-sections`
- Local route: `/?filter=nav%3Aplus-marketing-cta-sections`
- Target leaf: Marketing / Page Sections / CTA Sections
- Reference inventory: 11 examples

## Reference Capture

Captured the Tailwind page visually before implementation:

- Desktop viewport: `docs/research/assets/cta-sections-hero-level-rework-2026-07-02/tailwind-cta-sections-desktop-viewport.png`
- Desktop long capture: `docs/research/assets/cta-sections-hero-level-rework-2026-07-02/tailwind-cta-sections-desktop.png`
- Mobile 390 capture: `docs/research/assets/cta-sections-hero-level-rework-2026-07-02/tailwind-cta-sections-mobile-390.png`

Tailwind visible example headings:

1. Dark panel with app screenshot
2. Simple stacked
3. Centered on dark panel
4. Simple centered
5. Simple centered with gradient
6. Simple centered on brand
7. Simple justified
8. Simple justified on subtle brand
9. Split with image
10. Two columns with photo
11. With image tiles

## Local Rework

Updated `examples/ui-vocabulary-site/src/App.tsx` so CTA variants no longer share one generic copy block. The renderer now uses variant-specific copy, surface color, controlled headline line breaks, and v2 image assets.

Fresh project assets were added under `examples/ui-vocabulary-site/public/assets/cta-sections/`:

- `dark-app-screenshot-v2.png`
- `split-workspace-image-v2.png`
- `two-column-photo-v2.png`
- `image-tiles-collage-v2.png`

Asset generation provenance is recorded in `docs/research/assets/cta-sections-hero-level-rework-2026-07-02/cta-sections-imagegen-provenance.md`.

## Local Evidence

- Before desktop: `docs/research/assets/cta-sections-hero-level-rework-2026-07-02/local-cta-sections-before-desktop.png`
- Before mobile 390: `docs/research/assets/cta-sections-hero-level-rework-2026-07-02/local-cta-sections-before-mobile-390.png`
- After desktop viewport: `docs/research/assets/cta-sections-hero-level-rework-2026-07-02/local-cta-sections-after-desktop-viewport.png`
- After desktop long capture: `docs/research/assets/cta-sections-hero-level-rework-2026-07-02/local-cta-sections-after-desktop.png`
- After mobile 390: `docs/research/assets/cta-sections-hero-level-rework-2026-07-02/local-cta-sections-after-mobile-390.png`
- Chrome smoke: `docs/research/assets/cta-sections-hero-level-rework-2026-07-02/local-chrome-smoke.json`

Chrome smoke confirmed:

- CTA image sources use the four `*-v2.png` assets.
- Local page exposes the 11 Tailwind CTA example headings.
- Horizontal overflow is `false`.

## Repeatable Rule

For image-bearing previews, do not reuse a generic page image across unrelated previews. Capture the Tailwind reference first, identify what each preview image is doing, generate a fresh matching asset per preview, copy it into the leaf asset directory with a versioned filename, and document prompt/source/path provenance.

## Verification

- `cd examples/ui-vocabulary-site; npm run build`
- `cd examples/ui-vocabulary-site; npm run audit:visuals`
- `cd examples/ui-vocabulary-site; npm run lint`
- `python scripts\validate-ui-vocabulary.py`
- Chrome extension smoke on `http://127.0.0.1:5178/?filter=nav%3Aplus-marketing-cta-sections`
- Headless Chrome desktop and mobile 390 after captures

Result: all commands passed. `npm run lint` still reports the pre-existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
