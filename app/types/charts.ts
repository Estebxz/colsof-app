export type NameFormatter = (name: string) => string;
export type ValueFormatter = (value: unknown) => string;
export type LabelFormatter = (label: unknown) => string;

export type TooltipPayloadItem = {
  name?: string | number;
  value?: unknown;
  color?: string;
  stroke?: string;
  fill?: string;
  dataKey?: string | number;
};

export type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: unknown;
  className?: string;
  labelFormatter?: LabelFormatter;
  nameFormatter?: NameFormatter;
  valueFormatter?: ValueFormatter;
};

export type DashboardStats = {
  solucionados: number;
  creados: number;
  enPausa: number;
  cerrados: number;
};

export type TimeRange = "12m" | "6m" | "30d" | "7d";

export type ChartData = {
  labels: string[];
  created: number[];
  resolved: number[];
  totalCreated: number;
  totalResolved: number;
  subtitle: string;
};

export type UseDashboardStatsResult = {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export type Caso = {
  id: number | string | null;
  estado: string | null;
  fecha_creacion: string | null;
  fecha_actualizacion: string | null;
};

export type UseCasosResult = {
  casos: Caso[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};