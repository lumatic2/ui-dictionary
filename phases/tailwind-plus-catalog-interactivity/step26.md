# Step 26 - Template code snippet language consistency

Date: 2026-07-03

## Scope

- Marketing and template leaf Code tabs that expose HTML/React/Vue language switching.
- Residual source-level `codePlaceholder` copy from early leaf scaffolding.
- Locked code modal copy that still sounded like future implementation work instead of a deliberate Tailwind Plus-style access boundary.

## Implementation

- Removed the unused `codePlaceholder` field from marketing section examples.
- Removed stale placeholder/mock/future-code strings from Hero Section examples.
- Updated implementation notes so the copy button is described as an active clipboard action.
- Fixed generic Code tab language switching so non-specialized examples now render real HTML and Vue snippets when those options are selected, instead of leaking TSX while the selector says HTML or Vue.
- Kept specialized React snippets for richer hero image variants, but route non-React selections through the generic language-specific snippet generator.
- Reworded the locked code modal to present the first public Code tab and later locked examples as an intentional Plus-style pattern, not an unfinished feature.

## Verification

- `rg` scan confirmed no residual `codePlaceholder`, `placeholder입니다`, `mock UI`, stale future-code, or stale copy-action wording in the rendered App/source targets. Remaining `placeholder` text is a legitimate documentation prop description.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Browser smoke on the correct `ui-dictionary` dev server at `http://127.0.0.1:5174` passed:
  - Hero Sections Code tab switched to Vue and showed `CenteredHero.vue` plus `<template>`.
  - Hero Sections Code tab switched to HTML and showed `centered-hero.html` plus the expected `<section>` snippet.
  - Feature Sections generic Code tab switched to Vue, showed a Vue filename/template, and did not leak the TSX `export function WithProductScreenshot` body.
  - Command Palettes leaf rendered without horizontal overflow and without severe console warnings.

## Notes

- Port `5173` was already occupied by `development-dictionary`; local verification used `5174` for this repo.
- Chrome extension backend connected but did not expose the expected Playwright page methods in this session, so local page smoke used standalone Playwright after confirming the Chrome fallback issue.
