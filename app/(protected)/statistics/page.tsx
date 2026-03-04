"use client";

import { Button } from "@/app/components/ui/button";
import { useMemo, useState } from "react";

import { useStatistics, type StatisticsRange } from "@hooks/use-statistics";

function formatNumber(n: number) {
  return n.toLocaleString("es-CO");
}

function formatHours(hours: number | null) {
  if (hours === null) return "—";
  return hours.toFixed(1);
}

function TrendChart({ points }: { points: { date: string; count: number }[] }) {
  const W = 600;
  const H = 200;
  const PAD = 16;

  const { d, fillD, max } = useMemo(() => {
    if (!points || points.length === 0) {
      return { d: "", fillD: "", max: 0 };
    }

    const maxVal = Math.max(1, ...points.map((p) => p.count));
    const minVal = 0;
    const innerW = W - PAD * 2;
    const innerH = H - PAD * 2;

    const xFor = (i: number) =>
      PAD + (innerW * i) / Math.max(points.length - 1, 1);
    const yFor = (v: number) =>
      PAD + innerH - ((v - minVal) / (maxVal - minVal)) * innerH;

    const path = points
      .map((p, i) => {
        const x = xFor(i);
        const y = yFor(p.count);
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");

    const lastX = xFor(points.length - 1);
    const baselineY = yFor(0);
    const fill = `${path} L${lastX.toFixed(2)} ${baselineY.toFixed(2)} L${xFor(
      0,
    ).toFixed(2)} ${baselineY.toFixed(2)} Z`;

    return { d: path, fillD: fill, max: maxVal };
  }, [points]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b6de8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3b6de8" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={W} height={H} fill="transparent" />

      <line
        x1={PAD}
        y1={H - PAD}
        x2={W - PAD}
        y2={H - PAD}
        stroke="#d8dce2"
        strokeWidth="1"
      />

      {fillD ? <path d={fillD} fill="url(#trendFill)" /> : null}
      {d ? <path d={d} fill="none" stroke="#3b6de8" strokeWidth="2" /> : null}

      <text x={PAD} y={PAD + 8} fontSize="10" fill="#8e95a3">
        Máx: {max}
      </text>
    </svg>
  );
}

export default function StatsPage() {
  const [range, setRange] = useState<StatisticsRange>("month");
  const { data, loading, error } = useStatistics(range);

  const total = data?.kpis.total ?? 0;
  const resueltos = data?.kpis.resueltos ?? 0;
  const avgHours = data?.kpis.avgResolutionHours ?? null;

  return (
    <div className="max-w-full flex flex-col gap-3.5">
      {/* KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#eef0f3] border border-[#e2e5ea] rounded-xl px-5 py-4 flex flex-col gap-1 shadow-sm hover:shadow-md transition-shadow">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8e95a3]">
            Total Casos
          </span>
          <strong
            id="totalCases"
            className="text-3xl font-semibold tracking-tight text-[#3b6de8]"
          >
            {loading ? "—" : formatNumber(total)}
          </strong>
          <small className="text-[11.5px] text-[#8e95a3]">
            Período seleccionado
          </small>
        </div>

        <div className="bg-[#eef0f3] border border-[#e2e5ea] rounded-xl px-5 py-4 flex flex-col gap-1 shadow-sm hover:shadow-md transition-shadow">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8e95a3]">
            Casos Resueltos
          </span>
          <strong
            id="casosResueltos"
            className="text-3xl font-semibold tracking-tight text-[#2eac76]"
          >
            {loading ? "—" : formatNumber(resueltos)}
          </strong>
          <small className="text-[11.5px] text-[#8e95a3]">del total</small>
        </div>

        <div className="bg-[#eef0f3] border border-[#e2e5ea] rounded-xl px-5 py-4 flex flex-col gap-1 shadow-sm hover:shadow-md transition-shadow">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8e95a3]">
            Tiempo Promedio
          </span>
          <strong
            id="tiempoPromedio"
            className="text-3xl font-semibold tracking-tight text-[#d47c1a]"
          >
            {loading ? "—" : formatHours(avgHours)}
          </strong>
          <small className="text-[11.5px] text-[#8e95a3]">horas</small>
        </div>

        <div className="bg-[#eef0f3] border border-[#e2e5ea] rounded-xl px-5 py-4 flex flex-col gap-1 shadow-sm hover:shadow-md transition-shadow">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8e95a3]">
            Satisfacción
          </span>
          <strong
            id="satisfaccion"
            className="text-3xl font-semibold tracking-tight text-[#7c5cbf]"
          >
            4.5
          </strong>
          <div className="text-[#f0b429] text-sm tracking-tight">★★★★★</div>
        </div>
      </section>

      {error ? (
        <div className="text-xs text-[#c0392b] px-1">{error}</div>
      ) : null}

      {/* Filtros */}
      <section className="flex flex-wrap gap-2 bg-[#eef0f3] border border-[#e2e5ea] rounded-xl p-2">
        <Button
          variant="outline"
          className="bg-background border-border text-foreground hover:bg-[#e2e5ea] hover:text-foreground text-xs font-medium rounded-lg"
          onClick={() => setRange("week")}
        >
          Última semana
        </Button>
        <Button
          variant="outline"
          className="bg-background border-border text-foreground hover:bg-[#e2e5ea] hover:text-foreground text-xs font-medium rounded-lg"
          onClick={() => setRange("month")}
        >
          Último mes
        </Button>
        <Button
          variant="outline"
          className="bg-background border-border text-foreground hover:bg-[#e2e5ea] hover:text-foreground text-xs font-medium rounded-lg"
          onClick={() => setRange("quarter")}
        >
          Trimestre
        </Button>
        <Button
          variant="outline"
          className="bg-background border-border text-foreground hover:bg-[#e2e5ea] hover:text-foreground text-xs font-medium rounded-lg"
          onClick={() => setRange("year")}
        >
          Año
        </Button>
        <Button
          variant="outline"
          className="ml-auto bg-[#3b6de8] border-[#3b6de8] text-[#eef0f3] hover:bg-[#2d5cd4] hover:text-[#eef0f3] text-xs font-medium rounded-lg flex items-center gap-1.5"
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exportar Reporte
        </Button>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        <div className="bg-[#eef0f3] border border-[#e2e5ea] rounded-xl p-5 shadow-sm">
          <h2 className="text-[13.5px] font-semibold text-[#1a1d23] mb-4">
            Tendencia de Casos
          </h2>
          {loading ? (
            <div className="text-xs text-[#8e95a3]">Cargando…</div>
          ) : (data?.trend?.length || 0) === 0 ? (
            <div className="text-xs text-[#8e95a3]">
              Sin datos para graficar.
            </div>
          ) : (
            <TrendChart points={data?.trend || []} />
          )}
        </div>

        <div className="bg-[#eef0f3] border border-[#e2e5ea] rounded-xl p-5 shadow-sm">
          <h2 className="text-[13.5px] font-semibold text-[#1a1d23] mb-4">
            Distribución Tiempo de Resolución
          </h2>
          <div id="timeDistribution" className="w-full" />
        </div>
      </section>

      {/* Tabla categorías */}
      <section className="bg-[#eef0f3] border border-[#e2e5ea] rounded-xl p-5 shadow-sm">
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
                    className="text-left text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#8e95a3] pb-3 px-2.5 first:pl-0 last:pr-0"
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
      <section className="bg-[#eef0f3] border border-[#e2e5ea] rounded-xl p-5 shadow-sm">
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
