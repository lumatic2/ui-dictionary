## Step 131 - Product Pages page parity pass

Scope:

- Local `plus-ecommerce-page-examples-product-pages` leaf and its 5 product page variants.
- Tailwind Plus Ecommerce Page Examples/Product Pages live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/product-pages` returned 200.
- `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/product-page` returned 404.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Product Pages` and the same 5 local example names: `With related products`, `With image grid`, `With expandable product details`, `With featured details`, and `With tabs and related products`.

Implementation:

- Added explicit product-page theme state markers so each of the 5 examples can be verified as receiving Dark and Light preview-theme changes.
- Added stable accessible labels and `aria-pressed` selected state to product nav links, utility icon buttons, color swatches, size controls, add-to-bag buttons, related product cards, review cards, feature cards, product tabs, tab cards, and footer links.
- Added `aria-expanded` to expandable product details and kept the animated reveal behavior.
- Added dark/light styling hooks across product page roots, nav, reviews, related grids, fine-detail sections, tabs, and feedback surfaces.
- Kept the pass scoped to the `Product Pages` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/product-pages/`:
  - `tailwind-product-pages-reference-1.png`
  - `tailwind-product-pages-reference-2.png`
  - `local-product-pages-desktop-before.png`
  - `local-product-pages-mobile-before.png`
  - `local-product-pages-interaction-before-fix.png`
  - `local-product-pages-all-dark-before-fix.png`
  - `local-product-pages-desktop-after.png`
  - `local-product-pages-interaction-after-fix.png`
  - `local-product-pages-all-dark-after.png`
  - `local-product-pages-all-light-after.png`
  - `local-product-pages-mobile-after.png`
  - `capture-notes-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5195/?filter=nav%3Aplus-ecommerce-page-examples-product-pages` verified:
  - local page identity returned `Product Pages`.
  - reference/local example count matched 5 examples.
  - theme button count returned 15.
  - action button count returned 238.
  - buttons exposing `aria-pressed` increased from 15 to 188 after the fix.
  - `Open product Search`, `Open product Account`, `Select color Black`, `Select size M`, `Add Basic Tee to bag`, `Toggle product detail Features`, `Open review Perfect everyday weight.`, `Open related product Essential Tee`, `Open product feature Water resistant`, `Open product tab Details`, and `Open product tab card Reviews` produced selected/expanded state and visible feedback.
  - all 5 `Dark` controls exposed `aria-pressed=true` and all 5 product-page roots reported `data-product-page-theme="dark"`.
  - all 5 `Light` controls exposed `aria-pressed=true` and all 5 product-page roots reported `data-product-page-theme="light"`.
  - mobile 390px exposed 238 buttons and 5 product-page roots with no horizontal overflow.
  - mobile `Select color Black` produced selected state and visible feedback.
  - No severe console errors or page errors.
