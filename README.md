# ReplaySell

ReplaySell is a replay-commerce app where sellers create shoppable replay pages and buyers subscribe for updates, create accounts, and purchase from replay windows.

## Stack

- Next.js 16 (App Router, TypeScript, ESLint)
- Tailwind CSS v4
- Auth.js (email/password auth for seller and buyer accounts)
- Convex (database + mutations/queries)
- Stripe Billing (seller subscriptions + webhook sync)
- Stripe Connect (V2 account onboarding + connected-account checkout)
- Resend (transactional email scaffold)

## Product Model

- Sellers: fixed monthly fee (recommended via Stripe Billing subscription on platform account)
- Buyers: checkout against seller connected account (direct charge via hosted Stripe Checkout)
- Buyers must sign in to purchase so order history is tied to account

## Current Features

- Light-mode neo-brutalist UI system (Outfit + Manrope + Space Grotesk)
- Seller dashboard with replay stats, replay creation, and management
- Replay detail workspace:
  - products
  - subscribers
  - orders
  - quick campaign templates
- Public replay page (`/r/[id]`):
  - email capture + optional phone/SMS consent
  - notification preference toggles (timer / stock / price change)
  - sign-in prompt before purchase
- Buyer purchase history page (`/dashboard/purchases`)
- Seller billing gate (7-day Stripe trial before replay/product creation)
- Stripe Connect in core dashboard/replay flow
  - sidebar button to connect + onboard seller Stripe account
  - replay products are created on seller connected account
  - buyers checkout from replay items with hosted Stripe Checkout
  - paid sessions are confirmed back into local orders
- Resend helper at `src/lib/email/resend.ts` using:
  - `noreply@hello.ringreceptionist.com`

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required:

- `AUTH_SECRET`
- `AUTH_INTERNAL_SECRET`
- `CONVEX_AUTH_PRIVATE_KEY` (RS256 private key in PEM format, with `\n` escapes)
- `CONVEX_AUTH_ISSUER` (recommended: `https://replaysell.com`)
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_APP_URL` (for Stripe success/cancel redirects, recommended: `https://replaysell.com`)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_WEBHOOK_INGEST_SECRET`
- `STRIPE_SELLER_STARTER_MONTHLY_PRICE_ID` (`price_...` preferred, `prod_...` supported)
- `STRIPE_SELLER_GROWTH_MONTHLY_PRICE_ID` (`price_...` preferred, `prod_...` supported)
- `STRIPE_SELLER_BOUTIQUE_MONTHLY_PRICE_ID` (`price_...` preferred, `prod_...` supported)
- `STRIPE_CONNECT_THIN_WEBHOOK_SECRET` (`whsec_...`, for `/api/connect/webhooks/thin`)
- `STRIPE_CONNECT_BILLING_WEBHOOK_SECRET` (`whsec_...`, for `/api/connect/webhooks/billing`)
- `STRIPE_CONNECT_PLATFORM_FEE_BPS` (optional, default `0` = no platform fee)
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (default is already set)

Convex CLI also sets:

- `CONVEX_DEPLOYMENT`
- `NEXT_PUBLIC_CONVEX_SITE_URL`

Stripe + auth values are also required in the Convex deployment runtime because
checkout/session creation, webhook state writes, and JWT verification run in Convex:

```bash
npx convex env set STRIPE_SECRET_KEY <value>
npx convex env set STRIPE_WEBHOOK_INGEST_SECRET <value>
npx convex env set STRIPE_SELLER_STARTER_MONTHLY_PRICE_ID <value>
npx convex env set STRIPE_SELLER_GROWTH_MONTHLY_PRICE_ID <value>
npx convex env set STRIPE_SELLER_BOUTIQUE_MONTHLY_PRICE_ID <value>
npx convex env set NEXT_PUBLIC_APP_URL https://replaysell.com
npx convex env set AUTH_INTERNAL_SECRET <value>
npx convex env set CONVEX_AUTH_ISSUER https://replaysell.com
npx convex env set CONVEX_AUTH_JWKS '<jwks-json>'
```

`CONVEX_AUTH_JWKS` should be a JSON JWKS payload containing the public key
matching `CONVEX_AUTH_PRIVATE_KEY` (served at `/auth/jwks` from Convex HTTP actions).

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start Convex and generate types:

```bash
npx convex dev
```

3. Start app:

```bash
npm run dev
```

App runs on [http://localhost:4000](http://localhost:4000).

## Manual Smoke Checklist

- [ ] Seller signs in and creates a replay
- [ ] Seller adds products to replay detail
- [ ] Public replay unlock form saves subscriber with preferences
- [ ] Buyer is prompted to sign in before buying
- [ ] Signed-in buyer can place order
- [ ] Buyer sees purchase in `/dashboard/purchases`
- [ ] Seller sees order in replay detail orders tab
- [ ] Seller cannot create replay/product before starting trial
- [ ] Seller starts plan checkout with 7-day trial in Stripe Checkout
- [ ] Webhook updates seller status (`trialing`, `active`, `canceled`)
- [ ] Seller clicks "Connect To Stripe" and completes onboarding
- [ ] Seller adds replay product and Stripe product/price are created
- [ ] Buyer signs in and completes hosted checkout from replay page
- [ ] Success redirect confirms order and deducts stock once

## Notes

- Stripe seller billing webhook endpoint: `POST https://replaysell.com/api/stripe/webhook`
- Stripe Connect thin webhook endpoint: `POST https://replaysell.com/api/connect/webhooks/thin`
- Stripe Connect billing webhook endpoint: `POST https://replaysell.com/api/connect/webhooks/billing`
- Example thin-event local forwarding:
  - `stripe listen --thin-events 'v2.core.account[requirements].updated,v2.core.account[configuration.merchant].capability_status_updated,v2.core.account[configuration.customer].capability_status_updated,v2.core.account[configuration.recipient].capability_status_updated' --forward-thin-to http://localhost:4000/api/connect/webhooks/thin`
- Resend helper is scaffolded and ready for route handlers/server actions.
