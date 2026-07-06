## Step 135 - Order Detail Pages page parity pass

Scope:

- Local `plus-ecommerce-page-examples-order-detail-pages` leaf and its 3 order detail page variants.
- Tailwind Plus Ecommerce Page Examples/Order Detail Pages live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/order-detail-pages` returned 200.
- `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/order-detail-page` returned 404.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Order Detail Pages` and the same 3 local example names: `With progress bars`, `With large images and progress bars`, and `Simple with full order details`.

Implementation:

- Added explicit order-detail page theme state markers so each of the 3 examples can be verified as receiving Dark and Light preview-theme changes.
- Added stable accessible labels and `aria-pressed` selected state to order-detail nav links, utility icon buttons, invoice actions, progress step controls, tracking copy, and footer links.
- Added dark/light styling hooks across order-detail roots, nav, panels, product cards, progress tracks, address grids, footer links, headings, muted copy, borders, and feedback surfaces.
- Kept progress bars animated with `transition-all duration-500` and made step selection update the visible progress width.
- Kept the pass scoped to the `Order Detail Pages` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/order-detail-pages/`:
  - `tailwind-order-detail-pages-reference-1.png`
  - `tailwind-order-detail-pages-reference-2.png`
  - `local-order-detail-pages-desktop-before.png`
  - `local-order-detail-pages-mobile-before.png`
  - `local-order-detail-pages-interaction-before-fix.png`
  - `local-order-detail-pages-all-dark-before-fix.png`
  - `local-order-detail-pages-desktop-after.png`
  - `local-order-detail-pages-interaction-after-fix.png`
  - `local-order-detail-pages-all-dark-after.png`
  - `local-order-detail-pages-all-light-after.png`
  - `local-order-detail-pages-mobile-after.png`
  - `capture-notes-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed before recording this step.
- Standalone Playwright smoke on `http://127.0.0.1:5199/?filter=nav%3Aplus-ecommerce-page-examples-order-detail-pages` verified:
  - local page identity returned `Order Detail Pages`.
  - reference/local example count matched 3 examples.
  - action button count returned 116.
  - buttons exposing `aria-pressed` increased from 9 to 74 after the fix.
  - `Open order detail Search`, `Open order detail Account`, `Open order detail Cart`, `Open order detail invoice 54879`, `Open order detail invoice 58014`, `Open order detail progress Nomad Tumbler Processing`, `Open order detail progress Nomad Tumbler Shipped`, `Open order detail progress Distant Mountains Artwork Tee Delivered`, `Copy order detail tracking number`, and `Open order detail footer Account Orders` produced selected state and visible feedback.
  - `Nomad Tumbler Shipped` changed the measured progress bar width to `75%`.
  - all 3 `Dark` controls exposed `aria-pressed=true` and all 3 order-detail roots reported `data-order-detail-page-theme="dark"`.
  - all 3 `Light` controls exposed `aria-pressed=true` and all 3 order-detail roots reported `data-order-detail-page-theme="light"`.
  - mobile 390px exposed 116 buttons and 3 order-detail roots with no horizontal overflow.
  - mobile tracking copy produced selected state and visible feedback.
  - No severe console errors or page errors.
