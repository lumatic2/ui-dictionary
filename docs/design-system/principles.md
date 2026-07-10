# Askewly Design Principles

Status: canonical draft for SCD1 user review

Audience: coding agents and contributors

Derivation rule: every principle below must remain traceable to existing repository evidence. Human-facing articles may summarize this file, but must not become a second source of truth.

## 1. Start from the user's task, not a decorative composition

Choose the product surface and the user's job before choosing components. Establish semantic structure, content hierarchy, and one clear focal action before adding visual treatment. A large hero, card grid, or dashboard shell is not a substitute for the real working surface.

Agent application:

- Name the user task and surface before proposing layout.
- Build landmarks, heading order, information hierarchy, and the primary action first.
- Reject ornamental sections that do not help the user understand or complete the task.

Evidence:

- `docs/PRD.md` (`Problem`, `Core Experiences`, `Success Criteria`)
- `examples/ui-vocabulary-site/src/lib/documentation-pages.ts` (`Getting set up`, `Using HTML`)
- `DESIGN.md` (§4 Spacing & Layout, §7 Components)

## 2. Make hierarchy through restraint, not uniform emphasis

A polished interface does not make every element loud. Reserve solid accent treatment for the dominant action, keep secondary actions quieter, and use spacing, type, borders, and surface changes before adding shadow or decoration. One strong focal area should organize each viewport.

Agent application:

- Identify one dominant action or focal region per viewport.
- Demote supporting actions with outline, ghost, muted text, or placement rather than competing fills.
- Avoid nested cards, heavy shadows, oversized pills, and one-note gradients as default hierarchy tools.

Evidence:

- `DESIGN.md` (§4 Spacing & Layout, §5 Radius & Borders, §6 Elevation & Motion, §8 Anti-patterns)
- `recipes/forms/button.md` (`Anti-patterns`)
- `recipes/application-ui/showcase-card.md` (`Anti-patterns`)

## 3. Use tokens by intent and keep the source of truth singular

Implementation should reference semantic or component tokens that describe intent. Primitive values, hex colors, and ad hoc dimensions must not leak into recipes or product code when a system token exists. Generated files and human-facing explanations are derived surfaces, not competing sources of truth.

Agent application:

- Prefer `color.semantic.*`, `color.component.*`, `dimension.*`, and `typography.*` references.
- Edit `tokens/askewly.tokens.json`, then regenerate derived token artifacts.
- Do not copy token values into prose or introduce local literals to bypass the system.

Evidence:

- `docs/design-system/recipe-format.md` (`Frontmatter`, `검증 계약`, `소비 규약`)
- `docs/design-system/figma-bridge-contract.md` (§1, §2.2)
- `DESIGN.md` (generated header and token model)

## 4. Prefer specific product evidence over generic AI-looking proxies

Every example should prove a reusable interface capability in its stated context. Fake metrics, arbitrary gradients, decorative blobs, and generic SaaS dashboards are weak substitutes for meaningful content, interaction, and domain structure. Copy should define the concept, not narrate the demo's animation.

Agent application:

- Use realistic labels, data, states, and actions that fit the named product surface.
- Explain which transferable capability an example demonstrates.
- Remove fake KPI dashboards or decorative motion when they do not support the concept.
- Write showcase copy as a concise definition of the term.

Evidence:

- `docs/PRD.md` (`Problem`, `Success Criteria`)
- `recipes/marketing/landing-hero.md` (`Anti-patterns`)
- `recipes/application-ui/showcase-card.md` (`Anti-patterns`)
- `CLAUDE.md` (`Showcase Atlas 카드 카피`)

## 5. Complete the interaction contract, including failure and edge states

A component is not complete when only its pointer-driven happy path works. Keyboard navigation, focus movement and return, empty results, errors, dismissal, viewport collision, responsive fallback, and observable feedback are part of the design.

Agent application:

- Define idle, hover, focus, active, selected, loading, disabled, empty, error, and success states as applicable.
- Verify keyboard and focus behavior independently from mouse behavior.
- Provide observable empty and failure feedback instead of silently closing or doing nothing.
- Check narrow viewports and collision behavior for overlays and floating surfaces.

Evidence:

- `examples/ui-vocabulary-site/src/lib/documentation-pages.ts` (`Getting set up`, `Using React`, element articles)
- `recipes/navigation/topbar-command-search.md` (`Anti-patterns`)
- `recipes/overlays/popover.md` (`Anti-patterns`)

## 6. Design the still frame first; use motion to explain change

Motion should clarify focus, state, sequence, or progression. The interface must remain coherent when animation is paused or reduced, and every loop needs a valid resting state. Perpetual activity without meaning reads as decoration rather than product behavior.

Agent application:

- Make the initial, settled, and reduced-motion frames independently usable.
- Use short transitions to reveal causality or state change.
- Reject perpetual or collision-like motion that has no completion, pause, or stable composition.

Evidence:

- `DESIGN.md` (§6 Elevation & Motion, §8 Anti-patterns)
- `recipes/application-ui/showcase-card.md` (`Checks`, `Anti-patterns`)
- `docs/design-system/site-blueprint.md` (`Section Completion Criteria`)

## 7. Publish only what is complete enough to earn trust

Public navigation is a promise. Do not expose empty collections, placeholder cards, unavailable downloads, or sales surfaces without real assets. Preserve unfinished definitions behind development gates, then open them only after realistic content, interaction, responsive behavior, and implementation evidence pass their section-specific criteria.

Agent application:

- Treat exposure gates as publication controls, not deletion mechanisms.
- Keep unfinished data available in development while hiding it from production discovery.
- Require realistic content, light/dark readability, and working interaction or reusable code before public exposure.
- Display real counts and capabilities rather than aspirational inventory.

Evidence:

- `docs/design-system/site-blueprint.md` (`Production Exposure Policy`, `Section Completion Criteria`)
- `docs/PRD.md` (`Copy And Reuse`, `Success Criteria`)

## 8. Adapt references into Askewly's system; do not inherit another identity

External products are evidence, not a visual identity to copy. Capture provenance, state what is learned, map the transferable rule into Askewly tokens and contracts, and explicitly reject details that conflict with the system's quiet white surfaces and intentional asymmetry.

Agent application:

- Record source, learned pattern, adaptation, and rejection before implementation.
- Re-express adopted decisions through Askewly semantic tokens and component contracts.
- Do not reproduce another product's branded composition, palette, or ornamental signature.

Evidence:

- `docs/ARCHITECTURE.md` (`Reference Intake Direction`)
- `docs/PRD.md` (`MVP Direction`, `Non-Goals`)
- `DESIGN.md` (§1 Personality, §2 Color)

## Consumer checklist

Before presenting an implementation as Askewly Design aligned, confirm:

1. The user task, surface, hierarchy, and dominant action are explicit.
2. Semantic tokens carry visual intent; avoidable literals do not.
3. Content and interaction are specific to the product context.
4. Keyboard, focus, empty/error, responsive, and reduced-motion paths are covered where relevant.
5. Public exposure matches the asset's actual completion level.
6. External references are traceable adaptations, not copied identity.
