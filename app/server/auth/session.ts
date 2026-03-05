import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { SessionUser, SessionPayload } from "@type/auth";
import { COOKIE_NAME } from "@lib/constants";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) { throw new Error("AUTH_SECRET requerido"); }
  return new TextEncoder().encode(secret);
}

export async function setSession(user: SessionUser) {
  const token = await new SignJWT({ user } satisfies SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const p = payload as unknown as SessionPayload;
    return p.user ?? null;
  } catch {
    return null;
  }
}
