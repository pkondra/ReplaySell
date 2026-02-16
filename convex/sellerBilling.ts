import { v } from "convex/values";

import { internalMutation, internalQuery, query } from "./_generated/server";
import {
  getSellerSubscriptionByUserId,
  hasSellerAccess,
  requireIdentity,
} from "./sellerAccess";

export const getMySellerSubscription = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    const subscription = await getSellerSubscriptionByUserId(
      ctx,
      identity.subject,
    );

    if (!subscription) {
      return {
        status: "none",
        plan: null,
        hasAccess: false,
        trialEndsAt: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        canceledAt: null,
        hasStripeCustomer: false,
      };
    }

    return {
      status: subscription.status,
      plan: subscription.plan ?? null,
      hasAccess: hasSellerAccess(subscription.status),
      trialEndsAt: subscription.trialEndsAt ?? null,
      currentPeriodEnd: subscription.currentPeriodEnd ?? null,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd ?? false,
      canceledAt: subscription.canceledAt ?? null,
      hasStripeCustomer: !!subscription.stripeCustomerId,
    };
  },
});

export const getSellerSubscriptionByUserIdInternal = internalQuery({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await getSellerSubscriptionByUserId(ctx, args.userId);
  },
});

export const syncSellerSubscriptionFromStripe = internalMutation({
  args: {
    userId: v.optional(v.string()),
    plan: v.optional(v.union(v.string(), v.null())),
    status: v.string(),
    stripeCustomerId: v.optional(v.union(v.string(), v.null())),
    stripeSubscriptionId: v.optional(v.union(v.string(), v.null())),
    stripePriceId: v.optional(v.union(v.string(), v.null())),
    trialEndsAt: v.optional(v.union(v.number(), v.null())),
    currentPeriodEnd: v.optional(v.union(v.number(), v.null())),
    canceledAt: v.optional(v.union(v.number(), v.null())),
    cancelAtPeriodEnd: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    let subscription =
      args.userId == null
        ? null
        : await getSellerSubscriptionByUserId(ctx, args.userId);

    if (!subscription && args.stripeSubscriptionId) {
      subscription = await ctx.db
        .query("sellerSubscriptions")
        .withIndex("by_stripeSubscriptionId", (q) =>
          q.eq("stripeSubscriptionId", args.stripeSubscriptionId!),
        )
        .first();
    }

    if (!subscription && args.stripeCustomerId) {
      subscription = await ctx.db
        .query("sellerSubscriptions")
        .withIndex("by_stripeCustomerId", (q) =>
          q.eq("stripeCustomerId", args.stripeCustomerId!),
        )
        .first();
    }

    if (!subscription) {
      if (!args.userId) return null;

      return await ctx.db.insert("sellerSubscriptions", {
        userId: args.userId,
        plan: args.plan ?? undefined,
        status: args.status,
        stripeCustomerId: args.stripeCustomerId ?? undefined,
        stripeSubscriptionId: args.stripeSubscriptionId ?? undefined,
        stripePriceId: args.stripePriceId ?? undefined,
        trialEndsAt: args.trialEndsAt ?? undefined,
        currentPeriodEnd: args.currentPeriodEnd ?? undefined,
        canceledAt: args.canceledAt ?? undefined,
        cancelAtPeriodEnd: args.cancelAtPeriodEnd ?? false,
        createdAt: now,
        updatedAt: now,
      });
    }

    const patch: Record<string, unknown> = {
      status: args.status,
      updatedAt: now,
    };

    if (args.userId !== undefined) {
      patch.userId = args.userId;
    }
    if (args.plan !== undefined) {
      patch.plan = args.plan ?? undefined;
    }
    if (args.stripeCustomerId !== undefined) {
      patch.stripeCustomerId = args.stripeCustomerId ?? undefined;
    }
    if (args.stripeSubscriptionId !== undefined) {
      patch.stripeSubscriptionId = args.stripeSubscriptionId ?? undefined;
    }
    if (args.stripePriceId !== undefined) {
      patch.stripePriceId = args.stripePriceId ?? undefined;
    }
    if (args.trialEndsAt !== undefined) {
      patch.trialEndsAt = args.trialEndsAt ?? undefined;
    }
    if (args.currentPeriodEnd !== undefined) {
      patch.currentPeriodEnd = args.currentPeriodEnd ?? undefined;
    }
    if (args.canceledAt !== undefined) {
      patch.canceledAt = args.canceledAt ?? undefined;
    }
    if (args.cancelAtPeriodEnd !== undefined) {
      patch.cancelAtPeriodEnd = args.cancelAtPeriodEnd;
    }

    await ctx.db.patch(subscription._id, patch);
    return subscription._id;
  },
});
