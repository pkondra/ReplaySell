import sanitizeHtml from "sanitize-html";

import { parseReplayUrl } from "@/lib/embed";

type TikTokResponse = {
  html?: string;
  title?: string;
  author_name?: string;
  embed_product_id?: string;
};

const sanitizerConfig: sanitizeHtml.IOptions = {
  allowedTags: [
    "blockquote",
    "section",
    "a",
    "p",
    "span",
    "strong",
    "em",
    "br",
    "div",
  ],
  allowedAttributes: {
    blockquote: ["cite", "class", "data-video-id", "data-embed-from"],
    a: ["href", "title", "target", "rel"],
    p: ["class"],
    span: ["class"],
    div: ["class"],
  },
  allowedSchemes: ["http", "https"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      target: "_blank",
      rel: "noopener noreferrer",
    }),
  },
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const replayUrl = url.searchParams.get("url");

  if (!replayUrl) {
    return Response.json({ error: "Missing URL" }, { status: 400 });
  }

  const parsed = parseReplayUrl(replayUrl);
  if (!parsed || parsed.provider !== "tiktok") {
    return Response.json({ error: "Invalid TikTok URL" }, { status: 400 });
  }

  try {
    const tiktokUrl = new URL("https://www.tiktok.com/oembed");
    tiktokUrl.searchParams.set("url", parsed.normalizedUrl);

    const response = await fetch(tiktokUrl, {
      headers: {
        "User-Agent": "ReplaySellBot/1.0",
      },
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      return Response.json({ error: "TikTok oEmbed unavailable" }, { status: 502 });
    }

    const payload = (await response.json()) as TikTokResponse;
    const sanitized = payload.html ? sanitizeHtml(payload.html, sanitizerConfig) : undefined;

    return Response.json({
      embedProductId: payload.embed_product_id,
      html: sanitized,
      title: payload.title,
      authorName: payload.author_name,
    });
  } catch {
    return Response.json({ error: "Failed to fetch TikTok oEmbed" }, { status: 502 });
  }
}
