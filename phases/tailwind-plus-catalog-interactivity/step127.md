## Step 127 - Order Summaries page parity pass

Scope:

- Local `plus-ecommerce-order-summaries` leaf and its 4 order summary variants.
- Tailwind Plus Ecommerce Components/Order Summaries live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/order-summaries` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Order Summaries` and the same 4 local example names: `With split image`, `With progress bars`, `With large images and progress bars`, and `Simple with full order details`.

Implementation:

- Added explicit order-summary theme state markers so each of the 4 examples can be verified as receiving Dark and Light preview-theme changes.
- Added `aria-pressed` selected state to progress/status steps, invoice actions, and the continue-shopping action.
- Made invoice and status actions update shared selected state while preserving existing visible feedback.
- Added dark/light root styling to each order-summary variant so preview theme changes have a direct rendered effect.
- Kept the pass scoped to the `Order Summaries` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/order-summaries/`:
  - `tailwind-order-summaries-reference.png`
  - `local-order-summaries-desktop-before.png`
  - `local-order-summaries-mobile-before.png`
  - `local-order-summaries-interaction-before-fix.png`
  - `local-order-summaries-all-dark-before-fix.png`
  - `local-order-summaries-desktop-after.png`
  - `local-order-summaries-interaction-after-fix.png`
  - `local-order-summaries-all-dark-after.png`
  - `local-order-summaries-all-light-after.png`
  - `local-order-summaries-mobile-after.png`
  - `capture-notes-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-order-summaries` verified:
  - local page identity returned `Order Summaries`.
  - reference/local example count matched 4 examples.
  - theme button count returned 12 on desktop.
  - action button count returned 76.
  - buttons exposing `aria-pressed` increased from 12 to 33 after the fix.
  - `Continue shopping`, `Order invoice`, `Processing`, `Shipped`, and `Delivered` interactions produced selected state and visible feedback.
  - all 4 `Dark` controls exposed `aria-pressed=true` and all 4 order-summary roots reported `data-order-summary-theme="dark"`.
  - all 4 `Light` controls exposed `aria-pressed=true` and all 4 order-summary roots reported `data-order-summary-theme="light"`.
  - mobile 390px exposed 26 visible buttons with no horizontal overflow.
  - mobile `Continue shopping` produced selected state and visible feedback.
  - No severe console errors or page errors.
