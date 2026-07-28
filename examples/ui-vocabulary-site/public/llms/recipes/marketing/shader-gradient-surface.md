---
id: shader-gradient-surface
name: "Shader Gradient Surface"
pattern_group: marketing
kind: motion-pattern
status: draft
surface_refs: [websites, commerce]
tokens_used:
  - color.semantic.surface.muted
  - color.semantic.border.default
  - color.semantic.action.primary
  - color.semantic.accent.base
  - dimension.radius.lg
code_asset: examples/ui-vocabulary-site/src/components/shader-gradient-surface.tsx
component_refs: []
term_refs: []
source_refs:
  - https://github.com/paper-design/shaders
last_verified: 2026-07-28
---

## Intent

A shader gradient surface gives a hero or brand section an **animated** organic color field computed per-frame on the GPU (Paper Shaders `MeshGradient`). Tier ④ in `knowledge/expressive-stack.md` — the tier boundary against `mesh-gradient-surface` (tier ①) is animation: layered CSS radial-gradients approximate a static mesh, but frame-by-frame organic noise motion cannot be expressed in CSS. If the surface can be static, stay on tier ① — this recipe exists for the escalation, not as the default.

## Anatomy

- A lazy boundary (`React.lazy` + Suspense) so the shader runtime never enters the initial chunk — the mandatory tier-④ delivery contract (judgment rule 4).
- Colors read from token CSS custom properties at mount (`getComputedStyle`) — no hardcoded hex; the shader is a renderer of the token system, not a new palette.
- A `prefers-reduced-motion` branch: `speed 0` renders a static organic field — same look, no motion.
- An error boundary whose fallback is a static CSS gradient built from the same token colors — WebGL failure degrades to tier ①, never to a broken canvas.
- `aria-hidden` — the surface is decoration; content must never live only inside it.

## States

- Loading: static token-gradient fallback (indistinguishable from the reduced/failure states — one visual contract).
- Running: animated organic field.
- Reduced motion: frozen frame (speed 0).
- WebGL unavailable: static CSS gradient fallback.

## Variants

- Hero backdrop (default): full-bleed behind hero content with an overlay for text contrast.
- Panel accent: bounded card/section surface (the demo form).
- Grain-mixed: add `grainMixer`/`grainOverlay` uniforms instead of stacking the separate grain-texture-overlay recipe.

## Code

```tsx
const MeshGradientLazy = lazy(() =>
  import("@paper-design/shaders-react").then((m) => ({ default: m.MeshGradient })),
)
// colors: token custom properties read at mount — never hardcoded hex
const colors = TOKEN_VARS.map((v) => getComputedStyle(host).getPropertyValue(v).trim()).filter(Boolean)
<Suspense fallback={staticTokenGradient}>
  <MeshGradientLazy colors={colors} distortion={0.8} swirl={0.5} speed={reduced ? 0 : 0.4} />
</Suspense>
```

## Checks

- Initial-chunk isolation: build output must show the shader module in a separate chunk; record the diff when adopting.
- Token roundtrip: changing the token custom properties changes the shader colors without code edits.
- Reduced-motion query honored at mount; failure fallback verified by forcing the boundary.
- Text over the surface passes contrast against the *darkest and lightest* frames, not one snapshot.

## Anti-patterns

- Hardcoding hex arrays into the shader (the showcase's earlier shortcut) — breaks the token SSOT and silently drifts from theme changes.
- Using this where a static gradient reads identically — tier violation; use `mesh-gradient-surface`.
- Placing readable content only inside the canvas — screen readers and fallback states lose it.
- Shipping the shader in the main bundle "because it's small" — the lazy boundary is the pattern, matching `lazy-three-object-scene`.

## Agent notes

- prompt_phrases: "animated GPU mesh gradient hero from project tokens", "shader gradient surface with reduced-motion freeze and static fallback"
- fallbacks: Suspense/loading, reduced-motion, and WebGL failure all resolve to the same static token gradient — one visual contract, three triggers.
- canonical guidance: `knowledge/expressive-stack.md` tier ④ + decision table row "애니메이팅되는 유기적 셰이더 그라디언트"; static alternative = `mesh-gradient-surface` (tier ①).

## Changelog

- 2026-07-28: 초판 (VI8 — VI7 A 대기 판정 집행, 쇼케이스 하드코딩 hex 를 토큰 판독으로 교정한 정본).
