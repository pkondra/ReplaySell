import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { requireSessionUser } from "@/lib/connect-demo/auth";
import { getErrorMessage, jsonError } from "@/lib/connect-demo/http";
import {
  getConnectedAccountByUserId,
  getConnectedSubscriptionByUserId,
} from "@/lib/connect-demo/store";
import { getStripeClient } from "@/lib/connect-demo/stripe-client";

export const runtime = "nodejs";

function deriveOnboardingStatus(account: Stripe.V2.Core.Account) {
  const cardPaymentsStatus =
    account.configuration?.merchant?.capabilities?.card_payments?.status ?? null;

  const requirementsStatus =
    account.requirements?.summary?.minimum_deadline?.status ?? null;

  const readyToProcessPayments = cardPaymentsStatus === "active";
  const onboardingComplete =
    requirementsStatus !== "currently_due" && requirementsStatus !== "past_due";

  return {
    cardPaymentsStatus,
    requirementsStatus,
    readyToProcessPayments,
    onboardingComplete,
  };
}

export async function GET() {
  try {
    // Step 1: Ensure only the signed-in seller can read their Connect status.
    const sessionUser = await requireSessionUser();

    // Step 2: Load the seller -> connected account mapping from Convex.
    const connectedAccount = await getConnectedAccountByUserId(sessionUser.id);
    const subscription = await getConnectedSubscriptionByUserId(sessionUser.id);

    // If the seller has not connected Stripe yet, return an explicit empty state.
    if (!connectedAccount) {
      return NextResponse.json({
        connectedAccountId: null,
        status: null,
        subscription: subscription
          ? {
              status: subscription.status,
              stripeSubscriptionId: subscription.stripeSubscriptionId ?? null,
              stripePriceId: subscription.stripePriceId ?? null,
              cancelAtPeriodEnd: subscription.cancelAtPeriodEnd ?? false,
              currentPeriodEnd: subscription.currentPeriodEnd ?? null,
              lastEventType: subscription.lastEventType ?? null,
            }
          : null,
      });
    }

    // Step 3: Read onboarding/capability status live from Stripe API (no DB caching).
    const stripeClient = getStripeClient();
    const account = await stripeClient.v2.core.accounts.retrieve(
      connectedAccount.stripeAccountId,
      {
        include: ["configuration.merchant", "requirements"],
      },
    );

    return NextResponse.json({
      connectedAccountId: connectedAccount.stripeAccountId,
      displayName: connectedAccount.displayName ?? null,
      contactEmail: connectedAccount.contactEmail ?? null,
      status: deriveOnboardingStatus(account),
      subscription: subscription
        ? {
            status: subscription.status,
            stripeSubscriptionId: subscription.stripeSubscriptionId ?? null,
            stripePriceId: subscription.stripePriceId ?? null,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd ?? false,
            currentPeriodEnd: subscription.currentPeriodEnd ?? null,
            lastEventType: subscription.lastEventType ?? null,
          }
        : null,
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return jsonError(error.message, 401);
    }

    return jsonError(getErrorMessage(error, "Failed to load Connect status."), 500);
  }
}
