import type React from "react";

export type LoginUserProps = {
  id: string | number;
  nombre?: string;
  apellido?: string;
  email: string;
  rol?: Role;
};

export type Role = "Administrador" | "Gestor" | "Tecnico" | (string & {});
export type EstadoUsuario = "Activo" | "Inactivo" | "Suspendido";

export type IconName =
  | "arrow-left"
  | "arrow-right"
  | "grid"
  | "github"
  | "escape"
  | "linkedin"
  | "panel-left"
  | "panel-right"
  | "plus"
  | "spinner"
  | "archive-box"
  | "trash"
  | "donut"
  | "arrow-up-left"
  | "alert-circle"
  | "eye-rounded"
  | "home"
  | "charts"
  | "db"
  | "user"
  | "camera"
  | "bell"
  | "terminal"
  | "spinner"
  | "download"
  | "whatsapp"
  | "arrow-prev-small"
  | "dot-menu";

export type DashboardStats = {
  solucionados: number;
  creados: number;
  enPausa: number;
  cerrados: number;
};

export type DropdownSelectProps<T extends string> = {
  value: T | null;
  onValueChange: (value: T | null) => void;
  options: DropdownSelectOption<T>[];
  placeholder: string;
  allLabel?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
};

type DropdownSelectOption<T extends string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

export type DataTableColumn<T> = {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

export type DataTableProps<T> = {
  data: T[];
  columns: Array<DataTableColumn<T>>;
  getRowId: (row: T) => string;
  rowClassName?: (row: T, index: number) => string | undefined;
  loading?: boolean;
  error?: string | null;
  emptyText?: string;
  className?: string;
  tableClassName?: string;
  bodyClassName?: string;
};

export type SessionUser =
 {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: Role;
};

export type SessionPayload = {
  user: SessionUser;
};