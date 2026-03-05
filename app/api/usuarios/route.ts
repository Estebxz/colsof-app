import { NextResponse } from "next/server";

import { getSessionUser } from "@auth/session";
import { createSupabaseAdminClient } from "@/app/server/db/supabase";

function parseIntParam(v: string | null, fallback: number) {
  const n = v ? Number(v) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.trunc(n);
}

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const pageParam = url.searchParams.get("page");
    const pageSizeParam = url.searchParams.get("pageSize");
    const limitParam = url.searchParams.get("limit");

    const roleParam = url.searchParams.get("rol")?.trim() || null;
    const estadoParam = url.searchParams.get("estado")?.trim() || null;
    const qParam = url.searchParams.get("q")?.trim() || null;

    const page = Math.max(parseIntParam(pageParam, 1), 1);
    const pageSize = Math.min(
      Math.max(parseIntParam(pageSizeParam, 25), 1),
      100,
    );
    const limit = limitParam
      ? Math.min(Math.max(parseIntParam(limitParam, 200), 1), 500)
      : null;

    const supabase = createSupabaseAdminClient();

    let query = supabase
      .schema("base_de_datos_csu")
      .from("usuario")
      .select("id_usuario, nombre_usuario, correo, rol, estado", {
        count: "exact",
      })
      .order("nombre_usuario", { ascending: true });

    if (roleParam) {
      query = query.eq("rol", roleParam);
    }

    if (estadoParam) {
      query = query.eq("estado", estadoParam);
    }

    if (qParam) {
      const qAsNumber = Number(qParam);
      if (Number.isFinite(qAsNumber)) {
        query = query.eq("id_usuario", Math.trunc(qAsNumber));
      } else {
        const escaped = qParam.replaceAll(",", "");
        query = query.or(
          `nombre_usuario.ilike.%${escaped}%,correo.ilike.%${escaped}%`,
        );
      }
    }

    if (limit !== null) {
      query = query.limit(limit);
    } else {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("/api/usuarios supabase error", error);
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }

    const usuarios = (data || []).map((u) => {
      const estado = u.estado ? String(u.estado) : null;
      return {
        id: u.id_usuario,
        nombre: u.nombre_usuario ?? null,
        email: u.correo ?? null,
        rol: u.rol ?? null,
        estado,
        activo: estado ? estado.toLowerCase() === "activo" : false,
      };
    });

    return NextResponse.json({
      data: usuarios,
      meta: {
        page: limit !== null ? 1 : page,
        pageSize: limit !== null ? usuarios.length : pageSize,
        total: count ?? null,
      },
    });
  } catch (err) {
    console.error("/api/usuarios error", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
