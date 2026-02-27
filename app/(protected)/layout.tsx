import type { Metadata } from "next";
import { SidebarProvider } from "@ui/aside";
import MinimalSidebar from "@ui/integration-sidebar";

export const metadata: Metadata = {
  title: "COLSOF - Dashboard",
  description: "Dashboard interactivo solo para usuarios registrados",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true} className="grid h-dvh grid-rows-[auto_1fr]">
      <div className="row-span-2 flex">
        <MinimalSidebar />
        <main className="relative flex flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}