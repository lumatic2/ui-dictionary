# Tailwind Plus Catalog Interactivity Ledger

## Step 159 - About Pages page parity pass

Scope:

- Local `plus-marketing-about-pages` leaf and its 3 About Page preview variants.
- Tailwind Plus Marketing / Page Examples / About Pages reference page.
- Captures are stored in `docs/research/assets/tailwind-plus-page-parity-2026-07-03/about-pages/`.

Implementation:

- Captured the canonical Tailwind Plus `/marketing/page-examples/about-pages` reference page and confirmed the 3 example names.
- Added explicit `data-about-page-theme` and `data-about-page-variant` markers to every About Page preview root.
- Made all About Page variants respond to the preview Light/Dark theme controls instead of staying fixed to their default shell.
- Added stable accessible labels, `aria-pressed` selected state, focus rings, hover/press motion, and animated visible feedback to about nav, login, metrics, values, timeline milestones, and team profile actions.
- Converted timeline milestones and team profile cards from static page content into real buttons.

Verification:

- Chrome extension desktop smoke verified 3 examples, 44 about action buttons, representative feedback, all 3 Dark controls setting all 3 roots to dark, all 3 Light controls setting all 3 roots to light, no console errors, and no horizontal overflow.
- Mobile 390px smoke verified 3 roots, 44 action buttons, representative feedback, all 3 dark roots after Dark, no positive overflow, and no errors.
- `npm run build`, `npm run lint`, `npm run audit:visuals`, `python scripts/validate-ui-vocabulary.py`, and `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Lint still reports only existing shadcn fast-refresh warnings.

Evidence:

- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/about-pages/tailwind-about-pages-reference-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/about-pages/local-about-pages-desktop-before-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/about-pages/local-about-pages-desktop-after-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/about-pages/local-about-pages-mobile-after.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/about-pages/chrome-smoke-after.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/about-pages/mobile-smoke-after.json`

## Step 158 - Pricing Pages page parity pass

Scope:

- Local `plus-marketing-pricing-pages` leaf and its 3 Pricing Page preview variants.
- Tailwind Plus Marketing / Page Examples / Pricing Pages reference page.
- Captures are stored in `docs/research/assets/tailwind-plus-page-parity-2026-07-03/pricing-pages/`.

Implementation:

- Captured the canonical Tailwind Plus `/marketing/page-examples/pricing-pages` reference page and confirmed the 3 example names.
- Added explicit `data-pricing-page-theme` and `data-pricing-page-variant` markers to every Pricing Page preview root.
- Made all Pricing Page variants respond to the preview Light/Dark theme controls instead of staying fixed to their default shell.
- Added stable accessible labels, `aria-pressed` selected state, focus rings, hover/press motion, and animated visible feedback to pricing nav, login, billing cycle, plan selection, proof logos, case study, comparison table cells, FAQ toggles, and newsletter subscription.
- Strengthened pricing FAQ controls with `aria-expanded` and `aria-controls`.

Verification:

- Chrome extension desktop smoke verified 3 examples, 91 pricing action buttons, representative feedback, all 3 Dark controls setting all 3 roots to dark, all 3 Light controls setting all 3 roots to light, no console errors, and no horizontal overflow.
- Mobile 390px smoke verified 3 roots, 91 action buttons, representative feedback, all 3 dark roots after Dark, no positive overflow, and no errors.
- `npm run build`, `npm run lint`, `npm run audit:visuals`, `python scripts/validate-ui-vocabulary.py`, and `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Lint still reports only existing shadcn fast-refresh warnings.

Evidence:

- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/pricing-pages/tailwind-pricing-pages-reference-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/pricing-pages/local-pricing-pages-desktop-before-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/pricing-pages/local-pricing-pages-desktop-after-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/pricing-pages/local-pricing-pages-mobile-after.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/pricing-pages/chrome-smoke-after.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/pricing-pages/mobile-smoke-after.json`

## Step 157 - Landing Pages page parity pass

Scope:

- Local `plus-marketing-landing-pages` leaf and its 4 Landing Page preview variants.
- Tailwind Plus Marketing / Page Examples / Landing Pages reference page.
- Captures are stored in `docs/research/assets/tailwind-plus-page-parity-2026-07-03/landing-pages/`.

Implementation:

- Captured the canonical Tailwind Plus `/marketing/page-examples/landing-pages` reference page and confirmed the 4 example names.
- Added explicit `data-landing-page-theme` and `data-landing-page-variant` markers to every Landing Page preview root.
- Made all Landing Page variants respond to the preview Light/Dark theme controls instead of staying fixed to their default dark or light shell.
- Added stable accessible labels, `aria-pressed` selected state, focus rings, hover/press motion, and animated visible feedback to release notes, signup, product tour, logo cloud, feature, nav, login, case study, funding, plan, and hiring actions.

Verification:

- Chrome extension desktop smoke verified 4 examples, 53 landing action buttons, representative feedback, all 4 Dark controls setting all 4 roots to dark, all 4 Light controls setting all 4 roots to light, no console errors, and no horizontal overflow.
- Mobile 390px smoke verified 4 roots, 53 action buttons, representative feedback, all 4 dark roots after Dark, no positive overflow, and no errors.
- `npm run build`, `npm run lint`, `npm run audit:visuals`, `python scripts/validate-ui-vocabulary.py`, and `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Lint still reports only existing shadcn fast-refresh warnings.

Evidence:

- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/landing-pages/tailwind-landing-pages-reference-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/landing-pages/local-landing-pages-desktop-before-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/landing-pages/local-landing-pages-desktop-after-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/landing-pages/local-landing-pages-mobile-after.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/landing-pages/chrome-smoke-after.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/landing-pages/mobile-smoke-after.json`

## Step 156 - 404 Pages page parity pass

Scope:

- Local `plus-marketing-404-pages` leaf and its 5 404 Page preview variants.
- Tailwind Plus Marketing / Feedback / 404 Pages reference page.
- Captures are stored in `docs/research/assets/tailwind-plus-page-parity-2026-07-03/404-pages/`.

Implementation:

- Kept the local 404 Pages page aligned to the 5 Tailwind example names.
- Added explicit `data-not-found-theme` and `data-not-found-variant` markers to all 404 Page preview roots.
- Made all 404 Page variants respond to the preview Light/Dark theme controls.
- Added stable accessible labels, `aria-pressed` selected state, hover/press motion, focus rings, and animated visible feedback to home recovery, support contact, status, popular page, shell nav, login, and social actions.
- Converted popular page rows and shell navigation/footer social items from static text into real recovery buttons.

Verification:

- `npm run build` passed with only the existing Vite chunk-size warning.
- Chrome extension desktop smoke verified:
  - 5 example headings and 5 404 roots.
  - 20 recovery action buttons.
  - home, support, status, popular page, nav, and social feedback.
  - selected action `aria-pressed` state after interaction.
  - all 5 Dark controls setting all 5 404 roots to dark.
  - all 5 Light controls setting all 5 404 roots to light.
  - zero horizontal overflow.
- Mobile 390px smoke verified:
  - 5 404 roots and 20 action buttons.
  - representative home, support, popular page, and social feedback.
  - all 5 Dark controls setting all 5 404 roots to dark.
  - no console/page errors and no positive horizontal overflow.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.

Evidence:

- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/404-pages/tailwind-404-pages-reference-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/404-pages/local-404-pages-desktop-before-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/404-pages/local-404-pages-desktop-after-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/404-pages/local-404-pages-mobile-after.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/404-pages/capture-notes-before.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/404-pages/chrome-smoke-after.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/404-pages/mobile-smoke-after.json`

## Step 155 - Banners page parity pass

Scope:

- Local `plus-marketing-banners` leaf and its 13 Banner preview variants.
- Tailwind Plus Marketing / Elements / Banners reference page.
- Captures are stored in `docs/research/assets/tailwind-plus-page-parity-2026-07-03/banners/`.

Implementation:

- Kept the local Banners page aligned to the 13 Tailwind example names.
- Added explicit `data-banner-section-theme` and `data-banner-section-variant` markers to all Banner preview roots.
- Made all Banner variants respond to the preview Light/Dark theme controls.
- Added stable accessible labels, `aria-pressed` selected state, hover/press motion, focus rings, and animated visible feedback to funding links, register buttons, learn-more links, privacy dismiss actions, and privacy accept actions.
- Kept privacy notice examples visible after interaction so layout parity remains inspectable while feedback proves the action.

Verification:

- `npm run build` passed with only the existing Vite chunk-size warning.
- Chrome extension desktop smoke verified:
  - 13 example headings and 13 Banner roots.
  - 25 Banner action buttons.
  - funding details, register, learn-more, privacy dismiss, and privacy accept feedback.
  - selected action `aria-pressed` state after interaction.
  - all 13 Dark controls setting all 13 Banner roots to dark.
  - all 13 Light controls setting all 13 Banner roots to light.
  - zero horizontal overflow.
- Mobile 390px smoke verified:
  - 13 Banner roots and 31 action buttons.
  - representative funding, register, learn-more, privacy dismiss, and privacy accept feedback.
  - all 13 Dark controls setting all 13 Banner roots to dark.
  - no console/page errors and no positive horizontal overflow.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.

Evidence:

- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/banners/tailwind-banners-reference-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/banners/local-banners-desktop-before-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/banners/local-banners-desktop-after-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/banners/local-banners-mobile-after.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/banners/capture-notes-before.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/banners/chrome-smoke-after.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/banners/mobile-smoke-after.json`

## Step 154 - Flyout Menus page parity pass

Scope:

- Local `plus-marketing-flyout-menus` leaf and its 7 Flyout Menu preview variants.
- Tailwind Plus Marketing / Elements / Flyout Menus reference page.
- Captures are stored in `docs/research/assets/tailwind-plus-page-parity-2026-07-03/flyout-menus/`.

Implementation:

- Kept the local Flyout Menus page aligned to the 7 Tailwind example names.
- Added explicit `data-flyout-menu-theme` and `data-flyout-menu-variant` markers to all Flyout Menu preview roots.
- Made all Flyout Menu variants respond to the preview Light/Dark theme controls.
- Added stable accessible labels, `aria-pressed` selected state, `aria-expanded` menu state, hover/press motion, focus rings, and animated visible feedback to flyout nav controls, mobile menus, menu items, resource cards, footer actions, and simple menu rows.
- Converted previously static full-width, two-column, and resource preview items into real buttons.

Verification:

- `npm run build` passed with only the existing Vite chunk-size warning.
- Chrome extension desktop smoke verified:
  - 7 example headings and 7 Flyout Menu roots.
  - 79 Flyout action buttons.
  - Product toggle, item, footer action, resource, full-width item, and simple menu feedback.
  - selected action `aria-pressed` state and Product menu expanded state.
  - all 7 Dark controls setting all 7 Flyout roots to dark.
  - all 7 Light controls setting all 7 Flyout roots to light.
  - zero horizontal overflow.
- Mobile 390px smoke verified:
  - 7 Flyout roots and 83 action buttons.
  - representative mobile menu, mobile nav, item, resource, and simple menu feedback.
  - all 7 Dark controls setting all 7 Flyout roots to dark.
  - no console/page errors and no positive horizontal overflow.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.

Evidence:

- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/flyout-menus/tailwind-flyout-menus-reference-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/flyout-menus/local-flyout-menus-desktop-before-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/flyout-menus/local-flyout-menus-desktop-after-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/flyout-menus/local-flyout-menus-mobile-after.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/flyout-menus/capture-notes-before.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/flyout-menus/chrome-smoke-after.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/flyout-menus/mobile-smoke-after.json`

## Step 153 - Headers page parity pass

Scope:

- Local `plus-marketing-headers` leaf and its 11 Header preview variants.
- Tailwind Plus Marketing / Elements / Headers reference page.
- Captures are stored in `docs/research/assets/tailwind-plus-page-parity-2026-07-03/headers/`.

Implementation:

- Kept the local Headers page aligned to the 11 Tailwind example names.
- Added explicit `data-header-element-theme` and `data-header-element-variant` markers to all Header preview roots.
- Made all Header variants respond to the preview Light/Dark theme controls.
- Added stable accessible labels, `aria-pressed` selected state, hover/press motion, focus rings, and animated visible feedback to header navigation links, flyout entries, CTA actions, and mobile menu entries.
- Strengthened mobile menu controls with `aria-expanded`, visible open/close feedback, and animated mobile menu panels.
- Added interactive flyout cards for stacked, full-width, multiple-flyout, and mobile-icons header variants.

Verification:

- `npm run build` passed with only the existing Vite chunk-size warning.
- Chrome extension desktop smoke verified:
  - 11 example headings and 11 Header roots.
  - 84 Header action buttons.
  - nav, flyout, CTA, mobile menu, and centered-logo feedback.
  - selected action `aria-pressed` state and mobile menu expanded state.
  - all 11 Dark controls setting all 11 Header roots to dark.
  - all 11 Light controls setting all 11 Header roots to light.
  - zero horizontal overflow.
- Mobile 390px smoke verified:
  - 11 Header roots and 92 action buttons.
  - representative mobile menu, mobile nav, and flyout feedback.
  - all 11 Dark controls setting all 11 Header roots to dark.
  - no console/page errors and no positive horizontal overflow.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.

Evidence:

- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/headers/tailwind-headers-reference-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/headers/local-headers-desktop-before-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/headers/local-headers-desktop-after-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/headers/local-headers-mobile-after.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/headers/capture-notes-before.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/headers/chrome-smoke-after.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/headers/mobile-smoke-after.json`

## Step 152 - Footers page parity pass

Scope:

- Local `plus-marketing-footers` leaf and its 7 Footer preview variants.
- Tailwind Plus Marketing / Page Sections / Footers reference page.
- Captures are stored in `docs/research/assets/tailwind-plus-page-parity-2026-07-03/footers/`.

Implementation:

- Kept the local Footers page aligned to the 7 Tailwind example names.
- Added explicit `data-footer-section-theme` and `data-footer-section-variant` markers to all Footer preview roots.
- Made all Footer variants respond to the preview Light/Dark theme controls, including the previously fixed-dark mission, simple, newsletter-below, and social variants.
- Added stable accessible labels, `aria-pressed` selected state, hover/press motion, focus rings, and animated visible feedback to footer link groups, social links, CTA actions, newsletter email/follow-up controls, and centered footer links.
- Preserved the Tailwind-style footer variants: mission, CTA, simple four-column, newsletter, newsletter-below, centered, and social-link layouts.

Verification:

- `npm run build` passed with only the existing Vite chunk-size warning.
- Chrome extension desktop smoke verified:
  - 7 example headings and 7 Footer roots.
  - 105 Footer action buttons.
  - footer link, CTA, newsletter subscribe, newsletter email, centered link, and social feedback.
  - selected action `aria-pressed` state after interaction.
  - all 7 Dark controls setting all 7 Footer roots to dark.
  - all 7 Light controls setting all 7 Footer roots to light.
  - zero horizontal overflow.
- Mobile 390px smoke verified:
  - 7 Footer roots and 105 action buttons.
  - representative link, CTA, newsletter, and social feedback.
  - all 7 Dark controls setting all 7 Footer roots to dark.
  - no console/page errors and no positive horizontal overflow.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.

Evidence:

- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/footers/tailwind-footers-reference-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/footers/local-footers-desktop-before-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/footers/local-footers-desktop-after-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/footers/local-footers-mobile-after.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/footers/capture-notes-before.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/footers/chrome-smoke-after.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/footers/mobile-smoke-after.json`

## Step 151 - FAQs page parity pass

Scope:

- Local `plus-marketing-faqs` leaf and its 7 FAQ preview variants.
- Tailwind Plus Marketing / Page Sections / FAQs reference page.
- Captures are stored in `docs/research/assets/tailwind-plus-page-parity-2026-07-03/faqs/`.

Implementation:

- Confirmed Tailwind's canonical FAQ URL is `/marketing/sections/faq-sections`; `/marketing/sections/faqs` returns a 404.
- Kept the local FAQs page aligned to the 7 Tailwind example names.
- Added explicit `data-faq-section-theme` and `data-faq-section-variant` markers to all FAQ preview roots.
- Made all FAQ variants respond to the preview Light/Dark theme controls, including the previously fixed-dark centered variants.
- Converted static FAQ question blocks into real buttons where appropriate, with stable accessible labels, `aria-pressed` selected state, hover/press motion, focus rings, and animated visible feedback.
- Strengthened accordion questions with `aria-expanded`, `aria-controls`, rotating icons, and animated answer reveal.

Verification:

- `npm run build` passed with only the existing Vite chunk-size warning.
- Chrome extension desktop smoke verified:
  - 7 example headings and 7 FAQ roots.
  - 41 FAQ action buttons.
  - toggle/open feedback for accordion and grid-style FAQ variants.
  - accordion questions exposing expanded state after interaction.
  - all 7 Dark controls setting all 7 FAQ roots to dark.
  - all 7 Light controls setting all 7 FAQ roots to light.
  - zero horizontal overflow.
- Mobile 390px smoke verified:
  - 7 FAQ roots and 41 action buttons.
  - representative toggle/open feedback.
  - all 7 Dark controls setting all 7 FAQ roots to dark.
  - no console/page errors and no positive horizontal overflow.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.

Evidence:

- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/faqs/tailwind-faqs-reference-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/faqs/local-faqs-desktop-before-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/faqs/local-faqs-desktop-after-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/faqs/local-faqs-mobile-after.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/faqs/capture-notes-before.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/faqs/chrome-smoke-after.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/faqs/mobile-smoke-after.json`

## Step 150 - Logo Clouds page parity pass

Scope:

- Local `plus-marketing-logo-clouds` leaf and its 6 Logo Clouds preview variants.
- Tailwind Plus Marketing / Page Sections / Logo Clouds reference page.
- Captures are stored in `docs/research/assets/tailwind-plus-page-parity-2026-07-03/logo-clouds/`.

Implementation:

- Kept the local Logo Clouds page aligned to the 6 Tailwind example names.
- Added explicit `data-logo-cloud-theme` and `data-logo-cloud-variant` markers to all Logo Clouds preview roots.
- Made all Logo Clouds variants respond to the preview Light/Dark theme controls, including the previously fixed dark left/grid variants.
- Converted logo marks and CTA affordances into real buttons with stable accessible labels, `aria-pressed` selected state, hover/press motion, focus rings, and animated visible feedback.
- Added dark/light styling hooks for Logo Clouds roots, headings, muted copy, selected rings, logo panels, CTA surfaces, and feedback surfaces.

Verification:

- `npm run build` passed with only the existing Vite chunk-size warning.
- Chrome extension desktop smoke verified:
  - 6 example headings and 6 Logo Clouds roots.
  - 35 Logo action buttons.
  - Transistor, customer stories, Reform, account creation, and Laravel feedback.
  - all 6 Dark controls setting all 6 Logo Clouds roots to dark.
  - all 6 Light controls setting all 6 Logo Clouds roots to light.
  - empty console errors and zero horizontal overflow.
- Mobile 390px smoke verified:
  - 6 Logo Clouds roots and 35 action buttons.
  - representative logo and CTA feedback.
  - all 6 Dark controls setting all 6 Logo Clouds roots to dark.
  - no console/page errors and no positive horizontal overflow.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.

Evidence:

- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/logo-clouds/tailwind-logo-clouds-reference-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/logo-clouds/local-logo-clouds-desktop-before-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/logo-clouds/local-logo-clouds-desktop-after-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/logo-clouds/local-logo-clouds-mobile-after.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/logo-clouds/chrome-smoke-after.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/logo-clouds/mobile-smoke-after.json`

## Step 149 - Content Sections page parity pass

Scope:

- Local `plus-marketing-content-sections` leaf and its 7 Content Sections preview variants.
- Tailwind Plus Marketing / Page Sections / Content Sections reference page.
- Captures are stored in `docs/research/assets/tailwind-plus-page-parity-2026-07-03/content-sections/`.

Implementation:

- Kept the local Content Sections page aligned to the 7 Tailwind example names.
- Added explicit `data-content-section-theme` and `data-content-section-variant` markers to all Content preview roots.
- Made all Content variants respond to the preview Light/Dark theme controls.
- Converted bullet rows, value sections, stats, testimonial quotes, secondary sections, and CTAs into real buttons with stable accessible labels, `aria-pressed` selected state, hover/press motion, focus rings, and animated visible feedback.
- Added dark/light styling hooks for Content roots, headings, muted copy, cards, selected states, quote blocks, stat blocks, and feedback surfaces.

Verification:

- `npm run build` passed with only the existing Vite chunk-size warning.
- Chrome extension desktop smoke verified:
  - 7 example headings and 7 Content roots.
  - 32 Content action buttons.
  - sticky bullet, testimonial quote, image-title value, two-column CTA, testimonial stat, and centered quote feedback.
  - all 7 Dark controls setting all 7 Content roots to dark.
  - all 7 Light controls setting all 7 Content roots to light.
  - empty console errors and zero horizontal overflow.
- Mobile 390px smoke verified:
  - 7 Content roots and 32 action buttons.
  - representative feedback across six variants.
  - all 7 Dark controls setting all 7 Content roots to dark.
  - no console/page errors and no positive horizontal overflow.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.

Evidence:

- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/content-sections/tailwind-content-sections-reference-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/content-sections/local-content-sections-desktop-before-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/content-sections/local-content-sections-desktop-after-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/content-sections/local-content-sections-mobile-after.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/content-sections/chrome-smoke-after.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/content-sections/mobile-smoke-after.json`

## Step 148 - Team Sections page parity pass

Scope:

- Local `plus-marketing-team-sections` leaf and its 9 Team Sections preview variants.
- Tailwind Plus Marketing / Page Sections / Team Sections reference page.
- Captures are stored in `docs/research/assets/tailwind-plus-page-parity-2026-07-03/team-sections/`.

Implementation:

- Kept the local Team Sections page aligned to the 9 Tailwind example names.
- Added explicit `data-team-section-theme` and `data-team-section-variant` markers to all Team preview roots.
- Made all Team variants respond to the preview Light/Dark theme controls.
- Converted team member rows, image cards, round grid items, card grid items, paragraph cards, vertical media rows, and medium image cards into real buttons with stable accessible labels, `aria-pressed` selected state, hover/press motion, focus rings, and animated visible feedback.
- Added dark/light styling hooks for Team roots, headings, muted copy, roles, cards, selected rings, and feedback surfaces.

Verification:

- `npm run build` passed with only the existing Vite chunk-size warning.
- Chrome extension desktop smoke verified:
  - 9 example headings and 9 Team roots.
  - 56 Team member action buttons.
  - small-image, large-image, round-grid, vertical-image, and medium-image profile feedback.
  - all 9 Dark controls setting all 9 Team roots to dark.
  - all 9 Light controls setting all 9 Team roots to light.
  - empty console errors and zero horizontal overflow.
- Mobile 390px smoke verified:
  - 9 Team roots and 56 Team member action buttons.
  - representative profile feedback across five variants.
  - all 9 Dark controls setting all 9 Team roots to dark.
  - no console/page errors and no positive horizontal overflow.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.

Evidence:

- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/team-sections/tailwind-team-sections-reference-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/team-sections/local-team-sections-desktop-before-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/team-sections/local-team-sections-desktop-after-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/team-sections/local-team-sections-mobile-after.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/team-sections/chrome-smoke-after.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/team-sections/mobile-smoke-after.json`

## Step 147 - Contact Sections page parity pass

Scope:

- Local `plus-marketing-contact-sections` leaf and its 7 Contact Sections preview variants.
- Tailwind Plus Marketing / Page Sections / Contact Sections reference page.
- Captures are stored in `docs/research/assets/tailwind-plus-page-parity-2026-07-03/contact-sections/`.

Implementation:

- Kept the local Contact Sections page aligned to the 7 Tailwind example names.
- Added explicit `data-contact-section-theme` and `data-contact-section-variant` markers to all Contact preview roots.
- Replaced fake form-field blocks with real `input` and `textarea` controls across contact forms.
- Made all Contact variants respond to preview Light/Dark theme controls, including split-pattern and testimonial examples that were previously fixed dark surfaces.
- Converted contact paths, office cards, support rows, and submit controls into real buttons with stable accessible labels, `aria-pressed` selected state, hover/press motion, focus rings, and animated visible feedback.

Verification:

- `npm run build` passed with only the existing Vite chunk-size warning.
- Chrome extension desktop smoke verified:
  - 7 example headings and 7 Contact roots.
  - 19 Contact action buttons and 24 real input/textarea controls.
  - contact form submit, contact path, office, support, and split-image form feedback.
  - all 7 Dark controls setting all 7 Contact roots to dark.
  - all 7 Light controls setting all 7 Contact roots to light.
  - empty console errors and zero horizontal overflow.
- Mobile 390px smoke verified:
  - 7 Contact roots, 19 action buttons, and 24 form controls.
  - contact form submit, contact path, office, support, and split-image form feedback.
  - all 7 Dark controls setting all 7 Contact roots to dark.
  - no console/page errors and no positive horizontal overflow.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.

Evidence:

- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/contact-sections/tailwind-contact-sections-reference-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/contact-sections/local-contact-sections-desktop-before-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/contact-sections/local-contact-sections-desktop-after-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/contact-sections/local-contact-sections-mobile-after.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/contact-sections/chrome-smoke-after.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/contact-sections/mobile-smoke-after.json`

## Step 146 - Blog Sections page parity pass

Scope:

- Local `plus-marketing-blog-sections` leaf and its 7 Blog Sections preview variants.
- Tailwind Plus Marketing / Page Sections / Blog Sections reference page.
- Captures are stored in `docs/research/assets/tailwind-plus-page-parity-2026-07-03/blog-sections/`.

Implementation:

- Kept the local Blog Sections page aligned to the 7 Tailwind example names.
- Added explicit `data-blog-section-theme` and `data-blog-section-variant` markers to all Blog preview roots.
- Made all Blog variants respond to the preview Light/Dark theme controls.
- Converted article cards, background image article cards, featured article CTA, side articles, job-opening links, and all-openings CTA into real buttons with stable accessible labels, `aria-pressed` selected state, hover/press motion, focus rings, and animated visible feedback.
- Added dark/light styling hooks for Blog roots, headings, muted copy, borders, pills, author rows, and feedback surfaces.

Verification:

- `npm run build` passed with only the existing Vite chunk-size warning.
- Chrome extension desktop smoke verified:
  - 7 example headings and 7 Blog roots.
  - 22 Blog action buttons.
  - article, background article, featured article, job opening, and all-openings feedback.
  - all 7 Dark controls setting all 7 Blog roots to dark.
  - all 7 Light controls setting all 7 Blog roots to light.
  - empty console errors and zero horizontal overflow.
- Mobile 390px smoke verified:
  - 7 Blog roots and 22 Blog action buttons.
  - article, featured article, job opening, and all-openings feedback.
  - all 7 Dark controls setting all 7 Blog roots to dark.
  - no console/page errors and no positive horizontal overflow.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.

Evidence:

- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/blog-sections/tailwind-blog-sections-reference-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/blog-sections/local-blog-sections-desktop-before-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/blog-sections/local-blog-sections-desktop-after-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/blog-sections/local-blog-sections-mobile-after.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/blog-sections/chrome-smoke-after.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/blog-sections/mobile-smoke-after.json`

## Step 0 - Controls-heavy preview interactivity batch

Scope:

- Marketing: pricing sections and FAQ sections.
- Application UI: textareas, radio groups, checkboxes, and toggles.
- Ecommerce: shopping carts, category filters, and product quickviews.

Implementation:

- Pricing previews now switch monthly/annual billing and mark a selected plan.
- FAQ previews now open and close accordion rows with animated height/opacity transitions.
- Textarea previews now accept typed input, switch Write/Preview mode, and show posted feedback.
- Radio group previews now update the selected option.
- Checkbox previews now toggle checked rows.
- Toggle previews now update `aria-pressed` and switch position/color.
- Cart previews now support quantity changes and remove/restore state.
- Category filter previews now open/close panels and select filters.
- Product quickview previews now select color and size and update Add to bag feedback.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Desktop Playwright smoke clicked and verified state changes on:
  - `plus-marketing-pricing-sections`
  - `plus-marketing-faqs`
  - `plus-forms-textareas`
  - `plus-forms-radio-groups`
  - `plus-forms-checkboxes`
  - `plus-forms-toggles`
  - `plus-ecommerce-shopping-carts`
  - `plus-ecommerce-category-filters`
  - `plus-ecommerce-product-quickviews`
- Mobile Playwright smoke checked the same nine routes for screenshots, zero console errors, and no horizontal overflow.

Evidence screenshots:

- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step0/pricing.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step0/faqs.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step0/textarea.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step0/radio.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step0/checkbox.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step0/toggle.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step0/cart.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step0/filters.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step0/quickview.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step0-mobile/`

## Step 1 - Navigation, overlay, and shell interactivity batch

Scope:

- Application UI navigation: navbars, tabs, sidebar navigation, command palettes, command menus.
- Application UI page examples: navbar, tabs, sidebar, command menu, modal, popover, slide-over.
- Application examples: app example shells.

Implementation:

- Navbar previews now update active section content and expose an animated mobile menu.
- Tabs previews now support desktop and mobile selection with active content.
- Sidebar navigation previews now support parent selection, expandable Projects children, and active child content.
- Command palette rows now use stable single-line truncation to avoid awkward wrapping inside the card.
- Command menu page examples now filter commands and select command results.
- Page-shell previews now show stateful navbar, tab, sidebar, and command content instead of static skeletons.
- Modal, popover, and slide-over page examples now open and close with opacity, scale, and slide transitions.
- Application example shells now switch visible sections from the sidebar.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Desktop Playwright smoke clicked and verified state changes on:
  - `plus-navigation-navbars`
  - `plus-navigation-tabs`
  - `plus-navigation-sidebar-navigation`
  - `plus-navigation-command-palettes`
  - `plus-navigation-command-menus`
  - `plus-overlays-modals`
  - `plus-overlays-popovers`
  - `plus-overlays-slide-overs`
  - `plus-application-shells-sidebar-layouts`
- Mobile Playwright smoke checked navbars, tabs, sidebar navigation, and popovers for no horizontal overflow.

Evidence screenshots:

- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step1/`

## Step 2 - Modal dialog and drawer variant interactivity batch

Scope:

- Application UI / Overlays / Modal Dialogs variants.
- Application UI / Overlays / Drawers variants.

Implementation:

- Modal dialog cards now support closing through Cancel, confirm, and dismiss controls.
- Modal dialog cards now expose an `Open dialog` trigger after close.
- Modal cards now animate with opacity and scale transitions instead of snapping.
- Drawer cards now support header close, outside close, Cancel, Save, and `Open panel` reopen flows.
- Drawer panels now animate with slide and opacity transitions.
- Drawer overlay layers are visual only and no longer intercept pointer events after close.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Desktop Playwright smoke clicked and verified:
  - `plus-overlays-modal-dialogs`: Cancel, Open dialog, confirm, reopen.
  - `plus-overlays-drawers`: Save, Open panel, Cancel, reopen.
- Mobile Playwright smoke checked modal dialogs and drawers for no horizontal overflow.

Bug found and fixed:

- A transparent drawer overlay continued intercepting pointer events after close, blocking `Open panel`. The overlay now uses `pointer-events-none`.

Evidence screenshots:

- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step2/`

## Step 3 - Feedback, heading, and shell interactivity batch

Scope:

- Feedback previews: alerts, empty states, notifications.
- Application UI page headings.
- Application shell previews: stacked layouts, sidebar layouts, and multi-column layouts.

Implementation:

- Alerts now support dismiss, restore, view status, and visible status feedback.
- Empty states now support upload, create, invite, use, add, and return-to-empty flows.
- Notifications now support undo, dismiss, accept, decline, reply, and visible feedback states with motion.
- Page heading action buttons now update visible edit/publish status.
- Stacked shell navigation now changes the active page title and workspace content.
- Sidebar shell navigation now changes the active section and main content.
- Multi-column shell navigation now changes the active section and detail pane.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Desktop Playwright smoke clicked and verified:
  - `plus-feedback-alerts`: Dismiss, Restore alert, View status.
  - `plus-feedback-empty-states`: New user, Back to empty state.
  - `plus-overlays-notifications`: Undo and Dismiss.
  - `plus-application-headings-page-headings`: Publish state.
  - `plus-application-shells-stacked-layouts`: Projects navigation.
  - `plus-application-shells-sidebar-layouts`: Team navigation.
  - `plus-application-shells-multi-column-layouts`: Reports navigation.
- Mobile Playwright smoke checked alerts, empty states, notifications, page headings, and sidebar shells for no horizontal overflow.

Evidence screenshots:

- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step3/`

## Step 4 - Heading, vertical navigation, stacked list, and table interactivity batch

Scope:

- Application UI / Headings / Card Headings.
- Application UI / Headings / Section Headings.
- Navigation / Vertical Navigation.
- Application UI / Lists / Stacked Lists.
- Application UI / Lists / Tables.

Implementation:

- Card heading actions now update visible state for create, phone, email, and avatar-meta menu actions.
- Section heading tabs, create/share actions, and overflow menus now update state instead of staying static.
- Vertical navigation rows now behave as buttons and display the selected destination.
- Stacked list row actions, reply-count chips, project buttons, action menus, and `View all` now update visible feedback with hover/active motion.
- Table headers, row `Edit` actions, grouped rows, plan selection, transaction links, and border table selection now update visible feedback and selected state.
- List/table frames now show compact feedback banners so click results are visible inside the preview card.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome desktop smoke clicked and verified:
  - `plus-application-headings-card-headings`: `Create new job`.
  - `plus-application-headings-section-headings`: `Offer`, `Share`.
  - `plus-navigation-vertical-navigation`: `Calendar`.
  - `plus-application-lists-stacked-lists`: `View project`.
  - `plus-application-lists-tables`: `Add user`, first row `Edit`.
- Mobile 390px smoke checked the same route family for no horizontal overflow and verified visible mobile actions. `View project` is intentionally hidden at this breakpoint, so the stacked-list mobile action used the visible reply-count chip.

Evidence screenshots:

- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step4/`

## Step 5 - Tabs, command palette, popover, and disclosure interactivity batch

Scope:

- Application UI / Navigation / Tabs.
- Application UI / Navigation / Command Palettes.
- Application UI / Overlays / Popovers.
- Documentation / Elements / Disclosure.

Implementation:

- Tabs now have stronger active-state motion while preserving desktop and mobile layouts.
- Command palette examples now use a real search input, filter rows by typed text, support row selection, and keep row labels truncated instead of wrapping awkwardly.
- Command palette preview layouts no longer force a wide minimum width on mobile.
- Popover leaf examples are now split into basic, form, and tooltip-like variants instead of reusing the same static shell.
- Popovers now open/close with scale and opacity motion, update selected state, save form input, and show contextual feedback.
- Docs Disclosure already had functional accordion behavior; smoke was added against the actual accessible button names.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome desktop smoke clicked and verified:
  - `plus-navigation-tabs`: `Billing`.
  - `plus-navigation-command-palettes`: search `invite`, select `Invite teammate`.
  - `plus-overlays-popovers`: select `Draft`.
  - `docs-elements-disclosure`: expand `How do you make holy water? +`.
- Mobile 390px smoke checked tabs, command palettes, popovers, and docs disclosure for no horizontal overflow.

Bug found and fixed:

- Command palette previews used a forced `min-w-[680px]`, which made mobile behavior brittle. The preview now scales to the card width.
- Popover page examples were three copies of the same shell. They now render distinct examples.

Evidence screenshots:

- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step5/`

## Step 6 - Application overview and Ecommerce broad page interactivity batch

Scope:

- UI Kit / Forms overview page shell.
- UI Kit / Controls / element button overview shell.
- Application data and element overview shells in shared preview code.
- Ecommerce broad page examples: product, cart, checkout, and order detail.

Implementation:

- Application form overview pages now expose real Save feedback, editable-looking inputs, radio-style plan selection, checkbox selection, toggle switches, select menu choices, combobox selection, and publish/discard actions.
- Application data overview pages now support export feedback, stat card selection, calendar day selection, list row selection, table row selection, and description row selection.
- Application element overview pages now turn avatars, badges, dropdown rows, buttons, and button-group segments into clickable controls with active states and feedback.
- Ecommerce broad product pages now support option selection and Add to cart feedback.
- Ecommerce broad cart pages now support quantity +/- updates, dynamic totals, and Checkout feedback.
- Ecommerce broad checkout pages now support step switching and Place order feedback.
- Ecommerce broad order pages now support status step selection.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome desktop smoke clicked and verified:
  - `plus-ui-kit-forms`: `Save` -> `Settings saved`.
  - `plus-ui-kit-controls`: `Save changes` -> `Saved changes`.
  - `plus-ecommerce-page-examples-product`: `Black`, `Add to cart` -> `Black shelf added`.
  - `plus-ecommerce-page-examples-cart`: `+`, `Checkout` -> `Checkout started`.
  - `plus-ecommerce-page-examples-checkout`: `Shipping`, `Place order` -> `Order placed`.
  - `plus-ecommerce-page-examples-order-detail`: `Shipped` -> `Shipped on June 28`.
- Mobile 390px smoke checked forms, controls, product, cart, and checkout page examples for no horizontal overflow.

Bug found and fixed:

- Browser smoke initially clicked `Checkout Pages` in the sidebar instead of the cart `Checkout` CTA because the locator used partial text matching. The smoke now uses exact button names, and the UI itself kept the intended cart CTA behavior.

Evidence screenshots:

- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step6/`

## Step 9 - Application template and page example interactivity batch

Scope:

- Application UI / Page Examples: Home Screens, Detail Screens, Settings Screens, Dashboards.
- Templates / Auth Screens and Onboarding Screens.
- Command palette card row/footer wrapping.

Implementation:

- Application template previews now use real stateful dashboard, settings, detail/list, auth, and onboarding controls instead of skeleton-only cards.
- Home screen examples now support sidebar navigation, deployment row selection, sort/search feedback, activity feed actions, metric selection, invoice row selection, client card selection, and new-invoice feedback.
- Detail screen examples now support sidebar nav, top tabs, metric cards, deployment table row selection, invoice actions, receipt download, activity selection, and comment entry feedback.
- Settings screen examples now support sidebar/top tab navigation, avatar action, save feedback, update row actions, add-bank/add-application actions, and animated timezone toggle state.
- Command palette rows, footer labels, and preview text now use truncation and no-wrap rules to avoid awkward card-internal line breaks.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome desktop smoke clicked and verified representative routes:
  - `plus-application-page-examples-home-screens`: `Deployments`, `Revenue`, `Activity`.
  - `plus-application-page-examples-detail-screens`: `Deployments`, `Overview`, `Activity`.
  - `plus-application-page-examples-settings-screens`: `Deployments`, `Activity`, `Save`.
  - `plus-application-page-examples-dashboards`: `Revenue`, `Overview`, `Activity`.
  - `plus-templates-auth`: `Email`, `Google`, `Continue`.
  - `plus-templates-onboarding`: representative template actions.
- Mobile 390px smoke checked Application UI home/detail/settings/dashboard routes for no horizontal overflow.
- Chrome console error check returned no errors.

Evidence screenshots:

- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step9/application-home-desktop.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step9/application-settings-desktop.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step9/application-auth-desktop.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step9/application-home-mobile.png`

## Step 10 - Ecommerce category and cart inert action sweep

Scope:

- Ecommerce category preview variants.
- Ecommerce category filter category links.
- Ecommerce shopping cart variants.

Implementation:

- Rendered category preview `href="#"` controls were converted to buttons with selection rings, hover/press motion, and visible feedback.
- Category filter sidebar category links now update active selection and feedback.
- Shopping cart Checkout and Continue shopping actions now render feedback in drawer, two-column, single-column, dialog, and popover variants.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome smoke verified:
  - `plus-ecommerce-category-filters`: `Totes`, `Color`.
  - `plus-ecommerce-category-previews`: `Shop now`, `Shop collection`.
  - `plus-ecommerce-shopping-carts`: preview `Checkout`.
- Mobile 390px shopping cart overflow was 0.
- Chrome console error check returned no errors.

Evidence screenshots:

- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step10/ecommerce-category-previews-desktop.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step10/ecommerce-cart-desktop.png`

## Step 11 - Ecommerce quickview, product-list, order history inert action sweep

Scope:

- Ecommerce product quickviews.
- Ecommerce product lists.
- Ecommerce order summaries.
- Ecommerce order history.
- Ecommerce order history page examples.

Implementation:

- Quickview `Size guide` and `View full details` controls now update visible feedback.
- Product-list `View product`, overlay `Add to bag`, and card `Add to bag` controls now update visible feedback.
- Order summary `Continue shopping` and `View invoice` controls now use buttons with feedback.
- Order history `View product`, `Buy again`, `Manage order`, `View invoice`, and `Shop similar` controls now use buttons with feedback.
- StoreHeader category navigation now uses stateful buttons instead of inert anchors.
- A rendered `href="#"` sweep now only finds code/documentation snippets around the docs examples, not preview controls.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome smoke verified:
  - `plus-ecommerce-product-quickviews`: `Size guide`, `View full details`.
  - `plus-ecommerce-product-lists`: `View product`, `Add to bag`.
  - `plus-ecommerce-order-summaries`: `Continue shopping`, `View invoice`.
  - `plus-ecommerce-order-history`: `View product`, `Buy again`, `Manage order`.
  - `plus-ecommerce-page-examples-order-history-pages`: `Women` nav feedback.
- Mobile 390px order-history overflow was 0.
- Chrome console error check returned no errors.

Evidence screenshots:

- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step11/ecommerce-quickviews-desktop.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step11/ecommerce-order-summaries-desktop.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step11/ecommerce-order-history-desktop.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step11/ecommerce-order-history-pages-desktop.png`

## Step 12 - Ecommerce checkout, review, filter button feedback sweep

Scope:

- Ecommerce category filters.
- Ecommerce product overviews.
- Ecommerce checkout forms.
- Ecommerce reviews.

Implementation:

- Category filter Apply and Clear controls now update visible feedback and use hover/press motion.
- Product overview Add to cart now changes to an added state, sets visible feedback, and uses hover/press/fade motion.
- Checkout form Confirm order, Continue to payment, and Pay controls now update visible feedback.
- Review Write a review controls now open visible feedback across summary/simple/multi-column variants.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome smoke verified:
  - `plus-ecommerce-category-filters`: `Apply`, `Clear`.
  - `plus-ecommerce-product-overviews`: `Add to cart`.
  - `plus-ecommerce-checkout-forms`: `Confirm order`, `Continue to payment`, `Pay $281.00`.
  - `plus-ecommerce-reviews`: `Write a review`.
- Mobile 390px reviews and checkout overflow was 0.
- Chrome console error check returned no errors.

Evidence screenshots:

- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step12/desktop_category_filters_apply.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step12/desktop_checkout_confirm.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step12/desktop_reviews_write.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step12/mobile_product_overview_added.png`

## Step 13 - Docs and Marketing static button feedback sweep

Scope:

- Legacy Docs element previews.
- Marketing hero section previews.
- Topbar shell actions.

Implementation:

- Legacy Docs autocomplete, dropdown menu, copy button, dialog, disclosure, popover, select, and tabs previews now expose stateful open, selection, copy, close, and tab behavior.
- Marketing hero nav, primary/secondary CTAs, announcement buttons, GitHub/demo/read-more actions, and collage image tiles now update visible feedback.
- Topbar Sign in, Get full access, and mobile More options now update visible feedback.
- A rendered `<button type="button">` scan for missing `onClick` returned no matches.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome smoke verified:
  - `docs-elements-autocomplete`: autocomplete control feedback.
  - `docs-elements-dropdown-menu`: Options menu visibility.
  - `docs-elements-copy-button`: Copy/Copied feedback.
  - `docs-elements-dialog`: dialog close/open behavior.
  - `docs-elements-select`: select value feedback.
  - `plus-marketing-hero-sections`: Get started feedback.
  - topbar shell: Sign in feedback.
- Mobile 390px Marketing hero and Docs routes overflow was 0.
- Chrome console error check returned no errors.

Evidence screenshots:

- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step13/desktop_docs_dropdown_options.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step13/desktop_marketing_hero_feedback.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step13/desktop_topbar_signin_feedback.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step13/mobile_docs_autocomplete.png`

## Step 14 - Pseudo-button span CTA feedback sweep

Scope:

- Marketing pricing sections.
- Marketing CTA sections.
- Ecommerce promo sections.
- Ecommerce shopping-cart newsletter footers.
- Fallback preview CTA controls.

Implementation:

- Marketing pricing `Contact sales` is now a real button with visible feedback.
- Marketing CTA `Get started` and `Learn more` controls are now real buttons with feedback and hover/press motion.
- Ecommerce promo `Shop collection` controls are now real buttons with feedback and hover/press motion.
- Ecommerce cart/checkout newsletter footer email and signup controls now expose visible focus/signup feedback.
- Fallback preview `Browse Plus` and `Read Docs` controls are now real buttons.
- Decorative labels inside an already-clickable parent card and status badges were left as non-buttons.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome smoke verified:
  - `plus-marketing-cta-sections`: `Get started`.
  - `plus-marketing-pricing-sections`: `Contact sales`.
  - `plus-ecommerce-promo-sections`: `Shop collection`.
  - `plus-ecommerce-page-examples-shopping-cart-pages`: `Sign up`.
- Mobile 390px CTA and promo overflow was 0.
- Chrome console error check returned no errors.

Evidence screenshots:

- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step14/desktop_marketing_cta_started.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step14/desktop_pricing_contact_sales.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step14/desktop_ecommerce_promo_collection.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step14/mobile_cart_newsletter_signup.png`

## Step 15 - Marketing leaf density reference pass

Reference:

- Live Tailwind Plus URL: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/cta-sections`
- Captured screenshot: `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step15/tailwind_cta_sections_reference.png`

Observed Tailwind structure:

- Top breadcrumb-like product/category context.
- H1 leaf title and concise description.
- Repeated H2 example sections.
- First example exposes Preview/Code/HTML/React/Vue controls.
- Locked examples expose Preview and `Get the code`.

Implementation:

- Marketing leaf renderer now shows breadcrumb/category context and an info notice.
- Right rail now lists the example count and example titles.
- Example headers now expose numbering, description, and tags instead of title-only rows.
- Locked-code modal now includes the requested example title, description, and tags.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome DOM smoke verified on `plus-marketing-cta-sections`:
  - info notice visible.
  - example tags visible.
  - `Example 01` badge visible.
  - locked-code modal visible with example metadata.
  - mobile 390px overflow was 0.
- Chrome screenshot saving timed out for modal/mobile states, so those states are recorded as DOM smoke evidence rather than screenshot files.

Evidence screenshots:

- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step15/tailwind_cta_sections_reference.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step15/local_cta_sections_density_desktop.png`

## Step 16 - Application/Ecommerce leaf code flow reference pass

Reference:

- Live Tailwind Plus URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/form-layouts`
- Live Tailwind Plus URL: `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/product-overviews`
- Chrome screenshot saving timed out for live reference pages, so this step uses DOM observation evidence.

Observed Tailwind structure:

- Application `Form Layouts` shows breadcrumb `UI Blocks / Application UI / Forms / Form Layouts`.
- Ecommerce `Product Overviews` shows breadcrumb `UI Blocks / Ecommerce / Components / Product Overviews`.
- Both leaves expose `Preview / Code / HTML / React / Vue` on the first example.
- Later examples expose `Preview` and `Get the code`.
- Application reference examples observed: `Stacked`, `Two-column`, `Two-column with cards`, `Labels on left`.
- Ecommerce reference examples observed: `With image grid`, `With tiered images`, `With image gallery and expandable details`, `Split with image`, `With tabs`.

Implementation:

- Shared catalog leaf renderer now treats the first example in every leaf as the public code example.
- Application and Ecommerce leaves now get the same first-example Code tab behavior that Marketing leaves already had.
- Header fallback and info notice copy now describe generic leaf behavior instead of Marketing-only behavior.
- Locked-code modal copy now references each leaf's first public example instead of `Simple centered`.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome DOM smoke verified on `plus-forms-form-layouts`:
  - one `Code` button, three `Get the code` buttons, examples 01-04.
  - Code tab opened and language selector switched to `html`.
  - locked modal opened for `Two-column` with generic copy and tags.
  - mobile 390px overflow was 0.
- Chrome DOM smoke verified on `plus-ecommerce-product-overviews`:
  - one `Code` button, four `Get the code` buttons, examples 01-05.
  - Code tab opened and language selector switched to `html`.
  - locked modal opened for `With tiered images` with generic copy and tags.
  - mobile 390px overflow was 0.
- Chrome console log contained only React DevTools info messages.

## Step 51 - Table Headings page parity pass

Scope:

- One leaf only: `plus-application-headings-table-headings`.
- Tailwind Plus currently has no `Application UI / Headings / Table Headings` leaf, so the closest official reference was `Application UI / Lists / Tables`.
- Captures are stored in `docs/research/assets/tailwind-plus-page-parity-2026-07-03/table-headings/`.

Implementation:

- Replaced the reused page-heading preview with table-specific variants.
- Added toolbar, basic table heading, and filter-chip examples.
- Added Search, Filter, Export, Add member, sortable heading, row-open, and filter interactions with visible feedback and press/motion states.
- Added dark-theme table styling and kept mobile overflow inside the table frame.

Verification:

- `npm run build` passed with only the existing Vite chunk-size warning.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified:
  - Search, Filter, Export, and Add member feedback.
  - Email heading sort feedback.
  - Courtney Henry row-open feedback.
  - Admin filter selection.
  - Dark-mode text visibility.
  - No framework overlay.
  - Mobile 390px document overflow was 0.

## Step 52 - Description Lists page parity pass

Scope:

- One leaf only: `plus-data-display-description-lists`.
- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/data-display/description-lists`.
- Captures are stored in `docs/research/assets/tailwind-plus-page-parity-2026-07-03/description-lists/`.

Implementation:

- Compared Tailwind's six Description Lists examples against the local six-example leaf.
- Kept the Tailwind-like key/value structure and tightened behavior rather than changing the page family.
- Inline action rows now change visible state from `Update` to `Updated` and highlight updated rows.
- Attachment `Download` and `Remove` controls now produce feedback, and removal updates the rendered attachment list.
- The narrow hidden-label receipt example now has selectable receipt-detail rows plus receipt download feedback.
- The preview dark toggle now applies to all description-list variants, not only the already-dark striped example.

Verification:

- `npm run build` passed with only the existing Vite chunk-size warning.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified:
  - Row update feedback and `Updated` state.
  - Attachment download feedback.
  - Attachment removal feedback and visible attachment-list state change.
  - Receipt row toggle and receipt download feedback.
  - Dark preview application and text visibility.
  - No framework overlay.
  - Mobile 390px document overflow was 0.

## Step 53 - Stats page parity pass

Scope:

- One leaf only: `plus-data-display-stats`.
- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/data-display/stats`.
- Captures are stored in `docs/research/assets/tailwind-plus-page-parity-2026-07-03/stats/`.

Implementation:

- Compared Tailwind's five Application UI Stats examples against the local five-example leaf.
- Kept the Tailwind-like metric layouts and upgraded behavior inside the local renderer.
- Trending metrics, simple deployment stats, card metrics, brand-icon metrics, and shared-border metrics now behave as selectable controls.
- Added visible selected states, hover/press motion, and feedback messages for every Stats example family.
- Kept brand-icon `View all` actions interactive and verified their feedback.
- The dark preview toggle now applies to Stats variants that were previously light-only, with stronger active-state contrast.

Verification:

- `npm run build` passed with only the existing Vite chunk-size warning.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified:
  - Trending metric selection feedback.
  - Simple deploy-stat selection feedback.
  - Card metric selection feedback.
  - Brand-icon `View all` feedback.
  - Shared-border metric selection feedback.
  - Dark preview application and text visibility.
  - No framework overlay.
  - Mobile 390px document overflow was 0.

## Step 54 - Calendars page parity pass

Scope:

- One leaf only: `plus-data-display-calendars`.
- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/application-ui/data-display/calendars`.
- Captures are stored in `docs/research/assets/tailwind-plus-page-parity-2026-07-03/calendars/`.

Implementation:

- Compared Tailwind's eight Application UI Calendars examples against the local eight-example leaf.
- Kept the Tailwind-like small/month/week/day/year/double/borderless calendar layouts and upgraded behavior inside the local renderer.
- Mini calendar days, month grid days, week grid slots, day-view time slots, and meeting rows now behave as selectable controls.
- Added visible selected states, hover/press motion, and feedback messages for calendar interactions.
- Kept `Today` and `Add event` stateful and verified their feedback.
- The dark preview toggle now applies to calendar variants that were previously light-only.

Verification:

- `npm run build` passed with only the existing Vite chunk-size warning.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified:
  - Meeting row selection feedback.
  - Mini/month day selection feedback.
  - `Today` feedback.
  - Week-slot selection feedback.
  - Day-view time-slot selection feedback.
  - `Add event` feedback.
  - Dark preview application and text visibility.
  - No framework overlay.
  - Mobile 390px document overflow was 0.

## Step 46 - Marketing generic copy quality sweep

Scope:

- Residual Tailwind-style generic marketing copy across Feature Sections, Footers, Content Sections, Logo Clouds, Landing Pages, Pricing Sections, and 404 Pages.
- Existing interactive CTA/button behavior on those routes was preserved.

Implementation:

- Replaced generic productivity/app/customer-growth language with UI Dictionary-specific copy about shared UI vocabulary, implementation prompts, pattern references, review workflows, pricing comparison structure, and state coverage.
- Replaced generic logo-cloud trust copy and case-study copy with product-specific references to teams comparing layouts, states, and implementation tradeoffs.
- Replaced pricing plan descriptions and pricing-page support copy with UI pattern library-oriented copy.
- Kept legitimate `placeholder` terminology in input/avatar/skeleton contexts unchanged.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Targeted generic-copy scan returned no matches for the removed phrases.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified affected Marketing routes:
  - Footers, Content Sections, Logo Clouds, Pricing Sections, and 404 Pages representative CTAs still produced feedback.
  - Feature Sections and Landing Pages rendered the updated copy and had no mobile overflow.
  - All checked routes had no positive document overflow at mobile 390px.
- Severe console error check returned no errors during the representative smoke.

## Step 47 - Reviews page parity pass

Scope:

- Single leaf page: `plus-ecommerce-reviews` (`Plus / UI Blocks / Ecommerce / Components / Reviews`).
- Reference URL: `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/reviews`.
- Screenshot evidence:
  - Tailwind reference: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/reviews/tailwind-reviews-desktop.png`
  - Local before: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/reviews/local-reviews-desktop-before.png`
  - Local after: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/reviews/local-reviews-desktop-after.png`
  - Local dark: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/reviews/local-reviews-dark-after.png`
  - Local mobile: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/reviews/local-reviews-mobile-after.png`

Comparison:

- Tailwind's first Reviews example uses a row-based review layout with distinct reviewer, rating, and body columns. Local before used card-grid reviews, which looked like a different example type.
- Tailwind's summary chart emphasizes clickable-looking rating distribution, a write-review CTA, and a spacious review list. Local before had the structure but the distribution rows and review content were mostly static.
- Local preview theme controls existed, but the Reviews preview internals needed explicit dark-tone styling to make dark mode credible.

Implementation:

- Reworked `commerce-review-multi-column` into a row-based review layout closer to the Tailwind reference.
- Added stateful rating distribution filters, review selection, helpful buttons, write-review feedback, hover/press motion, and animated feedback pills.
- Added dark-mode styling branches for Reviews surfaces, panels, borders, text, stars, and feedback.
- Kept the changes scoped to the Reviews leaf renderer.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-reviews` verified:
  - `Write a review` produced `Review composer opened`.
  - `5 star` distribution filter produced `5 star reviews filtered`.
  - Review title click produced review-open feedback.
  - Helpful action produced marked-helpful feedback.
  - Dark theme toggle rendered the first Reviews preview as a dark panel.
  - Mobile 390px overflow was 0.
  - No relevant console errors and no framework overlay were detected.

## Step 48 - Page Headings page parity pass

Scope:

- Single leaf page: `plus-application-headings-page-headings` (`Plus / UI Blocks / Application UI / Headings / Page Headings`).
- Reference URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/headings/page-headings`.
- Screenshot evidence:
  - Tailwind reference: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/page-headings/tailwind-page-headings-desktop.png`
  - Local before: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/page-headings/local-page-headings-desktop-before.png`
  - Local after: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/page-headings/local-page-headings-desktop-after.png`
  - Local dark: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/page-headings/local-page-headings-dark-after.png`
  - Local mobile: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/page-headings/local-page-headings-mobile-after.png`

Comparison:

- Tailwind's Page Headings examples use the same nine example names as local, but the actions vary per example: `Edit/View/Publish`, `Message/Call`, `Disqualify/Advance to offer`, `View profile`, range tabs plus `New invoice`, and invoice `Copy URL/Edit/Send`.
- Local before reused a mostly identical `Edit/Publish + Ready to publish` action set across variants, making several examples feel like the same shell.
- Local dark theme initially exposed weak contrast in light-card variants, so the page-heading dark branch needed a real slate panel rather than translucent white over a light preview frame.

Implementation:

- Added a scoped `ActionCluster` helper inside the page heading renderer to keep actions variant-specific without changing other leaves.
- Updated banner, avatar, stats-card, filters, and logo/meta examples to match Tailwind's action vocabulary and page contexts more closely.
- Added visible feedback for `View`, `Message`, `Call`, `Disqualify`, `Advance to offer`, `View profile`, cashflow range tabs, `New invoice`, `Copy URL`, `Edit`, and `Send`.
- Improved dark-mode contrast for page-heading preview panels and kept press/hover motion on controls.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-headings-page-headings` verified:
  - Exact `View` action produced `Preview opened`.
  - `Message` produced `Message composer opened`.
  - `Advance to offer` produced `Candidate advanced to offer`.
  - `View profile` produced `Rebecca Nichols profile opened`.
  - `Last 30 days` produced `Last 30 days cashflow range selected`.
  - `Copy URL` produced `Invoice URL copied`.
  - Dark theme toggle kept the first preview text visible on a slate panel.
  - Mobile 390px overflow was 0.
  - No relevant console errors and no framework overlay were detected.

## Step 49 - Card Headings page parity pass

Scope:

- Single leaf page: `plus-application-headings-card-headings` (`Plus / UI Blocks / Application UI / Headings / Card Headings`).
- Reference URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/headings/card-headings`.
- Screenshot evidence:
  - Tailwind reference: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/card-headings/tailwind-card-headings-desktop.png`
  - Local before: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/card-headings/local-card-headings-desktop-before.png`
  - Local after: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/card-headings/local-card-headings-desktop-after.png`
  - Local interaction: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/card-headings/local-card-headings-interaction-after.png`
  - Local dark: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/card-headings/local-card-headings-dark-after.png`
  - Local mobile: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/card-headings/local-card-headings-mobile-after.png`

Comparison:

- Tailwind's Card Headings examples are structurally compact card headers with faint row content. Local before matched the rough shape, but rows/statuses were read-only and the preview theme toggle did not make the light variants render as dark examples.
- The avatar/meta/dropdown example needed an animated menu state rather than an instant conditional popover.

Implementation:

- Converted job rows into selectable buttons with selected row feedback and press/hover motion.
- Added feedback to `Create new job`, `Phone`, and `Email` actions.
- Reworked avatar/meta/dropdown menu into an animated open/closed panel with `Copy link`, `Mute`, and `Report` actions.
- Added preview-theme dark override for all card-heading variants while preserving the existing default dark examples.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-headings-card-headings` verified:
  - Job row click produced `Back End Developer selected`.
  - `Create new job` produced `New job draft created`.
  - `Phone` produced `Calling Tom Cook`.
  - `Email` produced `Email draft opened`.
  - Dropdown trigger produced `Menu opened`.
  - `Copy link` produced `Copy link selected`.
  - Dark theme toggle kept card heading text visible.
  - Mobile 390px overflow was 0.
  - No relevant console errors and no framework overlay were detected.

## Step 50 - Section Headings page parity pass

Scope:

- Single leaf page: `plus-application-headings-section-headings` (`Plus / UI Blocks / Application UI / Headings / Section Headings`).
- Reference URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/headings/section-headings`.
- Screenshot evidence:
  - Tailwind reference: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/section-headings/tailwind-section-headings-desktop.png`
  - Local before: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/section-headings/local-section-headings-desktop-before.png`
  - Local after: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/section-headings/local-section-headings-desktop-after.png`
  - Local interaction: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/section-headings/local-section-headings-interaction-after.png`
  - Local dark: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/section-headings/local-section-headings-dark-after.png`
  - Local mobile: `docs/research/assets/tailwind-plus-page-parity-2026-07-03/section-headings/local-section-headings-mobile-after.png`

Comparison:

- Tailwind's Section Headings examples are mostly compact heading/action/tab patterns; local before matched the structure, but the dark preview toggle did not affect light variants.
- The badge/dropdown example needed animated open/closed menu behavior and clearer menu-item feedback.

Implementation:

- Added preview-theme dark override for Section Heading variants while preserving existing default dark examples.
- Added press motion to actions and dark-aware input group styling.
- Reworked badge/dropdown menu into an animated panel with `Archive`, `Duplicate`, and `Close role` feedback.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-headings-section-headings` verified:
  - `Share` produced `Share link copied`.
  - `Create new job` produced `New job created`.
  - `Search candidates` produced `Candidate search focused`.
  - `Sort` produced `Candidate sort opened`.
  - `Offer` tab produced `Offer tab opened`.
  - `Closed` inline tab produced `Closed tab opened`.
  - Dropdown trigger produced `Menu opened`.
  - `Archive` produced `Archive selected`.
  - Dark theme toggle kept section heading text visible.
  - Mobile 390px overflow was 0.
  - No relevant console errors and no framework overlay were detected.

## Step 45 - Storefront, review card, and copy quality sweep

Scope:

- Ecommerce Storefront page examples with static customer story and design-detail cards.
- Ecommerce Product page examples with static review rows.
- Remaining placeholder/filler copy in Ecommerce Incentives and Application table examples.

Implementation:

- Converted Storefront customer story cards into feedback buttons with hover lift, press motion, selected ring, and visible story feedback.
- Converted Storefront design-detail cards into feedback buttons with selected styling and visible detail feedback.
- Converted Product page review rows into clickable review cards with selected styling and feedback near the review summary.
- Replaced the remaining Tailwind placeholder/filler copy in Incentives and the compact transaction table with UI Dictionary/product-specific copy.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Targeted filler-copy scan passed for `Sed`, lorem/ipsum, placeholder stock-market copy, and Tailwind incentive joke copy.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified:
  - `plus-ecommerce-page-examples-storefront-pages`: storefront story/detail card click produced feedback.
  - `plus-ecommerce-page-examples-product-pages`: product review card click produced feedback.
  - `plus-ecommerce-incentives`: incentive benefit click produced feedback.
  - `plus-application-lists-tables`: table action click produced feedback.
  - All four routes had no positive document overflow at mobile 390px.
- Severe console error check returned no errors during the representative smoke.

## Step 44 - Bento, description list, and incentive affordance sweep

Scope:

- Marketing Bento integration rows that looked like selectable integration status rows but rendered as static `div` blocks.
- Application Description List inline `Update` affordances that looked actionable but rendered as plain text.
- Ecommerce Incentives benefit cards and icon rows that looked like promise cards but had no stateful interaction.

Implementation:

- Converted Bento integration rows into selectable buttons with hover lift, press motion, selected styling, and visible feedback inside the Bento card.
- Converted Description List inline `Update` affordances into buttons that leave field-specific feedback.
- Converted Incentives benefit cards, two-by-two cards, supporting icon rows, and compact icon rows into stateful buttons with selected styling, motion, and section-level feedback.
- Replaced a remaining filler performance sentence in Bento copy with validation-oriented product copy.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified:
  - `plus-marketing-bento-grids`: integration row click produced feedback.
  - `plus-application-ui-data-display-description-lists`: `Update`/download control click produced feedback.
  - `plus-ecommerce-incentives`: benefit card click produced feedback.
  - All three routes had no positive document overflow at mobile 390px.
- Severe console error check returned no errors during the representative smoke.

## Step 43 - Application and Ecommerce static card feedback sweep

Scope:

- Application Grid Lists examples where project/profile/action/image cards looked clickable but rendered as static `div` blocks.
- Application Data Display examples where metric cards and table rows were static and the generic table structure was awkward.
- Ecommerce page examples where review cards, order summary cards, and order-history footer links looked like interactive account/store controls but did not leave feedback.

Implementation:

