# Content Sections hero-level rework

Date: 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/content-sections`
- Local route: `/?filter=nav%3Aplus-marketing-content-sections`
- Target depth: `hero-level-rework`
- Visible examples: 7

## Reference capture

- Desktop: `docs/research/assets/content-sections-hero-level-rework-2026-07-02/tailwind-content-sections-desktop.png`
- Desktop tall: `docs/research/assets/content-sections-hero-level-rework-2026-07-02/tailwind-content-sections-desktop-tall.png`
- Mobile 390px: `docs/research/assets/content-sections-hero-level-rework-2026-07-02/tailwind-content-sections-mobile-390.png`

Tailwind visible examples confirmed through Chrome:

1. With sticky product screenshot
2. With testimonial
3. With image titles
4. Two columns with screenshot
5. With testimonial and stats
6. Split with image
7. Centered

## Implementation changes

- Replaced the previous shallow skeleton Content renderer in `examples/ui-vocabulary-site/src/App.tsx` with dedicated branches for all 7 Content examples.
- Added fresh Content-specific assets:
  - product screenshot for sticky screenshot preview.
  - three image-title/editorial assets for the mission image grid.
  - product screenshot for two-column screenshot preview.
  - split office photo for split-with-image preview.
- Matched Tailwind's content-specific patterns:
  - text plus sticky screenshot.
  - dark content with testimonial quote.
  - mission/story content with image tiles and stats.
  - dark two-column content with wide app screenshot.
  - testimonial card plus stat row.
  - split image plus long-form workflow copy.
  - centered article/prose section.

## Local captures

- Before desktop: `docs/research/assets/content-sections-hero-level-rework-2026-07-02/local-content-sections-before-desktop.png`
- Before mobile 390px: `docs/research/assets/content-sections-hero-level-rework-2026-07-02/local-content-sections-before-mobile-390.png`
- After desktop: `docs/research/assets/content-sections-hero-level-rework-2026-07-02/local-content-sections-after-desktop.png`
- After mobile 390px: `docs/research/assets/content-sections-hero-level-rework-2026-07-02/local-content-sections-after-mobile-390.png`

## Verification

- `npm run build` passed from `examples/ui-vocabulary-site`.
- `npm run audit:visuals` passed.
- `npm run lint` passed with only the pre-existing shadcn fast-refresh warnings.
- `python scripts\validate-ui-vocabulary.py` passed.
- Chrome DOM smoke confirmed all 7 Content headings, 6 unique `/assets/content-sections/` image sources, and desktop horizontal overflow false.
- Mobile was verified by fresh 390px Chrome CLI capture.

## Repeatability note

Content/image-backed leaves should not reuse prior leaf assets. Product screenshots and editorial images should be generated per preview, with extra per-card variation when a preview contains a multi-image grid.
