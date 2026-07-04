# Product-System Exemplar Map

Date: 2026-07-04

## Purpose

RME5 maps selected product-system exemplars into reusable lessons for Yusung's design system. These are not visual identities to copy. They are quality bars for different product surfaces.

Checked references:

- Vercel Design: `https://vercel.com/design`
- Geist Design System: `https://vercel.com/geist/introduction`
- Geist Font: `https://vercel.com/font`
- Stripe Elements: `https://stripe.com/payments/elements`
- Stripe Elements docs: `https://docs.stripe.com/payments/elements`
- Stripe Checkout: `https://stripe.com/payments/checkout`
- Linear design refresh: `https://linear.app/now/behind-the-latest-design-refresh`
- Radix Primitives: `https://www.radix-ui.com/primitives`
- Radix Primitives introduction: `https://www.radix-ui.com/primitives/docs/overview/introduction`
- Radix Themes overview: `https://www.radix-ui.com/themes/docs/theme/overview`
- Around capture: `docs/research/around-template-system-capture.md`

## Exemplar Roles

| Exemplar | Surface role | What it teaches | Do not copy |
|---|---|---|---|
| Vercel / Geist | Developer tools, infrastructure marketing, docs, command-oriented web apps | Precision, minimalism, speed, mono/sans typography, high-contrast accessible color, developer-native components | Black/white identity as a default, Vercel brand voice, exact Geist component styling |
| Stripe | Checkout, payments, billing, trust-heavy flows, global commerce | Modular payment UI, conversion, built-in validation/error handling, localization, compliance/security framing, API/UI pairing | Stripe gradient brand, payment-specific regulatory claims, misleading trust/security copy |
| Linear | Dense SaaS operations, issue tracking, product management | Calm density, structure without clutter, low-noise hierarchy, subtle borders, high-frequency workflow ergonomics | Linear's exact dark aesthetic, issue tracker metaphors where not relevant |
| Radix | Component primitives, accessibility layer, design-system engineering | Unstyled accessible primitives, focus control, keyboard support, WAI-ARIA pattern discipline, composable themes | Treating primitives as a full brand, shipping Radix default visual identity as Yusung identity |
| Around / Createx | Multipurpose commercial template system | Broad page catalog, landing/page/account/docs/UI kit coverage, theme customizer, packaged asset positioning | Commercial template styling, source code, Bootstrap-specific implementation as a universal rule |

## Vercel / Geist Lessons

Official signals:

- Vercel describes Geist as its design system for consistent web experiences.
- The Vercel design page frames the team as systemizing design and stewarding brand/Geist.
- Geist Font is described as built for developers and designers, with simplicity, minimalism, speed, precision, clarity, and functionality.

Reusable lessons:

1. Developer tools need typographic credibility.
2. Monospace and sans should be designed as a pair, not an afterthought.
3. Grid, type, icons, color, and components should feel like one system.
4. Minimal UI still needs strong states, contrast, and interaction polish.
5. A public design system can double as brand proof.

Yusung mapping:

- Use this as the quality bar for developer-facing pages, documentation, command palettes, API examples, and code-copy surfaces.
- Agent assets should include code typography, tokenized grid, copy-button behavior, inline status labels, and dark-mode examples.

## Stripe Lessons

Official signals:

- Stripe Elements presents modular UI building blocks for secure, on-brand checkout.
- Stripe highlights CSS-level customization, accessibility, error messages, input masking, autofill, and conversion.
- Stripe docs emphasize tokenizing sensitive payment details without touching the server.
- Stripe Checkout supports all-in-one hosted pages, embeddable UI components, subscriptions, marketplaces, fraud prevention, and compliance.

Reusable lessons:

1. High-stakes UI must pair design with operational trust.
2. Payment UX is about edge cases: validation, masking, localization, wallets, payment method ordering, security, and failure recovery.
3. Conversion claims need evidence and restraint.
4. Modular UI should still feel like one flow.
5. Secure primitives can be customizable without exposing dangerous implementation details.

Yusung mapping:

- Use this as the quality bar for checkout, billing, subscription, order summary, invoice, payment method, plan upgrade, and pricing conversion pages.
- Paid asset pages must distinguish visual copy snippets from regulated/high-risk implementation guidance.

## Linear Lessons

Official signals:

- Linear's design refresh explicitly says structure should be felt, not seen.
- The refresh reduced visual clutter by softening separators and rounding/softening structure.

Reusable lessons:

