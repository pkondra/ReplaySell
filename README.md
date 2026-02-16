# ReplaySell

ReplaySell is a replay-commerce app where sellers create shoppable replay pages and buyers subscribe for updates, create accounts, and purchase from replay windows.

## Stack

- Next.js 16 (App Router, TypeScript, ESLint)
- Tailwind CSS v4
- Clerk (auth for seller and buyer accounts)
- Convex (database + mutations/queries)
- Stripe Billing (seller subscriptions + webhook sync)
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
- Resend helper at `src/lib/email/resend.ts` using:
  - `noreply@hello.ringreceptionist.com`

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_JWT_ISSUER_DOMAIN`
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_APP_URL` (for Stripe success/cancel redirects)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_WEBHOOK_INGEST_SECRET`
- `STRIPE_SELLER_STARTER_MONTHLY_PRICE_ID` (`price_...` preferred, `prod_...` supported)
- `STRIPE_SELLER_GROWTH_MONTHLY_PRICE_ID` (`price_...` preferred, `prod_...` supported)
- `STRIPE_SELLER_BOUTIQUE_MONTHLY_PRICE_ID` (`price_...` preferred, `prod_...` supported)
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (default is already set)

Convex CLI also sets:

- `CONVEX_DEPLOYMENT`
- `NEXT_PUBLIC_CONVEX_SITE_URL`

Stripe values are also required in the Convex deployment runtime because
checkout/session creation and webhook state writes run in Convex actions:

```bash
npx convex env set STRIPE_SECRET_KEY <value>
npx convex env set STRIPE_WEBHOOK_INGEST_SECRET <value>
npx convex env set STRIPE_SELLER_STARTER_MONTHLY_PRICE_ID <value>
npx convex env set STRIPE_SELLER_GROWTH_MONTHLY_PRICE_ID <value>
npx convex env set STRIPE_SELLER_BOUTIQUE_MONTHLY_PRICE_ID <value>
npx convex env set NEXT_PUBLIC_APP_URL http://localhost:4000
```

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
- Resend helper is scaffolded and ready for route handlers/server actions.
