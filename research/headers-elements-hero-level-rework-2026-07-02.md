# Headers Elements hero-level rework - 2026-07-02

## Scope

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/marketing/elements/headers`
- Local route: `/?filter=nav%3Aplus-marketing-headers`
- Goal: upgrade the existing match-count implementation to the Hero Sections quality bar using fresh desktop and 390px mobile captures.

## Reference evidence

- Tailwind desktop: `docs/research/assets/headers-elements-hero-level-rework-2026-07-02/tailwind-headers-desktop.png`
- Tailwind mobile 390: `docs/research/assets/headers-elements-hero-level-rework-2026-07-02/tailwind-headers-mobile-390.png`
- Reference metadata: `docs/research/assets/headers-elements-hero-level-rework-2026-07-02/tailwind-headers-reference.json`

The live Tailwind page exposes 11 public examples:

1. With stacked flyout menu
2. Constrained
3. On brand background
4. With full width flyout menu
5. Full width
6. With call-to-action
7. With multiple flyout menus
8. With icons in mobile menu
9. With left-aligned nav
10. With right-aligned nav
11. With centered logo

## Implementation notes

- Replaced the repeated generic "Reusable site header element" preview body with header-only canvases.
- Matched the Tailwind height rhythm: tall blank/menu examples around the 640px reference class, simpler headers around the 448px reference class.
- Added dedicated treatments for constrained, brand-background, full-width, CTA, multiple flyout, mobile menu, left-aligned, right-aligned, and centered-logo layouts.
- Added mobile compact behavior so every header preview collapses to a menu affordance at 390px.
- Added `min-w-0` guards on the example article and preview frame to prevent mobile horizontal overflow.

## Images

No imagegen asset was generated for this leaf. The Tailwind reference is header/navigation UI only and the captured page contains zero runtime preview images, so adding decorative image assets would reduce parity.

## Local evidence

- Before desktop: `docs/research/assets/headers-elements-hero-level-rework-2026-07-02/local-headers-before-desktop.png`
- Before mobile 390: `docs/research/assets/headers-elements-hero-level-rework-2026-07-02/local-headers-before-mobile-390.png`
- After desktop: `docs/research/assets/headers-elements-hero-level-rework-2026-07-02/local-headers-after-desktop.png`
- After mobile 390: `docs/research/assets/headers-elements-hero-level-rework-2026-07-02/local-headers-after-mobile-390.png`
- Chrome/CDP smoke: `docs/research/assets/headers-elements-hero-level-rework-2026-07-02/local-headers-chrome-smoke.json`
- CDP mobile capture metrics: `docs/research/assets/headers-elements-hero-level-rework-2026-07-02/mobile-390-cdp-capture.json`

## Verification

- `npm run build`
- `npm run lint`
- `npm run audit:visuals`
- `python scripts\validate-ui-vocabulary.py`
- Chrome/CDP route smoke found all 11 Header example names, zero image assets, no missing examples, and no desktop or 390px mobile horizontal overflow.

Known lint output remains the pre-existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
