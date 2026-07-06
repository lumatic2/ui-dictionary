# Step 94 - Select Menus page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Select Menus` reference page.
- Local `plus-forms-select-menus` leaf and its 7 select menu preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/elements/select-menus` returned 404 because Select Menus belongs under Forms, not Elements.
- Corrected reference URL `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/select-menus` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Select Menus - Official Tailwind UI Components`, h1 `Select Menus`, and 5 detected example text nodes.

Implementation:

- Added per-example open state so one custom select does not open every rendered select menu.
- Added `role=combobox`, `aria-expanded`, `aria-haspopup=listbox`, and `aria-controls` to custom select triggers.
- Added open-only `role=listbox` containers.
- Added `role=option` and `aria-selected` to person and status options.
- Closed custom menus after selecting a person or status option.
- Preserved the native select path and verified native option selection.
- Kept scope limited to the Select Menus leaf under Forms.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/select-menus/`:
  - `tailwind-select-menus-reference-desktop.png`
  - `local-select-menus-desktop-before.png`
  - `local-select-menus-mobile-before.png`
  - `local-select-menus-desktop-after.png`
  - `local-select-menus-menu-after.png`
  - `local-select-menus-interaction-after.png`
  - `local-select-menus-all-dark-after.png`
  - `local-select-menus-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-select-menus` verified:
  - custom combobox count returned 6.
  - native select count returned 2.
  - initial expanded combobox and listbox counts returned 0.
  - avatar select opened with 1 expanded combobox, 1 listbox, and option semantics.
  - Wade Cooper selection closed the menu and showed feedback.
  - native Location selection changed to Mexico and showed feedback.
  - Away status selection closed the menu and showed feedback.
  - all 7 `Dark` controls were exercised and dark surfaces switched.
  - mobile select opened with 1 expanded combobox and 1 listbox.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
