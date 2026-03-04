"use client";

import { ChartTooltip } from "@ui/char-tooltip";
import { useId, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type CasesAreaChartProps = {
  labels: string[];
  created: number[];
  resolved: number[];
  height?: number | `${number}%`;
};

type Row = {
  label: string;
  created: number;
  resolved: number;
};

export function CasesAreaChart({
  labels,
  created,
  resolved,
  height = "100%",
}: CasesAreaChartProps) {
  const gradId = useId().replace(/:/g, "");

  const data: Row[] = useMemo(() => {
    const n = Math.max(labels.length, created.length, resolved.length);
    return Array.from({ length: n }, (_, i) => ({
      label: labels[i] ?? "",
      created: created[i] ?? 0,
      resolved: resolved[i] ?? 0,
    }));
  }, [labels, created, resolved]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
        <defs>
          <linearGradient id={`created-${gradId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.22} />
            <stop offset="85%" stopColor="var(--primary)" stopOpacity={0.03} />
          </linearGradient>
          <linearGradient id={`resolved-${gradId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--success)" stopOpacity={0.18} />
            <stop offset="85%" stopColor="var(--success)" stopOpacity={0.03} />
          </linearGradient>
        </defs>

        <CartesianGrid
          stroke="var(--border)"
          strokeDasharray="4 4"
          vertical={false}
        />

        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          height={20}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          width={34}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
        />

        <Tooltip
          cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "4 3" }}
          content={
            <ChartTooltip
              nameFormatter={(name) =>
                name === "created"
                  ? "Creados"
                  : name === "resolved"
                    ? "Resueltos"
                    : name
              }
            />
          }
        />

        <Area
          type="monotone"
          dataKey="created"
          stroke="var(--primary)"
          strokeWidth={2}
          fill={`url(#created-${gradId})`}
          dot={false}
          activeDot={{ r: 4, stroke: "white", strokeWidth: 2 }}
        />

        <Area
          type="monotone"
          dataKey="resolved"
          stroke="var(--success)"
          strokeWidth={2}
          fill={`url(#resolved-${gradId})`}
          dot={false}
          activeDot={{ r: 4, stroke: "white", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default CasesAreaChart;
