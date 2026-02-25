import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { setSession } from "@/app/server/auth/session";
import { pool } from "@/app/server/db/pool";
import { loginSchema } from "@/app/server/schemas/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Datos inválidos";
      return NextResponse.json(
        {
          error: message,
          issues: parsed.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    const result = await pool.query(
      "select id, email, password_hash, rol, nombre, apellido, activo from public.usuarios where lower(email) = $1 limit 1",
      [email],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 },
      );
    }

    const user = result.rows[0] as {
      id: string;
      email: string;
      password_hash: string;
      rol: string;
      nombre: string;
      apellido: string;
      activo: boolean;
    };

    if (!user.activo) {
      return NextResponse.json({ error: "Usuario inactivo" }, { status: 403 });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 },
      );
    }

    await setSession({
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol,
    });

    return NextResponse.json({
      data: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (err) {
    console.error("/api/login error", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
