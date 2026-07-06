# Step 117 - Product Lists page parity pass

Scope:

- Local `plus-ecommerce-product-lists` leaf and its 11 product list preview variants.
- Tailwind Plus Ecommerce Components/Product Lists live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/product-lists` returned 200.
- Tailwind reference was captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Product Lists` and the same 11 example names used locally.

Implementation:

- Completed a one-leaf pass for Ecommerce Product Lists.
- Fixed smoke-discovered static color swatches in the horizontal swatch example by converting them into stateful swatch buttons with accessible names, `aria-pressed`, visible selected rings, and feedback.
- Added product card selection feedback for list examples that previously had no direct action, while avoiding nested button structures in examples that already contain CTA or overlay buttons.
- Added dark/light preview-theme support across Product Lists frames, cards, copy, borders, feedback, and card-detail controls.
- Added `aria-pressed` to card-detail size controls.
- Kept the pass scoped to the `Product Lists` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/product-lists/`:
  - `tailwind-product-lists-reference.png`
  - `local-product-lists-desktop-before.png`
  - `local-product-lists-mobile-before.png`
  - `local-product-lists-interaction-before-fix.png`
  - `local-product-lists-all-dark-before-fix.png`
  - `local-product-lists-desktop-after.png`
  - `local-product-lists-interaction-after-fix.png`
  - `local-product-lists-all-dark-after.png`
  - `local-product-lists-all-light-after.png`
  - `local-product-lists-mobile-after.png`
  - `capture-notes-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-product-lists` verified:
  - reference page returned HTTP 200 and `Product Lists`.
  - local page identity returned `Product Lists`.
  - example heading count returned 11.
  - theme button count returned 33.
  - action button count increased to 155 after interactivity additions.
  - before fix, swatch button count returned 0.
  - after fix, swatch button count returned 16.
  - representative product card button count returned 5.
  - `Desk Notebook selected`, `Walnut Tray opened`, `Ribbed Beanie Indigo swatch selected`, `Task Lamp added to bag`, and `Canvas Card Wallet M selected` feedback appeared.
  - all 11 `Dark` controls were exercised and exposed `aria-pressed=true`.
  - dark preview frame count reached 11 after Dark.
  - all 11 `Light` controls were exercised and exposed `aria-pressed=true`.
  - dark preview frame count returned to 0 after Light.
  - mobile render kept 33 theme controls and 16 swatch buttons available.
  - No severe console errors on the local page.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
