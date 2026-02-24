import { v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

const SUBSCRIPTION_STATUSES = [
  "none",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
  "incomplete",
  "incomplete_expired",
] as const;

const SELLER_PLANS = ["starter", "growth", "boutique"] as const;

function assertInternalSecret(secret: string) {
  const expected = process.env.AUTH_INTERNAL_SECRET;
  if (!expected || expected.trim() === "") {
    throw new Error("AUTH_INTERNAL_SECRET is not configured in Convex.");
  }

  if (secret !== expected) {
    throw new Error("Unauthorized");
  }
}

export const listUsersWithSubscriptions = query({
  args: {
    authSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertInternalSecret(args.authSecret);

    const [users, subscriptions] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("sellerSubscriptions").collect(),
    ]);

    const latestByUserId = new Map<string, (typeof subscriptions)[number]>();
    for (const subscription of subscriptions) {
      const current = latestByUserId.get(subscription.userId);
      if (!current || subscription.updatedAt >= current.updatedAt) {
        latestByUserId.set(subscription.userId, subscription);
      }
    }

    return users
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((user) => {
        const subscription = latestByUserId.get(user._id);
        return {
          userId: user._id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          subscription: {
            status: (subscription?.status ?? "none") as
              | (typeof SUBSCRIPTION_STATUSES)[number],
            plan: (subscription?.plan ?? null) as
              | (typeof SELLER_PLANS)[number]
              | null,
            updatedAt: subscription?.updatedAt ?? null,
          },
        };
      });
  },
});

export const setUserSubscriptionByUserId = mutation({
  args: {
    authSecret: v.string(),
    userId: v.string(),
    status: v.union(
      ...SUBSCRIPTION_STATUSES.map((status) => v.literal(status)),
    ),
    plan: v.union(...SELLER_PLANS.map((plan) => v.literal(plan)), v.null()),
  },
  handler: async (ctx, args) => {
    assertInternalSecret(args.authSecret);

    const user = await ctx.db.get(args.userId as Id<"users">);
    if (!user) {
      throw new Error("User not found.");
    }

    const existing = await ctx.db
      .query("sellerSubscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    const now = Date.now();

    if (!existing) {
      await ctx.db.insert("sellerSubscriptions", {
        userId: args.userId,
        status: args.status,
        plan: args.plan ?? undefined,
        cancelAtPeriodEnd: false,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      await ctx.db.patch(existing._id, {
        status: args.status,
        plan: args.plan ?? undefined,
        updatedAt: now,
      });
    }

    return {
      userId: args.userId,
      status: args.status,
      plan: args.plan,
      updatedAt: now,
    };
  },
});
