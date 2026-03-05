"use client";

import { useCallback, useEffect, useState } from "react";
import type { StatisticsRange, StatisticsData, UseStatisticsResult } from "@type/statistics";

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
