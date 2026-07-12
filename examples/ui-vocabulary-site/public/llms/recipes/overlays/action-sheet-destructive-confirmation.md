---
id: action-sheet-destructive-confirmation
name: "Action Sheet Destructive Confirmation"
pattern_group: overlays
kind: block
status: draft
surface_refs: [mobile-apps]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.text.default
  - color.semantic.action.destructive
  - color.semantic.border.default
code_asset: examples/ui-vocabulary-site/src/components/action-sheet-destructive-confirmation.tsx
component_refs: []
term_refs: [action-sheet]
source_refs: [apple-hig-components]
last_verified: 2026-07-12
---

## Intent

An `action-sheet` (vocabulary term) variant tuned for the common case where one of the listed actions is destructive and irreversible (delete). It separates the destructive row visually (warn-tone text) from the neutral rows, and separates Cancel from the whole action group by a gap, so an upward thumb-sweep from the bottom edge naturally lands on Cancel rather than on the destructive row.

## Anatomy

- Scrim: full-bleed tappable layer behind the sheet; tapping it dismisses without acting (same as tapping Cancel).
- Action group: a single rounded card containing one row per action, divided by hairlines.
- Destructive row: same row shape as the others, text colored with `color.semantic.action.destructive` instead of default foreground — no separate container or icon treatment beyond color.
- Cancel row: its own separate rounded card, placed below the action group with a visible gap — never merged into the same list as the actions.

## States

- **Closed**: sheet not rendered (`open === false`).
- **Open**: scrim + action group + Cancel row all rendered; `role="dialog"` and `aria-modal="true"` on the sheet region.
- **Destructive row**: text-only color change (`text-destructive`), no separate background — the only affordance distinguishing it from a neutral action is the warn-tone color plus its position (not the top row).

## Variants

- Action count: this recipe demonstrates 2 neutral + 1 destructive; the same divided-card shape holds for any small number of rows (HIG guidance keeps the list short — long lists should reconsider action sheet as the right pattern).
- Optional title/message above the action group (not implemented in the code asset) — add a short heading row inside the same card when the destructive action needs a one-line consequence statement ("This can't be undone").

## Code

```tsx
<button
  key={row.id}
  type="button"
  onClick={() => onAction(row.id)}
  className={cn(
    "flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium",
    isDestructive ? "text-destructive" : "text-foreground"
  )}
>
  <Icon className="size-4" aria-hidden="true" />
  {row.label}
</button>
```

Full sheet shell (scrim, action group card, separated Cancel row) and the colocated `ActionSheetDestructiveConfirmationDemo` (rendered inside `DeviceFrame`) live in `code_asset`.

## Checks

- The destructive action's row is text-color-only distinguished (`color.semantic.action.destructive`) — not the sole differentiator relying on position, since color-blind or low-vision users need the position/grouping cue too (Cancel is always last and separated).
- Cancel is visually separated (its own card, gapped) from the action rows, never the first or a middle row in the same list.
- Scrim tap dismisses the same way Cancel does — there is no action taken by tapping outside.
- `role="dialog"` + `aria-modal="true"` are present on the sheet region.

## Anti-patterns

- **Putting Cancel inside the same divided list as the actions**: this removes the visual separation that prevents a fast thumb-swipe from accidentally landing on Cancel expecting it, and also risks landing on the destructive row instead.
- **Using icon/background color alone on the destructive row**: styling only the icon (not the text) or adding a full destructive-colored background reads as a difference in emphasis (like a primary button) rather than a warning — keep it text-color-only, matching the neutral rows' shape.
- **Reusing this for a single confirm/cancel decision**: if there's only one yes/no decision (not a list of alternative actions), use `alert`/`dialog` instead of an action sheet — action sheet is for choosing among multiple actions.

## Agent notes

- `prompt_phrases`: "메시지를 더보기 누르면 삭제가 빨간 글씨인 action sheet가 아래에서 올라오게 해줘", "취소 버튼은 액션 목록과 떨어뜨려서 보여줘", "삭제 행동은 destructive 색으로 구분해줘"
- If the request needs a single confirm/deny decision instead of choosing among several actions, use `dialog`/`alert` instead of this recipe.
- Fallback: if no destructive semantic color token is themed for a target product, keep the row order/grouping contract (destructive last among actions, Cancel separated) even if the exact color differs — the grouping is the part that must not regress.
