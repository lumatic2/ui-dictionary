## Step 129 - Incentives page parity pass

Scope:

- Local `plus-ecommerce-incentives` leaf and its 8 incentive variants.
- Tailwind Plus Ecommerce Components/Incentives live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/incentives` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Incentives` and the same 8 local example names: `3-column with illustrations and split header`, `4-column with illustrations`, `3-column with illustrations and header`, `3-column with illustrations and centered text`, `3-column with illustrations and heading`, `2x2 grid with illustrations`, `3-column with icons and supporting text`, and `3-column with icons`.

Implementation:

- Added explicit incentive theme state markers so each of the 8 examples can be verified as receiving Dark and Light preview-theme changes.
- Added dark/light surface, panel, image, icon, illustration, heading, muted-copy, selected-card, and feedback styling across the incentive variants.
- Added stable accessible labels and `aria-pressed` selected state to incentive benefit cards and icon rows.
- Preserved the existing visible feedback while making benefit controls directly inspectable by Playwright and assistive technology.
- Kept the pass scoped to the `Incentives` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/incentives/`:
  - `tailwind-incentives-reference.png`
  - `local-incentives-desktop-before.png`
  - `local-incentives-mobile-before.png`
  - `local-incentives-interaction-before-fix.png`
  - `local-incentives-all-dark-before-fix.png`
  - `local-incentives-desktop-after.png`
  - `local-incentives-interaction-after-fix.png`
  - `local-incentives-all-dark-after.png`
  - `local-incentives-all-light-after.png`
  - `local-incentives-mobile-after.png`
  - `capture-notes-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5193/?filter=nav%3Aplus-ecommerce-incentives` verified:
  - local page identity returned `Incentives`.
  - reference/local example count matched 8 examples.
  - theme button count returned 24.
  - action button count returned 102.
  - buttons exposing `aria-pressed` increased from 24 to 50 after the fix.
  - `Open incentive Free shipping`, `Open incentive 10-year warranty`, `Open incentive Gift cards`, `Open incentive 5-year shelf-life`, and `Open incentive Fast, contactless delivery` produced selected state and visible feedback.
  - all 8 `Dark` controls exposed `aria-pressed=true` and all 8 incentive roots reported `data-incentive-theme="dark"`.
  - all 8 `Light` controls exposed `aria-pressed=true` and all 8 incentive roots reported `data-incentive-theme="light"`.
  - mobile 390px exposed 102 buttons and 8 incentive roots with no horizontal overflow.
  - mobile `Open incentive Free shipping` produced selected state and visible feedback.
  - No severe console errors or page errors.
