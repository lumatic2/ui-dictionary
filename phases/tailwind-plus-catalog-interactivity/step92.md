# Step 92 - Button Groups page parity pass

Scope:

- Tailwind Plus `Application UI / Elements / Button Groups` reference page.
- Local `plus-application-elements-button-groups` leaf and its 5 button group preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/elements/button-groups` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Button Groups - Official Tailwind UI Components`, h1 `Button Groups`, and 16 detected example text nodes.

Implementation:

- Added `aria-pressed` selected state to basic, icon-only, stat, save, and unread group buttons.
- Added visible selected styling and hover/press motion to group segments.
- Added theme-aware dark surfaces through the preview `Dark` and `Light` controls.
- Converted the save dropdown into an interactive menu with `aria-expanded`, `aria-controls`, open-only `role=menu`, and `role=menuitem` actions.
- Converted the unread checkbox dropdown into a real `role=checkbox` control with `aria-checked`, an unread segment, and an interactive menu.
- Split dropdown open state by rendered example so save and unread menus do not open together.
- Kept scope limited to the Button Groups leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/button-groups/`:
  - `tailwind-button-groups-reference-desktop.png`
  - `local-button-groups-desktop-before.png`
  - `local-button-groups-mobile-before.png`
  - `local-button-groups-desktop-after.png`
  - `local-button-groups-interaction-after.png`
  - `local-button-groups-menu-after.png`
  - `local-button-groups-all-dark-after.png`
  - `local-button-groups-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-elements-button-groups` verified:
  - pressed-capable button count returned 10.
  - expandable button count returned 2.
  - checkbox count returned 1.
  - Months, Next group, Unread messages selection states appeared.
  - unread checkbox switched to `aria-checked=true`.
  - save menu opened with one visible `role=menu` and six menuitems in the DOM.
  - closed menu state returned 0 open menus and 0 expanded controls after menuitem selection.
  - all 5 `Dark` controls were exercised and all 5 group surfaces switched to dark styling.
  - mobile Days feedback appeared.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
