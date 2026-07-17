# Calendars hero-level rework

Date: 2026-07-01
Scope: Application UI / Data Display / Calendars

## Why this was reworked

The previous local Calendars page exposed the eight Tailwind example names, but
every preview reused one generic `calendar-page` renderer. That missed the
reference's major layout differences: meeting list + month picker, month grid,
dark week grid, day timeline with mini calendar, year grid, double dark month
picker, borderless stacked, and borderless side-by-side schedules.

## Reference and local evidence

- Tailwind desktop: `docs/research/assets/data-display-calendars-hero-level-rework-2026-07-01/tailwind-calendars-desktop.png`
- Tailwind mobile: `docs/research/assets/data-display-calendars-hero-level-rework-2026-07-01/tailwind-calendars-mobile.png`
- Tailwind full desktop: `docs/research/assets/data-display-calendars-hero-level-rework-2026-07-01/tailwind-calendars-full-desktop.png`
- Local desktop after: `docs/research/assets/data-display-calendars-hero-level-rework-2026-07-01/local-calendars-desktop.png`
- Local mobile after: `docs/research/assets/data-display-calendars-hero-level-rework-2026-07-01/local-calendars-mobile.png`
- Local full desktop after: `docs/research/assets/data-display-calendars-hero-level-rework-2026-07-01/local-calendars-full-desktop.png`

Before captures are also preserved in the same folder:

- `local-calendars-before-desktop.png`
- `local-calendars-before-mobile.png`

## Generated assets

The `Small with meetings` and schedule variants use fresh, calendar-specific
avatar images:

- `examples/ui-vocabulary-site/public/assets/calendars/leslie-alexander.png`
- `examples/ui-vocabulary-site/public/assets/calendars/michael-foster.png`
- `examples/ui-vocabulary-site/public/assets/calendars/dries-vincent.png`
- `examples/ui-vocabulary-site/public/assets/calendars/lindsay-walton.png`

Sources remain in `C:\Users\yusun\.codex\generated_images\019f1a9a-1c5f-7a40-81e5-606a8918e471\`:

- `ig_015972fcba28071e016a44cfa593e481919c2996a62490c087.png`
- `ig_015972fcba28071e016a44d00083688191a16a6c6b9243b1e3.png`
- `ig_015972fcba28071e016a44d056694481918f11f8bdaefddc65.png`
- `ig_015972fcba28071e016a44d0c38d6c81918da77ce7f9d8598e.png`

These assets are leaf-specific. They may be reused within this Calendars leaf
for repeated meeting-list variants, but should not be reused on unrelated
leaves.

## Variant mapping

| Tailwind example | Local variant |
| --- | --- |
| Small with meetings | `calendar-small-meetings` |
| Month view | `calendar-month-view` |
| Week view | `calendar-week-view` |
| Day view | `calendar-day-view` |
| Year view | `calendar-year-view` |
| Double | `calendar-double` |
| Borderless stacked | `calendar-borderless-stacked` |
| Borderless side-by-side | `calendar-borderless-side-by-side` |

## Reusable parity rule

Calendar leaves need layout-level parity:

- Month, week, day, year, and double views should be structurally distinct.
- Meeting-list variants need real generated avatars when the reference shows
  people.
- Mobile ordering must follow the reference. For `Small with meetings`, the
  calendar appears before the meeting list on mobile.
- Date grids should not show impossible in-month numbers; overflow days are
  muted as next-month values.
- Dark variants need separate surface, divider, and text treatment.

## Verification

- `npm run build`
- `npm run lint` (passes with existing shadcn fast-refresh warnings only)
- `python scripts\validate-ui-vocabulary.py`
- `npm run audit:visuals`
- Chrome smoke: found all 8 example headings, confirmed generated calendar
  avatar images loaded, and horizontal overflow false.
