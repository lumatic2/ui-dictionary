# Step 85 - Popovers page parity pass

Scope:

- Tailwind Plus `Application UI / Overlays / Popovers` reference page.
- Local `plus-overlays-popovers` leaf and its 3 popover preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/overlays/popovers` currently returns 404.
- The 404 reference state is recorded in `capture-notes.json` and `tailwind-popovers-reference-desktop.png`.

Implementation:

- Added `aria-expanded` and `aria-controls` to all popover triggers.
- Added open-only `role=dialog` to basic and form popovers.
- Added open-only `role=tooltip` to the tooltip-like popover.
- Added open-only `aria-describedby` on the tooltip trigger.
- Added `aria-labelledby` and `aria-describedby` to dialog popovers.
- Added `aria-hidden` to closed popover panels.
- Converted the form popover to a real `form` submit path.
- Added Escape dismissal.
- Added visible feedback for option selection, open/close, form save, tooltip close, Got it, and Escape dismissal.
- Kept scope limited to the Popovers leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/popovers/`:
  - `tailwind-popovers-reference-desktop.png`
  - `local-popovers-desktop-before.png`
  - `local-popovers-mobile-before.png`
  - `local-popovers-desktop-after.png`
  - `local-popovers-interaction-after.png`
  - `local-popovers-all-dark-after.png`
  - `local-popovers-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-overlays-popovers` verified:
  - open dialog count returned 2.
  - open tooltip count returned 1.
  - form count returned 1.
  - `aria-expanded` count returned 3, with all 3 initially true.
  - `aria-controls` count returned 3.
  - tooltip trigger `aria-describedby` count returned 1 while open.
  - Draft selection feedback appeared and reduced dialog count from 2 to 1.
  - Options trigger reopened the basic popover and restored dialog count to 2.
  - form Save feedback appeared and reduced dialog count from 2 to 1.
  - tooltip trigger closed the tooltip and removed tooltip trigger `aria-describedby`.
  - Got it feedback appeared and kept tooltip count at 0.
  - Escape dismissal feedback appeared.
  - all 3 `Dark` controls were exercised.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
