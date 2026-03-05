import { NextResponse } from "next/server";

import { getSessionUser } from "@auth/session";
import { createSupabaseAdminClient } from "@/app/server/db/supabase";
import { StatisticsRange } from "@type/statistics";

function getRangeStart(range: StatisticsRange) {
  const now = new Date();
  const d = new Date(now);

  if (range === "week") d.setDate(d.getDate() - 7);
  else if (range === "month") d.setMonth(d.getMonth() - 1);
  else if (range === "quarter") d.setMonth(d.getMonth() - 3);
  else d.setFullYear(d.getFullYear() - 1);

  return d;
}

function toDayKey(input: string | Date) {
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const rangeParam = (url.searchParams.get("range") || "month") as StatisticsRange;
    const range: StatisticsRange =
      rangeParam === "week" ||
      rangeParam === "month" ||
      rangeParam === "quarter" ||
      rangeParam === "year"
        ? rangeParam
        : "month";

    const from = getRangeStart(range);
    const fromIso = from.toISOString();

    const supabase = createSupabaseAdminClient();

    const totalRes = await supabase
      .schema("base_de_datos_csu")
      .from("ticket")
      .select("id_ticket", { count: "exact", head: true })
      .gte("fecha_creacion", fromIso);

    const resueltosRes = await supabase
      .schema("base_de_datos_csu")
      .from("ticket")
      .select("id_ticket", { count: "exact", head: true })
      .eq("estado", "resuelto")
      .gte("fecha_creacion", fromIso);

    if (totalRes.error || resueltosRes.error) {
      console.error("/api/statistics count error", totalRes.error, resueltosRes.error);
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }

    const total = totalRes.count ?? 0;
    const resueltos = resueltosRes.count ?? 0;

    const MAX_ROWS = 5000;
    const { data: rows, error: rowsError } = await supabase
      .schema("base_de_datos_csu")
      .from("ticket")
      .select("estado, fecha_creacion, fecha_actualizacion")
      .gte("fecha_creacion", fromIso)
      .order("fecha_creacion", { ascending: true })
      .limit(MAX_ROWS);

    if (rowsError) {
      console.error("/api/statistics rows error", rowsError);
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }

    const byDay = new Map<string, number>();
    let resolutionCount = 0;
    let resolutionHoursSum = 0;

    for (const r of rows || []) {
      const day = toDayKey(r.fecha_creacion);
      if (day) byDay.set(day, (byDay.get(day) || 0) + 1);

      if (r.estado === "resuelto" && r.fecha_creacion && r.fecha_actualizacion) {
        const created = new Date(r.fecha_creacion);
        const updated = new Date(r.fecha_actualizacion);
        const ms = updated.getTime() - created.getTime();
        if (Number.isFinite(ms) && ms >= 0) {
          resolutionCount += 1;
          resolutionHoursSum += ms / (1000 * 60 * 60);
        }
      }
    }

    const trend = Array.from(byDay.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count }));

    const avgResolutionHours =
      resolutionCount > 0 ? resolutionHoursSum / resolutionCount : null;

    return NextResponse.json({
      data: {
        range,
        from: fromIso,
        kpis: {
          total,
          resueltos,
          avgResolutionHours,
        },
        trend,
        truncated: (rows || []).length >= MAX_ROWS,
      },
    });
  } catch (err) {
    console.error("/api/statistics error", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