1. Dense product UI should be calm, not decorative.
2. Structure can come from spacing, grouping, low-contrast separators, and interaction states instead of heavy borders everywhere.
3. Operational tools need repeated-use ergonomics more than landing-page drama.
4. UI refreshes should remove accidental hierarchy before adding new ornament.
5. A product can have strong personality while keeping the interface quiet.

Yusung mapping:

- Use this as the quality bar for SaaS dashboards, tables, issue/task lists, account admin, search/result views, CRM-like workflows, and settings.
- Future examples should include keyboard affordances, filters, saved views, empty states, bulk actions, and dense list scanning.

## Radix Lessons

Official signals:

- Radix Primitives are unstyled, accessible, open-source React primitives for high-quality web apps and design systems.
- Radix emphasizes accessibility, customization, developer experience, and incremental adoption.
- Radix docs explicitly call out gaps in native web implementations for common patterns and the difficulty of building custom components accessibly.
- Radix Themes adds a configurable visual layer through a Theme component and component variants.

Reusable lessons:

1. A design system needs behavior primitives, not only visual tokens.
2. Accessibility should be built into component contracts: focus, keyboard, screen reader, collision handling, typeahead, portal behavior.
3. Unstyled primitives allow brand expression without re-solving hard interaction problems.
4. Themes and primitives should be separate layers.
5. Docs should expose anatomy, states, and interaction guarantees.

Yusung mapping:

- Use Radix as the behavior baseline for dropdowns, dialogs, popovers, select, tabs, accordion, tooltip, and command-style interactions.
- Future component pages should state behavior contracts explicitly, not just show static mockups.

## Around / Createx Lessons

Observed in local capture:

- Around packages landings, pages, account flows, UI Kit, docs, and a visible theme customizer into one commercial template surface.
- The captured pages show page breadth across SaaS, shop checkout, account overview, typography docs, and docs getting started.
- The template exposes customization controls for color, typography, borders, rounding, and generated CSS.

Reusable lessons:

1. A sellable design system needs breadth, not only isolated components.
2. Catalog IA matters: landing pages, inner pages, account surfaces, UI kit, docs, and package claims should be discoverable.
3. Customizer controls make the system feel usable before code download.
4. A template is a product, so packaging and onboarding are part of the design system.
5. Example pages should demonstrate complete workflows.

Yusung mapping:

- Use Around as the quality bar for the public catalog shape: marketing, application UI, ecommerce, account, docs, UI kit, examples, customization, and asset package pages.
- Do not copy its Bootstrap implementation or template visuals.

## Cross-Exemplar Pattern Matrix

| Pattern need | Best exemplar | Why |
|---|---|---|
| Developer docs, code snippets, CLI UI | Vercel / Geist | Developer-native type, grid, high-contrast system, docs polish |
| Checkout, billing, subscription | Stripe | Trust, validation, localization, compliance, conversion |
| Dense SaaS/productivity UI | Linear | Calm hierarchy, subtle structure, repeated-use density |
| Accessible component behavior | Radix | Primitive contracts, keyboard/focus/screen-reader support |
| Broad public catalog and template packaging | Around | IA breadth, customizer, page coverage, commercial framing |
| Mobile platform adaptation | Apple HIG + Material 3 | Platform conventions and native interaction expectations |

## Product-System Quality Bars

### Website quality bar

The public site should let a person:

- browse complete page families, not just components
- see working interactions
- compare light/dark mode
- inspect anatomy and behavior
- copy code only when the example is production-shaped
- download assets only when licensing and implementation boundaries are clear

### Agent quality bar

Codex/Claude Code should be able to retrieve:

- surface taxonomy
- exemplar role
- behavior contract
- visual token guidance
- implementation constraints
- verification checklist
- source evidence

### Paid asset quality bar

Paid assets should include:

- code
- live preview
- light/dark variants
- responsive variants
- interaction states
- accessibility notes
- usage boundaries
- source/reference lineage

## Non-Transferable Boundaries

Do not import:

- Vercel's brand identity, exact components, or proprietary design decisions.
- Stripe's regulatory/security positioning beyond generic trust and checkout lessons.
- Linear's exact interface styling or product metaphors.
- Radix's visual defaults as Yusung's final look.
- Around's paid template source or commercial styling.

The transferable layer is method, structure, behavior, and quality bar.

## RME5 Completion Check

- Vercel/Geist, Stripe, Linear, Radix, and Around are each mapped to a distinct product-system role.
- Transferable lessons are separated from non-transferable identity.
- A cross-exemplar matrix defines which reference to use for which future page family.
- Website, agent, and paid asset quality bars are defined.
- The map connects prior Tailwind, Around, local design audit, and mobile baseline work into one reference model.
