# Askewly Design Landing First Screen Plan

Date: 2026-07-05
Status: planning, no implementation yet

## Input Decisions

- Product name: Askewly Design.
- Theme: white-first.
- Top navigation: keep current compressed navigation.
- Hero title: centered.
- Design source of truth: root `DESIGN.md`.
- Palette extracted from user reference image:
  - `#6F2DBD` violet
  - `#A663CC` orchid
  - `#B298DC` lavender
  - `#B8D0EB` sky
  - `#B9FAF8` mint

## First Viewport Goal

The first screen should make Askewly Design feel like a design-system product, not a generic SaaS landing page.

The user should understand three things without scrolling:

1. Askewly Design is the public site for browsing UI patterns and product surfaces.
2. It is also an agent-facing design system for Codex and Claude Code.
3. The site has real structure: Docs, Patterns, Showcase, Resources, and Pro.

## Proposed First Screen

### Header

Keep the existing top navigation shape:

- Brand: Askewly Design.
- Links: Docs, Patterns, Showcase, Resources, Pro.
- Right side can keep compact search/theme/pro affordances if already present.

Style:

- White background or very subtle translucent white.
- No large nav pills.
- Active/hover state uses a thin violet/orchid underline or text color shift.

### Hero Copy

Centered layout.

H1 direction:

```text
Askewly Design
```

Supporting line options:

```text
Design systems for interfaces that need to feel built, not generated.
```

or

```text
A public UI atlas and agent-ready design system for building sharper product interfaces.
```

CTA pair:

- Primary: Explore Patterns
- Secondary: Open Docs

### Hero Proof Surface

Below the centered hero copy, show one restrained product proof surface.

It should not be a random dashboard. It should look like the Askewly Design product itself:

- left rail: Docs, Patterns, Showcase, Resources, Pro
- center: selected pattern or page preview
- right inspector: tokens, states, motion, accessibility, agent notes
- small chips: Light/Dark synced, Responsive states, Pro code, Agent prompt

Palette use:

- Violet for selected nav/primary action.
- Orchid/lavender for secondary state and borders.
- Sky/mint for subtle preview wash and agent-ready status.

## What Not To Build

- Do not use a split left-text/right-card hero.
- Do not fill the whole page with purple gradients.
- Do not make fake analytics metrics the main proof.
- Do not create many unrelated floating cards.
- Do not start Marketing/Application/Ecommerce page interactivity work before this homepage direction is accepted.

## Implementation Boundary

No code changes in this planning step.

Next implementation target, when approved:

- `examples/ui-vocabulary-site/src/components/home-page.tsx`
- possibly `examples/ui-vocabulary-site/src/index.css` for token mapping
- verify with Chrome desktop/mobile screenshots
