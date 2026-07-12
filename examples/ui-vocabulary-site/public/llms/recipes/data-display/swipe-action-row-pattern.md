---
id: swipe-action-row-pattern
name: "Swipe Action Row (Leading/Trailing)"
pattern_group: data-display
kind: block
status: draft
surface_refs: [mobile-apps]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.action.destructive
  - color.semantic.accent.base
  - color.semantic.border.default
code_asset: examples/ui-vocabulary-site/src/components/swipe-action-row-pattern.tsx
component_refs: []
term_refs: [swipe-action-row, swipe-to-delete, swipe-action]
source_refs: [apple-hig-components]
last_verified: 2026-07-12
---

## Intent

A list row implementation of the vocabulary's `swipe-action-row` term: one row that can reveal either a leading action (e.g. mark done) or a trailing, destructive-toned action (e.g. delete), instead of only supporting a single delete-only direction like `swipe-to-delete`, or a single generic direction like `swipe-action`. This recipe is the concrete two-sided contract those three related terms describe from different angles.

## Anatomy

- Row content: the primary tappable label/content, flex-1, always present.
- Leading action slot: appears to the left of the content only while `revealed === "leading"` — non-destructive tone (accent), fixed width.
- Trailing action slot: appears to the right of the content only while `revealed === "trailing"` — destructive tone, fixed width.
- Closed-state affordance: two small tap-only icon buttons (not a swipe) shown when nothing is revealed, one per direction, so both actions stay reachable without a drag gesture at all.

## States

- **Closed** (`revealed === "none"`): row content full-width; the two tap-only reveal icons are visible at the trailing edge.
- **Leading revealed**: leading action button visible and focusable; tapping row content again returns to closed.
- **Trailing revealed**: trailing (destructive) action button visible; same reset-on-content-tap behavior.
- Both leading and trailing use the same reveal/dismiss state machine — only one side can be revealed on a given row at a time.

## Variants

- Full-swipe commit (not implemented in the code asset): a real swipe gesture can additionally support committing an action immediately at the end of a fast full-width swipe, rather than only revealing the button. Treat that as an enhancement layered on top of the reveal/tap contract here, not a replacement for it.
- Leading-only or trailing-only rows: omit the unused slot and its reveal icon entirely rather than rendering an empty slot — don't imply an action exists where none does.

## Code

```tsx
{revealed === "trailing" ? (
  <button
    type="button"
    onClick={onTrailingAction}
    aria-label="Delete"
    className="flex w-16 shrink-0 items-center justify-center bg-destructive text-white"
  >
    <TrashIcon className="size-4" aria-hidden="true" />
  </button>
) : null}
```

Full row (leading slot, content, trailing slot, and the two tap-only reveal icons) and the colocated `SwipeActionRowPatternDemo` live in `code_asset`.

## Checks

- Every revealed action has a non-drag path to reach it — the code asset's tap-only reveal icons in the closed state satisfy this; a real gesture-driven implementation must keep an equivalent tap/long-press/more-menu alternative.
- Trailing/destructive action uses a distinct tone (`color.semantic.action.destructive`) from the leading action (`color.semantic.accent.base`), so the two sides read as different in kind, not just position.
- Tapping the row content while an action is revealed dismisses it back to closed, rather than triggering the action — accidental content taps must not fire a destructive action.
- Each revealed action button has an `aria-label` describing the action, not just an icon.

## Anti-patterns

- **Swipe as the only path to an action**: shipping a version where the leading/trailing actions can only be reached by a physical swipe gesture strands keyboard, switch-control, and low-dexterity users — always keep a tap-only alternative (icon button, long-press menu, or an explicit "more" affordance).
- **Same tone for both sides**: styling the leading and trailing actions identically removes the "this side is safe, this side is destructive" signal the color contrast provides.
- **Auto-committing on reveal**: firing the action as soon as the button becomes visible (instead of waiting for an explicit tap on it) turns a two-step reveal-then-confirm interaction into a single accidental-trigger-prone one.

## Agent notes

- `prompt_phrases`: "리스트 행을 스와이프하면 왼쪽엔 완료 오른쪽엔 삭제가 나오는 swipe action row를 만들어줘", "삭제 액션은 빨간색으로 구분해줘", "스와이프 못하는 사용자를 위해 탭으로도 액션을 열 수 있게 해줘"
- If only a single destructive action per row is needed (no leading/mark-done action), `swipe-to-delete` is the narrower term to reference — this recipe still works for that case with the leading slot simply omitted.
- Fallback: if a drag/pointer-tracking library isn't available, the tap-only reveal icons implemented here are an acceptable baseline, not a fallback to remove once dragging works — keep both.
