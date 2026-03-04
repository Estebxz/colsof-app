"use client";

import { useMemo } from "react";

import { useUsuarios } from "@hooks/use-usuarios";
import DashboardStatCards from "@/app/components/dashboard/dashboard-stat-cards";
import CasesReport from "@/app/components/dashboard/cases-report";
import Image from "next/image";
import { Badge } from "@/app/components/ui/badges";
import { UseIcon } from "@/app/hooks/use-icons";
import { AvatarInitials } from "@/app/components/ui/avatar";

export default function Dashboard() {
  const {
    usuarios,
    loading: usuariosLoading,
    error: usuariosError,
  } = useUsuarios(200);

  const usuariosActivos = useMemo(
    () => usuarios.filter((u) => u.activo),
    [usuarios],
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <DashboardStatCards />

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm pb-6">
        <CasesReport />
        <section className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6 mt-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Lista de Usuarios</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Base de datos SQL
                </p>
              </div>
              <a
                href="#"
                className="text-sm text-primary font-medium hover:underline"
              >
                <div className="flex items-center gap-1 justify-center">
                  Ver todo
                  <UseIcon
                    name="arrow-up-left"
                    className="size-3.5 rotate-y-180"
                  />
                </div>
              </a>
            </div>

            <div className="w-full">
              <div className="hidden sm:grid sm:grid-cols-[60px_1fr_140px_120px_40px] xl:grid-cols-[72px_1fr_160px_140px_48px] text-xs font-semibold text-muted-foreground uppercase border-b border-border pb-3 mb-1 px-1">
                <div>ID</div>
                <div>Usuario</div>
                <div>Estado</div>
                <div>Rol</div>
                <div></div>
              </div>

              {usuariosLoading ? (
                <div className="py-8 text-sm text-muted-foreground">
                  Cargando usuarios…
                </div>
              ) : usuariosError ? (
                <div className="py-8 text-sm text-destructive">
                  {usuariosError}
                </div>
              ) : usuarios.length === 0 ? (
                <div className="py-8 text-sm text-muted-foreground">
                  Sin usuarios.
                </div>
              ) : (
                usuarios.slice(0, 5).map((user) => (
                  <div
                    key={String(user.id)}
                    className="grid grid-cols-[60px_1fr_140px_120px_40px] xl:grid-cols-[72px_1fr_160px_140px_48px] items-center py-3.5 border-b border-border last:border-0 text-sm px-1 hover:bg-muted/40 rounded-lg transition-colors"
                  >
                    <div className="font-medium">{user.id}</div>

                    <div className="flex items-center gap-2.5 min-w-0 pr-0 sm:pr-4">
                      <AvatarInitials
                        name={user.nombre || "—"}
                        className="hidden sm:flex size-8"
                      />
                      <div className="min-w-0">
                        <div className="font-medium truncate">
                          {user.nombre || "—"}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {user.email || "—"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Badge
                        variant={
                          (user.estado || "").toLowerCase() === "suspendido"
                            ? "warning"
                            : user.activo
                              ? "success"
                              : "destructive"
                        }
                        pulse
                      >
                        {user.estado || (user.activo ? "Activo" : "Inactivo")}
                      </Badge>
                    </div>

                    <div>
                      <Badge variant="info">{user.rol || "—"}</Badge>
                    </div>

                    <div className="hidden sm:block text-right">
                      <button className="size-7 rounded-md hover:bg-muted transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground cursor-not-allowed">
                        ⋯
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Usuarios Activos</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Conectados recientemente
                </p>
              </div>
              <a
                href="#"
                className="text-sm text-primary font-medium hover:underline"
              >
                <div className="flex items-center gap-1 justify-center">
                  Ver todo
                  <UseIcon
                    name="arrow-up-left"
                    className="size-3.5 rotate-y-180"
                  />
                </div>
              </a>
            </div>

            <div className="space-y-4">
              {usuariosLoading ? (
                <div className="py-6 text-sm text-muted-foreground">
                  Cargando…
                </div>
              ) : usuariosError ? (
                <div className="py-6 text-sm text-destructive">
                  {usuariosError}
                </div>
              ) : usuariosActivos.length === 0 ? (
                <div className="py-6 text-sm text-muted-foreground">
                  Sin usuarios activos.
                </div>
              ) : (
                usuariosActivos.slice(0, 5).map((user) => (
                  <div
                    key={String(user.id)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Image
                        src={`/default.webp`}
                        alt={user.nombre || "Usuario"}
                        className="size-9 rounded-full object-cover"
                        width={36}
                        height={36}
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">
                          {user.nombre || "—"}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {user.email || "—"}
                        </div>
                      </div>
                    </div>

                    <Badge variant="info">{user.rol || "—"}</Badge>
                  </div>
                ))
              )}

              <div className="pt-4 text-center">
                <a
                  href="#"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Ver mas...
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
