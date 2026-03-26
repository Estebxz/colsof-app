import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/app/server/db/supabase";
import { createUserSchema } from "@schemas/create";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      nombre?: string | null;
      email?: string | null;
      contrasena?: string | null;
    } | null;

    const parsed = createUserSchema.safeParse({
      nombre: typeof body?.nombre === "string" ? body.nombre : "",
      email: typeof body?.email === "string" ? body.email : "",
      contrasena: typeof body?.contrasena === "string" ? body.contrasena : "",
      rol: "Tecnico",
      state: "Activo",
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Datos inválidos" },
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdminClient();

    const { data: existingUser, error: existingUserError } = await supabase
      .schema("base_de_datos_csu")
      .from("usuario")
      .select("id_usuario")
      .eq("nombre_usuario", parsed.data.nombre)
      .maybeSingle();

    if (existingUserError) {
      console.error("/api/signup POST supabase unique check error", existingUserError);
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
      .eq("correo", parsed.data.email)
      .maybeSingle();

    if (existingEmailError) {
      console.error("/api/signup POST supabase email unique check error", existingEmailError);
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }

    if (existingEmail) {
      return NextResponse.json(
        { field: "email", error: "El correo ya existe" },
        { status: 409 },
      );
    }

    const insertPayload: Record<string, unknown> = {
      nombre_usuario: parsed.data.nombre,
      correo: parsed.data.email,
      contrasena: parsed.data.contrasena,
      rol: "Tecnico",
      estado: "Activo",
    };

    const { error } = await supabase
      .schema("base_de_datos_csu")
      .from("usuario")
      .insert(insertPayload);

    if (error) {
      console.error("/api/signup POST supabase error", error);
      if ("code" in error && error.code === "23505") {
        return NextResponse.json({ error: "Registro duplicado" }, { status: 409 });
      }
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("/api/signup POST error", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
