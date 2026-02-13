import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

type Identity = { subject: string };

async function requireIdentity(ctx: {
  auth: { getUserIdentity: () => Promise<Identity | null> };
}) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  return identity;
}

function normalizeHttpUrl(value: string) {
  const trimmed = value.trim();
  try {
    const url = new URL(trimmed);
    if (!["http:", "https:"].includes(url.protocol))
      throw new Error("Replay URL must use http(s).");
    return url.toString();
  } catch {
    throw new Error("Replay URL must be a valid http(s) URL.");
  }
}

export const createReplay = mutation({
  args: {
    url: v.string(),
    title: v.optional(v.string()),
    durationHours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const now = Date.now();
    const normalizedUrl = normalizeHttpUrl(args.url);
    const hours = args.durationHours ?? 48;

    return await ctx.db.insert("replays", {
      userId: identity.subject,
      url: normalizedUrl,
      title: args.title,
      status: "live",
      expiresAt: now + hours * 60 * 60 * 1000,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateReplay = mutation({
  args: {
    id: v.id("replays"),
    url: v.optional(v.string()),
    title: v.optional(v.string()),
    status: v.optional(v.string()),
    durationHours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const replay = await ctx.db.get(args.id);
    if (!replay || replay.userId !== identity.subject)
      throw new Error("Replay not found");

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.url) patch.url = normalizeHttpUrl(args.url);
    if (args.title !== undefined) patch.title = args.title;
    if (args.status) patch.status = args.status;
    if (args.durationHours)
      patch.expiresAt = replay.createdAt + args.durationHours * 60 * 60 * 1000;

    await ctx.db.patch(args.id, patch);
    return args.id;
  },
});

export const listMyReplays = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    return await ctx.db
      .query("replays")
      .withIndex("by_userId_createdAt", (q) =>
        q.eq("userId", identity.subject),
      )
      .order("desc")
      .collect();
  },
});

export const getReplayById = query({
  args: { id: v.id("replays") },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const replay = await ctx.db.get(args.id);
    if (!replay || replay.userId !== identity.subject)
      throw new Error("Replay not found");
    return replay;
  },
});

export const getPublicReplay = query({
  args: { id: v.id("replays") },
  handler: async (ctx, args) => {
    const replay = await ctx.db.get(args.id);
    if (!replay) return null;
    return {
      _id: replay._id,
      url: replay.url,
      title: replay.title,
      status: replay.status,
      expiresAt: replay.expiresAt,
      createdAt: replay.createdAt,
    };
  },
});

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    const uid = identity.subject;

    const replays = await ctx.db
      .query("replays")
      .withIndex("by_userId_createdAt", (q) => q.eq("userId", uid))
      .collect();

    const subscribers = await ctx.db
      .query("subscribers")
      .withIndex("by_userId", (q) => q.eq("userId", uid))
      .collect();

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_sellerId", (q) => q.eq("sellerId", uid))
      .collect();

    const liveReplays = replays.filter(
      (r) => r.status === "live" && r.expiresAt != null && r.expiresAt > Date.now(),
    ).length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    return {
      totalReplays: replays.length,
      liveReplays,
      totalSubscribers: subscribers.length,
      totalOrders: orders.length,
      totalRevenue,
    };
  },
});
