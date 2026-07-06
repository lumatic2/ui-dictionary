## Step 130 - Storefront Pages page parity pass

Scope:

- Local `plus-ecommerce-page-examples-storefront-pages` leaf and its 4 storefront page variants.
- Tailwind Plus Ecommerce Page Examples/Storefront Pages live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/storefront-pages` returned 200.
- `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/storefront` returned 404.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Storefront Pages` and the same 4 local example names: `With dark nav and footer`, `With offers and testimonials`, `With image tiles and feature sections`, and `With overlapping image tiles and perks`.

Implementation:

- Added explicit storefront theme state markers so each of the 4 examples can be verified as receiving Dark and Light preview-theme changes.
- Added stable accessible labels and `aria-pressed` selected state to storefront nav links, utility icon buttons, hero CTAs, category tiles, product tiles, promo CTAs, story cards, detail cards, perk rows, and footer links.
- Added dark/light styling hooks across storefront roots, nav, product rows, feature sections, detail panels, perk strips, and footers.
- Preserved the existing visual storefront layouts while making repeated cards and commerce controls directly inspectable.
- Kept the pass scoped to the `Storefront Pages` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/storefront-pages/`:
  - `tailwind-storefront-pages-reference-1.png`
  - `tailwind-storefront-pages-reference-2.png`
  - `local-storefront-pages-desktop-before.png`
  - `local-storefront-pages-mobile-before.png`
  - `local-storefront-pages-interaction-before-fix.png`
  - `local-storefront-pages-all-dark-before-fix.png`
  - `local-storefront-pages-desktop-after.png`
  - `local-storefront-pages-interaction-after-fix.png`
  - `local-storefront-pages-all-dark-after.png`
  - `local-storefront-pages-all-light-after.png`
  - `local-storefront-pages-mobile-after.png`
  - `capture-notes-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5194/?filter=nav%3Aplus-ecommerce-page-examples-storefront-pages` verified:
  - local page identity returned `Storefront Pages`.
  - reference/local example count matched 4 examples.
  - theme button count returned 12.
  - action button count returned 180.
  - buttons exposing `aria-pressed` increased from 12 to 136 after the fix.
  - `Open storefront Search`, `Open storefront Account`, `Open storefront collection Dark`, `Open category Stationery`, `Open product Black precision pen`, `Open storefront sale collection`, `Open story Better material choices.`, `Open detail Natural materials`, and `Open perk Free shipping` produced selected state and visible feedback.
  - all 4 `Dark` controls exposed `aria-pressed=true` and all 4 storefront roots reported `data-storefront-theme="dark"`.
  - all 4 `Light` controls exposed `aria-pressed=true` and all 4 storefront roots reported `data-storefront-theme="light"`.
  - mobile 390px exposed 180 buttons and 4 storefront roots with no horizontal overflow.
  - mobile `Open category Stationery` produced selected state and visible feedback.
  - No severe console errors or page errors.
