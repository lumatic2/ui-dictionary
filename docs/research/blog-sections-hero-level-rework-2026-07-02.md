# Blog Sections hero-level rework

Date: 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/blog-sections`
- Local route: `/?filter=nav%3Aplus-marketing-blog-sections`
- Target depth: `hero-level-rework`
- Visible examples: 7

## Reference capture

- Desktop: `docs/research/assets/blog-sections-hero-level-rework-2026-07-02/tailwind-blog-sections-desktop.png`
- Desktop tall: `docs/research/assets/blog-sections-hero-level-rework-2026-07-02/tailwind-blog-sections-desktop-tall.png`
- Mobile 390px: `docs/research/assets/blog-sections-hero-level-rework-2026-07-02/tailwind-blog-sections-mobile-390.png`

Tailwind visible examples confirmed through Chrome:

1. Three-column
2. Three-column with images
3. Three-column with background images
4. Single-column
5. Single-column with images
6. With featured post
7. With photo and list

## Implementation changes

- Replaced the previous shallow shared Blog renderer in `examples/ui-vocabulary-site/src/App.tsx` with dedicated branches for all 7 Blog examples.
- Matched Tailwind's taller preview rhythm with explicit `min-h`, wider inner containers, large top/bottom padding, and desktop-to-mobile stacking.
- Added real generated Blog-specific images for the image-backed previews:
  - `three-column-images`: 3 new editorial thumbnails.
  - `three-column-bg-images`: 3 new dark-overlay background thumbnails.
  - `single-column-images`: 3 new row thumbnails.
  - `photo-and-list`: 1 new large office photo.
- Did not add an image to `with-featured-post` because the Tailwind reference is a dark featured article/list layout without a photo.

## Local captures

- Before desktop: `docs/research/assets/blog-sections-hero-level-rework-2026-07-02/local-blog-sections-before-desktop.png`
- Before mobile 390px: `docs/research/assets/blog-sections-hero-level-rework-2026-07-02/local-blog-sections-before-mobile-390.png`
- After desktop: `docs/research/assets/blog-sections-hero-level-rework-2026-07-02/local-blog-sections-after-desktop.png`
- After mobile 390px: `docs/research/assets/blog-sections-hero-level-rework-2026-07-02/local-blog-sections-after-mobile-390.png`

## Verification

- `npm run build` passed from `examples/ui-vocabulary-site`.
- `npm run audit:visuals` passed.
- `npm run lint` passed with only the pre-existing shadcn fast-refresh warnings.
- `python scripts\validate-ui-vocabulary.py` passed.
- Chrome DOM smoke confirmed all 7 Blog headings, 10 unique `/assets/blog-sections/` image sources, and desktop horizontal overflow false.
- Mobile was verified by fresh 390px Chrome CLI capture; the Chrome extension wrapper did not expose a viewport resize API for a separate mobile DOM smoke.

## Repeatability note

For future image-backed preview work, do not reuse old leaf assets. Generate preview-specific assets, copy them from `$CODEX_HOME/generated_images/...` into the workspace under a leaf-specific asset directory, and record source mapping in the provenance file.
