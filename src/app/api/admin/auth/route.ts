import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  createAdminSessionToken,
  getAdminSessionCookieMaxAge,
  getAdminSessionCookieName,
  verifyAdminPin,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

type AuthRequestBody = {
  pin?: unknown;
};

export async function POST(request: Request) {
  let body: AuthRequestBody = {};

  try {
    body = (await request.json()) as AuthRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const pin = typeof body.pin === "string" ? body.pin : "";
  try {
    if (!verifyAdminPin(pin)) {
      return NextResponse.json({ error: "Invalid admin PIN." }, { status: 401 });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Admin configuration error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const cookieStore = await cookies();
  cookieStore.set(getAdminSessionCookieName(), createAdminSessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: getAdminSessionCookieMaxAge(),
    path: "/",
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(getAdminSessionCookieName());
  return NextResponse.json({ ok: true });
}
