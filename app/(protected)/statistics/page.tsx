"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@ui/button";
import { StatCard } from "@shared/stat-card";
import type { TrendAreaChartProps } from "@type/charts";

import { useStatistics } from "@hooks/use-statistics";
import { UseIcon } from "@hooks/use-icons";
import { StatisticsRange } from "@type/statistics";
import { DataTable } from "@ui/data-table";

const TrendAreaChart = dynamic<TrendAreaChartProps>(
  () => import("@ui/trend-area-chart"),
  {
    ssr: false,
    loading: () => <div className="h-52 w-full" />,
  },
);

const STAT_RANGES: { value: StatisticsRange; label: string }[] = [
  { value: "year", label: "Año" },
  { value: "quarter", label: "Trimestre" },
  { value: "month", label: "Último mes" },
  { value: "week", label: "Última semana" },
];

function formatHours(hours: number | null) {
  if (hours === null) return "—";
  return hours.toFixed(1);
}

function toIsoDay(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function buildZeroTrend(range: StatisticsRange) {
  const now = new Date();

  if (range === "year") {
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now);
      d.setMonth(d.getMonth() - (11 - i));
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      return { label: `${yyyy}-${mm}`, value: 0 };
    });
  }

  if (range === "quarter") {
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (11 - i) * 7);
      return { label: toIsoDay(d), value: 0 };
    });
  }

  const days = range === "month" ? 30 : 7;
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (days - 1 - i));
    return { label: toIsoDay(d), value: 0 };
  });
}

type GlobalStatsRow = {
  label: string;
  total: number;
  resueltos: number;
  porcentaje: string;
  tiempo: string;
  distribucion: string;
};

export default function StatsPage() {
  const [range, setRange] = useState<StatisticsRange>("month");
  const { data, loading } = useStatistics(range);

  const total = data?.kpis.total ?? 0;
  const resueltos = data?.kpis.resueltos ?? 0;
  const avgHours = data?.kpis.avgResolutionHours ?? null;

  const trendPoints = useMemo(() => {
    if (loading) return [];
    const incoming = data?.trend || [];
    if (incoming.length > 0) {
      return incoming.map((p) => ({ label: p.date, value: p.count }));
    }
    return buildZeroTrend(range);
  }, [data?.trend, loading, range]);

  const globalTableData = useMemo<GlobalStatsRow[]>(() => {
    const t = data?.kpis.total ?? 0;
    const r = data?.kpis.resueltos ?? 0;
    const pct = t > 0 ? `${Math.round((r / t) * 100)}%` : "—";

    const distribution = (() => {
      const dist = data?.resolutionDistribution || [];
      const totalDist = dist.reduce((acc, p) => acc + (p.value || 0), 0);
      if (totalDist <= 0) return "—";

      let top = dist[0];
      for (const p of dist) {
        if ((p.value || 0) > (top?.value || 0)) top = p;
      }

      if (!top) return "—";
      const topPct = Math.round(((top.value || 0) / totalDist) * 100);
      return `${top.label} (${topPct}%)`;
    })();

    return [
      {
        label: "General",
        total: t,
        resueltos: r,
        porcentaje: pct,
        tiempo: formatHours(data?.kpis.avgResolutionHours ?? null),
        distribucion: distribution,
      },
    ];
  }, [
    data?.kpis.avgResolutionHours,
    data?.kpis.resueltos,
    data?.kpis.total,
    data?.resolutionDistribution,
  ]);

  const globalTableColumns = useMemo(
    () => [
      {
        key: "label",
        header: "Categoría",
        cell: (row: GlobalStatsRow) => row.label,
      },
      {
        key: "total",
        header: "Total",
        cell: (row: GlobalStatsRow) => row.total,
      },
      {
        key: "resueltos",
        header: "Resueltos",
        cell: (row: GlobalStatsRow) => row.resueltos,
      },
      {
        key: "porcentaje",
        header: "%",
        cell: (row: GlobalStatsRow) => row.porcentaje,
      },
      {
        key: "tiempo",
        header: "Tiempo",
        cell: (row: GlobalStatsRow) => row.tiempo,
      },
      {
        key: "distribucion",
        header: "Distribución",
        cell: (row: GlobalStatsRow) => row.distribucion,
      },
    ],
    [],
  );

  const statCards = useMemo(
    () => [
      {
        title: "Total Casos",
        value: total,
        color: "var(--ring)",
        statusLabel: "Período seleccionado",
      },
      {
        title: "Casos Resueltos",
        value: resueltos,
        color: "var(--success)",
        statusLabel: "del total",
      },
      {
        title: "Tiempo Promedio",
        value: avgHours === null ? "—" : formatHours(avgHours),
        color: "var(--muted-foreground)",
        statusLabel: "horas",
      },
      {
        title: "Satisfacción",
        value: 4.5,
        color: "#7c5cbf",
      },
    ],
    [avgHours, resueltos, total],
  );

  return (
    <div className="max-w-full flex flex-col gap-3.5">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {statCards.map((stat) => (
          <StatCard
            key={stat.title}
            loading={loading}
            title={stat.title}
            value={stat.value}
            color={stat.color}
            statusLabel={stat.statusLabel}
            variant="ghost"
          />
        ))}
      </section>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm pb-6">    
      <section className="flex items-end justify-end gap-1.5 shrink-0 mb-4">
        {STAT_RANGES.map(({ value, label }) => (
          <Button
            key={value}
            variant={range === value ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setRange(value)}
            disabled={loading}
            aria-pressed={range === value}
          >
            {label}
          </Button>
        ))}
        <Button variant="info" size="sm">
          <UseIcon name="download" className="size-5 shrink-0" />
          <span>Exportar CSV</span>
        </Button>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold tracking-tight text-foreground truncate mb-4">
            Tendencia de Casos
          </h2>
          {loading ? (
            <div className="text-xs text-muted-foreground">Cargando…</div>
          ) : (
            <div className="w-full h-52">
              <TrendAreaChart
                points={trendPoints}
                seriesLabel="Casos"
                color="var(--primary)"
              />
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold tracking-tight text-foreground truncate mb-4">
            Distribución Tiempo de Resolución
          </h2>
          {loading ? (
            <div className="text-xs text-muted-foreground">Cargando…</div>
          ) : (data?.resolutionDistribution?.length || 0) === 0 ? (
            <div className="text-xs text-muted-foreground">
              Sin datos para graficar.
            </div>
          ) : (
            <div className="w-full h-52">
              <TrendAreaChart
                points={(data?.resolutionDistribution || []).map((p) => ({
                  label: p.label,
                  value: p.value,
                }))}
                seriesLabel="Resoluciones"
                color="var(--ring)"
              />
            </div>
          )}
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-5 shadow-sm mt-6">
        <h2 className="text-lg font-semibold tracking-tight text-foreground truncate mb-4">
          Estadísticas por Categoría
        </h2>
        <DataTable
          data={globalTableData}
          columns={globalTableColumns}
          getRowId={(row) => row.label}
          loading={loading}
          emptyText="Sin datos."
        />
      </section>
      </div>
    </div>
  );
}
