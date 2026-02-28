"use client";

import { useMemo } from "react";

import { useDashboardStats } from "@/app/hooks/use-dashboard-stats";

export default function DashboardStatCards() {
  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = useDashboardStats();

  const statCards = useMemo(
    () => [
      { title: "Solucionados", value: stats?.solucionados ?? 0 },
      { title: "Creados", value: stats?.creados ?? 0 },
      { title: "En Pausa", value: stats?.enPausa ?? 0 },
      { title: "Cerrados", value: stats?.cerrados ?? 0 },
    ],
    [stats],
  );

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => (
        <div
          key={stat.title}
          className="bg-card text-card-foreground border border-border rounded-xl p-5 shadow-sm"
        >
          <div className="text-xs text-muted-foreground tracking-wide mb-2 uppercase font-semibold">
            {stat.title}
          </div>

          <div className="text-2xl font-bold leading-none mb-2">
            {statsLoading ? "—" : stat.value.toLocaleString("es-CO")}
          </div>

          {statsError ? (
            <div className="text-sm font-medium text-destructive">
              {statsError}
            </div>
          ) : (
            <div className="text-sm font-medium text-muted-foreground">
              {statsLoading ? "Cargando..." : "Actualizado"}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
