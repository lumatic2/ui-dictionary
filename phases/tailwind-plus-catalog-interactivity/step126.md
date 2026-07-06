## Step 126 - Reviews page parity pass

Scope:

- Local `plus-ecommerce-reviews` leaf and its 4 review variants.
- Tailwind Plus Ecommerce Components/Reviews live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/reviews` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Reviews` and the same 4 local example names: `Multi-column`, `With summary chart`, `Avatars with separate description`, and `Simple with avatars`.

Implementation:

- Added explicit review theme state markers so each of the 4 examples can be verified as receiving Dark and Light preview-theme changes.
- Added stable accessible labels and `aria-pressed` selected state to rating filters, row rating buttons, helpful actions, and write-review CTAs.
- Made rating-filter selection update both filter state and selected button state, so `5 star` and `4 star` filters can be directly inspected.
- Added selected state to helpful and mark-helpful actions while preserving existing visible feedback.
- Kept the pass scoped to the `Reviews` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/reviews/`:
  - `tailwind-reviews-reference.png`
  - `local-reviews-desktop-before.png`
  - `local-reviews-mobile-before.png`
  - `local-reviews-interaction-before-fix.png`
  - `local-reviews-all-dark-before-fix.png`
  - `local-reviews-desktop-after.png`
  - `local-reviews-interaction-after-fix.png`
  - `local-reviews-all-dark-after.png`
  - `local-reviews-all-light-after.png`
  - `local-reviews-mobile-after.png`
  - `capture-notes-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-reviews` verified:
  - local page identity returned `Reviews`.
  - reference/local example count matched 4 examples.
  - theme button count returned 12 on desktop.
  - action button count returned 107.
  - buttons exposing `aria-pressed` increased from 12 to 40 after the fix.
  - `Write a review` produced selected state and visible composer feedback.
  - `5 star` and `4 star` rating filters produced selected state and visible filtered feedback.
  - `Leslie Alexander helpful` and `Perfectly weighted and easy to carry. helpful` actions produced selected state and visible feedback.
  - all 4 `Dark` controls exposed `aria-pressed=true` and all 4 review roots reported `data-review-theme="dark"`.
  - all 4 `Light` controls exposed `aria-pressed=true` and all 4 review roots reported `data-review-theme="light"`.
  - mobile 390px exposed 57 visible buttons with no horizontal overflow.
  - mobile `Write a review` produced selected state and visible feedback.
  - No severe console errors or page errors.
