import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { getErrorMessage, jsonError } from "@/lib/connect/http";
import { syncConnectedSubscriptionState } from "@/lib/connect/store";
import {
  getConnectBillingWebhookSecret,
  getStripeClient,
} from "@/lib/connect/stripe-client";

export const runtime = "nodejs";

function getPrimaryPriceId(subscription: Stripe.Subscription) {
  return subscription.items.data[0]?.price?.id ?? null;
}

function getCurrentPeriodEndMillis(subscription: Stripe.Subscription) {
  const periodEnds = subscription.items.data
    .map((item) => item.current_period_end)
    .filter((value): value is number => typeof value === "number");

  if (periodEnds.length === 0) {
    return null;
  }

  return Math.max(...periodEnds) * 1000;
}

async function syncSubscriptionToDatabase(
  subscription: Stripe.Subscription,
  eventType: string,
) {
  const connectedAccountId = subscription.customer_account;
  if (!connectedAccountId) {
    return;
  }

  await syncConnectedSubscriptionState({
    stripeAccountId: connectedAccountId,
    stripeSubscriptionId: subscription.id,
    stripePriceId: getPrimaryPriceId(subscription),
    status: subscription.status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    currentPeriodEnd: getCurrentPeriodEndMillis(subscription),
    lastEventType: eventType,
  });
}

function getSubscriptionIdFromInvoice(invoice: Stripe.Invoice) {
  const raw = (invoice as unknown as { subscription?: string | Stripe.Subscription | null })
    .subscription;
  if (!raw) return null;
  return typeof raw === "string" ? raw : raw.id;
}

export async function POST(request: Request) {
  const stripeClient = getStripeClient();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return jsonError("Missing Stripe signature header.", 400);
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = stripeClient.webhooks.constructEvent(
      rawBody,
      signature,
      getConnectBillingWebhookSecret(),
    );
  } catch (error) {
    return jsonError(getErrorMessage(error, "Invalid webhook signature."), 400);
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await syncSubscriptionToDatabase(
          event.data.object as Stripe.Subscription,
          event.type,
        );
        break;
      }

      case "invoice.paid":
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = getSubscriptionIdFromInvoice(invoice);

        if (subscriptionId) {
          const subscription = await stripeClient.subscriptions.retrieve(
            subscriptionId,
          );
          await syncSubscriptionToDatabase(subscription, event.type);
        }
        break;
      }

      case "payment_method.attached":
      case "payment_method.detached":
      case "customer.updated":
      case "customer.tax_id.created":
      case "customer.tax_id.deleted":
      case "customer.tax_id.updated":
      case "billing_portal.configuration.created":
      case "billing_portal.configuration.updated":
      case "billing_portal.session.created": {
        break;
      }

      default:
        break;
    }
  } catch (error) {
    return jsonError(
      getErrorMessage(error, "Failed to process billing webhook event."),
      500,
    );
  }

  return NextResponse.json({ received: true });
}
