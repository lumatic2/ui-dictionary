---
id: grain-texture-overlay
name: "Grain Texture Overlay"
pattern_group: marketing
kind: visual-effect
status: draft
surface_refs: [websites, commerce]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - dimension.radius.lg
code_asset: examples/ui-vocabulary-site/src/components/grain-texture-overlay.tsx
component_refs: [mesh-gradient-surface]
term_refs: []
source_refs: []
last_verified: 2026-07-17
---

## Intent

A grain texture overlay layers subtle procedural noise above a gradient or brand surface — it removes visible banding on smooth gradients and adds analog film texture. Tier ① (SVG): CSS `filter` alone cannot generate procedural noise, so an SVG `feTurbulence` tile embedded as a data URI does the work — still zero JS, zero requests, zero dependencies.

## Anatomy

- A noise tile: inline SVG data URI with `feTurbulence type="fractalNoise"` + desaturating `feColorMatrix`, sized ~180px and tiled by `background-repeat`.
- An absolutely-positioned overlay div above the surface, `mix-blend-soft-light`, opacity as the strength knob (keep ≤0.3).
- `aria-hidden="true"` and `pointer-events: none` — the layer is pure decoration and must never intercept interaction or reach assistive tech.
- The host container clips the overlay (`overflow-hidden`).

## States

- Static only — grain that animates ("TV static") is a different, attention-grabbing effect and an experimental touch requiring manual opt-in (signature principle 5).
- Dark mode: soft-light blending adapts to the underlying tokens; verify strength doesn't muddy dark surfaces (grain reads stronger on dark).

## Variants

- Banding fix over `mesh-gradient-surface` (the default pairing).
- Brand texture over solid accent sections.
- Photo treatment: consistent grain across an image set (aligns with the site's Image Treatment showcase).

## Code

```tsx
const GRAIN_SVG = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>',
)

<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 mix-blend-soft-light"
  style={{ backgroundImage: `url("data:image/svg+xml,${GRAIN_SVG}")`, opacity: strength }}
/>
```

## Checks

- Overlay is `aria-hidden` + `pointer-events: none` — no interaction path or screen-reader noise.
- Strength stays subtle (≤0.3) and identical across surfaces in one product.
- Noise tile uses `stitchTiles="stitch"` so the repeat seam is invisible.
- Text over the grained surface still passes contrast (grain lowers effective contrast slightly).

## Anti-patterns

- **Grain as loading noise**: animating the noise tile — becomes a distraction and a `prefers-reduced-motion` violation.
- **Heavy grain**: opacity above ~0.4 reads as dirt, not texture, and visibly degrades text contrast.
- **PNG noise asset**: shipping a raster noise image when the SVG data URI is smaller, resolution-independent, and request-free.
- **Interactive layer on top**: placing the overlay above buttons without `pointer-events: none` silently kills clicks — the failure is invisible in a screenshot.

## Agent notes

- prompt_phrases: "feTurbulence grain overlay as data URI with soft-light blending to fix gradient banding", "aria-hidden pointer-events-none film grain layer over a token-derived surface"
- fallbacks: if SVG filters are unavailable (vanishingly rare), the overlay simply doesn't render — the surface below remains fully functional.
- canonical guidance: `knowledge/expressive-stack.md` tier ① decision row "그레인/필름 노이즈 텍스처".
