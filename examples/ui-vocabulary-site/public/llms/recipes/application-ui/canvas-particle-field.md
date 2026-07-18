---
id: canvas-particle-field
name: "Canvas Particle Field"
pattern_group: application-ui
kind: visual-effect
status: draft
surface_refs: [websites]
tokens_used:
  - color.semantic.action.primary
  - color.semantic.surface.base
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - dimension.radius.lg
code_asset: examples/ui-vocabulary-site/src/components/canvas-particle-field.tsx
component_refs: []
term_refs: []
source_refs: []
last_verified: 2026-07-17
---

> Code asset (start here, then restyle to project tokens): https://ui.askewly.com/r/canvas-particle-field.json

## Intent

A canvas particle field draws dozens-to-hundreds of drifting dots into a 2D pixel buffer as ambient backdrop texture. Tier ③ in `knowledge/expressive-stack.md`: at this element count, DOM nodes pay layout/paint cost per node while the canvas pays none. An experimental/showcase touch (signature principle 5) — hero and event surfaces on request, never behind forms or data UI.

## Anatomy

- One `<canvas>`, `aria-hidden` + `pointer-events: none` — pure decoration, invisible to assistive tech and input.
- Dot color read from the element's computed token variables (`--primary`) at mount — no hardcoded colors in the draw loop.
- Device-pixel-ratio scaling so dots stay crisp on high-DPI screens.
- A component-owned rAF loop, cancelled on unmount; particle positions wrap at edges.
- Deterministic pseudo-random seeding (index arithmetic) so renders are stable across mounts.

## States

- Animating (default when motion allowed): slow drift, subtle alpha variation.
- Reduced motion: **a single static frame is drawn and the loop never starts** — canvas loops are JS-driven and are not auto-suppressed by the media query, so the branch is explicit.
- Unmounted: rAF cancelled — no leaked frame callbacks.
- Foreground content: always rendered above the canvas with intact contrast.

## Variants

- Ambient hero backdrop (this demo).
- Cursor-influenced field: pointer position biases drift — still tier ③, adds a throttled pointermove listener.
- Density variants: fewer/larger dots for texture, more/smaller for dust.
- Margin-confined field: particles occupy only the whitespace beside the content axis (e.g. left margin), leaving the reading column fully undecorated — ambient energy without competing with content (taste ledger T-12, Antigravity measured).

## Code

```tsx
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  draw() // one static frame, no loop
  return
}
let frame = requestAnimationFrame(tick)
return () => cancelAnimationFrame(frame)
```

## Checks

- rAF loop cancelled on unmount (cleanup returns `cancelAnimationFrame`).
- Reduced-motion branch draws a static frame instead of animating.
- Canvas never intercepts pointer events or appears in the accessibility tree.
- Dot color derives from token custom properties — re-themes with dark mode on remount.
- Text over the field passes contrast; the field's alpha stays low (≤0.75 peak).

## Anti-patterns

- **DOM particles**: rendering each dot as a div — the exact per-node cost this tier exists to avoid.
- **Unkilled loop**: missing `cancelAnimationFrame` cleanup keeps the loop alive after unmount, wasting CPU on an invisible canvas.
- **Media-query-only motion gating**: assuming `prefers-reduced-motion` CSS will stop a JS loop — it will not; the branch must be in code.
- **Interactive canvas**: putting the field above clickable UI without `pointer-events: none`.

## Agent notes

- prompt_phrases: "aria-hidden canvas particle backdrop with token-derived dot color, rAF cleanup, and explicit reduced-motion static frame"
- fallbacks: if canvas is unavailable, render nothing — the surface below is complete without it.
- canonical guidance: `knowledge/expressive-stack.md` decision row "수백 개 파티클·커서 트레일"(③) + 판정 절차 3(③④ 티어 reduced-motion 의무).