- Converted Grid Lists project, horizontal profile, shared action, and image-detail cards into stateful buttons with selected styling, hover lift, press motion, and visible feedback.
- Converted Data Display metric cards into selectable buttons and rebuilt the small table preview as a header plus clickable rows with truncation-safe cells.
- Converted Ecommerce review cards into selectable review buttons.
- Converted Order History page summary cards and footer links into feedback buttons while avoiding nested buttons inside product/order line rows.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified:
  - `plus-application-lists-grid-lists`: a rendered grid-list card produced feedback.
  - `plus-application-ui-data-display`: a metric/table control produced feedback.
  - `plus-ecommerce-page-examples-order-history-pages`: order-history controls produced feedback.
  - `plus-ecommerce-page-examples`: page-example controls produced feedback.
  - All four routes had no positive document overflow at mobile 390px.
- Severe console error check returned no errors during the representative smoke.

## Step 17 - Residual preview action feedback sweep

Scope:

- Remaining rendered Marketing footer/newsletter/contact/content CTAs.
- Marketing header, flyout, and banner action controls.
- Application calendar, form, overlay, data, nav, grid-list, and feed preview actions.

Implementation:

- Footer/newsletter/contact/content CTAs now show visible feedback and hover/press motion.
- Header and flyout mobile menu controls now toggle state and show feedback.
- Header CTA, flyout footer actions, banner register/dismiss/accept controls now update visible feedback.
- Calendar Today/Add event controls now update visible feedback.
- Generic Application shell/data/form/nav/overlay previews now use stateful buttons for active nav, export, save/cancel, toggle, apply/cancel/open flows.
- Grid list Email/Call and feed Comment controls now show visible feedback.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome smoke verified:
  - `plus-marketing-flyout-menus`: `Watch demo` feedback.
  - `plus-marketing-banners`: `Register now` feedback.
  - `plus-data-display-calendars`: `Add event` feedback.
  - `plus-forms`: `Save` feedback.
  - `plus-overlays`: `Apply` and `Open overlay` flow.
  - `plus-application-lists-grid-lists`: `Email` feedback.
  - `plus-application-lists-feeds`: `Comment` feedback.
- Desktop and mobile 390px horizontal overflow returned 0 on all checked routes.
- Chrome console log contained only React DevTools info messages.

## Step 19 - Table, pagination, navbar, and modal feedback sweep

Scope:

- Residual table checkbox/sort affordances, pagination controls, navbar pseudo-actions, modal close/confirm flows, and command menu row wrapping.
- Browser-discovered React key warning in Marketing pricing previews.

Implementation:

- Table checkboxes and sortable headings now use real buttons with visible feedback.
- Pagination leaf and overview controls now use real buttons, active page state, feedback, and hover/press motion.
- Navbar search, quick action, notification, avatar, mobile menu, and nav rows now expose visible feedback.
- Modal cancel, dismiss, confirm, and reopen flows now leave feedback and keep panel motion.
- Command palette/menu rows now use `min-w-0` plus truncation to avoid awkward card wrapping.
- Pricing comparison rows and navbar helper buttons now have stable keys.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome smoke verified:
  - `plus-navigation-pagination`: `Next` produced `Page 2 opened`.
  - `plus-navigation-navbars`: `Search` produced `Navbar search opened`.
  - `plus-overlays-modal-dialogs`: `Cancel` and `Open dialog` produced modal feedback.
  - `plus-application-lists-tables`: `Edit` produced `Lindsay Walton editing`.
  - `plus-navigation-command-menus`: `Create term` produced `Create term selected`.
  - `plus-marketing-pricing-sections`: rendered with no warning/error logs after key fixes.
- Final fresh-tab Chrome console warning/error log was empty.

## Step 20 - Overview and page example feedback sweep

Scope:

- Residual overview/page-example controls that changed state without visible feedback.
- Application UI navigation/data/page examples with buttons that looked actionable but did not confirm the action.
- Ecommerce product, checkout, and order page examples that still had weak or inaccessible controls.

Implementation:

- Added visible feedback and press motion to generic tabs, empty-state CTAs, hero spotlight CTAs, overlay Cancel/Apply actions, app onboarding/sidebar controls, ecommerce product/list/checkout/order broad previews, store navigation, data metrics, description-list rows, table/list rows, and navbar page actions.
- Fixed Product Page leaf accessibility by adding explicit labels to product nav icon buttons and color swatches.
- Added visible color and size selection feedback to Product Page leaf examples.
- Converted Checkout Page progress chips to real buttons with feedback and press motion.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome fresh-tab smoke verified:
  - `plus-navigation-navbars`: `Projects` produced `Projects opened`.
  - `plus-application-page-examples-onboarding`: `Workspace` produced `Workspace step opened`.
  - `plus-ecommerce-page-examples-product-pages`: `Black color` produced `Black color selected`.
  - `plus-ecommerce-page-examples-product-pages`: `M` produced `M size selected`.
  - `plus-ecommerce-page-examples-checkout-pages`: `Confirm order` produced `Order confirmed`.
  - `plus-ecommerce-page-examples-order-detail-pages`: `Delivered` produced `Delivered opened`.
- Chrome severe console log was empty; only normal dev/info messages were present.

## Step 21 - Leaf icon accessibility and feedback sweep

Scope:

- Rendered leaf/page-example icon buttons whose accessible names were empty or ambiguous.
- Ecommerce and Application page examples where header icon actions were clickable but weakly announced.
- Category page icon actions that changed state without a visible feedback banner.

Implementation:

- Added explicit accessible names to Ecommerce storefront, category, cart, checkout, order detail, and order history header icon buttons.
- Added visible feedback to category page header actions by rendering a shared category feedback banner across all category-page variants.
- Updated storefront/category nav rows so selection also leaves visible feedback.
- Added accessible names to Application page-example notification icon buttons and disambiguated them from the sidebar `Notifications` nav item with `Open notifications`.
- Added accessible names to modal/drawer/notification close buttons and chevron-only button-group controls.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome fresh-tab smoke verified accessible-name clicks and visible feedback:
  - `plus-ecommerce-page-examples-storefront-pages`: `Search` and `Account`.
  - `plus-ecommerce-page-examples-category-pages`: `Filters`.
  - `plus-ecommerce-page-examples-shopping-cart-pages`: `Cart`.
  - `plus-ecommerce-page-examples-checkout-pages`: `Account`.
  - `plus-ecommerce-page-examples-order-history-pages`: `Search`.
  - `plus-application-page-examples-home-screens`: `Open notifications`.
- Chrome severe console log was empty.

## Step 22 - Marketing pseudo CTA feedback sweep

Scope:

- Rendered Marketing pseudo-CTA text that looked clickable but was still a `span` or `p`.
- Action Panel CTA slots that looked like buttons/links but were not individually interactive.
- Feedback placement for newly interactive pseudo-CTA controls.

Implementation:

- Converted Header Sections `Open roles`, `Internship program`, `Our values`, and `Meet our leadership` pseudo-links into buttons with feedback.
- Converted Banner `Learn more` pseudo-links into buttons with feedback.
- Converted Blog Sections `Continue reading` into a button with feedback.
- Converted Content Sections `Learn more about our company` into a button with feedback.
- Converted Action Panel `Change plan` and `Learn more about our CI features` pseudo-actions into buttons with feedback.
- Added feedback display in the stats header variant so header actions visibly respond.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome fresh-tab smoke verified:
  - `plus-marketing-header-sections`: `Open roles` produced `Open roles opened`.
  - `plus-marketing-banners`: `Learn more` produced `Banner details opened`.
  - `plus-marketing-blog-sections`: `Continue reading` produced `Featured article opened`.
  - `plus-marketing-content-sections`: `Learn more about our company` produced `Company story opened`.
  - `plus-forms-action-panels`: `Learn more about our CI features` produced `CI features opened`.
  - `plus-forms-action-panels`: `Change plan` produced `Plan change opened`.
- Chrome severe console log was empty.

## Step 23 - State-only navigation feedback sweep

Scope:

- Controls that only changed active navigation state without visible feedback.
- Application shell stacked/sidebar/multi-column previews.
- Tabs, command palette rows, and small reusable element examples with awkward or weak feedback.
- Ecommerce category filters, product quickview selectors, product detail tabs, and checkout steppers.

Implementation:

- Added visible feedback to Marketing/Ecommerce page-example nav buttons, product nav buttons, checkout steppers, vertical navigation, sidebar navigation, stacked shells, sidebar shells, and multi-column shells.
- Added feedback and press motion to section-heading tabs, generic tab bars, command palette rows, avatar/badge/button-group element examples, generic app-shell nav, and generic navigation examples.
- Added feedback to Ecommerce category filter sidebars, toolbar filters, expandable filter panels, category-page filter chips, product quickview color/size controls, product expandable details, product tabs, and checkout steppers.
- Fixed a Chrome-smoke-discovered checkout issue by rendering Stepper feedback directly under the stepper so every checkout variant shows the clicked step result.
- Rechecked command palette row behavior so selected rows stay single-line/truncated instead of wrapping awkwardly inside the card.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome fresh-tab smoke verified:
  - `plus-application-shells-stacked-layouts`: `Projects` produced `Projects opened`.
  - `plus-application-shells-stacked-layouts`: `Activity` produced `Activity tab opened`.
  - `plus-application-shells-sidebar-layouts`: `Team` produced `Team opened`.
  - `plus-application-shells-multi-column-layouts`: `Projects` produced `Projects opened`.
  - `plus-ecommerce-page-examples-checkout-pages`: `Shipping method` produced `Shipping method step opened`.
  - `plus-ecommerce-category-filters`: `Color` produced `Color filter toggled`.
  - `plus-ecommerce-product-quickviews`: `Black` produced `Black color selected`.
- Chrome smoke also showed `nav:plus-application-ui-elements` is not the correct direct route for the element preview page; that route mapping can be swept in a later pass if needed.

## Step 24 - Application UI alias route normalization

Scope:

- Chrome smoke found that `nav:plus-application-ui-elements` was a plausible route but did not resolve to the Application UI Elements leaf.
- The same alias shape can happen across Tailwind-style Application UI category paths: `application-ui/forms`, `application-ui/navigation/tabs`, `application-ui/elements/button-groups`, and similar.

Implementation:

- Added `normalizeNavigationFilter` in `navigation-model.ts`.
- Added canonical aliases from `plus-application-ui-*` filters to the existing local canonical filter IDs:
  - shells, headings, data display, lists, forms, feedback, navigation, overlays, elements, layout, and page examples.
- Updated `isNavigationFilter` and `getNavigationCollection` to accept normalized aliases.
- Updated initial URL parsing so alias query filters become canonical filters before leaf-page map lookup.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome alias-route smoke verified:
  - `nav:plus-application-ui-elements`: `Elements`, `Admin` produced `Admin badge selected`.
  - `nav:plus-application-ui-elements-button-groups`: `Button Groups`, `Months` produced `Months selected`.
  - `nav:plus-application-ui-navigation-tabs`: `Tabs`, `Company` produced `Company tab opened`.
  - `nav:plus-application-ui-forms-form-layouts`: `Form Layouts`, `Save` produced `Form layout saved`.
- Chrome severe console log was empty.

## Step 25 - Marketing placeholder copy replacement

Scope:

- Visible placeholder Latin copy in rendered examples and code snippets.
- Marketing-heavy leaf pages where placeholder copy weakened the Tailwind-style page depth.
- Related Application examples that still surfaced lorem-style text in alerts, modals, media objects, feeds, and card headings.

Implementation:

- Replaced CTA section copy with UI Dictionary-specific calls to action.
- Replaced Bento, Testimonials, FAQs, Contact, Content, Logo Cloud, Pricing, Landing, and About page placeholder text with product/pattern-specific copy.
- Replaced Application alert/modal/notification/media/feed/card-heading filler copy with concrete UI workflow language.
- Updated code-tab hero snippets so the visible snippet copy no longer contains Latin placeholder text.
- Verified a targeted `App.tsx` scan for `Lorem ipsum`, common Latin filler words, and similar placeholder phrases now returns no matches.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome copy/interactivity smoke verified:
  - `plus-marketing-cta-sections`: `Build clearer interfaces.` visible, `Get started` produced `CTA started`.
  - `plus-marketing-testimonials`: `UI Dictionary gave our team a shared language` visible.
  - `plus-marketing-faqs`: `How do I choose between similar UI patterns?` and the first answer visible.
  - `plus-marketing-content-sections`: `Preview the component states before the workflow reaches production.` visible, `Learn more about our company` produced `Company story opened`.
  - `plus-feedback-alerts`: `Review the highlighted setting before continuing` visible.
- Chrome severe console log was empty.

## Step 26 - Template code snippet language consistency

Scope:

- Marketing/template leaf Code tabs with HTML/React/Vue language switching.
- Source-level hero example placeholder/mock/future-code scaffolding.
- Locked code modal copy that presented the access boundary as unfinished.

Implementation:

- Removed unused `codePlaceholder` from marketing section examples.
- Removed stale placeholder/mock/future-code copy from Hero Section examples.
- Updated Code tab implementation notes to describe the active copy-to-clipboard behavior.
- Added language-specific generic snippets for HTML and Vue so selector changes do not leak TSX snippets on generic examples.
- Reworded the locked code modal as a deliberate Plus-style locked-code flow.

Verification:

- Targeted placeholder scan passed; remaining `placeholder` text is the documentation prop description.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified Hero Sections Vue/HTML snippets, Feature Sections Vue fallback without TSX leakage, and Command Palettes leaf no horizontal overflow/severe console warnings.
- `5173` was occupied by `development-dictionary`; Chrome extension backend connected but did not expose expected page methods in this session, so this verification used standalone Playwright after identifying the port/browser fallback issue.

## Step 27 - Marketing residual filler and job CTA sweep

Scope:

- Marketing Blog Sections, Stats, Newsletter, and Contact examples with residual placeholder-style copy.
- Blog `With photo and list` pseudo-actions.
- Application feed titles that still looked like generic filler text.

Implementation:

- Replaced residual Latin/filler copy with UI Dictionary-specific language.
- Replaced Application feed question titles with concrete UI workflow discussion prompts.
- Converted `View job opening` and `View all openings` from static text into buttons.
- Added visible feedback for job-opening and all-openings actions.

Verification:

- Targeted filler scan passed for known residual phrases.
- Targeted static pseudo-CTA scan passed for `View job opening` and `View all openings`.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified Blog Sections, `With photo and list`, three job buttons, all-openings button, click feedback, no checked filler text, no horizontal overflow, and no severe console warnings.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.

## Step 28 - Residual filler and static CTA sweep

Scope:

- Remaining known placeholder-style copy in Marketing, Application, and Ecommerce previews.
- Marketing text CTAs that visually looked clickable but were still static text.
- Sign-in text links without visible feedback.

Implementation:

- Replaced filler copy in Marketing header cards, stats timeline, contact offices, team sections, landing feature cards, about pages, Application toggle/action-panel/description-list/stacked-list examples, and Ecommerce action cards.
- Converted Logo Cloud customer stories/contact actions, Landing Page announcement/hiring actions, 404 recovery actions, and Sign-in forgot-password/trial links into real buttons.
- Added visible feedback for the converted actions.

Verification:

- Targeted filler scan returned no matches for the known residual phrase set.
- Button block scan showed remaining no-handler buttons only in code snippets/documentation examples.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified Logo Clouds, Landing Pages, 404 Pages, and Sign-in action feedback, with no horizontal overflow or severe console warnings.

## Step 29 - Ecommerce footer and mobile summary interactivity sweep

Scope:

- Ecommerce Product, Category, and Order Detail page-example footer links that looked like navigation but were static text.
- Ecommerce Checkout Forms mobile order summary row that looked like a disclosure control but did not open or close anything.

Implementation:

- Converted Product Page footer links into buttons with feedback.
- Converted Category Page footer links into buttons with feedback.
- Converted Order Detail Page footer links into buttons with feedback.
- Converted Checkout Forms mobile `Show order summary` row into a disclosure button that toggles an inline animated order summary.

Verification:

- Targeted static scan confirmed the specific footer `<p>` links and static order-summary span are gone.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified Product Pages, Category Pages, Checkout Forms mobile summary, and Order Detail Pages feedback, with no horizontal overflow or severe console warnings.

## Step 30 - Ecommerce checkout footer and promo action sweep

Scope:

- Ecommerce Checkout Page footer category links that still rendered as static text.
- Ecommerce Promo Section offer rows where `Apply` looked clickable but was a static span.

Implementation:

- Converted Checkout Page footer category links into buttons with feedback.
- Converted Promo Section offer `Apply` labels into buttons with feedback.

Verification:

- Targeted static scan confirmed the old checkout footer `<p>` links and static promo `Apply` span are gone.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified Checkout Pages footer `Bags` feedback and Promo Sections offer `Apply` feedback, with no horizontal overflow or severe console warnings.

## Step 31 - Residual stats, footer, and avatar feedback sweep

Scope:

- Application UI Stats card controls that showed `View all` but needed explicit visible feedback verification.
- Marketing Footer newsletter controls that still had input/subscribe affordances with weak feedback coverage.
- Application UI Avatar `With text` profile action where state changed but no feedback was rendered.

Implementation:

- Stats `With brand icon` cards now expose `View all` buttons with feedback and press motion.
- Marketing footer newsletter email and subscribe controls now expose feedback instead of static-looking form text.
- Avatar `With text` now renders a compact feedback pill after `View profile`; this fixes the smoke-discovered missing-feedback bug.

Verification:

- Targeted static scan confirmed old static `View all`, `View profile`, newsletter spans are gone.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified Stats `View all`, Footers newsletter, and Avatars `View profile` feedback.
- Desktop and mobile 390px checks found no positive horizontal overflow and no severe console warnings.

## Step 32 - Radio color picker interaction sweep

Scope:

- Application UI Radio Groups `Color picker` example, where color swatches were static spans instead of selectable controls.

Implementation:

- Converted color swatches into `role="radio"` buttons.
- Added `aria-checked` state, selected ring, hover scale, active scale, and visible color-selection feedback.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified `Emerald color selected`, `Emerald color` `aria-checked=true`, and `Indigo color` `aria-checked=false`.
- Desktop and mobile 390px checks found no positive horizontal overflow and no severe console warnings.

## Step 33 - Textarea and action panel affordance sweep

Scope:

- Textarea avatar actions where attach/suggest icons were visual affordances without buttons.
- Textarea title pill actions where `Assign`, `Label`, and `Due date` looked actionable but were static spans.
- Action Panel toggle and input examples where controls were static or did not visually reflect state.

Implementation:

- Converted textarea attach/suggest icons into accessible buttons with feedback.
- Converted `Assign`, `Label`, and `Due date` pills into feedback buttons with hover/press motion.
- Updated Action Panel toggle with accessible name, `aria-pressed`, and real on/off visual motion.
- Converted Action Panel email field and `Invite` affordances into feedback buttons.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified Textareas `Attach file`/`Assign` feedback and Action Panels toggle/email/invite feedback.
- Desktop and mobile 390px checks found no positive horizontal overflow and no severe console warnings.

## Step 34 - Description list and textarea residual action sweep

Scope:

- Description Lists attachment rows where `Download` and `Remove` looked actionable but were static text.
- Textarea title pill footer where `Attach a file` looked actionable but was static text.
- Ecommerce category detail overlay `Shop collection`, which looked like a nested CTA but already lived inside a parent card button.

Implementation:

- Converted Description Lists attachment `Download` and `Remove` text into feedback buttons.
- Added a visible feedback pill to the Description Lists renderer so attachment actions leave user-visible state.
- Converted Textarea title footer `Attach a file` into a feedback button.
- Kept Ecommerce `Shop collection` inside the parent card button to avoid invalid nested buttons, and verified the parent card action instead.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Targeted static scan confirmed old `Download`, `Remove`, and `Attach a file` spans are gone.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified Description Lists download/remove feedback, Textareas attach feedback, and Storefront parent card feedback.
- Desktop and mobile 390px checks found no positive horizontal overflow and no severe console warnings.

## Step 35 - Ecommerce sort and store navigation control sweep

Scope:

- Ecommerce Category Filters `Sort by newest` text, which looked like a control but was static.
- Ecommerce Store Navigation top bar links, `Search`, `Cart`, and mobile bottom nav items, which looked like navigation controls but lacked feedback.

Implementation:

- Converted `Sort by newest` into a feedback button.
- Converted Store Navigation primary links, `Search`, and `Cart` into feedback buttons.
- Added a shared feedback pill to Store Navigation variants.
- Converted Store Navigation mobile bottom nav items into feedback buttons.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified Category Filters sort feedback, Store Navigation search/cart/nav feedback, and mobile bottom nav feedback.
- Desktop and mobile 390px checks found no positive horizontal overflow and no severe console warnings.

## Step 36 - Flyout and store menu item sweep

Scope:

- Marketing Flyout Menus desktop nav, item list rows, recent resource links, and simple profile menu rows that looked like menu actions but were static text/divs.
- Ecommerce Store Navigation menu column rows that looked like navigation links but were static text.

Implementation:

- Converted Flyout Menus desktop nav and login affordance into feedback buttons.
- Converted Flyout Menus item cards, recent resource links, and profile menu rows into feedback buttons.
- Converted Store Navigation menu column rows into feedback buttons.
- Reused existing feedback placement so clicks leave visible state in the same preview.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified Flyout Menus item/resource/nav feedback and Store Navigation menu column feedback.
- Desktop and mobile 390px checks found no positive horizontal overflow and no severe console warnings.

## Step 37 - Marketing headers nav affordance sweep

Scope:

- Marketing Headers `HeaderLink` helper, which rendered nav-like links as static spans across multiple header variants.

Implementation:

- Converted `HeaderLink` from span to button.
- Added hover/press motion.
- Added visible feedback through the existing `HeaderShell` feedback pill, using specific labels for string children and fallback text for compound labels.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified Marketing Headers product/company/login feedback.
- Desktop and mobile 390px checks found no positive horizontal overflow and no severe console warnings.

## Step 38 - Tabs, command, and docs residual quality sweep

Scope:

- Ecommerce Product Features `With tabs` example, where the tab row still used static spans.
- Ecommerce Product Pages `With tabs and related products` example, where the tab controls existed but the panel copy stayed generic and weak.
- Application command-menu page rows, where command row text and shortcut labels needed a more stable no-wrap card structure.
- Docs Popover and Docs Disclosure routes, rechecked because they were called out as likely mismatch candidates.

Implementation:

- Converted Product Features tabs into real buttons with selected state, tab-specific body copy, visible feedback, and press motion.
- Reworked Product Pages tabs into selected-state controls plus tab-specific cards and content for Description, Details, and Reviews.
- Updated command-menu page rows to use `justify-between`, `truncate`, and a fixed shortcut slot to avoid awkward line wrapping.
- Verified Docs Popover selection and Docs Disclosure mobile expansion without needing further code changes.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified:
  - `plus-ecommerce-product-features`: `Materials` tab rendered tab-specific body and feedback.
  - `plus-ecommerce-page-examples-product-pages`: `Details` and `Reviews` tabs rendered tab-specific body and feedback.
  - `plus-navigation-command-palettes`: mobile 390px command rows had zero row overflow and no positive document overflow.
  - `docs-elements-popover`: popover item selection remained interactive.
  - `docs-elements-disclosure`: mobile 390px disclosure expansion had no positive document overflow.
- Chrome console severe error check returned no errors during the representative smoke.

## Step 39 - Residual chip, input, and receipt feedback sweep

Scope:

- Application UI Description Lists narrow receipt preview, where `Download receipt +` looked actionable but was static text.
- Application UI Section Headings `With input group`, where Search and Sort looked like controls but did not leave feedback.
- Ecommerce Product Overviews color and size chips, which looked selectable but were static spans.

Implementation:

- Converted `Download receipt +` into a feedback button in the narrow description list card.
- Converted Section Heading input-group Search and Sort affordances into feedback buttons.
- Converted Product Overview color chips and size chips into selectable buttons with selected state, feedback, hover, and press motion.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified:
  - `plus-data-display-description-lists`: `Download receipt +` produced `Receipt downloaded`.
  - `plus-application-headings-section-headings`: `Sort` produced `Candidate sort opened`; `Search candidates` produced `Candidate search focused`.
  - `plus-ecommerce-product-overviews`: `Black` produced `Black color selected`; `L` produced `L size selected`.
  - Product Overviews and Description Lists mobile 390px checks had no positive document overflow.
- Severe console error check returned no errors during the representative smoke.

## Step 40 - Product list, order progress, and social feedback sweep

Scope:

- Ecommerce Product Lists `Card with full details`, where size chips looked selectable but were static spans.
- Ecommerce Order Summaries `With progress bars`, where step labels looked like progress controls but were static labels.
- Marketing 404 `With navbar and footer`, where footer social labels looked like links but were static spans.

Implementation:

- Converted Product Lists size chips into selectable buttons with selected state, feedback, hover, and press motion.
- Converted Order Summaries progress labels into buttons that update visible progress width and feedback.
- Converted Marketing 404 footer social labels into feedback buttons.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified:
  - `plus-ecommerce-product-lists`: size `M` in `Card with full details` produced size-selection feedback.
  - `plus-ecommerce-order-summaries`: `Delivered` in `With progress bars` produced progress-step feedback.
  - `plus-marketing-404-pages`: `GitHub` in `With navbar and footer` produced social-link feedback.
  - Product Lists, Order Summaries, and 404 Pages mobile 390px checks had no positive document overflow.
- Severe console error check returned no errors during the representative smoke.

## Step 41 - Footer, heading filter, category filter, and feed tag feedback sweep

Scope:

- Marketing Footers `Centered` nav links, which looked like links but were static spans.
- Application Page Headings `With filters and action` chips, which looked like active filters but were static spans.
- Ecommerce Category Filters inline/default sort and grid-view labels, which looked like toolbar controls but were static spans.
- Application Feeds `Multiple item types` tags, which looked like filter chips but were static spans and had no feedback placement.

Implementation:

- Converted centered footer nav labels into feedback buttons and added local feedback placement.
- Converted job filter chips into selectable buttons with selected state and feedback.
- Converted category filter sort/grid labels into feedback buttons.
- Converted feed tags into tag-filter buttons and added visible feedback placement for the feed preview.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified:
  - `plus-marketing-footers`: `About` in centered footer produced `About opened`.
  - `plus-application-headings-page-headings`: `Remote` chip produced `Remote filter toggled`.
  - `plus-ecommerce-category-filters`: `Sort` produced `Sort menu opened`; grid icon produced `Grid view selected`.
  - `plus-application-lists-feeds`: `Bug` tag produced `Bug tag filter opened`.
  - All four routes had no positive document overflow at mobile 390px.
- Severe console error check returned no errors during the representative smoke.

## Step 42 - Marketing static card and link feedback sweep

Scope:

- Marketing Footers social icons and column link groups, which looked like navigation/social links but used static text.
- Marketing Pricing Sections logo proof strip, which looked like clickable proof logos but used static cards.
- Marketing Blog Sections background image cards, which looked like article cards but were static articles.
- Marketing Contact Sections contact path cards, which looked like contact links but were static cards.

Implementation:

- Converted footer social icons and column links into feedback buttons, adding feedback placement where the footer variant lacked it.
- Converted pricing logo proof cards into feedback buttons.
- Converted blog background image cards into full-card buttons with feedback.
- Converted contact path cards into buttons with contact feedback.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified:
  - `plus-marketing-footers`: `gh` social produced `gh social opened`; `Documentation` link produced `Documentation opened`.
  - `plus-marketing-pricing-sections`: `Tuple` proof card produced `Tuple proof opened`.
  - `plus-marketing-blog-sections`: background image article card produced article-open feedback.
  - `plus-marketing-contact-sections`: `Collaborate` contact card produced `Collaborate contact opened`.
  - All four routes had no positive document overflow at mobile 390px.
- Severe console error check returned no errors during the representative smoke.

## Step 18 - Form, input, button, and drawer action feedback sweep

Scope:

- Remaining actual rendered buttons in form layout, input group, auth/social form, textarea create, button, button group, dropdown, and drawer profile previews.
- Code snippet strings and multiline buttons that already had handlers were treated as non-actionable scan noise.

Implementation:

- Form Layout Save/Cancel controls now show visible feedback.
- Input Group trailing Sort button now shows visible feedback.
- Auth/social Sign in and provider buttons now show visible feedback.
- Textarea Create action now shows visible feedback.
- Basic Button and Button Group variants now respond with feedback and hover/press motion.
- Dropdown triggers now toggle menu visibility, animate the menu, and expose clickable rows.
- Drawer profile Message and upload controls now show visible feedback.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome smoke verified:
  - `plus-forms-form-layouts`: `Save` produced exact `Form layout saved`.
  - `plus-forms-input-groups`: `Sort` feedback.
  - `plus-application-elements-buttons`: `Button text` feedback.
  - `plus-application-elements-button-groups`: `Months` feedback.
  - `plus-overlays-drawers`: `Message` feedback.
- Desktop and mobile 390px horizontal overflow returned 0 on all checked routes.
- Chrome console log contained only React DevTools info messages.

## Step 55 - Stacked Lists page parity pass

Scope:

- Tailwind Plus `Application UI / Lists / Stacked Lists` reference page.
- Local `plus-application-lists-stacked-lists` leaf and its 15 stacked-list preview variants.

Implementation:

- Converted link-style people rows, card rows, full-width rows, narrow rows, sticky-heading rows, truncated-content rows, small-avatar commit rows, and deployment rows into selectable controls with visible selected state.
- Added hover/press motion and feedback banners across the Stacked Lists examples.
- Added animated action menus for person rows and project rows.
- Fixed the discovered menu bug where closed opacity-only menus remained in the click/accessibility candidate set and could intercept the wrong `Archive` action during smoke testing.
- Made the preview dark toggle affect stacked-list variants, while preserving system-mode dark examples that match the Tailwind reference.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/stacked-lists/`:
  - `tailwind-stacked-lists-reference-desktop.png`
  - `local-stacked-lists-desktop-before.png`
  - `local-stacked-lists-mobile-before.png`
  - `local-stacked-lists-desktop-after.png`
  - `local-stacked-lists-interaction-after.png`
  - `local-stacked-lists-dark-after.png`
  - `local-stacked-lists-mobile-after.png`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-lists-stacked-lists` verified:
  - `Michael Foster` row selection.
  - `Open actions for Leslie Alexander` menu and `Message` menu item.
  - `GraphQL API actions` menu and `Archive` menu item.
  - `View all` action.
  - First preview `Dark` toggle.
  - No severe console errors.
  - No framework error overlay.
  - Mobile 390px horizontal overflow returned 0.

## Step 56 - Tables page parity pass

Scope:

- Tailwind Plus `Application UI / Lists / Tables` reference page.
- Local `plus-application-lists-tables` leaf and its 19 table-list preview variants.

Implementation:

- Converted user rows, condensed transaction rows, grouped rows, invoice line rows, plan rows, hidden-heading activity rows, and full-width deployment rows into selectable controls with visible selected state.
- Added hover/press motion and feedback banners across the Tables examples.
- Added visual checked state for individual and all-row checkbox controls.
- Kept inline Edit/action buttons from accidentally toggling their parent row by stopping propagation.
- Made the preview dark toggle affect table-list variants, while preserving system-mode dark examples that match the Tailwind reference.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/tables/`:
  - `tailwind-tables-reference-desktop.png`
  - `local-tables-desktop-before.png`
  - `local-tables-mobile-before.png`
  - `local-tables-desktop-after.png`
  - `local-tables-interaction-after.png`
  - `local-tables-dark-after.png`
  - `local-tables-mobile-after.png`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-lists-tables` verified:
  - `Lindsay Walton` row selection.
  - `Add user` action.
  - sortable `Title` heading.
  - `Select all rows`.
  - plan `Select`.
  - hidden-heading `View transaction`.
  - full-width deployment row selection.
  - First preview `Dark` toggle.
  - No severe console errors.
  - No framework error overlay.
  - Mobile 390px horizontal overflow returned 0.

## Step 57 - Grid Lists page parity pass

Scope:

- Tailwind Plus `Application UI / Lists / Grid Lists` reference page.
- Local `plus-application-lists-grid-lists` leaf and its 7 grid-list preview variants.

Implementation:

- Converted small portrait cards, large contact cards, project cards, horizontal link cards, shared action cards, image cards, and logo-description invoice cards into selectable controls with visible selected state.
- Added hover/press motion and feedback banners across the Grid Lists examples.
- Made Email/Call actions produce contact-specific feedback without conflicting with parent card selection.
- Converted static logo-description invoice cards into interactive card buttons.
- Made the preview dark toggle affect grid-list variants, while preserving system-mode dark examples that match the Tailwind reference.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/grid-lists/`:
  - `tailwind-grid-lists-reference-desktop.png`
  - `local-grid-lists-desktop-before.png`
  - `local-grid-lists-mobile-before.png`
  - `local-grid-lists-desktop-after.png`
  - `local-grid-lists-interaction-after.png`
  - `local-grid-lists-dark-after.png`
  - `local-grid-lists-mobile-after.png`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-lists-grid-lists` verified:
  - `Jane Cooper` contact selection.
  - `Email` and `Call` actions.
  - `Graph API` project card.
  - `Request time off` shared action.
  - `IMG_4985.HEIC` image card.
  - `Tuple` logo-description invoice card.
  - First preview `Dark` toggle.
  - No severe console errors.
  - No framework error overlay.
  - Mobile 390px horizontal overflow returned 0.

