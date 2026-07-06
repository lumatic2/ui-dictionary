# Step 96 - Input Groups page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Input Groups` reference page.
- Local `plus-forms-input-groups` leaf and its 21 input group preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/input-groups` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Input Groups - Official Tailwind UI Components`, h1 `Input Groups`, and 48 detected example text nodes.

Implementation:

- Added per-variant controlled value state for input group fields.
- Fixed a smoke-discovered bug where uncontrolled `defaultValue` fields reset after feedback state caused a preview rerender.
- Preserved disabled input behavior.
- Preserved attached button actions for currency, country-code, sort, billing country, and keyboard shortcut controls.
- Kept dark-aware surfaces through the preview `Dark` and `Light` controls.
- Kept scope limited to the Input Groups leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/input-groups/`:
  - `tailwind-input-groups-reference-desktop.png`
  - `local-input-groups-desktop-before.png`
  - `local-input-groups-mobile-before.png`
  - `local-input-groups-desktop-after.png`
  - `local-input-groups-interaction-after.png`
  - `local-input-groups-all-dark-after.png`
  - `local-input-groups-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-input-groups` verified:
  - input count returned 25.
  - labelled input count returned 25.
  - disabled input count returned 1.
  - Email value persisted as `qa@example.com`.
  - Price value persisted as `$ 19.00`.
  - Currency, Sort, and Billing country actions showed feedback.
  - Card number value persisted as `5555 5555 5555 4444`.
  - Bottom border name value persisted as `Alex Morgan`.
  - Keyboard shortcut action showed feedback.
  - all 21 `Dark` controls were exercised and all 21 surfaces switched to dark styling.
  - mobile Email edit persisted and showed feedback.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
