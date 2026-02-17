import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/connect-demo/auth";
import { getErrorMessage, jsonError } from "@/lib/connect-demo/http";
import { getConnectedAccountByUserId } from "@/lib/connect-demo/store";
import {
  getAppBaseUrl,
  getConnectSubscriptionPriceId,
  getStripeClient,
} from "@/lib/connect-demo/stripe-client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // Step 1: Authenticate seller and load their connected account mapping.
    const sessionUser = await requireSessionUser();
    const mapping = await getConnectedAccountByUserId(sessionUser.id);

    if (!mapping) {
      return jsonError(
        "No connected account found. Create and onboard your account first.",
        404,
      );
    }

    const stripeClient = getStripeClient();
    const appBaseUrl = getAppBaseUrl(request);
    const priceId = getConnectSubscriptionPriceId();

    // Step 2: Create a platform-level subscription Checkout Session.
    // For V2 accounts, customer_account uses the acct_ ID directly.
    const session = await stripeClient.checkout.sessions.create({
      customer_account: mapping.stripeAccountId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appBaseUrl}/dashboard/connect?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appBaseUrl}/dashboard/connect?subscription=cancelled`,
      metadata: {
        connectedAccountId: mapping.stripeAccountId,
        sellerUserId: sessionUser.id,
      },
    });

    if (!session.url) {
      return jsonError("Subscription Checkout URL was not returned by Stripe.", 500);
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return jsonError(error.message, 401);
    }

    return jsonError(
      getErrorMessage(error, "Failed to create subscription checkout session."),
      500,
    );
  }
}
