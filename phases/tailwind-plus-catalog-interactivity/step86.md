# Step 86 - Stacked Layouts page parity pass

Scope:

- Tailwind Plus `Application UI / Application Shells / Stacked Layouts` reference page.
- Local `plus-application-shells-stacked-layouts` leaf and its 9 stacked shell preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/application-shells/stacked-layouts` currently returns 404.
- The 404 reference state is recorded in `capture-notes.json` and `tailwind-stacked-layouts-reference-desktop.png`.

Implementation:

- Added `nav aria-label="Primary navigation"` to stacked shell primary navs.
- Added active `aria-current=page` state to primary nav items.
- Added `nav aria-label="Secondary navigation"` and active `aria-current=page` state to the two-row variant.
- Added mobile menu buttons with `aria-expanded` and `aria-controls`.
- Added animated mobile navigation panels with `aria-hidden` while closed.
- Added user menu buttons with `aria-expanded` and `aria-controls`.
- Added open-only `role=menu` and `role=menuitem` for user menu content.
- Added notification, user menu, settings, and mobile nav feedback.
- Corrected the stacked shell's initial menu state so hidden mobile/user menus are not exposed as open.
- Kept scope limited to the Stacked Layouts leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/stacked-layouts/`:
  - `tailwind-stacked-layouts-reference-desktop.png`
  - `local-stacked-layouts-desktop-before.png`
  - `local-stacked-layouts-mobile-before.png`
  - `local-stacked-layouts-desktop-after.png`
  - `local-stacked-layouts-interaction-after.png`
  - `local-stacked-layouts-all-dark-after.png`
  - `local-stacked-layouts-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-shells-stacked-layouts` verified:
  - primary nav count returned 9.
  - initial `aria-current=page` count returned 19.
  - initial expanded button count returned 18.
  - initial expanded true count returned 0.
  - initial expanded false count returned 18.
  - initial user menu role count returned 0.
  - Team click feedback appeared and Team received current state.
  - user menu opened with one `role=menu`, then Settings closed it.
  - notification feedback appeared.
  - Activity tab feedback appeared and received current state.
  - all 9 `Dark` controls were exercised.
  - mobile menu opened with expanded true state.
  - mobile Team click feedback appeared and Team received current state.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
