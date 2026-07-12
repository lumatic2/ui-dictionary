import { useState } from "react"
import { HomeIcon, SearchIcon, BellIcon, UserIcon, type LucideIcon } from "lucide-react"
import { DeviceFrame } from "@/components/device-frame"
import { cn } from "@/lib/utils"

type TabId = "home" | "search" | "activity" | "profile"

type TabDefinition = {
  id: TabId
  label: string
  icon: LucideIcon
  badgeCount?: number
}

const tabs: TabDefinition[] = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "search", label: "Search", icon: SearchIcon },
  { id: "activity", label: "Activity", icon: BellIcon, badgeCount: 3 },
  { id: "profile", label: "Profile", icon: UserIcon },
]

type BottomTabBarProps = {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

/**
 * Persistent bottom navigation bar that switches between the app's top-level
 * destinations. Tabs only switch destinations — they never scroll/swipe
 * between views (that would be a `mobile-segmented-tabs`/carousel concern).
 * Keeps to 3-5 destinations (HIG) and always pairs an icon with a label.
 */
export function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  return (
    <nav
      aria-label="Primary"
      className="flex shrink-0 items-stretch border-t bg-background"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        const Icon = tab.icon

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <span className="relative">
              <Icon className="size-5" fill={isActive ? "currentColor" : "none"} aria-hidden="true" />
              {tab.badgeCount ? (
                <span
                  aria-hidden="true"
                  className="absolute -right-1.5 -top-1.5 flex size-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-semibold text-white"
                >
                  {tab.badgeCount}
                </span>
              ) : null}
            </span>
            <span>{tab.label}</span>
            {tab.badgeCount ? (
              <span className="sr-only">{tab.badgeCount} unread</span>
            ) : null}
          </button>
        )
      })}
    </nav>
  )
}

/**
 * Colocated demo: a placeholder screen body above the tab bar, rendered
 * inside `DeviceFrame` so the pattern reads as a real mobile screen.
 */
export function BottomTabBarDemo() {
  const [activeTab, setActiveTab] = useState<TabId>("home")
  const activeLabel = tabs.find((tab) => tab.id === activeTab)?.label ?? ""

  return (
    <DeviceFrame statusBarLabel="9:41">
      <div className="flex h-full flex-col">
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          <p className="text-sm font-semibold text-foreground">{activeLabel}</p>
          <div className="flex flex-col divide-y rounded-md border">
            {["Row one", "Row two", "Row three"].map((row) => (
              <div key={row} className="px-3 py-2.5 text-sm text-muted-foreground">
                {row}
              </div>
            ))}
          </div>
        </div>
        <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </DeviceFrame>
  )
}
