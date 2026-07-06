# ADR 0002 - Expand To A Digital Product Design System

## Status

Accepted

## Context

The project began as a UI vocabulary encyclopedia for people who needed better names, examples, and prompt phrases for UI elements. Recent work expanded the site toward Tailwind Plus-style page catalogs, documentation pages, interactive component examples, and reference-backed visual parity.

The intended product is now broader. It should become Askewly Design: a human-facing website and an agent-facing implementation system for producing better product UI with Codex and Claude Code.

## Decision

Reframe the project from "UI Vocabulary Encyclopedia" to "Askewly Design."

The system covers websites, mobile apps, SaaS products, commerce flows, dashboards, documentation sites, marketing pages, internal tools, and application UI. The public site remains the primary surface, but the repository must also produce agent-readable tokens, pattern rules, component recipes, prompts, anti-patterns, and reusable code/assets.

## Rationale

- A vocabulary site is useful, but it is too narrow for the actual goal: proving and reusing a coherent design capability.
- Tailwind parity work is more valuable when treated as reference-backed design-system training, not as isolated copied pages.
- Codex and Claude Code need structured design guidance to avoid generic AI-looking interfaces.
- Existing local efforts such as `design-manual`, `design-bootstrap`, `design-harness`, and `design-bridge` can later be integrated under this broader system.

## Consequences

- `docs/OBJECTIVE.md`, `ROADMAP.md`, `docs/PRD.md`, and `docs/ARCHITECTURE.md` become the main product contract.
- Future reference research should explain what is being borrowed, adapted, or rejected.
- Payment, accounts, and licensing remain future concerns until the browseable and agent-usable asset model is coherent.
- ADR 0001 remains valid for the current static React website, but it now describes the first delivery vehicle rather than the entire product.
