# Step 138 - Hero Sections page parity pass

Status: completed
Started: 2026-07-04T15:31:00+09:00
Completed: 2026-07-04T15:42:00+09:00

## Scope

- Local `plus-marketing-hero-sections` leaf and its 12 hero section preview variants.
- Tailwind Plus Marketing / Page Sections / Hero Sections reference page.

## Reference

- Canonical reference URL: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/heroes`
- Alternate URL `https://tailwindcss.com/plus/ui-blocks/marketing/page-sections/hero-sections` returned 404.
- Tailwind reference exposed 12 examples:
  - `Simple centered`
  - `Split with screenshot`
  - `Split with bordered screenshot`
  - `Split with code example`
  - `Simple centered with background image`
  - `With bordered app screenshot`
  - `With app screenshot`
  - `With phone mockup`
  - `Split with image`
  - `With angled image on right`
  - `With image tiles`
  - `With offset image`

## Implementation

- Kept the local Hero Sections page aligned to the 12 Tailwind example names.
- Added explicit `data-hero-section-theme` and `data-hero-section-variant` markers to every hero preview root so dark/light coverage can be verified per example.
- Added stable accessible labels and selected state where appropriate for hero nav buttons, login, announcement, primary CTA, secondary CTA, GitHub, funding announcement, hiring, story, live demo, and image tile actions.
- Made hero feedback visible on mobile as well as desktop.
- Added stronger hover/press motion on hero CTA and announcement controls.
- Fixed a mobile interaction bug where the image-tile status panel intercepted pointer events and blocked selecting a lower tile.

## Verification

- Captures and smoke data saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/hero-sections/`:
  - `tailwind-hero-sections-reference.png`
  - `local-hero-sections-desktop-before.png`
  - `local-hero-sections-desktop-after.png`
  - `local-hero-sections-all-dark-after.png`
  - `local-hero-sections-mobile-after.png`
  - `capture-notes-before.json`
  - `chrome-smoke-after.json`
  - `mobile-smoke-after.json`
- Chrome extension desktop smoke verified:
  - page title `Hero Sections`.
  - 12 example headings matching the Tailwind reference.
  - 199 rendered buttons.
  - 12 `data-hero-section-theme` roots.
  - nav, login, announcement, primary CTA, secondary CTA, GitHub, funding, hiring, story, live demo, and tile actions produced visible feedback.
  - all 12 Dark controls set all 12 hero roots to `data-hero-section-theme="dark"`.
  - all 12 Light controls set all 12 hero roots to `data-hero-section-theme="light"`.
  - empty Chrome console errors.
  - desktop horizontal overflow returned 0.
- Mobile 390px smoke verified:
  - 12 visible Dark controls.
  - primary CTA, funding announcement, and image tile actions produced feedback.
  - all 12 Dark controls set all 12 hero roots to `data-hero-section-theme="dark"`.
  - mobile horizontal overflow returned 0.
  - no console or page errors.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