## Step 58 - Feeds page parity pass

Scope:

- Tailwind Plus `Application UI / Lists / Feeds` reference page.
- Local `plus-application-lists-feeds` leaf and its 3 feed-list preview variants.

Implementation:

- Converted simple icon feed events, comments feed events, and multiple-type feed events into selectable controls with visible selected state.
- Added hover/press motion and feedback banners across the Feeds examples.
- Replaced the static comment placeholder with a textarea-backed `Comment` action.
- Preserved tag filter controls and added event-level feedback for multiple-type feed rows.
- Made the preview dark toggle affect feed-list variants, while preserving the system-mode dark comments example that matches the Tailwind reference.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/feeds/`:
  - `tailwind-feeds-reference-desktop.png`
  - `local-feeds-desktop-before.png`
  - `local-feeds-mobile-before.png`
  - `local-feeds-desktop-after.png`
  - `local-feeds-interaction-after.png`
  - `local-feeds-dark-after.png`
  - `local-feeds-mobile-after.png`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-lists-feeds` verified:
  - simple icon feed event selection.
  - comments feed event selection.
  - textarea fill and `Comment` submit.
  - multiple-type feed event selection.
  - `Bug` tag filter.
  - First preview `Dark` toggle.
  - No severe console errors.
  - No framework error overlay.
  - Mobile 390px horizontal overflow returned 0.

## Step 59 - Form Layouts page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Form Layouts` reference page.
- Local `plus-forms-form-layouts` leaf and its 4 form-layout preview variants.

Implementation:

- Replaced placeholder spans for text fields with real `input` controls.
- Replaced the About placeholder block with a real `textarea`.
- Converted avatar `Change` and cover-photo upload surfaces into buttons with visible feedback.
- Converted notification checkbox rows and push radio rows into stateful controls.
- Preserved Save/Cancel actions and added field-level feedback for edits.
- Made the preview dark toggle affect form-layout variants, while preserving the system-mode dark two-column example that matches the Tailwind reference.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/form-layouts/`:
  - `tailwind-form-layouts-reference-desktop.png`
  - `local-form-layouts-desktop-before.png`
  - `local-form-layouts-mobile-before.png`
  - `local-form-layouts-desktop-after.png`
  - `local-form-layouts-interaction-after.png`
  - `local-form-layouts-dark-after.png`
  - `local-form-layouts-mobile-after.png`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-form-layouts` verified:
  - `Username` input fill.
  - `About` textarea fill.
  - avatar `Change`.
  - cover-photo upload button.
  - `Candidates` checkbox.
  - `Same as email` radio option.
  - `Save` and `Cancel`.
  - First preview `Dark` toggle.
  - No severe console errors.
  - No framework error overlay.
  - Mobile 390px horizontal overflow returned 0.

## Step 60 - Input Groups page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Input Groups` reference page.
- Local `plus-forms-input-groups` leaf and its 21 input-group preview variants.

Implementation:

- Replaced placeholder spans for basic, inset, shared-border, overlapping-label, gray-bottom-border, pill, and keyboard-shortcut examples with real `input` controls.
- Converted currency/country add-ons and keyboard shortcut controls into buttons with visible feedback.
- Preserved and verified the Sort trailing button interaction.
- Added editable card and billing fields for the shared-border example.
- Made the preview dark toggle affect input-group variants, while preserving system-mode dark examples that match the Tailwind reference.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/input-groups/`:
  - `tailwind-input-groups-reference-desktop.png`
  - `local-input-groups-desktop-before.png`
  - `local-input-groups-mobile-before.png`
  - `local-input-groups-desktop-after.png`
  - `local-input-groups-interaction-after.png`
  - `local-input-groups-dark-after.png`
  - `local-input-groups-mobile-after.png`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-input-groups` verified:
  - `Email` input fill.
  - `USD` currency dropdown button.
  - `US` country-code dropdown button.
  - `Search candidates` input fill.
  - `Sort` trailing button.
  - `Card number` shared-border input fill.
  - billing country button.
  - `Quick search` input fill.
  - `Ctrl K` keyboard shortcut button.
  - First preview `Dark` toggle.
  - No severe console errors.
  - No framework error overlay.
  - Mobile 390px horizontal overflow returned 0.

## Step 61 - Select Menus page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Select Menus` reference page.
- Local `plus-forms-select-menus` leaf and its 7 select-menu preview variants.

Implementation:

- Converted custom select surfaces into button triggers with animated open/close option menus.
- Converted option rows into selectable buttons that update selected state and visible feedback.
- Replaced the native Location mock with a real `select` and explicit accessible label.
- Converted status options into selectable controls.
- Preserved avatar, check-left, status indicator, secondary text, and branded support anatomy while making the examples interactive.
- Made the preview dark toggle affect select-menu variants, while preserving system-mode dark examples that match the Tailwind reference.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/select-menus/`:
  - `tailwind-select-menus-reference-desktop.png`
  - `local-select-menus-desktop-before.png`
  - `local-select-menus-mobile-before.png`
  - `local-select-menus-desktop-after.png`
  - `local-select-menus-interaction-after.png`
  - `local-select-menus-dark-after.png`
  - `local-select-menus-mobile-after.png`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-select-menus` verified:
  - custom trigger open.
  - `Wade Cooper` option selection.
  - native `Location` select option to `Mexico`.
  - status trigger open.
  - `Away` status selection.
  - secondary-text option selection.
  - First preview `Dark` toggle.
  - No severe console errors.
  - No framework error overlay.
  - Mobile 390px horizontal overflow returned 0.

## Step 62 - Sign-in and Registration page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Sign-in and Registration` reference page.
- Local `plus-forms-sign-in-registration` leaf and its auth sign-in preview variants.

Implementation:

- Replaced email/password placeholder rows with real inputs across labelled and no-label sign-in variants.
- Added visible input update feedback through the existing preview status channel.
- Converted `Remember me` into a stateful control with checked/unchecked visual state.
- Preserved forgot password, sign in, trial signup, Google, and GitHub actions as clickable controls with visible feedback.
- Made the preview dark toggle affect auth sign-in variants, instead of leaving most variants light-only.
- Kept the page scope limited to the Sign-in and Registration leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/sign-in-registration/`:
  - `tailwind-sign-in-registration-reference-desktop.png`
  - `local-sign-in-registration-desktop-before.png`
  - `local-sign-in-registration-mobile-before.png`
  - `local-sign-in-registration-desktop-after.png`
  - `local-sign-in-registration-interaction-after.png`
  - `local-sign-in-registration-dark-after.png`
  - `local-sign-in-registration-mobile-after.png`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-sign-in-registration` verified:
  - `Email address` input fill.
  - `Password` input fill.
  - `Remember me` toggle.
  - `Forgot password?` feedback.
  - `Sign in` feedback.
  - `Start a 14 day free trial` feedback.
  - `Google` and `GitHub` feedback.
  - First preview `Dark` toggle.
  - No severe console errors.
  - No framework error overlay.
  - Mobile 390px horizontal overflow returned 0.

## Step 63 - Textareas page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Textareas` reference page.
- Local `plus-forms-textareas` leaf and its 5 textarea preview variants.

Implementation:

- Made all textarea variants honor their local preview dark toggle.
- Converted underline toolbar icons and preview toolbar items into accessible buttons with hover/press motion and visible feedback.
- Preserved textarea input behavior across simple, avatar, underline, title/pill, and preview-tab examples.
- Converted the dark title/pill composer `Title` and `Description` surfaces into editable controls.
- Kept Post, Create, Assign, Label, Due date, Attach file, Suggest reply, Mention, Code snippet, and Insert link actions interactive with feedback.
- Kept scope limited to the Textareas leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/textareas/`:
  - `tailwind-textareas-reference-desktop.png`
  - `local-textareas-desktop-before.png`
  - `local-textareas-mobile-before.png`
  - `local-textareas-desktop-after.png`
  - `local-textareas-interaction-after.png`
  - `local-textareas-dark-after.png`
  - `local-textareas-all-dark-after.png`
  - `local-textareas-mobile-after.png`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-textareas` verified:
  - textarea input across visible examples.
  - `Attach file` and `Suggest reply` controls.
  - `Post` feedback.
  - `Preview` tab switch.
  - `Mention`, `Code snippet`, and `Insert link` controls.
  - `Assign`, `Label`, and `Due date` controls.
  - `Attach a file` and `Create` controls.
  - All five `Dark` toggles.
  - No severe console errors.
  - No framework error overlay.
  - Mobile 390px horizontal overflow returned 0.

## Step 64 - Radio Groups page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Radio Groups` reference page.
- Local `plus-forms-radio-groups` leaf and its 12 radio group preview variants.

Implementation:

- Added radio semantics to list, inline, description, right-radio, table, panel, card, small card, and stacked card variants.
- Preserved color picker radio semantics and added dark-aware feedback styling.
- Added `role=radio`, `aria-checked`, radiogroup wrappers, visible selected state, hover motion, and press motion across selectable examples.
- Made all 12 local preview `Dark` toggles apply to their radio examples, including table and card variants.
- Kept scope limited to the Radio Groups leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/radio-groups/`:
  - `tailwind-radio-groups-reference-desktop.png`
  - `local-radio-groups-desktop-before.png`
  - `local-radio-groups-mobile-before.png`
  - `local-radio-groups-desktop-after.png`
  - `local-radio-groups-interaction-after.png`
  - `local-radio-groups-all-dark-after.png`
  - `local-radio-groups-mobile-after.png`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-radio-groups` verified:
  - representative `Startup`, `Business`, and `Enterprise` selections.
  - `Rose color` selection.
  - radio semantics count increased from 6 before implementation to 39 after implementation.
  - checked radio count after interactions returned 12.
  - all 12 `Dark` toggles.
  - No severe console errors.
  - No framework error overlay.
  - Mobile 390px horizontal overflow returned 0.

## Step 65 - Checkboxes page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Checkboxes` reference page.
- Local `plus-forms-checkboxes` leaf and its 4 checkbox preview variants.

Implementation:

- Added checkbox semantics to list-with-description, inline-description, checkbox-on-right, and simple-heading variants.
- Added `role=checkbox`, `aria-checked`, group labels, visible checked state, hover motion, and press motion across selectable examples.
- Added visible selection feedback for checkbox interactions.
- Made all 4 local preview `Dark` toggles apply to their checkbox examples.
- Kept scope limited to the Checkboxes leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/checkboxes/`:
  - `tailwind-checkboxes-reference-desktop.png`
  - `local-checkboxes-desktop-before.png`
  - `local-checkboxes-mobile-before.png`
  - `local-checkboxes-desktop-after.png`
  - `local-checkboxes-interaction-after.png`
  - `local-checkboxes-all-dark-after.png`
  - `local-checkboxes-mobile-after.png`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-checkboxes` verified:
  - representative `Candidates`, `Offers`, and `Comments` selections.
  - checkbox semantics count increased from 0 before implementation to 12 after implementation.
  - checked checkbox count after interactions returned 5.
  - all 4 `Dark` toggles.
  - No severe console errors.
  - No framework error overlay.
  - Mobile 390px horizontal overflow returned 0.

## Step 66 - Toggles page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Toggles` reference page.
- Local `plus-forms-toggles` leaf and its 5 toggle preview variants.

Implementation:

- Added switch semantics to simple, short, icon, left-label-description, and right-label variants.
- Added `role=switch`, `aria-checked`, independent per-example state, visible enabled/disabled feedback, hover motion, and press motion.
- Preserved animated knob movement and added explicit color transition timing.
- Made all 5 local preview `Dark` toggles apply to their toggle examples.
- Kept scope limited to the Toggles leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/toggles/`:
  - `tailwind-toggles-reference-desktop.png`
  - `local-toggles-desktop-before.png`
  - `local-toggles-mobile-before.png`
  - `local-toggles-desktop-after.png`
  - `local-toggles-interaction-after.png`
  - `local-toggles-all-dark-after.png`
  - `local-toggles-mobile-after.png`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-toggles` verified:
  - `Simple toggle`, `Short toggle`, `Icon toggle`, `Available to hire`, and `Annual billing` switch interactions.
  - switch semantics count increased from 0 before implementation to 5 after implementation.
  - checked switch count after interactions returned 5.
  - all 5 `Dark` toggles.
  - No severe console errors.
  - No framework error overlay.
  - Mobile 390px horizontal overflow returned 0.

## Step 67 - Action Panels page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Action Panels` reference page.
- Local `plus-forms-action-panels` leaf and its 8 action panel preview variants.

Implementation:

- Kept simple, link, button-right, top-right, toggle, input, simple-well, and with-well variants interactive with visible feedback.
- Replaced the pseudo email input button with a real `input` in the input variant.
- Added `role=switch` and `aria-checked` to the toggle variant.
- Added dark-aware panel/body/well/input styles across variants.
- Prevented `Change plan` wrapping and mobile overflow in right-button and well variants.
- Made all 8 local preview `Dark` toggles apply to their action panel examples.
- Kept scope limited to the Action Panels leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/action-panels/`:
  - `tailwind-action-panels-reference-desktop.png`
  - `local-action-panels-desktop-before.png`
  - `local-action-panels-mobile-before.png`
  - `local-action-panels-desktop-after.png`
  - `local-action-panels-interaction-after.png`
  - `local-action-panels-all-dark-after.png`
  - `local-action-panels-mobile-after.png`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-action-panels` verified:
  - `Change plan`, `CI features`, hiring switch, email input, `Invite`, and final `Change plan` interactions.
  - input count increased from 0 before implementation to 1 after implementation.
  - switch count returned 1 and checked switch count returned 1 after interaction.
  - all 8 `Dark` toggles.
  - No severe console errors.
  - No framework error overlay.
  - Mobile 390px horizontal overflow returned 0.

## Step 68 - Comboboxes page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Comboboxes` reference page.
- Local `plus-forms-comboboxes` leaf and its 4 combobox preview variants.

Implementation:

- Replaced static combobox mock rows with real combobox inputs.
- Added `role=combobox`, listbox containers, `role=option`, and `aria-selected` state.
- Added type-to-filter behavior and selectable option rows.
- Preserved status dot, avatar, and secondary text anatomy while making all rows interactive.
- Added visible selected-value feedback.
- Made all 4 local preview `Dark` toggles apply to their combobox examples.
- Kept scope limited to the Comboboxes leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/comboboxes/`:
  - `tailwind-comboboxes-reference-desktop.png`
  - `local-comboboxes-desktop-before.png`
  - `local-comboboxes-mobile-before.png`
  - `local-comboboxes-desktop-after.png`
  - `local-comboboxes-interaction-after.png`
  - `local-comboboxes-all-dark-after.png`
  - `local-comboboxes-mobile-after.png`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-comboboxes` verified:
  - `Michael Foster`, `Lindsay Walton`, and `Dries Vincent` selections.
  - combobox semantics count increased from 0 before implementation to 4 after implementation.
  - option count increased from 0 before implementation to 24 after implementation.
  - selected option count returned 4.
  - all 4 `Dark` toggles.
  - No severe console errors.
  - No framework error overlay.
  - Mobile 390px horizontal overflow returned 0.

## Step 69 - Alerts page parity pass

Scope:

- Tailwind Plus `Application UI / Feedback / Alerts` reference page.
- Local `plus-feedback-alerts` leaf and its 6 alert preview variants.

Implementation:

- Added `role=alert` semantics across all local alert examples.
- Added per-alert dismiss and restore state for dismissible/action alert examples.
- Added visible action feedback for `View status`, `View details`, and alert dismiss flows.
- Made with-description, with-list, with-actions, link-right, accent-border, and dismiss-button variants dark-aware.
- Made all 6 local preview `Dark` toggles apply to their alert examples.
- Kept scope limited to the Alerts leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/alerts/`:
  - `tailwind-alerts-reference-desktop.png`
  - `local-alerts-desktop-before.png`
  - `local-alerts-mobile-before.png`
  - `local-alerts-desktop-after.png`
  - `local-alerts-interaction-after.png`
  - `local-alerts-all-dark-after.png`
  - `local-alerts-mobile-after.png`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-feedback-alerts` verified:
  - `View status`, `Dismiss`, `Restore alert`, `View details`, and dismiss-button interactions.
  - alert semantics count returned 6.
  - restore count returned 1 after dismissing an alert.
  - all 6 `Dark` toggles.
  - No severe console errors.
  - No framework error overlay.
  - Mobile 390px horizontal overflow returned 0.

## Step 70 - Empty States page parity pass

Scope:

- Tailwind Plus `Application UI / Feedback / Empty States` reference page.
- Local `plus-feedback-empty-states` leaf and its 6 empty-state preview variants.

Implementation:

- Added shared dark-aware empty-state frame, text, card, and icon styling.
- Added selected item state for starting-point, recommendation, template, and collaborator examples.
- Converted recommendation, template, and collaborator rows into full interactive controls with visible selected state.
- Added visible completion feedback and a `Back to empty state` recovery path after each action.
- Added hover, press, fade, and slide motion to empty-state actions and completion cards.
- Made all 6 local preview `Dark` toggles apply to their empty-state examples.
- Kept scope limited to the Empty States leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/empty-states/`:
  - `tailwind-empty-states-reference-desktop.png`
  - `local-empty-states-desktop-before.png`
  - `local-empty-states-mobile-before.png`
  - `local-empty-states-desktop-after.png`
  - `local-empty-states-interaction-after.png`
  - `local-empty-states-all-dark-after.png`
  - `local-empty-states-mobile-after.png`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-feedback-empty-states` verified:
  - `New user`, `Upload a file`, `Create a campaign`, `Slack`, `Weekly planning`, and `Leslie Alexander` interactions.
  - `Back to empty state` recovery path.
  - selected feedback text.
  - all 6 `Dark` toggles.
  - dark surface count returned 7.
  - No severe console errors.
  - No framework error overlay.
  - Mobile 390px horizontal overflow returned 0.

## Step 71 - Progress page parity pass

Scope:

- Local `plus-feedback-progress` leaf and its 3 progress preview examples.
- Tailwind Plus `Application UI / Feedback / Progress` URL was checked and returned 404.
- Tailwind Plus `Application UI / Navigation / Progress Bars` was captured as the closest corresponding reference.

Implementation:

- Replaced three repeated static `progress-page` mocks with dedicated `progress-feedback-bar`, `progress-feedback-loading`, and `progress-feedback-setup` variants.
- Added `role=progressbar`, `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` semantics.
- Added progress value controls for 25%, 50%, 75%, and 100%.
- Added Resume/Pause state and status cards for the loading-state example.
- Added checkbox-like setup task controls, computed progress, and `Complete all` for the setup-progress example.
- Added visible feedback messages and transition motion.
- Made all 3 local preview `Dark` toggles apply to their progress examples.
- Kept scope limited to the Progress leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/progress/`:
  - `tailwind-progress-reference-desktop.png`
  - `tailwind-progress-bars-reference-desktop.png`
  - `local-progress-desktop-before.png`
  - `local-progress-mobile-before.png`
  - `local-progress-desktop-after.png`
  - `local-progress-interaction-after.png`
  - `local-progress-all-dark-after.png`
  - `local-progress-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-feedback-progress` verified:
  - progressbar count returned 3.
  - initial progress value returned 64.
  - 25% and 75% controls.
  - Resume loading state.
  - Review billing checkbox-like task.
  - Complete all.
  - checkbox count returned 5 and checked count returned 5 after completion.
  - all 3 `Dark` toggles.
  - dark surface count returned 7.
  - No severe console errors.
  - No framework error overlay.
  - Mobile 390px horizontal overflow returned 0.

## Step 72 - Skeletons page parity pass

Scope:

- Local `plus-feedback-skeletons` leaf and its 3 skeleton preview examples.
- Tailwind Plus `Application UI / Feedback / Skeletons` URL was checked and returned 404.

Implementation:

- Replaced three repeated static `skeleton-page` mocks with dedicated `skeleton-feedback-card`, `skeleton-feedback-table`, and `skeleton-feedback-content` variants.
- Added `role=status`, `aria-busy=true`, and `aria-live=polite` to loading placeholder states.
- Added `Load content` and `Reset` controls to each skeleton example.
- Added loaded-state content for card, table, and content skeleton examples.
- Added clickable loaded-state card/table/article actions with visible feedback.
- Added pulse placeholders, stable layout footprints, transition motion, and dark-aware styling.
- Made all 3 local preview `Dark` toggles apply to their skeleton examples.
- Kept scope limited to the Skeletons leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/skeletons/`:
  - `tailwind-skeletons-reference-desktop.png`
  - `local-skeletons-desktop-before.png`
  - `local-skeletons-mobile-before.png`
  - `local-skeletons-desktop-after.png`
  - `local-skeletons-interaction-after.png`
  - `local-skeletons-all-dark-after.png`
  - `local-skeletons-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-feedback-skeletons` verified:
  - initial loading status count returned 3.
  - all 3 `Load content` controls.
  - loaded card, table row, and article actions.
  - `Reset` returned at least one example to loading status.
  - all 3 `Dark` toggles.
  - dark surface count returned 7.
  - No severe console errors.
  - No framework error overlay.
  - Mobile 390px horizontal overflow returned 0.

## Step 73 - Toasts page parity pass

Scope:

- Local `plus-feedback-toasts` leaf and its 3 toast preview examples.
- Tailwind Plus `Application UI / Feedback / Toasts` URL was checked and returned 404.

Implementation:

- Replaced three repeated static `toast-page` mocks with dedicated `toast-feedback-success`, `toast-feedback-stack`, and `toast-feedback-undo` variants.
- Added `role=status` and `aria-live=polite` semantics to toast cards.
- Added `Show toast`, `Hide`, and `Dismiss toast` controls for success toasts.
- Added `Add toast`, `Clear stack`, stacked cards, and per-toast dismissal for toast stacks.
- Added `Undo` behavior for success feedback.
- Added visible feedback messages, slide/fade motion, responsive positioning, and dark-aware styling.
- Made all 3 local preview `Dark` toggles apply to their toast examples.
- Kept scope limited to the Toasts leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/toasts/`:
  - `tailwind-toasts-reference-desktop.png`
  - `local-toasts-desktop-before.png`
  - `local-toasts-mobile-before.png`
  - `local-toasts-desktop-after.png`
  - `local-toasts-interaction-after.png`
  - `local-toasts-all-dark-after.png`
  - `local-toasts-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-feedback-toasts` verified:
  - initial toast status count returned 4.
  - `Hide` and `Show toast`.
  - `Add toast` and stack count growth.
  - `Dismiss toast`.
  - `Undo`.
  - all 3 `Dark` toggles.
  - dark surface count returned 7.
  - No severe console errors.
  - No framework error overlay.
  - Mobile 390px horizontal overflow returned 0.

## Step 74 - Navbars page parity pass

Scope:

- Tailwind Plus `Application UI / Navigation / Navbars` reference page.
- Local `plus-navigation-navbars` leaf and its 11 navbar preview variants.

Implementation:

- Replaced pseudo-button search boxes with real `input type=search` fields in search navbar variants.
- Added typed search feedback for navbar search inputs.
- Added `aria-expanded` and `aria-label` to menu-left navbar menu buttons.
- Made menu-left controls available in desktop and mobile contexts where the reference expects a menu button on the left.
- Kept animated menu panels and made them work outside mobile-only cases for menu-left variants.
- Preserved existing nav item, quick action, notification, user menu, centered-link, column-layout, and dark-mode interactions.
- Made all 11 local preview `Dark` toggles continue to apply to their navbar examples.
- Kept scope limited to the Navbars leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/navbars/`:
  - `tailwind-navbars-reference-desktop.png`
  - `local-navbars-desktop-before.png`
  - `local-navbars-mobile-before.png`
  - `local-navbars-desktop-after.png`
  - `local-navbars-interaction-after.png`
  - `local-navbars-all-dark-after.png`
  - `local-navbars-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-navigation-navbars` verified:
  - search input count returned 6.
  - `aria-expanded` menu button count returned 2 and opened state returned 1.
  - `Team` navigation feedback.
  - `New Job` quick action feedback.
  - search typing feedback for `reports`.
  - notifications feedback.
  - all 11 `Dark` toggles.
  - dark surface count returned 22.
  - No severe console errors.
  - No framework error overlay.
  - Mobile 390px horizontal overflow returned 0.
  - Mobile menu expansion returned an expanded menu state.

## Step 75 - Tabs page parity pass

Scope:

- Tailwind Plus `Application UI / Navigation / Tabs` reference page.
- Local `plus-navigation-tabs` leaf and its 9 tab preview variants.

Implementation:

- Added `role=tablist` to desktop tab bars and mobile tab menus.
- Added `role=tab`, `aria-selected`, `aria-controls`, and stable IDs to every tab control.
- Added `role=tabpanel`, stable panel IDs, and `aria-labelledby` to active tab panels.
- Added `aria-expanded` and `aria-controls` to the mobile select-like tab menu button.
- Added focus-visible rings and hover/press motion to desktop and mobile tab controls.
- Added animated mobile menu expansion/collapse with dark-aware menu styling.
- Added animated panel entry with `ui-fade-slide-in`.
- Kept scope limited to the Tabs leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/tabs/`:
  - `tailwind-tabs-reference-desktop.png`
  - `local-tabs-desktop-before.png`
  - `local-tabs-mobile-before.png`
  - `local-tabs-desktop-after.png`
  - `local-tabs-interaction-after.png`
  - `local-tabs-all-dark-after.png`
  - `local-tabs-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-navigation-tabs` verified:
  - `role=tablist` count returned 18.
  - `role=tab` count returned 72.
  - `role=tabpanel` count returned 9.
  - `aria-selected=true` count returned 18.
  - tabs with `aria-controls` count returned 72.
  - first visible `Billing` tab click updated the first panel text and `aria-labelledby`.
  - mobile menu expansion returned `aria-expanded=true` before selection and collapsed after selecting `Company`.
  - all 9 `Dark` controls were exercised.
  - No severe console errors.
  - No framework error overlay.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 137 - Panels page parity pass

Scope:

- Local `plus-application-layout-panels` leaf and its 3 panel preview variants.
- Tailwind Plus Application UI / Layout / Panels reference URL candidates.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/layout/panels` returned 404.
- `https://tailwindcss.com/plus/ui-blocks/application-ui/layout/panel` returned 404.
- Because Tailwind Plus does not currently expose a public Panels leaf at those URLs, this pass used the local leaf quality bar: distinct examples, real interactions, animation, dark/light theme coverage, mobile sanity, and no runtime errors.

Implementation:

- Split the prior shared `layout-panel-page` shell into `layout-panel-split`, `layout-panel-resizable`, and `layout-panel-properties`.
- Rewired the Panels page examples so each card renders a distinct preview instead of the same static two-column shell.
- Added Panels-specific selected thread, panel width, and selected object state so examples do not interfere with each other.
- Added explicit `data-panel-page-theme` markers and dark/light styling for all three Panels examples.
- Added stable accessible labels and `aria-pressed` state to split-pane rows, width controls, layer/canvas objects, and property toggles.
- Added animated feedback surfaces, hover/press motion, animated grid width changes, collapsible metrics panel motion, and switch-style property toggles.
- Fixed the mobile theme-control gap by making preview theme toggles visible on mobile.

Verification:

- Captures and smoke data saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/panels/`:
  - `tailwind-panels-reference.png`
  - `local-panels-desktop-before.png`
  - `local-panels-desktop-after.png`
  - `local-panels-all-dark-after.png`
  - `local-panels-mobile-after.png`
  - `capture-notes-before.json`
  - `chrome-smoke-after.json`
  - `mobile-smoke-after.json`
- Chrome extension desktop smoke verified:
  - page title `Panels`.
  - 3 examples: `Split pane`, `Resizable panel`, and `Properties panel`.
  - 125 rendered buttons.
  - 3 `data-panel-page-theme` roots.
  - split-pane selection, archive action, width selection, metrics collapse, properties layer selection, property toggle, and save feedback.
  - isolated state: split, width, and properties selections remained pressed at the same time.
  - all 3 Dark controls set all 3 roots to `data-panel-page-theme="dark"`.
  - all 3 Light controls set all 3 roots to `data-panel-page-theme="light"`.
  - empty Chrome console errors.
  - desktop horizontal overflow returned 0.
- Mobile 390px smoke verified:
  - 3 visible Dark controls.
  - split-pane, resizable, and properties interactions produced feedback.
  - all 3 Dark controls set all 3 roots to `data-panel-page-theme="dark"`.
  - mobile horizontal overflow returned 0.
  - no console or page errors.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.

## Step 145 - Testimonials page parity pass

Scope:

- Local `plus-marketing-testimonials` leaf and its 8 Testimonials preview variants.
- Tailwind Plus Marketing / Page Sections / Testimonials reference page.

Reference:

- Canonical reference URL: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/testimonials`
- Tailwind reference exposed 8 examples:
  - `Simple centered`
  - `With large avatar`
  - `With overlapping image`
  - `With background image`
  - `Side-by-side`
  - `With star rating`
  - `Grid`
  - `Subtle grid`

Implementation:

- Kept the local Testimonials page aligned to the 8 Tailwind example names.
- Added explicit `data-testimonial-section-theme` and `data-testimonial-section-variant` markers to every Testimonials preview root.
- Made all Testimonials variants respond to the preview Light/Dark theme controls.
- Converted quote blocks, side-by-side testimonials, star-rating testimonial, and grid testimonial cards into real buttons with stable accessible labels.
- Added `aria-pressed` selected state, hover/press motion, focus rings, animated feedback, and light/dark feedback surfaces.

Verification:

- Captures and smoke data saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/testimonials/`.
- Chrome extension desktop smoke verified:
  - page title `Testimonials`.
  - 8 example headings matching the Tailwind reference.
  - 8 `data-testimonial-section-theme` roots.
  - 19 testimonial action buttons.
  - simple centered, star rating, and grid card actions produced visible feedback.
  - all 8 Dark controls set all 8 Testimonials roots to `data-testimonial-section-theme="dark"`.
  - all 8 Light controls set all 8 Testimonials roots to `data-testimonial-section-theme="light"`.
  - empty Chrome console errors.
  - desktop horizontal overflow returned 0.
- Mobile 390px smoke verified:
  - 8 visible Dark controls.
  - 8 Testimonials roots and 19 testimonial action buttons.
  - simple centered, star rating, and grid card actions produced feedback.
  - all 8 Dark controls set all 8 Testimonials roots to `data-testimonial-section-theme="dark"`.
  - mobile horizontal overflow stayed non-positive.
  - no console or page errors.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.

## Step 144 - Newsletter Sections page parity pass

Scope:

- Local `plus-marketing-newsletter-sections` leaf and its 6 Newsletter Section preview variants.
- Tailwind Plus Marketing / Page Sections / Newsletter Sections reference page.

Reference:

- Canonical reference URL: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/newsletter-sections`
- Tailwind reference exposed 6 examples:
  - `Side-by-side with details`
  - `Simple side-by-side`
  - `Simple side-by-side on brand`
  - `Simple stacked`
  - `Centered card`
  - `Side-by-side on card`

Implementation:

- Kept the local Newsletter Sections page aligned to the 6 Tailwind example names.
- Added explicit `data-newsletter-section-theme` and `data-newsletter-section-variant` markers to every Newsletter preview root.
- Replaced fake email-field buttons with real email inputs for all 6 examples.
- Fixed the input remount bug by keeping typing uncontrolled until submit, then persisting the submitted value so it survives preview theme changes.
- Added stable accessible labels, `aria-pressed` selected state, hover/press motion, focus rings, animated feedback, and light/dark surfaces for newsletter submit, privacy, and detail actions.

Verification:

