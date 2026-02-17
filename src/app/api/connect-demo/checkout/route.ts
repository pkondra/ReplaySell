import { NextResponse } from "next/server";

import { getErrorMessage, jsonError, isValidAccountId } from "@/lib/connect-demo/http";
import {
  getAppBaseUrl,
  getPlatformFeeBasisPoints,
  getStripeClient,
} from "@/lib/connect-demo/stripe-client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // Step 1: Parse and validate buyer checkout input.
    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return jsonError("Invalid request body.", 400);
    }

    const body = payload as {
      accountId?: string;
      priceId?: string;
      quantity?: number;
    };

    const accountId = body.accountId;
    const priceId = body.priceId?.trim();
    const quantity = Number(body.quantity ?? 1);

    if (!isValidAccountId(accountId)) {
      return jsonError("A valid connected account ID is required.", 400);
    }

    if (!priceId || !priceId.startsWith("price_")) {
      return jsonError("A valid price ID is required.", 400);
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return jsonError("quantity must be a positive integer.", 400);
    }

    const stripeClient = getStripeClient();
    const appBaseUrl = getAppBaseUrl(request);

    // Step 2: Optional monetization logic.
    // Your current requirement is NO platform fee, so default fee BPS is 0.
    // If you later set STRIPE_CONNECT_PLATFORM_FEE_BPS > 0, we compute and apply an app fee.
    const feeBps = getPlatformFeeBasisPoints();
    let applicationFeeAmount: number | undefined;

    if (feeBps > 0) {
      const price = await stripeClient.prices.retrieve(
        priceId,
        {
          stripeAccount: accountId,
        },
      );

      if (typeof price.unit_amount === "number") {
        applicationFeeAmount = Math.round(
          price.unit_amount * quantity * (feeBps / 10_000),
        );
      }
    }

    // Step 3: Create a direct charge Checkout Session on the connected account.
    const session = await stripeClient.checkout.sessions.create(
      {
        line_items: [
          {
            price: priceId,
            quantity,
          },
        ],
        ...(applicationFeeAmount && applicationFeeAmount > 0
          ? {
              payment_intent_data: {
                application_fee_amount: applicationFeeAmount,
              },
            }
          : {}),
        mode: "payment",
        success_url: `${appBaseUrl}/connect/success?session_id={CHECKOUT_SESSION_ID}&accountId=${encodeURIComponent(accountId)}`,
        cancel_url: `${appBaseUrl}/connect/store/${encodeURIComponent(accountId)}?checkout=cancelled`,
      },
      {
        // Required for direct charges: create Checkout in the connected account context.
        stripeAccount: accountId,
      },
    );

    if (!session.url) {
      return jsonError("Checkout session URL was not returned by Stripe.", 500);
    }

    return NextResponse.json({
      url: session.url,
      accountId,
      applicationFeeAmount: applicationFeeAmount ?? 0,
    });
  } catch (error) {
    return jsonError(getErrorMessage(error, "Failed to create checkout session."), 500);
  }
}
