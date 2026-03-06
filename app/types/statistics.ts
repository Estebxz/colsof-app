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

export type UseStatisticsResult = {
  data: StatisticsData | null;
  loading: boolean;
  error: string | null;
  refresh: (opts?: { silent?: boolean }) => Promise<void>;
};
