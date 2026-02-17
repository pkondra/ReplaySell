import "server-only";

import { fetchMutation, fetchQuery } from "convex/nextjs";

import { api } from "@convex/_generated/api";

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

export async function getConnectedAccountByUserId(userId: string) {
  return await fetchQuery(api.connectDemo.getConnectedStripeAccountByUserIdInternal, {
    userId,
    authSecret: getInternalSecret(),
  });
}

export async function getConnectedAccountByStripeAccountId(stripeAccountId: string) {
  return await fetchQuery(
    api.connectDemo.getConnectedStripeAccountByStripeAccountIdInternal,
    {
      stripeAccountId,
      authSecret: getInternalSecret(),
    },
  );
}

export async function getConnectedSubscriptionByUserId(userId: string) {
  return await fetchQuery(
    api.connectDemo.getConnectedStripeSubscriptionByUserIdInternal,
    {
      userId,
      authSecret: getInternalSecret(),
    },
  );
}

export async function upsertConnectedAccountMapping(args: {
  userId: string;
  stripeAccountId: string;
  displayName?: string | null;
  contactEmail?: string | null;
}) {
  return await fetchMutation(api.connectDemo.upsertConnectedStripeAccountMapping, {
    ...args,
    authSecret: getInternalSecret(),
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
  return await fetchMutation(api.connectDemo.syncConnectedStripeAccountSignals, {
    ...args,
    authSecret: getInternalSecret(),
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
  return await fetchMutation(api.connectDemo.syncConnectedStripeSubscriptionState, {
    ...args,
    authSecret: getInternalSecret(),
  });
}
