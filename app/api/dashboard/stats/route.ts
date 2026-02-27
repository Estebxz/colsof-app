import { NextResponse } from "next/server";

import { getSessionUser } from "@/app/server/auth/session";
import { createSupabaseAdminClient } from "@/app/server/db/supabase";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const supabase = createSupabaseAdminClient();

    const [resueltosRes, totalRes, pausadosRes, cerradosRes] =
      await Promise.all([
        supabase
          .schema("base_de_datos_csu")
          .from("ticket")
          .select("id_ticket", { count: "exact", head: true })
          .eq("estado", "resuelto"),
        supabase
          .schema("base_de_datos_csu")
          .from("ticket")
          .select("id_ticket", { count: "exact", head: true }),
        supabase
          .schema("base_de_datos_csu")
          .from("ticket")
          .select("id_ticket", { count: "exact", head: true })
          .eq("estado", "escalado"),
        supabase
          .schema("base_de_datos_csu")
          .from("ticket")
          .select("id_ticket", { count: "exact", head: true })
          .eq("estado", "cerrado"),
      ]);

    const firstError =
      resueltosRes.error ||
      totalRes.error ||
      pausadosRes.error ||
      cerradosRes.error;

    if (firstError) {
      console.error("/api/dashboard/stats supabase error", firstError);
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        solucionados: resueltosRes.count ?? 0,
        creados: totalRes.count ?? 0,
        enPausa: pausadosRes.count ?? 0,
        cerrados: cerradosRes.count ?? 0,
      },
    });
  } catch (err) {
    console.error("/api/dashboard/stats error", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
