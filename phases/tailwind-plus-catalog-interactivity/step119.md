# Step 119 - Shopping Carts page parity pass

Scope:

- Local `plus-ecommerce-shopping-carts` leaf and its 6 shopping cart variants.
- Tailwind Plus Ecommerce Components/Shopping Carts live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/shopping-carts` returned 200.
- Tailwind reference was captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Shopping Carts` and the same 6 example names used locally.

Implementation:

- Completed a one-leaf pass for Ecommerce Shopping Carts.
- Fixed the smoke-discovered static `Close` text in the drawer example by converting it into a real button with visible feedback.
- Added dark/light preview-theme support across cart frames, drawer/dialog/popover panels, line items, summaries, borders, quantity controls, and feedback surfaces.
- Added accessible names to quantity increase/decrease buttons so direct smoke and assistive technology can operate item quantity changes.
- Preserved and verified existing quantity, remove/restore, checkout, continue-shopping, and dynamic subtotal behavior.
- Kept the pass scoped to the `Shopping Carts` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/shopping-carts/`:
  - `tailwind-shopping-carts-reference.png`
  - `local-shopping-carts-desktop-before.png`
  - `local-shopping-carts-mobile-before.png`
  - `local-shopping-carts-interaction-before-fix.png`
  - `local-shopping-carts-all-dark-before-fix.png`
  - `local-shopping-carts-desktop-after.png`
  - `local-shopping-carts-interaction-after-fix.png`
  - `local-shopping-carts-all-dark-after.png`
  - `local-shopping-carts-all-light-after.png`
  - `local-shopping-carts-mobile-after.png`
  - `capture-notes-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-shopping-carts` verified:
  - reference page returned HTTP 200 and `Shopping Carts`.
  - local page identity returned `Shopping Carts`.
  - example heading count returned 6.
  - theme button count returned 18.
  - action button count returned 107.
  - close button count improved from 0 before fix to 1 after fix.
  - checkout button count returned 6.
  - remove/restore controls returned 11.
  - quantity text count returned 11.
  - before fix, dark preview frame count stayed 0 after pressing all Dark controls.
  - `Cart drawer closed`, quantity increase to `Qty 2`, `Nomad Backpack removed`, `Nomad Backpack restored`, and `Checkout started` all appeared in interaction checkpoints.
  - subtotal changed from `$140` to `$280`, then `$0`, then `$280` across increase/remove/restore checkpoints.
  - all 6 `Dark` controls were exercised and exposed `aria-pressed=true`.
  - dark preview frame count reached 6 after Dark.
  - all 6 `Light` controls were exercised and exposed `aria-pressed=true`.
  - dark preview frame count returned to 0 after Light.
  - mobile render kept 18 theme controls and the Close button available.
  - No severe console errors on the local page.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
