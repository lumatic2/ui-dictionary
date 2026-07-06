---
id: button
name: "Button"
pattern_group: forms
kind: component
status: draft
surface_refs: [websites, saas-dashboards, components-primitives]
tokens_used:
  - color.component.button.bg
  - color.component.button.text
  - color.semantic.action.primary
  - color.semantic.border.default
  - dimension.radius.sm
  - typography.scale.sm
  - typography.weight.medium
code_asset: examples/ui-vocabulary-site/src/components/ui/button.tsx
component_refs: []
term_refs: [button, primary-button, secondary-button]
source_refs: []
last_verified: 2026-07-07
---

## Intent

A button lets a user trigger a single, immediate action (submit, save, confirm, cancel). It communicates the relative importance of an action through fill and contrast rather than size — primary actions get a solid fill, secondary actions get an outline.

## Anatomy

- Container: fixed height, horizontal padding, rounded corners.
- Label: short verb-first text (e.g. "Save", "Cancel").
- Optional leading/trailing icon.
- Optional loading indicator replacing or alongside the label.

## States

- Default
- Hover (opacity shift on primary, subtle bg shift on secondary/ghost/outline)
- Focus-visible (ring)
- Disabled (reduced opacity, pointer-events off)
- Active/pressed

## Variants

- `default` (primary): solid fill using `color.component.button.bg`, text using `color.component.button.text`.
- `secondary` / `outline`: transparent background, 1px border using `color.semantic.border.default`, text follows surface foreground.
- `destructive`: reserved for irreversible actions — do not substitute for primary emphasis.
- `ghost` / `link`: lowest emphasis, no container fill or border.

Sizes follow a fixed scale (`sm`, `default`, `lg`, icon-only variants) — do not introduce ad hoc heights per screen.

## Code

```tsx
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

Component-level spec (Askewly Design landing usage, see `DESIGN.md` §7 Components > Button): height 40, padding-x 24, radius `sm`; primary is a solid `color.component.button.bg` fill with `color.component.button.text` label, hover reduces opacity to 0.9; secondary is transparent with a 1px `color.semantic.border.default` border.

## Checks

- Text has sufficient contrast against the fill (component tier resolves through `action.primary` → `text.on-accent`, both already contrast-checked at the semantic tier).
- Focus-visible ring is present and not suppressed.
- Disabled state is visually distinct and non-interactive (`pointer-events-none`, reduced opacity).
- Only one primary (solid) button visible per immediate decision context.
- Hit target meets minimum touch size on `mobile-apps`/touch surfaces even when using compact sizes.

## Anti-patterns

- **Oversized rounded pill buttons.** `DESIGN.md` fixes radius at `sm` (4px); full-pill radii read as generic template output, not as this system's shape language.
- **Heavy drop shadows on buttons.** Elevation here comes from borders and surface tint, not shadow — a shadowed button breaks the flat, bordered aesthetic (`DESIGN.md` §6, §8).
- **Every button styled as primary.** Solid-fill overuse erases hierarchy; reserve the primary fill for the one dominant action and use secondary/outline/ghost for everything else.
- **One-note gradient fills on the button background.** Gradients are called out directly as a page-level anti-pattern and apply equally at component scale.

## Agent notes

- `prompt_phrases`: "저장 버튼을 오른쪽 아래에 넣어줘", "가장 중요한 행동은 primary button으로 강조해줘", "취소는 secondary button으로 넣어줘".
- Fallback when no variant is specified: use `default` (primary) for the single most important action on the screen, `outline`/`secondary` for everything else, and reserve `destructive` strictly for irreversible actions.
- When asked for a "big rounded CTA button," push back toward the fixed radius/height spec above rather than inventing a new shape.