- Captures and smoke data saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/newsletter-sections/`.
- Chrome extension desktop smoke verified:
  - page title `Newsletter Sections`.
  - 6 example headings matching the Tailwind reference.
  - 6 `data-newsletter-section-theme` roots.
  - 6 real newsletter email inputs.
  - 14 newsletter action buttons.
  - typed `alex@example.com` persisted through submit, Dark, and Light preview-theme changes.
  - subscribe, detail, and privacy actions produced visible feedback.
  - all 6 Dark controls set all 6 Newsletter roots to `data-newsletter-section-theme="dark"`.
  - all 6 Light controls set all 6 Newsletter roots to `data-newsletter-section-theme="light"`.
  - empty Chrome console errors.
  - desktop horizontal overflow returned 0.
- Mobile 390px smoke verified:
  - 6 visible Dark controls.
  - 6 Newsletter roots, 6 inputs, and 14 newsletter action buttons.
  - typed `mobile@example.com` persisted through submit and Dark preview-theme changes.
  - subscribe, detail, and privacy actions produced feedback.
  - all 6 Dark controls set all 6 Newsletter roots to `data-newsletter-section-theme="dark"`.
  - mobile horizontal overflow stayed non-positive.
  - no console or page errors.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.

## Step 143 - Header Sections page parity pass

Scope:

- Local `plus-marketing-header-sections` leaf and its 8 Header Section preview variants.
- Tailwind Plus Marketing / Page Sections / Header Sections reference page.

Reference:

- Canonical reference URL: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/header`
- Alternate URL `https://tailwindcss.com/plus/ui-blocks/marketing/sections/header-sections` returned 404.
- Tailwind reference exposed 8 examples:
  - `With stats`
  - `Centered`
  - `Centered with eyebrow`
  - `With cards`
  - `Simple`
  - `Simple with eyebrow`
  - `Simple with background image`
  - `Centered with background image`

Implementation:

- Kept the local Header Sections page aligned to the 8 Tailwind example names.
- Added explicit `data-header-section-theme` and `data-header-section-variant` markers to every Header preview root.
- Made all Header variants respond to the preview theme toggle, including background-image, stats, cards, centered, and simple variants.
- Converted Header CTA links, stats, and contact cards into real buttons with stable accessible labels.
- Added `aria-pressed` selected state, hover/press motion, focus rings, animated feedback, and light/dark feedback surfaces.

Verification:

- Captures and smoke data saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/header-sections/`.
- Chrome extension desktop smoke verified:
  - page title `Header Sections`.
  - 8 example headings matching the Tailwind reference.
  - 8 `data-header-section-theme` roots.
  - 18 Header action buttons.
  - centered `Open roles`, `Offices worldwide` stat, and `Sales` card actions produced visible feedback.
  - all 8 Dark controls set all 8 Header roots to `data-header-section-theme="dark"`.
  - all 8 Light controls set all 8 Header roots to `data-header-section-theme="light"`.
  - empty Chrome console errors.
  - desktop horizontal overflow returned 0.
- Mobile 390px smoke verified:
  - 8 visible Dark controls.
  - 8 Header roots and 18 Header action buttons.
  - centered role, stat, and card actions produced feedback.
  - all 8 Dark controls set all 8 Header roots to `data-header-section-theme="dark"`.
  - mobile horizontal overflow stayed non-positive.
  - no console or page errors.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.

## Step 142 - Pricing Sections page parity pass

Scope:

- Local `plus-marketing-pricing-sections` leaf and its 12 pricing section preview variants.
- Tailwind Plus Marketing / Page Sections / Pricing Sections reference page.

Reference:

- Canonical reference URL: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/pricing`
- Alternate URL `https://tailwindcss.com/plus/ui-blocks/marketing/sections/pricing-sections` returned 404.
- Tailwind reference exposed 12 examples:
  - `Two tiers with emphasized right tier`
  - `Two tiers with emphasized left tier`
  - `Three tiers with logos and feature comparison`
  - `Two tiers with extra tier`
  - `Single price with details`
  - `Three tiers`
  - `Three tiers with dividers`
  - `Three tiers with emphasized tier`
  - `Three tiers with toggle`
  - `Four tiers with toggle`
  - `With comparison table`
  - `Three tiers with feature comparison`

Implementation:

- Kept the local Pricing Sections page aligned to the 12 Tailwind example names.
- Added explicit `data-pricing-section-theme` and `data-pricing-section-variant` markers to every pricing preview root.
- Made pricing surfaces, cards, comparison tables, billing controls, proof logos, extra tier panels, muted copy, and feedback surfaces respond to the preview theme toggle.
- Added stable accessible labels, `aria-pressed` selected state, hover/press motion, and visible feedback for plan selection, billing cycle selection, proof logos, comparison table cells, and enterprise sales CTA.
- Made comparison tables horizontally safe on narrow screens with an overflow-contained table shell.

Verification:

- Captures and smoke data saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/pricing-sections/`.
- Chrome extension desktop smoke verified:
  - page title `Pricing Sections`.
  - 12 example headings matching the Tailwind reference.
  - 12 `data-pricing-section-theme` roots.
  - 102 pricing action buttons.
  - plan selection, annual billing, proof logo, and comparison cell actions produced visible feedback when tested individually.
  - selected controls exposed `aria-pressed=true`.
  - all 12 Dark controls set all 12 pricing roots to `data-pricing-section-theme="dark"`.
  - all 12 Light controls set all 12 pricing roots to `data-pricing-section-theme="light"`.
  - empty Chrome console errors.
  - desktop horizontal overflow returned 0.
- Mobile 390px smoke verified:
  - 12 visible Dark controls.
  - 12 pricing roots and 102 pricing action buttons.
  - plan selection and annual billing actions produced feedback.
  - all 12 Dark controls set all 12 pricing roots to `data-pricing-section-theme="dark"`.
  - mobile horizontal overflow stayed non-positive.
  - no console or page errors.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.

## Step 140 - CTA Sections page parity pass

Scope:

- Local `plus-marketing-cta-sections` leaf and its 11 CTA section preview variants.
- Tailwind Plus Marketing / Page Sections / CTA Sections reference page.

Reference:

- Canonical reference URL: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/cta-sections`
- Alternate URL `https://tailwindcss.com/plus/ui-blocks/marketing/sections/ctas` returned 404.
- Tailwind reference exposed 11 examples:
  - `Dark panel with app screenshot`
  - `Simple stacked`
  - `Centered on dark panel`
  - `Simple centered`
  - `Simple centered with gradient`
  - `Simple centered on brand`
  - `Simple justified`
  - `Simple justified on subtle brand`
  - `Split with image`
  - `Two columns with photo`
  - `With image tiles`

Implementation:

- Kept the local CTA Sections page aligned to the 11 Tailwind example names.
- Added explicit `data-cta-section-theme` and `data-cta-section-variant` markers to every CTA preview root.
- Made CTA surfaces respond to the preview theme toggle, including dark/light versions of dark panel, brand, gradient, subtle-brand, image, and justified variants.
- Added stable accessible labels, `aria-pressed` selected state, hover/press motion, and visible feedback to primary and secondary CTA actions.

Verification:

- Captures and smoke data saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/cta-sections/`:
  - `tailwind-cta-sections-reference.png`
  - `local-cta-sections-desktop-before.png`
  - `local-cta-sections-desktop-after.png`
  - `local-cta-sections-all-dark-after.png`
  - `local-cta-sections-mobile-after.png`
  - `capture-notes-before.json`
  - `chrome-smoke-after.json`
  - `mobile-smoke-after.json`
- Chrome extension desktop smoke verified:
  - page title `CTA Sections`.
  - 11 example headings matching the Tailwind reference.
  - 117 rendered buttons.
  - 11 primary CTA action buttons.
  - 11 secondary CTA detail buttons.
  - 11 `data-cta-section-theme` roots.
  - primary and secondary CTA actions produced visible feedback.
  - selected secondary action exposed `aria-pressed=true`.
  - all 11 Dark controls set all 11 CTA roots to `data-cta-section-theme="dark"`.
  - all 11 Light controls set all 11 CTA roots to `data-cta-section-theme="light"`.
  - empty Chrome console errors.
  - desktop horizontal overflow returned 0.
- Mobile 390px smoke verified:
  - 11 visible Dark controls.
  - 11 primary and 11 secondary CTA action buttons.
  - primary and secondary CTA actions produced feedback.
  - all 11 Dark controls set all 11 CTA roots to `data-cta-section-theme="dark"`.
  - mobile horizontal overflow returned 0.
  - no console or page errors.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.

## Step 139 - Feature Sections page parity pass

Scope:

- Local `plus-marketing-feature-sections` leaf and its 15 feature section preview variants.
- Tailwind Plus Marketing / Page Sections / Feature Sections reference page.

Reference:

- Canonical reference URL: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/feature-sections`
- Alternate URL `https://tailwindcss.com/plus/ui-blocks/marketing/sections/features` returned 404.
- Tailwind reference exposed 15 examples:
  - `With product screenshot`
  - `Centered 2x2 grid`
  - `With large screenshot`
  - `With large bordered screenshot`
  - `Simple three column with small icons`
  - `With product screenshot on left`
  - `Simple three column with large icons`
  - `Contained in panel`
  - `With product screenshot panel`
  - `With testimonial`
  - `Offset 2x2 grid`
  - `With code example panel`
  - `Offset with feature list`
  - `Simple`
  - `Simple 3x2 grid`

Implementation:

- Kept the local Feature Sections page aligned to the 15 Tailwind example names.
- Added explicit `data-feature-section-theme` and `data-feature-section-variant` markers to every feature preview root.
- Added dark/light styling hooks across feature roots, screenshots, headings, icon lists, feature grids, soft panels, and feedback surfaces.
- Converted feature list/grid items into real buttons with stable `Open feature ...` accessible names, `aria-pressed` selected state, hover/press motion, and visible feedback.
- Preserved the Tailwind-style screenshot, testimonial, code-panel, offset-list, and grid layouts while making their feature claims inspectable.

Verification:

- Captures and smoke data saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/feature-sections/`:
  - `tailwind-feature-sections-reference.png`
  - `local-feature-sections-desktop-before.png`
  - `local-feature-sections-desktop-after.png`
  - `local-feature-sections-all-dark-after.png`
  - `local-feature-sections-mobile-after.png`
  - `capture-notes-before.json`
  - `chrome-smoke-after.json`
  - `mobile-smoke-after.json`
- Chrome extension desktop smoke verified:
  - page title `Feature Sections`.
  - 15 example headings matching the Tailwind reference.
  - 158 rendered buttons.
  - 43 feature action buttons.
  - 15 `data-feature-section-theme` roots.
  - `Push to deploy`, `SSL certificates`, and `Database backups` feature actions produced visible feedback.
  - selected feature action exposed `aria-pressed=true`.
  - all 15 Dark controls set all 15 feature roots to `data-feature-section-theme="dark"`.
  - all 15 Light controls set all 15 feature roots to `data-feature-section-theme="light"`.
  - empty Chrome console errors.
  - desktop horizontal overflow returned 0.
- Mobile 390px smoke verified:
  - 15 visible Dark controls.
  - 43 feature action buttons.
  - `Push to deploy` and `SSL certificates` actions produced feedback.
  - all 15 Dark controls set all 15 feature roots to `data-feature-section-theme="dark"`.
  - mobile horizontal overflow returned 0.
  - no console or page errors.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.

## Step 138 - Hero Sections page parity pass

Scope:

- Local `plus-marketing-hero-sections` leaf and its 12 hero section preview variants.
- Tailwind Plus Marketing / Page Sections / Hero Sections reference page.

Reference:

- Canonical reference URL: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/heroes`
- Alternate URL `https://tailwindcss.com/plus/ui-blocks/marketing/page-sections/hero-sections` returned 404.
- Tailwind reference exposed 12 examples:
  - `Simple centered`
  - `Split with screenshot`
  - `Split with bordered screenshot`
  - `Split with code example`
  - `Simple centered with background image`
  - `With bordered app screenshot`
  - `With app screenshot`
  - `With phone mockup`
  - `Split with image`
  - `With angled image on right`
  - `With image tiles`
  - `With offset image`

Implementation:

- Kept the local Hero Sections page aligned to the 12 Tailwind example names.
- Added explicit `data-hero-section-theme` and `data-hero-section-variant` markers to every hero preview root so dark/light coverage can be verified per example.
- Added stable accessible labels and selected state where appropriate for hero nav buttons, login, announcement, primary CTA, secondary CTA, GitHub, funding announcement, hiring, story, live demo, and image tile actions.
- Made hero feedback visible on mobile as well as desktop.
- Added stronger hover/press motion on hero CTA and announcement controls.
- Fixed a mobile interaction bug where the image-tile status panel intercepted pointer events and blocked selecting a lower tile.

Verification:

- Captures and smoke data saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/hero-sections/`:
  - `tailwind-hero-sections-reference.png`
  - `local-hero-sections-desktop-before.png`
  - `local-hero-sections-desktop-after.png`
  - `local-hero-sections-all-dark-after.png`
  - `local-hero-sections-mobile-after.png`
  - `capture-notes-before.json`
  - `chrome-smoke-after.json`
  - `mobile-smoke-after.json`
- Chrome extension desktop smoke verified:
  - page title `Hero Sections`.
  - 12 example headings matching the Tailwind reference.
  - 199 rendered buttons.
  - 12 `data-hero-section-theme` roots.
  - nav, login, announcement, primary CTA, secondary CTA, GitHub, funding, hiring, story, live demo, and tile actions produced visible feedback.
  - all 12 Dark controls set all 12 hero roots to `data-hero-section-theme="dark"`.
  - all 12 Light controls set all 12 hero roots to `data-hero-section-theme="light"`.
  - empty Chrome console errors.
  - desktop horizontal overflow returned 0.
- Mobile 390px smoke verified:
  - 12 visible Dark controls.
  - primary CTA, funding announcement, and image tile actions produced feedback.
  - all 12 Dark controls set all 12 hero roots to `data-hero-section-theme="dark"`.
  - mobile horizontal overflow returned 0.
  - no console or page errors.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.

## Step 128 - Order History page parity pass

Scope:

- Local `plus-ecommerce-order-history` leaf and its 4 order history variants.
- Tailwind Plus Ecommerce Components/Order History live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/order-history` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Order History` and the same 4 local example names.

Implementation:

- Fixed the smoke-discovered weak interaction state where repeated `View invoice`, `View product`, and `Buy again` controls were not directly inspectable as unique order/product actions.
- Added explicit order-history theme state markers so each of the 4 examples can be verified as receiving Dark and Light preview-theme changes.
- Added dark/light root styling across order history frames, invoice meta panels, order cards, table rows, action cards, feedback surfaces, borders, and muted copy.
- Added stable accessible labels and `aria-pressed` selected state to invoice, product, buy-again, manage-order, and shop-similar actions.
- Kept the pass scoped to the `Order History` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/order-history/`.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5192/?filter=nav%3Aplus-ecommerce-order-history` verified:
  - local page identity returned `Order History`.
  - reference/local example count matched 4 examples.
  - theme button count returned 12.
  - action button count returned 94.
  - buttons exposing `aria-pressed` increased from 12 to 50 after the fix.
  - `View invoice WU881911`, `View product Merino Pullover`, `Buy again Merino Pullover`, `Manage order DR45873`, and `Shop similar Earthen Mug` produced selected state and visible feedback.
  - all 4 `Dark` controls exposed `aria-pressed=true` and all 4 order-history roots reported `data-order-history-theme="dark"`.
  - all 4 `Light` controls exposed `aria-pressed=true` and all 4 order-history roots reported `data-order-history-theme="light"`.
  - mobile 390px exposed 94 buttons and 4 order-history roots with no horizontal overflow.
  - mobile `View invoice WU881911` produced visible feedback.
  - No severe console errors or page errors.

## Step 129 - Incentives page parity pass

Scope:

- Local `plus-ecommerce-incentives` leaf and its 8 incentive variants.
- Tailwind Plus Ecommerce Components/Incentives live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/incentives` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Incentives` and the same 8 local example names.

Implementation:

- Fixed the smoke-discovered theme gap where all 8 `Dark` controls became pressed but incentive examples had no `data-incentive-theme` roots and only one dark surface was detectable.
- Added explicit incentive theme state markers so each of the 8 examples can be verified as receiving Dark and Light preview-theme changes.
- Added dark/light styling across incentive frames, heading panels, benefit cards, icons, custom illustrations, muted copy, selected states, and feedback surfaces.
- Added stable accessible labels and `aria-pressed` selected state to incentive benefit cards and icon rows.
- Kept the pass scoped to the `Incentives` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/incentives/`.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5193/?filter=nav%3Aplus-ecommerce-incentives` verified:
  - local page identity returned `Incentives`.
  - reference/local example count matched 8 examples.
  - theme button count returned 24.
  - action button count returned 102.
  - buttons exposing `aria-pressed` increased from 24 to 50 after the fix.
  - `Open incentive Free shipping`, `Open incentive 10-year warranty`, `Open incentive Gift cards`, `Open incentive 5-year shelf-life`, and `Open incentive Fast, contactless delivery` produced selected state and visible feedback.
  - all 8 `Dark` controls exposed `aria-pressed=true` and all 8 incentive roots reported `data-incentive-theme="dark"`.
  - all 8 `Light` controls exposed `aria-pressed=true` and all 8 incentive roots reported `data-incentive-theme="light"`.
  - mobile 390px exposed 102 buttons and 8 incentive roots with no horizontal overflow.
  - mobile `Open incentive Free shipping` produced selected state and visible feedback.
  - No severe console errors or page errors.

## Step 130 - Storefront Pages page parity pass

Scope:

- Local `plus-ecommerce-page-examples-storefront-pages` leaf and its 4 storefront page variants.
- Tailwind Plus Ecommerce Page Examples/Storefront Pages live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/storefront-pages` returned 200.
- `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/storefront` returned 404.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Storefront Pages` and the same 4 local example names.

Implementation:

- Fixed the smoke-discovered inspectability gap where storefront category, product, story, and detail controls had accessible names mixed with full card text, making exact leaf-level verification weak.
- Added explicit storefront theme state markers so each of the 4 examples can be verified as receiving Dark and Light preview-theme changes.
- Added stable accessible labels and `aria-pressed` selected state to storefront nav links, utility icon buttons, hero CTAs, category tiles, product tiles, promo CTAs, story cards, detail cards, perk rows, and footer links.
- Added dark/light styling hooks across storefront roots, nav, product rows, feature sections, detail panels, perk strips, and footers.
- Kept the pass scoped to the `Storefront Pages` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/storefront-pages/`.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5194/?filter=nav%3Aplus-ecommerce-page-examples-storefront-pages` verified:
  - local page identity returned `Storefront Pages`.
  - reference/local example count matched 4 examples.
  - theme button count returned 12.
  - action button count returned 180.
  - buttons exposing `aria-pressed` increased from 12 to 136 after the fix.
  - `Open storefront Search`, `Open storefront Account`, `Open storefront collection Dark`, `Open category Stationery`, `Open product Black precision pen`, `Open storefront sale collection`, `Open story Better material choices.`, `Open detail Natural materials`, and `Open perk Free shipping` produced selected state and visible feedback.
  - all 4 `Dark` controls exposed `aria-pressed=true` and all 4 storefront roots reported `data-storefront-theme="dark"`.
  - all 4 `Light` controls exposed `aria-pressed=true` and all 4 storefront roots reported `data-storefront-theme="light"`.
  - mobile 390px exposed 180 buttons and 4 storefront roots with no horizontal overflow.
  - mobile `Open category Stationery` produced selected state and visible feedback.
  - No severe console errors or page errors.

## Step 131 - Product Pages page parity pass

Scope:

- Local `plus-ecommerce-page-examples-product-pages` leaf and its 5 product page variants.
- Tailwind Plus Ecommerce Page Examples/Product Pages live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/product-pages` returned 200.
- `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/product-page` returned 404.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Product Pages` and the same 5 local example names.

Implementation:

- Fixed the smoke-discovered theme gap where product page examples had no `data-product-page-theme` roots and dark/light state could not be verified per example.
- Added explicit product-page theme state markers so each of the 5 examples can be verified as receiving Dark and Light preview-theme changes.
- Added stable accessible labels and `aria-pressed` selected state to product nav links, utility icon buttons, color swatches, size controls, add-to-bag buttons, related product cards, review cards, feature cards, product tabs, tab cards, and footer links.
- Added `aria-expanded` to expandable product details and retained animated reveal behavior.
- Added dark/light styling hooks across product page roots, nav, reviews, related grids, fine-detail sections, tabs, and feedback surfaces.
- Kept the pass scoped to the `Product Pages` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/product-pages/`.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5195/?filter=nav%3Aplus-ecommerce-page-examples-product-pages` verified:
  - local page identity returned `Product Pages`.
  - reference/local example count matched 5 examples.
  - theme button count returned 15.
  - action button count returned 238.
  - buttons exposing `aria-pressed` increased from 15 to 188 after the fix.
  - `Open product Search`, `Open product Account`, `Select color Black`, `Select size M`, `Add Basic Tee to bag`, `Toggle product detail Features`, `Open review Perfect everyday weight.`, `Open related product Essential Tee`, `Open product feature Water resistant`, `Open product tab Details`, and `Open product tab card Reviews` produced selected/expanded state and visible feedback.
  - all 5 `Dark` controls exposed `aria-pressed=true` and all 5 product-page roots reported `data-product-page-theme="dark"`.
  - all 5 `Light` controls exposed `aria-pressed=true` and all 5 product-page roots reported `data-product-page-theme="light"`.
  - mobile 390px exposed 238 buttons and 5 product-page roots with no horizontal overflow.
  - mobile `Select color Black` produced selected state and visible feedback.
  - No severe console errors or page errors.

## Step 132 - Category Pages page parity pass

Scope:

- Local `plus-ecommerce-page-examples-category-pages` leaf and its 5 category page variants.
- Tailwind Plus Ecommerce Page Examples/Category Pages live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/category-pages` returned 200.
- `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/category-page` returned 404.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Category Pages` and the same 5 local example names.

Implementation:

- Fixed the smoke-discovered theme gap where category page examples had no `data-category-page-theme` roots and dark/light state could not be verified per example.
- Added explicit category-page theme state markers so each of the 5 examples can be verified as receiving Dark and Light preview-theme changes.
- Added stable accessible labels and `aria-pressed` selected state to category nav links, utility icon buttons, sidebar filters, toolbar chips, sort controls, product cards, pagination, and footer links.
- Added dark/light styling hooks across category page roots, nav, sidebars, toolbars, product grids, pagination, footers, headings, muted copy, and feedback surfaces.
- Kept the pass scoped to the `Category Pages` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/category-pages/`.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5196/?filter=nav%3Aplus-ecommerce-page-examples-category-pages` verified:
  - local page identity returned `Category Pages`.
  - reference/local example count matched 5 examples.
  - theme button count returned 15.
  - action button count returned 241.
  - buttons exposing `aria-pressed` increased from 15 to 195 after the fix.
  - `Open category Search`, `Open category Filters`, `Open category Cart`, `Toggle category filter Apparel`, `Toggle category chip New`, `Open category sort`, `Open category product Black Basic Tee`, `Open category page 2`, and `Open category footer Shop Gift cards` produced selected state and visible feedback.
  - all 5 `Dark` controls exposed `aria-pressed=true` and all 5 category-page roots reported `data-category-page-theme="dark"`.
  - all 5 `Light` controls exposed `aria-pressed=true` and all 5 category-page roots reported `data-category-page-theme="light"`.
  - mobile 390px exposed 241 buttons and 5 category-page roots with no horizontal overflow.
  - mobile `Toggle category chip New` produced selected state and visible feedback.
  - No severe console errors or page errors.

## Step 133 - Shopping Cart Pages page parity pass

Scope:

- Local `plus-ecommerce-page-examples-shopping-cart-pages` leaf and its 3 shopping cart page variants.
- Tailwind Plus Ecommerce Page Examples/Shopping Cart Pages live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/shopping-cart-pages` returned 200.
- `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/shopping-cart-page` returned 404.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Shopping Cart Pages` and the same 3 local example names.

Implementation:

- Fixed the smoke-discovered theme gap where shopping cart page examples had no `data-cart-page-theme` roots and dark/light state could not be verified per example.
- Added explicit cart-page theme state markers so each of the 3 examples can be verified as receiving Dark and Light preview-theme changes.
- Added stable accessible labels and `aria-pressed` selected state to cart nav links, utility icon buttons, quantity increment controls, checkout/continue actions, related product cards, policy cards, footer links, and newsletter controls.
- Added remove/restore feedback for adjustable cart lines and kept the quantity/removed visual state transition.
- Added dark/light styling hooks across cart page roots, nav, line items, summaries, policy grids, related products, footers, newsletter fields, headings, muted copy, and feedback surfaces.
- Kept the pass scoped to the `Shopping Cart Pages` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/shopping-cart-pages/`.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5197/?filter=nav%3Aplus-ecommerce-page-examples-shopping-cart-pages` verified:
  - local page identity returned `Shopping Cart Pages`.
  - reference/local example count matched 3 examples.
  - theme button count returned 9.
  - action button count returned 135.
  - buttons exposing `aria-pressed` increased from 9 to 92 after the fix.
  - `Open cart Search`, `Open cart Account`, `Open cart Cart`, `Increase quantity Basic Tee`, `Remove cart item Basic Tee`, `Start cart checkout`, `Open continue shopping`, `Open related cart product Wood card holder`, `Open policy Free returns`, `Open cart footer Products Bags`, and `Submit newsletter signup` produced selected state or visible feedback.
  - all 3 `Dark` controls exposed `aria-pressed=true` and all 3 cart-page roots reported `data-cart-page-theme="dark"`.
  - all 3 `Light` controls exposed `aria-pressed=true` and all 3 cart-page roots reported `data-cart-page-theme="light"`.
  - mobile 390px exposed 135 buttons and 3 cart-page roots with no horizontal overflow.
  - mobile `Start cart checkout` produced selected state and visible feedback.
  - No severe console errors or page errors.

## Step 76 - Breadcrumbs page parity pass

Scope:

- Tailwind Plus `Application UI / Navigation / Breadcrumbs` reference page.
- Local `plus-navigation-breadcrumbs` leaf and its 4 breadcrumb preview variants.

Implementation:

- Added `nav aria-label` breadcrumb semantics to every breadcrumb example.
- Added ordered list structure with `ol` and `li`.
- Converted breadcrumb segments from static spans into clickable crumb controls.
- Added `aria-current=page` to current-location crumbs.
- Added focus-visible rings and hover/press motion to crumb controls.
- Added visible breadcrumb click feedback below each preview.
- Preserved the contained, full-width, chevron, and slash visual variants.
- Kept scope limited to the Breadcrumbs leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/breadcrumbs/`:
  - `tailwind-breadcrumbs-reference-desktop.png`
  - `local-breadcrumbs-desktop-before.png`
  - `local-breadcrumbs-mobile-before.png`
  - `local-breadcrumbs-desktop-after.png`
  - `local-breadcrumbs-interaction-after.png`
  - `local-breadcrumbs-all-dark-after.png`
  - `local-breadcrumbs-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-navigation-breadcrumbs` verified:
  - breadcrumb `nav` count returned 4.
  - breadcrumb button count returned 12.
  - ordered list count returned 4.
  - `aria-current=page` count returned 4.
  - `Project Nero` current feedback appeared after clicking the current crumb.
  - mobile `Projects` feedback appeared after selecting a parent crumb.
  - all 4 `Dark` controls were exercised.
  - No severe console errors.
  - No framework error overlay.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 77 - Pagination page parity pass

Scope:

- Tailwind Plus `Application UI / Navigation / Pagination` reference page.
- Local `plus-navigation-pagination` leaf and its 3 pagination preview variants.

Implementation:

- Added `nav aria-label` pagination landmarks to every pagination control group.
- Added accessible previous/next/page/ellipsis button labels.
- Added `aria-current=page` to active numbered page buttons.
- Added focus-visible rings and hover/press motion to pagination controls.
- Added ellipsis feedback for large-page navigation.
- Updated previous/next behavior to move relative to the active page.
- Added computed result ranges such as `Showing 21 to 30 of 97 results`.
- Corrected light card row contrast from pale text on white to readable slate and emerald tones.
- Preserved card footer, centered numbers, and simple footer visual variants.
- Kept scope limited to the Pagination leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/pagination/`:
  - `tailwind-pagination-reference-desktop.png`
  - `local-pagination-desktop-before.png`
  - `local-pagination-mobile-before.png`
  - `local-pagination-desktop-after.png`
  - `local-pagination-interaction-after.png`
  - `local-pagination-all-dark-after.png`
  - `local-pagination-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-navigation-pagination` verified:
  - pagination `nav` count returned 4.
  - pagination button count returned 22.
  - `aria-current=page` count returned 2.
  - accessible `Next page` button count returned 3.
  - accessible `Previous page` button count returned 3.
  - `Page 3 opened` feedback appeared after selecting page 3.
  - page 3 became the current page and the result range updated to `Showing 21 to 30 of 97 results`.
  - `More pages opened` feedback appeared after selecting the ellipsis control.
  - all 3 `Dark` controls were exercised.
  - No severe console errors.
  - No framework error overlay.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 78 - Vertical Navigation page parity pass

Scope:

- Tailwind Plus `Application UI / Navigation / Vertical Navigation` reference page.
- Local `plus-navigation-vertical-navigation` leaf and its 6 vertical navigation preview variants.

Implementation:

- Added per-example `nav aria-label` primary navigation landmarks.
- Added secondary `nav aria-labelledby` semantics for the `Your teams` section.
- Added `aria-current=page` to active primary and secondary navigation items.
- Added focus-visible rings and hover/press motion to vertical navigation controls.
- Preserved simple, badges, icons-and-badges, icons, secondary navigation, and on-gray visual variants.
- Kept scope limited to the Vertical Navigation leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/vertical-navigation/`:
  - `tailwind-vertical-navigation-reference-desktop.png`
  - `local-vertical-navigation-desktop-before.png`
  - `local-vertical-navigation-mobile-before.png`
  - `local-vertical-navigation-desktop-after.png`
  - `local-vertical-navigation-interaction-after.png`
  - `local-vertical-navigation-all-dark-after.png`
  - `local-vertical-navigation-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-navigation-vertical-navigation` verified:
  - vertical navigation landmark count returned 6.
  - secondary navigation count returned 1.
  - `aria-current=page` count returned 7 after secondary selection.
  - `Team opened` feedback appeared after selecting a primary item.
  - `GraphQL API opened` feedback appeared after selecting a secondary item.
  - `GraphQL API` became the current secondary item.
  - mobile `Reports opened` feedback appeared after selecting a mobile-width primary item.
  - all 6 `Dark` controls were exercised.
  - No severe console errors.
  - No framework error overlay.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 79 - Sidebar Navigation page parity pass

Scope:

- Tailwind Plus `Application UI / Navigation / Sidebar Navigation` reference page.
- Local `plus-navigation-sidebar-navigation` leaf and its 5 sidebar navigation preview variants.

Implementation:

- Added primary sidebar `nav aria-label` landmarks to every sidebar example.
- Added `Your teams` navigation landmarks with `aria-labelledby`.
- Added secondary sidebar navigation landmarks where the variant includes secondary navigation.
- Added `aria-current=page` to active primary, child, and secondary navigation items.
- Added `aria-expanded` and `aria-controls` to expandable `Projects` controls.
- Added animated expandable child navigation with transform and opacity.
- Converted team rows into clickable controls with visible feedback.
- Added focus-visible rings and hover/press motion to sidebar controls.
- Preserved light, dark, expandable, secondary navigation, and brand visual variants.
- Kept scope limited to the Sidebar Navigation leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/sidebar-navigation/`:
  - `tailwind-sidebar-navigation-reference-desktop.png`
  - `local-sidebar-navigation-desktop-before.png`
  - `local-sidebar-navigation-mobile-before.png`
  - `local-sidebar-navigation-desktop-after.png`
  - `local-sidebar-navigation-interaction-after.png`
  - `local-sidebar-navigation-all-dark-after.png`
  - `local-sidebar-navigation-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-navigation-sidebar-navigation` verified:
  - primary sidebar navigation count returned 5.
  - teams navigation count returned 5.
  - secondary sidebar navigation count returned 1.
  - `aria-current=page` count returned 4 after secondary selection.
  - expandable control count returned 1 and expanded true count returned 1.
  - `GraphQL API opened` feedback appeared after child navigation selection.
  - `Heroicons opened` feedback appeared after team selection.
  - `Settings opened` feedback appeared after secondary navigation selection.
  - team button count returned 15.
  - all 5 `Dark` controls were exercised.
  - No severe console errors.
  - No framework error overlay.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 80 - Command Palettes page parity pass

Scope:

- Tailwind Plus `Application UI / Navigation / Command Palettes` reference page.
- Local `plus-navigation-command-palettes` leaf and its 8 command palette preview variants.

Implementation:

- Added `role=combobox` to command palette search inputs.
- Added `aria-expanded`, `aria-controls`, `aria-autocomplete`, and `aria-activedescendant`.
- Added `role=listbox` to result containers.
- Added `role=option` and `aria-selected` to command rows.
- Added stable row IDs for active descendant references.
- Added ArrowDown and Enter keyboard selection behavior.
- Preserved search filtering and added visible selected-command feedback.
- Preserved simple, padded, preview, images, icons, translucent, groups, and footer visual variants.
- Kept scope limited to the Command Palettes leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/command-palettes/`:
  - `tailwind-command-palettes-reference-desktop.png`
  - `local-command-palettes-desktop-before.png`
  - `local-command-palettes-mobile-before.png`
  - `local-command-palettes-desktop-after.png`
  - `local-command-palettes-interaction-after.png`
  - `local-command-palettes-all-dark-after.png`
  - `local-command-palettes-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-navigation-command-palettes` verified:
  - combobox count returned 8.
  - listbox count returned 8.
  - option count returned 38 after filtering.
  - selected option count returned 8.
  - active descendant count returned 8.
  - expanded combobox count returned 8.
  - filtered Emily/Emma option count returned 14.
  - keyboard selection feedback appeared after ArrowDown and Enter.
  - mobile filtered Tom option count returned 6.
  - all 8 `Dark` controls were exercised.
  - No severe console errors.
  - No framework error overlay.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 81 - Modal Dialogs page parity pass

