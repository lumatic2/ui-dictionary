## Step 124 - Promo Sections page parity pass

Scope:

- Local `plus-ecommerce-promo-sections` leaf and its 8 promo section variants.
- Tailwind Plus Ecommerce Components/Promo Sections live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/promo-sections` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Promo Sections` and the same 8 local example names: `With image tiles`, `With fading background image and testimonials`, `Full-width with background image`, `Full-width with overlapping image tiles`, `With background image`, `With overlapping image tiles`, `With offers and split image`, and `Full-width with background image and large content`.

Implementation:

- Added explicit promo theme state markers so each of the 8 examples can be verified as receiving Dark and Light preview-theme changes even when fixed dark background-image variants remain visually dark by design.
- Added dark/light preview-theme support to the light promo variants, image cards, offer rows, feedback surfaces, and CTA selected rings.
- Strengthened `Shop collection` CTAs with stable accessible labels, `aria-pressed`, visible selected state, and feedback.
- Converted offer apply actions in the split-offer example into directly inspectable controls with `aria-pressed` and visible feedback.
- Kept the pass scoped to the `Promo Sections` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/promo-sections/`:
  - `tailwind-promo-sections-reference.png`
  - `local-promo-sections-desktop-before.png`
  - `local-promo-sections-mobile-before.png`
  - `local-promo-sections-interaction-before-fix.png`
  - `local-promo-sections-all-dark-before-fix.png`
  - `local-promo-sections-desktop-after.png`
  - `local-promo-sections-interaction-after-fix.png`
  - `local-promo-sections-all-dark-after.png`
  - `local-promo-sections-all-light-after.png`
  - `local-promo-sections-mobile-after.png`
  - `capture-notes-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-promo-sections` verified:
  - local page identity returned `Promo Sections`.
  - reference/local example count matched 8 examples.
  - theme button count returned 24 on desktop.
  - action button count returned 86.
  - buttons exposing `aria-pressed` increased from 24 to 35 after the fix.
  - `Shop collection` interaction produced selected state and visible feedback.
  - `Save 20% on bundles` offer interaction produced selected state and visible applied feedback.
  - all 8 `Dark` controls exposed `aria-pressed=true` and all 8 promo roots reported `data-promo-theme="dark"`.
  - all 8 `Light` controls exposed `aria-pressed=true` and all 8 promo roots reported `data-promo-theme="light"`.
  - mobile 390px exposed 16 visible buttons with no horizontal overflow.
  - mobile `Shop collection` interaction produced selected state and visible feedback.
  - No severe console errors or page errors.
