# Step 107 - Home Screens page parity pass

Scope:

- Tailwind Plus `Application UI / Page Examples / Home Screens` reference page.
- Local `plus-application-page-examples-home-screens` leaf and its 2 home-screen preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/home-screens` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Home Screens - Official Tailwind UI Components`, h1 `Home Screens`, and the two examples `Sidebar` and `Stacked`.
- In-app Browser setup failed with `Browser is not available: iab`; standalone Playwright fallback was used.

Implementation:

- Fixed a smoke-discovered theme-control bug in the sidebar home-screen preview.
- The sidebar home-screen previously ignored the resolved preview `theme`, so both `Light` controls became pressed while the sidebar preview stayed dark.
- The sidebar home-screen now respects `theme="dark"` and `theme="light"` while preserving the existing default system dark presentation.
- Retained the existing stateful interactions for sidebar and stacked home-screen examples.
- Kept scope limited to the Home Screens leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/home-screens/`:
  - `tailwind-home-screens-reference-desktop.png`
  - `local-home-screens-desktop-before.png`
  - `local-home-screens-mobile-before.png`
  - `local-home-screens-all-dark-before-fix.png`
  - `local-home-screens-desktop-after.png`
  - `local-home-screens-interaction-after.png`
  - `local-home-screens-interaction-after-fix.png`
  - `local-home-screens-all-dark-after.png`
  - `local-home-screens-all-light-after.png`
  - `local-home-screens-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-page-examples-home-screens` verified:
  - page heading count returned 1.
  - example heading count returned 2.
  - theme button count returned 6.
  - dark button count returned 2.
  - action button count returned 123.
  - active System count returned 2 before theme changes.
  - search feedback appeared.
  - deployment selection feedback appeared.
  - activity feed feedback appeared.
  - new invoice feedback appeared.
  - metric selection feedback appeared.
  - client selection feedback appeared.
  - after fix, all 2 `Dark` controls were exercised and all 2 exposed `aria-pressed=true`.
  - dark surface count increased from 2 to 30 after Dark.
  - all 2 `Light` controls were exercised and dark surface count returned to 2.
  - mobile render kept 6 theme controls available.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
