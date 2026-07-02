# Newsletter Sections hero-level rework - 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/newsletter-sections`
- Local route: `/?filter=nav%3Aplus-marketing-newsletter-sections`
- Target leaf: Marketing / Page Sections / Newsletter Sections
- Reference inventory: 6 examples

## Reference Capture

Captured the Tailwind page visually before implementation:

- Desktop long capture: `docs/research/assets/newsletter-sections-hero-level-rework-2026-07-02/tailwind-newsletter-sections-desktop.png`
- Mobile 390 capture: `docs/research/assets/newsletter-sections-hero-level-rework-2026-07-02/tailwind-newsletter-sections-mobile-390.png`
- Reference metadata: `docs/research/assets/newsletter-sections-hero-level-rework-2026-07-02/tailwind-newsletter-sections-reference.json`

Tailwind visible example headings:

1. Side-by-side with details
2. Simple side-by-side
3. Simple side-by-side on brand
4. Simple stacked
5. Centered card
6. Side-by-side on card

## Local Rework

Updated `examples/ui-vocabulary-site/src/App.tsx` so Newsletter Sections no longer use a shallow generic form block. The renderer now follows the captured Tailwind shapes:

- Dark gradient side-by-side section with two detail columns and a newsletter form.
- White side-by-side section with left headline and right email form.
- Indigo brand side-by-side section.
- White stacked section with a lower form row.
- Dark centered card with shadow, launch copy, and notify form.
- Dark side-by-side card with left headline and right notify form.

Mobile-specific headline sizing and line breaks were added so text does not visually clip inside the preview frame.

## Imagegen Decision

No imagegen asset was generated for this leaf. The Tailwind reference previews are form/surface compositions only; they do not contain photos, app screenshots, product shots, background images, or illustrations. Adding generated imagery here would reduce reference parity.

This is the repeatable rule:

- If a Tailwind preview is image-backed, generate a fresh purpose-fit asset for that individual preview and record provenance.
- If a Tailwind preview is control-only, form-only, table-only, or text/surface-only, do not add decorative images. Record that no imagegen asset was needed.

## Local Evidence

- Before desktop: `docs/research/assets/newsletter-sections-hero-level-rework-2026-07-02/local-newsletter-sections-before-desktop.png`
- Before mobile 390: `docs/research/assets/newsletter-sections-hero-level-rework-2026-07-02/local-newsletter-sections-before-mobile-390.png`
- After desktop: `docs/research/assets/newsletter-sections-hero-level-rework-2026-07-02/local-newsletter-sections-after-desktop.png`
- After mobile 390: `docs/research/assets/newsletter-sections-hero-level-rework-2026-07-02/local-newsletter-sections-after-mobile-390.png`
- Chrome extension smoke: `docs/research/assets/newsletter-sections-hero-level-rework-2026-07-02/local-chrome-smoke.json`
- Desktop smoke: `docs/research/assets/newsletter-sections-hero-level-rework-2026-07-02/local-desktop-smoke.json`
- Mobile 390 smoke: `docs/research/assets/newsletter-sections-hero-level-rework-2026-07-02/local-mobile-smoke.json`

Smoke checks confirmed:

- Local page exposes the 6 Tailwind Newsletter example headings.
- Newsletter image source list is empty, matching the reference's non-image-backed pattern.
- Desktop horizontal overflow is `false`.
- Mobile 390 horizontal overflow is `false`.

## Verification

- `cd examples/ui-vocabulary-site; npm run build`
- `cd examples/ui-vocabulary-site; npm run audit:visuals`
- `cd examples/ui-vocabulary-site; npm run lint`
- `python scripts\validate-ui-vocabulary.py`
- Chrome extension smoke on `http://127.0.0.1:5178/?filter=nav%3Aplus-marketing-newsletter-sections`
- Headless desktop and mobile 390 after captures

Result: all commands passed. `npm run lint` still reports the pre-existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
