import { useState } from "react"
import { CopyIcon, ShareIcon, TrashIcon } from "lucide-react"
import { DeviceFrame } from "@/components/device-frame"
import { cn } from "@/lib/utils"

type ActionSheetRow = {
  id: string
  label: string
  icon: typeof CopyIcon
  tone?: "default" | "destructive"
}

const rows: ActionSheetRow[] = [
  { id: "copy", label: "Copy", icon: CopyIcon },
  { id: "share", label: "Share", icon: ShareIcon },
  { id: "delete", label: "Delete", icon: TrashIcon, tone: "destructive" },
]

type ActionSheetDestructiveConfirmationProps = {
  open: boolean
  onAction: (id: string) => void
  onCancel: () => void
}

/**
 * Action sheet whose destructive action (delete) is styled apart from the
 * neutral rows and whose Cancel row is separated by a gap below the action
 * list, so a thumb sweeping upward from the bottom edge lands on Cancel by
 * default rather than on a destructive action.
 */
export function ActionSheetDestructiveConfirmation({
  open,
  onAction,
  onCancel,
}: ActionSheetDestructiveConfirmationProps) {
  if (!open) return null

  return (
    <div className="absolute inset-0 z-10">
      <button
        type="button"
        aria-label="Dismiss action sheet"
        onClick={onCancel}
        className="absolute inset-0 bg-black/50"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Message actions"
        className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-2"
      >
        <div className="flex flex-col divide-y overflow-hidden rounded-xl border bg-background">
          {rows.map((row) => {
            const Icon = row.icon
            const isDestructive = row.tone === "destructive"
            return (
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
            )
          })}
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border bg-background px-4 py-3 text-sm font-semibold text-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

/**
 * Colocated demo: a message row with a "more" trigger that opens the sheet,
 * rendered inside `DeviceFrame` so the pattern reads as a real mobile screen.
 */
export function ActionSheetDestructiveConfirmationDemo() {
  const [open, setOpen] = useState(false)

  return (
    <DeviceFrame statusBarLabel="9:41">
      <div className="relative flex h-full flex-col">
        <div className="flex flex-1 flex-col gap-3 p-4">
          <p className="text-sm font-semibold text-foreground">Messages</p>
          <div className="flex items-center justify-between rounded-md border px-3 py-2.5">
            <span className="text-sm text-muted-foreground">Team standup notes</span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-sm font-medium text-foreground"
            >
              More
            </button>
          </div>
        </div>
        <ActionSheetDestructiveConfirmation
          open={open}
          onAction={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </div>
    </DeviceFrame>
  )
}
