"use client";

import Link from "next/link";

import { SidebarMenuButton, SidebarMenuItem } from "@ui/aside";
import { cn } from "@lib/utils";
import { UseIcon } from "@hooks/use-icons";
import type { IconName } from "@type/ui";

export function SidebarNavItem({
  label,
  tooltip,
  icon,
  url,
  isActive,
}: {
  label: string;
  tooltip: string;
  icon: IconName;
  url: string;
  isActive: boolean;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={tooltip}
        isActive={isActive}
        className={cn(
          "flex w-full items-center justify-start gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-blue-500 group-data-[collapsible=icon]:justify-center",
          "data-[active=true]:bg-accent/80 data-[active=true]:text-blue-500",
        )}
      >
        <Link
          aria-label={label}
          href={url}
          className="flex w-full items-center gap-2 text-muted-foreground group-data-[collapsible=icon]:justify-center"
        >
          <UseIcon name={icon} className="size-4 shrink-0" />
          <span className="truncate group-data-[collapsible=icon]:hidden">{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
