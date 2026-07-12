---
id: pull-to-refresh-list-pattern
name: "Pull to Refresh List Pattern"
pattern_group: data-display
kind: block
status: draft
surface_refs: [mobile-apps]
tokens_used:
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
code_asset: examples/ui-vocabulary-site/src/components/pull-to-refresh-list-pattern.tsx
component_refs: []
term_refs: [pull-to-refresh, pull-to-refresh-indicator]
source_refs: [material-m3-components]
last_verified: 2026-07-12
---

## Intent

The full drag-triggered refresh state machine for a mobile list: `pulling` → `threshold-crossed` → `refreshing` → `settled`/`cancelled`. `pull-to-refresh` names the gesture concept and `pull-to-refresh-indicator` names the visual indicator alone; this recipe is the composed implementation contract — the threshold-crossing judgment, the cancelable drag-back, and the rule that the indicator stays pinned while refreshing rather than scrolling away with the list.

## Anatomy

- List viewport: the scrollable container the gesture is scoped to.
- Drag-offset indicator: a spinner/icon area above the list content whose height and rotation track the current pull offset.
- Threshold line: an invisible offset value (not a rendered line) that separates "will snap back" from "will refresh."
- Refreshing spinner: pinned to the top of the viewport while `refreshing` is true — never scrolled off-screen by list content.
- Released list content: the list itself, offset by the same amount as the indicator so the two move together during the drag.

## States

- **Idle**: no pull offset, not at drag start.
- **Pulling**: pointer is dragging down from scroll-top, offset > 0 but below threshold. Releasing here snaps back to idle — no refresh fires.
- **Threshold-crossed**: offset has passed `THRESHOLD_PX`. Releasing here commits to a refresh.
- **Refreshing**: indicator pinned at the threshold height, spinning; the underlying async refresh is in flight. The list cannot be dragged again until this resolves.
- **Settled**: refresh resolved, offset animates back to 0, new content (if any) is visible at the top.

## Variants

- Gesture is scoped to "loose vertical drag-down at scroll-top only" — it must not trigger during any other scroll direction or when the list isn't already at its top.
- Desktop/web equivalents should prefer an explicit refresh button instead of this gesture (`pull-to-refresh`'s own `anti_use`) — this recipe is mobile/touch-scoped.

## Code

```tsx
async function onPointerUp() {
  if (phase === "threshold-crossed") {
    setPhase("refreshing")
    setPullOffset(THRESHOLD_PX)
    await onRefresh()
    setPhase("idle")
    setPullOffset(0)
    return
  }
  // Cancelled drag: released before crossing the threshold snaps back.
  setPhase("idle")
  setPullOffset(0)
}
```

Full pointer-tracking, scroll-top gating, and the colocated `PullToRefreshListPatternDemo` (rendered inside `DeviceFrame`) live in `code_asset`.

## Checks

- Releasing before the threshold always snaps back without calling the refresh handler.
- While `phase === "refreshing"`, the indicator stays pinned at a fixed height — it must not be pushed off-screen by the list's own scroll.
- The gesture only starts when the list is scrolled to its top (`atScrollTop`) — a mid-list drag must not be interpreted as a refresh pull.
- `aria-live="polite"` on the indicator region so screen readers get a refresh announcement without needing to see the animation.

## Anti-patterns

- **Refresh firing before the threshold**: committing to a refresh on any nonzero pull offset (instead of only after crossing `THRESHOLD_PX`) makes accidental small drags trigger unwanted network calls.
- **Indicator scrolling away while refreshing**: letting the list's own scroll carry the spinner off-screen during `refreshing` violates the M3 guidance this recipe encodes ("Don't scroll the loading indicator off-screen") and leaves the user unsure whether a refresh is still in progress.
- **No cancel path**: only supporting "drag past threshold and release" with no way to abort a pull-in-progress strands the user in a stuck partial-pull state; a release before threshold must always resolve back to idle.
- **Gesture not scoped to scroll-top**: triggering pull-to-refresh from anywhere in the list (not just when already scrolled to the top) conflicts with normal vertical scrolling.

## Agent notes

- `prompt_phrases`: "피드 목록에 pull-to-refresh 상태 기계를 전부 구현해줘", "threshold를 넘기기 전에 놓으면 스냅백되게 해줘", "refreshing 중에는 스피너가 스크롤로 밀려나지 않게 고정해줘"
- If only the static visual (not the full drag state machine) is needed, use `pull-to-refresh-indicator` directly instead of this recipe.
- Fallback: if pointer events are unavailable, a native `touchstart`/`touchmove`/`touchend` handler set can replace the pointer handlers as long as the same threshold/pin/cancel rules are preserved.