Scope:

- Tailwind Plus `Application UI / Overlays / Modal Dialogs` reference page.
- Local `plus-overlays-modal-dialogs` leaf and its 6 modal dialog preview variants.

Implementation:

- Added `role=dialog` to open modal panels.
- Added `aria-modal=true` while modal panels are open.
- Added `aria-labelledby` and `aria-describedby` connections to modal titles and descriptions.
- Added focusable dialog containers and Escape dismissal.
- Added helper functions for cancel, confirm, dismiss, and reopen interactions.
- Removed dialog role and modal ARIA from closed panels, with `aria-hidden` applied while closed.
- Preserved gray footer, single action, wide buttons, alert, dismiss button, and left-aligned action variants.
- Kept scope limited to the Modal Dialogs leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/modal-dialogs/`:
  - `tailwind-modal-dialogs-reference-desktop.png`
  - `local-modal-dialogs-desktop-before.png`
  - `local-modal-dialogs-mobile-before.png`
  - `local-modal-dialogs-desktop-after.png`
  - `local-modal-dialogs-interaction-after.png`
  - `local-modal-dialogs-all-dark-after.png`
  - `local-modal-dialogs-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-overlays-modal-dialogs` verified:
  - open dialog count returned 6.
  - open `aria-modal=true` count returned 6.
  - open `aria-labelledby` count returned 6.
  - open `aria-describedby` count returned 6.
  - cancel feedback appeared and reduced the dialog role count from 6 to 5.
  - reopen restored dialog role count to 6.
  - confirm feedback appeared.
  - Escape dismissal feedback appeared and reduced dialog role count from 6 to 5.
  - all 6 `Dark` controls were exercised.
  - No severe console errors.
  - No framework error overlay.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 82 - Drawers page parity pass

Scope:

- Tailwind Plus `Application UI / Overlays / Drawers` reference page.
- Local `plus-overlays-drawers` leaf and its 12 drawer preview variants.

Implementation:

- Added `role=dialog` to open drawer panels.
- Added `aria-modal=true` while drawer panels are open.
- Added `aria-labelledby` and `aria-describedby` connections to drawer titles and descriptions.
- Added focusable drawer containers and Escape dismissal.
- Added helper functions for close, cancel, save, and reopen interactions.
- Added visible feedback for close, outside close, save, cancel, and Escape dismissal.
- Removed dialog role and modal ARIA from closed panels, with `aria-hidden` applied while closed.
- Preserved profile, contacts, file details, branded create project, and wide create project variants.
- Kept scope limited to the Drawers leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/drawers/`:
  - `tailwind-drawers-reference-desktop.png`
  - `local-drawers-desktop-before.png`
  - `local-drawers-mobile-before.png`
  - `local-drawers-desktop-after.png`
  - `local-drawers-interaction-after.png`
  - `local-drawers-all-dark-after.png`
  - `local-drawers-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-overlays-drawers` verified:
  - open dialog count returned 12.
  - open `aria-modal=true` count returned 12.
  - open `aria-labelledby` count returned 12.
  - open `aria-describedby` count returned 12.
  - outside close feedback appeared and reduced the dialog role count from 12 to 11.
  - reopen restored dialog role count to 12.
  - save feedback appeared and reduced the dialog role count from 12 to 11.
  - Escape dismissal feedback appeared and reduced dialog role count from 12 to 11.
  - all 12 `Dark` controls were exercised.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 134 - Checkout Pages page parity pass

Scope:

- Local `plus-ecommerce-page-examples-checkout-pages` leaf and its 5 checkout page variants.
- Tailwind Plus Ecommerce Page Examples/Checkout Pages live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/checkout-pages` returned 200.
- `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/checkout-page` returned 404.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Checkout Pages` and the same 5 local example names: `With order summary sidebar`, `Single step with order summary`, `With mobile order summary overlay`, `Multi-step`, and `Split with order summary`.

Implementation:

- Added explicit checkout-page theme state markers so each of the 5 examples can be verified as receiving Dark and Light preview-theme changes.
- Converted checkout field placeholders into real controlled input fields so typed values survive feedback rerenders.
- Added stable accessible labels and `aria-pressed` selected state to checkout nav links, utility icon buttons, express payment, confirm/continue/pay CTAs, summary item rows, stepper controls, footer links, and newsletter controls.
- Added mobile order-summary overlay state with `aria-expanded`, `aria-pressed`, visible feedback, and an animated hide/show transition.
- Added dark/light styling hooks across checkout page roots, nav, fields, summaries, stepper, footer, headings, muted copy, borders, and feedback surfaces.
- Kept the pass scoped to the `Checkout Pages` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/checkout-pages/`:
  - `tailwind-checkout-pages-reference-1.png`
  - `tailwind-checkout-pages-reference-2.png`
  - `local-checkout-pages-desktop-before.png`
  - `local-checkout-pages-mobile-before.png`
  - `local-checkout-pages-interaction-before-fix.png`
  - `local-checkout-pages-all-dark-before-fix.png`
  - `local-checkout-pages-desktop-after.png`
  - `local-checkout-pages-interaction-after-fix.png`
  - `local-checkout-pages-all-dark-after.png`
  - `local-checkout-pages-all-light-after.png`
  - `local-checkout-pages-mobile-after.png`
  - `capture-notes-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5198/?filter=nav%3Aplus-ecommerce-page-examples-checkout-pages` verified 5 examples, 132 action buttons, 62 real inputs, 86 `aria-pressed` buttons, preserved `Email address` input value after blur, all 5 dark roots, all 5 light roots, mobile overlay `aria-expanded` changing from `true` to `false`, mobile continue feedback, console health, and desktop/mobile overflow.

## Step 135 - Order Detail Pages page parity pass

Scope:

- Local `plus-ecommerce-page-examples-order-detail-pages` leaf and its 3 order detail page variants.
- Tailwind Plus Ecommerce Page Examples/Order Detail Pages live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/order-detail-pages` returned 200.
- `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/order-detail-page` returned 404.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Order Detail Pages` and the same 3 local example names: `With progress bars`, `With large images and progress bars`, and `Simple with full order details`.

Implementation:

- Added explicit order-detail page theme state markers so each of the 3 examples can be verified as receiving Dark and Light preview-theme changes.
- Added stable accessible labels and `aria-pressed` selected state to order-detail nav links, utility icon buttons, invoice actions, progress step controls, tracking copy, and footer links.
- Added dark/light styling hooks across order-detail roots, nav, panels, product cards, progress tracks, address grids, footer links, headings, muted copy, borders, and feedback surfaces.
- Kept progress bars animated with `transition-all duration-500` and made step selection update the visible progress width.
- Kept the pass scoped to the `Order Detail Pages` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/order-detail-pages/`:
  - `tailwind-order-detail-pages-reference-1.png`
  - `tailwind-order-detail-pages-reference-2.png`
  - `local-order-detail-pages-desktop-before.png`
  - `local-order-detail-pages-mobile-before.png`
  - `local-order-detail-pages-interaction-before-fix.png`
  - `local-order-detail-pages-all-dark-before-fix.png`
  - `local-order-detail-pages-desktop-after.png`
  - `local-order-detail-pages-interaction-after-fix.png`
  - `local-order-detail-pages-all-dark-after.png`
  - `local-order-detail-pages-all-light-after.png`
  - `local-order-detail-pages-mobile-after.png`
  - `capture-notes-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5199/?filter=nav%3Aplus-ecommerce-page-examples-order-detail-pages` verified 3 examples, 116 action buttons, 74 `aria-pressed` buttons, invoice/progress/tracking/footer feedback, `Nomad Tumbler Shipped` progress width at `75%`, all 3 dark roots, all 3 light roots, mobile tracking copy feedback, console health, and desktop/mobile overflow.

## Step 136 - Order History Pages page parity pass

Scope:

- Local `plus-ecommerce-page-examples-order-history-pages` leaf and its 5 order history page variants.
- Tailwind Plus Ecommerce Page Examples/Order History Pages live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/order-history-pages` returned 200.
- `https://tailwindcss.com/plus/ui-blocks/ecommerce/page-examples/order-history-page` returned 404.
- Browser verification used the working Chrome extension backend after confirming `iab` was not available in this session.
- Reference headings included `Order History Pages` and the same 5 local example names: `Simple`, `With invoice list and quick actions`, `With invoice panels`, `With invoice tables`, and `With invoice list`.

Implementation:

- Added explicit order-history page theme state markers so each of the 5 examples can be verified as receiving Dark and Light preview-theme changes.
- Added dark/light styling hooks across order-history roots, store headers, footers, image wells, invoice headers, table shells, product rows, summary order cards, headings, muted copy, borders, and feedback surfaces.
- Added stable accessible labels and `aria-pressed` selected state to order-history nav links, utility icon buttons, product cards, manage-order actions, invoice actions, product links, buy-again actions, shop-similar actions, table product actions, summary order cards, and footer links.
- Kept hover/press motion on product cards, order cards, and action buttons, and added animated feedback surfaces.
- Kept the pass scoped to the `Order History Pages` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/order-history-pages/`:
  - `tailwind-order-history-pages-reference-1.png`
  - `tailwind-order-history-pages-reference-2.png`
  - `local-order-history-pages-desktop-before.png`
  - `local-order-history-pages-desktop-after.png`
  - `local-order-history-pages-interaction-after-fix.png`
  - `local-order-history-pages-all-dark-after.png`
  - `local-order-history-pages-all-light-after.png`
  - `local-order-history-pages-mobile-after.png`
  - `capture-notes-before.json`
  - `chrome-smoke-after.json`
  - `mobile-smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Chrome extension smoke on `http://127.0.0.1:5200/?filter=nav%3Aplus-ecommerce-page-examples-order-history-pages` verified 5 examples, 236 action buttons, 190 `aria-pressed` buttons, product/manage/invoice/buy-again/shop-similar/table/summary/footer feedback, all 5 dark roots, all 5 light roots, empty console errors, mobile card feedback, and desktop/mobile overflow.

## Step 83 - Notifications page parity pass

Scope:

- Tailwind Plus `Application UI / Overlays / Notifications` reference page.
- Local `plus-overlays-notifications` leaf and its 6 notification preview variants.

Implementation:

- Added `role=status` to visible notification examples.
- Added `aria-live=polite` and `aria-atomic=true` while notifications are visible.
- Removed live status semantics from hidden notifications with conditional role/live attributes.
- Added `aria-hidden` to the hidden overlay container.
- Added show, dismiss, undo, reply, accept, decline, and block interaction feedback.
- Added hover, press, and entry motion to notification actions and cards.
- Preserved simple, condensed, actions below, avatar, split buttons, and buttons below variants.
- Kept scope limited to the Notifications leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/notifications/`:
  - `tailwind-notifications-reference-desktop.png`
  - `local-notifications-desktop-before.png`
  - `local-notifications-mobile-before.png`
  - `local-notifications-desktop-after.png`
  - `local-notifications-interaction-after.png`
  - `local-notifications-all-dark-after.png`
  - `local-notifications-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-overlays-notifications` verified:
  - visible status count returned 6.
  - `aria-live=polite` count returned 6.
  - `aria-atomic=true` count returned 6.
  - dismiss feedback appeared and reduced live status count from 6 to 5.
  - show restored live status count to 6.
  - undo feedback appeared.
  - reply feedback appeared.
  - accept feedback appeared.
  - `Don't allow` feedback appeared and reduced live status count from 6 to 5.
  - all 6 `Dark` controls were exercised.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 84 - Slide-overs page parity pass

Scope:

- Tailwind Plus `Application UI / Overlays / Slide-overs` reference page.
- Local `plus-overlays-slide-overs` leaf and its 3 slide-over preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/overlays/slide-overs` currently returns 404.
- The 404 reference state is recorded in `capture-notes.json` and `tailwind-slide-overs-reference-desktop.png`.

Implementation:

- Replaced three repeated `slide-over-page` previews with dedicated variants:
  - `slide-over-side-sheet`
  - `slide-over-sidebar-dialog`
  - `slide-over-detail-row`
- Added `role=dialog` to open slide-over panels.
- Added `aria-modal=true` while panels are open.
- Added `aria-labelledby` and `aria-describedby` connections to panel titles and descriptions.
- Added focusable panel containers and Escape dismissal.
- Added close, reopen, save, edit, activity, and approval interactions.
- Added visible feedback for close, save, edit, activity selection, invoice approval, and Escape dismissal.
- Removed dialog role and modal ARIA from closed panels, with `aria-hidden` applied while closed.
- Kept scope limited to the Slide-overs leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/slide-overs/`:
  - `tailwind-slide-overs-reference-desktop.png`
  - `local-slide-overs-desktop-before.png`
  - `local-slide-overs-mobile-before.png`
  - `local-slide-overs-desktop-after.png`
  - `local-slide-overs-interaction-after.png`
  - `local-slide-overs-all-dark-after.png`
  - `local-slide-overs-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-overlays-slide-overs` verified:
  - open dialog count returned 3.
  - open `aria-modal=true` count returned 3.
  - open `aria-labelledby` count returned 3.
  - open `aria-describedby` count returned 3.
  - old duplicate `Record details` preview count returned 0.
  - close feedback appeared and reduced dialog role count from 3 to 2.
  - reopen restored dialog role count to 3.
  - customer edit feedback appeared.
  - activity selection feedback appeared.
  - invoice approval feedback appeared.
  - save feedback appeared and reduced dialog role count from 3 to 2.
  - Escape dismissal feedback appeared and reduced dialog role count from 3 to 2.
  - all 3 `Dark` controls were exercised.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 85 - Popovers page parity pass

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

## Step 86 - Stacked Layouts page parity pass

Scope:

- Tailwind Plus `Application UI / Application Shells / Stacked Layouts` reference page.
- Local `plus-application-shells-stacked-layouts` leaf and its 9 stacked shell preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/application-shells/stacked-layouts` currently returns 404.
- The 404 reference state is recorded in `capture-notes.json` and `tailwind-stacked-layouts-reference-desktop.png`.

Implementation:

- Added `nav aria-label="Primary navigation"` to stacked shell primary navs.
- Added active `aria-current=page` state to primary nav items.
- Added `nav aria-label="Secondary navigation"` and active `aria-current=page` state to the two-row variant.
- Added mobile menu buttons with `aria-expanded` and `aria-controls`.
- Added animated mobile navigation panels with `aria-hidden` while closed.
- Added user menu buttons with `aria-expanded` and `aria-controls`.
- Added open-only `role=menu` and `role=menuitem` for user menu content.
- Added notification, user menu, settings, and mobile nav feedback.
- Corrected the stacked shell's initial menu state so hidden mobile/user menus are not exposed as open.
- Kept scope limited to the Stacked Layouts leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/stacked-layouts/`:
  - `tailwind-stacked-layouts-reference-desktop.png`
  - `local-stacked-layouts-desktop-before.png`
  - `local-stacked-layouts-mobile-before.png`
  - `local-stacked-layouts-desktop-after.png`
  - `local-stacked-layouts-interaction-after.png`
  - `local-stacked-layouts-all-dark-after.png`
  - `local-stacked-layouts-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-shells-stacked-layouts` verified:
  - primary nav count returned 9.
  - initial `aria-current=page` count returned 19.
  - initial expanded button count returned 18.
  - initial expanded true count returned 0.
  - initial expanded false count returned 18.
  - initial user menu role count returned 0.
  - Team click feedback appeared and Team received current state.
  - user menu opened with one `role=menu`, then Settings closed it.
  - notification feedback appeared.
  - Activity tab feedback appeared and received current state.
  - all 9 `Dark` controls were exercised.
  - mobile menu opened with expanded true state.
  - mobile Team click feedback appeared and Team received current state.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 87 - Sidebar Layouts page parity pass

Scope:

- Tailwind Plus `Application UI / Application Shells / Sidebar Layouts` reference page.
- Local `plus-application-shells-sidebar-layouts` leaf and its 8 sidebar shell preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/application-shells/sidebar-layouts` currently returns 404.
- The 404 reference state is recorded in `capture-notes.json` and `tailwind-sidebar-layouts-reference-desktop.png`.

Implementation:

- Added `nav aria-label="Primary sidebar navigation"` to sidebar shell primary navs.
- Added active `aria-current=page` state to primary sidebar nav items.
- Added `nav aria-label="Team shortcuts"` for team lists.
- Converted team rows into clickable buttons with feedback.
- Converted the bottom profile row into a clickable button with feedback.
- Added Documents and Reports active-state support for sidebar shell variants.
- Preserved simple, dark, header, constrained, off-white, brand, and brand-header variants.
- Kept scope limited to the Sidebar Layouts leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/sidebar-layouts/`:
  - `tailwind-sidebar-layouts-reference-desktop.png`
  - `local-sidebar-layouts-desktop-before.png`
  - `local-sidebar-layouts-mobile-before.png`
  - `local-sidebar-layouts-desktop-after.png`
  - `local-sidebar-layouts-interaction-after.png`
  - `local-sidebar-layouts-all-dark-after.png`
  - `local-sidebar-layouts-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-shells-sidebar-layouts` verified:
  - primary sidebar nav count returned 8.
  - team shortcut nav count returned 8.
  - initial `aria-current=page` count returned 8.
  - team button count returned 24.
  - profile button count returned 8.
  - Documents feedback appeared and Documents received current state.
  - Heroicons team feedback appeared.
  - Tom Cook profile feedback appeared.
  - all 8 `Dark` controls were exercised.
  - mobile Reports feedback appeared and Reports received current state.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 88 - Multi-Column Layouts page parity pass

Scope:

- Tailwind Plus `Application UI / Application Shells / Multi-Column Layouts` reference page.
- Local `plus-application-shells-multi-column-layouts` leaf and its 6 multi-column shell preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/application-shells/multi-column-layouts` currently returns 404.
- The 404 reference state is recorded in `capture-notes.json` and `tailwind-multi-column-layouts-reference-desktop.png`.

Implementation:

- Added `nav aria-label="Primary multi-column navigation"` to multi-column primary navs.
- Added `nav aria-label="Header navigation"` to the header variant.
- Added active `aria-current=page` state to primary and header nav items.
- Added labelled selection and detail columns.
- Added `role=listbox`, `role=option`, and `aria-selected` state for the middle selection pane.
- Added clickable profile controls for wide and narrow variants.
- Added detail pane actions for Archive, Assign, and Reply.
- Added visible feedback for Reports, conversation selection, detail actions, and profile controls.
- Preserved full-width, secondary-right, constrained, sticky, narrow-sidebar, and narrow-sidebar-header variants.
- Kept scope limited to the Multi-Column Layouts leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/multi-column-layouts/`:
  - `tailwind-multi-column-layouts-reference-desktop.png`
  - `local-multi-column-layouts-desktop-before.png`
  - `local-multi-column-layouts-mobile-before.png`
  - `local-multi-column-layouts-desktop-after.png`
  - `local-multi-column-layouts-interaction-after.png`
  - `local-multi-column-layouts-all-dark-after.png`
  - `local-multi-column-layouts-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-shells-multi-column-layouts` verified:
  - primary multi-column nav count returned 5.
  - header nav count returned 1.
  - selection column count returned 6.
  - detail column count returned 6.
  - listbox count returned 6.
  - option count returned 18.
  - selected option count returned 6.
  - active `aria-current=page` count returned 5.
  - profile button count returned 6.
  - detail action button count returned 18.
  - Reports feedback appeared and Reports received current state.
  - Invoice thread feedback appeared and received selected state.
  - Assign action feedback appeared.
  - profile feedback appeared.
  - all 6 `Dark` controls were exercised.
  - mobile Launch checklist feedback appeared and received selected state.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 89 - Avatars page parity pass

Scope:

- Tailwind Plus `Application UI / Elements / Avatars` reference page.
- Local `plus-application-elements-avatars` leaf and its 11 avatar preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/elements/avatars` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Avatars - Official Tailwind UI Components`, h1 `Avatars`, and 28 detected example text nodes.

Implementation:

- Added accessible avatar buttons for circular, rounded, notification, group, placeholder, and with-text avatar examples.
- Added `aria-pressed` selected state for avatar and placeholder selections.
- Added visible feedback for avatar selection, placeholder selection, and View profile.
- Added `role=status` notification dots with `busy`, `online`, and `offline` labels.
- Added hover, focus, press, and selected-ring motion states.
- Added z-index handling for overlapped grouped avatars so visible group targets remain clickable.
- Fixed Avatars theme handling so the preview `Dark` and `Light` controls update avatar surfaces while preserving default dark examples.
- Kept scope limited to the Avatars leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/avatars/`:
  - `tailwind-avatars-reference-desktop.png`
  - `local-avatars-desktop-before.png`
  - `local-avatars-mobile-before.png`
  - `local-avatars-desktop-after.png`
  - `local-avatars-interaction-after.png`
  - `local-avatars-all-dark-after.png`
  - `local-avatars-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-elements-avatars` verified:
  - avatar button count returned 61.
  - placeholder avatar button count returned 10.
  - status count returned 20.
  - busy/online/offline status labels returned 8/8/4.
  - View profile count returned 1.
  - Tom Cook avatar feedback appeared.
  - TW avatar 3 selection feedback appeared and received pressed state.
  - View profile feedback appeared.
  - all 11 `Dark` controls were exercised and all 11 avatar surfaces switched to dark styling.
  - mobile Tom Cook feedback appeared.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 90 - Badges page parity pass

Scope:

- Tailwind Plus `Application UI / Elements / Badges` reference page.
- Local `plus-application-elements-badges` leaf and its 16 badge preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/elements/badges` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Badges - Official Tailwind UI Components`, h1 `Badges`, and 28 detected example text nodes.

Implementation:

- Converted rendered badge examples from static labels into selectable controls.
- Added `aria-pressed` selected state for every badge label.
- Added visible selection feedback and hover, focus, press, and selected-ring motion states.
- Added real remove buttons for the remove variants with `Remove {label} badge` accessible names.
- Added Restore badges recovery when a badge is removed.
- Added dark-aware badge tone classes and dark surface switching through the preview `Dark` and `Light` controls.
- Kept scope limited to the Badges leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/badges/`:
  - `tailwind-badges-reference-desktop.png`
  - `local-badges-desktop-before.png`
  - `local-badges-mobile-before.png`
  - `local-badges-desktop-after.png`
  - `local-badges-interaction-after.png`
  - `local-badges-all-dark-after.png`
  - `local-badges-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-elements-badges` verified:
  - badge button count returned 128.
  - remove button count returned 16.
  - dark toggle count returned 16.
  - Green badge selection feedback appeared and received pressed state.
  - Red badge removal feedback appeared and remove button count dropped to 15.
  - Restore badges feedback appeared and remove button count returned to 16.
  - all 16 `Dark` controls were exercised and all 16 badge surfaces switched to dark styling.
  - mobile Blue badge feedback appeared.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 91 - Buttons page parity pass

Scope:

- Tailwind Plus `Application UI / Elements / Buttons` reference page.
- Local `plus-application-elements-buttons` leaf and its 8 button preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/elements/buttons` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Buttons - Official Tailwind UI Components`, h1 `Buttons`, and 21 detected example text nodes.

Implementation:

- Added accessible labels for each rendered size and circular button.
- Added `aria-pressed` selected state for each button example.
- Added selected-ring styling that works on light and dark surfaces.
- Added visible feedback for size and circular button actions.
- Added hover, focus, press, and selected motion states.
- Fixed Buttons theme handling so the preview `Dark` and `Light` controls update all button surfaces while preserving default dark examples.
- Kept scope limited to the Buttons leaf. Button Groups remain a separate leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/buttons/`:
  - `tailwind-buttons-reference-desktop.png`
  - `local-buttons-desktop-before.png`
  - `local-buttons-mobile-before.png`
  - `local-buttons-desktop-after.png`
  - `local-buttons-interaction-after.png`
  - `local-buttons-all-dark-after.png`
  - `local-buttons-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-elements-buttons` verified:
  - action button count returned 38.
  - dark toggle count returned 8.
  - Button size 3 feedback appeared.
  - Circular button 2 feedback appeared and received pressed state.
  - all 8 `Dark` controls were exercised and all 8 button surfaces switched to dark styling.
  - mobile Button size 2 feedback appeared.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 92 - Button Groups page parity pass

Scope:

- Tailwind Plus `Application UI / Elements / Button Groups` reference page.
- Local `plus-application-elements-button-groups` leaf and its 5 button group preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/elements/button-groups` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Button Groups - Official Tailwind UI Components`, h1 `Button Groups`, and 16 detected example text nodes.

Implementation:

- Added `aria-pressed` selected state to basic, icon-only, stat, save, and unread group buttons.
- Added visible selected styling and hover/press motion to group segments.
- Added theme-aware dark surfaces through the preview `Dark` and `Light` controls.
- Converted the save dropdown into an interactive menu with `aria-expanded`, `aria-controls`, open-only `role=menu`, and `role=menuitem` actions.
- Converted the unread checkbox dropdown into a real `role=checkbox` control with `aria-checked`, an unread segment, and an interactive menu.
- Split dropdown open state by rendered example so save and unread menus do not open together.
- Kept scope limited to the Button Groups leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/button-groups/`:
  - `tailwind-button-groups-reference-desktop.png`
  - `local-button-groups-desktop-before.png`
  - `local-button-groups-mobile-before.png`
  - `local-button-groups-desktop-after.png`
  - `local-button-groups-interaction-after.png`
  - `local-button-groups-menu-after.png`
  - `local-button-groups-all-dark-after.png`
  - `local-button-groups-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-elements-button-groups` verified:
  - pressed-capable button count returned 10.
  - expandable button count returned 2.
  - checkbox count returned 1.
  - Months, Next group, Unread messages selection states appeared.
  - unread checkbox switched to `aria-checked=true`.
  - save menu opened with one visible `role=menu` and six menuitems in the DOM.
  - closed menu state returned 0 open menus and 0 expanded controls after menuitem selection.
  - all 5 `Dark` controls were exercised and all 5 group surfaces switched to dark styling.
  - mobile Days feedback appeared.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 93 - Dropdowns page parity pass

Scope:

- Tailwind Plus `Application UI / Elements / Dropdowns` reference page.
- Local `plus-application-elements-dropdowns` leaf and its 5 dropdown preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/elements/dropdowns` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Dropdowns - Official Tailwind UI Components`, h1 `Dropdowns`, and 9 detected example text nodes.

Implementation:

- Changed dropdown examples to start closed instead of all open.
- Added per-example dropdown open state so one trigger does not open every rendered dropdown.
- Added `aria-expanded` and `aria-controls` to triggers.
- Added an accessible name to the minimal icon dropdown trigger.
- Added open-only `role=menu` containers and `role=menuitem` actions.
- Closed dropdown menus after selecting a menu item.
- Fixed the divider dropdown content bug so the divider variant uses its divider item set regardless of visual theme.
- Added theme-aware dropdown surfaces through the preview `Dark` and `Light` controls.
- Kept scope limited to the Dropdowns leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/dropdowns/`:
  - `tailwind-dropdowns-reference-desktop.png`
  - `local-dropdowns-desktop-before.png`
  - `local-dropdowns-mobile-before.png`
  - `local-dropdowns-desktop-after.png`
  - `local-dropdowns-menu-after.png`
  - `local-dropdowns-interaction-after.png`
  - `local-dropdowns-all-dark-after.png`
  - `local-dropdowns-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-elements-dropdowns` verified:
  - trigger count returned 5.
  - minimal icon trigger accessible name count returned 1.
  - initial open trigger count and menu count returned 0.
  - simple dropdown opened with 1 open trigger and 1 role menu.
  - Support selection closed the menu and showed feedback.
  - divider dropdown Archive selection showed feedback.
  - minimal dropdown Sign out selection showed feedback.
  - all 5 `Dark` controls were exercised and all 5 dropdown surfaces switched to dark styling.
  - mobile dropdown opened with 1 open trigger and 1 role menu.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 94 - Select Menus page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Select Menus` reference page.
- Local `plus-forms-select-menus` leaf and its 7 select menu preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/elements/select-menus` returned 404 because Select Menus belongs under Forms, not Elements.
- Corrected reference URL `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/select-menus` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Select Menus - Official Tailwind UI Components`, h1 `Select Menus`, and 5 detected example text nodes.

Implementation:

- Added per-example open state so one custom select does not open every rendered select menu.
- Added `role=combobox`, `aria-expanded`, `aria-haspopup=listbox`, and `aria-controls` to custom select triggers.
- Added open-only `role=listbox` containers.
- Added `role=option` and `aria-selected` to person and status options.
- Closed custom menus after selecting a person or status option.
- Preserved the native select path and verified native option selection.
- Kept scope limited to the Select Menus leaf under Forms.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/select-menus/`:
  - `tailwind-select-menus-reference-desktop.png`
  - `local-select-menus-desktop-before.png`
  - `local-select-menus-mobile-before.png`
  - `local-select-menus-desktop-after.png`
  - `local-select-menus-menu-after.png`
  - `local-select-menus-interaction-after.png`
  - `local-select-menus-all-dark-after.png`
  - `local-select-menus-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-select-menus` verified:
  - custom combobox count returned 6.
  - native select count returned 2.
  - initial expanded combobox and listbox counts returned 0.
  - avatar select opened with 1 expanded combobox, 1 listbox, and option semantics.
  - Wade Cooper selection closed the menu and showed feedback.
  - native Location selection changed to Mexico and showed feedback.
  - Away status selection closed the menu and showed feedback.
  - all 7 `Dark` controls were exercised and dark surfaces switched.
  - mobile select opened with 1 expanded combobox and 1 listbox.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 95 - Comboboxes page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Comboboxes` reference page.
- Local `plus-forms-comboboxes` leaf and its 4 combobox preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/comboboxes` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Comboboxes - Official Tailwind UI Components`, h1 `Comboboxes`, and 4 detected example text nodes.

Implementation:

- Added dedicated per-example query state for combobox inputs.
- Added dedicated combobox open state instead of overloading shared catalog tab state.
- Preserved `role=combobox`, `aria-autocomplete=list`, `aria-expanded`, `aria-controls`, and `aria-activedescendant` on open inputs.
- Changed listbox and option semantics to open-only, preventing closed examples from exposing stale roles.
- Added stable filtering per example.
- Added Enter key selection of the current filtered option.
- Kept option click selection, no-results empty state, visible feedback, and dark-aware surfaces.
- Kept scope limited to the Comboboxes leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/comboboxes/`:
  - `tailwind-comboboxes-reference-desktop.png`
  - `local-comboboxes-desktop-before.png`
  - `local-comboboxes-mobile-before.png`
  - `local-comboboxes-desktop-after.png`
  - `local-comboboxes-filter-after.png`
  - `local-comboboxes-interaction-after.png`
  - `local-comboboxes-all-dark-after.png`
  - `local-comboboxes-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-comboboxes` verified:
  - combobox input count returned 4.
  - initial expanded combobox, listbox, and option counts returned 0.
  - filtering `tom` opened 1 listbox with 1 Tom Cook option.
  - Enter selected Tom Cook, closed the list, and showed feedback.
  - filtering `lind` and clicking Lindsay Walton selected her and showed feedback.
  - filtering `zzzz` showed the empty no-results state with 1 open listbox and 0 options.
  - all 4 `Dark` controls were exercised and all 4 surfaces switched to dark styling.
  - mobile filtering `dries` opened 1 listbox with 1 Dries Vincent option.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 96 - Input Groups page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Input Groups` reference page.
