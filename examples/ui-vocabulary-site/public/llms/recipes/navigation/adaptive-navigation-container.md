---
id: adaptive-navigation-container
name: "Adaptive Navigation Container"
pattern_group: navigation
kind: block
status: draft
surface_refs: [mobile-apps]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
code_asset: examples/ui-vocabulary-site/src/components/adaptive-navigation-container.tsx
component_refs: []
term_refs: [tab-bar, navigation-rail, tabs]
source_refs: [apple-hig-components]
last_verified: 2026-08-01
---

## Intent

One destination set, three possible primary-navigation containers — resolved by rule, not taste. This recipe implements the container-selection decision table from `knowledge/mobile-navigation.md` §1: destination count and width class determine whether the screen gets in-page tabs (fewer than 3 destinations — no primary nav), a bottom tab bar (3-5, compact), or a navigation rail (more than 5, or any expanded layout). Unlike `bottom-tab-bar`, which encodes one container's contract, this recipe encodes the *choice between containers* and keeps exactly one primary navigation component per screen.

## Anatomy

- Resolver: a pure function `(destinationCount, widthClass) → container` that mirrors the knowledge decision table — the rule lives in one place, not scattered through JSX.
- Bottom tab bar branch: full-width bottom row, icon + 1-2 word label per destination, active destination filled + full-emphasis.
- Navigation rail branch: leading vertical column (icon + label stacked), active destination carries a shape fill; replaces the bottom bar entirely — never both at once.
- In-page tabs branch: an underline tab row inside the content area; deliberately *not* a primary navigation container.
- Rule readout: the demo surfaces which table row fired, so the mapping from state to container is inspectable.

## States

- **Active destination**: `aria-current="page"` (bar/rail) or `aria-selected` (in-page tabs); emphasis carried by fill + color, never color alone.
- **Container transition**: changing destination count or width class re-resolves the container; active destination is preserved when it still exists in the set.
- **Compact / expanded**: `expanded` always resolves to the rail — a bottom bar on desktop-width layouts is a rule violation, not a variant.

## Variants

- Destination count 2 / 4 / 6 exercises all three table rows; real products pin one count and get one container — the variant axis exists to make the rule visible.
- More than 5 destinations on compact may alternatively keep a bottom bar with tab customization (≤5 visible) — this asset promotes to a rail, the other lawful branch.
- Navigation drawer is intentionally absent: new adoption is discouraged (expanded rail replaces it); existing products keep theirs, new screens don't add one.

## Code

```tsx
function resolveContainer(count: number, width: WidthClass) {
  if (width === "expanded") {
    return { container: "rail", rule: "expanded → rail/사이드바 — bottom bar 금지" }
  }
  if (count < 3) {
    return { container: "in-page-tabs", rule: "목적지 3개 미만 → 페이지 내 tabs (주 내비 아님)" }
  }
  if (count <= 5) {
    return { container: "bottom-bar", rule: "최상위 목적지 3~5 · compact → bottom tab bar" }
  }
  return { container: "rail", rule: "5개 초과 → rail 로 승격 (compact 는 탭 커스터마이즈 ≤5 도 가능)" }
}
```

Container components (bar, rail, in-page tabs), the shared screen body, and the interactive `AdaptiveNavigationContainerDemo` live in `code_asset`.

## Checks

- Exactly one primary navigation container renders per screen state — never bar + rail, never bar + drawer.
- The resolver is the only place that decides the container; JSX branches only on its output.
- Every destination shows icon + visible label in bar and rail; active state readable without color (fill change).
- `aria-current="page"` on the active destination in bar/rail; `role="tab"` + `aria-selected` only in the in-page tabs branch.
- Switching containers preserves the active destination when it survives the set change.

## Anti-patterns

- **Hamburger-by-default**: reaching for a drawer "because it's mobile" — the decision table has no row that lands on a drawer for new adoption.
- **Bar + drawer double navigation**: shipping a bottom bar and a drawer on the same screen gives two competing primary navs.
- **Bottom bar on expanded layouts**: keeping the phone container on tablet/desktop widths instead of promoting to a rail or sidebar.
- **Promoting in-page tabs to primary nav**: styling a 2-item underline tab row as if it switched app-level destinations.

## Agent notes

- `prompt_phrases`: "목적지 수에 따라 하단 탭바나 레일로 자동 전환되는 내비게이션", "태블릿에서는 레일로 바뀌는 모바일 내비게이션 셸"
- Before building any mobile screen, run the resolver logic mentally with the real destination count and target breakpoints — the container is an output, not an input.
- Judgment canon: `knowledge/mobile-navigation.md` §1 (container table) and §2 (behavior contract — tap-only switching, state preservation, label rules). Single-container contracts live in `bottom-tab-bar`.
- If the request insists on a drawer for a new product, surface the rule and record the deviation in one line — platform-norm departures must be intentional.
