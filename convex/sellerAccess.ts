import type { QueryCtx } from "./_generated/server";

type Identity = { subject: string };

const SELLER_ACCESS_STATUSES = new Set(["trialing", "active"]);

type AuthCtx = {
  auth: { getUserIdentity: () => Promise<Identity | null> };
};

type DbReaderCtx = {
  db: QueryCtx["db"];
};

export async function requireIdentity(ctx: AuthCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  return identity;
}

export function hasSellerAccess(status: string | undefined | null) {
  if (!status) return false;
  return SELLER_ACCESS_STATUSES.has(status);
}

export async function getSellerSubscriptionByUserId(
  ctx: DbReaderCtx,
  userId: string,
) {
  return await ctx.db
    .query("sellerSubscriptions")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
}

export async function assertSellerAccess(ctx: DbReaderCtx, userId: string) {
  const subscription = await getSellerSubscriptionByUserId(ctx, userId);
  if (!subscription || !hasSellerAccess(subscription.status)) {
    throw new Error(
      "Seller subscription required. Start your 7-day trial to continue.",
    );
  }
  return subscription;
}
