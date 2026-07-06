# Step 105 - Media Objects page parity pass

Scope:

- Tailwind Plus `Application UI / Layout / Media Objects` reference page.
- Local `plus-application-layout-media-objects` leaf and its 8 media-object preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/layout/media-objects` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Media Objects - Official Tailwind UI Components`, h1 `Media Objects`, and the eight examples `Basic`, `Aligned to center`, `Aligned to bottom`, `Stretched to fit`, `Media on right`, `Basic responsive`, `Wide responsive`, and `Nested`.
- In-app Browser setup failed with `Browser is not available: iab`; standalone Playwright fallback was used.

Implementation:

- Fixed a smoke-discovered theme-control bug in the media-object preview renderer.
- The renderer previously ignored the resolved preview `theme`, so all eight `Dark` controls became pressed without changing the preview surfaces or text.
- Media Objects now respect `theme="dark"` and `theme="light"` while preserving the existing default dark system variants.
- Kept scope limited to the Media Objects leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/media-objects/`:
  - `tailwind-media-objects-reference-desktop.png`
  - `local-media-objects-desktop-before.png`
  - `local-media-objects-mobile-before.png`
  - `local-media-objects-all-dark-before-fix.png`
  - `local-media-objects-desktop-after.png`
  - `local-media-objects-all-dark-after.png`
  - `local-media-objects-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-layout-media-objects` verified:
  - page heading count returned 1.
  - example heading count returned 8.
  - theme button count returned 24.
  - dark button count returned 8.
  - active System count returned 8 before theme changes.
  - before-fix dark surface count stayed 9 and dark text count stayed 12 after all Dark controls, proving the bug.
  - after fix, all 8 `Dark` controls were exercised and all 8 exposed `aria-pressed=true`.
  - dark surface count increased from 1 to 19 after Dark.
  - dark text count increased from 2 to 22 after Dark.
  - all 8 `Light` controls were exercised and dark counts returned to the system-default baseline.
  - mobile render kept 24 theme controls available.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
