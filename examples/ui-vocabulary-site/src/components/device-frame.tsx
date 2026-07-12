import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export type DeviceFrameVariant = "mobile" | "tablet"

const viewportSizeByVariant: Record<DeviceFrameVariant, { width: number; height: number }> = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
}

type DeviceFrameProps = {
  /** Content rendered inside the device viewport. Gets its own scroll context. */
  children: ReactNode
  /** `mobile` (390×844) or `tablet` (768×1024). Defaults to `mobile`. */
  variant?: DeviceFrameVariant
  /** Label shown in the status-bar hint (e.g. a time or screen name). */
  statusBarLabel?: string
  className?: string
}

/**
 * Reusable device bezel for publishing mobile/tablet UI examples on the
 * reference site. Wraps arbitrary children in a rounded frame with a
 * status-bar hint and gives the viewport its own scroll context, so a
 * recipe's mobile screen can be dropped in without the page itself scrolling.
 * Semantic tokens only — no hex literals, no primitive token refs.
 */
export function DeviceFrame({ children, variant = "mobile", statusBarLabel, className }: DeviceFrameProps) {
  const { width, height } = viewportSizeByVariant[variant]

  return (
    <div
      className={cn(
        "inline-flex flex-col overflow-hidden rounded-3xl border bg-muted p-2 shadow-xl",
        className
      )}
      data-slot="device-frame"
      data-variant={variant}
    >
      <div
        className="flex flex-col overflow-hidden rounded-2xl border bg-background"
        style={{ width, height }}
      >
        <div
          aria-hidden="true"
          className="flex shrink-0 items-center justify-center border-b bg-background py-1.5"
        >
          {statusBarLabel ? (
            <span className="text-xs font-medium text-muted-foreground">{statusBarLabel}</span>
          ) : (
            <span className="h-1.5 w-12 rounded-full bg-muted" />
          )}
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  )
}

/**
 * Minimal placeholder mobile screen demo. Integration point for mobile
 * recipe batches (steps 2-3): swap `PlaceholderMobileScreen` for a real
 * recipe component rendered inside `<DeviceFrame>`.
 */
export function DeviceFramePlaceholderDemo() {
  return (
    <DeviceFrame statusBarLabel="9:41">
      <PlaceholderMobileScreen />
    </DeviceFrame>
  )
}

function PlaceholderMobileScreen() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <p className="text-sm font-semibold text-foreground">Screen title</p>
      <div className="flex flex-col divide-y rounded-md border">
        {["Row one", "Row two", "Row three"].map((row) => (
          <div key={row} className="px-3 py-2.5 text-sm text-muted-foreground">
            {row}
          </div>
        ))}
      </div>
    </div>
  )
}
