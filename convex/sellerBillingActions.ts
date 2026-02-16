"use node";

import Stripe from "stripe";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import { action } from "./_generated/server";
import { hasSellerAccess, requireIdentity } from "./sellerAccess";
import { SELLER_TRIAL_DAYS, type SellerPlanId } from "./sellerBillingTypes";

const PLAN_PRICE_ENV_KEYS: Record<SellerPlanId, string> = {
  starter: "STRIPE_SELLER_STARTER_MONTHLY_PRICE_ID",
  growth: "STRIPE_SELLER_GROWTH_MONTHLY_PRICE_ID",
  boutique: "STRIPE_SELLER_BOUTIQUE_MONTHLY_PRICE_ID",
};

let stripeClient: Stripe | null = null;

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

function getStripe() {
  if (!stripeClient) {
    stripeClient = new Stripe(getRequiredEnv("STRIPE_SECRET_KEY"));
  }
  return stripeClient;
}

function getMonthlyPriceId(plan: SellerPlanId) {
  return getRequiredEnv(PLAN_PRICE_ENV_KEYS[plan]);
}

async function resolveMonthlyRecurringPriceId(
  stripe: Stripe,
  plan: SellerPlanId,
) {
  const configuredId = getMonthlyPriceId(plan);

  if (configuredId.startsWith("price_")) {
    return configuredId;
  }

  if (!configuredId.startsWith("prod_")) {
    throw new Error(
      `${PLAN_PRICE_ENV_KEYS[plan]} must be a Stripe price_ or prod_ ID.`,
    );
  }

  const product = await stripe.products.retrieve(configuredId, {
    expand: ["default_price"],
  });

  const defaultPrice =
    typeof product.default_price === "object" &&
    product.default_price !== null &&
    !("deleted" in product.default_price)
      ? product.default_price
      : null;

  if (
    defaultPrice &&
    defaultPrice.active &&
    defaultPrice.recurring?.interval === "month"
  ) {
    return defaultPrice.id;
  }

  const prices = await stripe.prices.list({
    product: configuredId,
    active: true,
    type: "recurring",
    limit: 100,
  });

  const monthlyPrice = prices.data
    .filter(
      (price) =>
        price.recurring?.interval === "month" &&
        (price.recurring.interval_count ?? 1) === 1,
    )
    .sort((a, b) => b.created - a.created)[0];

  if (!monthlyPrice) {
    throw new Error(
      `No active monthly recurring price found for product ${configuredId}.`,
    );
  }

  return monthlyPrice.id;
}

function getAppUrl() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://replay-sell.vercel.app";

  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

export const createSellerCheckoutSession = action({
  args: {
    plan: v.union(
      v.literal("starter"),
      v.literal("growth"),
      v.literal("boutique"),
    ),
  },
  handler: async (ctx, args): Promise<{ url: string }> => {
    const identity = await requireIdentity(ctx);
    const existing: {
      status: string;
      stripeCustomerId?: string;
      stripeSubscriptionId?: string;
    } | null = await ctx.runQuery(
      internal.sellerBilling.getSellerSubscriptionByUserIdInternal,
      { userId: identity.subject },
    );

    if (existing && hasSellerAccess(existing.status)) {
      throw new Error("Your seller subscription is already active.");
    }

    const stripe = getStripe();
    const priceId = await resolveMonthlyRecurringPriceId(stripe, args.plan);
    const appUrl = getAppUrl();

    const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${appUrl}/dashboard?billing=success`,
        cancel_url: `${appUrl}/dashboard?billing=canceled`,
        client_reference_id: identity.subject,
        ...(existing?.stripeCustomerId
          ? { customer: existing.stripeCustomerId }
          : {}),
        metadata: {
          sellerPlan: args.plan,
          sellerUserId: identity.subject,
        },
        subscription_data: {
          trial_period_days: SELLER_TRIAL_DAYS,
          metadata: {
            sellerPlan: args.plan,
            sellerUserId: identity.subject,
          },
        },
      },
    );

    const stripeCustomerId =
      typeof session.customer === "string" ? session.customer : null;

    await ctx.runMutation(internal.sellerBilling.syncSellerSubscriptionFromStripe, {
      userId: identity.subject,
      plan: args.plan,
      status: "checkout_pending",
      stripeCustomerId: stripeCustomerId ?? existing?.stripeCustomerId ?? null,
      stripeSubscriptionId: existing?.stripeSubscriptionId ?? null,
      stripePriceId: priceId,
      cancelAtPeriodEnd: false,
    });

    if (!session.url) {
      throw new Error("Stripe checkout session URL was not returned.");
    }

    return { url: session.url };
  },
});

export const ingestStripeSubscriptionState = action({
  args: {
    ingestSecret: v.string(),
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
  handler: async (ctx, args): Promise<void> => {
    const expected = getRequiredEnv("STRIPE_WEBHOOK_INGEST_SECRET");
    if (args.ingestSecret !== expected) {
      throw new Error("Unauthorized webhook sync attempt.");
    }

    await ctx.runMutation(internal.sellerBilling.syncSellerSubscriptionFromStripe, {
      userId: args.userId,
      plan: args.plan,
      status: args.status,
      stripeCustomerId: args.stripeCustomerId,
      stripeSubscriptionId: args.stripeSubscriptionId,
      stripePriceId: args.stripePriceId,
      trialEndsAt: args.trialEndsAt,
      currentPeriodEnd: args.currentPeriodEnd,
      canceledAt: args.canceledAt,
      cancelAtPeriodEnd: args.cancelAtPeriodEnd,
    });
  },
});
