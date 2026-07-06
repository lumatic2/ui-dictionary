# Step 113 - List Pages page parity pass

Scope:

- Local `plus-application-page-examples-list` leaf and its 3 list page preview variants.
- Tailwind Plus Application UI Page Examples list reference URL candidates.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/list-pages` returned 404.
- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/list` returned 404.
- Because Tailwind Plus does not expose a matching public legacy `List Pages` leaf at those routes, this pass used the closest local page-example quality bar: complete preview cards, working state feedback, theme controls, mobile sanity, and no runtime errors.
- Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue; standalone Playwright fallback was used.

Implementation:

- No additional List Pages-specific code patch was required in this pass.
- The shared `app-example-*` renderer fixes from Step 110 were verified on this leaf: no initial `Dashboard selected` feedback, accessible section/metric/row controls, and dark/light preview-theme support.
- Retained and verified the existing list page actions for section selection, export action, metric selection, and row selection.
- Kept the pass scoped to the `List Pages` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/list-pages/`:
  - `tailwind-list-pages-reference-list-pages.png`
  - `tailwind-list-pages-reference-list.png`
  - `local-list-pages-desktop-before.png`
  - `local-list-pages-mobile-before.png`
  - `local-list-pages-interaction-before-fix.png`
  - `local-list-pages-all-dark-before-fix.png`
  - `local-list-pages-all-light-before-fix.png`
  - `local-list-pages-desktop-after.png`
  - `local-list-pages-interaction-after.png`
  - `local-list-pages-all-dark-after.png`
  - `local-list-pages-all-light-after.png`
  - `local-list-pages-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-page-examples-list` verified:
  - page heading count returned 1.
  - example heading count returned 3.
  - theme button count returned 9.
  - dark button count returned 3.
  - action button count returned 118.
  - active System count returned 3 before theme changes.
  - initial `Dashboard selected` feedback count returned 0.
  - section feedback appeared for `Data section opened`.
  - action feedback appeared for `Export selected`.
  - metric feedback appeared for `Open rows opened`.
  - row feedback appeared for `Michael Foster row opened`.
  - all 3 `Dark` controls were exercised and all 3 exposed `aria-pressed=true`.
  - dark surface count increased to 37 after Dark.
  - dark card count increased to 22 after Dark.
  - all 3 `Light` controls were exercised and dark surface count returned to 1.
  - mobile render kept 9 theme controls available.
  - No severe console errors on the local page.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
