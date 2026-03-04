import { cn } from "@lib/utils";
import type {
  ChartTooltipProps,
  TooltipPayloadItem,
  LabelFormatter,
  NameFormatter,
  ValueFormatter,
} from "@type/charts";

const defaultLabelFormatter: LabelFormatter = (label) => {
  if (label === null || label === undefined) return "";
  return String(label);
};

const defaultNameFormatter: NameFormatter = (name) => name;

const defaultValueFormatter: ValueFormatter = (value) => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return value.toLocaleString("es-CO");
  return String(value);
};

export function ChartTooltip({
  active,
  payload,
  label,
  className,
  labelFormatter = defaultLabelFormatter,
  nameFormatter = defaultNameFormatter,
  valueFormatter = defaultValueFormatter,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const header = labelFormatter(label);

  return (
    <div
      className={cn(
        "min-w-40 rounded-lg border border-border bg-popover px-3 py-2 shadow-md",
        className,
      )}
    >
      <div className="text-sm font-semibold text-foreground leading-none">
        {header}
      </div>
      <div className="my-2 h-px w-full bg-border" />

      <div className="flex flex-col gap-1">
        {payload.map((item: TooltipPayloadItem) => {
          const color =
            (item.color as string | undefined) ||
            (item.stroke as string | undefined) ||
            (item.fill as string | undefined) ||
            "currentColor";

          const seriesName = nameFormatter(String(item.name ?? ""));
          const seriesValue = valueFormatter(item.value);

          return (
            <div
              key={String(item.dataKey ?? item.name)}
              className="flex items-center gap-2"
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="flex-1 text-sm text-muted-foreground truncate">
                {seriesName}
              </span>
              <span className="text-sm font-semibold text-foreground tabular-nums">
                {seriesValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChartTooltip;
