---
id: mesh-gradient-surface
name: "Mesh Gradient Surface"
pattern_group: marketing
kind: visual-effect
status: draft
surface_refs: [websites, saas-dashboards, commerce]
tokens_used:
  - color.semantic.action.primary
  - color.semantic.accent.base
  - color.semantic.surface.base
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - dimension.radius.lg
code_asset: examples/ui-vocabulary-site/src/components/mesh-gradient-surface.tsx
component_refs: [glass-panel, grain-texture-overlay]
term_refs: []
source_refs: []
last_verified: 2026-07-17
---

> Code asset (start here, then restyle to project tokens): https://ui.askewly.com/r/mesh-gradient-surface.json

## Intent

A mesh gradient surface gives a hero, brand section, or empty backdrop an organic multi-point color field without imagery. Tier ① (CSS-only) in `knowledge/expressive-stack.md`: several radial-gradient layers stacked on one element approximate a mesh — no JS, no dependency, static by default. Use it where a flat token background feels inert but a photo or 3D scene would be overkill.

## Anatomy

- One container with 3–5 `radial-gradient` background layers, each positioned at a different corner/edge.
- Every color stop derived from project tokens via `color-mix(in oklch, var(--token) N%, transparent)` — never literal stops, so the surface re-themes with the token system.
- A base `background` token underneath so uncovered areas stay on-theme in both modes.
- Foreground content slot; the surface itself is decoration and carries no semantics.

## States

- Static (default): no animation — the field is composition, not motion.
- Animated (opt-in only): color-stop drift via `@property` registered custom properties; must respect `prefers-reduced-motion` and is an experimental touch (signature principle 5 — manual opt-in).
- Dark mode: mixes against the dark `background` token automatically because stops are token-derived — verify contrast of overlaid text in both modes.

## Variants

- Hero backdrop (full-bleed, content overlaid).
- Card/section accent (bounded, rounded, bordered).
- Backdrop for glass surfaces (pair with `glass-panel` — the blur needs a busy background to be visible).
- Dark-base aura: on a near-black base, confine the gradient layers to one region (typically the top) as a soft aura and float content cards above it — mood without sacrificing content contrast (taste ledger T-10).

## Code

```tsx
const style: CSSProperties = {
  backgroundImage: [
    "radial-gradient(42% 55% at 18% 22%, color-mix(in oklch, var(--primary) 34%, transparent) 0%, transparent 100%)",
    "radial-gradient(50% 60% at 82% 18%, color-mix(in oklch, var(--accent) 65%, transparent) 0%, transparent 100%)",
    "radial-gradient(55% 65% at 70% 85%, color-mix(in oklch, var(--primary) 22%, transparent) 0%, transparent 100%)",
    "radial-gradient(40% 45% at 12% 88%, color-mix(in oklch, var(--accent) 40%, transparent) 0%, transparent 100%)",
  ].join(", "),
}
return <div className="relative overflow-hidden bg-background" style={style}>{children}</div>
```

## Checks

- All gradient stops derive from semantic tokens via `color-mix` — zero literal colors.
- Text overlaid on the surface passes WCAG contrast in light and dark modes (test at the busiest gradient intersection).
- The surface renders acceptably with banding on low-bit displays — pair with `grain-texture-overlay` when banding is visible.
- Container clips its layers (`overflow-hidden`) so gradients never bleed past the radius.

## Anti-patterns

- **Invented palette**: hardcoded pastel/purple stops that ignore the project's tokens — the exact failure the style signature's token-derivation principle exists for.
- **Decorative blob divs**: extra absolutely-positioned blurred circles to fake the mesh — one element with layered gradients does it cheaper and stays in normal flow.
- **Tier escalation**: reaching for a WebGL shader when the gradient is static — per the expressive-stack decision table, animated organic noise justifies tier ④, a static field does not.
- **Unreadable overlay**: dropping body text on the gradient without checking the busiest region's contrast.

## Agent notes

- prompt_phrases: "token-derived mesh gradient hero backdrop from layered radial-gradients", "CSS-only multi-point color field using color-mix over project tokens"
- fallbacks: browsers without `color-mix` support fall back to the base background token (layers resolve invalid) — surface degrades to a flat themed background, never breaks.
- canonical guidance: `knowledge/expressive-stack.md` tier ① + decision table row "메시/원뿔형 그라디언트 배경".
