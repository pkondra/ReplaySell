export type ReplayProvider =
  | "youtube"
  | "vimeo"
  | "tiktok"
  | "facebook"
  | "instagram"
  | "whatnot"
  | "unknown";

export type PreviewKind = "iframe" | "tiktok" | "unsupported-v1" | "link-card";

export type ParsedReplayUrl = {
  normalizedUrl: string;
  hostname: string;
  provider: ReplayProvider;
  previewKind: PreviewKind;
  embedUrl?: string;
  tiktokVideoId?: string;
  supportNote?: string;
  isVertical?: boolean;
};

const EMBED_ATTEMPT_HOSTS = [
  "youtube.com",
  "youtu.be",
  "vimeo.com",
  "tiktok.com",
  "facebook.com",
  "fb.watch",
];

function buildEmbedUrl(
  baseUrl: string,
  params: Record<string, string | number | boolean>,
) {
  const url = new URL(baseUrl);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

function normalizeHostname(hostname: string) {
  return hostname.toLowerCase().replace(/^www\./, "");
}

function matchesHost(hostname: string, domain: string) {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

function getYouTubeVideoId(url: URL) {
  const host = normalizeHostname(url.hostname);
  const pathParts = url.pathname.split("/").filter(Boolean);

  if (host === "youtu.be") {
    return pathParts[0] || null;
  }

  if (pathParts[0] === "watch") {
    return url.searchParams.get("v");
  }

  if (["shorts", "embed", "live"].includes(pathParts[0] || "")) {
    return pathParts[1] || null;
  }

  return url.searchParams.get("v");
}

function getVimeoVideoId(url: URL) {
  const candidates = url.pathname
    .split("/")
    .filter(Boolean)
    .reverse();

  for (const candidate of candidates) {
    if (/^\d+$/.test(candidate)) {
      return candidate;
    }
  }

  return null;
}

function getTikTokVideoId(url: URL) {
  const match = url.pathname.match(/\/video\/(\d+)/);
  return match?.[1] ?? null;
}

function isFacebookVideoUrl(url: URL) {
  const host = normalizeHostname(url.hostname);
  const path = url.pathname.toLowerCase();

  if (host === "fb.watch") {
    return true;
  }

  return (
    path.startsWith("/reel/") ||
    path.includes("/videos/") ||
    path === "/watch" ||
    path === "/watch/" ||
    path === "/video.php" ||
    url.searchParams.has("v")
  );
}

function buildFacebookEmbedUrl(url: URL) {
  const normalized = new URL(url.toString());
  normalized.hash = "";
  return buildEmbedUrl("https://www.facebook.com/plugins/video.php", {
    href: normalized.toString(),
    show_text: false,
    width: 1280,
    autoplay: true,
    mute: true,
  });
}

export function parseReplayUrl(rawValue: string): ParsedReplayUrl | null {
  const value = rawValue.trim();
  if (!value) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    return null;
  }

  const hostname = normalizeHostname(url.hostname);

  if (matchesHost(hostname, "youtube.com") || matchesHost(hostname, "youtu.be")) {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      const isShort = url.pathname.split("/").filter(Boolean)[0] === "shorts";
      return {
        normalizedUrl: url.toString(),
        hostname,
        provider: "youtube",
        previewKind: "iframe",
        isVertical: isShort,
        embedUrl: buildEmbedUrl(
          `https://www.youtube-nocookie.com/embed/${videoId}`,
          {
            autoplay: 1,
            mute: 1,
            playsinline: 1,
            rel: 0,
          },
        ),
      };
    }
  }

  if (matchesHost(hostname, "vimeo.com")) {
    const videoId = getVimeoVideoId(url);
    if (videoId) {
      return {
        normalizedUrl: url.toString(),
        hostname,
        provider: "vimeo",
        previewKind: "iframe",
        embedUrl: buildEmbedUrl(`https://player.vimeo.com/video/${videoId}`, {
          autoplay: 1,
          muted: 1,
          autopause: 0,
        }),
      };
    }
  }

  if (matchesHost(hostname, "tiktok.com")) {
    return {
      normalizedUrl: url.toString(),
      hostname,
      provider: "tiktok",
      previewKind: "tiktok",
      isVertical: true,
      tiktokVideoId: getTikTokVideoId(url) ?? undefined,
    };
  }

  if (matchesHost(hostname, "facebook.com") || matchesHost(hostname, "fb.watch")) {
    if (isFacebookVideoUrl(url)) {
      const isReel = url.pathname.toLowerCase().startsWith("/reel/");
      return {
        normalizedUrl: url.toString(),
        hostname,
        provider: "facebook",
        previewKind: "iframe",
        isVertical: isReel,
        embedUrl: buildFacebookEmbedUrl(url),
      };
    }

    return {
      normalizedUrl: url.toString(),
      hostname,
      provider: "facebook",
      previewKind: "link-card",
      supportNote: "Saved as a Facebook link card preview.",
    };
  }

  if (matchesHost(hostname, "instagram.com")) {
    return {
      normalizedUrl: url.toString(),
      hostname,
      provider: "instagram",
      previewKind: "unsupported-v1",
      supportNote: "Instagram embeds are not supported in v1.",
    };
  }

  if (matchesHost(hostname, "whatnot.com")) {
    return {
      normalizedUrl: url.toString(),
      hostname,
      provider: "whatnot",
      previewKind: "unsupported-v1",
      supportNote: "Whatnot embeds are not supported in v1.",
    };
  }

  return {
    normalizedUrl: url.toString(),
    hostname,
    provider: "unknown",
    previewKind: "link-card",
    supportNote: "Saved as a link card preview.",
  };
}

export function validateReplayUrl(rawValue: string) {
  if (!rawValue.trim()) {
    return { valid: false, message: "Paste a replay URL to continue." };
  }

  const parsed = parseReplayUrl(rawValue);
  if (!parsed) {
    return {
      valid: false,
      message: "Enter a valid http(s) URL.",
    };
  }

  return { valid: true, parsed };
}

export function canAttemptEmbed(hostname: string) {
  return EMBED_ATTEMPT_HOSTS.some((host) => matchesHost(hostname, host));
}

export function buildReplayTitle(url: string, replayId: string) {
  const parsed = parseReplayUrl(url);
  const host = parsed?.hostname ?? "replay";
  const shortId = replayId.slice(-6);
  return `${host} · ${shortId}`;
}
