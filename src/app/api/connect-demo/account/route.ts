import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { requireSessionUser } from "@/lib/connect-demo/auth";
import { getErrorMessage, jsonError } from "@/lib/connect-demo/http";
import {
  getConnectedAccountByUserId,
  getConnectedSubscriptionByUserId,
  upsertConnectedAccountMapping,
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
    // Step 1: Ensure only the signed-in seller can read their Connect account mapping.
    const sessionUser = await requireSessionUser();

    // Step 2: Load the seller -> connected account ID mapping from Convex.
    const connectedAccount = await getConnectedAccountByUserId(sessionUser.id);
    const subscription = await getConnectedSubscriptionByUserId(sessionUser.id);

    // If no mapping exists yet, return an empty state for the UI.
    if (!connectedAccount) {
      return NextResponse.json({
        connectedAccountId: null,
        displayName: null,
        contactEmail: null,
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

    // Step 3: Read onboarding/capability status directly from Stripe every time.
    // Per requirement, we DO NOT rely on DB-cached onboarding status for this demo.
    const stripeClient = getStripeClient();
    const account = await stripeClient.v2.core.accounts.retrieve(
      connectedAccount.stripeAccountId,
      {
        include: ["configuration.merchant", "requirements"],
      },
    );

    const status = deriveOnboardingStatus(account);

    return NextResponse.json({
      connectedAccountId: connectedAccount.stripeAccountId,
      displayName: connectedAccount.displayName ?? null,
      contactEmail: connectedAccount.contactEmail ?? null,
      status,
      latestWebhookSignals: {
        latestRequirementsStatus: connectedAccount.latestRequirementsStatus ?? null,
        latestCardPaymentsStatus:
          connectedAccount.latestCardPaymentsStatus ?? null,
        lastThinEventId: connectedAccount.lastThinEventId ?? null,
        lastThinEventType: connectedAccount.lastThinEventType ?? null,
        lastThinEventCreatedAt: connectedAccount.lastThinEventCreatedAt ?? null,
      },
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

    return jsonError(getErrorMessage(error, "Failed to load Connect account."), 500);
  }
}

export async function POST(request: Request) {
  try {
    // Step 1: Require an authenticated seller.
    const sessionUser = await requireSessionUser();

    // Step 2: Parse input sent from the onboarding form.
    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return jsonError("Invalid request body.", 400);
    }

    const body = payload as {
      displayName?: string;
      contactEmail?: string;
    };

    const displayName = body.displayName?.trim() || sessionUser.name?.trim();
    const contactEmail = body.contactEmail?.trim() || sessionUser.email?.trim();

    if (!displayName) {
      return jsonError("Display name is required.", 400);
    }

    if (!contactEmail) {
      return jsonError("Contact email is required.", 400);
    }

    const stripeClient = getStripeClient();

    // Step 3: Create the connected account using the V2 Accounts API.
    // IMPORTANT: This request intentionally uses ONLY the properties requested.
    // We do not pass a top-level `type` (no express/standard/custom type field).
    const account = await stripeClient.v2.core.accounts.create({
      display_name: displayName,
      contact_email: contactEmail,
      identity: {
        country: "us",
      },
      dashboard: "full",
      defaults: {
        responsibilities: {
          fees_collector: "stripe",
          losses_collector: "stripe",
        },
      },
      configuration: {
        customer: {},
        merchant: {
          capabilities: {
            card_payments: {
              requested: true,
            },
          },
        },
      },
    });

    // Step 4: Persist user -> connected account mapping in Convex.
    await upsertConnectedAccountMapping({
      userId: sessionUser.id,
      stripeAccountId: account.id,
      displayName,
      contactEmail,
    });

    return NextResponse.json({
      connectedAccountId: account.id,
      message: "Connected account created.",
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return jsonError(error.message, 401);
    }

    return jsonError(
      getErrorMessage(error, "Failed to create connected account."),
      500,
    );
  }
}
