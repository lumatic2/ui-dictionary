# Step 114 - Auth Pages page parity pass

Scope:

- Local `plus-application-page-examples-auth` leaf and its 3 auth page preview variants.
- Tailwind Plus Application UI Page Examples auth reference URL candidates.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/auth-pages` returned 404.
- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/authentication-pages` returned 404.
- Because Tailwind Plus does not expose a matching public legacy `Auth Pages` leaf at those routes, this pass used the closest local page-example quality bar: complete preview cards, working state feedback, theme controls, mobile sanity, and no runtime errors.
- Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue; standalone Playwright fallback was used.

Implementation:

- Fixed a smoke-discovered theme-control bug in the `app-example-auth` renderer.
- Before the fix, all 3 `Dark` controls became pressed but auth preview cards stayed effectively light because the auth-specific branch ignored the resolved preview `theme`.
- Made auth preview shells, form cards, sign-in method buttons, inputs, and feedback surfaces respond to `theme="dark"` and `theme="light"`.
- Added accessible labels for sign-in method buttons so smoke tests and assistive technology can operate `Email`, `Google`, and `GitHub` directly without relying on ambiguous visible text.
- Retained and verified existing auth interactions for method selection and continue action.
- Kept the pass scoped to the `Auth Pages` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/auth-pages/`:
  - `tailwind-auth-pages-reference-auth-pages.png`
  - `tailwind-auth-pages-reference-authentication-pages.png`
  - `local-auth-pages-desktop-before.png`
  - `local-auth-pages-mobile-before.png`
  - `local-auth-pages-interaction-before-fix.png`
  - `local-auth-pages-all-dark-before-fix.png`
  - `local-auth-pages-all-light-before-fix.png`
  - `local-auth-pages-desktop-after.png`
  - `local-auth-pages-interaction-after-fix.png`
  - `local-auth-pages-all-dark-after.png`
  - `local-auth-pages-all-light-after.png`
  - `local-auth-pages-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-page-examples-auth` verified:
  - page heading count returned 1.
  - example heading count returned 3.
  - theme button count returned 9.
  - dark button count returned 3.
  - action button count returned 100.
  - active System count returned 3 before theme changes.
  - initial `Dashboard selected` feedback count returned 0.
  - before fix, dark surface count stayed 1 after pressing all `Dark` controls, proving the theme bug.
  - sign-in feedback appeared for `Google sign-in selected`.
  - sign-in feedback appeared for `GitHub sign-in selected`.
  - action feedback appeared for `Continue selected`.
  - after fix, all 3 `Dark` controls were exercised and all 3 exposed `aria-pressed=true`.
  - dark surface count increased from 1 to 24 after Dark.
  - dark card count increased to 24 after Dark.
  - all 3 `Light` controls were exercised and dark surface count returned to 1.
  - mobile render kept 9 theme controls available.
  - No severe console errors on the local page.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
