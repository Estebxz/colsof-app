"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import { Button } from "@ui/button";
import { CustomLegend } from "@charts/legend";
import { UseIcon } from "@hooks/use-icons";
import type { CasesAreaChartProps } from "@/app/components/dashboard/cases-area-chart";
import { useCasos } from "@hooks/use-casos";
import type { TimeRange, ChartData } from "@type/charts";

const CasesAreaChart = dynamic<CasesAreaChartProps>(
  () => import("@/app/components/dashboard/cases-area-chart"),
  {
    ssr: false,
    loading: () => <div className="h-52 w-full" />,
  },
);

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: "12m", label: "12 Meses" },
  { value: "6m", label: "6 Meses" },
  { value: "30d", label: "30 Días" },
  { value: "7d", label: "7 Días" },
];

function toKey(dateStr: string, mode: "day" | "month") {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  if (mode === "day") return d.toISOString().slice(0, 10);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function CasesReport() {
  const { casos, loading: casosLoading, error: casosError } = useCasos(2000);
  const [timeRange, setTimeRange] = useState<TimeRange>("12m");

  const onExportCsv = useCallback(() => {
    try {
      const headers = ["ID", "Estado", "Fecha Creación", "Fecha Actualización"];
      const rows = [
        headers,
        ...casos.map((c) => [
          String(c.id ?? ""),
          String(c.estado ?? ""),
          String(c.fecha_creacion ?? ""),
          String(c.fecha_actualizacion ?? ""),
        ]),
      ];
      const csv = rows
        .map((r) => r.map((cell) => `"${cell}"`).join(","))
        .join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte_casos_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("export csv error", err);
    }
  }, [casos]);

  const chartData: ChartData = useMemo(() => {
    const isDays = timeRange === "7d" || timeRange === "30d";
    const steps =
      timeRange === "7d"
        ? 7
        : timeRange === "30d"
          ? 30
          : timeRange === "6m"
            ? 6
            : 12;
    const mode: "day" | "month" = isDays ? "day" : "month";

    const keys: string[] = [];
    const labels: string[] = [];
    const now = new Date();

    if (mode === "day") {
      for (let i = steps - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        keys.push(d.toISOString().slice(0, 10));
        labels.push(String(d.getDate()).padStart(2, "0"));
      }
    } else {
      const monthNames = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];
      for (let i = steps - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        keys.push(
          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        );
        labels.push(monthNames[d.getMonth()]);
      }
    }

    const createdMap = new Map<string, number>(keys.map((k) => [k, 0]));
    const resolvedMap = new Map<string, number>(keys.map((k) => [k, 0]));

    for (const c of casos) {
      if (c.fecha_creacion) {
        const k = toKey(c.fecha_creacion, mode);
        if (k && createdMap.has(k))
          createdMap.set(k, (createdMap.get(k) || 0) + 1);
      }
      if ((c.estado || "").toLowerCase() === "resuelto") {
        const date = c.fecha_actualizacion || c.fecha_creacion;
        if (date) {
          const k = toKey(date, mode);
          if (k && resolvedMap.has(k))
            resolvedMap.set(k, (resolvedMap.get(k) || 0) + 1);
        }
      }
    }

    const created = keys.map((k) => createdMap.get(k) || 0);
    const resolved = keys.map((k) => resolvedMap.get(k) || 0);

    return {
      labels,
      created,
      resolved,
      totalCreated: created.reduce((a, b) => a + b, 0),
      totalResolved: resolved.reduce((a, b) => a + b, 0),
      subtitle: isDays
        ? timeRange === "7d"
          ? "Últimos 7 días"
          : "Últimos 30 días"
        : timeRange === "6m"
          ? "Últimos 6 meses"
          : "Últimos 12 meses",
    };
  }, [casos, timeRange]);

  return (
    <section aria-labelledby="cases-report-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-5">
        <div className="space-y-0.5 min-w-0">
          <h2
            id="cases-report-title"
            className="text-lg font-semibold tracking-tight text-foreground truncate"
          >
            Reporte de casos
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {casosError
              ? casosError
              : casosLoading
                ? "Cargando datos…"
                : `${chartData.subtitle} · Creados: ${chartData.totalCreated.toLocaleString("es-CO")} · Resueltos: ${chartData.totalResolved.toLocaleString("es-CO")}`}
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
          {TIME_RANGES.map(({ value, label }) => (
            <Button
              key={value}
              variant={timeRange === value ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTimeRange(value)}
              disabled={casosLoading}
              aria-pressed={timeRange === value}
            >
              {label}
            </Button>
          ))}

          <Button
            size="sm"
            variant="info"
            onClick={onExportCsv}
            disabled={casosLoading || !!casosError || casos.length === 0}
            aria-label="Exportar datos como CSV"
          >
            <UseIcon
              name="download"
              className="size-5 shrink-0 text-background"
            />
            <span>Exportar CSV</span>
          </Button>
        </div>
      </div>

      <div className="w-full rounded-lg border border-border bg-card shadow-sm p-3 sm:p-4">
        <CustomLegend />

        <div className="w-full h-48 sm:h-64 lg:h-72">
          {casosLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <div className="w-full max-w-xs h-2 rounded-full bg-muted animate-pulse" />
                <div className="w-full max-w-sm h-2 rounded-full bg-muted animate-pulse opacity-60" />
                <span className="text-xs mt-1">Cargando gráfico…</span>
              </div>
            </div>
          ) : casosError ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-destructive text-center px-4">
                {casosError}
              </p>
            </div>
          ) : (
            <CasesAreaChart
              labels={chartData.labels}
              created={chartData.created}
              resolved={chartData.resolved}
            />
          )}
        </div>
      </div>
    </section>
  );
}
