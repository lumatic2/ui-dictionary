# PRD - Askewly Design

## Problem

AI-assisted UI work often produces generic screens: weak hierarchy, default-looking colors, inconsistent spacing, shallow interaction states, and visual patterns that feel assembled rather than designed. Designers can solve this with Figma systems and taste, but Codex and Claude Code need a durable design system they can read and apply directly.

The original UI vocabulary problem still matters: people need names, examples, and prompt language for UI parts. But the broader product goal is to turn those examples into a reusable design system for digital products.

## Product Goal

Build Askewly Design as:

- a public website for browsing UI patterns, product surfaces, color, typography, layout, motion, and examples;
- a paid asset surface where users can copy richer code and download reusable assets;
- an agent-facing system that Codex and Claude Code can use to implement polished product UI;
- a local CLI (`@askewly/design`) that lets agents and developers query, inject, and verify the design system inside their own projects (ADR 0004; the CLI core later powers a desktop app).

## Scope

The system covers digital product UI broadly:

- websites and landing pages;
- mobile apps;
- SaaS products and dashboards;
- commerce flows;
- documentation sites;
- marketing pages;
- internal tools and application UI;
- reusable components, states, interactions, and visual tokens.

## Target Users

- Askewly, as a designer-builder brand that wants durable proof of a reusable design system.
- Developers and operators using AI coding agents to build interfaces.
- Vibe-coding users who need better UI vocabulary, examples, and prompts.
- Product teams or solo builders who want reusable UI examples and code assets.

## Core Experiences

### Browse And Compare

Users can browse product surfaces, UI patterns, components, examples, typography, colors, layout systems, and interaction states with visual evidence.

### Learn The Language

Each pattern explains what it is, where it works, where it fails, related patterns, and how to ask an AI agent to implement it.

### Copy And Reuse

Free users can inspect examples and learn from them. Paid users eventually get broader code copy, asset download, and implementation packs.

### Agent Guidance

Codex and Claude Code can consume the same system as tokens, recipes, prompts, constraints, and anti-patterns.

### Create On A Code-Native Canvas

Agent Design is the desktop authoring surface. Users compose real React UI in frames, select and directly manipulate elements, bind tokens and typed properties, explore variants side by side, and ask a canvas-docked agent to revise the current selection. Canvas edits remain inspectable code and close with an exact diff plus browser verification.

## MVP Direction

The current static React site remains the first product surface. Tailwind/Tailwind Plus parity work is retained as reference-backed implementation evidence, but future work must label what is reference, what is adapted, and what belongs to Askewly Design.

Near-term MVP work should prioritize:

- Objective, ROADMAP, PRD, and Architecture alignment;
- reference strategy for Tailwind, Tailwind Labs, mobile guidelines, SaaS products, and local design-manual assets;
- surface taxonomy beyond web-only categories;
- an agent-usable asset model for tokens, patterns, examples, and code.
- the accepted ADR 0006 canvas topology: semantic DOM content, WebGPU editor plane with DOM fallback, SVG vector islands, and threshold-triggered native/Wasm hot paths;
- a canonical canvas document model that remains independent from its renderer and maps deterministically to code.

The public website structure is defined in `docs/design-system/site-blueprint.md`. That blueprint is the source of truth for the first landing page, top-level navigation, site map, page types, public/internal content boundaries, implementation order, and first vertical slice.

## Non-Goals

- Do not implement payments before the asset model and licensing boundaries are clear.
- Do not make the system web-only.
- Do not blindly copy Tailwind, Apple, Material, or SaaS product identities.
- Do not replace the human-facing website with only machine-readable docs.
- Do not import other local design repositories until a reference/integration strategy exists.
- Do not turn the first Agent Design horizon into a general vector illustration suite, multiplayer cloud editor, or general-purpose chat product.
- Do not lower the quality bar to a screenshot preview with decorative selection handles; direct manipulation must mutate canonical structure and round-trip to working UI code.

## Success Criteria

- The website shows a broad, coherent design system rather than only a term catalog.
- A user can understand differences between product surfaces such as mobile app, SaaS dashboard, commerce flow, documentation, and marketing page.
- Each major example has visual evidence and usable implementation guidance.
- Codex and Claude Code can use the system to produce UI with better hierarchy, spacing, typography, color, interaction states, and reduced AI-generic feel.
- Future paid features have a clear path: copyable code, downloadable assets, and reusable implementation packs.
- A representative Agent Design project can compose, directly edit, agent-revise, diff, apply, and verify a responsive React UI without canvas/browser drift.