- Local `plus-forms-input-groups` leaf and its 21 input group preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/input-groups` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Input Groups - Official Tailwind UI Components`, h1 `Input Groups`, and 48 detected example text nodes.

Implementation:

- Added per-variant controlled value state for input group fields.
- Fixed a smoke-discovered bug where uncontrolled `defaultValue` fields reset after feedback state caused a preview rerender.
- Preserved disabled input behavior.
- Preserved attached button actions for currency, country-code, sort, billing country, and keyboard shortcut controls.
- Kept dark-aware surfaces through the preview `Dark` and `Light` controls.
- Kept scope limited to the Input Groups leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/input-groups/`:
  - `tailwind-input-groups-reference-desktop.png`
  - `local-input-groups-desktop-before.png`
  - `local-input-groups-mobile-before.png`
  - `local-input-groups-desktop-after.png`
  - `local-input-groups-interaction-after.png`
  - `local-input-groups-all-dark-after.png`
  - `local-input-groups-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-input-groups` verified:
  - input count returned 25.
  - labelled input count returned 25.
  - disabled input count returned 1.
  - Email value persisted as `qa@example.com`.
  - Price value persisted as `$ 19.00`.
  - Currency, Sort, and Billing country actions showed feedback.
  - Card number value persisted as `5555 5555 5555 4444`.
  - Bottom border name value persisted as `Alex Morgan`.
  - Keyboard shortcut action showed feedback.
  - all 21 `Dark` controls were exercised and all 21 surfaces switched to dark styling.
  - mobile Email edit persisted and showed feedback.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 97 - Textareas page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Textareas` reference page.
- Local `plus-forms-textareas` leaf and its 5 textarea preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/textareas` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Textareas - Official Tailwind UI Components`, h1 `Textareas`, and the five examples `Simple`, `With avatar and actions`, `With underline and actions`, `With title and pill actions`, and `With preview button`.
- In-app Browser setup failed with `Browser is not available: iab`; standalone Playwright fallback was used.

Implementation:

- Added `aria-pressed` to the shared `PreviewThemeToggle` buttons so System, Light, and Dark controls expose selected state during smoke verification.
- Added per-variant controlled draft state for the Textareas title-and-pill composer title and description fields.
- Fixed a smoke-discovered bug where the title-and-pill composer description reset after Assign/Create feedback rerenders.
- Kept the five Textareas examples aligned with the Tailwind reference structure: simple textarea, avatar composer, underline composer, dark title/pill composer, and preview-tab writer.
- Kept scope limited to the Textareas leaf plus the shared preview theme toggle accessibility state.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/textareas/`:
  - `tailwind-textareas-reference-desktop.png`
  - `local-textareas-desktop-before.png`
  - `local-textareas-mobile-before.png`
  - `local-textareas-desktop-after.png`
  - `local-textareas-interaction-after.png`
  - `local-textareas-all-dark-after.png`
  - `local-textareas-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-textareas` verified:
  - textarea count returned 5.
  - labelled textarea count returned 5.
  - theme button count returned 15.
  - dark button count returned 5.
  - active System count returned 5 before theme changes.
  - avatar composer value persisted as `Avatar composer note`.
  - underline composer value persisted as `Underline composer note`.
  - title value persisted as `Launch task`.
  - title-and-pill description value persisted as `Dark card task description`.
  - preview-tab writer rendered `Preview composer note` in Preview mode.
  - Attach file feedback and Create feedback appeared.
  - all 5 `Dark` controls were exercised and all 5 exposed `aria-pressed=true`.
  - mobile composer edit persisted and showed posted feedback.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 98 - Radio Groups page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Radio Groups` reference page.
- Local `plus-forms-radio-groups` leaf and its 12 radio group preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/radio-groups` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Radio Groups - Official Tailwind UI Components`, h1 `Radio Groups`, and 72 detected `input[type="radio"]` controls.
- Reference examples include `Simple list`, `Simple inline list`, `List with description`, `List with inline description`, `List with radio on right`, `Simple list with radio on right`, `Simple table`, `List with descriptions in panel`, `Color picker`, `Cards`, `Small cards`, and `Stacked cards`.
- In-app Browser setup failed with `Browser is not available: iab`; standalone Playwright fallback was used.

Implementation:

- Added per-variant radio selection state for the local Radio Groups preview renderer.
- Added per-variant radio feedback state so each example shows its own selection result.
- Fixed a smoke-discovered bug where all 12 examples shared one `selectedRadio` state and one example selection could affect other examples.
- Preserved role-based radio semantics with `role="radiogroup"`, `role="radio"`, and `aria-checked`.
- Kept scope limited to the Radio Groups leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/radio-groups/`:
  - `tailwind-radio-groups-reference-desktop.png`
  - `local-radio-groups-desktop-before.png`
  - `local-radio-groups-mobile-before.png`
  - `local-radio-groups-desktop-after.png`
  - `local-radio-groups-interaction-after.png`
  - `local-radio-groups-all-dark-after.png`
  - `local-radio-groups-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-radio-groups` verified:
  - radio role count returned 39.
  - radiogroup count returned 12.
  - checked radio count returned exactly 12 before and after interaction.
  - theme button count returned 36.
  - dark button count returned 12.
  - active System count returned 12 before theme changes.
  - group 0 selected `Startup`.
  - group 1 selected `Enterprise`.
  - group 8 selected `Rose color`.
  - group 9 selected `Enterprise`.
  - group 11 selected `Startup`.
  - untouched group 2 stayed `Business`, proving selections are per-example.
  - scoped feedback appeared for Startup, Enterprise, and Rose.
  - all 12 `Dark` controls were exercised and all 12 exposed `aria-pressed=true`.
  - mobile group 0 selected `Enterprise` and showed feedback.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 99 - Checkboxes page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Checkboxes` reference page.
- Local `plus-forms-checkboxes` leaf and its 4 checkbox preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/checkboxes` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Checkboxes - Official Tailwind UI Components`, h1 `Checkboxes`, and the four examples `List with description`, `List with inline description`, `List with checkbox on right`, and `Simple list with heading`.
- In-app Browser setup failed with `Browser is not available: iab`; standalone Playwright fallback was used.

Implementation:

- Added per-variant checkbox selection state for the local Checkboxes preview renderer.
- Added per-variant checkbox feedback state so each example shows its own selection result.
- Fixed a smoke-discovered bug where all 4 examples shared `checkedOptions` and `postedComment` state.
- Changed the inline-description example default checked item to `New comments` so it matches the Tailwind reference pattern.
- Preserved role-based checkbox semantics with `role="group"`, `role="checkbox"`, and `aria-checked`.
- Kept scope limited to the Checkboxes leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/checkboxes/`:
  - `tailwind-checkboxes-reference-desktop.png`
  - `local-checkboxes-desktop-before.png`
  - `local-checkboxes-mobile-before.png`
  - `local-checkboxes-shared-state-before-fix.png`
  - `local-checkboxes-desktop-after.png`
  - `local-checkboxes-interaction-after.png`
  - `local-checkboxes-all-dark-after.png`
  - `local-checkboxes-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-checkboxes` verified:
  - checkbox role count returned 12.
  - group count returned 4.
  - default checked count returned 4.
  - group 0 defaulted to `Comments`.
  - group 1 defaulted to `New comments`.
  - group 2 defaulted to `Comments`.
  - group 3 defaulted to `Comments`.
  - after interaction, checked count returned 8.
  - group 0 selected `Candidates`.
  - group 1 selected `New candidates`.
  - group 2 selected `Offers` while keeping `Comments`.
  - group 3 selected `Candidates`.
  - scoped feedback appeared for Candidates, New candidates, and Offers.
  - all 4 `Dark` controls were exercised and all 4 exposed `aria-pressed=true`.
  - mobile group 0 selected `Offers` and showed feedback.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 100 - Toggles page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Toggles` reference page.
- Local `plus-forms-toggles` leaf and its 5 toggle preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/toggles` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Toggles - Official Tailwind UI Components`, h1 `Toggles`, and the five examples `Simple toggle`, `Short toggle`, `Toggle with icon`, `With left label and description`, and `With right label`.
- In-app Browser setup failed with `Browser is not available: iab`; standalone Playwright fallback was used.

Implementation:

- Preserved the existing per-variant `toggleStates` switch state.
- Added per-variant toggle feedback state so each example shows only its own enabled/disabled result.
- Fixed the remaining shared feedback path where all toggle examples could display the last global `postedComment`.
- Preserved role-based switch semantics with `role="switch"` and `aria-checked`.
- Kept scope limited to the Toggles leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/toggles/`:
  - `tailwind-toggles-reference-desktop.png`
  - `local-toggles-desktop-before.png`
  - `local-toggles-mobile-before.png`
  - `local-toggles-desktop-after.png`
  - `local-toggles-interaction-after.png`
  - `local-toggles-all-dark-after.png`
  - `local-toggles-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-toggles` verified:
  - switch role count returned 5.
  - initial checked count returned 0.
  - switch labels returned `Simple toggle`, `Short toggle`, `Icon toggle`, `Available to hire`, and `Annual billing`.
  - after interaction, checked count returned 5.
  - all five switch labels were checked.
  - scoped feedback appeared for Simple toggle, Short toggle, Icon toggle, Available to hire, and Annual billing.
  - all 5 `Dark` controls were exercised and all 5 exposed `aria-pressed=true`.
  - mobile first switch toggled on and showed feedback.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 101 - Action Panels page parity pass

Scope:

- Tailwind Plus `Application UI / Forms / Action Panels` reference page.
- Local `plus-forms-action-panels` leaf and its 8 action panel preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/action-panels` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Action Panels - Official Tailwind UI Components`, h1 `Action Panels`, and the eight examples `Simple`, `With link`, `With button on right`, `With button at top right`, `With toggle`, `With input`, `Simple well`, and `With well`.
- In-app Browser setup failed with `Browser is not available: iab`; standalone Playwright fallback was used.

Implementation:

- Added per-variant action panel feedback state.
- Added per-variant action panel input state for the invite email field.
- Fixed shared `postedComment` and `commentText` behavior across action panel examples.
- Added missing feedback rendering for the `With button on right` panel.
- Preserved switch semantics for the toggle panel with `role="switch"` and `aria-checked`.
- Kept scope limited to the Action Panels leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/action-panels/`:
  - `tailwind-action-panels-reference-desktop.png`
  - `local-action-panels-desktop-before.png`
  - `local-action-panels-mobile-before.png`
  - `local-action-panels-desktop-after.png`
  - `local-action-panels-interaction-after.png`
  - `local-action-panels-all-dark-after.png`
  - `local-action-panels-mobile-after.png`
  - `capture-notes.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-forms-action-panels` verified:
  - button count returned 120.
  - input count returned 1.
  - switch role count returned 1.
  - initial checked switch count returned 0.
  - theme button count returned 24.
  - dark button count returned 8.
  - active System count returned 8 before theme changes.
  - Change plan feedback appeared in 4 interacted panels.
  - CI link feedback appeared.
  - hiring availability switch toggled on and showed feedback.
  - invite input value persisted as `teammate@example.com`.
  - invite action showed `Invite sent to teammate@example.com`.
  - all 8 `Dark` controls were exercised and all 8 exposed `aria-pressed=true`.
  - mobile hiring switch toggled on and showed feedback.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 102 - Containers page parity pass

Scope:

- Tailwind Plus `Application UI / Layout / Containers` reference page.
- Local `plus-application-layout-containers` leaf and its 5 container preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/layout/containers` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Containers - Official Tailwind UI Components`, h1 `Containers`, and the five examples `Full-width on mobile, constrained with padded content above`, `Constrained with padded content`, `Full-width on mobile, constrained to breakpoint with padded content above mobile`, `Constrained to breakpoint with padded content`, and `Narrow constrained with padded content`.
- In-app Browser setup failed with `Browser is not available: iab`; standalone Playwright fallback was used.

Implementation:

- Fixed a smoke-discovered theme-control bug in the container preview renderer.
- The renderer previously ignored the resolved preview `theme`, so all five `Dark` controls became pressed without changing the container surfaces.
- Containers now respect `theme="dark"` and `theme="light"` while preserving the existing default dark system variant.
- Kept scope limited to the Containers leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/containers/`:
  - `tailwind-containers-reference-desktop.png`
  - `local-containers-desktop-before.png`
  - `local-containers-mobile-before.png`
  - `local-containers-all-dark-before-fix.png`
  - `local-containers-desktop-after.png`
  - `local-containers-all-dark-after.png`
  - `local-containers-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-layout-containers` verified:
  - theme button count returned 15.
  - dark button count returned 5.
  - active System count returned 5 before theme changes.
  - before-fix dark surface count stayed 2 after all Dark controls, proving the bug.
  - after fix, all 5 `Dark` controls were exercised and all 5 exposed `aria-pressed=true`.
  - dark surface count increased from 1 to 6 after Dark.
  - all 5 `Light` controls were exercised and dark surface count returned to 1.
  - mobile render included the first container example.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 103 - Cards page parity pass

Scope:

- Tailwind Plus `Application UI / Layout / Cards` reference page.
- Local `plus-application-layout-cards` leaf and its 10 card preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/layout/cards` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Cards - Official Tailwind UI Components`, h1 `Cards`, and the ten examples `Basic card`, `Card, edge-to-edge on mobile`, `Card with header`, `Card with footer`, `Card with header and footer`, `Card with gray footer`, `Card with gray body`, `Well`, `Well on gray`, and `Well, edge-to-edge on mobile`.
- In-app Browser setup failed with `Browser is not available: iab`; standalone Playwright fallback was used.

Implementation:

- Fixed a smoke-discovered theme-control bug in the card preview renderer.
- The renderer previously ignored the resolved preview `theme`, so all ten `Dark` controls became pressed without changing the card surfaces.
- Cards now respect `theme="dark"` and `theme="light"` while preserving the existing default dark system variants.
- Kept scope limited to the Cards leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/cards/`:
  - `tailwind-cards-reference-desktop.png`
  - `local-cards-desktop-before.png`
  - `local-cards-mobile-before.png`
  - `local-cards-all-dark-before-fix.png`
  - `local-cards-desktop-after.png`
  - `local-cards-all-dark-after.png`
  - `local-cards-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-layout-cards` verified:
  - page heading count returned 1.
  - example heading count returned 10.
  - theme button count returned 30.
  - dark button count returned 10.
  - active System count returned 10 before theme changes.
  - before-fix dark surface count stayed 9 after all Dark controls, proving the bug.
  - after fix, all 10 `Dark` controls were exercised and all 10 exposed `aria-pressed=true`.
  - dark surface count increased from 1 to 27 after Dark.
  - all 10 `Light` controls were exercised and dark surface count returned to 1.
  - mobile render kept 30 theme controls available.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 104 - List containers page parity pass

Scope:

- Tailwind Plus `Application UI / Layout / List containers` reference page.
- Local `plus-application-layout-list-containers` leaf and its 7 list-container preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/layout/list-containers` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS List containers - Official Tailwind UI Components`, h1 `List containers`, and the seven examples `Simple with dividers`, `Card with dividers`, `Card with dividers, full-width on mobile`, `Separate cards`, `Separate cards, full-width on mobile`, `Flat card with dividers`, and `Simple with dividers, full-width on mobile`.
- In-app Browser setup failed with `Browser is not available: iab`; standalone Playwright fallback was used.

Implementation:

- Fixed a smoke-discovered theme-control bug in the list-container preview renderer.
- The renderer previously ignored the resolved preview `theme`, so all seven `Dark` controls became pressed without changing the preview surfaces.
- List containers now respect `theme="dark"` and `theme="light"` while preserving the existing default dark system variants.
- Row skeletons now render dark-aware borders and backgrounds, including separate-card rows.
- Kept scope limited to the List containers leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/list-containers/`:
  - `tailwind-list-containers-reference-desktop.png`
  - `local-list-containers-desktop-before.png`
  - `local-list-containers-mobile-before.png`
  - `local-list-containers-all-dark-before-fix.png`
  - `local-list-containers-desktop-after.png`
  - `local-list-containers-all-dark-after.png`
  - `local-list-containers-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-layout-list-containers` verified:
  - page heading count returned 1.
  - example heading count returned 7.
  - theme button count returned 21.
  - dark button count returned 7.
  - active System count returned 7 before theme changes.
  - before-fix dark surface count stayed 7 after all Dark controls, proving the bug.
  - after fix, all 7 `Dark` controls were exercised and all 7 exposed `aria-pressed=true`.
  - dark surface count increased from 1 to 26 after Dark.
  - dark row count increased from 0 to 30 after Dark.
  - all 7 `Light` controls were exercised and dark counts returned to the system-default baseline.
  - mobile render kept 21 theme controls available.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 105 - Media Objects page parity pass

Scope:

- Tailwind Plus `Application UI / Layout / Media Objects` reference page.
- Local `plus-application-layout-media-objects` leaf and its 8 media-object preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/layout/media-objects` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Media Objects - Official Tailwind UI Components`, h1 `Media Objects`, and the eight examples `Basic`, `Aligned to center`, `Aligned to bottom`, `Stretched to fit`, `Media on right`, `Basic responsive`, `Wide responsive`, and `Nested`.
- In-app Browser setup failed with `Browser is not available: iab`; standalone Playwright fallback was used.

Implementation:

- Fixed a smoke-discovered theme-control bug in the media-object preview renderer.
- The renderer previously ignored the resolved preview `theme`, so all eight `Dark` controls became pressed without changing the preview surfaces or text.
- Media Objects now respect `theme="dark"` and `theme="light"` while preserving the existing default dark system variants.
- Kept scope limited to the Media Objects leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/media-objects/`:
  - `tailwind-media-objects-reference-desktop.png`
  - `local-media-objects-desktop-before.png`
  - `local-media-objects-mobile-before.png`
  - `local-media-objects-all-dark-before-fix.png`
  - `local-media-objects-desktop-after.png`
  - `local-media-objects-all-dark-after.png`
  - `local-media-objects-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-layout-media-objects` verified:
  - page heading count returned 1.
  - example heading count returned 8.
  - theme button count returned 24.
  - dark button count returned 8.
  - active System count returned 8 before theme changes.
  - before-fix dark surface count stayed 9 and dark text count stayed 12 after all Dark controls, proving the bug.
  - after fix, all 8 `Dark` controls were exercised and all 8 exposed `aria-pressed=true`.
  - dark surface count increased from 1 to 19 after Dark.
  - dark text count increased from 2 to 22 after Dark.
  - all 8 `Light` controls were exercised and dark counts returned to the system-default baseline.
  - mobile render kept 24 theme controls available.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 106 - Dividers page parity pass

Scope:

- Tailwind Plus `Application UI / Layout / Dividers` reference page.
- Local `plus-application-layout-dividers` leaf and its 8 divider preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/layout/dividers` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Dividers - Official Tailwind UI Components`, h1 `Dividers`, and the eight examples `With label`, `With icon`, `With label on left`, `With title`, `With title on left`, `With button`, `With title and button`, and `With toolbar`.
- In-app Browser setup failed with `Browser is not available: iab`; standalone Playwright fallback was used.

Implementation:

- Fixed a smoke-discovered theme-control bug in the divider preview renderer.
- The renderer previously ignored the resolved preview `theme`, so all eight `Dark` controls became pressed without changing the preview surfaces.
- Dividers now respect `theme="dark"` and `theme="light"` while preserving the existing default dark system variants.
- Converted divider button and toolbar controls from static spans into real buttons.
- Added hover, press motion, dark-aware toolbar styling, and visible feedback for divider action clicks.
- Kept scope limited to the Dividers leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/dividers/`:
  - `tailwind-dividers-reference-desktop.png`
  - `local-dividers-desktop-before.png`
  - `local-dividers-mobile-before.png`
  - `local-dividers-all-dark-before-fix.png`
  - `local-dividers-desktop-after.png`
  - `local-dividers-interaction-after.png`
  - `local-dividers-all-dark-after.png`
  - `local-dividers-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-layout-dividers` verified:
  - page heading count returned 1.
  - example heading count returned 8.
  - theme button count returned 24.
  - dark button count returned 8.
  - divider action button count returned 6.
  - active System count returned 8 before theme changes.
  - before-fix dark surface count stayed 5 after all Dark controls, proving the bug.
  - button action click produced `Divider action selected`.
  - toolbar `Copy` action produced `Copy selected`.
  - after fix, all 8 `Dark` controls were exercised and all 8 exposed `aria-pressed=true`.
  - dark surface count increased from 1 to 19 after Dark.
  - all 8 `Light` controls were exercised and dark counts returned to the system-default baseline.
  - mobile render kept 24 theme controls available.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 107 - Home Screens page parity pass

Scope:

- Tailwind Plus `Application UI / Page Examples / Home Screens` reference page.
- Local `plus-application-page-examples-home-screens` leaf and its 2 home-screen preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/home-screens` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Home Screens - Official Tailwind UI Components`, h1 `Home Screens`, and the two examples `Sidebar` and `Stacked`.
- In-app Browser setup failed with `Browser is not available: iab`; standalone Playwright fallback was used.

Implementation:

- Fixed a smoke-discovered theme-control bug in the sidebar home-screen preview.
- The sidebar home-screen previously ignored the resolved preview `theme`, so both `Light` controls became pressed while the sidebar preview stayed dark.
- The sidebar home-screen now respects `theme="dark"` and `theme="light"` while preserving the existing default system dark presentation.
- Retained the existing stateful interactions for sidebar and stacked home-screen examples.
- Kept scope limited to the Home Screens leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/home-screens/`:
  - `tailwind-home-screens-reference-desktop.png`
  - `local-home-screens-desktop-before.png`
  - `local-home-screens-mobile-before.png`
  - `local-home-screens-all-dark-before-fix.png`
  - `local-home-screens-desktop-after.png`
  - `local-home-screens-interaction-after.png`
  - `local-home-screens-interaction-after-fix.png`
  - `local-home-screens-all-dark-after.png`
  - `local-home-screens-all-light-after.png`
  - `local-home-screens-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-page-examples-home-screens` verified:
  - page heading count returned 1.
  - example heading count returned 2.
  - theme button count returned 6.
  - dark button count returned 2.
  - action button count returned 123.
  - active System count returned 2 before theme changes.
  - search feedback appeared.
  - deployment selection feedback appeared.
  - activity feed feedback appeared.
  - new invoice feedback appeared.
  - metric selection feedback appeared.
  - client selection feedback appeared.
  - after fix, all 2 `Dark` controls were exercised and all 2 exposed `aria-pressed=true`.
  - dark surface count increased from 2 to 30 after Dark.
  - all 2 `Light` controls were exercised and dark surface count returned to 2.
  - mobile render kept 6 theme controls available.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 108 - Detail Screens page parity pass

Scope:

- Tailwind Plus `Application UI / Page Examples / Detail Screens` reference page.
- Local `plus-application-page-examples-detail-screens` leaf and its 2 detail-screen preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/detail-screens` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Detail Screens - Official Tailwind UI Components`, h1 `Detail Screens`, and the two examples `Sidebar` and `Stacked`.
- Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue; standalone Playwright fallback was used.

Implementation:

- Fixed a smoke-discovered theme-control bug in the Detail Screens renderer.
- Before the fix, both `Light` controls became pressed while the sidebar detail preview stayed dark because the renderer ignored the resolved preview `theme`.
- Added resolved-theme handling for the detail-screen block, preserving the sidebar example's default system dark presentation while making `theme="light"` and `theme="dark"` explicit.
- Upgraded both `Sidebar` and `Stacked` detail previews so outer shells, cards, borders, text, hover states, selected rows, and feedback surfaces respond to the preview theme.
- Retained and verified the existing stateful interactions for tab selection, metric selection, deployment row selection, invoice send, invoice line selection, receipt download, and comment editor opening.
- Kept scope limited to the Detail Screens leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/detail-screens/`:
  - `tailwind-detail-screens-reference-desktop.png`
  - `local-detail-screens-desktop-before.png`
  - `local-detail-screens-mobile-before.png`
  - `local-detail-screens-interaction-before-fix.png`
  - `local-detail-screens-all-dark-before-fix.png`
  - `local-detail-screens-all-light-before-fix.png`
  - `local-detail-screens-desktop-after.png`
  - `local-detail-screens-interaction-after-fix.png`
  - `local-detail-screens-all-dark-after.png`
  - `local-detail-screens-all-light-after.png`
  - `local-detail-screens-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-page-examples-detail-screens` verified:
  - page heading count returned 1.
  - example heading count returned 2.
  - theme button count returned 6.
  - dark button count returned 2.
  - action button count returned 121.
  - active System count returned 2 before theme changes.
  - before fix, dark surface count stayed 41 after pressing all `Light` controls, proving the theme bug.
  - tab feedback appeared for `Activity tab selected`.
  - metric feedback appeared for `Success rate metric selected`.
  - deployment row feedback appeared for `249df666 deployment selected`.
  - invoice action feedback appeared for `Invoice sent`.
  - invoice line feedback appeared for `Logo redesign line selected`.
  - receipt feedback appeared for `Receipt downloaded`.
  - comment feedback appeared for `Comment editor opened`.
  - after fix, all 2 `Dark` controls were exercised and all 2 exposed `aria-pressed=true`.
  - dark surface count increased from 2 to 50 after Dark.
  - dark card count increased to 7 after Dark.
  - all 2 `Light` controls were exercised and dark surface count returned to 2.
  - mobile render kept 6 theme controls available.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 109 - Settings Screens page parity pass

Scope:

- Tailwind Plus `Application UI / Page Examples / Settings Screens` reference page.
- Local `plus-application-page-examples-settings-screens` leaf and its 2 settings-screen preview variants.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/settings-screens` returned 200.
- Tailwind page metadata recorded title `Tailwind CSS Settings Screens - Official Tailwind UI Components`, h1 `Settings Screens`, and the two examples `Sidebar` and `Stacked`.
- Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue; standalone Playwright fallback was used.

Implementation:

- Fixed a smoke-discovered theme-control bug in the Settings Screens renderer.
- Before the fix, both `Light` controls became pressed while the sidebar settings preview stayed dark because the renderer ignored the resolved preview `theme`.
- Added resolved-theme handling for the settings-screen block, preserving the sidebar example's default system dark presentation while making `theme="light"` and `theme="dark"` explicit.
- Upgraded both `Sidebar` and `Stacked` settings previews so outer shells, nav items, tabs, form placeholders, cards, borders, text, feedback surfaces, and toggle colors respond to the preview theme.
- Added an accessible `aria-label` to the `Automatic timezone` toggle so it can be operated directly in smoke tests and by assistive technology.
- Retained and verified the existing stateful interactions for side navigation, tab selection, avatar picker, save action, row update, timezone toggle, and bank connection.
- Kept scope limited to the Settings Screens leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/settings-screens/`:
  - `tailwind-settings-screens-reference-desktop.png`
  - `local-settings-screens-desktop-before.png`
  - `local-settings-screens-mobile-before.png`
  - `local-settings-screens-interaction-before-fix.png`
  - `local-settings-screens-all-dark-before-fix.png`
  - `local-settings-screens-all-light-before-fix.png`
  - `local-settings-screens-desktop-after.png`
  - `local-settings-screens-interaction-after-fix.png`
  - `local-settings-screens-all-dark-after.png`
  - `local-settings-screens-all-light-after.png`
  - `local-settings-screens-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-page-examples-settings-screens` verified:
  - page heading count returned 1.
  - example heading count returned 2.
  - theme button count returned 6.
  - dark button count returned 2.
  - action button count returned 118.
  - active System count returned 2 before theme changes.
  - before fix, dark surface count stayed 25 after pressing all `Light` controls, proving the theme bug.
  - side navigation feedback appeared for `Settings settings opened`.
  - tab feedback appeared for `Billing tab selected`.
  - avatar feedback appeared for `Avatar picker opened`.
  - save feedback appeared for `Personal information saved`.
  - row update feedback appeared for `Full name update opened`.
  - timezone toggle feedback appeared for `Automatic timezone toggled`.
  - bank connection feedback appeared for `Bank connection started`.
  - after fix, all 2 `Dark` controls were exercised and all 2 exposed `aria-pressed=true`.
  - dark surface count increased from 3 to 37 after Dark.
  - dark card count increased to 9 after Dark.
  - all 2 `Light` controls were exercised and dark surface count returned to 3.
  - mobile render kept 6 theme controls available.
  - No severe console errors.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 110 - Dashboards page parity pass

Scope:

- Local `plus-application-page-examples-dashboards` leaf and its 3 dashboard preview variants.
- Tailwind Plus Application UI Page Examples dashboard reference URL candidates.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/dashboards` returned 404.
- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/dashboard` returned 404.
- Because Tailwind Plus does not expose a matching public `Dashboards` leaf at those routes, this pass used the closest local page-example quality bar: complete preview cards, working state feedback, theme controls, mobile sanity, and no runtime errors.
- Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue; standalone Playwright fallback was used.

Implementation:

- Fixed a smoke-discovered state issue in the shared `app-example-*` renderer where the global default `activeNavItem="Dashboard"` produced an initial `Dashboard selected` feedback message on the Dashboards leaf.
- Added resolved preview-theme handling to the shared app-example dashboard shell so dashboard examples respond to `theme="dark"` and `theme="light"` instead of staying effectively light.
- Added accessible labels for app section buttons, metric cards, and dashboard rows so smoke tests and assistive technology can operate the examples directly.
- Retained the existing dashboard actions and made section selection, export, metric selection, and row selection all produce visible feedback.
- Kept the pass scoped to the `Dashboards` leaf, while the shared renderer improvement also benefits the related legacy Application UI page-example leaves.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/dashboards/`:
  - `tailwind-dashboard-reference-dashboards.png`
  - `tailwind-dashboard-reference-dashboard.png`
  - `local-dashboards-desktop-before.png`
  - `local-dashboards-mobile-before.png`
  - `local-dashboards-interaction-before-fix.png`
  - `local-dashboards-all-dark-before-fix.png`
  - `local-dashboards-all-light-before-fix.png`
  - `local-dashboards-desktop-after.png`
  - `local-dashboards-interaction-after-fix.png`
  - `local-dashboards-all-dark-after.png`
  - `local-dashboards-all-light-after.png`
  - `local-dashboards-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-page-examples-dashboards` verified:
  - page heading count returned 1.
  - example heading count returned 3.
  - theme button count returned 9.
  - dark button count returned 3.
  - action button count returned 118.
  - active System count returned 3 before theme changes.
  - before fix, representative interaction feedback counts returned 0 and initial `Dashboard selected` feedback was visible.
  - after fix, initial `Dashboard selected` feedback count returned 0.
  - section feedback appeared for `Data section opened`.
  - action feedback appeared for `Export selected`.
  - metric feedback appeared for `Revenue opened`.
  - row feedback appeared for `Michael Foster row opened`.
  - after fix, all 3 `Dark` controls were exercised and all 3 exposed `aria-pressed=true`.
  - dark surface count increased to 37 after Dark.
  - dark card count increased to 22 after Dark.
  - all 3 `Light` controls were exercised and dark surface count returned to 1.
  - mobile render kept 9 theme controls available.
  - No severe console errors on the local page.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 116 - Product Overviews page parity pass

Scope:

- Local `plus-ecommerce-product-overviews` leaf and its 5 product overview preview variants.
- Tailwind Plus Ecommerce Components/Product Overviews live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/product-overviews` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Product Overviews` and the same 5 local example names: `With image grid`, `With tiered images`, `With image gallery and expandable details`, `Split with image`, and `With tabs`.

Implementation:

- Fixed the smoke-discovered static detail rows in `With image gallery and expandable details`: `Features`, `Care`, and `Shipping` are now expandable controls with `aria-expanded`, accessible labels, animated content reveal, and visible feedback.
- Added dark/light preview-theme support across Product Overviews frames, copy, option buttons, feedback, dividers, and tabs.
- Added `aria-pressed` to color, size, and tab controls so selected state is directly inspectable.
- Kept the pass scoped to the `Product Overviews` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/product-overviews/`.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-product-overviews` verified:
  - local page identity returned `Product Overviews`.
  - example heading count returned 5.
  - theme button count returned 15.
  - action button count returned 102.
  - detail row buttons improved from 0 before fix to 3 after fix.
  - `Natural`, `L`, Add to cart, `Care details`, and `Details` tab interactions produced visible state/feedback.
  - all 5 Dark controls exposed `aria-pressed=true` and dark preview frame count reached 5.
  - all 5 Light controls exposed `aria-pressed=true` and dark preview frame count returned to 0.
  - mobile 390px kept 15 theme controls and 3 detail row buttons available.
  - No severe console errors or page errors.
  - Desktop and mobile horizontal overflow returned 0.

