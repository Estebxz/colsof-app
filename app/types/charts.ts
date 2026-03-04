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