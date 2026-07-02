# Feature Sections hero-level rework evidence

Date: 2026-07-01

## Scope

Feature Sections was reworked as the first Hero Sections-level parity sample.
This pass replaces the previous generic skeleton preview with a dedicated
Feature Sections renderer for all 15 visible Tailwind examples.

## Reference

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/feature-sections`
- Local route: `/?filter=nav%3Aplus-marketing-feature-sections`

## Evidence

- Tailwind desktop: `docs/research/assets/feature-sections-hero-level-rework-2026-07-01/tailwind-feature-sections-desktop.png`
- Tailwind mobile: `docs/research/assets/feature-sections-hero-level-rework-2026-07-01/tailwind-feature-sections-mobile.png`
- Local desktop v2: `docs/research/assets/feature-sections-hero-level-rework-2026-07-01/local-feature-sections-desktop-v2.png`
- Local mobile v2: `docs/research/assets/feature-sections-hero-level-rework-2026-07-01/local-feature-sections-mobile-v2.png`
- Local desktop v3 height pass: `docs/research/assets/feature-sections-hero-level-rework-2026-07-01/local-feature-sections-desktop-v3-height.png`
- Local mobile v3 height pass: `docs/research/assets/feature-sections-hero-level-rework-2026-07-01/local-feature-sections-mobile-v3-height.png`
- Local desktop v4 per-preview assets: `docs/research/assets/feature-sections-hero-level-rework-2026-07-01/local-feature-sections-desktop-v4-per-preview-assets.png`
- Local mobile v4 per-preview assets: `docs/research/assets/feature-sections-hero-level-rework-2026-07-01/local-feature-sections-mobile-v4-per-preview-assets.png`
- Generated image assets:
  - `examples/ui-vocabulary-site/public/assets/feature-sections/dashboard-product-screenshot.png`
  - `examples/ui-vocabulary-site/public/assets/feature-sections/large-analytics-screenshot.png`
  - `examples/ui-vocabulary-site/public/assets/feature-sections/bordered-project-screenshot.png`
  - `examples/ui-vocabulary-site/public/assets/feature-sections/left-deployment-screenshot.png`
  - `examples/ui-vocabulary-site/public/assets/feature-sections/contained-panel-screenshot.png`

## What changed

- Added a generated SaaS dashboard screenshot asset for screenshot-based feature examples.
- Replaced numeric skeleton feature markers with Lucide icons.
- Rebuilt the 15 `features-*` variants as feature-section-specific layouts:
  split screenshot, centered 2x2, large screenshot, bordered screenshot, small
  icons, screenshot-left, large icons, contained panel, screenshot panel,
  testimonial, offset grid, code panel, offset list, simple, and 3x2 grid.
- Increased section vertical rhythm so cards read closer to the Tailwind
  reference rather than compact UI Dictionary cards.
- Added explicit preview-height rules. Tailwind Plus examples render as full
  marketing sections inside preview cards, not compact content cards. The local
  renderer now gives Feature Sections a desktop minimum section height and fixed
  screenshot-frame heights so examples like `With product screenshot`,
  `Centered 2x2 grid`, and `With large screenshot` read vertically like the
  reference.

## Repeatable parity rule

Future leaf reworks must compare and record these visual dimensions before
marking a page Hero Sections-level:

- Preview card outer width and border radius.
- Internal section `min-height` at desktop and mobile.
- Vertical padding above the heading, between heading and content, and below the
  content.
- Screenshot or image frame height and crop behavior.
- Image provenance per preview. Do not reuse one generated image across all
  screenshot-like examples. Each preview that visually depends on an image or
  product screenshot needs its own generated asset matched to that example's
  role, crop, color, and layout.
- Whether the reference is a full section, an app screenshot, a compact element,
  or a page-level composition.

For Marketing page sections, default to full-section rhythm first. Do not let
content dictate height if the Tailwind reference uses generous empty space or a
large product screenshot.

When a leaf has multiple image-backed examples, create an asset ledger for that
leaf before implementation:

| Preview | Reference image role | Local asset rule |
| --- | --- | --- |
| Product screenshot | App UI proof, usually cropped inside a frame | Generate a product UI screenshot for this preview only |
| Large screenshot | Primary visual proof, larger crop and more empty space | Generate a wider, calmer screenshot or illustration for this preview only |
| Split image/photo | Brand or product context image | Generate a composition matched to the section's crop |
| Background image | Atmospheric but inspectable full-bleed media | Generate a background image with safe text contrast |

Generic placeholder reuse is allowed only for non-image structural examples
where the Tailwind reference has no meaningful image or screenshot.

## Feature Sections asset ledger

| Preview | Reference image role | Local asset | Prompt intent |
| --- | --- | --- | --- |
| With product screenshot | Split proof image beside feature copy | `dashboard-product-screenshot.png` | Light SaaS deployment dashboard with sidebar, search, table rows, green status dots, and purple accents |
| With large screenshot | Large centered product proof | `large-analytics-screenshot.png` | Spacious analytics dashboard with table, line chart, sidebar, and calm enterprise UI |
| With large bordered screenshot | Screenshot framed by visible border | `bordered-project-screenshot.png` | Light project/document management UI composed for a bordered frame and 4:3 crop |
| With product screenshot on left | Split proof image on the left side | `left-deployment-screenshot.png` | Deployment activity dashboard with important content weighted to the left half |
| With product screenshot panel | Screenshot inside contained panel | `contained-panel-screenshot.png` | Compact dashboard panel inside a soft pale-blue container with status cards and table |

Non-image Feature Sections examples use Lucide icons and layout structure only:
`Centered 2x2 grid`, `Simple three column with small icons`, `Simple three
column with large icons`, `Contained in panel`, `With testimonial`, `Offset 2x2
grid`, `With code example panel`, `Offset with feature list`, `Simple`, and
`Simple 3x2 grid`.

## Verification

- `npm run build` passed.
- `npm run lint` passed with the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- Chrome route smoke on the local Feature Sections route found desktop
  horizontal overflow false and all 15 expected example headings.

## Remaining visual gap

This is now screenshot/icon/layout-backed and much closer to the Tailwind page,
but it still is not a pixel copy. The local shell keeps UI Dictionary branding,
Korean description copy, and generated/native assets instead of Tailwind-owned
screenshots or component code.
