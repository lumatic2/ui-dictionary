---
id: actionable-toast
name: "Actionable Toast"
pattern_group: feedback
kind: component
status: draft
surface_refs: [websites, mobile-apps, saas-dashboards, commerce, internal-tools]
tokens_used:
  - color.semantic.surface.overlay
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - color.semantic.action.primary
  - dimension.space.2
  - dimension.space.4
  - dimension.radius.md
  - typography.scale.sm
  - typography.weight.medium
code_asset: examples/ui-vocabulary-site/src/App.tsx
component_refs: [button]
term_refs: [toast, toast-stack, undo-toast, alert]
source_refs: []
last_verified: 2026-07-10
---

## Intent

An actionable toast confirms a recent low-risk operation and may offer one short recovery action such as Undo or Retry. It does not request a decision, carry long instructions, or hide a persistent error that belongs next to the affected content.

## Anatomy

- Concise outcome title using the user's action language.
- Optional one-line detail that identifies the affected object.
- At most one action, plus a dismiss control when the toast does not expire quickly.
- Live-region announcement that mirrors the visible outcome without stealing focus.

## States

- Success confirmation with automatic dismissal.
- Failure with Retry when the operation is safe to repeat.
- Undo window that remains long enough to perceive and activate.
- Stacked notifications with a bounded visible count.
- Dismissed state that clears timers and removes the live announcement.

## Variants

- Passive confirmation with no action.
- Undo toast for reversible deletion, archive, or move.
- Retry toast for transient network failure.
- Persistent alert instead of toast when the state remains relevant on the page.

## Code

```tsx
function ActionableToast({ toast, onDismiss, onUndo }: Props) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, toast.duration)
    return () => window.clearTimeout(timer)
  }, [onDismiss, toast.duration])

  return (
    <div
      className="flex items-start gap-4 border bg-popover p-4 text-popover-foreground shadow-sm"
      role="status"
      aria-live="polite"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{toast.title}</p>
        {toast.body && <p className="mt-1 text-sm text-muted-foreground">{toast.body}</p>}
      </div>
      {toast.undoable && <button type="button" onClick={onUndo}>Undo</button>}
      <button type="button" aria-label="Dismiss notification" onClick={onDismiss}>
        <X aria-hidden="true" />
      </button>
    </div>
  )
}
```

## Checks

- Message states what happened and names the affected object when ambiguity is possible.
- `role=status` or an equivalent polite live region announces the result without moving focus.
- Undo/Retry is the only action; consequential choices use an inline surface or dialog.
- Timer cleanup prevents dismissed toasts from reappearing or updating unmounted state.
- A stack limits visible notifications and preserves newest/oldest ordering deliberately.

## Anti-patterns

- **Toast as error storage**: a blocking or persistent failure disappears before the user can act.
- **Action pile**: multiple buttons turn a transient notification into a hidden dialog.
- **Color-only outcome**: success and failure differ only by green or red.
- **Focus theft**: showing the toast moves keyboard focus away from the task.

## Agent notes

- prompt_phrases: "polite actionable toast with one undo action and timer cleanup", "observable save result without focus theft"
- fallbacks: use an inline alert when the message remains relevant to a form, section, or unresolved error.
- canonical guidance: `docs/design-system/principles.md` principles 5 and 7.
