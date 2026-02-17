import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/connect-demo/auth";
import { getErrorMessage, jsonError, isValidAccountId } from "@/lib/connect-demo/http";
import { getConnectedAccountByUserId } from "@/lib/connect-demo/store";
import { getAppBaseUrl, getStripeClient } from "@/lib/connect-demo/stripe-client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // Step 1: Only the signed-in seller can generate onboarding links.
    const sessionUser = await requireSessionUser();

    // Step 2: Load the seller's stored connected account ID.
    const mapping = await getConnectedAccountByUserId(sessionUser.id);
    if (!mapping) {
      return jsonError(
        "No connected account found. Create a connected account first.",
        404,
      );
    }

    // Step 3: Parse optional payload accountId and enforce account ownership.
    let payload: unknown = {};
    try {
      payload = await request.json();
    } catch {
      // Empty body is allowed; we default to mapped account.
    }

    const requestedAccountId = (payload as { accountId?: string }).accountId;
    if (requestedAccountId && !isValidAccountId(requestedAccountId)) {
      return jsonError("Invalid accountId format.", 400);
    }

    const accountId = requestedAccountId ?? mapping.stripeAccountId;
    if (accountId !== mapping.stripeAccountId) {
      return jsonError("You can only onboard your own connected account.", 403);
    }

    const stripeClient = getStripeClient();
    const appBaseUrl = getAppBaseUrl(request);

    // Step 4: Create a V2 Account Link for onboarding.
    const accountLink = await stripeClient.v2.core.accountLinks.create({
      account: accountId,
      use_case: {
        type: "account_onboarding",
        account_onboarding: {
          configurations: ["merchant", "customer"],
          refresh_url: `${appBaseUrl}/dashboard/connect?onboarding=refresh&accountId=${encodeURIComponent(accountId)}`,
          return_url: `${appBaseUrl}/dashboard/connect?onboarding=return&accountId=${encodeURIComponent(accountId)}`,
        },
      },
    });

    return NextResponse.json({
      url: accountLink.url,
      expiresAt: accountLink.expires_at,
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return jsonError(error.message, 401);
    }

    return jsonError(
      getErrorMessage(error, "Failed to create onboarding link."),
      500,
    );
  }
}
