import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/connect-demo/auth";
import { getErrorMessage, jsonError } from "@/lib/connect-demo/http";
import { getConnectedAccountByUserId } from "@/lib/connect-demo/store";
import { getAppBaseUrl, getStripeClient } from "@/lib/connect-demo/stripe-client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // Step 1: Authenticate seller and confirm they have a connected account.
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

    // Step 2: Create a Billing Portal session using customer_account (acct_...).
    const session = await stripeClient.billingPortal.sessions.create({
      customer_account: mapping.stripeAccountId,
      return_url: `${appBaseUrl}/dashboard/connect`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return jsonError(error.message, 401);
    }

    return jsonError(
      getErrorMessage(error, "Failed to create billing portal session."),
      500,
    );
  }
}
