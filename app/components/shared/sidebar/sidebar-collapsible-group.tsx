"use client";

import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@ui/collapsible";
import { SidebarMenuButton, SidebarMenuItem } from "@ui/aside";
import { cn } from "@lib/utils";
import { UseIcon } from "@hooks/use-icons";
import type { IconName, SidebarCollapsibleGroupItem } from "@type/ui";

export function SidebarCollapsibleGroup({
  label,
  tooltip,
  icon,
  defaultOpen = true,
  isActive,
  items,
}: {
  label: string;
  tooltip: string;
  icon: IconName;
  defaultOpen?: boolean;
  isActive: boolean;
  items: SidebarCollapsibleGroupItem[];
}) {
  return (
    <SidebarMenuItem>
      <Collapsible
        defaultOpen={defaultOpen}
        className="group/collapsible w-full"
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={tooltip}
            isActive={isActive}
            className={cn(
              "flex w-full items-center justify-start gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent/80 hover:text-blue-500/80 tracking-wide group-data-[collapsible=icon]:justify-center cursor-pointer",
            )}
          >
            <UseIcon name={icon} className="size-4 shrink-0" />
            <span className="truncate group-data-[collapsible=icon]:hidden">
              {label}
            </span>
            <UseIcon
              name="arrow-prev-small"
              className="ml-auto h-4 w-4 shrink-0 rotate-0 transition-transform group-data-[collapsible=icon]:hidden group-data-[state=open]/collapsible:-rotate-90"
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          {items.map((item) => (
            <div
              key={item.label}
              className="ml-4 border-foreground border-l border-dashed px-2 group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:border-transparent"
            >
              <SidebarMenuButton
                asChild
                tooltip={item.tooltip}
                isActive={item.isActive}
                className={cn(
                  "flex w-full items-center justify-start gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-blue-500 group-data-[collapsible=icon]:justify-center",
                  "data-[active=true]:bg-accent/80 data-[active=true]:text-blue-500",
                )}
              >
                <Link
                  aria-label={item.label}
                  href={item.url}
                  className="flex w-full items-center gap-2 text-muted-foreground group-data-[collapsible=icon]:justify-center"
                >
                  <UseIcon name={item.icon} className="size-4 shrink-0" />
                  <span className="truncate group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                </Link>
              </SidebarMenuButton>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
