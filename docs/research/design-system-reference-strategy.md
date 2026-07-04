# Design System Reference Strategy

Date: 2026-07-04

## Purpose

This document defines how `ui-dictionary` studies external UI/design systems and local design-system work without becoming a loose scrapbook or a clone of another product.

The project goal is Yusung's digital product design system: a human-facing reference website and an agent-facing system for Codex/Claude Code. References are therefore evaluated by what they contribute to:

- product-surface coverage: web, mobile, SaaS, commerce, dashboards, documentation, marketing, internal tools;
- design-system depth: tokens, components, patterns, page examples, interaction states, accessibility, motion, responsive behavior;
- agent usefulness: implementation recipes, promptable terminology, anti-patterns, code/assets, verification loops;
- originality boundary: what can be learned and adapted without copying another product identity.

## Source Tiers

### Tier 0 - Operating References

These sources directly shape the current implementation loop.

| Source | Primary use | What to capture | What not to copy |
| --- | --- | --- | --- |
| Tailwind CSS site and docs (`https://tailwindcss.com/`) | Documentation IA, utility-first mental model, code/example rhythm | global navigation, docs leaf structure, example/code pairing, responsive docs layout | Tailwind brand voice, exact visual identity |
| Tailwind Plus (`https://tailwindcss.com/plus`, `https://tailwindcss.com/plus/ui-blocks/documentation`) | High-quality page sections, page examples, component docs, preview density | category taxonomy, leaf-page examples, locked/free boundaries, preview cards, sidebar/on-page navigation | paid content, exact component source, Tailwind Plus commercial identity |
| Tailwind Labs GitHub (`https://github.com/tailwindlabs/tailwindcss`, `https://github.com/tailwindlabs`) | Implementation architecture and ecosystem boundaries | package structure, docs-source conventions if public, release/compatibility signals, relation to Headless UI/Heroicons | internal repo structure as a forced template for this project |
| Existing local Tailwind parity evidence (`docs/research/tailwind-plus-*.md`, `docs/research/assets/tailwind-*`) | Ground truth for what has already been captured and implemented | screenshots, mismatch ledgers, smoke evidence, page-by-page parity notes | treating parity as the final design system |

#### Tailwind Repo Deep Dive Position

Deep research into `tailwindlabs/tailwindcss` is useful, but it should happen after this strategy because the repo answers a different question than the site:

- Site/docs answer: how to teach, browse, compare, and sell UI patterns.
- Repo answers: how Tailwind's packages, compiler, documentation, ecosystem, and release discipline are organized.

For this project, site/docs structure is higher priority until the human-facing and agent-facing product model is stable. The repo becomes a DSF2 follow-up research item, not the first implementation source.

### Tier 1 - Platform Design Systems

These sources define durable cross-device expectations.

| Source | Primary use | What to capture | What not to copy |
| --- | --- | --- | --- |
| Apple Human Interface Guidelines (`https://developer.apple.com/design/human-interface-guidelines`) | Mobile/app platform expectations, Apple-platform interaction conventions | navigation patterns, modality, input, density, platform-specific affordances, accessibility expectations | Apple-native appearance as default for non-Apple products |
| Apple Design Resources (`https://developer.apple.com/design/`) | Official app design templates and platform resources | resource taxonomy, platform asset requirements, handoff model | Apple brand assets or proprietary template contents |
| Material Design 3 (`https://m3.material.io/`) | Android/web/mobile design-system completeness | foundations, tokens, components, adaptive layout, motion, interaction states | Material visual language as the house style |
| Android Material guidance (`https://developer.android.com/develop/ui/views/theming/look-and-feel`) | Android implementation bridge | relationship between spec, Compose/Views, components, implementation libraries | Android-specific defaults outside Android surfaces |

### Tier 2 - Product-System Exemplars

These references are useful because they are product-grade, not because they are universally correct.

| Source | Primary use | What to capture | What not to copy |
| --- | --- | --- | --- |
| Vercel Design/Geist (`https://vercel.com/design`, `https://vercel.com/geist/introduction`) | Developer-tool brand + web interface system | typography, high-contrast palette, grid discipline, component docs, developer-facing tone | Vercel aesthetic as a generic default |
| Stripe UI components and Elements (`https://docs.stripe.com/stripe-apps/components`, `https://stripe.com/payments/elements`) | Fintech/payment form UX, high-trust flows, developer docs | form composition, checkout constraints, security-adjacent UI, docs-to-code path | Stripe brand colors, marks, or payment-specific flows outside relevant surfaces |
| Linear brand and product UI notes (`https://linear.app/brand`, `https://linear.app/now/how-we-redesigned-the-linear-ui`) | Dense SaaS product UI, hierarchy, navigation, product taste | density, sidebar/tabs/header hierarchy, reduced noise, product-page storytelling | Linear's brand identity or exact interface |
| Radix Linear case study (`https://www.radix-ui.com/primitives/case-studies/linear`) | Accessibility primitive strategy for SaaS components | primitive/component separation, accessible overlays/forms/controls | assuming Radix is mandatory for every implementation |
| Around by Createx Studio (`https://around.createx.studio/`) | Multipurpose template-system breadth across landings, pages, account flows, UI kit, docs, and theme customization | template catalog IA, landing/page/account coverage, theme customizer controls, Bootstrap/Figma handoff claims, light/dark and asset-pack positioning | Bootstrap-specific implementation as a forced stack, exact template visuals, paid package source |

