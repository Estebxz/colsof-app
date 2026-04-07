import { IconName } from "./ui";

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
  resolutionDistribution: { label: string; value: number }[];
  truncated: boolean;
};

export type UseStatisticsResult = {
  data: StatisticsData | null;
  loading: boolean;
  error: string | null;
  refresh: (opts?: { silent?: boolean }) => Promise<void>;
};

export interface statsProps {
  label: string;
  value: number;
  subtext?: string;
  icon: IconName;
}

export const stats: statsProps[] = [
  {
    label: "Críticas",
    value: 2,
    icon: "alert-circle",
  },
  {
    label: "Sistema",
    value: 4,
    subtext: "3 nuevas",
    icon: "alert-circle",
  },
  {
    label: "Usuarios",
    value: 3,
    subtext: "2 nuevas",
    icon: "user",
  },
  {
    label: "Seguridad",
    value: 1,
    icon: "bell",
  },
  {
    label: "Base de Datos",
    value: 1,
    icon: "db",
  },
];
