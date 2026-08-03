/**
 * Absorbed from shadcn/ui block `dashboard-01` (https://ui.shadcn.com/blocks).
 * Copyright (c) 2023 shadcn — MIT License
 * (https://github.com/shadcn-ui/ui/blob/main/LICENSE.md)
 * Adapted for Askewly Design (M18): @tabler/icons-react → lucide-react,
 * NavDocuments group dropped (skeleton keeps one primary + one secondary
 * group), navigation lifted to the shell via `activeId`/`onNavigate`.
 */
import type { ComponentProps } from "react"
import {
  ChartColumnIcon,
  CommandIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain, type NavItem } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"

const navMain: NavItem[] = [
  { id: "dashboard", title: "Dashboard", icon: LayoutDashboardIcon },
  { id: "analytics", title: "Analytics", icon: ChartColumnIcon },
  { id: "projects", title: "Projects", icon: FolderIcon },
  { id: "team", title: "Team", icon: UsersIcon },
]

const navSecondary: NavItem[] = [
  { id: "settings", title: "Settings", icon: SettingsIcon },
  { id: "help", title: "Get Help", icon: HelpCircleIcon },
  { id: "search", title: "Search", icon: SearchIcon },
]

export function AppSidebar({
  productName,
  user,
  activeId,
  onNavigate,
  ...props
}: {
  productName: string
  user: { name: string; email: string; avatar: string }
  activeId: string
  onNavigate: (id: string) => void
} & ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              onClick={() => onNavigate("dashboard")}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">{productName}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} activeId={activeId} onNavigate={onNavigate} />
        <NavSecondary
          items={navSecondary}
          activeId={activeId}
          onNavigate={onNavigate}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
