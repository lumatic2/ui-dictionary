---
id: spring-drag-snap-card
name: "Spring Drag Snap-back Card"
pattern_group: application-ui
kind: motion-pattern
status: draft
surface_refs: [websites, mobile-apps, saas-dashboards]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.surface.muted
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - dimension.radius.lg
code_asset: examples/ui-vocabulary-site/src/components/spring-drag-snap-card.tsx
component_refs: []
term_refs: []
source_refs: []
last_verified: 2026-07-17
---

## Intent

A draggable element that springs back to origin on release, demonstrating the property that makes springs the production default for drag/reorder/dismiss interactions: **interruptibility**. Grab the card mid-return and the spring re-targets from its current velocity — a duration/easing tween would snap or restart. Tier ② — physics integration runs in JS each frame; rendering stays on CSS transform.

## Anatomy

- A bounded field (the drag constraint) and a draggable card inside it.
- Spring-driven return to origin on release (`stiffness`/`damping` as the feel knobs — no durations).
- Slight scale-up while dragging as the "held" affordance; `touch-none select-none` so the gesture owns the pointer.
- Reduced-motion branch: return becomes effectively instant (very stiff spring), gesture still works.

## States

- Rest / Held (scale cue, grabbing cursor) / Released mid-field (spring return) / Re-grabbed mid-return (spring re-targets, no snap).
- Reduced motion: drag works, return is immediate.

## Variants

- Snap-back demo (this recipe) — the teaching form.
- Dismiss threshold: past a distance, release triggers an action instead of return (pair with an explicit non-gesture alternative — anti-patterns cluster 3).
- Reorder: spring settles items into their new slots.

## Code

```tsx
<motion.div
  drag
  dragConstraints={fieldRef}
  dragElastic={0.2}
  dragSnapToOrigin
  dragTransition={{ bounceStiffness: 380, bounceDamping: 24 }}
  whileDrag={{ scale: 1.04 }}
/>
```

## Checks

- Return is interruptible: re-grabbing mid-flight continues from current position/velocity without a jump.
- Springs are tuned with stiffness/damping, not durations — one shared tuning across a product's drag surfaces.
- When drag triggers real actions (dismiss/reorder), a keyboard/button alternative exists (gesture is never the only path).
- `prefers-reduced-motion` removes the bounce, not the function.

## Anti-patterns

- **Tween return**: animating the release with `duration`/`ease` — snaps on re-grab and feels dead; the exact failure springs exist to fix.
- **Unconstrained drag**: no `dragConstraints`, letting the card leave its context and cover unrelated UI.
- **Gesture-only action**: drag-to-dismiss with no visible alternative control.
- **Per-instance spring tuning**: every card with different stiffness/damping reads as inconsistency, not physics.

## Agent notes

- prompt_phrases: "spring snap-back drag with interruptible return and reduced-motion instant fallback", "stiffness/damping-tuned drag release, no duration tweens"
- fallbacks: on devices without precise pointers the same gesture works via touch; if drag must trigger actions, add explicit buttons for the same actions.
- canonical guidance: `knowledge/expressive-stack.md` decision row "스프링·관성 있는 UI 모션"(②); `docs/design-system/anti-patterns.md` cluster 3 (accessible interaction paths).
