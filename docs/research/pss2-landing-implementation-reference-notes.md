# PSS2 Landing Implementation Reference Notes

Date: 2026-07-04

## Scope

This pass adds implementation-level landing references after the first PSS2 visual pass looked too generic. The goal is not to clone these pages, but to extract section contracts, motion choices, and proof-surface patterns for a stronger Askewly Design homepage.

## Toolshelf Entries

Added as `landing-page-reference` cards in `~/projects/toolshelf`:

- `launch-ui` - premium shadcn/Tailwind landing sections and dark product mockup hero.
- `shadcn-dashboard-landing-template` - landing plus real dashboard product surface.
- `page-ui` - copy-paste landing component catalog and complete template assemblies.
- `Brainwave-Interactive-Landing--React-Frontend` - animation-heavy AI product landing with parallax hero.

`shelf.py validate` still reports unrelated pre-existing card/manifest mismatches, but these four cards resolve through direct `shelf.py card <name>` lookup.

## Captures

Chrome extension captures were taken in the existing browser tab.

- Launch UI home viewport: `docs/research/assets/pss2-landing-implementation-repos-2026-07-04/landing-ref-launch-ui-home.jpeg`
- Launch UI home full page: `docs/research/assets/pss2-landing-implementation-repos-2026-07-04/landing-ref-launch-ui-home-full.jpeg`
- shadcn dashboard landing viewport: `docs/research/assets/pss2-landing-implementation-repos-2026-07-04/landing-ref-shadcn-dashboard-landing.jpeg`
- shadcn dashboard landing full page: `docs/research/assets/pss2-landing-implementation-repos-2026-07-04/landing-ref-shadcn-dashboard-landing-full.jpeg`
- Page UI component docs viewport: `docs/research/assets/pss2-landing-implementation-repos-2026-07-04/landing-ref-page-ui-components.jpeg`
- Brainwave viewport: `docs/research/assets/pss2-landing-implementation-repos-2026-07-04/landing-ref-brainwave.jpeg`
- Brainwave full page: `docs/research/assets/pss2-landing-implementation-repos-2026-07-04/landing-ref-brainwave-full.jpeg`

Note: Page UI full-page screenshot repeatedly wrote a zero-byte file in Chrome capture. The valid viewport capture plus repo code were used instead.

## Code Structure Findings

### Launch UI

Code paths:

- `~/projects/toolshelf/repos/launch-ui/app/page.tsx`
- `~/projects/toolshelf/repos/launch-ui/components/sections/hero/default.tsx`
- `~/projects/toolshelf/repos/launch-ui/components/sections/{navbar,logos,items,stats,pricing,faq,cta,footer}/default.tsx`

Pattern:

- The app page is a strict section stack: `Navbar -> Hero -> Logos -> Items -> Stats -> Pricing -> FAQ -> CTA -> Footer`.
- The hero is configurable through props: badge, title, description, buttons, mockup.
- The visual proof is not a generic card. It is a large responsive product screenshot inside a mockup frame with delayed appear animations and glow.
- Dark mode is not incidental; the hero changes screenshot assets through light/dark variants.

Transfer:

- Askewly should make the hero proof surface a real "design system workspace" mockup, not decorative floating cards.
- Use a reusable `HomeSection`/`HeroProofSurface` contract instead of hardcoding every block.

### shadcn Dashboard Landing Template

Code paths:

- `~/projects/toolshelf/repos/shadcn-dashboard-landing-template/nextjs-version/src/app/landing/landing-page-content.tsx`
- `~/projects/toolshelf/repos/shadcn-dashboard-landing-template/nextjs-version/src/app/landing/components/hero-section.tsx`
- `~/projects/toolshelf/repos/shadcn-dashboard-landing-template/nextjs-version/src/app/landing/components/{logo-carousel,stats-section,about-section,features-section,pricing-section,testimonials-section,faq-section,cta-section,contact-section}.tsx`

Pattern:

- The page is long-form SaaS structure, but the first viewport earns attention through a real dashboard screenshot and a play button.
- A floating theme customizer makes "this system is configurable" tangible.
- The hero connects copy, CTA, and product proof in one continuous vertical rhythm.
- Light/dark assets are explicitly handled with separate dashboard images.

Transfer:

- Askewly needs a visible product surface that proves Docs, Patterns, Showcase, Resources, and Pro are real areas.
- Add a small theme/tone switch or specimen mode control in the hero preview, because configurability is part of the product promise.

### Page UI

Code paths:

- `~/projects/toolshelf/repos/page-ui/website/data/docs/landing-page-components.mdx`
- `~/projects/toolshelf/repos/page-ui/templates/landing-page-templates/template/emerald-ai/emerald-ai.tsx`
- `~/projects/toolshelf/repos/page-ui/components/landing/LandingProductFeature.tsx`
- `~/projects/toolshelf/repos/page-ui/components/landing/**`

Pattern:

