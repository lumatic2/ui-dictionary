# Step 91 - Buttons page parity pass

Scope:

- Tailwind Plus `Application UI / Elements / Buttons` reference page.
- Local `plus-application-elements-buttons` leaf and its 8 button preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/elements/buttons` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Buttons - Official Tailwind UI Components`, h1 `Buttons`, and 21 detected example text nodes.

Implementation:

- Added accessible labels for each rendered size and circular button.
- Added `aria-pressed` selected state for each button example.
- Added selected-ring styling that works on light and dark surfaces.
- Added visible feedback for size and circular button actions.
- Added hover, focus, press, and selected motion states.
- Fixed Buttons theme handling so the preview `Dark` and `Light` controls update all button surfaces while preserving default dark examples.
- Kept scope limited to the Buttons leaf. Button Groups remain a separate leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/buttons/`:
  - `tailwind-buttons-reference-desktop.png`
  - `local-buttons-desktop-before.png`
  - `local-buttons-mobile-before.png`
  - `local-buttons-desktop-after.png`
  - `local-buttons-interaction-after.png`
  - `local-buttons-all-dark-after.png`
  - `local-buttons-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-elements-buttons` verified:
  - action button count returned 38.
  - dark toggle count returned 8.
  - Button size 3 feedback appeared.
  - Circular button 2 feedback appeared and received pressed state.
  - all 8 `Dark` controls were exercised and all 8 button surfaces switched to dark styling.
  - mobile Button size 2 feedback appeared.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
