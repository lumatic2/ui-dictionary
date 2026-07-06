# ROADMAP

> Last updated: 2026-07-04
> Status: Public Site Shell
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="public-site-shell" -->
Goal: Turn `ui.askewly.com/` into the public homepage and site shell for Askewly Design. Details: `docs/horizons/2026-07-public-site-shell.md`

## Active Milestones

<!-- harness:milestone id="PSS1" status="completed" priority="P0" evidence="docs/design-system/site-blueprint.md; phases/public-site-shell/index.json; examples/ui-vocabulary-site/src/App.tsx; examples/ui-vocabulary-site/src/components/home-page.tsx; cd examples/ui-vocabulary-site && npm run build; cd examples/ui-vocabulary-site && npm run lint; Chrome MCP smoke: /, ?page=plus&filter=nav:plus-application-ui, ?page=docs&filter=nav:docs-elements-command-palette" -->
### PSS1 - Homepage And Site IA Shell
- DoD: `ui.askewly.com/` renders a real public homepage with product identity, product promise, search/command affordance, multiple UI previews, and top-level navigation into Docs, Patterns, Showcase, Resources, and Pro while preserving existing Plus/Docs work.
- Evidence: docs/design-system/site-blueprint.md; phases/public-site-shell/index.json; examples/ui-vocabulary-site/src/App.tsx; examples/ui-vocabulary-site/src/components/home-page.tsx; cd examples/ui-vocabulary-site && npm run build; cd examples/ui-vocabulary-site && npm run lint; Chrome MCP smoke: /, ?page=plus&filter=nav:plus-application-ui, ?page=docs&filter=nav:docs-elements-command-palette
- Gap: The reference/site blueprint exists, but the deployed app still opens into the old catalog-style UI instead of a product homepage.
- Status: [x]

- Completed at: 2026-07-04
- Summary: Implemented the public ui.askewly.com homepage and top-level site IA shell while preserving existing Plus and Docs content under the new compact Askewly Design navigation.

<!-- harness:milestone id="PSS2" status="pending" priority="P0" -->
### PSS2 - Landing Page Design Quality
- DoD: The `ui.askewly.com/` landing page feels like a finished public product page for Askewly Design, with a distinctive first viewport, polished responsive layout, clear Docs/Patterns/Showcase/Resources/Pro paths, interactive preview states, light/dark behavior, and Chrome screenshot evidence across desktop and mobile.
- Evidence: `DESIGN.md`; `docs/plans/2026-07-05-askewly-landing-first-screen.md`; `docs/research/pss2-landing-reference-notes.md`; `docs/research/pss2-landing-implementation-reference-notes.md`; `docs/research/assets/pss2-landing-reference-2026-07-04/`; `docs/research/assets/pss2-landing-implementation-repos-2026-07-04/`; `examples/ui-vocabulary-site/src/components/home-page.tsx`; `examples/ui-vocabulary-site/src/App.tsx`; desktop/mobile Chrome screenshots; `cd examples/ui-vocabulary-site && npm run build`; `cd examples/ui-vocabulary-site && npm run lint`
- Gap: The homepage shell exists, but the landing page still needs design-quality iteration beyond structural IA.
- Status: [ ]
- Paused: 2026-07-07 — set to pending while the planning cascade (Objective/horizon candidates) is re-authored; showcase plan resumes from `docs/plans/2026-07-05-showcase-atlas-upgrade.md` Step 4.
<!-- harness:milestone id="RME1" status="completed" priority="P0" evidence="docs/research/tailwind-reference-model.md" -->
### RME1 - Tailwind Reference Model
- DoD: Existing Tailwind/Tailwind Plus captures and local parity work are summarized into a reusable reference model that separates IA, page pattern, interaction behavior, evidence, and non-transferable identity.
- Evidence: docs/research/tailwind-reference-model.md
- Gap: The repo has extensive Tailwind parity evidence, but it is still scattered across ledgers, screenshots, page-specific notes, and implementation files.
- Status: [x]

