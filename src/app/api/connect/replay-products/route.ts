import { NextResponse } from "next/server";
import type { Id } from "@convex/_generated/dataModel";

import { requireSessionUser } from "@/lib/connect/auth";
import { getErrorMessage, jsonError } from "@/lib/connect/http";
import {
  addReplayProductWithStripeMapping,
  getConnectedAccountByUserId,
} from "@/lib/connect/store";
import { getStripeClient } from "@/lib/connect/stripe-client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // Step 1: Ensure this action is performed by the signed-in seller.
    const sessionUser = await requireSessionUser();

    // Step 2: Parse and validate the replay product payload.
    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return jsonError("Invalid request body.", 400);
    }

    const body = payload as {
      replayId?: string;
      name?: string;
      price?: number;
      stock?: number;
      currency?: string;
    };

    const replayId = body.replayId as Id<"replays"> | undefined;
    const name = body.name?.trim();
    const stock = Number(body.stock);
    const price = Number(body.price);
    const currency = (body.currency ?? "usd").toLowerCase();

    if (!replayId) {
      return jsonError("Missing replayId.", 400);
    }

    if (!name) {
      return jsonError("Product name is required.", 400);
    }

    if (!Number.isFinite(price) || price <= 0) {
      return jsonError("Price must be a positive number.", 400);
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return jsonError("Stock must be a non-negative integer.", 400);
    }

    if (!/^[a-z]{3}$/.test(currency)) {
      return jsonError("Currency must be a 3-letter ISO code (for example: usd).", 400);
    }

    // Step 3: Ensure seller has a connected account to host products and payments.
    const connectedAccount = await getConnectedAccountByUserId(sessionUser.id);
    if (!connectedAccount) {
      return jsonError(
        "Connect Stripe first. Click 'Connect To Stripe' in the dashboard sidebar.",
        400,
      );
    }

    const stripeClient = getStripeClient();

    // Stripe unit amounts are in cents. We round to avoid floating-point drift.
    const priceInCents = Math.round(price * 100);
    if (!Number.isInteger(priceInCents) || priceInCents <= 0) {
      return jsonError("Price produced an invalid cent amount.", 400);
    }

    // Step 4: Create a product + default price on the seller's connected account.
    const stripeProduct = await stripeClient.products.create(
      {
        name,
        default_price_data: {
          unit_amount: priceInCents,
          currency,
        },
      },
      {
        stripeAccount: connectedAccount.stripeAccountId,
      },
    );

    const stripePriceId =
      typeof stripeProduct.default_price === "string"
        ? stripeProduct.default_price
        : stripeProduct.default_price?.id ?? null;

    // Step 5: Persist the product in your existing replay product table with Stripe mapping.
    const productId = await addReplayProductWithStripeMapping({
      replayId,
      userId: sessionUser.id,
      name,
      price: priceInCents / 100,
      currency,
      stock,
      stripeProductId: stripeProduct.id,
      stripePriceId,
    });

    return NextResponse.json({
      productId,
      stripeProductId: stripeProduct.id,
      stripePriceId,
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return jsonError(error.message, 401);
    }

    return jsonError(
      getErrorMessage(error, "Could not create replay product."),
      500,
    );
  }
}
