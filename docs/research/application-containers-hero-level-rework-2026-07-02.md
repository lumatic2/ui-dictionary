# Application UI / Layout / Containers hero-level rework

Date: 2026-07-02
Route: `/?filter=nav%3Aplus-application-layout-containers`
Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/layout/containers`

## Capture Evidence

- Tailwind desktop: `docs/research/assets/application-containers-hero-level-rework-2026-07-02/tailwind-containers-desktop.png`
- Tailwind mobile 390px: `docs/research/assets/application-containers-hero-level-rework-2026-07-02/tailwind-containers-mobile-390.png`
- Local before desktop: `docs/research/assets/application-containers-hero-level-rework-2026-07-02/local-before-containers-desktop.png`
- Local before mobile 390px: `docs/research/assets/application-containers-hero-level-rework-2026-07-02/local-before-containers-mobile-390.png`
- Local after desktop: `docs/research/assets/application-containers-hero-level-rework-2026-07-02/local-containers-after-desktop.png`
- Local after mobile 390px: `docs/research/assets/application-containers-hero-level-rework-2026-07-02/local-containers-after-mobile-390.png`
- Capture smoke: `docs/research/assets/application-containers-hero-level-rework-2026-07-02/containers-capture-smoke.json`
- After smoke: `docs/research/assets/application-containers-hero-level-rework-2026-07-02/containers-after-smoke.json`

## Browser Note

The requested Chrome extension workflow remains blocked by missing plugin documentation files in this environment. This leaf used Playwright screenshots as the browser fallback and records that fallback in `containers-capture-smoke.json`.

## Reference Observations

The Tailwind page exposes 5 visible examples:

1. Full-width on mobile, constrained with padded content above
2. Constrained with padded content
3. Full-width on mobile, constrained to breakpoint with padded content above mobile
4. Constrained to breakpoint with padded content
5. Narrow constrained with padded content

The previews are layout diagrams rather than application cards. They use pink outer gutters, dashed borders, hatched content areas, one dark breakpoint treatment, and one narrow constrained treatment.

## Local Change

The local page previously mapped all 5 examples to the shared `layout-container-page` preview, which showed two labeled content cards and did not communicate the Tailwind container diagrams.

The rework replaces that mapping with 5 dedicated preview variants:

- `container-mobile-full-padded`
- `container-constrained-padded`
- `container-mobile-full-breakpoint`
- `container-breakpoint-padded`
- `container-narrow-padded`

The renderer now uses diagram surfaces that emphasize content width, padded gutters, breakpoint constraints, dark variant treatment, and narrow constrained width.

## Imagegen Policy

No imagegen asset was generated for this leaf because the reference previews are layout diagrams with CSS surfaces only.

For later leaves, if a preview contains raster-like visual content, generate a fresh asset for that leaf or preview instead of reusing existing assets. Record the generated file and prompt/provenance in that leaf evidence folder.

## Verification

- `npm run build`: passed.
- Local after smoke:
  - desktop expected names missing: `[]`
  - mobile expected names missing: `[]`
  - desktop preview image sources: `[]`
  - mobile preview image sources: `[]`
  - pink panel count: `4`
  - dark panel count: `1`
  - hatched diagram count: `5`
  - desktop page horizontal overflow: `false`
  - mobile 390px page horizontal overflow: `false`

Desktop smoke reports one pre-existing sidebar truncation overflow for `Sign-in and Registration`; mobile smoke reports truncated long example headings. These are outside the diagram surfaces and do not affect page-level horizontal overflow.
