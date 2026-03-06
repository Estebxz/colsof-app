export type Role = "Administrador" | "Gestor" | "Tecnico" | (string & {});
export type EstadoUsuario = "Activo" | "Inactivo" | "Suspendido";

export type Usuario = {
  id: number | string;
  nombre: string | null;
  email: string | null;
  rol: string | null;
  estado: EstadoUsuario | null;
  activo: boolean;
};

export type UsuariosFilters = {
  rol?: string | null;
  estado?: EstadoUsuario | null;
  q?: string | null;
};

export type UsuariosMeta = {
  page: number;
  pageSize: number;
  total: number | null;
};

export type UseUsuariosResult = {
  usuarios: Usuario[];
  meta: UsuariosMeta | null;
  totalPages: number | null;
  loading: boolean;
  error: string | null;
  refresh: (opts?: { silent?: boolean }) => Promise<void>;
};
