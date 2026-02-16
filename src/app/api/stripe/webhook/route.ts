import { fetchAction } from "convex/nextjs";
import Stripe from "stripe";

import { api } from "@convex/_generated/api";

export const runtime = "nodejs";

type SellerPlanId = "starter" | "growth" | "boutique";

const PLAN_PRICE_ENV_KEYS: Record<SellerPlanId, string> = {
  starter: "STRIPE_SELLER_STARTER_MONTHLY_PRICE_ID",
  growth: "STRIPE_SELLER_GROWTH_MONTHLY_PRICE_ID",
  boutique: "STRIPE_SELLER_BOUTIQUE_MONTHLY_PRICE_ID",
};

let stripeClient: Stripe | null = null;

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

function getStripe() {
  if (!stripeClient) {
    stripeClient = new Stripe(getRequiredEnv("STRIPE_SECRET_KEY"));
  }
  return stripeClient;
}

function toMillis(value: number | null | undefined) {
  if (value == null) return null;
  return value * 1000;
}

function getId(value: string | { id: string } | null | undefined) {
  if (value == null) return undefined;
  return typeof value === "string" ? value : value.id;
}

function isSellerPlanId(value: string | undefined | null): value is SellerPlanId {
  return value === "starter" || value === "growth" || value === "boutique";
}

function getPlanFromPriceId(priceId: string | undefined) {
  if (!priceId) return undefined;

  const starter = process.env[PLAN_PRICE_ENV_KEYS.starter];
  const growth = process.env[PLAN_PRICE_ENV_KEYS.growth];
  const boutique = process.env[PLAN_PRICE_ENV_KEYS.boutique];

  if (starter && starter === priceId) return "starter";
  if (growth && growth === priceId) return "growth";
  if (boutique && boutique === priceId) return "boutique";

  return undefined;
}

function getPrimaryPriceId(subscription: Stripe.Subscription) {
  return subscription.items.data[0]?.price?.id;
}

function getCurrentPeriodEnd(subscription: Stripe.Subscription) {
  const periodEnds = subscription.items.data
    .map((item) => item.current_period_end)
    .filter((value): value is number => typeof value === "number");

  if (periodEnds.length === 0) return null;
  return Math.max(...periodEnds);
}

async function syncSubscriptionState({
  subscription,
  userId,
  plan,
  statusOverride,
}: {
  subscription: Stripe.Subscription;
  userId?: string;
  plan?: SellerPlanId;
  statusOverride?: string;
}) {
  const priceId = getPrimaryPriceId(subscription);
  const metadataPlan = isSellerPlanId(subscription.metadata?.sellerPlan)
    ? subscription.metadata.sellerPlan
    : undefined;
  const resolvedPlan = plan ?? metadataPlan ?? getPlanFromPriceId(priceId);

  await fetchAction(api.sellerBillingActions.ingestStripeSubscriptionState, {
    ingestSecret: getRequiredEnv("STRIPE_WEBHOOK_INGEST_SECRET"),
    userId: userId ?? subscription.metadata?.sellerUserId,
    plan: resolvedPlan ?? null,
    status: statusOverride ?? subscription.status,
    stripeCustomerId: getId(
      subscription.customer as string | { id: string } | null | undefined,
    ) ?? null,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId ?? null,
    trialEndsAt: toMillis(subscription.trial_end),
    currentPeriodEnd: toMillis(getCurrentPeriodEnd(subscription)),
    canceledAt: toMillis(subscription.canceled_at),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing Stripe signature", { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      getRequiredEnv("STRIPE_WEBHOOK_SECRET"),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return new Response(message, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const userId =
          session.client_reference_id ??
          session.metadata?.sellerUserId ??
          undefined;
        const plan = isSellerPlanId(session.metadata?.sellerPlan)
          ? session.metadata.sellerPlan
          : undefined;
        const subscriptionId = getId(
          session.subscription as string | { id: string } | null | undefined,
        );

        if (!subscriptionId) {
          await fetchAction(
            api.sellerBillingActions.ingestStripeSubscriptionState,
            {
              ingestSecret: getRequiredEnv("STRIPE_WEBHOOK_INGEST_SECRET"),
              userId,
              plan: plan ?? null,
              status: "checkout_completed",
              stripeCustomerId:
                getId(
                  session.customer as string | { id: string } | null | undefined,
                ) ?? null,
              stripeSubscriptionId: null,
            },
          );
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await syncSubscriptionState({ subscription, userId, plan });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await syncSubscriptionState({ subscription });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await syncSubscriptionState({
          subscription,
          statusOverride: "canceled",
        });
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error("Stripe webhook sync failed", error);
    return new Response("Webhook processing failed", { status: 500 });
  }

  return Response.json({ received: true });
}
