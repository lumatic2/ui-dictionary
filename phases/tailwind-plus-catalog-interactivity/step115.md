# Step 115 - Onboarding Pages page parity pass

Scope:

- Local `plus-application-page-examples-onboarding` leaf and its 3 onboarding page preview variants.
- Tailwind Plus Application UI Page Examples onboarding reference URL candidates.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/onboarding-pages` returned 404.
- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/onboarding` returned 404.
- Because Tailwind Plus does not expose a matching public legacy `Onboarding Pages` leaf at those routes, this pass used the closest local page-example quality bar: complete preview cards, working state feedback, theme controls, mobile sanity, and no runtime errors.
- Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue; standalone Playwright fallback was used.

Implementation:

- Strengthened dark/light theme support in the `app-example-onboarding` renderer.
- Before the fix, all 3 `Dark` controls became pressed but most onboarding preview surfaces remained light because the onboarding-specific branch only partially reflected the resolved preview `theme`.
- Made onboarding preview shells, sidebar, step buttons, task cards, task status text, and feedback surfaces respond to `theme="dark"` and `theme="light"`.
- Added accessible labels for onboarding step buttons so smoke tests and assistive technology can operate the step navigation directly.
- Retained and verified existing onboarding interactions for step navigation, task completion, skip action, and continue action.
- Kept the pass scoped to the `Onboarding Pages` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/onboarding-pages/`:
  - `tailwind-onboarding-pages-reference-onboarding-pages.png`
  - `tailwind-onboarding-pages-reference-onboarding.png`
  - `local-onboarding-pages-desktop-before.png`
  - `local-onboarding-pages-mobile-before.png`
  - `local-onboarding-pages-interaction-before-fix.png`
  - `local-onboarding-pages-all-dark-before-fix.png`
  - `local-onboarding-pages-all-light-before-fix.png`
  - `local-onboarding-pages-desktop-after.png`
  - `local-onboarding-pages-interaction-after-fix.png`
  - `local-onboarding-pages-all-dark-after.png`
  - `local-onboarding-pages-all-light-after.png`
  - `local-onboarding-pages-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-page-examples-onboarding` verified:
  - page heading count returned 1.
  - example heading count returned 3.
  - theme button count returned 9.
  - dark button count returned 3.
  - action button count returned 115.
  - active System count returned 3 before theme changes.
  - initial `Dashboard selected` feedback count returned 0.
  - before fix, dark surface count only reached 7 after pressing all `Dark` controls, proving partial theme coverage.
  - step feedback appeared for `Workspace step opened`.
  - task feedback appeared for `Import data completed`.
  - action feedback appeared for `Skip for now selected`.
  - action feedback appeared for `Continue setup selected`.
  - after fix, all 3 `Dark` controls were exercised and all 3 exposed `aria-pressed=true`.
  - dark surface count increased from 1 to 30 after Dark.
  - dark card count increased to 24 after Dark.
  - all 3 `Light` controls were exercised and dark surface count returned to 1.
  - mobile render kept 9 theme controls available.
  - No severe console errors on the local page.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
