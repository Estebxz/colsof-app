"use client";

import { useMemo } from "react";

import { useUsuarios } from "@hooks/use-usuarios";
import DashboardStatCards from "@/app/components/dashboard/dashboard-stat-cards";
import CasesReport from "@/app/components/dashboard/cases-report";
import Image from "next/image";
import { Badge } from "@/app/components/ui/badges";
import { UseIcon } from "@/app/hooks/use-icons";
import { AvatarInitials } from "@/app/components/ui/avatar";
import { DataTable } from "@ui/data-table";
import Link from "next/link";

export default function Dashboard() {
  const {
    usuarios,
    loading: usuariosLoading,
    error: usuariosError,
  } = useUsuarios({ page: 1, pageSize: 200 });

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
              <Link
                href="/users"
                className="text-sm text-primary font-medium hover:underline"
              >
                <div className="flex items-center gap-1 justify-center">
                  Ver todo
                  <UseIcon
                    name="arrow-up-left"
                    className="size-3.5 rotate-y-180"
                  />
                </div>
              </Link>
            </div>

            <div className="w-full">
              <DataTable
                data={usuarios.slice(0, 5)}
                loading={usuariosLoading}
                error={usuariosError}
                emptyText="Sin usuarios."
                getRowId={(u) => String(u.id)}
                columns={[
                  {
                    key: "id",
                    header: "ID",
                    cell: (u) => (
                      <span className="font-medium text-foreground">
                        {u.id}
                      </span>
                    ),
                    headerClassName: "w-[72px]",
                  },
                  {
                    key: "usuario",
                    header: "Usuario",
                    cell: (u) => (
                      <div className="flex items-center gap-2.5 min-w-0 pr-0 sm:pr-4">
                        <AvatarInitials
                          name={u.nombre || "—"}
                          className="hidden sm:flex size-8"
                        />
                        <div className="min-w-0">
                          <div className="font-medium truncate">
                            {u.nombre || "—"}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {u.email || "—"}
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: "estado",
                    header: "Estado",
                    cell: (u) => (
                      <Badge
                        variant={
                          (u.estado || "").toLowerCase() === "suspendido"
                            ? "warning"
                            : u.activo
                              ? "success"
                              : "destructive"
                        }
                        pulse
                      >
                        {u.estado || (u.activo ? "Activo" : "Inactivo")}
                      </Badge>
                    ),
                  },
                  {
                    key: "rol",
                    header: "Rol",
                    cell: (u) => <Badge variant="info">{u.rol || "—"}</Badge>,
                  },
                  {
                    key: "acciones",
                    header: "",
                    headerClassName: "w-[48px]",
                    cell: () => (
                      <div className="hidden sm:block text-right">
                        <button className="size-7 rounded-md hover:bg-muted transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground cursor-not-allowed">
                          ⋯
                        </button>
                      </div>
                    ),
                    cellClassName: "text-right",
                  },
                ]}
              />
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
              <Link
                href="/users"
                className="text-sm text-primary font-medium hover:underline"
              >
                <div className="flex items-center gap-1 justify-center">
                  Ver todo
                  <UseIcon
                    name="arrow-up-left"
                    className="size-3.5 rotate-y-180"
                  />
                </div>
              </Link>
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
