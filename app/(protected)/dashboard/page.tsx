"use client";

import { useMemo, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { useUsuarios } from "@hooks/use-usuarios";
import { UseIcon } from "@hooks/use-icons";
import DashboardStatCards from "@dashboard/dashboard-stat-cards";
import CasesReport from "@dashboard/cases-report";
import { Badge } from "@ui/badges";
import { AvatarInitials } from "@ui/avatar";
import { DataTable } from "@ui/data-table";
import { badgePropsForState } from "@lib/badge";
import { Button } from "@ui/button";
import { ConfirmActionDialog } from "@ui/confirm-action-dialog";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  const {
    usuarios,
    loading: usuariosLoading,
    error: usuariosError,
    refresh,
  } = useUsuarios({ page: 1, pageSize: 200 });

  const [savingId, setSavingId] = useState<string | null>(null);

  async function saveRol(id: string, rol: string) {
    if (savingId) return;
    setSavingId(id);

    try {
      const res = await fetch("/api/usuarios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, rol }),
      });

      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!res.ok) {
        alert(json?.error || "No se pudo actualizar el rol");
        return;
      }

      await refresh({ silent: true });
    } catch (err) {
      console.error("PATCH /api/usuarios (rol) error", err);
      alert("No se pudo actualizar el rol");
    } finally {
      setSavingId(null);
    }
  }

  async function setUserEstado(id: string, estado: string) {
    if (savingId) return;
    setSavingId(id);

    try {
      const res = await fetch("/api/usuarios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado }),
      });

      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!res.ok) {
        alert(json?.error || "No se pudo actualizar el estado del usuario");
        return;
      }

      await refresh({ silent: true });
    } catch (err) {
      console.error("PATCH /api/usuarios (estado) error", err);
      alert("No se pudo actualizar el estado del usuario");
    } finally {
      setSavingId(null);
    }
  }

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
                    cell: (u) => {
                      const estadoLabel =
                        u.estado || (u.activo ? "Activo" : "Inactivo");
                      const { variant, pulse } =
                        badgePropsForState(estadoLabel);

                      return (
                        <Badge variant={variant} pulse={pulse}>
                          {estadoLabel}
                        </Badge>
                      );
                    },
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
                    cell: (u) => {
                      const id = String(u.id);
                      const estadoLabel =
                        u.estado || (u.activo ? "Activo" : "Inactivo");

                      return (
                        <div className="block text-right">
                          <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                disabled={usuariosLoading || savingId === id}
                                className="size-8 p-0"
                                aria-label="Acciones"
                              >
                                <UseIcon name="dot-menu" className="size-4" />
                              </Button>
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Portal>
                              <DropdownMenu.Content
                                sideOffset={6}
                                align="end"
                                className="min-w-40 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
                              >
                                <DropdownMenu.Item
                                  onSelect={(e) => e.preventDefault()}
                                  className="flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-muted-foreground outline-none"
                                >
                                  <UseIcon name="user-cog" className="size-4" />
                                  <span className="flex-1 truncate">
                                    Cambiar rol
                                  </span>
                                </DropdownMenu.Item>

                                {(
                                  [
                                    "Administrador",
                                    "Gestor",
                                    "Tecnico",
                                  ] as const
                                ).map((r) => (
                                  <DropdownMenu.Item
                                    key={r}
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      void saveRol(id, r);
                                    }}
                                    className="ml-6 flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted focus:ring-0 focus:ring-ring"
                                  >
                                    <span className="flex-1 truncate">{r}</span>
                                    {u.rol === r ? (
                                      <UseIcon
                                        name="arrow-prev-small"
                                        className="size-4"
                                      />
                                    ) : null}
                                  </DropdownMenu.Item>
                                ))}

                                <DropdownMenu.Separator className="my-1 h-px bg-border" />

                                {estadoLabel === "Inactivo" ? (
                                  <DropdownMenu.Item
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      void setUserEstado(id, "Activo");
                                    }}
                                    className="flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted focus:ring-0 focus:ring-ring"
                                    disabled={
                                      usuariosLoading || savingId === id
                                    }
                                  >
                                    <UseIcon
                                      name="alert-circle"
                                      className="size-4"
                                    />
                                    <span className="flex-1 truncate">
                                      Activar
                                    </span>
                                  </DropdownMenu.Item>
                                ) : (
                                  <ConfirmActionDialog
                                    title="Desactivar usuario"
                                    description="Esta acción puede revertirse más adelante"
                                    details={
                                      <div className="space-y-3">
                                        <p className="text-sm text-popover-foreground">
                                          El usuario quedará inactivo y no podrá
                                          operar, pero se conservará el
                                          historial.
                                        </p>

                                        <div className="rounded-lg border border-border bg-card px-4 py-3">
                                          <div className="flex items-center gap-3">
                                            <AvatarInitials
                                              name={u.nombre || "—"}
                                              size="sm"
                                            />
                                            <div className="min-w-0 flex-1">
                                              <div className="truncate text-sm font-medium text-foreground">
                                                {u.nombre || "—"}
                                              </div>
                                              <div className="truncate text-xs text-muted-foreground">
                                                {u.email || "—"}
                                              </div>
                                            </div>

                                            {(() => {
                                              const { variant, pulse } =
                                                badgePropsForState(estadoLabel);
                                              return (
                                                <Badge
                                                  variant={variant}
                                                  pulse={pulse}
                                                  className="shrink-0"
                                                >
                                                  {estadoLabel}
                                                </Badge>
                                              );
                                            })()}
                                          </div>
                                        </div>
                                      </div>
                                    }
                                    confirmText="Desactivar"
                                    onConfirm={async () => {
                                      await setUserEstado(id, "Inactivo");
                                    }}
                                    disabled={
                                      usuariosLoading || savingId === id
                                    }
                                  >
                                    <DropdownMenu.Item
                                      onSelect={(e) => {
                                        e.preventDefault();
                                      }}
                                      className="flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted focus:ring-0 focus:ring-ring"
                                    >
                                      <UseIcon
                                        name="alert-circle"
                                        className="size-4"
                                      />
                                      <span className="flex-1 truncate">
                                        Desactivar
                                      </span>
                                    </DropdownMenu.Item>
                                  </ConfirmActionDialog>
                                )}

                                <DropdownMenu.Arrow className="fill-popover" />
                              </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                          </DropdownMenu.Root>
                        </div>
                      );
                    },
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
