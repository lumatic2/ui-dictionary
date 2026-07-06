---
id: showcase-card
name: "Showcase Card"
pattern_group: application-ui
kind: block
status: draft
surface_refs: [websites, saas-dashboards]
tokens_used:
  - color.semantic.surface.raised
  - color.semantic.surface.muted
  - color.semantic.border.default
  - color.semantic.border.accent
  - color.semantic.text.default
  - color.semantic.text.muted
  - dimension.radius.md
  - dimension.space.4
  - dimension.space.2
  - typography.scale.xl
  - typography.weight.medium
code_asset: examples/ui-vocabulary-site/src/components/home-page.tsx
component_refs: []
term_refs: [card, hero]
source_refs: [tailwind-plus-application-ui]
last_verified: 2026-07-07
---

## Intent

A showcase card is a self-contained shell that proves an interaction capability rather than describing it: a header (icon, title, one-line copy) sits above a bounded demo region that runs a live, interactive product-interface behavior. The demo is the content — the header only orients the reader before they touch it. This is the recurring shell behind the Askewly Design landing atlas (`docs/plans/2026-07-05-showcase-atlas-upgrade.md`), used once per capability (physics interaction, cursor field, agent-ready canvas, etc.).

## Anatomy

```
<article>                          -- outer card frame, rounded, bordered, elevated on hover
  <header row>
    <icon>                         -- line-art glyph, fixed box
    <title + copy>                 -- h3 + one-line supporting sentence
  <demo region>                    -- bordered sub-surface, fixed/min height, overflow-hidden
    <interactive canvas/controls>  -- the actual capability (pointer, drag, physics, toggle, etc.)
```

The demo region is visually subordinate (muted surface, inset border) so the header always reads as the "label" and the demo as the "proof."

## States

- **idle**: card at rest, demo region shows a settled/neutral frame (not a blank one) so the capability is legible even before interaction.
- **hover**: outer card lifts slightly and border shifts to the accent tone; signals the card is inspectable, independent of whether the inner demo also has its own hover behavior.
- **demo active (pointer entered / interaction started)**: pointer, drag, or toggle input inside the demo region changes visible state (position, filter, layout, selection) in real time. This state is the actual deliverable of the recipe — a card without it is not a showcase card, it is a static tile.
- **reduced-motion fallback**: when `prefers-reduced-motion: reduce` is set, continuous/looping motion (auto-playing progress, physics drift, shader loops) must resolve to a single stable frame that still shows the relationship the motion demonstrates (e.g., final layout state instead of a mid-animation frame). Discrete interaction (pointer-driven force, drag) may keep responding to direct input even under reduced motion, since it is user-initiated, not autoplaying.

## Variants

- **pointer/force-field demo** — continuous physics or field response to cursor position (e.g. `MatterPhysicsDemo`), no discrete controls needed.
- **stateful control demo** — explicit buttons/toggles drive state (e.g. material mode, treatment filter, mobile nav step) instead of ambient pointer tracking.
- **wide/span variant** — card spans multiple grid columns for demos that need horizontal room (image treatment strip); anatomy is unchanged, only the outer grid span differs.

## Code

```tsx
function AtlasCard({ item }: { item: (typeof atlasItems)[number] }) {
  return (
    <article
      className={cn(
        "group flex h-full min-w-0 flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-askewly-lavender hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]",
        item.layout,
      )}
    >
      <div className={cn("grid gap-5 p-6 sm:grid-cols-[5.75rem_minmax(0,1fr)]")}>
        <div className="flex items-start justify-center sm:justify-start">
          <LineArtIcon id={item.id} />
        </div>
        <div className="min-w-0">
          <h3 className="text-2xl font-semibold tracking-normal text-slate-950">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col border-t border-slate-200 bg-slate-50 p-5">
        <AtlasDemo id={item.id} />
      </div>
    </article>
  )
}
```

`bg-white` / `bg-slate-50` / `border-slate-200` map to `color.semantic.surface.raised` / `color.semantic.surface.muted` / `color.semantic.border.default`; `hover:border-askewly-lavender` maps to `color.semantic.border.accent`. Full demo implementation lives in `code_asset` (`AtlasDemo`, `MatterPhysicsDemo`, and sibling demo functions).

## Checks

- Header renders icon + title + one-line copy without the demo region clipping or pushing the header off-screen at the card's narrowest supported width.
- Demo region responds to its documented input (pointer move, drag, click/toggle) with a visible state change — verified interactively (Chrome smoke), not just build/lint.
- With `prefers-reduced-motion: reduce` simulated, any autoplaying/looping element inside the demo region settles to one stable, legible frame instead of freezing mid-motion or continuing to animate.
- Card hover state (lift + border accent) is visible independent of whether the pointer is inside the demo sub-region.
- `npm run build` and `npm run lint` pass for `examples/ui-vocabulary-site`.

## Anti-patterns

- **Isolated toy**: a demo that animates but maps to no real product-interface capability (no analogue in websites/SaaS/dashboards/commerce) — the showcase plan's skeptic perspective flags this explicitly; every card must justify itself as a reusable interaction, not decoration.
- **No stable frame**: motion that never has a coherent "paused" or settled composition — if a screenshot at any random instant looks broken or mid-collision, the demo fails the idle/reduced-motion requirement.
- **Perpetual motion with no exit**: a loop that runs forever with no way to reach a resting state (no completion, no pause) reads as a screensaver, not a product state machine; reduced-motion users have no valid fallback frame to land on.
- **Card nested in card**: stacking a second bordered/elevated "card" chrome inside the demo region duplicates the outer article's framing and confuses which surface is the actual interactive content; the demo region itself is the inner boundary — it should not re-introduce its own card shell.

## Agent notes

- `prompt_phrases`: "add a showcase card for <capability>", "wrap this interactive demo in the showcase card shell", "give this demo an idle/hover/reduced-motion state".
- `fallbacks`: if the capability has no natural continuous motion (e.g. a discrete toggle demo), the "demo active" state can be satisfied by state change on click/toggle alone — a reduced-motion fallback is only required when the demo has autoplaying or looping motion in the first place.
- When implementing a new card, start from `AtlasCard` (outer shell) and add a new branch to `AtlasDemo` (or a dedicated component like `MatterPhysicsDemo`) rather than inventing a new outer card wrapper.
