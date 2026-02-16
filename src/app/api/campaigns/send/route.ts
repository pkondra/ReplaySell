import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";

import { auth } from "@/auth";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { sendReplayAlertEmail } from "@/lib/email/resend";

export const runtime = "nodejs";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "http://127.0.0.1:3210",
);

const TEMPLATES: Record<
  string,
  (p: { title: string }) => {
    subject: string;
    heading: string;
    body: string;
    ctaLabel: string;
  }
> = {
  live_now: ({ title }) => ({
    subject: `${title} is live now!`,
    heading: `${title} is live!`,
    body: "The replay you subscribed to is live right now. Browse the products and grab what you love before they sell out.",
    ctaLabel: "Shop now",
  }),
  low_stock: ({ title }) => ({
    subject: `Only a few items left — ${title}`,
    heading: "Stock is running low!",
    body: `Items from "${title}" are selling fast. Don't miss out — only a few left in stock.`,
    ctaLabel: "Check availability",
  }),
  closing_soon: ({ title }) => ({
    subject: `${title} closes soon!`,
    heading: "Last chance!",
    body: `The selling window for "${title}" is closing soon. This is your final chance to grab what you want.`,
    ctaLabel: "Shop before it ends",
  }),
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { replayId: string; template: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { replayId, template } = body;
  if (!replayId || !template || !TEMPLATES[template]) {
    return NextResponse.json({ error: "Missing replayId or invalid template" }, { status: 400 });
  }

  const replay = await convex.query(api.replays.getPublicReplay, {
    id: replayId as Id<"replays">,
  });
  if (!replay) {
    return NextResponse.json({ error: "Replay not found" }, { status: 404 });
  }

  const subscribers = await convex.query(api.subscribers.listEmailsByReplay, {
    replayId: replayId as Id<"replays">,
    userId: session.user.id,
  });

  if (subscribers.length === 0) {
    return NextResponse.json({ error: "No subscribers for this replay" }, { status: 400 });
  }

  const title = replay.title || "Replay";
  const publicUrl = `${process.env.NEXTAUTH_URL || "https://replay-sell.vercel.app"}/r/${replayId}`;
  const tmpl = TEMPLATES[template]({ title });

  let sent = 0;
  let failed = 0;

  for (const sub of subscribers) {
    try {
      await sendReplayAlertEmail({
        to: sub.email,
        subject: tmpl.subject,
        heading: tmpl.heading,
        body: tmpl.body,
        ctaUrl: publicUrl,
        ctaLabel: tmpl.ctaLabel,
      });
      sent++;
    } catch (err) {
      console.error(`Failed to send to ${sub.email}:`, err);
      failed++;
    }
  }

  return NextResponse.json({ sent, failed, total: subscribers.length });
}
