# Step 93 - Dropdowns page parity pass

Scope:

- Tailwind Plus `Application UI / Elements / Dropdowns` reference page.
- Local `plus-application-elements-dropdowns` leaf and its 5 dropdown preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/elements/dropdowns` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Dropdowns - Official Tailwind UI Components`, h1 `Dropdowns`, and 9 detected example text nodes.

Implementation:

- Changed dropdown examples to start closed instead of all open.
- Added per-example dropdown open state so one trigger does not open every rendered dropdown.
- Added `aria-expanded` and `aria-controls` to triggers.
- Added an accessible name to the minimal icon dropdown trigger.
- Added open-only `role=menu` containers and `role=menuitem` actions.
- Closed dropdown menus after selecting a menu item.
- Fixed the divider dropdown content bug so the divider variant uses its divider item set regardless of visual theme.
- Added theme-aware dropdown surfaces through the preview `Dark` and `Light` controls.
- Kept scope limited to the Dropdowns leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/dropdowns/`:
  - `tailwind-dropdowns-reference-desktop.png`
  - `local-dropdowns-desktop-before.png`
  - `local-dropdowns-mobile-before.png`
  - `local-dropdowns-desktop-after.png`
  - `local-dropdowns-menu-after.png`
  - `local-dropdowns-interaction-after.png`
  - `local-dropdowns-all-dark-after.png`
  - `local-dropdowns-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-elements-dropdowns` verified:
  - trigger count returned 5.
  - minimal icon trigger accessible name count returned 1.
  - initial open trigger count and menu count returned 0.
  - simple dropdown opened with 1 open trigger and 1 role menu.
  - Support selection closed the menu and showed feedback.
  - divider dropdown Archive selection showed feedback.
  - minimal dropdown Sign out selection showed feedback.
  - all 5 `Dark` controls were exercised and all 5 dropdown surfaces switched to dark styling.
  - mobile dropdown opened with 1 open trigger and 1 role menu.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
