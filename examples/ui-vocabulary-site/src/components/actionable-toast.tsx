import { useEffect, useState } from "react"
import { XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Toast = {
  id: string
  title: string
  body?: string
  duration: number
  undoable?: boolean
}

type ActionableToastProps = {
  toast: Toast
  onDismiss: () => void
  onUndo?: () => void
}

/**
 * Actionable toast: confirms a recent low-risk operation with at most one
 * recovery action (Undo). Uses `role="status"`/`aria-live="polite"` so the
 * outcome is announced without stealing focus, and clears its dismiss timer
 * on unmount/dismiss so it cannot fire against unmounted state.
 */
export function ActionableToast({ toast, onDismiss, onUndo }: ActionableToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, toast.duration)
    return () => window.clearTimeout(timer)
  }, [onDismiss, toast.duration])

  return (
    <div
      className="flex w-[min(23rem,calc(100vw-2rem))] items-start gap-3 rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg"
      role="status"
      aria-live="polite"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{toast.title}</p>
        {toast.body ? <p className="mt-1 text-sm text-muted-foreground">{toast.body}</p> : null}
      </div>
      {toast.undoable ? (
        <Button className="shrink-0" size="sm" type="button" variant="link" onClick={onUndo}>
          Undo
        </Button>
      ) : null}
      <button
        aria-label="Dismiss notification"
        className="shrink-0 text-muted-foreground transition hover:text-foreground"
        type="button"
        onClick={onDismiss}
      >
        <XIcon aria-hidden="true" className="size-4" />
      </button>
    </div>
  )
}

let demoToastId = 0

/**
 * Colocated demo: posts a new toast into a bounded, newest-first stack on
 * each click, each with its own dismiss timer and an Undo action.
 */
export function ActionableToastDemo() {
  const [stack, setStack] = useState<Toast[]>([])
  const [lastUndo, setLastUndo] = useState<string | null>(null)

  const post = () => {
    demoToastId += 1
    const toast: Toast = {
      id: `toast-${demoToastId}`,
      title: "Changes saved",
      body: "Your draft was archived.",
      duration: 4000,
      undoable: true,
    }
    setStack((current) => [toast, ...current].slice(0, 3))
  }

  const dismiss = (id: string) => setStack((current) => current.filter((toast) => toast.id !== id))

  const undo = (id: string) => {
    setLastUndo(id)
    dismiss(id)
  }

  return (
    <div className="flex flex-col gap-4">
      <Button size="sm" type="button" onClick={post}>
        Archive draft
      </Button>
      <div className="flex flex-col gap-2">
        {stack.map((toast) => (
          <ActionableToast key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} onUndo={() => undo(toast.id)} />
        ))}
      </div>
      {lastUndo ? <p className="text-sm text-muted-foreground">Archive undone.</p> : null}
    </div>
  )
}
