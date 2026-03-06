"use client";

import Link from "next/link";
import Image from "next/image";
import { useSidebarActive } from "@hooks/use-sidebar-active";
import { UseIcon } from "@hooks/use-icons";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@ui/aside";
import { TooltipProvider } from "@ui/tooltip";
import { LogoutButton } from "./logout-button";

import { cn } from "@lib/utils";
import { mainNav, otherNav, usersNav } from "@lib/sidebar-nav";
import { SidebarNavItem } from "@shared/sidebar/sidebar-nav-item";
import { SidebarCollapsibleGroup } from "@shared/sidebar/sidebar-collapsible-group";
import type { SidebarCollapsibleGroupItem } from "@type/ui";

function MinimalSidebar() {
  const { isUsersRoute, isActiveUrl } = useSidebarActive();

  const usersItems: SidebarCollapsibleGroupItem[] = usersNav.map((i) => ({
    ...i,
    isActive: isActiveUrl(i.url),
  }));

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar
        collapsible="icon"
        className="relative flex h-full flex-col border-border border-r text-foreground transition-all duration-300 ease-in-out bg-sidebar"
      >
        <SidebarHeader className="flex w-full flex-row justify-between group-data-[collapsible=icon]:flex-col">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2",
                "group-data-[collapsible=icon]:flex-col",
              )}
              aria-label="Inicio"
            >
              <div className="flex items-center justify-center rounded-lg bg-ring p-2 transition-colors duration-150 hover:bg-ring/80">
                <Image
                  src="/favicon-light.svg"
                  alt="Logo mark"
                  width={30}
                  height={30}
                  className={cn(
                    "h-4 w-4",
                    "group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4",
                  )}
                />
              </div>
              <span className="group-data-[collapsible=icon]:hidden">
                <h2 className="font-semibold text-foreground group-data-[collapsible=icon]:hidden">
                  COLSOF
                </h2>
              </span>
            </Link>
          </div>
          <SidebarMenuButton
            tooltip="Abrir panel lateral"
            className="flex size-8 items-center hover:bg-accent/80 justify-center"
            asChild
          >
            <SidebarTrigger>
              <UseIcon name="arrow-left" className="size-4 fill-black" />
            </SidebarTrigger>
          </SidebarMenuButton>
        </SidebarHeader>
        <SidebarContent className="flex-1 gap-0">
          <SidebarGroup>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarNavItem
                  key={item.url}
                  label={item.label}
                  tooltip={item.tooltip}
                  icon={item.icon}
                  url={item.url}
                  isActive={isActiveUrl(item.url)}
                />
              ))}
              <SidebarCollapsibleGroup
                label="Usuarios"
                tooltip="Acceder a usuarios"
                icon="user"
                isActive={isUsersRoute}
                items={usersItems}
              />
              {otherNav.map((item) => (
                <SidebarNavItem
                  key={item.url}
                  label={item.label}
                  tooltip={item.tooltip}
                  icon={item.icon}
                  url={item.url}
                  isActive={isActiveUrl(item.url)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="mt-auto">
            <SidebarMenu>
              <SidebarMenuItem>
                <LogoutButton />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  );
}

export default MinimalSidebar;
