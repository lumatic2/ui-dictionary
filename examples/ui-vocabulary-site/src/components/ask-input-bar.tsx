import { useState } from "react"
import { LockIcon, SendIcon } from "lucide-react"

// Harvested from second-brain/poc-graph ask bar (brain.askewly.com),
// 2026-08-04 (docs/design-system/harvest-contract.md §4). "Explore for
// everyone, ask after sign-in" policy expressed as a locked state.

type AskInputBarProps = {
  placeholder?: string
  /** Locked bars render read-only with a lock affordance (e.g. guests). */
  locked?: boolean
  lockedHint?: string
  onSubmit: (question: string) => void
  /** Fired when a locked bar is activated — open your sign-in flow here. */
  onLockedActivate?: () => void
}

/**
 * Ask input bar: a single centered question bar that floats over an
 * exploratory surface (a graph, a map, a document). Its distinguishing state
 * is `locked` — exploration stays open to everyone while asking requires
 * sign-in, and the bar itself communicates that policy: lock icon,
 * read-only field, and a hint instead of a dead control.
 */
export function AskInputBar({ placeholder, locked = false, lockedHint, onSubmit, onLockedActivate }: AskInputBarProps) {
  const [draft, setDraft] = useState("")
  const canSend = !locked && draft.trim().length > 0

  const submit = () => {
    if (!canSend) return
    onSubmit(draft.trim())
    setDraft("")
  }

  return (
    <div className="w-full max-w-xl">
      <div
        className={
          locked
            ? "flex items-center gap-2 rounded-full border bg-muted px-4 py-2"
            : "flex items-center gap-2 rounded-full border bg-background px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-ring"
        }
        onClick={locked ? onLockedActivate : undefined}
      >
        {locked ? <LockIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" /> : null}
        <input
          type="text"
          value={draft}
          readOnly={locked}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") locked ? onLockedActivate?.() : submit()
          }}
          placeholder={locked ? (lockedHint ?? "Sign in to ask") : (placeholder ?? "Ask anything about this graph")}
          aria-label="Ask a question"
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="button"
          onClick={locked ? onLockedActivate : submit}
          disabled={!locked && !canSend}
          aria-label={locked ? "Sign in to ask" : "Send question"}
          className="rounded-full p-1.5 text-muted-foreground enabled:hover:bg-muted enabled:hover:text-foreground disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-ring"
        >
          <SendIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}
