---
id: magnetic-hover-button
name: "Magnetic Hover Button"
pattern_group: marketing
kind: motion-pattern
status: draft
surface_refs: [websites]
tokens_used:
  - color.semantic.action.primary
  - color.semantic.text.on-accent
  - color.semantic.border.focus
  - color.semantic.surface.muted
  - dimension.radius.md
code_asset: examples/ui-vocabulary-site/src/components/magnetic-hover-button.tsx
component_refs: [button]
term_refs: []
source_refs: []
last_verified: 2026-07-17
---

## Intent

A magnetic hover button leans toward the cursor while hovered and springs back on leave. Tier ② in `knowledge/expressive-stack.md`: CSS `:hover` cannot know where the cursor is, so JS reads pointer coordinates and a spring drives a CSS transform. **This is an experimental touch (signature principle 5): showcase and marketing CTAs on explicit request only — never a product-wide button default.**

## Anatomy

- A regular, fully functional button — the magnetism is additive decoration on top of an intact button contract.
- Pointer-move handler mapping cursor offset from center to a small translate (≤12px pull; attraction, not chase).
- Spring-smoothed motion values so entry, movement, and snap-back are continuous and interruptible.
- Reduced-motion branch that disables the lean entirely; keyboard focus/activation identical with or without magnetism.

## States

- Rest: plain button, token styling.
- Hover: leans toward cursor, spring-smoothed.
- Leave: springs back to origin (no teleport).
- Focus-visible: standard ring; magnetism does not react to keyboard focus (no fake pointer).
- Reduced motion: static button, all function preserved.

## Variants

- Single hero CTA (the canonical use).
- Icon button magnet in a showcase context.
- Whole-card magnet — larger surface, smaller pull.

## Code

```tsx
const springX = useSpring(x, { stiffness: 320, damping: 22 })

const handleMove = (event: React.PointerEvent) => {
  if (reduceMotion || !ref.current) return
  const rect = ref.current.getBoundingClientRect()
  x.set(((event.clientX - rect.left) / rect.width - 0.5) * 2 * pull)
}

<motion.button style={{ x: springX, y: springY }} onPointerMove={handleMove} onPointerLeave={reset} />
```

## Checks

- Click target and focus ring behave identically to a plain button — the lean never moves the hit area out from under the cursor (pull stays small).
- `prefers-reduced-motion` disables the lean.
- Spring returns to exact origin on leave — no residual offset accumulating across hovers.
- Used sparingly: at most one magnetic element per viewport.

## Anti-patterns

- **Magnetism as the default button**: applying it product-wide turns a signature accent into noise and violates restraint.
- **Large pull values**: >16px pull makes the button chase the cursor and misalign with its hit area.
- **Hover-only affordance**: any behavior difference for keyboard users beyond the missing lean — the button must work identically.
- **Tween instead of spring**: duration-based easing snaps when the cursor re-enters mid-return; the spring's interruptibility is the point.

## Agent notes

- prompt_phrases: "magnetic CTA with spring-smoothed pointer lean, reduced-motion off, intact keyboard contract"
- fallbacks: without pointer input (touch), the component is just a button — no degradation to handle.
- canonical guidance: `knowledge/expressive-stack.md` decision row "커서 추종·마그네틱 hover"(②); signature principle 5 (experimental touches are manual opt-in).
