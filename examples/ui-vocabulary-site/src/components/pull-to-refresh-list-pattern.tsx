import { useRef, useState } from "react"
import { RefreshCwIcon } from "lucide-react"
import { DeviceFrame } from "@/components/device-frame"
import { cn } from "@/lib/utils"

type RefreshPhase = "idle" | "pulling" | "threshold-crossed" | "refreshing"

const THRESHOLD_PX = 64
const MAX_PULL_PX = 96

const items = ["Design review notes", "Sprint planning agenda", "Client feedback thread", "Roadmap sync"]

/**
 * Full pull-to-refresh state machine: pulling -> threshold-crossed ->
 * refreshing -> settled/cancelled. The indicator never scrolls off-screen
 * while refreshing (M3: "Don't scroll the loading indicator off-screen") and
 * a drag that never crosses the threshold snaps back without refreshing.
 */
function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [phase, setPhase] = useState<RefreshPhase>("idle")
  const [pullOffset, setPullOffset] = useState(0)
  const startY = useRef<number | null>(null)
  const atScrollTop = useRef(true)

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!atScrollTop.current || phase === "refreshing") return
    startY.current = event.clientY
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (startY.current === null || phase === "refreshing") return
    const delta = Math.max(0, event.clientY - startY.current)
    const clamped = Math.min(delta, MAX_PULL_PX)
    setPullOffset(clamped)
    setPhase(clamped >= THRESHOLD_PX ? "threshold-crossed" : clamped > 0 ? "pulling" : "idle")
  }

  async function onPointerUp() {
    if (startY.current === null) return
    startY.current = null

    if (phase === "threshold-crossed") {
      setPhase("refreshing")
      setPullOffset(THRESHOLD_PX)
      await onRefresh()
      setPhase("idle")
      setPullOffset(0)
      return
    }

    // Cancelled drag: released before crossing the threshold snaps back.
    setPhase("idle")
    setPullOffset(0)
  }

  return { phase, pullOffset, atScrollTop, onPointerDown, onPointerMove, onPointerUp }
}

export function PullToRefreshListPatternDemo() {
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null)
  const { phase, pullOffset, atScrollTop, onPointerDown, onPointerMove, onPointerUp } = usePullToRefresh(
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 900))
      setRefreshedAt(new Date().toLocaleTimeString())
    }
  )

  return (
    <DeviceFrame statusBarLabel="9:41">
      <div className="flex h-full flex-col">
        <p className="p-4 pb-2 text-sm font-semibold text-foreground">Feed</p>
        <div
          className="relative flex-1 overflow-y-auto"
          onScroll={(event) => {
            atScrollTop.current = event.currentTarget.scrollTop <= 0
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <div
            aria-live="polite"
            className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-center overflow-hidden transition-[height] duration-150"
            style={{ height: phase === "refreshing" ? THRESHOLD_PX : pullOffset }}
          >
            <RefreshCwIcon
              aria-hidden="true"
              className={cn(
                "size-5 text-muted-foreground transition-transform",
                phase === "refreshing" && "animate-spin",
                phase === "threshold-crossed" && "text-foreground"
              )}
              style={{ transform: phase === "refreshing" ? undefined : `rotate(${pullOffset * 3}deg)` }}
            />
          </div>

          <div
            className="flex flex-col divide-y transition-transform duration-150"
            style={{ transform: `translateY(${phase === "refreshing" ? THRESHOLD_PX : pullOffset}px)` }}
          >
            {refreshedAt ? (
              <p className="px-4 py-2 text-xs text-muted-foreground">Updated {refreshedAt}</p>
            ) : null}
            {items.map((item) => (
              <div key={item} className="px-4 py-3 text-sm text-foreground">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DeviceFrame>
  )
}
