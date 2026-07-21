---
id: lazy-three-object-scene
name: "Lazy three.js Object Scene"
pattern_group: application-ui
kind: visual-effect
status: draft
surface_refs: [websites, commerce]
tokens_used:
  - color.semantic.action.primary
  - color.semantic.surface.muted
  - color.semantic.text.muted
  - color.semantic.border.default
  - dimension.radius.lg
code_asset: examples/ui-vocabulary-site/src/components/lazy-three-object-scene.tsx
component_refs: []
term_refs: []
source_refs: []
last_verified: 2026-07-17
---

> **STOP — do not re-implement this recipe from prose.** A verified code asset exists: fetch https://ui.askewly.com/r/lazy-three-object-scene.json, write `files[].content` into the project, install the declared dependencies, THEN restyle the look to the project's own tokens (mandatory — component-restyle.md). Prose below is the contract you verify against, not the thing you rebuild.

## Intent

A real 3D object (lighting, depth, materials) rendered with three.js via React Three Fiber, loaded strictly behind a dynamic import. Tier ④ in `knowledge/expressive-stack.md` — CSS `perspective` can fake a rotated plane but cannot do lit, shaded geometry. The recipe's load-bearing part is the delivery contract: three.js is a ~155KB gzip fixed cost, so **the lazy boundary is not an optimization, it is the pattern** (judgment rule 4: tier ④ requires lazy-load).

## Anatomy

- Two modules: a light wrapper (this recipe's code_asset) and a heavy implementation module that is the only place importing `three`/`@react-three/fiber`, reached exclusively via `React.lazy(() => import(...))`.
- `<Suspense>` skeleton for the chunk-loading state.
- An error boundary around the scene: WebGL/context failure renders a static fallback, never a broken canvas.
- Material color read from the document's token custom properties at mount.
- Auto-rotation gated by `prefers-reduced-motion` (checked in JS — render loops are not auto-suppressed by the media query).

## States

- Chunk loading: Suspense skeleton (visible on first visit; instant afterward from cache).
- Rendering: lit object, slow auto-rotation.
- Reduced motion: static object, no rotation — scene still renders.
- WebGL unavailable: boundary fallback with plain text/imagery — content never depends on the scene.

## Variants

- Product/object viewer (add pointer-drag orbit).
- Brand hero object (this demo).
- Shader-material variant — same lazy contract, custom GLSL material.

## Code

```tsx
const ThreeObjectSceneImpl = lazy(() => import("@/components/three-object-scene-impl"))

<SceneBoundary fallback={staticFallback}>
  <Suspense fallback={<Skeleton />}>
    <ThreeObjectSceneImpl />
  </Suspense>
</SceneBoundary>
```

## Checks

- The build emits three.js as a separate chunk; the main bundle's size does not grow beyond noise (measure before/after).
- No module outside the lazy implementation imports `three` or `@react-three/fiber` — one static import anywhere defeats the split.
- Reduced motion stops auto-rotation in the render loop (JS check, not CSS).
- WebGL failure path shows the static fallback (error boundary, not a blank canvas).
- Material colors derive from token variables — no hex in scene code.

## Anti-patterns

- **Static import creep**: importing three.js types/helpers from the wrapper or shared modules — silently drags the whole library into the main chunk.
- **3D as page furniture**: mounting scenes in headers/nav rendered on every page — GPU and battery cost for decoration (signature principle 5: manual opt-in).
- **Ignoring context loss**: no error boundary means a driver hiccup leaves a dead black canvas.
- **Unconditional auto-rotate**: continuous camera/object motion without a reduced-motion gate is a WCAG 2.3.3 risk (vestibular triggers).

## Agent notes

- prompt_phrases: "React.lazy three.js scene with Suspense skeleton, WebGL error boundary, token-derived material, reduced-motion rotation gate"
- fallbacks: keep a DOM/text equivalent of any information the scene carries; the scene itself must always be droppable.
- canonical guidance: `knowledge/expressive-stack.md` tier ④ rows + 판정 절차 3·4; bundle/lazy sources in `research/2026-07-17-expressive-stack-genealogy.md` (React 통합·번들 전략).
