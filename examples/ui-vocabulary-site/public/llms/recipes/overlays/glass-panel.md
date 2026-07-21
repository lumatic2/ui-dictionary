---
id: glass-panel
name: "Glass Panel"
pattern_group: overlays
kind: visual-treatment
status: draft
surface_refs: [websites, mobile-apps, saas-dashboards, commerce]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.border.default
  - color.semantic.text.default
  - color.semantic.text.muted
  - dimension.radius.lg
code_asset: examples/ui-vocabulary-site/src/components/glass-panel.tsx
component_refs: [mesh-gradient-surface, popover]
term_refs: []
source_refs: []
last_verified: 2026-07-17
---

## Intent

A glass panel keeps foreground content legible over a busy backdrop by blurring what is behind it (`backdrop-filter`), instead of covering it with an opaque fill. Tier ① — the blur is GPU-composited from a CSS declaration, no JS. Use for navigation bars over scrolling content, overlay cards on rich backgrounds, and floating toolbars. It is a *treatment* of a surface, not a component contract: the surface underneath keeps its own semantics.

## Anatomy

- Translucent token-derived fill (`bg-background/60`-class opacity on the surface token) — the opacity is the legibility knob.
- `backdrop-blur` of medium radius; heavier blur reads as frosted, lighter as tinted.
- Hairline border at reduced opacity so the panel keeps an edge in both themes.
- Optional subtle shadow for lift; never heavy drop-shadows (signature dislike: sloppy CSS defaults).

## States

- Over busy backdrop (primary case): blur carries legibility.
- Over flat backdrop: panel degrades gracefully to a translucent card — acceptable, but glass is unnecessary there.
- Dark mode: fill derives from the dark surface token; verify the border remains visible against dark backdrops.
- No-support fallback: browsers without `backdrop-filter` render the translucent fill only — raise fill opacity via `@supports not (backdrop-filter: blur(1px))` when content must stay readable.

## Variants

- Sticky navigation bar over scrolling page content.
- Floating card over media/gradient hero.
- Toolbar/HUD over canvas or map surfaces.

## Code

```tsx
export function GlassPanel({ children, className }: GlassPanelProps) {
  return (
    <div className={`rounded-lg border border-border/60 bg-background/60 shadow-sm backdrop-blur-md ${className ?? ""}`}>
      {children}
    </div>
  )
}
```

## Checks

- Text on the panel passes WCAG contrast against the *worst-case* backdrop, not the average one.
- Fill and border derive from surface/border tokens with opacity — no literal white/black fills.
- `@supports` fallback path defined when the panel carries essential content.
- Blur radius is consistent across all glass surfaces in one product (one treatment, not per-component improvisation).

## Anti-patterns

- **Glass as decoration everywhere**: applying blur to surfaces that sit on flat backgrounds — cost without function.
- **Contrast by text color**: fixing legibility by changing text color per backdrop instead of adjusting fill opacity — breaks token discipline and dark mode.
- **Opaque imitation**: a solid light-gray fill pretending to be glass — if nothing shows through, use a normal card token.
- **Blur stacking**: nesting glass panels compounds GPU cost and visual mud — one glass layer per stacking context.

## Agent notes

- prompt_phrases: "token-derived glass panel with backdrop-blur, hairline border, and @supports opacity fallback", "sticky glass navigation bar that stays legible over scrolling content"
- fallbacks: no `backdrop-filter` support → raise fill opacity to solid-enough via `@supports not`; content-critical panels may switch to the plain card treatment.
- canonical guidance: `knowledge/expressive-stack.md` tier ① decision row "유리 질감(글래스모피즘)·배경 블러"; contrast rules in `docs/design-system/principles.md`.