- Page UI separates the component catalog from complete templates.
- Complete templates are composed as named bricks: social proof band, video CTA, product features, band, sale CTA, testimonials, feature list, FAQ.
- Individual landing components expose many layout controls: text position, image position, perspective, shadows, background, glow, and container mode.
- The docs page is useful because the component list is visible, searchable, and repeated in a consistent preview/code rhythm.

Transfer:

- Askewly Patterns should not be just static pages. Landing sections should become named, inspectable "bricks" with preview/code/spec tabs.
- The homepage can show a mini brick rail: Hero, Dashboard, Mobile, Docs, Commerce, Pricing, CTA.

### Brainwave

Code paths:

- `~/projects/toolshelf/repos/Brainwave-Interactive-Landing--React-Frontend/src/App.tsx`
- `~/projects/toolshelf/repos/Brainwave-Interactive-Landing--React-Frontend/src/components/Hero.tsx`
- `~/projects/toolshelf/repos/Brainwave-Interactive-Landing--React-Frontend/src/components/{Benefits,Collaboration,Services,Pricing,Roadmap,Footer}.tsx`
- `~/projects/toolshelf/repos/Brainwave-Interactive-Landing--React-Frontend/src/components/design/Hero.tsx`

Pattern:

- The section stack is simple: `Header -> Hero -> Benefits -> Collaboration -> Services -> Pricing -> Roadmap -> Footer`.
- The hero uses motion primitives, parallax overlays, notification cards, background circles, and an animated "generating" strip.
- The product promise is visualized by an animated interface state, not just copy.
- The page has a strong identity, but the AI imagery is too product-specific to copy directly.

Transfer:

- Askewly can borrow motion layering: subtle enter animations, a live status strip, and floating annotation chips around the hero preview.
- Avoid copying the dark-purple AI-sci-fi palette. Askewly needs broader design-system authority, not a chatbot landing aesthetic.

## Revised Askewly Design Landing Blueprint

### First Viewport

Use a full-width product-system stage:

- Top nav: Askewly Design, then compressed nav `Docs / Patterns / Showcase / Resources / Pro`.
- Left/top copy: "Design systems for interfaces that need to feel built, not generated." Keep `Askewly Design` as product name and use the "askew, but intentional" idea in subcopy.
- Primary CTA: `Explore Patterns`; secondary CTA: `Open Docs`.
- Proof surface: a large interactive "Design System Workspace" mockup, not a set of small unrelated cards.

The proof surface should contain:

- A sidebar with `Docs`, `Patterns`, `Showcase`, `Resources`, `Pro`.
- A center canvas with one selected pattern preview.
- A right inspector showing tokens, states, motion, accessibility, and agent prompt notes.
- Floating status chips such as `Light/Dark synced`, `Responsive states`, `Copy code: Pro`.
- A small segmented control for `SaaS`, `Mobile`, `Commerce`, `Docs`, `Dashboard`.

### Section Stack

1. `HeroWorkspace` - product-stage hero with live segmented preview.
2. `ReferenceBar` - "Built from real references, not generic prompts" with Tailwind, shadcn, mobile platform, Around, and local design-system sources.
3. `PatternAtlas` - a dense but polished grid of bricks: Navigation, Page Headers, Forms, Overlays, Data Views, Commerce, Mobile, Docs.
4. `ShowcaseSurface` - real page examples with before/after and light/dark previews.
5. `AgentSystem` - Codex/Claude Code can consume tokens, recipes, prompts, and anti-patterns.
6. `ProBoundary` - free browsing vs paid copy/download/assets, shown through locked code and asset drawers.
7. `DesignPrinciples` - short editorial band: intentional asymmetry, product proof, interaction first, reference-backed craft.
8. `FinalCTA` - enter Docs, explore Patterns, or join Pro waitlist.

### Interaction Requirements

- Hero segmented control changes the central preview and right inspector content.
- Light/dark toggle changes the hero preview and surrounding page tokens.
- Pattern cards should have hover elevation and a visible selected state.
- Pro code drawer can open in preview mode, but copy/download stays disabled or marked Pro.
- Motion should be restrained: opacity/translate entrance, preview panel crossfade, button hover lift, small floating annotation movement. Avoid perpetual busy motion.

### Implementation Notes

- Start by replacing the current homepage experiment in `examples/ui-vocabulary-site/src/components/home-page.tsx`.
- Keep `examples/ui-vocabulary-site/src/App.tsx` routing and top-level IA intact.
- Prefer local data arrays for hero modes and pattern cards so the homepage can later pull from the real pattern catalog.
- Keep cards at small radii and avoid nested-card page sections. The hero proof surface can be framed; surrounding sections should use bands or unframed grids.
- Add desktop and mobile Chrome screenshots after implementation.

## PSS2 Next Step

Implement only the homepage first. Do not start the one-page-at-a-time Tailwind Plus parity loop until the homepage has a stronger first viewport and section stack.
