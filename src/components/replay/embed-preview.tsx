"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { RetroCard } from "@/components/ui/retro-card";
import { parseReplayUrl } from "@/lib/embed";
import { cn } from "@/lib/utils";

type TikTokResponse = {
  embedProductId?: string;
  html?: string;
  title?: string;
  authorName?: string;
  error?: string;
};

type TikTokState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "loaded"; data: TikTokResponse }
  | { status: "error"; message: string };

function LinkCard({
  href,
  hostname,
  note,
}: {
  href: string;
  hostname: string;
  note?: string;
}) {
  return (
    <RetroCard className="space-y-3">
      <Badge>Link Preview</Badge>
      <div>
        <p className="text-sm text-text-muted">{hostname}</p>
        <Link
          href={href}
          target="_blank"
          rel="noreferrer"
          className="break-all font-mono text-sm text-accent underline-offset-4 hover:underline"
        >
          {href}
        </Link>
      </div>
      {note ? <p className="text-sm text-text-muted">{note}</p> : null}
    </RetroCard>
  );
}

export function EmbedPreview({ url, className }: { url: string; className?: string }) {
  const parsed = useMemo(() => parseReplayUrl(url), [url]);
  const [tiktokState, setTikTokState] = useState<TikTokState>({ status: "idle" });

  useEffect(() => {
    if (!parsed || parsed.provider !== "tiktok") {
      setTikTokState({ status: "idle" });
      return;
    }

    const targetUrl = parsed.normalizedUrl;
    const controller = new AbortController();

    async function fetchTikTok() {
      try {
        setTikTokState({ status: "loading" });
        const response = await fetch(
          `/api/oembed/tiktok?url=${encodeURIComponent(targetUrl)}`,
          {
            method: "GET",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Could not fetch TikTok preview.");
        }

        const payload = (await response.json()) as TikTokResponse;
        setTikTokState({ status: "loaded", data: payload });
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }

        setTikTokState({
          status: "error",
          message: "TikTok preview unavailable. Showing link card instead.",
        });
      }
    }

    void fetchTikTok();

    return () => {
      controller.abort();
    };
  }, [parsed]);

  if (!url.trim()) {
    return (
      <RetroCard className={cn("min-h-44", className)}>
        <div className="flex h-full min-h-44 items-center justify-center text-sm text-text-muted">
          Paste a replay URL to see a live preview.
        </div>
      </RetroCard>
    );
  }

  if (!parsed) {
    return (
      <RetroCard className={cn("min-h-44", className)}>
        <div className="flex h-full min-h-44 items-center justify-center text-sm text-accent-magenta">
          Invalid URL. Use a full http(s) link.
        </div>
      </RetroCard>
    );
  }

  if (parsed.previewKind === "iframe" && parsed.embedUrl) {
    return (
      <RetroCard className={cn("space-y-3", className)}>
        <div className="flex items-center justify-between gap-3">
          <Badge>{parsed.provider}</Badge>
          <span className="text-xs text-text-muted">Embedded preview</span>
        </div>
        <div className="overflow-hidden rounded-md border border-line bg-bg-strong">
          <div className="relative aspect-video">
            <iframe
              src={parsed.embedUrl}
              title={`${parsed.provider} preview`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </RetroCard>
    );
  }

  if (parsed.provider === "tiktok") {
    const embedId =
      tiktokState.status === "loaded"
        ? (tiktokState.data.embedProductId ?? parsed.tiktokVideoId)
        : parsed.tiktokVideoId;

    if (embedId) {
      return (
        <RetroCard className={cn("space-y-3", className)}>
          <div className="flex items-center justify-between gap-3">
            <Badge>TikTok</Badge>
            <span className="text-xs text-text-muted">oEmbed assisted</span>
          </div>
          <div className="overflow-hidden rounded-md border border-line bg-bg-strong">
            <div className="relative mx-auto aspect-[9/16] w-full max-w-sm">
              <iframe
                src={`https://www.tiktok.com/embed/v2/${embedId}`}
                title="TikTok preview"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </RetroCard>
      );
    }

    if (tiktokState.status === "loading") {
      return (
        <RetroCard className={cn("min-h-44", className)}>
          <div className="flex h-full min-h-44 items-center justify-center text-sm text-text-muted">
            Loading TikTok preview...
          </div>
        </RetroCard>
      );
    }

    if (tiktokState.status === "loaded" && tiktokState.data.html) {
      return (
        <RetroCard className={cn("space-y-3", className)}>
          <div className="flex items-center justify-between gap-3">
            <Badge>TikTok</Badge>
            <span className="text-xs text-text-muted">Sanitized oEmbed</span>
          </div>
          <div
            className="prose prose-invert max-w-none rounded-md border border-line bg-panel-strong p-3 text-sm"
            dangerouslySetInnerHTML={{ __html: tiktokState.data.html }}
          />
        </RetroCard>
      );
    }

    const fallbackNote =
      tiktokState.status === "error"
        ? tiktokState.message
        : "TikTok embed unavailable. Showing link card.";

    return (
      <LinkCard href={parsed.normalizedUrl} hostname={parsed.hostname} note={fallbackNote} />
    );
  }

  if (parsed.previewKind === "unsupported-v1") {
    return (
      <LinkCard
        href={parsed.normalizedUrl}
        hostname={parsed.hostname}
        note={parsed.supportNote ?? "Embed not supported in v1."}
      />
    );
  }

  return (
    <LinkCard
      href={parsed.normalizedUrl}
      hostname={parsed.hostname}
      note={parsed.supportNote ?? "Saved as a link card preview."}
    />
  );
}
