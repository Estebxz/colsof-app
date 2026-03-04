"use client";

import { useCallback, useEffect, useState } from "react";

export type StatisticsRange = "week" | "month" | "quarter" | "year";

export type StatisticsData = {
  range: StatisticsRange;
  from: string;
  kpis: {
    total: number;
    resueltos: number;
    avgResolutionHours: number | null;
  };
  trend: { date: string; count: number }[];
  truncated: boolean;
};

type UseStatisticsResult = {
  data: StatisticsData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useStatistics(range: StatisticsRange): UseStatisticsResult {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/statistics?range=${range}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const json = (await res.json().catch(() => null)) as
        | { data?: StatisticsData; error?: string }
        | null;

      if (!res.ok) {
        setError(json?.error || "Error al cargar estadísticas");
        return;
      }

      if (!json?.data) {
        setError("Respuesta inválida del servidor");
        return;
      }

      setData(json.data);
    } catch (err) {
      console.error("/api/statistics error", err);
      setError("Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
