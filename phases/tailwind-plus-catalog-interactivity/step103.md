# Step 103 - Cards page parity pass

Scope:

- Tailwind Plus `Application UI / Layout / Cards` reference page.
- Local `plus-application-layout-cards` leaf and its 10 card preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/layout/cards` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Cards - Official Tailwind UI Components`, h1 `Cards`, and the ten examples `Basic card`, `Card, edge-to-edge on mobile`, `Card with header`, `Card with footer`, `Card with header and footer`, `Card with gray footer`, `Card with gray body`, `Well`, `Well on gray`, and `Well, edge-to-edge on mobile`.
- In-app Browser setup failed with `Browser is not available: iab`; standalone Playwright fallback was used.

Implementation:

- Fixed a smoke-discovered theme-control bug in the card preview renderer.
- The renderer previously ignored the resolved preview `theme`, so all ten `Dark` controls became pressed without changing the card surfaces.
- Cards now respect `theme="dark"` and `theme="light"` while preserving the existing default dark system variants.
- Kept scope limited to the Cards leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/cards/`:
  - `tailwind-cards-reference-desktop.png`
  - `local-cards-desktop-before.png`
  - `local-cards-mobile-before.png`
  - `local-cards-all-dark-before-fix.png`
  - `local-cards-desktop-after.png`
  - `local-cards-all-dark-after.png`
  - `local-cards-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-layout-cards` verified:
  - page heading count returned 1.
  - example heading count returned 10.
  - theme button count returned 30.
  - dark button count returned 10.
  - active System count returned 10 before theme changes.
  - before-fix dark surface count stayed 9 after all Dark controls, proving the bug.
  - after fix, all 10 `Dark` controls were exercised and all 10 exposed `aria-pressed=true`.
  - dark surface count increased from 1 to 27 after Dark.
  - all 10 `Light` controls were exercised and dark surface count returned to 1.
  - mobile render kept 30 theme controls available.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
