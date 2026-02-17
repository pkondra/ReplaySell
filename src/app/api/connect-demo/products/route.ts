import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { requireSessionUser } from "@/lib/connect-demo/auth";
import { getErrorMessage, jsonError, isValidAccountId } from "@/lib/connect-demo/http";
import { getConnectedAccountByUserId } from "@/lib/connect-demo/store";
import { getStripeClient } from "@/lib/connect-demo/stripe-client";

export const runtime = "nodejs";

function normalizeProduct(product: Stripe.Product) {
  const defaultPrice =
    typeof product.default_price === "object" && product.default_price !== null
      ? product.default_price
      : null;

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    defaultPrice: defaultPrice
      ? {
          id: defaultPrice.id,
          unitAmount: defaultPrice.unit_amount,
          currency: defaultPrice.currency,
        }
      : null,
  };
}

export async function GET(request: Request) {
  try {
    // This endpoint is intentionally public so shoppers can browse storefront inventory.
    const url = new URL(request.url);
    const accountId = url.searchParams.get("accountId");

    if (!isValidAccountId(accountId)) {
      return jsonError("A valid connected account ID is required.", 400);
    }

    const stripeClient = getStripeClient();

    // Fetch products directly from the connected account by setting stripeAccount.
    const products = await stripeClient.products.list(
      {
        limit: 20,
        active: true,
        expand: ["data.default_price"],
      },
      {
        // `stripeAccount` sets the Stripe-Account header in stripe-node.
        stripeAccount: accountId,
      },
    );

    return NextResponse.json({
      accountId,
      products: products.data.map(normalizeProduct),
    });
  } catch (error) {
    return jsonError(getErrorMessage(error, "Failed to list products."), 500);
  }
}

export async function POST(request: Request) {
  try {
    // Step 1: Require a signed-in seller before creating connected-account products.
    const sessionUser = await requireSessionUser();

    // Step 2: Load seller -> connected account mapping from Convex.
    const mapping = await getConnectedAccountByUserId(sessionUser.id);
    if (!mapping) {
      return jsonError(
        "No connected account found. Create and onboard your connected account first.",
        404,
      );
    }

    // Step 3: Validate the product creation payload.
    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return jsonError("Invalid request body.", 400);
    }

    const body = payload as {
      name?: string;
      description?: string;
      priceInCents?: number;
      currency?: string;
    };

    const name = body.name?.trim();
    const description = body.description?.trim() || "";
    const currency = (body.currency ?? "usd").toLowerCase();
    const priceInCents = Number(body.priceInCents);

    if (!name) {
      return jsonError("Product name is required.", 400);
    }

    if (!Number.isInteger(priceInCents) || priceInCents <= 0) {
      return jsonError("priceInCents must be a positive integer.", 400);
    }

    if (!/^[a-z]{3}$/.test(currency)) {
      return jsonError("currency must be a 3-letter ISO code like 'usd'.", 400);
    }

    const stripeClient = getStripeClient();

    // Step 4: Create the product and default price on the connected account.
    const product = await stripeClient.products.create(
      {
        name,
        description,
        default_price_data: {
          unit_amount: priceInCents,
          currency,
        },
      },
      {
        // Required: this sets Stripe-Account so product is created for the seller's account.
        stripeAccount: mapping.stripeAccountId,
      },
    );

    return NextResponse.json({
      product: normalizeProduct(product),
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return jsonError(error.message, 401);
    }

    return jsonError(getErrorMessage(error, "Failed to create product."), 500);
  }
}
