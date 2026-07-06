# Step 104 - List containers page parity pass

Scope:

- Tailwind Plus `Application UI / Layout / List containers` reference page.
- Local `plus-application-layout-list-containers` leaf and its 7 list-container preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/layout/list-containers` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS List containers - Official Tailwind UI Components`, h1 `List containers`, and the seven examples `Simple with dividers`, `Card with dividers`, `Card with dividers, full-width on mobile`, `Separate cards`, `Separate cards, full-width on mobile`, `Flat card with dividers`, and `Simple with dividers, full-width on mobile`.
- In-app Browser setup failed with `Browser is not available: iab`; standalone Playwright fallback was used.

Implementation:

- Fixed a smoke-discovered theme-control bug in the list-container preview renderer.
- The renderer previously ignored the resolved preview `theme`, so all seven `Dark` controls became pressed without changing the preview surfaces.
- List containers now respect `theme="dark"` and `theme="light"` while preserving the existing default dark system variants.
- Row skeletons now render dark-aware borders and backgrounds, including separate-card rows.
- Kept scope limited to the List containers leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/list-containers/`:
  - `tailwind-list-containers-reference-desktop.png`
  - `local-list-containers-desktop-before.png`
  - `local-list-containers-mobile-before.png`
  - `local-list-containers-all-dark-before-fix.png`
  - `local-list-containers-desktop-after.png`
  - `local-list-containers-all-dark-after.png`
  - `local-list-containers-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-layout-list-containers` verified:
  - page heading count returned 1.
  - example heading count returned 7.
  - theme button count returned 21.
  - dark button count returned 7.
  - active System count returned 7 before theme changes.
  - before-fix dark surface count stayed 7 after all Dark controls, proving the bug.
  - after fix, all 7 `Dark` controls were exercised and all 7 exposed `aria-pressed=true`.
  - dark surface count increased from 1 to 26 after Dark.
  - dark row count increased from 0 to 30 after Dark.
  - all 7 `Light` controls were exercised and dark counts returned to the system-default baseline.
  - mobile render kept 21 theme controls available.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
