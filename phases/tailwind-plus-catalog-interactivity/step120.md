# Step 120 - Category Filters page parity pass

Scope:

- Local `plus-ecommerce-category-filters` leaf and its 5 category filter variants.
- Tailwind Plus Ecommerce Components/Category Filters live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/category-filters` returned 200.
- Tailwind reference was captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Category Filters` and the same 5 example names used locally.

Implementation:

- Completed a one-leaf pass for Ecommerce Category Filters.
- Fixed the smoke-discovered preview-theme gap where all 5 Dark controls became pressed but local category filter frames stayed light.
- Added dark/light preview-theme support across filter frames, product tiles, hatch panels, sidebars, toolbar buttons, expandable panels, feedback, borders, and muted copy.
- Added `aria-pressed` to category buttons, filter chips, and expandable filter-panel controls so selected/open state is inspectable.
- Retained and verified existing filter toggle, apply, clear, panel toggle, sort, and grid view feedback.
- Kept the pass scoped to the `Category Filters` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/category-filters/`:
  - `tailwind-category-filters-reference.png`
  - `local-category-filters-desktop-before.png`
  - `local-category-filters-mobile-before.png`
  - `local-category-filters-interaction-before-fix.png`
  - `local-category-filters-all-dark-before-fix.png`
  - `local-category-filters-desktop-after.png`
  - `local-category-filters-interaction-after-fix.png`
  - `local-category-filters-all-dark-after.png`
  - `local-category-filters-all-light-after.png`
  - `local-category-filters-mobile-after.png`
  - `capture-notes-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-category-filters` verified:
  - reference page returned HTTP 200 and `Category Filters`.
  - local page identity returned `Category Filters`.
  - example heading count returned 5.
  - theme button count returned 15.
  - action button count returned 101.
  - filter button count returned 27.
  - before fix, dark preview frame count stayed 0 after pressing all Dark controls.
  - `Color filter toggled`, `Applied 1 filter`, `Filters cleared`, panel toggle, `Sort menu opened`, and `Grid view selected` appeared in interaction checkpoints.
  - all 5 `Dark` controls were exercised and exposed `aria-pressed=true`.
  - dark preview frame count reached 5 after Dark.
  - all 5 `Light` controls were exercised and exposed `aria-pressed=true`.
  - dark preview frame count returned to 0 after Light.
  - mobile render kept 15 theme controls and 27 filter buttons available.
  - No severe console errors on the local page.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
