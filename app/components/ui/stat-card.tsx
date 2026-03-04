"use client";

import { Badge } from "@ui/badges";
import { cn } from "@lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  color?: string;
  loading?: boolean;
  error?: string | null;
  className?: string;
  icon?: React.ReactNode;
  statusLabel?: string;
  variant?: "default" | "success" | "destructive" | "warning" | "info" | "outline" | "ghost" | "secondary";
  pulse?: boolean;
}

export function StatCard({
  title,
  value,
  color,
  loading = false,
  error = null,
  className,
  icon,
  statusLabel = "Actualizado",
  variant = "default",
  pulse = false,
}: StatCardProps) {
  const displayValue = loading
    ? "—"
    : typeof value === "number"
      ? value.toLocaleString("es-CO")
      : value;

  return (
    <div
      className={cn(
        "bg-card text-card-foreground border border-border rounded-xl p-5 shadow-sm",
        className,
      )}
    >
      <div className="text-xs text-muted-foreground tracking-wide mb-2 uppercase font-medium flex items-center gap-1.5">
        {icon}
        {title}
      </div>

      <div
        className="text-4xl font-bold leading-none mb-3 tabular-nums transition-opacity duration-300"
        style={{ color }}
      >
        {displayValue}
      </div>

      {error ? (
        <p
          className="text-sm font-medium text-destructive truncate"
          title={error}
        >
          {error}
        </p>
      ) : (
        <Badge variant={variant} size="sm" pulse={pulse}>
          {loading ? "Cargando..." : statusLabel}
        </Badge>
      )}
    </div>
  );
}
