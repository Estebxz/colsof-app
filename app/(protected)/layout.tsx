import type { Metadata } from "next";
import { SidebarProvider } from "@ui/aside";
import MinimalSidebar from "@ui/integration-sidebar";
import { StatusBar } from "@components/status-bar";
import { getSessionUser } from "@/app/server/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "COLSOF - Dashboard",
  description: "Dashboard interactivo solo para usuarios registrados",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider
      defaultOpen={true}
      className="grid h-dvh grid-rows-[auto_1fr]"
    >
      <div className="row-span-2 flex">
        <MinimalSidebar />
        <main className="relative flex flex-1 overflow-auto">
          <div className="flex h-full w-full flex-col">
            <div className="flex-1">{children}</div>
            <StatusBar userName={user.nombre || "visitante"} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
