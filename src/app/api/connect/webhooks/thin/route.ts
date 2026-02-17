import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { getErrorMessage, jsonError } from "@/lib/connect/http";
import { syncConnectedAccountSignals } from "@/lib/connect/store";
import {
  getConnectThinWebhookSecret,
  getStripeClient,
} from "@/lib/connect/stripe-client";

export const runtime = "nodejs";

function getRelatedObjectAccountId(event: Stripe.V2.Core.Event) {
  if (!("related_object" in event)) {
    return null;
  }

  return event.related_object?.id ?? null;
}

function toMillisFromRfc3339(value: string | undefined) {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

function deriveRequirementsStatus(account: Stripe.V2.Core.Account) {
  return account.requirements?.summary?.minimum_deadline?.status ?? null;
}

function deriveCardPaymentsStatus(account: Stripe.V2.Core.Account) {
  return account.configuration?.merchant?.capabilities?.card_payments?.status ?? null;
}

async function syncLatestSignalsFromStripe(args: {
  stripeClient: Stripe;
  accountId: string;
  event: Stripe.V2.Core.Event;
}) {
  const { stripeClient, accountId, event } = args;

  const account = await stripeClient.v2.core.accounts.retrieve(
    accountId,
    {
      include: ["configuration.merchant", "requirements"],
    },
    event.context ? { stripeContext: event.context } : undefined,
  );

  await syncConnectedAccountSignals({
    stripeAccountId: accountId,
    latestRequirementsStatus: deriveRequirementsStatus(account),
    latestCardPaymentsStatus: deriveCardPaymentsStatus(account),
    lastThinEventId: event.id,
    lastThinEventType: event.type,
    lastThinEventCreatedAt: toMillisFromRfc3339(event.created),
  });
}

export async function POST(request: Request) {
  const stripeClient = getStripeClient();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return jsonError("Missing Stripe signature header.", 400);
  }

  const rawBody = await request.text();

  let eventNotification: Stripe.V2.Core.EventNotification;
  try {
    eventNotification = stripeClient.parseEventNotification(
      rawBody,
      signature,
      getConnectThinWebhookSecret(),
    );
  } catch (error) {
    return jsonError(getErrorMessage(error, "Invalid webhook signature."), 400);
  }

  try {
    const event = (await stripeClient.v2.core.events.retrieve(
      eventNotification.id,
      eventNotification.context
        ? { stripeContext: eventNotification.context }
        : undefined,
    )) as Stripe.V2.Core.Event;

    const accountId = getRelatedObjectAccountId(event);

    switch (event.type) {
      case "v2.core.account[requirements].updated":
      case "v2.core.account[configuration.merchant].capability_status_updated":
      case "v2.core.account[configuration.customer].capability_status_updated":
      case "v2.core.account[configuration.recipient].capability_status_updated": {
        if (accountId) {
          await syncLatestSignalsFromStripe({ stripeClient, accountId, event });
        }
        break;
      }

      default:
        break;
    }
  } catch (error) {
    return jsonError(
      getErrorMessage(error, "Failed to process thin webhook event."),
      500,
    );
  }

  return NextResponse.json({ received: true });
}
