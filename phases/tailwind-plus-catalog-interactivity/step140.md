# Step 140 - CTA Sections page parity pass

Status: completed
Started: 2026-07-04T15:56:00+09:00
Completed: 2026-07-04T16:01:00+09:00

## Scope

- Local `plus-marketing-cta-sections` leaf and its 11 CTA section preview variants.
- Tailwind Plus Marketing / Page Sections / CTA Sections reference page.

## Reference

- Canonical reference URL: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/cta-sections`
- Alternate URL `https://tailwindcss.com/plus/ui-blocks/marketing/sections/ctas` returned 404.
- Tailwind reference exposed 11 examples:
  - `Dark panel with app screenshot`
  - `Simple stacked`
  - `Centered on dark panel`
  - `Simple centered`
  - `Simple centered with gradient`
  - `Simple centered on brand`
  - `Simple justified`
  - `Simple justified on subtle brand`
  - `Split with image`
  - `Two columns with photo`
  - `With image tiles`

## Implementation

- Kept the local CTA Sections page aligned to the 11 Tailwind example names.
- Added explicit `data-cta-section-theme` and `data-cta-section-variant` markers to every CTA preview root.
- Made CTA surfaces respond to the preview theme toggle, including dark/light versions of dark panel, brand, gradient, subtle-brand, image, and justified variants.
- Added stable accessible labels, `aria-pressed` selected state, hover/press motion, and visible feedback to primary and secondary CTA actions.

## Verification

- Captures and smoke data saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/cta-sections/`:
  - `tailwind-cta-sections-reference.png`
  - `local-cta-sections-desktop-before.png`
  - `local-cta-sections-desktop-after.png`
  - `local-cta-sections-all-dark-after.png`
  - `local-cta-sections-mobile-after.png`
  - `capture-notes-before.json`
  - `chrome-smoke-after.json`
  - `mobile-smoke-after.json`
- Chrome extension desktop smoke verified:
  - page title `CTA Sections`.
  - 11 example headings matching the Tailwind reference.
  - 117 rendered buttons.
  - 11 primary CTA action buttons.
  - 11 secondary CTA detail buttons.
  - 11 `data-cta-section-theme` roots.
  - primary and secondary CTA actions produced visible feedback.
  - selected secondary action exposed `aria-pressed=true`.
  - all 11 Dark controls set all 11 CTA roots to `data-cta-section-theme="dark"`.
  - all 11 Light controls set all 11 CTA roots to `data-cta-section-theme="light"`.
  - empty Chrome console errors.
  - desktop horizontal overflow returned 0.
- Mobile 390px smoke verified:
  - 11 visible Dark controls.
  - 11 primary and 11 secondary CTA action buttons.
  - primary and secondary CTA actions produced feedback.
  - all 11 Dark controls set all 11 CTA roots to `data-cta-section-theme="dark"`.
  - mobile horizontal overflow returned 0.
  - no console or page errors.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
