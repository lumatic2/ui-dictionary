# Feature Sections Hero-Level Rework - 2026-07-02

## Scope

- Tailwind source: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/feature-sections`
- Local route: `/?filter=nav%3Aplus-marketing-feature-sections`
- Tailwind examples observed: 15
- Local examples exposed: 15

## Reference Captures

- Tailwind desktop: `docs/research/assets/feature-sections-hero-level-rework-2026-07-02/tailwind-feature-sections-desktop.png`
- Tailwind desktop viewport via Chrome extension: `docs/research/assets/feature-sections-hero-level-rework-2026-07-02/tailwind-feature-sections-desktop-viewport.png`
- Tailwind mobile 390: `docs/research/assets/feature-sections-hero-level-rework-2026-07-02/tailwind-feature-sections-mobile-390.png`
- Local before desktop: `docs/research/assets/feature-sections-hero-level-rework-2026-07-02/local-feature-sections-before-desktop.png`
- Local before mobile 390: `docs/research/assets/feature-sections-hero-level-rework-2026-07-02/local-feature-sections-before-mobile-390.png`
- Local after desktop: `docs/research/assets/feature-sections-hero-level-rework-2026-07-02/local-feature-sections-after-desktop.png`
- Local after mobile 390: `docs/research/assets/feature-sections-hero-level-rework-2026-07-02/local-feature-sections-after-mobile-390.png`

## What Changed

- Replaced repeated `A better workflow` copy with variant-specific feature section copy.
- Increased early feature preview vertical rhythm, especially `Centered 2x2 grid`, `With large screenshot`, and `With large bordered screenshot`.
- Added a dedicated dark branch for `With large screenshot` to match Tailwind's dark product proof section.
- Added a dedicated bordered screenshot branch for `With large bordered screenshot`.
- Replaced older screenshot references with five fresh v2 generated screenshots:
  - `dashboard-product-screenshot-v2.png`
  - `large-dark-screenshot-v2.png`
  - `bordered-project-screenshot-v2.png`
  - `left-support-screenshot-v2.png`
  - `contained-analytics-screenshot-v2.png`

## Verification

- `npm run build` passed.
- `npm run audit:visuals` passed: 527 terms, 527 variants, 0 generic renderer variants, 0 shared variants.
- `npm run lint` passed with only pre-existing fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- `python scripts\validate-ui-vocabulary.py` passed.
- Chrome smoke saved: `docs/research/assets/feature-sections-hero-level-rework-2026-07-02/local-chrome-smoke.json`.

## Notes For Repeat Loop

- Chrome extension full-page screenshot failed on the Tailwind page because of the long page height. The page was still opened and inspected with Chrome extension; full-height desktop and mobile evidence were saved with headless Chrome screenshots.
- This is the expected fallback for very tall Tailwind leaves: keep Chrome extension viewport/DOM evidence, then save headless full-height screenshots for visual comparison.
