"use client";

import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { Badge } from "@ui/badges";
import { Button } from "@ui/button";
import { AvatarInitials } from "@ui/avatar";
import { DataTable } from "@ui/data-table";
import { DropdownSelect } from "@ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@ui/sheet";

import type { Role, EstadoUsuario, Usuario } from "@type/user";
import { badgePropsForState } from "@lib/badge";
import { UseIcon } from "@hooks/use-icons";
import { useUsuarios } from "@hooks/use-usuarios";
import { useIsMobile } from "@hooks/use-mobile";
import { ConfirmActionDialog } from "@ui/confirm-action-dialog";
import { Input } from "@ui/input";
import { notifyError } from "@lib/notify";

export default function Users() {
  const isMobile = useIsMobile();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [rol, setRol] = useState<Role | null>(null);
  const [estado, setEstado] = useState<EstadoUsuario | null>(null);
  const [q, setQ] = useState<string>("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState<string>("");
  const [editRol, setEditRol] = useState<Role | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetEditingId, setSheetEditingId] = useState<string | null>(null);
  const [sheetMode, setSheetMode] = useState<"nombre" | "rol" | null>(null);

  const { usuarios, meta, totalPages, loading, error, refresh } = useUsuarios({
    page,
    pageSize,
    rol,
    estado,
    q,
  });

  function openInlineEditNombre(u: Usuario) {
    setEditingId(String(u.id));
    setEditNombre(u.nombre || "");
    setEditRol((u.rol as Role | null) || null);
  }

  function openSheetEdit(u: Usuario, mode: "nombre" | "rol") {
    const id = String(u.id);
    setSheetEditingId(id);
    setSheetMode(mode);
    setEditNombre(u.nombre || "");
    setEditRol((u.rol as Role | null) || null);
    setSheetOpen(true);
  }

  function requestEditNombre(u: Usuario) {
    if (isMobile) {
      openSheetEdit(u, "nombre");
      return;
    }

    openInlineEditNombre(u);
  }

  function requestEditRol(u: Usuario) {
    if (isMobile) {
      openSheetEdit(u, "rol");
      return;
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setEditNombre("");
    setEditRol(null);
  }

  function closeSheet() {
    setSheetOpen(false);
    setSheetEditingId(null);
    setSheetMode(null);
    setEditNombre("");
    setEditRol(null);
  }

  async function saveNombre(id: string) {
    if (savingId) return;
    setSavingId(id);

    try {
      const res = await fetch("/api/usuarios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          nombre: editNombre,
        }),
      });

      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!res.ok) {
        notifyError(json?.error || "No se pudo actualizar el usuario");
        return;
      }

      if (editingId === id) cancelEdit();
      if (sheetEditingId === id) closeSheet();
      await refresh({ silent: true });
    } catch (err) {
      console.error("PATCH /api/usuarios error", err);
      notifyError("No se pudo actualizar el usuario");
    } finally {
      setSavingId(null);
    }
  }

  async function saveRol(id: string, rol: Role) {
    if (savingId) return;
    setSavingId(id);

    try {
      const res = await fetch("/api/usuarios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          rol,
        }),
      });

      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!res.ok) {
        notifyError(json?.error || "No se pudo actualizar el rol");
        return;
      }

      if (editingId === id) cancelEdit();
      if (sheetEditingId === id) closeSheet();
      await refresh({ silent: true });
    } catch (err) {
      console.error("PATCH /api/usuarios (rol) error", err);
      notifyError("No se pudo actualizar el rol");
    } finally {
      setSavingId(null);
    }
  }

  async function setUserEstado(id: string, estado: EstadoUsuario) {
    if (savingId) return;
    setSavingId(id);
    try {
      const res = await fetch("/api/usuarios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          estado,
        }),
      });

      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!res.ok) {
        notifyError(
          json?.error || "No se pudo actualizar el estado del usuario",
        );
        return;
      }

      if (editingId === id) cancelEdit();
      if (sheetEditingId === id) closeSheet();
      await refresh({ silent: true });
    } catch (err) {
      console.error("PATCH /api/usuarios (estado) error", err);
      notifyError("No se pudo actualizar el estado del usuario");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Usuarios</h1>
        <p className="text-sm text-muted-foreground">
          Lista de usuarios con filtros por rol, estado y búsqueda.
        </p>
      </div>

      <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="bottom" className="bg-background">
            <SheetHeader>
              <SheetTitle>
                {sheetMode === "rol" ? "Cambiar rol" : "Editar usuario"}
              </SheetTitle>
            </SheetHeader>

            <div className="px-4 pb-2">
              {sheetMode !== "rol" ? (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Usuario
                  </label>
                  <input
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && sheetEditingId) {
                        void saveNombre(sheetEditingId);
                      }
                      if (e.key === "Escape") {
                        closeSheet();
                      }
                    }}
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              ) : null}

              {sheetMode === "rol" ? (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Rol
                  </label>
                  <select
                    value={editRol || ""}
                    onChange={(e) =>
                      setEditRol((e.target.value as Role) || null)
                    }
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="">—</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Gestor">Gestor</option>
                    <option value="Tecnico">Tecnico</option>
                  </select>
                </div>
              ) : null}
            </div>

            <SheetFooter>
              <Button
                variant="success"
                disabled={
                  loading || !sheetEditingId || savingId === sheetEditingId
                }
                onClick={() => {
                  if (!sheetEditingId) return;
                  if (sheetMode === "rol") {
                    if (!editRol) return;
                    void saveRol(sheetEditingId, editRol);
                    return;
                  }

                  void saveNombre(sheetEditingId);
                }}
              >
                <UseIcon name="check-circle" className="size-4 shrink-0" />
              </Button>
              <Button variant="destructive" onClick={closeSheet}>
                <UseIcon name="escape" className="size-4 shrink-0" />
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              Buscar (id, correo o nombre)
            </label>
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Ej: 12, juan@..., Juan"
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1 min-w-44">
            <label className="text-xs font-medium text-muted-foreground">
              Rol
            </label>
            <DropdownSelect<Role>
              value={rol}
              onValueChange={(v) => {
                setRol(v);
                setPage(1);
              }}
              placeholder="Rol"
              allLabel="Todos"
              options={[
                { value: "Administrador", label: "Administrador" },
                { value: "Gestor", label: "Gestor" },
                { value: "Tecnico", label: "Tecnico" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-1 min-w-44">
            <label className="text-xs font-medium text-muted-foreground">
              Estado
            </label>
            <DropdownSelect<EstadoUsuario>
              value={estado}
              onValueChange={(v) => {
                setEstado(v);
                setPage(1);
              }}
              placeholder="Estado"
              allLabel="Todos"
              options={[
                { value: "Activo", label: "Activo" },
                { value: "Inactivo", label: "Inactivo" },
                { value: "Suspendido", label: "Suspendido" },
              ]}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                Por página
              </label>
              <DropdownSelect<"10" | "25" | "50">
                value={String(pageSize) as "10" | "25" | "50"}
                onValueChange={(v) => {
                  const next = v ? Number(v) : 25;
                  setPageSize(next);
                  setPage(1);
                }}
                placeholder="Por página"
                allLabel="25"
                options={[
                  { value: "10", label: "10" },
                  { value: "25", label: "25" },
                  { value: "50", label: "50" },
                ]}
              />
            </div>
          </div>
        </div>

        {error ? (
          <div className="mt-3 text-sm text-destructive">{error}</div>
        ) : null}

        <div className="mt-4">
          <DataTable
            data={usuarios}
            loading={loading}
            error={error}
            emptyText="No hay usuarios para los filtros seleccionados."
            getRowId={(u) => String(u.id)}
            tableClassName="table-fixed"
            columns={[
              {
                key: "id",
                header: "ID",
                cell: (u) => (
                  <span className="font-medium text-foreground">{u.id}</span>
                ),
                headerClassName: "w-[72px]",
              },
              {
                key: "usuario",
                header: "Usuario",
                headerClassName: "w-[280px]",
                cell: (u) => (
                  <div className="flex items-center gap-2 min-w-0">
                    <AvatarInitials name={u.nombre || "—"} size="sm" />
                    {editingId === String(u.id) ? (
                      <Input
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            void saveNombre(String(u.id));
                          }
                          if (e.key === "Escape") {
                            cancelEdit();
                          }
                        }}
                      />
                    ) : (
                      <span className="h-9 flex min-w-0 flex-1 items-center truncate rounded-md border border-transparent px-2 text-foreground">
                        {u.nombre || "—"}
                      </span>
                    )}
                  </div>
                ),
              },
              {
                key: "correo",
                header: "Correo",
                headerClassName: "w-[260px]",
                cell: (u) => (
                  <span className="text-muted-foreground">
                    {u.email || "—"}
                  </span>
                ),
              },
              {
                key: "rol",
                header: "Rol",
                cell: (u) => <Badge variant="info">{u.rol || "—"}</Badge>,
              },
              {
                key: "estado",
                header: "Estado",
                cell: (u) => {
                  const { variant, pulse } = badgePropsForState(u.estado);
                  return (
                    <Badge variant={variant} pulse={pulse}>
                      {u.estado || "—"}
                    </Badge>
                  );
                },
              },
              {
                key: "acciones",
                header: "",
                headerClassName: "w-[160px]",
                cellClassName: "text-right",
                cell: (u) => {
                  const id = String(u.id);
                  const isEditing = editingId === id;

                  return (
                    <div className="flex items-center justify-end gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            disabled={loading || savingId === id}
                            onClick={() => void saveNombre(id)}
                          >
                            <UseIcon
                              name="check-circle"
                              className="size-4 shrink-0"
                            />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={loading || savingId === id}
                            onClick={cancelEdit}
                          >
                            <UseIcon
                              name="escape"
                              className="size-4 shrink-0"
                            />
                          </Button>
                        </>
                      ) : (
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={loading || savingId === id}
                              className="h-9 w-9 p-0"
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
                                onSelect={(e) => {
                                  e.preventDefault();
                                  requestEditNombre(u);
                                }}
                                className="flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted focus:ring-0 focus:ring-ring"
                              >
                                <UseIcon name="edit-user" className="size-4" />
                                <span className="flex-1 truncate">Editar</span>
                              </DropdownMenu.Item>

                              {isMobile ? (
                                <DropdownMenu.Item
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    requestEditRol(u);
                                  }}
                                  className="flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted focus:ring-0 focus:ring-ring"
                                >
                                  <UseIcon name="user-cog" className="size-4" />
                                  <span className="flex-1 truncate">
                                    Cambiar rol
                                  </span>
                                </DropdownMenu.Item>
                              ) : (
                                <>
                                  <DropdownMenu.Item
                                    onSelect={(e) => e.preventDefault()}
                                    className="flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-muted-foreground outline-none"
                                  >
                                    <UseIcon
                                      name="user-cog"
                                      className="size-4"
                                    />
                                    <span className="flex-1 truncate">
                                      Cambiar rol
                                    </span>
                                  </DropdownMenu.Item>

                                  {(
                                    [
                                      "Administrador",
                                      "Gestor",
                                      "Tecnico",
                                    ] as Role[]
                                  ).map((r) => (
                                    <DropdownMenu.Item
                                      key={r}
                                      onSelect={(e) => {
                                        e.preventDefault();
                                        void saveRol(id, r);
                                      }}
                                      className="ml-6 flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted focus:ring-0 focus:ring-ring"
                                    >
                                      <span className="flex-1 truncate">
                                        {r}
                                      </span>
                                      {u.rol === r ? (
                                        <UseIcon
                                          name="arrow-prev-small"
                                          className="size-4"
                                        />
                                      ) : null}
                                    </DropdownMenu.Item>
                                  ))}
                                </>
                              )}
                              <DropdownMenu.Separator className="my-1 h-px bg-border" />

                              {u.estado === "Inactivo" ? (
                                <DropdownMenu.Item
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    void setUserEstado(id, "Activo");
                                  }}
                                  className="flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted focus:ring-0 focus:ring-ring"
                                  disabled={loading || savingId === id}
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
                                        operar, pero se conservará el historial.
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
                                              badgePropsForState(u.estado);
                                            return (
                                              <Badge
                                                variant={variant}
                                                pulse={pulse}
                                                className="shrink-0"
                                              >
                                                {u.estado || "—"}
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
                                  disabled={loading || savingId === id}
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
                      )}
                    </div>
                  );
                },
              },
            ]}
          />
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground">
            {meta?.total !== null && meta?.total !== undefined
              ? `${meta.total.toLocaleString("es-CO")} usuarios`
              : ""}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={loading || page <= 1}
            >
              Anterior
            </Button>

            <div className="text-xs text-muted-foreground">
              Página {page}
              {totalPages ? ` / ${totalPages}` : ""}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={
                loading ||
                (totalPages !== null
                  ? page >= totalPages
                  : usuarios.length < pageSize)
              }
            >
              Siguiente
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
