import { useState } from "react"
import { ChevronLeftIcon } from "lucide-react"
import { DeviceFrame } from "@/components/device-frame"
import { cn } from "@/lib/utils"

const COLLAPSE_THRESHOLD_PX = 40

const items = Array.from({ length: 20 }, (_, index) => `Row ${index + 1}`)

/**
 * Large title that starts big and compresses into a small, background-filled
 * header once the list scrolls past a threshold. Compression is purely a
 * scroll-driven transform, not a tap/drag target — the back button is a
 * separate, always-present 44x44 tap target that is never conflated with a
 * sheet-dismiss gesture.
 */
export function LargeTitleCollapsingHeaderDemo() {
  const [scrollTop, setScrollTop] = useState(0)
  const isCompact = scrollTop > COLLAPSE_THRESHOLD_PX

  return (
    <DeviceFrame statusBarLabel="9:41">
      <div className="flex h-full flex-col">
        <div
          aria-hidden={false}
          className={cn(
            "sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b px-4 transition-colors",
            isCompact ? "border-border bg-background py-3" : "border-transparent bg-background pb-3 pt-1"
          )}
        >
          <button
            type="button"
            aria-label="Back"
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-foreground"
          >
            <ChevronLeftIcon className="size-5" aria-hidden="true" />
          </button>
          <p
            className={cn(
              "font-semibold text-foreground transition-all",
              isCompact ? "text-base" : "text-2xl"
            )}
          >
            Inbox
          </p>
        </div>

        <div
          className="flex-1 overflow-y-auto"
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
        >
          <div className="flex flex-col divide-y">
            {items.map((row) => (
              <div key={row} className="px-4 py-3 text-sm text-foreground">
                {row}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DeviceFrame>
  )
}
