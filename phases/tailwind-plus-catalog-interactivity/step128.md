## Step 128 - Order History page parity pass

Scope:

- Local `plus-ecommerce-order-history` leaf and its 4 order history variants.
- Tailwind Plus Ecommerce Components/Order History live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/order-history` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Order History` and the same 4 local example names: `Invoice panels`, `Invoice table`, `Invoice list`, and `Invoice list with quick actions`.

Implementation:

- Added explicit order-history theme state markers so each of the 4 examples can be verified as receiving Dark and Light preview-theme changes.
- Added dark/light root, panel, divider, muted-copy, image-well, and feedback styling across the order history variants.
- Added stable accessible labels and `aria-pressed` selected state to invoice, product, buy-again, manage-order, and shop-similar actions.
- Made those order actions update shared selected state while preserving visible feedback.
- Kept the pass scoped to the `Order History` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/order-history/`:
  - `tailwind-order-history-reference.png`
  - `local-order-history-desktop-before.png`
  - `local-order-history-mobile-before.png`
  - `local-order-history-interaction-before-fix.png`
  - `local-order-history-all-dark-before-fix.png`
  - `local-order-history-desktop-after.png`
  - `local-order-history-interaction-after-fix.png`
  - `local-order-history-all-dark-after.png`
  - `local-order-history-all-light-after.png`
  - `local-order-history-mobile-after.png`
  - `capture-notes-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5192/?filter=nav%3Aplus-ecommerce-order-history` verified:
  - local page identity returned `Order History`.
  - reference/local example count matched 4 examples.
  - theme button count returned 12 on desktop.
  - action button count returned 94.
  - buttons exposing `aria-pressed` increased from 12 to 50 after the fix.
  - `View invoice WU881911`, `View product Merino Pullover`, `Buy again Merino Pullover`, `Manage order DR45873`, and `Shop similar Earthen Mug` produced selected state and visible feedback.
  - all 4 `Dark` controls exposed `aria-pressed=true` and all 4 order-history roots reported `data-order-history-theme="dark"`.
  - all 4 `Light` controls exposed `aria-pressed=true` and all 4 order-history roots reported `data-order-history-theme="light"`.
  - mobile 390px exposed 94 buttons, 4 order-history roots, and no horizontal overflow.
  - mobile `View invoice WU881911` produced visible feedback.
  - No severe console errors or page errors.
