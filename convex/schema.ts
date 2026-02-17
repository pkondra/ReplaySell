import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    normalizedEmail: v.string(),
    name: v.string(),
    passwordHash: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_normalizedEmail", ["normalizedEmail"]),

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
    currency: v.optional(v.string()),
    stock: v.number(),
    sold: v.number(),
    stripeProductId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
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
    stripeCheckoutSessionId: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_replayId", ["replayId"])
    .index("by_sellerId", ["sellerId"])
    .index("by_buyerId", ["buyerId"])
    .index("by_stripeCheckoutSessionId", ["stripeCheckoutSessionId"]),

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

  connectedStripeAccounts: defineTable({
    userId: v.string(),
    stripeAccountId: v.string(),
    displayName: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    latestRequirementsStatus: v.optional(v.string()),
    latestCardPaymentsStatus: v.optional(v.string()),
    lastThinEventId: v.optional(v.string()),
    lastThinEventType: v.optional(v.string()),
    lastThinEventCreatedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_stripeAccountId", ["stripeAccountId"]),

  connectedStripeSubscriptions: defineTable({
    userId: v.optional(v.string()),
    stripeAccountId: v.string(),
    stripeSubscriptionId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    status: v.string(),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    currentPeriodEnd: v.optional(v.number()),
    lastEventType: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_stripeAccountId", ["stripeAccountId"])
    .index("by_stripeSubscriptionId", ["stripeSubscriptionId"]),
});
