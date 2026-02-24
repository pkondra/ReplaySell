import { fetchQuery } from "convex/nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { api } from "@convex/_generated/api";
import {
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

function getInternalAuthSecret() {
  const value = process.env.AUTH_INTERNAL_SECRET;
  if (!value || value.trim() === "") {
    throw new Error("AUTH_INTERNAL_SECRET is not configured.");
  }
  return value;
}

async function isAdminAuthorized() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminSessionCookieName())?.value;
  return verifyAdminSessionToken(token);
}

export async function GET() {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await fetchQuery(api.admin.listUsersWithSubscriptions, {
      authSecret: getInternalAuthSecret(),
    });
    return NextResponse.json({ users });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load users.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
