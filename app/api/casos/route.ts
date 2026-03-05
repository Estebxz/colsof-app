import { NextResponse } from "next/server";

import { getSessionUser } from "@auth/session";
import { createSupabaseAdminClient } from "@/app/server/db/supabase";

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit");

    const parsedLimit = limitParam ? Number(limitParam) : NaN;
    const limit = Number.isFinite(parsedLimit)
      ? Math.min(Math.max(Math.trunc(parsedLimit), 1), 2000)
      : 500;

    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .schema("base_de_datos_csu")
      .from("ticket")
      .select("id_ticket, estado, fecha_creacion, fecha_actualizacion")
      .order("fecha_creacion", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("/api/casos supabase error", error);
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }

    const casos = (data || []).map((t) => ({
      id: t.id_ticket,
      estado: t.estado,
      fecha_creacion: t.fecha_creacion,
      fecha_actualizacion: t.fecha_actualizacion,
    }));

    return NextResponse.json({ data: casos });
  } catch (err) {
    console.error("/api/casos error", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
