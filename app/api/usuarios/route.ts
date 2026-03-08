import { NextResponse } from "next/server";

import { getSessionUser } from "@auth/session";
import { createSupabaseAdminClient } from "@/app/server/db/supabase";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseIntParam(v: string | null, fallback: number) {
  const n = v ? Number(v) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.trunc(n);
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const body = (await req.json().catch(() => null)) as {
      nombre?: string | null;
      email?: string | null;
      contrasena?: string | null;
      rol?: string | null;
      state?: string | null;
    } | null;

    const nombre = typeof body?.nombre === "string" ? body.nombre.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const contrasenaRaw =
      typeof body?.contrasena === "string" ? body.contrasena.trim() : "";
    const rol = typeof body?.rol === "string" ? body.rol.trim() : "";
    const state = typeof body?.state === "string" ? body.state.trim() : "";

    if (!nombre) {
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
    }

    if (!contrasenaRaw) {
      return NextResponse.json(
        { error: "Contraseña requerida" },
        { status: 400 },
      );
    }

    if (rol !== "Gestor" && rol !== "Tecnico" && rol !== "Administrador") {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
    }

    if (state && state !== "Activo" && state !== "Inactivo") {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    const adminIdRaw = String(user.id || "").trim();
    const adminIdNumber = Number(adminIdRaw);
    const administrador_id_administrador = Number.isFinite(adminIdNumber)
      ? Math.trunc(adminIdNumber)
      : null;

    const supabase = createSupabaseAdminClient();

    const { data: existingUser, error: existingUserError } = await supabase
      .schema("base_de_datos_csu")
      .from("usuario")
      .select("id_usuario")
      .eq("nombre_usuario", nombre)
      .maybeSingle();

    if (existingUserError) {
      console.error(
        "/api/usuarios POST supabase unique check error",
        existingUserError,
      );
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }

    if (existingUser) {
      return NextResponse.json(
        { field: "nombre", error: "El nombre de usuario ya existe" },
        { status: 409 },
      );
    }

    const { data: existingEmail, error: existingEmailError } = await supabase
      .schema("base_de_datos_csu")
      .from("usuario")
      .select("id_usuario")
      .eq("correo", email)
      .maybeSingle();

    if (existingEmailError) {
      console.error(
        "/api/usuarios POST supabase email unique check error",
        existingEmailError,
      );
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }

    if (existingEmail) {
      return NextResponse.json(
        { field: "email", error: "El correo ya existe" },
        { status: 409 },
      );
    }

    const insertPayload: Record<string, unknown> = {
      nombre_usuario: nombre,
      correo: email,
      contrasena: contrasenaRaw,
      rol,
      estado: state || "Activo",
    };

    if (administrador_id_administrador !== null) {
      insertPayload.administrador_id_administrador =
        administrador_id_administrador;
    }

    const { error } = await supabase
      .schema("base_de_datos_csu")
      .from("usuario")
      .insert(insertPayload);

    if (error) {
      console.error("/api/usuarios POST supabase error", error);

      if ("code" in error && error.code === "23505") {
        return NextResponse.json(
          { error: "Registro duplicado" },
          { status: 409 },
        );
      }

      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("/api/usuarios POST error", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
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

export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const body = (await req.json().catch(() => null)) as {
      id?: number | string;
      nombre?: string | null;
      rol?: string | null;
      estado?: string | null;
    } | null;

    const idRaw = body?.id;
    const id =
      typeof idRaw === "number" || typeof idRaw === "string"
        ? String(idRaw).trim()
        : "";

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const nombre = body?.nombre ?? null;
    const rol = body?.rol ?? null;
    const estado = body?.estado ?? null;

    if (nombre !== null && typeof nombre !== "string") {
      return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
    }

    if (rol !== null && typeof rol !== "string") {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
    }

    if (estado !== null) {
      if (typeof estado !== "string") {
        return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
      }

      const e = estado.trim().toLowerCase();
      if (e !== "activo" && e !== "inactivo" && e !== "suspendido") {
        return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
      }
    }

    if (nombre === null && rol === null && estado === null) {
      return NextResponse.json(
        { error: "Nada para actualizar" },
        { status: 400 },
      );
    }

    const payload: Record<string, unknown> = {};
    if (nombre !== null) payload.nombre_usuario = nombre.trim();
    if (rol !== null) payload.rol = rol;
    if (estado !== null) payload.estado = estado;

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .schema("base_de_datos_csu")
      .from("usuario")
      .update(payload)
      .eq("id_usuario", id);

    if (error) {
      console.error("/api/usuarios PATCH supabase error", error);
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("/api/usuarios PATCH error", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const idParam = url.searchParams.get("id");
    const id = idParam ? idParam.trim() : "";

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .schema("base_de_datos_csu")
      .from("usuario")
      .delete()
      .eq("id_usuario", id);

    if (error) {
      console.error("/api/usuarios DELETE supabase error", error);
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("/api/usuarios DELETE error", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
