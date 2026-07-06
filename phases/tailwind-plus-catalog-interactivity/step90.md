# Step 90 - Badges page parity pass

Scope:

- Tailwind Plus `Application UI / Elements / Badges` reference page.
- Local `plus-application-elements-badges` leaf and its 16 badge preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/elements/badges` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Badges - Official Tailwind UI Components`, h1 `Badges`, and 28 detected example text nodes.

Implementation:

- Converted rendered badge examples from static labels into selectable controls.
- Added `aria-pressed` selected state for every badge label.
- Added visible selection feedback and hover, focus, press, and selected-ring motion states.
- Added real remove buttons for the remove variants with `Remove {label} badge` accessible names.
- Added Restore badges recovery when a badge is removed.
- Added dark-aware badge tone classes and dark surface switching through the preview `Dark` and `Light` controls.
- Kept scope limited to the Badges leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/badges/`:
  - `tailwind-badges-reference-desktop.png`
  - `local-badges-desktop-before.png`
  - `local-badges-mobile-before.png`
  - `local-badges-desktop-after.png`
  - `local-badges-interaction-after.png`
  - `local-badges-all-dark-after.png`
  - `local-badges-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-elements-badges` verified:
  - badge button count returned 128.
  - remove button count returned 16.
  - dark toggle count returned 16.
  - Green badge selection feedback appeared and received pressed state.
  - Red badge removal feedback appeared and remove button count dropped to 15.
  - Restore badges feedback appeared and remove button count returned to 16.
  - all 16 `Dark` controls were exercised and all 16 badge surfaces switched to dark styling.
  - mobile Blue badge feedback appeared.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
