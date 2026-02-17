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

function assertInternalSecret(secret: string) {
  const expected = process.env.AUTH_INTERNAL_SECRET;
  if (!expected || expected.trim() === "") {
    throw new Error("AUTH_INTERNAL_SECRET is not configured in Convex.");
  }

  if (secret !== expected) {
    throw new Error("Unauthorized");
  }
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
      stripeCheckoutSessionId: undefined,
      stripePaymentIntentId: undefined,
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

export const finalizePaidCheckoutOrder = mutation({
  args: {
    replayId: v.id("replays"),
    productId: v.id("products"),
    buyerId: v.string(),
    email: v.string(),
    quantity: v.number(),
    stripeCheckoutSessionId: v.string(),
    stripePaymentIntentId: v.optional(v.union(v.string(), v.null())),
    amountTotalCents: v.optional(v.union(v.number(), v.null())),
    authSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertInternalSecret(args.authSecret);

    const existing = await ctx.db
      .query("orders")
      .withIndex("by_stripeCheckoutSessionId", (q) =>
        q.eq("stripeCheckoutSessionId", args.stripeCheckoutSessionId),
      )
      .first();

    if (existing) {
      return {
        orderId: existing._id,
        created: false,
      };
    }

    const replay = await ctx.db.get(args.replayId);
    if (!replay) {
      throw new Error("Replay not found.");
    }

    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Product not found.");
    }

    if (product.replayId !== args.replayId) {
      throw new Error("Product does not belong to replay.");
    }

    if (product.stock < args.quantity) {
      throw new Error(
        "Order was paid, but stock is unavailable. Handle this order manually.",
      );
    }

    await ctx.db.patch(args.productId, {
      stock: product.stock - args.quantity,
      sold: product.sold + args.quantity,
    });

    const computedTotal =
      args.amountTotalCents != null
        ? args.amountTotalCents / 100
        : product.price * args.quantity;

    const orderId = await ctx.db.insert("orders", {
      replayId: args.replayId,
      productId: args.productId,
      sellerId: replay.userId,
      buyerId: args.buyerId,
      email: args.email,
      quantity: args.quantity,
      total: computedTotal,
      status: "completed",
      stripeCheckoutSessionId: args.stripeCheckoutSessionId,
      stripePaymentIntentId: args.stripePaymentIntentId ?? undefined,
      createdAt: Date.now(),
    });

    return {
      orderId,
      created: true,
    };
  },
});
