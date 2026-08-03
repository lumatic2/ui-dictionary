/**
 * Absorbed from shadcn/ui block `dashboard-01` (https://ui.shadcn.com/blocks).
 * Copyright (c) 2023 shadcn — MIT License
 * (https://github.com/shadcn-ui/ui/blob/main/LICENSE.md)
 * Adapted for Askewly Design (M18): @tabler/icons-react → lucide-react,
 * items carry an `id` + active state and navigation is lifted to the shell.
 */
import { CirclePlusIcon, InboxIcon, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export type NavItem = {
  id: string
  title: string
  icon?: LucideIcon
}

export function NavMain({
  items,
  activeId,
  onNavigate,
}: {
  items: NavItem[]
  activeId: string
  onNavigate: (id: string) => void
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
            >
              <CirclePlusIcon />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <InboxIcon />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                tooltip={item.title}
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
