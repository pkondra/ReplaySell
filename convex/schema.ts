import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  replays: defineTable({
    userId: v.string(),
    url: v.string(),
    title: v.optional(v.string()),
    status: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId_createdAt", ["userId", "createdAt"]),

  products: defineTable({
    replayId: v.id("replays"),
    userId: v.string(),
    name: v.string(),
    price: v.number(),
    stock: v.number(),
    sold: v.number(),
    createdAt: v.number(),
  })
    .index("by_replayId", ["replayId"])
    .index("by_userId", ["userId"]),

  subscribers: defineTable({
    replayId: v.id("replays"),
    userId: v.string(),
    accountUserId: v.optional(v.string()),
    email: v.string(),
    phone: v.optional(v.string()),
    smsConsent: v.boolean(),
    notifyTimer: v.optional(v.boolean()),
    notifyStock: v.optional(v.boolean()),
    notifyPriceChange: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_replayId", ["replayId"])
    .index("by_userId", ["userId"])
    .index("by_accountUserId", ["accountUserId"]),

  orders: defineTable({
    replayId: v.id("replays"),
    productId: v.id("products"),
    sellerId: v.string(),
    buyerId: v.optional(v.string()),
    email: v.string(),
    quantity: v.number(),
    total: v.number(),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_replayId", ["replayId"])
    .index("by_sellerId", ["sellerId"])
    .index("by_buyerId", ["buyerId"]),

  sellerSubscriptions: defineTable({
    userId: v.string(),
    plan: v.optional(v.string()),
    status: v.string(),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    trialEndsAt: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    canceledAt: v.optional(v.number()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_stripeCustomerId", ["stripeCustomerId"])
    .index("by_stripeSubscriptionId", ["stripeSubscriptionId"]),
});
