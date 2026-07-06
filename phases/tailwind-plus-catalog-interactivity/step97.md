# Step 97 - Textareas page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Textareas` reference page.
- Local `plus-forms-textareas` leaf and its 5 textarea preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/textareas` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Textareas - Official Tailwind UI Components`, h1 `Textareas`, and the five examples `Simple`, `With avatar and actions`, `With underline and actions`, `With title and pill actions`, and `With preview button`.
- In-app Browser setup failed with `Browser is not available: iab`; standalone Playwright fallback was used.

Implementation:

- Added `aria-pressed` to the shared `PreviewThemeToggle` buttons so System, Light, and Dark controls expose selected state during smoke verification.
- Added per-variant controlled draft state for the Textareas title-and-pill composer title and description fields.
- Fixed a smoke-discovered bug where the title-and-pill composer description reset after Assign/Create feedback rerenders.
- Kept the five Textareas examples aligned with the Tailwind reference structure: simple textarea, avatar composer, underline composer, dark title/pill composer, and preview-tab writer.
- Kept scope limited to the Textareas leaf plus the shared preview theme toggle accessibility state.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/textareas/`:
  - `tailwind-textareas-reference-desktop.png`
  - `local-textareas-desktop-before.png`
  - `local-textareas-mobile-before.png`
  - `local-textareas-desktop-after.png`
  - `local-textareas-interaction-after.png`
  - `local-textareas-all-dark-after.png`
  - `local-textareas-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-textareas` verified:
  - textarea count returned 5.
  - labelled textarea count returned 5.
  - theme button count returned 15.
  - dark button count returned 5.
  - active System count returned 5 before theme changes.
  - avatar composer value persisted as `Avatar composer note`.
  - underline composer value persisted as `Underline composer note`.
  - title value persisted as `Launch task`.
  - title-and-pill description value persisted as `Dark card task description`.
  - preview-tab writer rendered `Preview composer note` in Preview mode.
  - Attach file feedback and Create feedback appeared.
  - all 5 `Dark` controls were exercised and all 5 exposed `aria-pressed=true`.
  - mobile composer edit persisted and showed posted feedback.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
