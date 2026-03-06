import type { IconName } from "@type/ui";

export type SidebarNavItemConfig = {
  label: string;
  tooltip: string;
  icon: IconName;
  url: string;
};

export const mainNav: SidebarNavItemConfig[] = [
  {
    label: "Inicio",
    tooltip: "Navegar al inicio",
    icon: "home",
    url: "/dashboard",
  },
  {
    label: "Estadisticas",
    tooltip: "Acceder a Estadisticas",
    icon: "charts",
    url: "/statistics",
  },
  {
    label: "Herramientas BD",
    tooltip: "Acceder a herramientas BD",
    icon: "db",
    url: "/data",
  },
];

export const usersNav: SidebarNavItemConfig[] = [
  {
    label: "Ver usuarios",
    tooltip: "Ver todos los usuarios",
    icon: "grid",
    url: "/users",
  },
  {
    label: "Crear usuario",
    tooltip: "Crear nuevo usuario",
    icon: "plus",
    url: "/users/create",
  }
];

export const otherNav: SidebarNavItemConfig[] = [
  {
    label: "Notificaciones",
    tooltip: "Notificaciones",
    icon: "bell",
    url: "/notification",
  },
];
