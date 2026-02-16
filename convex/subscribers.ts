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

export const subscribe = mutation({
  args: {
    replayId: v.id("replays"),
    email: v.string(),
    phone: v.optional(v.string()),
    smsConsent: v.optional(v.boolean()),
    accountUserId: v.optional(v.string()),
    notifyTimer: v.optional(v.boolean()),
    notifyStock: v.optional(v.boolean()),
    notifyPriceChange: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const replay = await ctx.db.get(args.replayId);
    if (!replay) throw new Error("Replay not found");

    return await ctx.db.insert("subscribers", {
      replayId: args.replayId,
      userId: replay.userId,
      accountUserId: args.accountUserId,
      email: args.email,
      phone: args.phone,
      smsConsent: args.smsConsent ?? false,
      notifyTimer: args.notifyTimer ?? true,
      notifyStock: args.notifyStock ?? true,
      notifyPriceChange: args.notifyPriceChange ?? true,
      createdAt: Date.now(),
    });
  },
});

export const listByReplay = query({
  args: { replayId: v.id("replays") },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const replay = await ctx.db.get(args.replayId);
    if (!replay || replay.userId !== identity.subject)
      throw new Error("Replay not found");

    return await ctx.db
      .query("subscribers")
      .withIndex("by_replayId", (q) => q.eq("replayId", args.replayId))
      .collect();
  },
});

export const listEmailsByReplay = query({
  args: { replayId: v.id("replays"), userId: v.string() },
  handler: async (ctx, args) => {
    const replay = await ctx.db.get(args.replayId);
    if (!replay || replay.userId !== args.userId) return [];
    const subs = await ctx.db
      .query("subscribers")
      .withIndex("by_replayId", (q) => q.eq("replayId", args.replayId))
      .collect();
    return subs.map((s) => ({ email: s.email }));
  },
});

export const listMySubs = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    return await ctx.db
      .query("subscribers")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();
  },
});

export const listMyWatchlist = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    return await ctx.db
      .query("subscribers")
      .withIndex("by_accountUserId", (q) => q.eq("accountUserId", identity.subject))
      .collect();
  },
});
