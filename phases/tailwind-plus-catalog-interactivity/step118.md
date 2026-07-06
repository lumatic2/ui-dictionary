# Step 118 - Category Previews page parity pass

Scope:

- Local `plus-ecommerce-category-previews` leaf and its 6 category preview variants.
- Tailwind Plus Ecommerce Components/Category Previews live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/category-previews` returned 200.
- Tailwind reference was captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Category Previews` and the same 6 example names used locally.

Implementation:

- Completed a one-leaf pass for Ecommerce Category Previews.
- Fixed the smoke-discovered preview-theme gap where all 6 Dark controls became pressed but local category preview frames stayed light.
- Added dark/light preview-theme support across Category Previews frames, image placeholders, text, feedback, and selected rings.
- Added `aria-pressed` to category collection buttons so selected category state is inspectable.
- Retained and verified existing category selection feedback across grid, overlay, scrolling, and split-image variants.
- Kept the pass scoped to the `Category Previews` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/category-previews/`:
  - `tailwind-category-previews-reference.png`
  - `local-category-previews-desktop-before.png`
  - `local-category-previews-mobile-before.png`
  - `local-category-previews-interaction-before-fix.png`
  - `local-category-previews-all-dark-before-fix.png`
  - `local-category-previews-desktop-after.png`
  - `local-category-previews-interaction-after-fix.png`
  - `local-category-previews-all-dark-after.png`
  - `local-category-previews-all-light-after.png`
  - `local-category-previews-mobile-after.png`
  - `capture-notes-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-category-previews` verified:
  - reference page returned HTTP 200 and `Category Previews`.
  - local page identity returned `Category Previews`.
  - example heading count returned 6.
  - theme button count returned 18.
  - action button count returned 83.
  - category button count returned 14.
  - before fix, dark preview frame count stayed 0 after pressing all Dark controls.
  - `Storage collection opened` and `Notebooks collection opened` feedback appeared.
  - selected ring count reached 2 after representative interactions.
  - all 6 `Dark` controls were exercised and exposed `aria-pressed=true`.
  - dark preview frame count reached 6 after Dark.
  - all 6 `Light` controls were exercised and exposed `aria-pressed=true`.
  - dark preview frame count returned to 0 after Light.
  - mobile render kept 18 theme controls and 14 category buttons available.
  - No severe console errors on the local page.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
