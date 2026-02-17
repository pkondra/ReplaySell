import { NextResponse } from "next/server";
import type { Id } from "@convex/_generated/dataModel";

import { requireSessionUser } from "@/lib/connect/auth";
import { getErrorMessage, jsonError } from "@/lib/connect/http";
import { getReplayProductCheckoutContext } from "@/lib/connect/store";
import {
  getAppBaseUrl,
  getPlatformFeeBasisPoints,
  getStripeClient,
} from "@/lib/connect/stripe-client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // Step 1: Require buyer authentication before starting payment.
    const sessionUser = await requireSessionUser();

    // Step 2: Parse and validate checkout request.
    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return jsonError("Invalid request body.", 400);
    }

    const body = payload as {
      replayId?: string;
      productId?: string;
      quantity?: number;
      email?: string;
    };

    const replayId = body.replayId as Id<"replays"> | undefined;
    const productId = body.productId as Id<"products"> | undefined;
    const quantity = Number(body.quantity ?? 1);
    const email = body.email?.trim() || sessionUser.email?.trim() || "";

    if (!replayId || !productId) {
      return jsonError("Missing replayId or productId.", 400);
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return jsonError("Quantity must be a positive integer.", 400);
    }

    if (!email) {
      return jsonError("Buyer email is required for checkout.", 400);
    }

    // Step 3: Load replay/product/account context from Convex.
    const context = await getReplayProductCheckoutContext({ replayId, productId });

    if (!context.connectedAccountId) {
      return jsonError(
        "Seller has not connected Stripe yet. Please try another replay item.",
        400,
      );
    }

    const isReplayLive =
      context.replay.status === "live" &&
      context.replay.expiresAt != null &&
      context.replay.expiresAt > Date.now();

    if (!isReplayLive) {
      return jsonError("This replay is no longer accepting payments.", 400);
    }

    if (context.product.stock < quantity) {
      return jsonError("This item does not have enough stock.", 400);
    }

    const stripeClient = getStripeClient();
    const appBaseUrl = getAppBaseUrl(request);

    // Platform fee is optional and defaults to 0 (no fee).
    const feeBps = getPlatformFeeBasisPoints();
    const unitAmountCents = Math.round(context.product.price * 100);
    const applicationFeeAmount =
      feeBps > 0 ? Math.round(unitAmountCents * quantity * (feeBps / 10_000)) : 0;

    // Step 4: Create hosted Checkout on the connected account (direct charge).
    const session = await stripeClient.checkout.sessions.create(
      {
        line_items: [
          context.product.stripePriceId
            ? {
                price: context.product.stripePriceId,
                quantity,
              }
            : {
                price_data: {
                  currency: context.product.currency,
                  unit_amount: unitAmountCents,
                  product_data: {
                    name: context.product.name,
                  },
                },
                quantity,
              },
        ],
        ...(applicationFeeAmount > 0
          ? {
              payment_intent_data: {
                application_fee_amount: applicationFeeAmount,
              },
            }
          : {}),
        mode: "payment",
        customer_email: email,
        client_reference_id: sessionUser.id,
        metadata: {
          replayId,
          productId,
          buyerId: sessionUser.id,
          quantity: String(quantity),
          email,
        },
        success_url: `${appBaseUrl}/r/${replayId}?checkout=success&session_id={CHECKOUT_SESSION_ID}&product_id=${productId}`,
        cancel_url: `${appBaseUrl}/r/${replayId}?checkout=canceled`,
      },
      {
        stripeAccount: context.connectedAccountId,
      },
    );

    if (!session.url) {
      return jsonError("Checkout session URL was not returned by Stripe.", 500);
    }

    return NextResponse.json({
      url: session.url,
      connectedAccountId: context.connectedAccountId,
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return jsonError(error.message, 401);
    }

    return jsonError(
      getErrorMessage(error, "Could not start checkout."),
      500,
    );
  }
}
