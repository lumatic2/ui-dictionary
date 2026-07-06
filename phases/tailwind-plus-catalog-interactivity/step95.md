# Step 95 - Comboboxes page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Comboboxes` reference page.
- Local `plus-forms-comboboxes` leaf and its 4 combobox preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/comboboxes` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Comboboxes - Official Tailwind UI Components`, h1 `Comboboxes`, and 4 detected example text nodes.

Implementation:

- Added dedicated per-example query state for combobox inputs.
- Added dedicated combobox open state instead of overloading shared catalog tab state.
- Preserved `role=combobox`, `aria-autocomplete=list`, `aria-expanded`, `aria-controls`, and `aria-activedescendant` on open inputs.
- Changed listbox and option semantics to open-only, preventing closed examples from exposing stale roles.
- Added stable filtering per example.
- Added Enter key selection of the current filtered option.
- Kept option click selection, no-results empty state, visible feedback, and dark-aware surfaces.
- Kept scope limited to the Comboboxes leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/comboboxes/`:
  - `tailwind-comboboxes-reference-desktop.png`
  - `local-comboboxes-desktop-before.png`
  - `local-comboboxes-mobile-before.png`
  - `local-comboboxes-desktop-after.png`
  - `local-comboboxes-filter-after.png`
  - `local-comboboxes-interaction-after.png`
  - `local-comboboxes-all-dark-after.png`
  - `local-comboboxes-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-comboboxes` verified:
  - combobox input count returned 4.
  - initial expanded combobox, listbox, and option counts returned 0.
  - filtering `tom` opened 1 listbox with 1 Tom Cook option.
  - Enter selected Tom Cook, closed the list, and showed feedback.
  - filtering `lind` and clicking Lindsay Walton selected her and showed feedback.
  - filtering `zzzz` showed the empty no-results state with 1 open listbox and 0 options.
  - all 4 `Dark` controls were exercised and all 4 surfaces switched to dark styling.
  - mobile filtering `dries` opened 1 listbox with 1 Dries Vincent option.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
