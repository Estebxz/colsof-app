"use client";

import { usePathname } from "next/navigation";

export function useSidebarActive() {
  const pathname = usePathname();

  const isUsersRoute = pathname === "/users" || pathname.startsWith("/users/");

  function isActiveUrl(url: string) {
    return pathname === url;
  }

  return { pathname, isUsersRoute, isActiveUrl };
}