## Step 121 - Product Quickviews page parity pass

Scope:

- Local `plus-ecommerce-product-quickviews` leaf and its 4 product quickview variants.
- Tailwind Plus Ecommerce Components/Product Quickviews live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/product-quickviews` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Product Quickviews` and the same 4 local example names.

Implementation:

- Converted static `Materials`, `Shipping`, and `Returns` rows into expandable detail buttons with `aria-expanded`, accessible labels, visible feedback, and animated reveal.
- Added dark/light preview-theme support across quickview frames, panels, image wells, copy, option controls, detail rows, and feedback surfaces.
- Added `aria-pressed` to color swatches and size controls.
- Added visible Add to bag feedback in addition to the existing button text state.
- Kept the pass scoped to the `Product Quickviews` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/product-quickviews/`.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-product-quickviews` verified:
  - local page identity returned `Product Quickviews`.
  - example heading count returned 4.
  - theme button count returned 12.
  - action button count returned 103.
  - info row buttons improved from 0 before fix to 6 after fix.
  - `Natural color`, `L`, Add to bag, Size guide, View full details, and `Shipping quickview detail` interactions were exercised.
  - Add to bag changed button text and exposed `Everyday Backpack added to bag` feedback.
  - all 4 Dark controls exposed `aria-pressed=true` and dark preview frame count reached 8.
  - all 4 Light controls exposed `aria-pressed=true` and dark preview frame count returned to 0.
  - mobile 390px kept 12 theme controls and 6 info row buttons available.
  - No severe console errors or page errors.
  - Desktop and mobile horizontal overflow returned 0.

## Step 122 - Product Features page parity pass

Scope:

- Local `plus-ecommerce-product-features` leaf and its 9 product feature variants.
- Tailwind Plus Ecommerce Components/Product Features live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/product-features` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Product Features` and the same 9 local example names.

Implementation:

- Fixed the smoke-discovered preview-theme gap where all 9 `Dark` controls became pressed but local product feature frames stayed light.
- Added dark/light preview-theme support across product feature frames, image wells, copy blocks, gradient overlays, tabs, proof cards, borders, muted copy, and feedback surfaces.
- Converted product feature proof points from mostly static content into real buttons with visible feedback, hover/press motion, stable accessible labels, and `aria-pressed` selected state.
- Strengthened the `With tabs` example with real tab buttons, tab-specific copy, visible selection feedback, and `aria-pressed`.
- Kept the pass scoped to the `Product Features` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/product-features/`.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-product-features` verified:
  - local page identity returned `Product Features`.
  - reference/local example count matched 9 examples.
  - theme button count returned 27 on desktop.
  - action button count returned 108 after the proof-point upgrade.
  - buttons exposing `aria-pressed` increased to 55 after the fix.
  - `Padded laptop sleeve` proof interaction produced selected state and visible feedback.
  - `Materials` and `Care` tab interactions produced selected state and visible feedback.
  - all 9 `Dark` controls exposed `aria-pressed=true` and dark preview frame count increased from 1 to 10.
  - all 9 `Light` controls exposed `aria-pressed=true` and dark preview frame count returned to 1.
  - No severe console errors or page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.
  - Mobile render preserved visible product proof controls; global preview theme controls remain hidden on mobile in the existing toolbar pattern.

## Step 123 - Store Navigation page parity pass

Scope:

- Local `plus-ecommerce-store-navigation` leaf and its 5 store navigation variants.
- Tailwind Plus Ecommerce Components/Store Navigation live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/store-navigation` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Store Navigation` and the same 5 local example names.

Implementation:

- Fixed the smoke-discovered preview-theme gap where all 5 `Dark` controls became pressed but local store navigation frames stayed light.
- Added dark/light preview-theme support across store navigation frames, top bars, brand marks, menu columns, category cards, borders, feedback surfaces, and mobile bottom navigation.
- Converted category cards from static content into real buttons with hover motion, stable accessible labels, selected state, and visible feedback.
- Added `aria-pressed` selected state to primary nav links, utility links, menu links, category cards, and mobile bottom nav buttons.
- Kept the pass scoped to the `Store Navigation` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/store-navigation/`.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-store-navigation` verified:
  - local page identity returned `Store Navigation`.
  - reference/local example count matched 5 examples.
  - theme button count returned 15 on desktop.
  - action button count returned 129 after the navigation upgrade.
  - buttons exposing `aria-pressed` increased to 88 after the fix.
  - `Search`, `New Arrivals`, `Bags`, and `Cart` interactions produced selected state and visible feedback.
  - all 5 `Dark` controls exposed `aria-pressed=true` and dark preview frame count increased from 1 to 12.
  - all 5 `Light` controls exposed `aria-pressed=true` and dark preview frame count returned to 1.
  - mobile 390px exposed 58 visible buttons with no horizontal overflow.
  - mobile `Search` and `Bag` bottom-nav interactions produced selected state and visible feedback.
  - No severe console errors or page errors.

## Step 124 - Promo Sections page parity pass

Scope:

- Local `plus-ecommerce-promo-sections` leaf and its 8 promo section variants.
- Tailwind Plus Ecommerce Components/Promo Sections live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/promo-sections` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Promo Sections` and the same 8 local example names.

Implementation:

- Added explicit promo theme state markers so each of the 8 examples can be verified as receiving Dark and Light preview-theme changes even when fixed dark background-image variants remain visually dark by design.
- Added dark/light preview-theme support to the light promo variants, image cards, offer rows, feedback surfaces, and CTA selected rings.
- Strengthened `Shop collection` CTAs with stable accessible labels, `aria-pressed`, visible selected state, and feedback.
- Converted offer apply actions in the split-offer example into directly inspectable controls with `aria-pressed` and visible feedback.
- Kept the pass scoped to the `Promo Sections` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/promo-sections/`.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-promo-sections` verified:
  - local page identity returned `Promo Sections`.
  - reference/local example count matched 8 examples.
  - theme button count returned 24 on desktop.
  - action button count returned 86.
  - buttons exposing `aria-pressed` increased from 24 to 35 after the fix.
  - `Shop collection` interaction produced selected state and visible feedback.
  - `Save 20% on bundles` offer interaction produced selected state and visible applied feedback.
  - all 8 `Dark` controls exposed `aria-pressed=true` and all 8 promo roots reported `data-promo-theme="dark"`.
  - all 8 `Light` controls exposed `aria-pressed=true` and all 8 promo roots reported `data-promo-theme="light"`.
  - mobile 390px exposed 16 visible buttons with no horizontal overflow.
  - mobile `Shop collection` interaction produced selected state and visible feedback.
  - No severe console errors or page errors.

## Step 125 - Checkout Forms page parity pass

Scope:

- Local `plus-ecommerce-checkout-forms` leaf and its 5 checkout form variants.
- Tailwind Plus Ecommerce Components/Checkout Forms live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/checkout-forms` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Checkout Forms` and the same 5 local example names.

Implementation:

- Converted the visual-only checkout field rows into real `<input>` controls with accessible labels, editable values, focus rings, dark/light styling, and blur feedback.
- Added explicit checkout theme state markers so each of the 5 examples can be verified as receiving Dark and Light preview-theme changes.
- Added dark/light preview-theme support across checkout frames, panels, field labels, inputs, summaries, borders, and muted copy.
- Added inspectable selected state to checkout progress steps, primary checkout CTAs, summary toggle, discount action, and payment CTA with `aria-pressed` or `aria-expanded` where appropriate.
- Kept the pass scoped to the `Checkout Forms` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/checkout-forms/`.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-checkout-forms` verified:
  - local page identity returned `Checkout Forms`.
  - reference/local example count matched 5 examples.
  - theme button count returned 15 on desktop.
  - action button count returned 72.
  - real input count increased from 1 before the fix to 52 after the fix.
  - buttons exposing `aria-pressed` increased from 15 to 28 after the fix.
  - `Email address` accepted `alex@example.com` and produced update feedback on blur.
  - `Confirm order`, `Information`, `Payment`, and `Apply discount` interactions produced selected state and visible feedback.
  - all 5 `Dark` controls exposed `aria-pressed=true` and all 5 checkout roots reported `data-checkout-theme="dark"`.
  - all 5 `Light` controls exposed `aria-pressed=true` and all 5 checkout roots reported `data-checkout-theme="light"`.
  - mobile 390px exposed 18 visible buttons and 52 inputs with no horizontal overflow.
  - mobile order-summary toggle changed `aria-expanded` from `true` to `false` and produced visible feedback.
  - No severe console errors or page errors.

## Step 126 - Reviews page parity pass

Scope:

- Local `plus-ecommerce-reviews` leaf and its 4 review variants.
- Tailwind Plus Ecommerce Components/Reviews live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/reviews` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Reviews` and the same 4 local example names.

Implementation:

- Added explicit review theme state markers so each of the 4 examples can be verified as receiving Dark and Light preview-theme changes.
- Added stable accessible labels and `aria-pressed` selected state to rating filters, row rating buttons, helpful actions, and write-review CTAs.
- Made rating-filter selection update both filter state and selected button state, so `5 star` and `4 star` filters can be directly inspected.
- Added selected state to helpful and mark-helpful actions while preserving existing visible feedback.
- Kept the pass scoped to the `Reviews` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/reviews/`.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-reviews` verified:
  - local page identity returned `Reviews`.
  - reference/local example count matched 4 examples.
  - theme button count returned 12 on desktop.
  - action button count returned 107.
  - buttons exposing `aria-pressed` increased from 12 to 40 after the fix.
  - `Write a review` produced selected state and visible composer feedback.
  - `5 star` and `4 star` rating filters produced selected state and visible filtered feedback.
  - `Leslie Alexander helpful` and `Perfectly weighted and easy to carry. helpful` actions produced selected state and visible feedback.
  - all 4 `Dark` controls exposed `aria-pressed=true` and all 4 review roots reported `data-review-theme="dark"`.
  - all 4 `Light` controls exposed `aria-pressed=true` and all 4 review roots reported `data-review-theme="light"`.
  - mobile 390px exposed 57 visible buttons with no horizontal overflow.
  - mobile `Write a review` produced selected state and visible feedback.
  - No severe console errors or page errors.

## Step 127 - Order Summaries page parity pass

Scope:

- Local `plus-ecommerce-order-summaries` leaf and its 4 order summary variants.
- Tailwind Plus Ecommerce Components/Order Summaries live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/order-summaries` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Order Summaries` and the same 4 local example names.

Implementation:

- Added explicit order-summary theme state markers so each of the 4 examples can be verified as receiving Dark and Light preview-theme changes.
- Added `aria-pressed` selected state to progress/status steps, invoice actions, and the continue-shopping action.
- Made invoice and status actions update shared selected state while preserving existing visible feedback.
- Added dark/light root styling to each order-summary variant so preview theme changes have a direct rendered effect.
- Kept the pass scoped to the `Order Summaries` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/order-summaries/`.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-order-summaries` verified:
  - local page identity returned `Order Summaries`.
  - reference/local example count matched 4 examples.
  - theme button count returned 12 on desktop.
  - action button count returned 76.
  - buttons exposing `aria-pressed` increased from 12 to 33 after the fix.
  - `Continue shopping`, `Order invoice`, `Processing`, `Shipped`, and `Delivered` interactions produced selected state and visible feedback.
  - all 4 `Dark` controls exposed `aria-pressed=true` and all 4 order-summary roots reported `data-order-summary-theme="dark"`.
  - all 4 `Light` controls exposed `aria-pressed=true` and all 4 order-summary roots reported `data-order-summary-theme="light"`.
  - mobile 390px exposed 26 visible buttons with no horizontal overflow.
  - mobile `Continue shopping` produced selected state and visible feedback.
  - No severe console errors or page errors.

## Step 120 - Category Filters page parity pass

Scope:

- Local `plus-ecommerce-category-filters` leaf and its 5 category filter variants.
- Tailwind Plus Ecommerce Components/Category Filters live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/category-filters` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Category Filters` and the same 5 local example names.

Implementation:

- Fixed the smoke-discovered preview-theme gap where all 5 Dark controls became pressed but local category filter frames stayed light.
- Added dark/light preview-theme support across filter frames, product tiles, hatch panels, sidebars, toolbar buttons, expandable panels, feedback, borders, and muted copy.
- Added `aria-pressed` to category buttons, filter chips, and expandable filter-panel controls.
- Retained and verified existing filter toggle, apply, clear, panel toggle, sort, and grid view feedback.
- Kept the pass scoped to the `Category Filters` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/category-filters/`.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-category-filters` verified:
  - local page identity returned `Category Filters`.
  - example heading count returned 5.
  - theme button count returned 15.
  - action button count returned 101.
  - filter button count returned 27.
  - dark preview frame count improved from 0 before fix to 5 after Dark.
  - `Color filter toggled`, `Applied 1 filter`, `Filters cleared`, panel toggle, `Sort menu opened`, and `Grid view selected` appeared in interaction checkpoints.
  - all 5 Dark controls exposed `aria-pressed=true`.
  - all 5 Light controls exposed `aria-pressed=true` and dark preview frame count returned to 0.
  - mobile 390px kept 15 theme controls and 27 filter buttons available.
  - No severe console errors or page errors.
  - Desktop and mobile horizontal overflow returned 0.

## Step 119 - Shopping Carts page parity pass

Scope:

- Local `plus-ecommerce-shopping-carts` leaf and its 6 shopping cart variants.
- Tailwind Plus Ecommerce Components/Shopping Carts live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/shopping-carts` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Shopping Carts` and the same 6 local example names.

Implementation:

- Converted static `Close` text in the drawer example into a real button with visible feedback.
- Added dark/light preview-theme support across cart frames, drawer/dialog/popover panels, line items, summaries, borders, quantity controls, and feedback surfaces.
- Added accessible names to quantity increase/decrease buttons.
- Preserved and verified existing quantity, remove/restore, checkout, continue-shopping, and dynamic subtotal behavior.
- Kept the pass scoped to the `Shopping Carts` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/shopping-carts/`.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-shopping-carts` verified:
  - local page identity returned `Shopping Carts`.
  - example heading count returned 6.
  - theme button count returned 18.
  - action button count returned 107.
  - close button count improved from 0 before fix to 1 after fix.
  - `Cart drawer closed`, quantity increase to `Qty 2`, `Nomad Backpack removed`, `Nomad Backpack restored`, and `Checkout started` appeared in interaction checkpoints.
  - subtotal changed from `$140` to `$280`, then `$0`, then `$280` across increase/remove/restore checkpoints.
  - all 6 Dark controls exposed `aria-pressed=true` and dark preview frame count reached 6.
  - all 6 Light controls exposed `aria-pressed=true` and dark preview frame count returned to 0.
  - mobile 390px kept 18 theme controls and the Close button available.
  - No severe console errors or page errors.
  - Desktop and mobile horizontal overflow returned 0.

## Step 118 - Category Previews page parity pass

Scope:

- Local `plus-ecommerce-category-previews` leaf and its 6 category preview variants.
- Tailwind Plus Ecommerce Components/Category Previews live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/category-previews` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Category Previews` and the same 6 local example names.

Implementation:

- Fixed the smoke-discovered preview-theme gap where all 6 Dark controls became pressed but local category preview frames stayed light.
- Added dark/light preview-theme support across Category Previews frames, image placeholders, text, feedback, and selected rings.
- Added `aria-pressed` to category collection buttons so selected category state is inspectable.
- Retained and verified existing category selection feedback across grid, overlay, scrolling, and split-image variants.
- Kept the pass scoped to the `Category Previews` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/category-previews/`.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-category-previews` verified:
  - local page identity returned `Category Previews`.
  - example heading count returned 6.
  - theme button count returned 18.
  - action button count returned 83.
  - category button count returned 14.
  - dark preview frame count improved from 0 before fix to 6 after Dark.
  - `Storage collection opened` and `Notebooks collection opened` feedback appeared.
  - all 6 Dark controls exposed `aria-pressed=true`.
  - all 6 Light controls exposed `aria-pressed=true` and dark preview frame count returned to 0.
  - mobile 390px kept 18 theme controls and 14 category buttons available.
  - No severe console errors or page errors.
  - Desktop and mobile horizontal overflow returned 0.

## Step 117 - Product Lists page parity pass

Scope:

- Local `plus-ecommerce-product-lists` leaf and its 11 product list preview variants.
- Tailwind Plus Ecommerce Components/Product Lists live reference page.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/product-lists` returned 200.
- The reference and local pages were captured with standalone Playwright because Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue.
- Reference headings included `Product Lists` and the same 11 local example names.

Implementation:

- Converted static color swatches in the horizontal swatch example into stateful swatch buttons with accessible names, `aria-pressed`, selected rings, and visible feedback.
- Added product card selection feedback for list examples that previously had no direct action, while avoiding nested button structures in examples that already contain CTA or overlay buttons.
- Added dark/light preview-theme support across Product Lists frames, cards, copy, borders, feedback, and card-detail controls.
- Added `aria-pressed` to card-detail size controls.
- Kept the pass scoped to the `Product Lists` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/product-lists/`.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-ecommerce-product-lists` verified:
  - local page identity returned `Product Lists`.
  - example heading count returned 11.
  - theme button count returned 33.
  - action button count returned 155.
  - swatch button count improved from 0 before fix to 16 after fix.
  - `Desk Notebook selected`, `Walnut Tray opened`, `Ribbed Beanie Indigo swatch selected`, `Task Lamp added to bag`, and `Canvas Card Wallet M selected` feedback appeared.
  - all 11 Dark controls exposed `aria-pressed=true` and dark preview frame count reached 11.
  - all 11 Light controls exposed `aria-pressed=true` and dark preview frame count returned to 0.
  - mobile 390px kept 33 theme controls and 16 swatch buttons available.
  - No severe console errors or page errors.
  - Desktop and mobile horizontal overflow returned 0.

## Step 111 - Settings page parity pass

Scope:

- Local `plus-application-page-examples-settings` leaf and its 3 settings preview variants.
- Tailwind Plus Application UI Page Examples settings reference URL candidates.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/settings` returned 404.
- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/settings-pages` returned 404.
- Because Tailwind Plus does not expose a matching public legacy `Settings` leaf at those routes, this pass used the closest local page-example quality bar: complete preview cards, working state feedback, theme controls, mobile sanity, and no runtime errors.
- Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue; standalone Playwright fallback was used.

Implementation:

- No additional Settings-specific code patch was required in this pass.
- The shared `app-example-*` renderer fixes from Step 110 were verified on this leaf: no initial `Dashboard selected` feedback, accessible section/metric/row controls, and dark/light preview-theme support.
- Retained and verified the existing settings page actions for section selection, export, metric selection, and row selection.
- Kept the pass scoped to the `Settings` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/settings/`:
  - `tailwind-settings-reference-settings.png`
  - `tailwind-settings-reference-settings-pages.png`
  - `local-settings-desktop-before.png`
  - `local-settings-mobile-before.png`
  - `local-settings-interaction-before-fix.png`
  - `local-settings-all-dark-before-fix.png`
  - `local-settings-all-light-before-fix.png`
  - `local-settings-desktop-after.png`
  - `local-settings-interaction-after.png`
  - `local-settings-all-dark-after.png`
  - `local-settings-all-light-after.png`
  - `local-settings-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-page-examples-settings` verified:
  - page heading count returned 1.
  - example heading count returned 3.
  - theme button count returned 9.
  - dark button count returned 3.
  - action button count returned 118.
  - active System count returned 3 before theme changes.
  - initial `Dashboard selected` feedback count returned 0.
  - section feedback appeared for `Security section opened`.
  - action feedback appeared for `Export selected`.
  - metric feedback appeared for `Members opened`.
  - row feedback appeared for `Michael Foster row opened`.
  - all 3 `Dark` controls were exercised and all 3 exposed `aria-pressed=true`.
  - dark surface count increased to 37 after Dark.
  - dark card count increased to 22 after Dark.
  - all 3 `Light` controls were exercised and dark surface count returned to 1.
  - mobile render kept 9 theme controls available.
  - No severe console errors on the local page.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 112 - Detail Pages page parity pass

Scope:

- Local `plus-application-page-examples-detail` leaf and its 3 detail page preview variants.
- Tailwind Plus Application UI Page Examples detail reference URL candidates.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/detail-pages` returned 404.
- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/detail` returned 404.
- Because Tailwind Plus does not expose a matching public legacy `Detail Pages` leaf at those routes, this pass used the closest local page-example quality bar: complete preview cards, working state feedback, theme controls, mobile sanity, and no runtime errors.
- Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue; standalone Playwright fallback was used.

Implementation:

- No additional Detail Pages-specific code patch was required in this pass.
- The shared `app-example-*` renderer fixes from Step 110 were verified on this leaf: no initial `Dashboard selected` feedback, accessible section/metric/row controls, and dark/light preview-theme support.
- Retained and verified the existing detail page actions for section selection, new item action, metric selection, and row selection.
- Kept the pass scoped to the `Detail Pages` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/detail-pages/`:
  - `tailwind-detail-pages-reference-detail-pages.png`
  - `tailwind-detail-pages-reference-detail.png`
  - `local-detail-pages-desktop-before.png`
  - `local-detail-pages-mobile-before.png`
  - `local-detail-pages-interaction-before-fix.png`
  - `local-detail-pages-all-dark-before-fix.png`
  - `local-detail-pages-all-light-before-fix.png`
  - `local-detail-pages-desktop-after.png`
  - `local-detail-pages-interaction-after.png`
  - `local-detail-pages-all-dark-after.png`
  - `local-detail-pages-all-light-after.png`
  - `local-detail-pages-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-page-examples-detail` verified:
  - page heading count returned 1.
  - example heading count returned 3.
  - theme button count returned 9.
  - dark button count returned 3.
  - action button count returned 118.
  - active System count returned 3 before theme changes.
  - initial `Dashboard selected` feedback count returned 0.
  - section feedback appeared for `Data section opened`.
  - action feedback appeared for `New item selected`.
  - metric feedback appeared for `Deploys opened`.
  - row feedback appeared for `Michael Foster row opened`.
  - all 3 `Dark` controls were exercised and all 3 exposed `aria-pressed=true`.
  - dark surface count increased to 37 after Dark.
  - dark card count increased to 22 after Dark.
  - all 3 `Light` controls were exercised and dark surface count returned to 1.
  - mobile render kept 9 theme controls available.
  - No severe console errors on the local page.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 113 - List Pages page parity pass

Scope:

- Local `plus-application-page-examples-list` leaf and its 3 list page preview variants.
- Tailwind Plus Application UI Page Examples list reference URL candidates.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/list-pages` returned 404.
- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/list` returned 404.
- Because Tailwind Plus does not expose a matching public legacy `List Pages` leaf at those routes, this pass used the closest local page-example quality bar: complete preview cards, working state feedback, theme controls, mobile sanity, and no runtime errors.
- Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue; standalone Playwright fallback was used.

Implementation:

- No additional List Pages-specific code patch was required in this pass.
- The shared `app-example-*` renderer fixes from Step 110 were verified on this leaf: no initial `Dashboard selected` feedback, accessible section/metric/row controls, and dark/light preview-theme support.
- Retained and verified the existing list page actions for section selection, export action, metric selection, and row selection.
- Kept the pass scoped to the `List Pages` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/list-pages/`:
  - `tailwind-list-pages-reference-list-pages.png`
  - `tailwind-list-pages-reference-list.png`
  - `local-list-pages-desktop-before.png`
  - `local-list-pages-mobile-before.png`
  - `local-list-pages-interaction-before-fix.png`
  - `local-list-pages-all-dark-before-fix.png`
  - `local-list-pages-all-light-before-fix.png`
  - `local-list-pages-desktop-after.png`
  - `local-list-pages-interaction-after.png`
  - `local-list-pages-all-dark-after.png`
  - `local-list-pages-all-light-after.png`
  - `local-list-pages-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-page-examples-list` verified:
  - page heading count returned 1.
  - example heading count returned 3.
  - theme button count returned 9.
  - dark button count returned 3.
  - action button count returned 118.
  - active System count returned 3 before theme changes.
  - initial `Dashboard selected` feedback count returned 0.
  - section feedback appeared for `Data section opened`.
  - action feedback appeared for `Export selected`.
  - metric feedback appeared for `Open rows opened`.
  - row feedback appeared for `Michael Foster row opened`.
  - all 3 `Dark` controls were exercised and all 3 exposed `aria-pressed=true`.
  - dark surface count increased to 37 after Dark.
  - dark card count increased to 22 after Dark.
  - all 3 `Light` controls were exercised and dark surface count returned to 1.
  - mobile render kept 9 theme controls available.
  - No severe console errors on the local page.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 114 - Auth Pages page parity pass

Scope:

- Local `plus-application-page-examples-auth` leaf and its 3 auth page preview variants.
- Tailwind Plus Application UI Page Examples auth reference URL candidates.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/auth-pages` returned 404.
- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/authentication-pages` returned 404.
- Because Tailwind Plus does not expose a matching public legacy `Auth Pages` leaf at those routes, this pass used the closest local page-example quality bar: complete preview cards, working state feedback, theme controls, mobile sanity, and no runtime errors.
- Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue; standalone Playwright fallback was used.

Implementation:

- Fixed a smoke-discovered theme-control bug in the `app-example-auth` renderer.
- Before the fix, all 3 `Dark` controls became pressed but auth preview cards stayed effectively light because the auth-specific branch ignored the resolved preview `theme`.
- Made auth preview shells, form cards, sign-in method buttons, inputs, and feedback surfaces respond to `theme="dark"` and `theme="light"`.
- Added accessible labels for sign-in method buttons so smoke tests and assistive technology can operate `Email`, `Google`, and `GitHub` directly without relying on ambiguous visible text.
- Retained and verified existing auth interactions for method selection and continue action.
- Kept the pass scoped to the `Auth Pages` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/auth-pages/`:
  - `tailwind-auth-pages-reference-auth-pages.png`
  - `tailwind-auth-pages-reference-authentication-pages.png`
  - `local-auth-pages-desktop-before.png`
  - `local-auth-pages-mobile-before.png`
  - `local-auth-pages-interaction-before-fix.png`
  - `local-auth-pages-all-dark-before-fix.png`
  - `local-auth-pages-all-light-before-fix.png`
  - `local-auth-pages-desktop-after.png`
  - `local-auth-pages-interaction-after-fix.png`
  - `local-auth-pages-all-dark-after.png`
  - `local-auth-pages-all-light-after.png`
  - `local-auth-pages-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-page-examples-auth` verified:
  - page heading count returned 1.
  - example heading count returned 3.
  - theme button count returned 9.
  - dark button count returned 3.
  - action button count returned 100.
  - active System count returned 3 before theme changes.
  - initial `Dashboard selected` feedback count returned 0.
  - before fix, dark surface count stayed 1 after pressing all `Dark` controls, proving the theme bug.
  - sign-in feedback appeared for `Google sign-in selected`.
  - sign-in feedback appeared for `GitHub sign-in selected`.
  - action feedback appeared for `Continue selected`.
  - after fix, all 3 `Dark` controls were exercised and all 3 exposed `aria-pressed=true`.
  - dark surface count increased from 1 to 24 after Dark.
  - dark card count increased to 24 after Dark.
  - all 3 `Light` controls were exercised and dark surface count returned to 1.
  - mobile render kept 9 theme controls available.
  - No severe console errors on the local page.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 115 - Onboarding Pages page parity pass

Scope:

- Local `plus-application-page-examples-onboarding` leaf and its 3 onboarding page preview variants.
- Tailwind Plus Application UI Page Examples onboarding reference URL candidates.

Reference note:

- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/onboarding-pages` returned 404.
- `https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/onboarding` returned 404.
- Because Tailwind Plus does not expose a matching public legacy `Onboarding Pages` leaf at those routes, this pass used the closest local page-example quality bar: complete preview cards, working state feedback, theme controls, mobile sanity, and no runtime errors.
- Chrome/Browser setup had already failed in this thread with `Browser is not available: iab` and the packaged browser documentation directory issue; standalone Playwright fallback was used.

Implementation:

- Strengthened dark/light theme support in the `app-example-onboarding` renderer.
- Before the fix, all 3 `Dark` controls became pressed but most onboarding preview surfaces remained light because the onboarding-specific branch only partially reflected the resolved preview `theme`.
- Made onboarding preview shells, sidebar, step buttons, task cards, task status text, and feedback surfaces respond to `theme="dark"` and `theme="light"`.
- Added accessible labels for onboarding step buttons so smoke tests and assistive technology can operate the step navigation directly.
- Retained and verified existing onboarding interactions for step navigation, task completion, skip action, and continue action.
- Kept the pass scoped to the `Onboarding Pages` leaf.

Verification:

- Captures saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/onboarding-pages/`:
  - `tailwind-onboarding-pages-reference-onboarding-pages.png`
  - `tailwind-onboarding-pages-reference-onboarding.png`
  - `local-onboarding-pages-desktop-before.png`
  - `local-onboarding-pages-mobile-before.png`
  - `local-onboarding-pages-interaction-before-fix.png`
  - `local-onboarding-pages-all-dark-before-fix.png`
  - `local-onboarding-pages-all-light-before-fix.png`
  - `local-onboarding-pages-desktop-after.png`
  - `local-onboarding-pages-interaction-after-fix.png`
  - `local-onboarding-pages-all-dark-after.png`
  - `local-onboarding-pages-all-light-after.png`
  - `local-onboarding-pages-mobile-after.png`
  - `capture-notes.json`
  - `smoke-before.json`
  - `smoke-after.json`
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174/?filter=nav%3Aplus-application-page-examples-onboarding` verified:
  - page heading count returned 1.
  - example heading count returned 3.
  - theme button count returned 9.
  - dark button count returned 3.
  - action button count returned 115.
  - active System count returned 3 before theme changes.
  - initial `Dashboard selected` feedback count returned 0.
  - before fix, dark surface count only reached 7 after pressing all `Dark` controls, proving partial theme coverage.
  - step feedback appeared for `Workspace step opened`.
  - task feedback appeared for `Import data completed`.
  - action feedback appeared for `Skip for now selected`.
  - action feedback appeared for `Continue setup selected`.
  - after fix, all 3 `Dark` controls were exercised and all 3 exposed `aria-pressed=true`.
  - dark surface count increased from 1 to 30 after Dark.
  - dark card count increased to 24 after Dark.
  - all 3 `Light` controls were exercised and dark surface count returned to 1.
  - mobile render kept 9 theme controls available.
  - No severe console errors on the local page.
  - No page errors.
  - Desktop and mobile 390px horizontal overflow returned 0.

## Step 141 - Bento Grids page parity pass

Scope:

- Local `plus-marketing-bento-grids` leaf and its 3 Bento grid preview variants.
- Tailwind Plus Marketing / Page Sections / Bento Grids reference page.

Reference:

- Canonical reference URL: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/bento-grids`
- Tailwind reference exposed 3 examples:
  - `Three column bento grid`
  - `Two row bento grid`
  - `Two row bento grid with three column second row`

Implementation:

- Kept the local Bento Grids page aligned to the 3 Tailwind example names.
- Added explicit `data-bento-grid-theme` and `data-bento-grid-variant` markers to every Bento preview root.
- Made all Bento variants respond to the preview theme toggle instead of keeping the earlier fixed light/dark surface split.
- Converted product proof, chart, security, API, activity, keyboard, integration, metric, and network affordances into real buttons with stable accessible labels.
- Added `aria-pressed` selected state, hover/press motion, focus rings, animated feedback, and a shared Bento feedback surface so every Bento action leaves visible state.

Verification:

- Captures and smoke data saved under `docs/research/assets/tailwind-plus-page-parity-2026-07-03/bento-grids/`.
- Chrome extension desktop smoke verified:
  - page title `Bento Grids`.
  - 3 example headings matching the Tailwind reference.
  - 3 `data-bento-grid-theme` roots.
  - 36 Bento action buttons.
  - performance metrics and API copy actions produced visible feedback.
  - selected actions exposed `aria-pressed=true`.
  - all 3 Dark controls set all 3 Bento roots to `data-bento-grid-theme="dark"`.
  - all 3 Light controls set all 3 Bento roots to `data-bento-grid-theme="light"`.
  - empty Chrome console errors.
  - desktop horizontal overflow stayed non-positive.
- Mobile 390px smoke verified:
  - 3 visible Dark controls.
  - 3 Bento roots and 36 Bento action buttons.
  - mobile preview and security actions produced feedback.
  - all 3 Dark controls set all 3 Bento roots to `data-bento-grid-theme="dark"`.
  - mobile horizontal overflow stayed non-positive.
  - no console or page errors.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.
