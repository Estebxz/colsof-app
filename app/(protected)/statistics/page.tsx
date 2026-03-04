"use client";

import { useMemo, useState } from "react";
import { Button } from "@ui/button";
import { StatCard } from "@shared/stat-card";
import { TrendAreaChart } from "@ui/trend-area-chart";

import { useStatistics, type StatisticsRange } from "@hooks/use-statistics";
import { UseIcon } from "@hooks/use-icons";

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

export default function StatsPage() {
  const [range, setRange] = useState<StatisticsRange>("month");
  const { data, loading, error } = useStatistics(range);

  const total = data?.kpis.total ?? 0;
  const resueltos = data?.kpis.resueltos ?? 0;
  const avgHours = data?.kpis.avgResolutionHours ?? null;

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
        statusLabel: "★★★★★",
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

      {error ? (
        <div className="text-xs text-destructive-foreground px-1">{error}</div>
      ) : null}

      <section className="flex flex-wrap gap-2 bg-card border border-border rounded-xl p-2">
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
        <Button variant="info" size="sm" className="ml-auto">
          <UseIcon name="download" className="size-5 shrink-0" />
          <span>Exportar CSV</span>
        </Button>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h2 className="text-[13.5px] font-semibold text-[#1a1d23] mb-4">
            Tendencia de Casos
          </h2>
          {loading ? (
            <div className="text-xs text-muted-foreground">Cargando…</div>
          ) : (data?.trend?.length || 0) === 0 ? (
            <div className="text-xs text-muted-foreground">
              Sin datos para graficar.
            </div>
          ) : (
            <div className="w-full h-52">
              <TrendAreaChart
                points={(data?.trend || []).map((p) => ({
                  label: p.date,
                  value: p.count,
                }))}
                seriesLabel="Casos"
                color="var(--primary)"
              />
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h2 className="text-[13.5px] font-semibold text-[#1a1d23] mb-4">
            Distribución Tiempo de Resolución
          </h2>
          <div id="timeDistribution" className="w-full" />
        </div>
      </section>

      {/* Tabla categorías */}
      <section className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h2 className="text-[13.5px] font-semibold text-[#1a1d23] mb-4">
          Estadísticas por Categoría
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#d8dce2]">
                {[
                  "Categoría",
                  "Total",
                  "Resueltos",
                  "%",
                  "Tiempo",
                  "Distribución",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[10.5px] font-semibold uppercase tracking-[0.07em] text-muted-foreground pb-3 px-2.5 first:pl-0 last:pr-0"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              id="categoryTable"
              className="[&>tr]:border-b [&>tr]:border-[#e2e5ea] [&>tr:last-child]:border-0 [&>tr>td]:py-3 [&>tr>td]:px-2.5 [&>tr>td:first-child]:pl-0 [&>tr>td:last-child]:pr-0 [&>tr>td]:text-[13px] [&>tr>td]:text-[#1a1d23] [&>tr:hover>td]:bg-[#f0f2f5] [&>tr]:transition-colors"
            />
          </table>
        </div>
      </section>

      {/* Técnicos */}
      <section className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h2 className="text-[13.5px] font-semibold text-[#1a1d23] mb-4">
          Rendimiento de Técnicos
        </h2>
        <div
          id="technicians"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
        />
      </section>
    </div>
  );
}
