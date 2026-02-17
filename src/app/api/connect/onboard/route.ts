import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/connect-demo/auth";
import { getErrorMessage, jsonError } from "@/lib/connect-demo/http";
import {
  getConnectedAccountByUserId,
  upsertConnectedAccountMapping,
} from "@/lib/connect-demo/store";
import { getAppBaseUrl, getStripeClient } from "@/lib/connect-demo/stripe-client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // Step 1: Require a signed-in seller.
    const sessionUser = await requireSessionUser();
    const stripeClient = getStripeClient();

    // Step 2: Reuse existing connected account mapping if present.
    let mapping = await getConnectedAccountByUserId(sessionUser.id);
    let connectedAccountId = mapping?.stripeAccountId ?? null;

    // Step 3: Create a V2 connected account if this is the seller's first time.
    if (!connectedAccountId) {
      const displayName =
        sessionUser.name?.trim() ||
        sessionUser.email?.trim() ||
        `Seller-${sessionUser.id.slice(0, 8)}`;
      const contactEmail =
        sessionUser.email?.trim() ||
        `seller-${sessionUser.id.slice(0, 8)}@example.com`;

      // IMPORTANT: Per your requirement, this uses only the approved V2 fields
      // and does NOT send top-level `type`.
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

      connectedAccountId = account.id;

      // Step 4: Persist user -> connected account mapping.
      await upsertConnectedAccountMapping({
        userId: sessionUser.id,
        stripeAccountId: account.id,
        displayName,
        contactEmail,
      });

      mapping = await getConnectedAccountByUserId(sessionUser.id);
    }

    if (!connectedAccountId) {
      return jsonError("Connected account could not be created.", 500);
    }

    // Step 5: Generate an onboarding Account Link and redirect seller there.
    const appBaseUrl = getAppBaseUrl(request);
    const accountLink = await stripeClient.v2.core.accountLinks.create({
      account: connectedAccountId,
      use_case: {
        type: "account_onboarding",
        account_onboarding: {
          configurations: ["merchant", "customer"],
          refresh_url: `${appBaseUrl}/dashboard?stripe_onboarding=refresh`,
          return_url: `${appBaseUrl}/dashboard?stripe_onboarding=return`,
        },
      },
    });

    return NextResponse.json({
      url: accountLink.url,
      connectedAccountId,
      displayName: mapping?.displayName ?? null,
      contactEmail: mapping?.contactEmail ?? null,
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
