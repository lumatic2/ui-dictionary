## Step 123 - Store Navigation page parity pass

Scope:

- Local `plus-ecommerce-store-navigation` leaf and its 5 store navigation variants.
- Tailwind Plus Ecommerce Components/Store Navigation live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/store-navigation` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Store Navigation` and the same 5 local example names: `With featured categories`, `With image grid`, `With simple menu and promo`, `With centered logo and featured categories`, and `With double column and persistent mobile nav`.

Implementation:

- Fixed the smoke-discovered preview-theme gap where all 5 `Dark` controls became pressed but local store navigation frames stayed light.
- Added dark/light preview-theme support across store navigation frames, top bars, brand marks, menu columns, category cards, borders, feedback surfaces, and mobile bottom navigation.
- Converted category cards from static content into real buttons with hover motion, stable accessible labels, selected state, and visible feedback.
- Added `aria-pressed` selected state to primary nav links, utility links, menu links, category cards, and mobile bottom nav buttons.
- Kept the pass scoped to the `Store Navigation` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/store-navigation/`:
  - `tailwind-store-navigation-reference.png`
  - `local-store-navigation-desktop-before.png`
  - `local-store-navigation-mobile-before.png`
  - `local-store-navigation-interaction-before-fix.png`
  - `local-store-navigation-all-dark-before-fix.png`
  - `local-store-navigation-desktop-after.png`
  - `local-store-navigation-interaction-after-fix.png`
  - `local-store-navigation-all-dark-after.png`
  - `local-store-navigation-all-light-after.png`
  - `local-store-navigation-mobile-after.png`
  - `capture-notes-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-store-navigation` verified:
  - local page identity returned `Store Navigation`.
  - reference/local example count matched 5 examples.
  - theme button count returned 15 on desktop.
  - action button count returned 129 after the navigation upgrade.
  - buttons exposing `aria-pressed` increased to 88 after the fix.
  - `Search`, `New Arrivals`, `Bags`, and `Cart` interactions produced selected state and visible feedback.
  - all 5 `Dark` controls exposed `aria-pressed=true` and dark preview frame count increased from 1 to 12.
  - all 5 `Light` controls exposed `aria-pressed=true` and dark preview frame count returned to 1.
  - mobile 390px exposed 58 visible buttons with no horizontal overflow.
  - mobile `Search` and `Bag` bottom-nav interactions produced selected state and visible feedback.
  - No severe console errors or page errors.
