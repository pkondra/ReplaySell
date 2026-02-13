# ReplaySell v1

ReplaySell is a production-oriented MVP for creating and managing replay embeds.

## Stack

- Next.js 16 (App Router, TypeScript, ESLint)
- Tailwind CSS v4
- Clerk (authentication + protected dashboard routes)
- Convex (database, typed queries/mutations, auth-aware access control)

## Features in v1

- Landing page with single CTA flow: paste replay URL and `Get started`
- Signed-out flow: redirects to Clerk sign-in/sign-up, then returns to dashboard with URL prefilled
- Signed-in flow: creates a replay and opens replay detail page
- Supported previews:
  - YouTube (iframe)
  - Vimeo (iframe)
  - TikTok (oEmbed attempt + embed, fallback link card)
  - Instagram/Whatnot (link card with "not supported in v1")
- Dashboard:
  - Create replay with live preview
  - List my replays, newest first
- Replay detail:
  - Large preview
  - Edit URL + save
  - Copy placeholder public link
- Convex authorization checks on all replay functions (owner-only read/write)

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

Required:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CONVEX_URL`
- `CLERK_JWT_ISSUER_DOMAIN`

Convex CLI will also populate:

- `CONVEX_DEPLOYMENT`
- `NEXT_PUBLIC_CONVEX_SITE_URL`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure Convex deployment (first-time setup):

```bash
npx convex dev
```

This creates/updates `.env.local` with `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`.

3. Set Clerk issuer in Convex env:

```bash
npx convex env set CLERK_JWT_ISSUER_DOMAIN https://<your-clerk-domain>
```

4. Start Convex dev process (keep running):

```bash
npx convex dev
```

5. In another terminal, run Next.js:

```bash
npm run dev
```

App runs at [http://localhost:4000](http://localhost:4000).

## Project structure

```text
convex/
  auth.config.ts
  replays.ts
  schema.ts
src/
  app/
    page.tsx
    sign-in/[[...sign-in]]/page.tsx
    sign-up/[[...sign-up]]/page.tsx
    dashboard/page.tsx
    dashboard/replays/[id]/page.tsx
    api/oembed/tiktok/route.ts
  components/
    providers/app-providers.tsx
    replay/embed-preview.tsx
    replay/replay-url-composer.tsx
    ui/*
  lib/
    embed.ts
    convex-client.ts
```

## Manual smoke checklist

- [ ] Paste URL on landing while signed out -> redirect to auth -> return to `/dashboard` with prefilled URL
- [ ] Paste YouTube URL -> iframe renders
- [ ] Paste TikTok URL -> oEmbed attempt; fallback link card when unavailable
- [ ] Create replay -> item appears in dashboard list
- [ ] Open replay -> detail page loads
- [ ] Update replay URL -> preview updates and save succeeds
- [ ] User cannot access another user’s replay ID (error screen)

## Notes

- Public replay pages are intentionally placeholder-only in v1.
- No Stripe/catalog features are included in this scope.
