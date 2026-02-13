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
    email: v.string(),
    phone: v.optional(v.string()),
    smsConsent: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_replayId", ["replayId"])
    .index("by_userId", ["userId"]),

  orders: defineTable({
    replayId: v.id("replays"),
    productId: v.id("products"),
    sellerId: v.string(),
    email: v.string(),
    quantity: v.number(),
    total: v.number(),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_replayId", ["replayId"])
    .index("by_sellerId", ["sellerId"]),
});
