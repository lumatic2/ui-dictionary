## Step 125 - Checkout Forms page parity pass

Scope:

- Local `plus-ecommerce-checkout-forms` leaf and its 5 checkout form variants.
- Tailwind Plus Ecommerce Components/Checkout Forms live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/checkout-forms` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Checkout Forms` and the same 5 local example names: `Single step with order summary`, `With mobile order summary overlay`, `Multi-step`, `With order summary sidebar`, and `Split with order summary`.

Implementation:

- Converted the visual-only checkout field rows into real `<input>` controls with accessible labels, editable values, focus rings, dark/light styling, and blur feedback.
- Added explicit checkout theme state markers so each of the 5 examples can be verified as receiving Dark and Light preview-theme changes.
- Added dark/light preview-theme support across checkout frames, panels, field labels, inputs, summaries, borders, and muted copy.
- Added inspectable selected state to checkout progress steps, primary checkout CTAs, summary toggle, discount action, and payment CTA with `aria-pressed` or `aria-expanded` where appropriate.
- Kept the pass scoped to the `Checkout Forms` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/checkout-forms/`:
  - `tailwind-checkout-forms-reference.png`
  - `local-checkout-forms-desktop-before.png`
  - `local-checkout-forms-mobile-before.png`
  - `local-checkout-forms-interaction-before-fix.png`
  - `local-checkout-forms-all-dark-before-fix.png`
  - `local-checkout-forms-desktop-after.png`
  - `local-checkout-forms-interaction-after-fix.png`
  - `local-checkout-forms-all-dark-after.png`
  - `local-checkout-forms-all-light-after.png`
  - `local-checkout-forms-mobile-after.png`
  - `capture-notes-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-checkout-forms` verified:
  - local page identity returned `Checkout Forms`.
  - reference/local example count matched 5 examples.
  - theme button count returned 15 on desktop.
  - action button count returned 72.
  - real input count increased from 1 before the fix to 52 after the fix.
  - buttons exposing `aria-pressed` increased from 15 to 28 after the fix.
  - `Email address` accepted `alex@example.com` and produced update feedback on blur.
  - `Confirm order`, `Information`, `Payment`, and `Apply discount` interactions produced selected state and visible feedback.
  - all 5 `Dark` controls exposed `aria-pressed=true` and all 5 checkout roots reported `data-checkout-theme="dark"`.
  - all 5 `Light` controls exposed `aria-pressed=true` and all 5 checkout roots reported `data-checkout-theme="light"`.
  - mobile 390px exposed 18 visible buttons and 52 inputs with no horizontal overflow.
  - mobile order-summary toggle changed `aria-expanded` from `true` to `false` and produced visible feedback.
  - No severe console errors or page errors.
