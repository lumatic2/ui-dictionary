# Step 87 - Sidebar Layouts page parity pass

Scope:

- Tailwind Plus `Application UI / Application Shells / Sidebar Layouts` reference page.
- Local `plus-application-shells-sidebar-layouts` leaf and its 8 sidebar shell preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/application-shells/sidebar-layouts` currently returns 404.
- The 404 reference state is recorded in `capture-notes.json` and `tailwind-sidebar-layouts-reference-desktop.png`.

Implementation:

- Added `nav aria-label="Primary sidebar navigation"` to sidebar shell primary navs.
- Added active `aria-current=page` state to primary sidebar nav items.
- Added `nav aria-label="Team shortcuts"` for team lists.
- Converted team rows into clickable buttons with feedback.
- Converted the bottom profile row into a clickable button with feedback.
- Added Documents and Reports active-state support for sidebar shell variants.
- Preserved simple, dark, header, constrained, off-white, brand, and brand-header variants.
- Kept scope limited to the Sidebar Layouts leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/sidebar-layouts/`:
  - `tailwind-sidebar-layouts-reference-desktop.png`
  - `local-sidebar-layouts-desktop-before.png`
  - `local-sidebar-layouts-mobile-before.png`
  - `local-sidebar-layouts-desktop-after.png`
  - `local-sidebar-layouts-interaction-after.png`
  - `local-sidebar-layouts-all-dark-after.png`
  - `local-sidebar-layouts-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-shells-sidebar-layouts` verified:
  - primary sidebar nav count returned 8.
  - team shortcut nav count returned 8.
  - initial `aria-current=page` count returned 8.
  - team button count returned 24.
  - profile button count returned 8.
  - Documents feedback appeared and Documents received current state.
  - Heroicons team feedback appeared.
  - Tom Cook profile feedback appeared.
  - all 8 `Dark` controls were exercised.
  - mobile Reports feedback appeared and Reports received current state.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
