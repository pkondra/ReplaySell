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

export const placeOrder = mutation({
  args: {
    replayId: v.id("replays"),
    productId: v.id("products"),
    email: v.string(),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const replay = await ctx.db.get(args.replayId);
    if (!replay) throw new Error("Replay not found");
    if (replay.status !== "live" || replay.expiresAt == null || replay.expiresAt < Date.now())
      throw new Error("This replay has expired");

    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Product not found");
    if (product.stock < args.quantity) throw new Error("Not enough stock");

    await ctx.db.patch(args.productId, {
      stock: product.stock - args.quantity,
      sold: product.sold + args.quantity,
    });

    return await ctx.db.insert("orders", {
      replayId: args.replayId,
      productId: args.productId,
      sellerId: replay.userId,
      buyerId: identity.subject,
      email: args.email,
      quantity: args.quantity,
      total: product.price * args.quantity,
      status: "placed",
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
      .query("orders")
      .withIndex("by_replayId", (q) => q.eq("replayId", args.replayId))
      .collect();
  },
});

export const listMyOrders = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    return await ctx.db
      .query("orders")
      .withIndex("by_sellerId", (q) => q.eq("sellerId", identity.subject))
      .collect();
  },
});

export const listMyPurchases = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    return await ctx.db
      .query("orders")
      .withIndex("by_buyerId", (q) => q.eq("buyerId", identity.subject))
      .order("desc")
      .collect();
  },
});

export const listMyPurchasesDetailed = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_buyerId", (q) => q.eq("buyerId", identity.subject))
      .order("desc")
      .collect();

    const decorated = await Promise.all(
      orders.map(async (order) => {
        const replay = await ctx.db.get(order.replayId);
        const product = await ctx.db.get(order.productId);
        return {
          ...order,
          replayTitle: replay?.title ?? null,
          productName: product?.name ?? null,
        };
      }),
    );

    return decorated;
  },
});
