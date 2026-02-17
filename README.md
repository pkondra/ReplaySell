# ReplaySell

ReplaySell is a replay-commerce app where sellers create shoppable replay pages and buyers subscribe for updates, create accounts, and purchase from replay windows.

## Stack

- Next.js 16 (App Router, TypeScript, ESLint)
- Tailwind CSS v4
- Auth.js (email/password auth for seller and buyer accounts)
- Convex (database + mutations/queries)
- Stripe Billing (seller subscriptions + webhook sync)
- Stripe Connect sample (V2 accounts + onboarding + storefront + webhooks)
- Resend (transactional email scaffold)

## Product Model

- Sellers: fixed monthly fee (recommended via Stripe Billing subscription on platform account)
- Buyers: checkout against seller connected account (recommended via Stripe Connect Express destination charges)
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
- Connect sample dashboard at `/dashboard/connect`
  - creates V2 connected accounts
  - generates V2 account onboarding links
  - creates connected-account products
  - launches connected-account storefront checkout
  - starts subscription checkout with `customer_account`
  - opens Billing Portal with `customer_account`
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
- `CONVEX_AUTH_ISSUER` (recommended: `https://replay-sell.vercel.app`)
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_APP_URL` (for Stripe success/cancel redirects, recommended: `https://replay-sell.vercel.app`)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_WEBHOOK_INGEST_SECRET`
- `STRIPE_SELLER_STARTER_MONTHLY_PRICE_ID` (`price_...` preferred, `prod_...` supported)
- `STRIPE_SELLER_GROWTH_MONTHLY_PRICE_ID` (`price_...` preferred, `prod_...` supported)
- `STRIPE_SELLER_BOUTIQUE_MONTHLY_PRICE_ID` (`price_...` preferred, `prod_...` supported)
- `STRIPE_CONNECT_PLATFORM_SUBSCRIPTION_PRICE_ID` (`price_...`, used by `/dashboard/connect`)
- `STRIPE_CONNECT_THIN_WEBHOOK_SECRET` (`whsec_...`, for `/api/connect-demo/webhooks/thin`)
- `STRIPE_CONNECT_BILLING_WEBHOOK_SECRET` (`whsec_...`, for `/api/connect-demo/webhooks/billing`)
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
npx convex env set NEXT_PUBLIC_APP_URL https://replay-sell.vercel.app
npx convex env set AUTH_INTERNAL_SECRET <value>
npx convex env set CONVEX_AUTH_ISSUER https://replay-sell.vercel.app
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

## Notes

- Stripe seller billing webhook endpoint: `POST /api/stripe/webhook` on your app URL.
- Stripe Connect thin webhook endpoint: `POST /api/connect-demo/webhooks/thin`
- Stripe Connect billing webhook endpoint: `POST /api/connect-demo/webhooks/billing`
- Example thin-event local forwarding:
  - `stripe listen --thin-events 'v2.core.account[requirements].updated,v2.core.account[configuration.merchant].capability_status_updated,v2.core.account[configuration.customer].capability_status_updated,v2.core.account[configuration.recipient].capability_status_updated' --forward-thin-to http://localhost:4000/api/connect-demo/webhooks/thin`
- Resend helper is scaffolded and ready for route handlers/server actions.
