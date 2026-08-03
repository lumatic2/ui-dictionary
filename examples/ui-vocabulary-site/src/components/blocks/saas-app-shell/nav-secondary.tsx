/**
 * Absorbed from shadcn/ui block `dashboard-01` (https://ui.shadcn.com/blocks).
 * Copyright (c) 2023 shadcn — MIT License
 * (https://github.com/shadcn-ui/ui/blob/main/LICENSE.md)
 * Adapted for Askewly Design (M18): @tabler/icons-react → lucide-react,
 * navigation lifted to the shell (no anchor hrefs).
 */
import type { ComponentPropsWithoutRef } from "react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { NavItem } from "./nav-main"

export function NavSecondary({
  items,
  activeId,
  onNavigate,
  ...props
}: {
  items: NavItem[]
  activeId: string
  onNavigate: (id: string) => void
} & ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={item.id === activeId}
                onClick={() => onNavigate(item.id)}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
