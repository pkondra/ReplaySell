import { NextResponse } from "next/server";
import type { Id } from "@convex/_generated/dataModel";

import { requireSessionUser } from "@/lib/connect-demo/auth";
import { getErrorMessage, jsonError } from "@/lib/connect-demo/http";
import {
  finalizePaidCheckoutOrder,
  getReplayProductCheckoutContext,
} from "@/lib/connect-demo/store";
import { getStripeClient } from "@/lib/connect-demo/stripe-client";

export const runtime = "nodejs";

function toStringId(value: string | { id: string } | null | undefined) {
  if (value == null) return null;
  return typeof value === "string" ? value : value.id;
}

export async function POST(request: Request) {
  try {
    // Step 1: Require signed-in buyer before confirming checkout.
    const sessionUser = await requireSessionUser();

    // Step 2: Parse payload from success callback.
    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return jsonError("Invalid request body.", 400);
    }

    const body = payload as {
      replayId?: string;
      productId?: string;
      sessionId?: string;
    };

    const replayId = body.replayId as Id<"replays"> | undefined;
    const productId = body.productId as Id<"products"> | undefined;
    const sessionId = body.sessionId?.trim();

    if (!replayId || !productId || !sessionId) {
      return jsonError("Missing replayId, productId, or sessionId.", 400);
    }

    // Step 3: Load seller connected account for this replay product.
    const context = await getReplayProductCheckoutContext({ replayId, productId });
    if (!context.connectedAccountId) {
      return jsonError("Seller is not connected to Stripe.", 400);
    }

    const stripeClient = getStripeClient();

    // Step 4: Retrieve checkout session in connected account context.
    const session = await stripeClient.checkout.sessions.retrieve(
      sessionId,
      {
        expand: ["payment_intent"],
      },
      {
        stripeAccount: context.connectedAccountId,
      },
    );

    if (session.mode !== "payment") {
      return jsonError("Checkout session mode is not payment.", 400);
    }

    if (session.status !== "complete" || session.payment_status !== "paid") {
      return jsonError("Checkout is not yet paid.", 400);
    }

    // Step 5: Confirm this session belongs to current user.
    const buyerIdFromSession =
      session.client_reference_id ?? session.metadata?.buyerId ?? null;
    if (buyerIdFromSession && buyerIdFromSession !== sessionUser.id) {
      return jsonError("This checkout session belongs to another user.", 403);
    }

    const metadataReplayId = session.metadata?.replayId;
    const metadataProductId = session.metadata?.productId;

    if (metadataReplayId && metadataReplayId !== replayId) {
      return jsonError("Replay mismatch for checkout session.", 400);
    }

    if (metadataProductId && metadataProductId !== productId) {
      return jsonError("Product mismatch for checkout session.", 400);
    }

    const quantityRaw = Number(session.metadata?.quantity ?? "1");
    const quantity = Number.isInteger(quantityRaw) && quantityRaw > 0 ? quantityRaw : 1;

    const email =
      session.customer_details?.email ??
      session.metadata?.email ??
      sessionUser.email ??
      "unknown@example.com";

    const paymentIntentId = toStringId(
      session.payment_intent as string | { id: string } | null | undefined,
    );

    // Step 6: Create local order + reduce stock exactly once (idempotent by session ID).
    const result = await finalizePaidCheckoutOrder({
      replayId,
      productId,
      buyerId: sessionUser.id,
      email,
      quantity,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
      amountTotalCents: session.amount_total,
    });

    return NextResponse.json({
      ok: true,
      created: result.created,
      orderId: result.orderId,
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return jsonError(error.message, 401);
    }

    return jsonError(
      getErrorMessage(error, "Could not confirm checkout."),
      500,
    );
  }
}
