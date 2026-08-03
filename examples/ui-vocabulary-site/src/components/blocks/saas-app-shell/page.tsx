/**
 * saas-app-shell — Askewly Design composition block (M18).
 * Shell/dashboard composition absorbed from shadcn/ui block `dashboard-01`
 * (https://ui.shadcn.com/blocks), Copyright (c) 2023 shadcn — MIT License
 * (https://github.com/shadcn-ui/ui/blob/main/LICENSE.md). Mock visitor data
 * originates from the same block. Adaptations: view switching held in local
 * state (routing stays with the consumer, block contract §3), members region
 * composed from Askewly assets, settings page original.
 */
import { useState, type CSSProperties } from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import type { DataTableRow } from "@/components/interactive-data-table"
import { AppSidebar } from "./app-sidebar"
import { ChartAreaInteractive, type VisitorsPoint } from "./chart-area-interactive"
import { MembersTable } from "./members-table"
import { SectionCards, type SectionCardStat } from "./section-cards"
import { SettingsPage } from "./settings-page"
import { SiteHeader } from "./site-header"
import data from "./data.json"

const VIEW_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  analytics: "Analytics",
  projects: "Projects",
  team: "Team",
  settings: "Settings",
  help: "Get Help",
  search: "Search",
}

export function SaasAppShell({ defaultView = "dashboard" }: { defaultView?: string }) {
  const [view, setView] = useState(defaultView)

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        productName="Acme Inc."
        user={data.user}
        activeId={view}
        onNavigate={setView}
      />
      <SidebarInset>
        <SiteHeader title={VIEW_TITLES[view] ?? "Dashboard"} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {view === "settings" ? (
              <div className="py-4 md:py-6">
                <SettingsPage user={data.user} />
              </div>
            ) : (
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards stats={data.stats as SectionCardStat[]} />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive data={data.visitors as VisitorsPoint[]} />
                </div>
                <MembersTable rows={data.members as DataTableRow[]} />
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export function SaasAppShellDemo() {
  // [transform:translateZ(0)] makes this wrapper the containing block for the
  // sidebar's `position: fixed`, so the shell stays inside the gallery card
  // instead of overlaying the host page.
  return (
    <div className="h-[640px] w-full overflow-hidden rounded-lg border [transform:translateZ(0)]">
      <div className="h-full overflow-auto">
        <SaasAppShell />
      </div>
    </div>
  )
}
