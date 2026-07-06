# Step 144 - Newsletter Sections page parity pass

Status: completed
Started: 2026-07-04T16:40:00+09:00
Completed: 2026-07-04T16:53:00+09:00

## Scope

- Local `plus-marketing-newsletter-sections` leaf and its 6 newsletter section preview variants.
- Tailwind Plus Marketing / Page Sections / Newsletter Sections reference page.

## Reference

- Canonical reference URL: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/newsletter-sections`
- Tailwind reference exposed 6 examples:
  - `Side-by-side with details`
  - `Simple side-by-side`
  - `Simple side-by-side on brand`
  - `Simple stacked`
  - `Centered card`
  - `Side-by-side on card`

## Implementation

- Kept the local Newsletter Sections page aligned to the 6 Tailwind example names.
- Added explicit `data-newsletter-section-theme` and `data-newsletter-section-variant` markers to every newsletter preview root.
- Replaced fake email-field buttons with real email inputs for all 6 examples.
- Fixed the input remount bug by keeping typing uncontrolled until submit, then persisting the submitted value so it survives preview theme changes.
- Added stable accessible labels, `aria-pressed` selected state, hover/press motion, focus rings, animated feedback, and light/dark surfaces for newsletter submit, privacy, and detail actions.
- Made all newsletter variants respond to preview Light/Dark theme controls, including details, brand, stacked, centered-card, and side-card variants.

## Verification

- Captures and smoke data saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/newsletter-sections/`:
  - `tailwind-newsletter-sections-reference-viewport.png`
  - `local-newsletter-sections-desktop-before-viewport.png`
  - `local-newsletter-sections-desktop-after-viewport.png`
  - `local-newsletter-sections-mobile-after.png`
  - `capture-notes-before.json`
  - `chrome-smoke-after.json`
  - `mobile-smoke-after.json`
- Chrome extension desktop smoke verified:
  - page title `Newsletter Sections`.
  - 6 example headings matching the Tailwind reference.
  - 6 `data-newsletter-section-theme` roots.
  - 6 real newsletter email inputs.
  - 14 newsletter action buttons.
  - typed `alex@example.com` persisted through submit, Dark, and Light preview-theme changes.
  - subscribe, detail, and privacy actions produced visible feedback.
  - all 6 Dark controls set all 6 Newsletter roots to `data-newsletter-section-theme="dark"`.
  - all 6 Light controls set all 6 Newsletter roots to `data-newsletter-section-theme="light"`.
  - empty Chrome console errors.
  - desktop horizontal overflow returned 0.
- Mobile 390px smoke verified:
  - 6 visible Dark controls.
  - 6 Newsletter roots, 6 inputs, and 14 newsletter action buttons.
  - typed `mobile@example.com` persisted through submit and Dark preview-theme changes.
  - subscribe, detail, and privacy actions produced feedback.
  - all 6 Dark controls set all 6 Newsletter roots to `data-newsletter-section-theme="dark"`.
  - mobile horizontal overflow stayed non-positive.
  - no console or page errors.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
