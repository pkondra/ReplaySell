import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
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

export const getByEmailForAuth = query({
  args: {
    email: v.string(),
    authSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertInternalSecret(args.authSecret);

    const normalizedEmail = normalizeEmail(args.email);
    const user = await ctx.db
      .query("users")
      .withIndex("by_normalizedEmail", (q) =>
        q.eq("normalizedEmail", normalizedEmail),
      )
      .first();

    if (!user) {
      return null;
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
    };
  },
});

export const createUserWithPassword = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    passwordHash: v.string(),
    authSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertInternalSecret(args.authSecret);

    const normalizedEmail = normalizeEmail(args.email);
    const existing = await ctx.db
      .query("users")
      .withIndex("by_normalizedEmail", (q) =>
        q.eq("normalizedEmail", normalizedEmail),
      )
      .first();

    if (existing) {
      throw new Error("An account already exists for this email.");
    }

    const now = Date.now();
    const id = await ctx.db.insert("users", {
      email: args.email,
      normalizedEmail,
      name: args.name.trim(),
      passwordHash: args.passwordHash,
      createdAt: now,
      updatedAt: now,
    });

    return {
      id,
      email: args.email,
      name: args.name.trim(),
    };
  },
});
