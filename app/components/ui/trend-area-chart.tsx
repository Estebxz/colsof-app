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

export type TrendPoint = {
  label: string;
  value: number;
};

export type TrendAreaChartProps = {
  points: TrendPoint[];
  height?: number | `${number}%`;
  color?: string;
  seriesLabel?: string;
};

export function TrendAreaChart({
  points,
  height = "100%",
  color = "var(--primary)",
  seriesLabel = "Casos",
}: TrendAreaChartProps) {
  const gradId = useId().replace(/:/g, "");

  const data = useMemo(
    () => points.map((p) => ({ label: p.label, value: p.value })),
    [points],
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
        <defs>
          <linearGradient id={`trend-${gradId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="85%" stopColor={color} stopOpacity={0.03} />
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
              nameFormatter={() => seriesLabel}
            />
          }
        />

        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#trend-${gradId})`}
          dot={false}
          activeDot={{ r: 4, stroke: "white", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default TrendAreaChart;
