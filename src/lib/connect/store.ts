import "server-only";

import { fetchMutation, fetchQuery } from "convex/nextjs";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

function getInternalSecret() {
  // Placeholder setup reminder:
  // AUTH_INTERNAL_SECRET=your-long-random-secret
  const secret = process.env.AUTH_INTERNAL_SECRET;
  if (!secret || secret.trim() === "") {
    throw new Error(
      "AUTH_INTERNAL_SECRET is missing. Add AUTH_INTERNAL_SECRET=your-long-random-secret in .env.local and Convex env.",
    );
  }
  return secret;
}

function authSecret() {
  return getInternalSecret();
}

export async function getConnectedAccountByUserId(userId: string) {
  return await fetchQuery(api.connect.getConnectedStripeAccountByUserIdInternal, {
    userId,
    authSecret: authSecret(),
  });
}

export async function getConnectedAccountByStripeAccountId(stripeAccountId: string) {
  return await fetchQuery(
    api.connect.getConnectedStripeAccountByStripeAccountIdInternal,
    {
      stripeAccountId,
      authSecret: authSecret(),
    },
  );
}

export async function getConnectedSubscriptionByUserId(userId: string) {
  return await fetchQuery(
    api.connect.getConnectedStripeSubscriptionByUserIdInternal,
    {
      userId,
      authSecret: authSecret(),
    },
  );
}

export async function getReplayProductCheckoutContext(args: {
  replayId: Id<"replays">;
  productId: Id<"products">;
}) {
  return await fetchQuery(api.connect.getReplayProductCheckoutContext, {
    replayId: args.replayId,
    productId: args.productId,
    authSecret: authSecret(),
  });
}

export async function upsertConnectedAccountMapping(args: {
  userId: string;
  stripeAccountId: string;
  displayName?: string | null;
  contactEmail?: string | null;
}) {
  return await fetchMutation(api.connect.upsertConnectedStripeAccountMapping, {
    ...args,
    authSecret: authSecret(),
  });
}

export async function syncConnectedAccountSignals(args: {
  stripeAccountId: string;
  latestRequirementsStatus?: string | null;
  latestCardPaymentsStatus?: string | null;
  lastThinEventId?: string | null;
  lastThinEventType?: string | null;
  lastThinEventCreatedAt?: number | null;
}) {
  return await fetchMutation(api.connect.syncConnectedStripeAccountSignals, {
    ...args,
    authSecret: authSecret(),
  });
}

export async function syncConnectedSubscriptionState(args: {
  stripeAccountId: string;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  status: string;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: number | null;
  lastEventType?: string | null;
}) {
  return await fetchMutation(api.connect.syncConnectedStripeSubscriptionState, {
    ...args,
    authSecret: authSecret(),
  });
}

export async function addReplayProductWithStripeMapping(args: {
  replayId: Id<"replays">;
  userId: string;
  name: string;
  price: number;
  currency: string;
  stock: number;
  stripeProductId?: string | null;
  stripePriceId?: string | null;
}) {
  return await fetchMutation(api.products.addProductWithStripeMapping, {
    replayId: args.replayId,
    userId: args.userId,
    name: args.name,
    price: args.price,
    currency: args.currency,
    stock: args.stock,
    stripeProductId: args.stripeProductId ?? undefined,
    stripePriceId: args.stripePriceId ?? undefined,
    authSecret: authSecret(),
  });
}

export async function finalizePaidCheckoutOrder(args: {
  replayId: Id<"replays">;
  productId: Id<"products">;
  buyerId: string;
  email: string;
  quantity: number;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId?: string | null;
  amountTotalCents?: number | null;
}) {
  return await fetchMutation(api.orders.finalizePaidCheckoutOrder, {
    replayId: args.replayId,
    productId: args.productId,
    buyerId: args.buyerId,
    email: args.email,
    quantity: args.quantity,
    stripeCheckoutSessionId: args.stripeCheckoutSessionId,
    stripePaymentIntentId: args.stripePaymentIntentId ?? undefined,
    amountTotalCents: args.amountTotalCents ?? undefined,
    authSecret: authSecret(),
  });
}