- Completed at: 2026-07-04
- Summary: Consolidated Tailwind/Tailwind Plus IA, catalog leaf, documentation leaf, interaction, verification, transferable principles, non-transferable identity, and agent asset mapping into a reusable reference model.
## Next Candidates

<!-- harness:milestone id="FGB1" status="candidate" priority="P1" evidence="docs/horizons/2026-07-figma-bridge-candidate.md" -->
### FGB1 - Figma Bridge Candidate Horizon
- DoD: Figma's role is defined as both competitor and complement, with a concrete bridge model from Figma artifacts to Askewly Design tokens, patterns, implementation recipes, and coding-agent verification.
- Evidence: docs/horizons/2026-07-figma-bridge-candidate.md
- Gap: Askewly Design needs to position itself against Figma without ignoring Figma's strength as a visual authoring and review surface.
- Status: [ ]

<!-- harness:milestone id="RME2" status="completed" priority="P0" evidence="docs/research/around-template-system-capture.md; docs/research/assets/around-template-system-2026-07-04/" -->
### RME2 - Around Template System Capture
- DoD: Around/Createx is captured as a template-system reference across landings, inner pages, account flows, UI Kit/docs, theme customizer, and packaged asset positioning.
- Evidence: docs/research/around-template-system-capture.md; docs/research/assets/around-template-system-2026-07-04/
- Gap: The reference strategy includes high-quality product systems, but not yet a multipurpose commercial template system with broad page coverage and customization controls.
- Status: [x]

- Completed at: 2026-07-04
- Summary: Captured Around/Createx as a multipurpose commercial template-system reference across landings, shop checkout, account, UI Kit, docs, customizer, package positioning, evidence screenshots, and agent asset mapping.
<!-- harness:milestone id="RME3" status="completed" priority="P1" evidence="docs/research/local-design-system-integration-audit.md" -->
### RME3 - Local Design Work Audit
- DoD: `design-manual`, `claude-design-manual`, and design-related custom skills are classified as merge, link, supersede, or archive with concrete integration notes.
- Evidence: docs/research/local-design-system-integration-audit.md
- Gap: Prior Askewly design-system work exists outside this repo and can easily be duplicated or forgotten without an integration audit.
- Status: [x]

- Completed at: 2026-07-04
- Summary: Audited local design-manual, claude-design-manual, and design-related custom skills; classified sources as merge, link, external archive, or executable agent layer; defined integration boundaries for the public design-system website and agent asset model.
<!-- harness:milestone id="RME4" status="completed" priority="P1" evidence="docs/research/mobile-platform-design-baseline.md" -->
### RME4 - Mobile Platform Baseline
- DoD: Apple HIG and Material Design are compared into a mobile baseline covering navigation, modality, inputs, density, platform affordances, motion, and accessibility.
- Evidence: docs/research/mobile-platform-design-baseline.md
- Gap: The new Objective includes mobile apps, but the current implementation evidence is still mostly web/Tailwind-oriented.
- Status: [x]

- Completed at: 2026-07-04
- Summary: Defined a mobile platform baseline from official Apple HIG and Material 3 references, covering navigation, modality, inputs, density, visual language, motion, accessibility, dark mode, mobile-specific data fields, and agent implementation rules.
<!-- harness:milestone id="RME5" status="completed" priority="P2" evidence="docs/research/product-system-exemplars.md" -->
### RME5 - Product-System Exemplar Map
- DoD: Vercel/Geist, Stripe, Linear, Radix/Linear, and Around are mapped into product-system lessons for SaaS, developer tools, payment flows, dense operations UI, and commercial template systems.
- Evidence: docs/research/product-system-exemplars.md
- Gap: The system needs more than Tailwind; it needs concrete quality bars from real product surfaces and commercial template systems.
- Status: [x]

- Completed at: 2026-07-04
- Summary: Mapped Vercel/Geist, Stripe, Linear, Radix, and Around into product-system roles, transferable lessons, non-transferable boundaries, cross-exemplar selection rules, and website/agent/paid-asset quality bars.
## Archive Pointer

Completed or archived milestone history lives in `BACKLOG.md`.
