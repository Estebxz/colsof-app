import { NextResponse } from "next/server";

import { getSessionUser } from "@/app/server/auth/session";
import { createSupabaseAdminClient } from "@/app/server/db/supabase";

type QueryId = "tickets_recientes" | "tickets_no_resueltos" | "tickets_por_estado";

type ExecuteBody = {
  queryId: QueryId;
  params?: {
    limit?: number;
  };
};

function parseLimit(limit: unknown, fallback: number) {
  const parsed = typeof limit === "number" ? limit : Number(limit);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(Math.trunc(parsed), 1), 2000);
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const body = (await req.json().catch(() => null)) as ExecuteBody | null;
    const queryId = body?.queryId;

    if (!queryId) {
      return NextResponse.json({ error: "queryId es requerido" }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const limit = parseLimit(body?.params?.limit, 200);

    const base = supabase
      .schema("base_de_datos_csu")
      .from("ticket")
      .select("id_ticket, estado, fecha_creacion, fecha_actualizacion");

    let res:
      | Awaited<ReturnType<typeof base.limit>>
      | Awaited<ReturnType<typeof base.order>>;

    if (queryId === "tickets_recientes") {
      res = await base.order("fecha_creacion", { ascending: false }).limit(limit);
    } else if (queryId === "tickets_no_resueltos") {
      res = await base
        .neq("estado", "resuelto")
        .order("fecha_creacion", { ascending: false })
        .limit(limit);
    } else if (queryId === "tickets_por_estado") {
      res = await base.order("estado", { ascending: true }).limit(limit);
    } else {
      return NextResponse.json({ error: "queryId inválido" }, { status: 400 });
    }

    if (res.error) {
      console.error("/api/data/query supabase error", res.error);
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }

    const rows = (res.data || []) as Record<string, unknown>[];
    const columns = rows.length > 0 ? Object.keys(rows[0] as object) : [];

    return NextResponse.json({ data: { queryId, columns, rows } });
  } catch (err) {
    console.error("/api/data/query error", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
