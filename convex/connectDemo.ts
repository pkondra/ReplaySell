import { v } from "convex/values";

import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";

type DbCtx = Pick<QueryCtx, "db"> | Pick<MutationCtx, "db">;

function assertInternalSecret(secret: string) {
  const expected = process.env.AUTH_INTERNAL_SECRET;
  if (!expected || expected.trim() === "") {
    throw new Error("AUTH_INTERNAL_SECRET is not configured in Convex.");
  }

  if (secret !== expected) {
    throw new Error("Unauthorized");
  }
}

async function getConnectedStripeAccountByUserId(ctx: DbCtx, userId: string) {
  return await ctx.db
    .query("connectedStripeAccounts")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
}

async function getConnectedStripeAccountByStripeAccountId(
  ctx: DbCtx,
  stripeAccountId: string,
) {
  return await ctx.db
    .query("connectedStripeAccounts")
    .withIndex("by_stripeAccountId", (q) =>
      q.eq("stripeAccountId", stripeAccountId),
    )
    .first();
}

async function getConnectedStripeSubscriptionByUserId(ctx: DbCtx, userId: string) {
  return await ctx.db
    .query("connectedStripeSubscriptions")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
}

export const getConnectedStripeAccountByUserIdInternal = query({
  args: {
    userId: v.string(),
    authSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertInternalSecret(args.authSecret);
    return await getConnectedStripeAccountByUserId(ctx, args.userId);
  },
});

export const getConnectedStripeAccountByStripeAccountIdInternal = query({
  args: {
    stripeAccountId: v.string(),
    authSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertInternalSecret(args.authSecret);
    return await getConnectedStripeAccountByStripeAccountId(
      ctx,
      args.stripeAccountId,
    );
  },
});

export const getConnectedStripeSubscriptionByUserIdInternal = query({
  args: {
    userId: v.string(),
    authSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertInternalSecret(args.authSecret);
    return await getConnectedStripeSubscriptionByUserId(ctx, args.userId);
  },
});

export const upsertConnectedStripeAccountMapping = mutation({
  args: {
    userId: v.string(),
    stripeAccountId: v.string(),
    displayName: v.optional(v.union(v.string(), v.null())),
    contactEmail: v.optional(v.union(v.string(), v.null())),
    authSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertInternalSecret(args.authSecret);

    const now = Date.now();
    const existing = await getConnectedStripeAccountByUserId(ctx, args.userId);

    if (!existing) {
      return await ctx.db.insert("connectedStripeAccounts", {
        userId: args.userId,
        stripeAccountId: args.stripeAccountId,
        displayName: args.displayName ?? undefined,
        contactEmail: args.contactEmail ?? undefined,
        createdAt: now,
        updatedAt: now,
      });
    }

    await ctx.db.patch(existing._id, {
      stripeAccountId: args.stripeAccountId,
      displayName: args.displayName ?? undefined,
      contactEmail: args.contactEmail ?? undefined,
      updatedAt: now,
    });

    return existing._id;
  },
});

export const syncConnectedStripeAccountSignals = mutation({
  args: {
    stripeAccountId: v.string(),
    latestRequirementsStatus: v.optional(v.union(v.string(), v.null())),
    latestCardPaymentsStatus: v.optional(v.union(v.string(), v.null())),
    lastThinEventId: v.optional(v.union(v.string(), v.null())),
    lastThinEventType: v.optional(v.union(v.string(), v.null())),
    lastThinEventCreatedAt: v.optional(v.union(v.number(), v.null())),
    authSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertInternalSecret(args.authSecret);

    const account = await getConnectedStripeAccountByStripeAccountId(
      ctx,
      args.stripeAccountId,
    );
    if (!account) {
      return null;
    }

    await ctx.db.patch(account._id, {
      latestRequirementsStatus: args.latestRequirementsStatus ?? undefined,
      latestCardPaymentsStatus: args.latestCardPaymentsStatus ?? undefined,
      lastThinEventId: args.lastThinEventId ?? undefined,
      lastThinEventType: args.lastThinEventType ?? undefined,
      lastThinEventCreatedAt: args.lastThinEventCreatedAt ?? undefined,
      updatedAt: Date.now(),
    });

    return account._id;
  },
});

export const syncConnectedStripeSubscriptionState = mutation({
  args: {
    stripeAccountId: v.string(),
    stripeSubscriptionId: v.optional(v.union(v.string(), v.null())),
    stripePriceId: v.optional(v.union(v.string(), v.null())),
    status: v.string(),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    currentPeriodEnd: v.optional(v.union(v.number(), v.null())),
    lastEventType: v.optional(v.union(v.string(), v.null())),
    authSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertInternalSecret(args.authSecret);

    const now = Date.now();
    const account = await getConnectedStripeAccountByStripeAccountId(
      ctx,
      args.stripeAccountId,
    );
    const userId = account?.userId;

    let existing =
      args.stripeSubscriptionId == null
        ? null
        : await ctx.db
            .query("connectedStripeSubscriptions")
            .withIndex("by_stripeSubscriptionId", (q) =>
              q.eq("stripeSubscriptionId", args.stripeSubscriptionId!),
            )
            .first();

    if (!existing) {
      existing = await ctx.db
        .query("connectedStripeSubscriptions")
        .withIndex("by_stripeAccountId", (q) =>
          q.eq("stripeAccountId", args.stripeAccountId),
        )
        .first();
    }

    if (!existing) {
      return await ctx.db.insert("connectedStripeSubscriptions", {
        userId,
        stripeAccountId: args.stripeAccountId,
        stripeSubscriptionId: args.stripeSubscriptionId ?? undefined,
        stripePriceId: args.stripePriceId ?? undefined,
        status: args.status,
        cancelAtPeriodEnd: args.cancelAtPeriodEnd ?? undefined,
        currentPeriodEnd: args.currentPeriodEnd ?? undefined,
        lastEventType: args.lastEventType ?? undefined,
        createdAt: now,
        updatedAt: now,
      });
    }

    await ctx.db.patch(existing._id, {
      userId,
      stripeAccountId: args.stripeAccountId,
      stripeSubscriptionId: args.stripeSubscriptionId ?? undefined,
      stripePriceId: args.stripePriceId ?? undefined,
      status: args.status,
      cancelAtPeriodEnd: args.cancelAtPeriodEnd ?? undefined,
      currentPeriodEnd:
        args.currentPeriodEnd !== undefined
          ? (args.currentPeriodEnd ?? undefined)
          : existing.currentPeriodEnd,
      lastEventType: args.lastEventType ?? undefined,
      updatedAt: now,
    });

    return existing._id;
  },
});
