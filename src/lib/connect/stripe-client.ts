import "server-only";

import Stripe from "stripe";

let stripeClient: Stripe | null = null;

function getRequiredEnv(name: string, placeholderValue: string) {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(
      `${name} is missing. Add ${name}=${placeholderValue} in your .env.local file.`,
    );
  }
  return value;
}

export function getStripeClient() {
  // Placeholder setup reminder:
  // STRIPE_SECRET_KEY=sk_test_your_platform_secret_key
  const secretKey = getRequiredEnv("STRIPE_SECRET_KEY", "sk_test_...");

  if (!secretKey.startsWith("sk_")) {
    throw new Error(
      "STRIPE_SECRET_KEY must be a Stripe secret key starting with 'sk_'.",
    );
  }

  if (!stripeClient) {
    // Per Stripe's latest SDK, API version is selected automatically.
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
}

export function getAppBaseUrl(request?: Request) {
  // Placeholder setup reminder:
  // NEXT_PUBLIC_APP_URL=https://your-domain.example
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) {
    return configured.endsWith("/") ? configured.slice(0, -1) : configured;
  }

  if (request) {
    const url = new URL(request.url);
    return `${url.protocol}//${url.host}`;
  }

  throw new Error(
    "NEXT_PUBLIC_APP_URL is missing. Add NEXT_PUBLIC_APP_URL=https://your-domain.example in .env.local.",
  );
}

export function getConnectSubscriptionPriceId() {
  // Placeholder setup reminder:
  // STRIPE_CONNECT_PLATFORM_SUBSCRIPTION_PRICE_ID=price_...
  const priceId = getRequiredEnv(
    "STRIPE_CONNECT_PLATFORM_SUBSCRIPTION_PRICE_ID",
    "price_...",
  );

  if (!priceId.startsWith("price_")) {
    throw new Error(
      "STRIPE_CONNECT_PLATFORM_SUBSCRIPTION_PRICE_ID must be a Stripe price ID (starts with 'price_').",
    );
  }

  return priceId;
}

export function getConnectThinWebhookSecret() {
  // Placeholder setup reminder:
  // STRIPE_CONNECT_THIN_WEBHOOK_SECRET=whsec_...
  return getRequiredEnv("STRIPE_CONNECT_THIN_WEBHOOK_SECRET", "whsec_...");
}

export function getConnectBillingWebhookSecret() {
  // Placeholder setup reminder:
  // STRIPE_CONNECT_BILLING_WEBHOOK_SECRET=whsec_...
  return getRequiredEnv("STRIPE_CONNECT_BILLING_WEBHOOK_SECRET", "whsec_...");
}

export function getPlatformFeeBasisPoints() {
  // Optional monetization setting. Keep 0 for no platform fee.
  // STRIPE_CONNECT_PLATFORM_FEE_BPS=0
  const raw = process.env.STRIPE_CONNECT_PLATFORM_FEE_BPS?.trim();
  if (!raw) return 0;

  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0 || value > 10000) {
    throw new Error(
      "STRIPE_CONNECT_PLATFORM_FEE_BPS must be an integer between 0 and 10000.",
    );
  }

  return value;
}
