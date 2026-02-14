import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

import PublicReplayClient from "./replay-client";

/* ------------------------------------------------------------------ */
/*  Server-side HTTP client for metadata                                */
/* ------------------------------------------------------------------ */

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "http://127.0.0.1:3210",
);

/* ------------------------------------------------------------------ */
/*  Dynamic SEO metadata                                                */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const replay = await convex.query(api.replays.getPublicReplay, {
      id: id as Id<"replays">,
    });

    if (!replay) {
      return {
        title: "Replay not found",
        description: "This replay may have been removed or the link is incorrect.",
      };
    }

    const title = replay.title || "Shop this replay";
    const isLive = replay.status === "live" && (replay.expiresAt ?? 0) > Date.now();
    const statusLabel = isLive ? "Live now" : "Ended";
    const description = `${statusLabel} — ${title}. Browse products, get alerts, and checkout with Stripe on ReplaySell.`;
    const url = `https://replaysell.com/r/${id}`;

    return {
      title,
      description,
      openGraph: {
        title: `${title} — ReplaySell`,
        description,
        url,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} — ReplaySell`,
        description,
      },
      alternates: {
        canonical: url,
      },
    };
  } catch {
    return {
      title: "Replay",
      description: "Browse this replay storefront on ReplaySell.",
    };
  }
}

/* ------------------------------------------------------------------ */
/*  Page (server component wrapper)                                     */
/* ------------------------------------------------------------------ */

export default function PublicReplayPage() {
  return <PublicReplayClient />;
}
