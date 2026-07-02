# Header Sections hero-level rework - 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/header`
- Local route: `/?filter=nav%3Aplus-marketing-header-sections`
- Target leaf: Marketing / Page Sections / Header Sections
- Reference inventory: 8 examples

## Reference Capture

Captured the Tailwind page visually before implementation:

- Desktop viewport: `docs/research/assets/header-sections-hero-level-rework-2026-07-02/tailwind-header-sections-desktop-viewport.png`
- Desktop long capture: `docs/research/assets/header-sections-hero-level-rework-2026-07-02/tailwind-header-sections-desktop.png`
- Mobile 390 capture: `docs/research/assets/header-sections-hero-level-rework-2026-07-02/tailwind-header-sections-mobile-390.png`
- Reference metadata: `docs/research/assets/header-sections-hero-level-rework-2026-07-02/tailwind-header-sections-reference.json`

Tailwind visible example headings:

1. With stats
2. Centered
3. Centered with eyebrow
4. With cards
5. Simple
6. Simple with eyebrow
7. Simple with background image
8. Centered with background image

## Local Rework

Updated `examples/ui-vocabulary-site/src/App.tsx` so Header Sections no longer use the generic navigation-card placeholder. The renderer now follows the captured Tailwind shapes:

- Dark hiring header with background image, action links, and a stat row.
- White centered and eyebrow support-center headers with large vertical rhythm.
- Dark support-center header with three translucent cards.
- White simple and simple-eyebrow headers.
- Left-aligned and centered dark background-image headers.

Fresh project assets were added under `examples/ui-vocabulary-site/public/assets/header-sections/`:

- `with-stats-bg-v2.png`
- `with-cards-bg-v2.png`
- `simple-bg-image-v2.png`
- `centered-bg-image-v2.png`

Asset generation provenance is recorded in `docs/research/assets/header-sections-hero-level-rework-2026-07-02/header-sections-imagegen-provenance.md`.

## Local Evidence

- Before desktop: `docs/research/assets/header-sections-hero-level-rework-2026-07-02/local-header-sections-before-desktop.png`
- Before mobile 390: `docs/research/assets/header-sections-hero-level-rework-2026-07-02/local-header-sections-before-mobile-390.png`
- After desktop viewport: `docs/research/assets/header-sections-hero-level-rework-2026-07-02/local-header-sections-after-desktop-viewport.png`
- After desktop long capture: `docs/research/assets/header-sections-hero-level-rework-2026-07-02/local-header-sections-after-desktop.png`
- After mobile 390: `docs/research/assets/header-sections-hero-level-rework-2026-07-02/local-header-sections-after-mobile-390.png`
- Chrome extension smoke: `docs/research/assets/header-sections-hero-level-rework-2026-07-02/local-chrome-smoke.json`
- Desktop smoke: `docs/research/assets/header-sections-hero-level-rework-2026-07-02/local-desktop-smoke.json`
- Mobile 390 smoke: `docs/research/assets/header-sections-hero-level-rework-2026-07-02/local-mobile-smoke.json`

Smoke checks confirmed:

- Local page exposes the 8 Tailwind Header example headings.
- Header image sources use the four `*-v2.png` assets.
- Desktop horizontal overflow is `false`.
- Mobile 390 horizontal overflow is `false`.

## Repeatable Rule

For image-bearing previews, generate a fresh image that matches that preview's role. Do not reuse a background, product shot, app screenshot, or photo from another preview or leaf, even when the subject is similar. Each accepted image must be copied into the leaf asset directory with a versioned filename and recorded in a provenance file.

For text-only, form-only, table-only, or control-only previews, do not add decorative image assets just to satisfy the rule. Document that no imagegen asset was needed.

## Verification

- `cd examples/ui-vocabulary-site; npm run build`
- `cd examples/ui-vocabulary-site; npm run audit:visuals`
- `cd examples/ui-vocabulary-site; npm run lint`
- `python scripts\validate-ui-vocabulary.py`
- Chrome extension smoke on `http://127.0.0.1:5178/?filter=nav%3Aplus-marketing-header-sections`
- Headless desktop and mobile 390 after captures

Result: all commands passed. `npm run lint` still reports the pre-existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
