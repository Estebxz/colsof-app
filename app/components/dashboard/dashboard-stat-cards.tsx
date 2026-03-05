"use client";

import { useMemo } from "react";
import { useDashboardStats } from "@hooks/use-dashboard-stats";
import { StatCard } from "@shared/stat-card";

export default function DashboardStatCards() {
  const { stats, loading, error } = useDashboardStats();

  const statCards = useMemo(
    () => [
      {
        title: "Solucionados",
        value: stats?.solucionados ?? 0,
        color: "var(--ring)",
      },
      { title: "Creados", value: stats?.creados ?? 0, color: "var(--warning)" },
      {
        title: "En Pausa",
        value: stats?.enPausa ?? 0,
        color: "var(--muted-foreground)",
      },
      {
        title: "Cerrados",
        value: stats?.cerrados ?? 0,
        color: "var(--success)",
      },
    ],
    [stats],
  );

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => (
        <StatCard
          key={stat.title}
          variant="success"
          pulse={true}
          loading={loading}
          error={error}
          {...stat}
        />
      ))}
    </section>
  );
}
