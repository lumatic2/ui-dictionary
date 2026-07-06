# Step 89 - Avatars page parity pass

Scope:

- Tailwind Plus `Application UI / Elements / Avatars` reference page.
- Local `plus-application-elements-avatars` leaf and its 11 avatar preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/elements/avatars` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Avatars - Official Tailwind UI Components`, h1 `Avatars`, and 28 detected example text nodes.

Implementation:

- Added accessible avatar buttons for circular, rounded, notification, group, placeholder, and with-text avatar examples.
- Added `aria-pressed` selected state for avatar and placeholder selections.
- Added visible feedback for avatar selection, placeholder selection, and View profile.
- Added `role=status` notification dots with `busy`, `online`, and `offline` labels.
- Added hover, focus, press, and selected-ring motion states.
- Added z-index handling for overlapped grouped avatars so visible group targets remain clickable.
- Fixed Avatars theme handling so the preview `Dark` and `Light` controls update avatar surfaces while preserving default dark examples.
- Kept scope limited to the Avatars leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/avatars/`:
  - `tailwind-avatars-reference-desktop.png`
  - `local-avatars-desktop-before.png`
  - `local-avatars-mobile-before.png`
  - `local-avatars-desktop-after.png`
  - `local-avatars-interaction-after.png`
  - `local-avatars-all-dark-after.png`
  - `local-avatars-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-elements-avatars` verified:
  - avatar button count returned 61.
  - placeholder avatar button count returned 10.
  - status count returned 20.
  - busy/online/offline status labels returned 8/8/4.
  - View profile count returned 1.
  - Tom Cook avatar feedback appeared.
  - TW avatar 3 selection feedback appeared and received pressed state.
  - View profile feedback appeared.
  - all 11 `Dark` controls were exercised and all 11 avatar surfaces switched to dark styling.
  - mobile Tom Cook feedback appeared.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
