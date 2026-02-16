import { NextResponse } from "next/server";

import { createAuthUser, getAuthUserByEmail } from "@/lib/auth/convex-users";
import { hashPassword } from "@/lib/auth/password";
import { normalizeEmail, signUpSchema } from "@/lib/auth/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = signUpSchema.safeParse(payload);
  if (!parsed.success) {
    const firstError =
      Object.values(parsed.error.flatten().fieldErrors)
        .flat()
        .find((issue) => issue && issue.length > 0) ??
      "Invalid signup details.";

    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const email = normalizeEmail(parsed.data.email);
  const existing = await getAuthUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: "An account already exists for this email." },
      { status: 409 },
    );
  }

  await createAuthUser({
    email,
    name: parsed.data.name.trim(),
    passwordHash: hashPassword(parsed.data.password),
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
