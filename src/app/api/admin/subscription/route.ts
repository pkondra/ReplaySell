import { fetchMutation } from "convex/nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { api } from "@convex/_generated/api";
import {
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

const subscriptionUpdateSchema = z.object({
  userId: z.string().min(1),
  status: z.enum([
    "none",
    "trialing",
    "active",
    "past_due",
    "canceled",
    "unpaid",
    "incomplete",
    "incomplete_expired",
  ]),
  plan: z.enum(["starter", "growth", "boutique"]).nullable(),
});

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

export async function POST(request: Request) {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = subscriptionUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid subscription payload." },
      { status: 400 },
    );
  }

  try {
    const updated = await fetchMutation(api.admin.setUserSubscriptionByUserId, {
      ...parsed.data,
      authSecret: getInternalAuthSecret(),
    });
    return NextResponse.json({ updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update subscription.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
