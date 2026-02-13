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

export const addProduct = mutation({
  args: {
    replayId: v.id("replays"),
    name: v.string(),
    price: v.number(),
    stock: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const replay = await ctx.db.get(args.replayId);
    if (!replay || replay.userId !== identity.subject)
      throw new Error("Replay not found");

    return await ctx.db.insert("products", {
      replayId: args.replayId,
      userId: identity.subject,
      name: args.name,
      price: args.price,
      stock: args.stock,
      sold: 0,
      createdAt: Date.now(),
    });
  },
});

export const removeProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const product = await ctx.db.get(args.id);
    if (!product || product.userId !== identity.subject)
      throw new Error("Product not found");
    await ctx.db.delete(args.id);
  },
});

export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    price: v.optional(v.number()),
    stock: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const product = await ctx.db.get(args.id);
    if (!product || product.userId !== identity.subject)
      throw new Error("Product not found");

    const patch: Record<string, unknown> = {};
    if (args.name !== undefined) patch.name = args.name;
    if (args.price !== undefined) patch.price = args.price;
    if (args.stock !== undefined) patch.stock = args.stock;
    await ctx.db.patch(args.id, patch);
  },
});

export const listByReplay = query({
  args: { replayId: v.id("replays") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_replayId", (q) => q.eq("replayId", args.replayId))
      .collect();
  },
});
