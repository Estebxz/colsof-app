import { SidebarMenuButton } from "../ui/aside";
import { AvatarInitials } from "../ui/avatar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type UserData = {
  nombre: string;
};

export function LogoutButton() {
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadMe() {
      try {
        const res = await fetch("/api/me", { method: "GET" });
        const json = (await res.json().catch(() => null)) as {
          data?: UserData;
          error?: string;
        } | null;

        if (!res.ok) return;
        if (!json?.data) return;
        if (cancelled) return;
        setUser(json.data);
      } catch {
        // ignore
      }
    }

    void loadMe();

    return () => {
      cancelled = true;
    };
  }, []);

  async function onLogout() {
    if (loading) return;
    setLoading(true);

    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (err) {
      console.error("/api/logout error", err);
    } finally {
      try {
        window.localStorage.removeItem("usuario");
      } catch {}

      router.replace("/");
      router.refresh();
      setLoading(false);
    }
  }

  return (
    <SidebarMenuButton
      tooltip="Cerrar sesión"
      className="flex w-full items-center justify-start gap-2 px-2 py-1.5 text-sm text-primary group-data-[collapsible=icon]:justify-center cursor-pointer"
      onClick={onLogout}
      disabled={loading}
      aria-label="Cerrar sesión"
    >
      <AvatarInitials name={user?.nombre || "-"} size="md" />
      <span className="group-data-[collapsible=icon]:hidden">
        {loading ? "Cerrando..." : "Cerrar sesión"}
      </span>
    </SidebarMenuButton>
  );
}