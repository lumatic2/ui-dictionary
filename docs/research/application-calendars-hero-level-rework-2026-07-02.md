# Application UI Calendars hero-level rework

Date: 2026-07-02
Leaf: Application UI / Data Display / Calendars
Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/data-display/calendars`
Local route: `/?filter=nav%3Aplus-data-display-calendars`

## Reference

- Desktop capture: `docs/research/assets/application-calendars-hero-level-rework-2026-07-02/tailwind-calendars-desktop.png`
- Mobile 390px capture: `docs/research/assets/application-calendars-hero-level-rework-2026-07-02/tailwind-calendars-mobile-390.png`
- Reference metadata: `docs/research/assets/application-calendars-hero-level-rework-2026-07-02/tailwind-calendars-reference.json`

Observed visible examples:

- Small with meetings
- Month view
- Week view
- Day view
- Year view
- Double
- Borderless stacked
- Borderless side-by-side

## Implementation

This pass refreshes the Calendars leaf against new Tailwind desktop and 390px mobile captures and removes cross-preview image reuse.

- Kept the existing 8-example calendar renderer because it already maps to the full Tailwind example set.
- Preserved the small meetings layout, month grid, week grid, day view, year view, double dark calendar, borderless stacked, and borderless side-by-side treatments.
- Replaced the shared per-person avatar files in calendar meeting lists with preview-specific v2 contact sheets.
- Each image-backed calendar preview now receives its own generated sheet:
  - `Small with meetings`: `examples/ui-vocabulary-site/public/assets/calendars/calendar-small-meetings-sheet-v2.png`
  - `Double`: `examples/ui-vocabulary-site/public/assets/calendars/calendar-double-sheet-v2.png`
  - `Borderless stacked`: `examples/ui-vocabulary-site/public/assets/calendars/calendar-borderless-stacked-sheet-v2.png`
  - `Borderless side-by-side`: `examples/ui-vocabulary-site/public/assets/calendars/calendar-borderless-side-by-side-sheet-v2.png`

Image policy applied:

- Imagegen was required because the Tailwind calendar reference includes avatar-backed meeting rows.
- Images are not reused across preview variants. Each image-backed preview has a fresh purpose-fit generated contact sheet.
- The old `examples/ui-vocabulary-site/public/assets/calendars/{leslie-alexander,michael-foster,dries-vincent,lindsay-walton}.png` files remain in the tree but are no longer referenced by the calendar renderer.
- Provenance: `docs/research/assets/application-calendars-hero-level-rework-2026-07-02/calendars-imagegen-provenance.md`

## Verification

- Local before desktop: `docs/research/assets/application-calendars-hero-level-rework-2026-07-02/local-calendars-before-desktop.png`
- Local before mobile: `docs/research/assets/application-calendars-hero-level-rework-2026-07-02/local-calendars-before-mobile-390.png`
- Local desktop after: `docs/research/assets/application-calendars-hero-level-rework-2026-07-02/local-calendars-after-desktop.png`
- Local mobile after: `docs/research/assets/application-calendars-hero-level-rework-2026-07-02/local-calendars-after-mobile-390.png`
- Smoke JSON: `docs/research/assets/application-calendars-hero-level-rework-2026-07-02/local-calendars-smoke.json`

Smoke result:

- Desktop expected example names: 8/8 present.
- Mobile expected example names: 8/8 present.
- Desktop preview images: 4 unique v2 calendar sheets loaded.
- Mobile preview images: 4 unique v2 calendar sheets loaded.
- Desktop horizontal overflow: false.
- Mobile 390px horizontal overflow: false.
