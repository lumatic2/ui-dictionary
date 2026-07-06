# Step 102 - Containers page parity pass

Scope:

- Tailwind Plus `Application UI / Layout / Containers` reference page.
- Local `plus-application-layout-containers` leaf and its 5 container preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/layout/containers` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Containers - Official Tailwind UI Components`, h1 `Containers`, and the five examples `Full-width on mobile, constrained with padded content above`, `Constrained with padded content`, `Full-width on mobile, constrained to breakpoint with padded content above mobile`, `Constrained to breakpoint with padded content`, and `Narrow constrained with padded content`.
- In-app Browser setup failed with `Browser is not available: iab`; standalone Playwright fallback was used.

Implementation:

- Fixed a smoke-discovered theme-control bug in the container preview renderer.
- The renderer previously ignored the resolved preview `theme`, so all five `Dark` controls became pressed without changing the container surfaces.
- Containers now respect `theme="dark"` and `theme="light"` while preserving the existing default dark system variant.
- Kept scope limited to the Containers leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/containers/`:
  - `tailwind-containers-reference-desktop.png`
  - `local-containers-desktop-before.png`
  - `local-containers-mobile-before.png`
  - `local-containers-all-dark-before-fix.png`
  - `local-containers-desktop-after.png`
  - `local-containers-all-dark-after.png`
  - `local-containers-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-layout-containers` verified:
  - theme button count returned 15.
  - dark button count returned 5.
  - active System count returned 5 before theme changes.
  - before-fix dark surface count stayed 2 after all Dark controls, proving the bug.
  - after fix, all 5 `Dark` controls were exercised and all 5 exposed `aria-pressed=true`.
  - dark surface count increased from 1 to 6 after Dark.
  - all 5 `Light` controls were exercised and dark surface count returned to 1.
  - mobile render included the first container example.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
