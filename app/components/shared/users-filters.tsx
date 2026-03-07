"use client";

import { DropdownSelect } from "@ui/dropdown-menu";
import type { DropdownSelectProps } from "@type/ui";

type Option<T extends string> = DropdownSelectProps<T>["options"][number];

type UsersFiltersProps<Role extends string, Estado extends string> = {
  q: string;
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  rol: Role | null;
  onRolChange: (v: Role | null) => void;
  roleOptions: Option<Role>[];

  estado: Estado | null;
  onEstadoChange: (v: Estado | null) => void;
  estadoOptions: Option<Estado>[];

  pageSize: number;
  onPageSizeChange: (value: "5" | "10" | "25" | null) => void;
  pageSizeOptions: Option<"5" | "10" | "25">[];
};

export function UsersFilters<Role extends string, Estado extends string>({
  q,
  onQueryChange,
  rol,
  onRolChange,
  roleOptions,
  estado,
  onEstadoChange,
  estadoOptions,
  pageSize,
  onPageSizeChange,
  pageSizeOptions,
}: UsersFiltersProps<Role, Estado>) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:flex-wrap sm:items-end">
      <div className="col-span-2 flex flex-col gap-1 sm:flex-1 sm:min-w-65">
        <label className="text-xs font-medium text-muted-foreground">
          Buscar (id, correo o nombre)
        </label>
        <input
          value={q}
          onChange={onQueryChange}
          placeholder="Ej: 12, juan@..., Juan"
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-1 sm:w-auto sm:min-w-44">
        <label className="text-xs font-medium text-muted-foreground">Rol</label>
        <DropdownSelect<Role>
          value={rol}
          onValueChange={onRolChange}
          placeholder="Rol"
          allLabel="Todos"
          options={roleOptions}
        />
      </div>

      <div className="flex flex-col gap-1 sm:w-auto sm:min-w-44">
        <label className="text-xs font-medium text-muted-foreground">
          Estado
        </label>
        <DropdownSelect<Estado>
          value={estado}
          onValueChange={onEstadoChange}
          placeholder="Estado"
          allLabel="Todos"
          options={estadoOptions}
        />
      </div>

      <div className="col-span-2 flex flex-col gap-1 sm:col-span-1 sm:w-auto sm:min-w-32">
        <label className="text-xs font-medium text-muted-foreground">
          Por página
        </label>
        <DropdownSelect<"5" | "10" | "25">
          value={String(pageSize) as "5" | "10" | "25"}
          onValueChange={onPageSizeChange}
          placeholder="Por página"
          allLabel="10"
          options={pageSizeOptions}
        />
      </div>
    </div>
  );
}
