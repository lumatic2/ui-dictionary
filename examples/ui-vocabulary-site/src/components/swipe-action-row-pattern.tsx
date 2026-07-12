import { useState } from "react"
import { ArchiveIcon, CheckIcon, TrashIcon } from "lucide-react"
import { DeviceFrame } from "@/components/device-frame"
import { cn } from "@/lib/utils"

type RevealSide = "none" | "leading" | "trailing"

type SwipeActionRowItem = {
  id: string
  title: string
}

const items: SwipeActionRowItem[] = [
  { id: "1", title: "Design review notes" },
  { id: "2", title: "Sprint planning agenda" },
  { id: "3", title: "Client feedback thread" },
]

type SwipeActionRowProps = {
  title: string
  revealed: RevealSide
  onReveal: (side: RevealSide) => void
  onLeadingAction: () => void
  onTrailingAction: () => void
  onRevealTrailing: () => void
}

/**
 * A single list row that reveals a leading action (mark done) or a trailing,
 * destructive-toned action (delete) depending on which direction it is
 * swiped. Tapping the row content resets it to the closed state, and each
 * revealed action is also reachable via its own visible button — swipe is
 * never the only path to either command.
 */
function SwipeActionRow({
  title,
  revealed,
  onReveal,
  onLeadingAction,
  onTrailingAction,
  onRevealTrailing,
}: SwipeActionRowProps) {
  return (
    <div className="relative flex items-stretch overflow-hidden border-b bg-background">
      {revealed === "leading" ? (
        <button
          type="button"
          onClick={onLeadingAction}
          aria-label="Mark done"
          className="flex w-16 shrink-0 items-center justify-center bg-accent text-accent-foreground"
        >
          <CheckIcon className="size-4" aria-hidden="true" />
        </button>
      ) : null}

      <button
        type="button"
        onClick={() => onReveal("none")}
        className={cn(
          "flex flex-1 items-center px-3 py-3 text-left text-sm text-foreground",
          revealed !== "none" && "opacity-90"
        )}
      >
        {title}
      </button>

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

      {revealed === "none" ? (
        <div className="flex shrink-0 items-center gap-1 pr-2">
          <button
            type="button"
            onClick={() => onReveal("leading")}
            aria-label="Show mark-done action"
            className="rounded-md p-1 text-muted-foreground"
          >
            <ArchiveIcon className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onRevealTrailing}
            aria-label="Show delete action"
            className="rounded-md p-1 text-muted-foreground"
          >
            <TrashIcon className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  )
}

/**
 * Colocated demo: a small list where each row can reveal a leading
 * (mark done) or trailing (delete) action, rendered inside `DeviceFrame`.
 * The archive icon on the closed row is a tap-only affordance standing in
 * for the swipe gesture, so the leading action stays reachable without a
 * drag.
 */
export function SwipeActionRowPatternDemo() {
  const [reveal, setReveal] = useState<{ id: string; side: RevealSide } | null>(null)
  const [rows, setRows] = useState(items)

  function dismiss(id: string) {
    setRows((current) => current.filter((item) => item.id !== id))
    setReveal(null)
  }

  return (
    <DeviceFrame statusBarLabel="9:41">
      <div className="flex h-full flex-col">
        <p className="p-4 pb-2 text-sm font-semibold text-foreground">Inbox</p>
        <div className="flex flex-1 flex-col overflow-y-auto">
          {rows.map((row) => (
            <SwipeActionRow
              key={row.id}
              title={row.title}
              revealed={reveal?.id === row.id ? reveal.side : "none"}
              onReveal={(side) => setReveal(side === "none" ? null : { id: row.id, side })}
              onLeadingAction={() => dismiss(row.id)}
              onTrailingAction={() => dismiss(row.id)}
              onRevealTrailing={() => setReveal({ id: row.id, side: "trailing" })}
            />
          ))}
        </div>
      </div>
    </DeviceFrame>
  )
}
