"use client";

import { useCallback, useMemo, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { Badge } from "@ui/badges";
import { Button } from "@ui/button";
import { AvatarInitials } from "@ui/avatar";
import { DataTable } from "@ui/data-table";
import { ConfirmActionDialog } from "@ui/confirm-action-dialog";
import { Input } from "@ui/input";

import { UsersFilters } from "@components/shared/users-filters";
import { badgePropsForState } from "@lib/badge";
import { notifyError } from "@lib/notify";
import { UseIcon } from "@hooks/use-icons";
import { useUsuarios } from "@hooks/use-usuarios";
import type { Role, EstadoUsuario, Usuario } from "@type/user";

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "Administrador", label: "Administrador" },
  { value: "Gestor", label: "Gestor" },
  { value: "Tecnico", label: "Tecnico" },
];

const ESTADO_OPTIONS: { value: EstadoUsuario; label: string }[] = [
  { value: "Activo", label: "Activo" },
  { value: "Inactivo", label: "Inactivo" },
  { value: "Suspendido", label: "Suspendido" },
];

const PAGE_SIZE_OPTIONS: { value: "5" | "10" | "25"; label: string }[] = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "25", label: "25" },
];

const ROLE_VALUES = ROLE_OPTIONS.map((o) => o.value) as Role[];

export default function Users() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rol, setRol] = useState<Role | null>(null);
  const [estado, setEstado] = useState<EstadoUsuario | null>(null);
  const [q, setQ] = useState<string>("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState<string>("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const { usuarios, meta, totalPages, loading, error, refresh } = useUsuarios({
    page,
    pageSize,
    rol,
    estado,
    q,
  });

  const openInlineEditNombre = useCallback((u: Usuario) => {
    setEditingId(String(u.id));
    setEditNombre(u.nombre || "");
  }, []);

  const requestEditNombre = useCallback(
    (u: Usuario) => {
      openInlineEditNombre(u);
    },
    [openInlineEditNombre],
  );

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditNombre("");
  }, []);

  const saveNombre = useCallback(
    async (id: string) => {
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
        await refresh({ silent: true });
      } catch (err) {
        console.error("PATCH /api/usuarios error", err);
        notifyError("No se pudo actualizar el usuario");
      } finally {
        setSavingId(null);
      }
    },
    [cancelEdit, editNombre, editingId, refresh, savingId],
  );

  const saveRol = useCallback(
    async (id: string, nextRol: Role) => {
      if (savingId) return;
      setSavingId(id);

      try {
        const res = await fetch("/api/usuarios", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            rol: nextRol,
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
        await refresh({ silent: true });
      } catch (err) {
        console.error("PATCH /api/usuarios (rol) error", err);
        notifyError("No se pudo actualizar el rol");
      } finally {
        setSavingId(null);
      }
    },
    [cancelEdit, editingId, refresh, savingId],
  );

  const setUserEstado = useCallback(
    async (id: string, nextEstado: EstadoUsuario) => {
      if (savingId) return;
      setSavingId(id);
      try {
        const res = await fetch("/api/usuarios", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            estado: nextEstado,
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
        await refresh({ silent: true });
      } catch (err) {
        console.error("PATCH /api/usuarios (estado) error", err);
        notifyError("No se pudo actualizar el estado del usuario");
      } finally {
        setSavingId(null);
      }
    },
    [cancelEdit, editingId, refresh, savingId],
  );

  const onQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQ(e.target.value);
      setPage(1);
    },
    [],
  );

  const onRolChange = useCallback((v: Role | null) => {
    setRol(v);
    setPage(1);
  }, []);

  const onEstadoChange = useCallback((v: EstadoUsuario | null) => {
    setEstado(v);
    setPage(1);
  }, []);

  const onPageSizeChange = useCallback((v: "5" | "10" | "25" | null) => {
    const next = v ? Number(v) : 10;
    setPageSize(next);
    setPage(1);
  }, []);

  const columns = useMemo(
    () => [
      {
        key: "id",
        header: "ID",
        cell: (u: Usuario) => (
          <span className="font-medium text-foreground">{u.id}</span>
        ),
        headerClassName: "w-[72px]",
      },
      {
        key: "usuario",
        header: "Usuario",
        headerClassName: "w-[280px]",
        cell: (u: Usuario) => (
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
        cell: (u: Usuario) => (
          <span className="text-muted-foreground">{u.email || "—"}</span>
        ),
      },
      {
        key: "rol",
        header: "Rol",
        cell: (u: Usuario) => <Badge variant="info">{u.rol || "—"}</Badge>,
      },
      {
        key: "estado",
        header: "Estado",
        cell: (u: Usuario) => {
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
        cell: (u: Usuario) => {
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
                    <UseIcon name="check-circle" className="size-4 shrink-0" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={loading || savingId === id}
                    onClick={cancelEdit}
                  >
                    <UseIcon name="escape" className="size-4 shrink-0" />
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

                      <DropdownMenu.Item
                        onSelect={(e) => e.preventDefault()}
                        className="flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-muted-foreground outline-none"
                      >
                        <UseIcon name="user-cog" className="size-4" />
                        <span className="flex-1 truncate">Cambiar rol</span>
                      </DropdownMenu.Item>

                      {ROLE_VALUES.map((r) => (
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

                      {u.estado === "Inactivo" ? (
                        <DropdownMenu.Item
                          onSelect={(e) => {
                            e.preventDefault();
                            void setUserEstado(id, "Activo");
                          }}
                          className="flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted focus:ring-0 focus:ring-ring"
                          disabled={loading || savingId === id}
                        >
                          <UseIcon name="alert-circle" className="size-4" />
                          <span className="flex-1 truncate">Activar</span>
                        </DropdownMenu.Item>
                      ) : (
                        <ConfirmActionDialog
                          title="Desactivar usuario"
                          description="Esta acción puede revertirse más adelante"
                          details={
                            <div className="space-y-3">
                              <p className="text-sm text-popover-foreground">
                                El usuario quedará inactivo y no podrá operar,
                                pero se conservará el historial.
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
                            <UseIcon name="alert-circle" className="size-4" />
                            <span className="flex-1 truncate">Desactivar</span>
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
    ],
    [
      cancelEdit,
      editNombre,
      editingId,
      loading,
      requestEditNombre,
      saveNombre,
      saveRol,
      savingId,
      setUserEstado,
    ],
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <UsersFilters<Role, EstadoUsuario>
          q={q}
          onQueryChange={onQueryChange}
          rol={rol}
          onRolChange={onRolChange}
          roleOptions={ROLE_OPTIONS}
          estado={estado}
          onEstadoChange={onEstadoChange}
          estadoOptions={ESTADO_OPTIONS}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
        />
        <section className="mt-6">
          <div className="w-full">
            <DataTable
              data={usuarios}
              loading={loading}
              error={error}
              emptyText="No hay usuarios para los filtros seleccionados."
              getRowId={(u) => String(u.id)}
              columns={columns}
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
    </div>
  );
}