### Tier 3 - Local Design-System Work

These are integration candidates, not automatic imports.

| Local source | Primary use | Next action |
| --- | --- | --- |
| `C:/Users/yusun/projects/design-manual` | Existing DESIGN.md, methodology, templates, verification loops | Audit structure and decide whether to merge, link, or supersede |
| `C:/Users/yusun/projects/claude-design-manual` | Prior Claude-facing design guidance | Compare with current agent-facing objective |
| `C:/Users/yusun/projects/custom-skills/design-bootstrap` | Bootstrapping DESIGN.md and lint harness | Extract reusable bootstrap contract |
| `C:/Users/yusun/projects/custom-skills/design-harness` | DesignSync and implementation QA workflow | Map to this repo's future verification loop |
| `C:/Users/yusun/projects/custom-skills/design-bridge` | Brownfield token bridge workflow | Use later when integrating existing apps/sites |
| `C:/Users/yusun/projects/custom-skills/design-screen` | Single-screen implementation workflow | Convert useful rules into agent recipes |
| `C:/Users/yusun/projects/ux-dictionary` and `development-dictionary` | Adjacent dictionary/product knowledge | Check overlap after surface taxonomy exists |

## Capture Protocol

Every reference capture must produce an evidence artifact under `docs/research/` or `docs/research/assets/` with this structure:

1. Source: canonical URL or local path.
2. Access date.
3. Surface: docs, marketing, SaaS app, mobile app, commerce, dashboard, internal tool, component system, token system, or agent system.
4. Observed structure: navigation, page hierarchy, component/page taxonomy, interaction model.
5. Transferable principles: what can be adapted into Yusung's system.
6. Non-transferable identity: what must not be copied.
7. Implementation target: website UI, data schema, token system, component recipe, agent prompt, or QA rule.
8. Verification: screenshot path, browser smoke result, code diff, schema check, or explicit "research-only".

## Adaptation Rules

- Prefer structure over style: copy the information architecture, interaction contract, or verification habit before visual treatment.
- Treat exact colors, typography, illustrations, and brand marks as non-transferable unless the source explicitly provides reusable open assets.
- When copying an interaction idea, implement it with this project's own content, token names, states, and accessibility labels.
- References must be ranked by the current gap. Tailwind is not always first; mobile surfaces should start with HIG/Material, payment surfaces with Stripe, dense SaaS with Linear/Vercel/Radix.
- Paid/commercial examples can inform structure and quality bar, but source code and locked content are not copied into this repo.
- Local `design-manual` work should be audited before import. Do not merge folders wholesale.

## Research Queue

### R1 - Tailwind Site And Plus System

Goal: convert existing parity work into a reusable reference model.

- Inventory existing Tailwind/Tailwind Plus capture ledgers.
- Identify which pages became actual interactive local examples.
- Extract recurring page structure: sidebar, on-this-page, preview card, component API, example sections, locked/free state.
- Output: `docs/research/tailwind-reference-model.md`.

### R2 - Tailwind Labs Repo Deep Dive

Goal: understand ecosystem architecture after the site model is clear.

- Inspect `tailwindlabs/tailwindcss` package layout and public docs links.
- Map relation to Tailwind Plus, Headless UI, Heroicons, and docs.
- Decide what repo-level practices matter for this project: release notes, package boundaries, docs source, test discipline.
- Output: `docs/research/tailwind-labs-repo-architecture.md`.

### R3 - Mobile Platform Baseline

Goal: prevent the system from becoming web-only.

- Capture HIG and Material 3 structure.
- Compare mobile navigation, modality, density, input, safe areas, motion, and platform conventions.
- Output: `docs/research/mobile-platform-design-baseline.md`.

### R4 - Product-System Exemplars

Goal: study product-grade SaaS/developer-tool surfaces.

- Vercel/Geist: developer-tool web and design system docs.
- Stripe: high-trust form/payment/product docs.
- Linear: dense SaaS app hierarchy and product tone.
- Radix/Linear: accessibility primitive strategy.
- Around/Createx: multipurpose template catalog, page breadth, UI kit/docs/customizer, and packaged asset positioning.
- Output: `docs/research/product-system-exemplars.md`.

### R5 - Local Design Work Audit

Goal: integrate prior Yusung design-system efforts without duplicating or overwriting.

- Audit `design-manual`, `claude-design-manual`, and design-related custom skills.
- Classify each source as merge, link, supersede, or archive.
- Output: `docs/research/local-design-system-integration-audit.md`.

## Priority Order

1. R1 Tailwind Site And Plus System: highest continuity with current work.
2. R5 Local Design Work Audit: prevents duplicate effort and recovers prior design-system thinking.
3. R3 Mobile Platform Baseline: corrects the web-only bias early.
4. R4 Product-System Exemplars: expands beyond Tailwind into SaaS, fintech, developer-tool, and multipurpose template quality bars.
5. R2 Tailwind Labs Repo Deep Dive: valuable, but should follow site/reference model clarity.

## DSF2 Completion Check

DSF2 is complete when this document exists and answers:

- which sources matter first;
- what each source contributes;
- what must not be copied;
- how every future capture creates evidence;
- where Tailwind repo deep dive fits relative to the website/documentation work.
