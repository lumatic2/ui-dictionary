# Tailwind Hero Sections Page Mirroring Plan

Source reference:
- URL: https://tailwindcss.com/plus/ui-blocks/marketing/sections/heroes
- Full-page screenshot: `docs/research/tailwind-heroes-fullpage-2026-07-01.png`
- Captured on: 2026-07-01

## What Tailwind Is Doing

The Tailwind Plus `Hero Sections` page is a productized gallery page, not a glossary or card catalog.

Page structure:

1. Global header
   - Left product mark and promo strip.
   - Main product tabs: `UI Blocks`, `Templates`, `UI Kit`.
   - Utility actions: search, sign in, full access.

2. Persistent left navigation
   - Primary axes: `Marketing`, `Application UI`, `Ecommerce`, `Documentation`.
   - For the selected axis, a static table of contents appears below.
   - `Marketing` expands into grouped sections:
     - `Page Sections`
     - `Elements`
     - `Feedback`
     - `Page Examples`

3. Page intro
   - Breadcrumb: `UI Blocks / Marketing / Page Sections`.
   - H1: `Hero Sections`.
   - One short explanatory paragraph.
   - No large marketing hero, no card grid, no drawer.

4. Repeated example blocks
   - Each block has a compact title row.
   - The row contains the example name plus small actions such as `Preview`, `Code`, viewport/theme icons, and `Get the code`.
   - The preview itself is the main content: a large framed live example.
   - Examples are stacked vertically with generous whitespace.

5. Footer directory
   - At the bottom, Tailwind repeats a broad directory sitemap by product/category.

Observed examples on the reference page:

1. `Simple centered`
2. `Split with screenshot`
3. `Split with bordered screenshot`
4. `Split with code example`
5. `Simple centered with background image`
6. `With bordered app screenshot`
7. `With app screenshot`
8. `With phone mockup`
9. `Split with image`
10. `With angled image on right`
11. `With image tiles`
12. `With offset image`

## What We Should Mirror

We should mirror the information architecture and page behavior, not the exact Tailwind visual assets or proprietary code.

Keep:
- Left navigation hierarchy and interaction model.
- One page per selected table-of-contents item.
- Intro block with breadcrumb, title, and short purpose copy.
- Vertical stack of large preview examples.
- Compact per-example toolbar.
- Page footer directory later, after the core page is stable.

Adapt:
- Replace Tailwind component previews with our UI Vocabulary-native examples.
- Replace `Get the code` with one of:
  - `관련 term 열기`
  - `구성 용어 보기`
  - `프롬프트로 복사`
- Keep `Preview` as the default mode.
- Defer full `Code` mode unless we decide to maintain reusable snippets.

Avoid:
- Returning to term cards.
- Drawer-based detail panes.
- Marketing landing-page composition.
- Rendering every example as a small card grid.

## Implementation Plan

### P1. Data Model For Example Pages

Add a page-level catalog model separate from individual terms.

Recommended shape:

```ts
type ExamplePage = {
  id: string
  navFilter: TermFilter
  breadcrumb: string[]
  title: string
  description: string
  examples: ExampleBlock[]
}

type ExampleBlock = {
  id: string
  title: string
  description?: string
  tags: string[]
  relatedTermIds: string[]
  preview: ExamplePreviewSpec
}
```

Success criteria:
- `Hero Sections` page is generated from structured data.
- Adding `Feature Sections` later does not require copying the whole page component.

### P2. Page Shell Matching Tailwind

Create a reusable page renderer for UI Blocks category pages.

Required sections:
- Breadcrumb line.
- H1 and one paragraph.
- Stacked example list.
- Each example block has:
  - title
  - `Preview` active pill
  - optional `Code` placeholder or disabled state
  - one right-side action
  - large preview frame

Success criteria:
- `Marketing > Hero Sections` no longer shows generic term rows.
- It opens as a complete page with stacked large examples.

### P3. Hero Sections Example Set

Implement the first 6 examples first, then extend to 12.

First pass:
1. Simple centered
2. Split with screenshot
3. Split with bordered screenshot
4. Split with code example
5. Simple centered with background image
6. With bordered app screenshot

Second pass:
7. With app screenshot
8. With phone mockup
9. Split with image
10. With angled image on right
11. With image tiles
12. With offset image

Success criteria:
- The first pass already feels like a complete Tailwind-style page.
- The second pass reaches parity with the reference page's example density.

### P4. Preview Renderer Quality

Replace the current small mock cards with large, stable preview frames.

Preview frame rules:
- Fixed responsive width inside content column.
- Stable min-height per example.
- No nested card-in-card feel.
- Preview content should look like a real page section.
- Use real UI vocabulary labels where helpful, but do not over-explain inside the preview.

Success criteria:
- At 1440px+ desktop, previews feel inspectable.
- On mobile, preview frames collapse without text overlap.

### P5. Controls And Interactions

Minimum controls:
- `Preview` selected by default.
- `구성 용어 보기` opens or scrolls to related terms below the preview.
- `관련 term 열기` opens the primary term page.

Deferred controls:
- `Code` tab.
- viewport toggle.
- theme toggle.
- copy prompt/code.

Stop point:
- Decide whether `Code` should mean actual React/Tailwind snippet, prompt snippet, or no code at all.

### P6. Footer Directory

After the page body works, add a Tailwind-like footer directory.

Columns:
- Marketing
- Application UI
- Ecommerce
- Templates & UI Kit

Success criteria:
- It helps navigation without becoming the main UI.

## Recommended Next Move

Implement P1-P3 first for `Marketing / Page Sections / Hero Sections`.

Do not attempt every category at once. The Hero Sections page should become the canonical page template. Once it passes visual smoke, reuse the renderer for `Feature Sections`, `Pricing Sections`, and `Application UI / Forms`.

## Decision Needed Before P5

The only important product decision is what to do with `Code`.

Recommendation:
- Do not build real code tabs yet.
- Use `Preview` plus `관련 term 열기` for the first implementation.
- Add `Code` later only if we commit to maintaining snippets.
