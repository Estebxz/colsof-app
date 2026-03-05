"use client";

import { useMemo, useState } from "react";

import { Badge } from "@ui/badges";
import { Button } from "@ui/button";
import { AvatarInitials } from "@ui/avatar";
import { DataTable } from "@ui/data-table";
import { DropdownSelect } from "@ui/dropdown-menu";

import type { Role, EstadoUsuario } from "@type/user";
import { useUsuarios } from "@hooks/use-usuarios";

function normalizeString(v: string) {
  return v.trim();
}

function badgePropsForState(estado: string | null) {
  const e = (estado || "").toLowerCase();
  if (e === "activo") return { variant: "success" as const, pulse: true };
  if (e === "suspendido") return { variant: "warning" as const, pulse: false };
  if (e === "inactivo")
    return { variant: "destructive" as const, pulse: false };
  return { variant: "ghost" as const, pulse: false };
}

export default function Users() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [rol, setRol] = useState<Role | null>(null);
  const [estado, setEstado] = useState<EstadoUsuario | null>(null);
  const [q, setQ] = useState<string>("");

  const qTrimmed = useMemo(() => {
    const v = normalizeString(q);
    return v.length > 0 ? v : null;
  }, [q]);

  const { usuarios, meta, loading, error } = useUsuarios({
    page,
    pageSize,
    rol,
    estado,
    q: qTrimmed,
  });

  const totalPages = meta?.total
    ? Math.max(1, Math.ceil(meta.total / pageSize))
    : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Usuarios</h1>
        <p className="text-sm text-muted-foreground">
          Lista de usuarios con filtros por rol, estado y búsqueda.
        </p>
      </div>

      <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
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
            columns={[
              {
                key: "id",
                header: "ID",
                cell: (u) => (
                  <span className="font-medium text-foreground">{u.id}</span>
                ),
              },
              {
                key: "usuario",
                header: "Usuario",
                cell: (u) => (
                  <div className="flex items-center gap-2 min-w-0">
                    <AvatarInitials name={u.nombre || "—"} size="sm" />
                    <span className="truncate text-foreground">
                      {u.nombre || "—"}
                    </span>
                  </div>
                ),
              },
              {
                key: "correo",
                header: "Correo",
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
