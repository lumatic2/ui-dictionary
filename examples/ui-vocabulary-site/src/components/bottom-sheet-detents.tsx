import { useState } from "react"
import { DeviceFrame } from "@/components/device-frame"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type BottomSheetVariant = "standard" | "modal"
export type BottomSheetDetent = "collapsed" | "expanded"

type BottomSheetDetentsProps = {
  open: boolean
  variant: BottomSheetVariant
  detent: BottomSheetDetent
  onDetentChange: (detent: BottomSheetDetent) => void
  onClose: () => void
  children: React.ReactNode
}

/**
 * Bottom sheet with a collapsed/expanded detent pair, cycled through the
 * drag handle. `standard` coexists with the underlying screen (no scrim,
 * background stays interactive); `modal` adds a scrim that blocks
 * background interaction until the sheet is dismissed. Both variants must
 * offer at least one non-drag way to change detent (here: tapping the
 * handle) since not every input is a drag gesture (VoiceOver, switch
 * control, mouse-only).
 */
export function BottomSheetDetents({
  open,
  variant,
  detent,
  onDetentChange,
  onClose,
  children,
}: BottomSheetDetentsProps) {
  if (!open) {
    return null
  }

  function cycleDetent() {
    onDetentChange(detent === "collapsed" ? "expanded" : "collapsed")
  }

  return (
    <div className="absolute inset-0 z-10" data-slot="bottom-sheet-root">
      {variant === "modal" ? (
        <button
          type="button"
          aria-label="Dismiss sheet"
          onClick={onClose}
          className="absolute inset-0 bg-black/50"
          data-slot="bottom-sheet-scrim"
        />
      ) : null}

      <div
        role="dialog"
        aria-modal={variant === "modal"}
        aria-label="Bottom sheet"
        data-slot="bottom-sheet"
        data-variant={variant}
        data-detent={detent}
        className={cn(
          "absolute inset-x-0 bottom-0 flex flex-col rounded-t-2xl border-t bg-background shadow-xl transition-[height] duration-200",
          detent === "expanded" ? "h-[85%]" : "h-[45%]"
        )}
      >
        <button
          type="button"
          onClick={cycleDetent}
          aria-label={detent === "collapsed" ? "Expand sheet" : "Collapse sheet"}
          className="flex shrink-0 items-center justify-center py-2"
        >
          <span aria-hidden="true" className="h-1.5 w-10 rounded-full bg-muted-foreground/40" />
        </button>

        <div className="flex-1 overflow-y-auto px-4 pb-4">{children}</div>
      </div>
    </div>
  )
}

/**
 * Colocated demo: standard/modal toggle buttons open the sheet inside a
 * relatively-positioned viewport (the `DeviceFrame` content area), so the
 * sheet's `absolute` positioning is scoped to the phone screen rather than
 * the whole page.
 */
export function BottomSheetDetentsDemo() {
  const [open, setOpen] = useState(false)
  const [variant, setVariant] = useState<BottomSheetVariant>("standard")
  const [detent, setDetent] = useState<BottomSheetDetent>("collapsed")

  function openSheet(nextVariant: BottomSheetVariant) {
    setVariant(nextVariant)
    setDetent("collapsed")
    setOpen(true)
  }

  return (
    <DeviceFrame statusBarLabel="9:41">
      <div className="relative flex h-full flex-col">
        <div className="flex flex-1 flex-col gap-3 p-4">
          <p className="text-sm font-semibold text-foreground">Screen title</p>
          <div className="flex flex-col gap-2">
            <Button size="sm" variant="outline" onClick={() => openSheet("standard")}>
              Open standard sheet
            </Button>
            <Button size="sm" variant="outline" onClick={() => openSheet("modal")}>
              Open modal sheet
            </Button>
          </div>
        </div>

        <BottomSheetDetents
          open={open}
          variant={variant}
          detent={detent}
          onDetentChange={setDetent}
          onClose={() => setOpen(false)}
        >
          <p className="pt-2 text-sm font-medium text-foreground">Sort by</p>
          <div className="flex flex-col divide-y rounded-md border">
            {["Newest", "Price: low to high", "Price: high to low"].map((row) => (
              <div key={row} className="px-3 py-2.5 text-sm text-muted-foreground">
                {row}
              </div>
            ))}
          </div>
        </BottomSheetDetents>
      </div>
    </DeviceFrame>
  )
}
