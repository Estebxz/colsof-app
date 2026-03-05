import { cn } from "@lib/utils";
import type { DataTableProps } from "@type/ui";

export function DataTable<T>({
  data,
  columns,
  getRowId,
  rowClassName,
  loading = false,
  error = null,
  emptyText = "Sin resultados.",
  className,
  tableClassName,
  bodyClassName,
}: DataTableProps<T>) {
  const colSpan = Math.max(columns.length, 1);

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className={cn("w-full border-collapse", tableClassName)}>
        <thead>
          <tr className="border-b border-border">
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  "text-left text-[10.5px] font-semibold uppercase tracking-[0.07em] text-muted-foreground pb-3 px-2.5 first:pl-0 last:pr-0",
                  c.headerClassName,
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody
          className={cn(
            "[&>tr]:border-b [&>tr]:border-border [&>tr:last-child]:border-0 [&>tr>td]:py-3 [&>tr>td]:px-2.5 [&>tr>td:first-child]:pl-0 [&>tr>td:last-child]:pr-0",
            bodyClassName,
          )}
        >
          {loading ? (
            <tr>
              <td
                colSpan={colSpan}
                className="py-6 text-sm text-muted-foreground"
              >
                Cargando…
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={colSpan} className="py-6 text-sm text-destructive">
                {error}
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={colSpan}
                className="py-6 text-sm text-muted-foreground"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={getRowId(row)}
                className={cn(
                  "transition-colors hover:bg-accent/60 -z-20",
                  rowClassName?.(row, index),
                )}
              >
                {columns.map((c) => (
                  <td key={c.key} className={cn("text-sm", c.cellClassName)}>
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
