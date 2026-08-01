import { useState } from "react"
import { Bell, Compass, Home, Layers, Search, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { DeviceFrame } from "@/components/device-frame"

/**
 * Adaptive Navigation Container — implements the container-selection decision
 * table from `knowledge/mobile-navigation.md` §1: the same destination set
 * lands in a different primary-navigation container depending on destination
 * count and breakpoint. One primary navigation component per screen; drawers
 * are not adopted for new products (expanded rail replaces them).
 * Semantic tokens only — no hex literals, no primitive token refs.
 */

type Destination = { id: string; label: string; icon: typeof Home }

const ALL_DESTINATIONS: Destination[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "search", label: "Search", icon: Search },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "activity", label: "Activity", icon: Bell },
  { id: "library", label: "Library", icon: Layers },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
]

type WidthClass = "compact" | "expanded"

function resolveContainer(count: number, width: WidthClass): { container: "in-page-tabs" | "bottom-bar" | "rail"; rule: string } {
  if (width === "expanded") {
    return { container: "rail", rule: "expanded → rail/사이드바 — bottom bar 금지" }
  }
  if (count < 3) {
    return { container: "in-page-tabs", rule: "목적지 3개 미만 → 페이지 내 tabs (주 내비 아님)" }
  }
  if (count <= 5) {
    return { container: "bottom-bar", rule: "최상위 목적지 3~5 · compact → bottom tab bar" }
  }
  return { container: "rail", rule: "5개 초과 → rail 로 승격 (compact 는 탭 커스터마이즈 ≤5 도 가능)" }
}

function BottomBar({ destinations, active, onSelect }: { destinations: Destination[]; active: string; onSelect: (id: string) => void }) {
  return (
    <nav aria-label="Primary" className="flex shrink-0 border-t bg-background pb-1">
      {destinations.map((destination) => {
        const isActive = destination.id === active
        const Icon = destination.icon
        return (
          <button
            key={destination.id}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}
            type="button"
            onClick={() => onSelect(destination.id)}
          >
            <Icon aria-hidden="true" className="size-5" fill={isActive ? "currentColor" : "none"} />
            <span>{destination.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

function Rail({ destinations, active, onSelect }: { destinations: Destination[]; active: string; onSelect: (id: string) => void }) {
  return (
    <nav aria-label="Primary" className="flex w-20 shrink-0 flex-col items-center gap-1 border-r bg-background py-3">
      {destinations.map((destination) => {
        const isActive = destination.id === active
        const Icon = destination.icon
        return (
          <button
            key={destination.id}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex w-16 flex-col items-center gap-0.5 rounded-lg py-2 text-[0.65rem] font-medium transition-colors",
              isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60"
            )}
            type="button"
            onClick={() => onSelect(destination.id)}
          >
            <Icon aria-hidden="true" className="size-5" fill={isActive ? "currentColor" : "none"} />
            <span>{destination.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

function InPageTabs({ destinations, active, onSelect }: { destinations: Destination[]; active: string; onSelect: (id: string) => void }) {
  return (
    <div className="border-b px-4">
      <div aria-label="Section" className="flex gap-4" role="tablist">
        {destinations.map((destination) => {
          const isActive = destination.id === active
          return (
            <button
              key={destination.id}
              aria-selected={isActive}
              className={cn(
                "border-b-2 py-2.5 text-sm font-medium transition-colors",
                isActive ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
              )}
              role="tab"
              type="button"
              onClick={() => onSelect(destination.id)}
            >
              {destination.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ScreenBody({ activeLabel }: { activeLabel: string }) {
  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      <p className="text-sm font-semibold text-foreground">{activeLabel}</p>
      <div className="flex flex-col divide-y rounded-md border">
        {["Row one", "Row two", "Row three"].map((row) => (
          <div key={row} className="px-3 py-2.5 text-sm text-muted-foreground">{row}</div>
        ))}
      </div>
    </div>
  )
}

export function AdaptiveNavigationContainer({ count, width }: { count: number; width: WidthClass }) {
  const destinations = ALL_DESTINATIONS.slice(0, count)
  const [active, setActive] = useState(destinations[0].id)
  const activeDestination = destinations.find((destination) => destination.id === active) ?? destinations[0]
  const { container } = resolveContainer(count, width)

  return (
    <div className="flex h-full min-h-0 flex-col">
      {container === "in-page-tabs" && <InPageTabs active={activeDestination.id} destinations={destinations} onSelect={setActive} />}
      {container === "rail" ? (
        <div className="flex min-h-0 flex-1">
          <Rail active={activeDestination.id} destinations={destinations} onSelect={setActive} />
          <ScreenBody activeLabel={activeDestination.label} />
        </div>
      ) : (
        <ScreenBody activeLabel={activeDestination.label} />
      )}
      {container === "bottom-bar" && <BottomBar active={activeDestination.id} destinations={destinations} onSelect={setActive} />}
    </div>
  )
}

/** Gallery demo: pick destination count and width class, watch the container resolve. */
export function AdaptiveNavigationContainerDemo() {
  const [count, setCount] = useState(4)
  const [width, setWidth] = useState<WidthClass>("compact")
  const { rule } = resolveContainer(count, width)

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-1 rounded-lg border p-1" role="group" aria-label="Destination count">
          {[2, 4, 6].map((option) => (
            <button
              key={option}
              aria-pressed={count === option}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                count === option ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
              type="button"
              onClick={() => setCount(option)}
            >
              {option} destinations
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-lg border p-1" role="group" aria-label="Width class">
          {(["compact", "expanded"] as const).map((option) => (
            <button
              key={option}
              aria-pressed={width === option}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                width === option ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
              type="button"
              onClick={() => setWidth(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <p aria-live="polite" className="text-center text-xs text-muted-foreground">규칙: {rule}</p>
      <DeviceFrame key={`${count}-${width}`} statusBarLabel="9:41" variant={width === "expanded" ? "tablet" : "mobile"}>
        <AdaptiveNavigationContainer count={count} width={width} />
      </DeviceFrame>
    </div>
  )
}
