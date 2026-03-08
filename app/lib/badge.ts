import type { StateUser } from "@type/user";

export function badgePropsForState(estado: StateUser | null) {
  const e = (estado || "").toLowerCase();
  if (e === "activo") return { variant: "success" as const, pulse: true };
  if (e === "suspendido") return { variant: "warning" as const, pulse: false };
  if (e === "inactivo") return { variant: "destructive" as const, pulse: false };
  return { variant: "ghost" as const, pulse: false };
}