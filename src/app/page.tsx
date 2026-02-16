import type { Metadata } from "next";
import {
  ArrowRight,
  Bell,
  CalendarClock,
  Check,
  CreditCard,
  Link2,
  Package,
  Play,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Timer,
  UserRound,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { HeroReplayCta } from "@/components/landing/hero-replay-cta";

/* ------------------------------------------------------------------ */
/*  Page-level SEO                                                      */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "ReplaySell — Turn your live replay into 48 hours of sales",
  description:
    "Capture the buyers who missed your live with a shoppable replay page, countdown timer, and built-in checkout. Plans from $49/mo. No integrations needed.",
  alternates: { canonical: "https://replaysell.com" },
};

/* ------------------------------------------------------------------ */
/*  Structured Data (JSON-LD)                                           */
/* ------------------------------------------------------------------ */

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "ReplaySell",
      url: "https://replaysell.com",
      description:
        "Turn your live shopping replays into shoppable storefronts with countdown timers, buyer accounts, stock alerts, and Stripe checkout.",
    },
    {
      "@type": "SoftwareApplication",
      name: "ReplaySell",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://replaysell.com",
      description:
        "Platform for live sellers to create shoppable replay storefronts with urgency timers, buyer alerts, and Stripe Connect checkout.",
      offers: [
        {
          "@type": "Offer",
          name: "Starter",
          price: "49.00",
          priceCurrency: "USD",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
          description: "For solo sellers — unlimited replay pages, email follow-ups, Stripe checkout",
        },
        {
          "@type": "Offer",
          name: "Growth",
          price: "99.00",
          priceCurrency: "USD",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
          description: "For consistent live sellers — SMS follow-ups, buyer segmentation, performance tracking",
        },
        {
          "@type": "Offer",
          name: "Boutique",
          price: "149.00",
          priceCurrency: "USD",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
          description: "For teams & boutiques — multiple users, multiple brands, VIP buyer tagging",
        },
      ],
      featureList: [
        "Shoppable replay storefronts",
        "Countdown urgency timers",
        "Buyer accounts with order history",
        "Price drop and stock alerts",
        "Stripe Connect checkout",
        "Email & SMS notifications",
        "Buyer segmentation",
        "Replay performance tracking",
      ],
    },
    {
      "@type": "Organization",
      name: "ReplaySell",
      url: "https://replaysell.com",
      email: "support@replaysell.com",
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const steps = [
  {
    num: "01",
    title: "Paste your replay link",
    body: "Paste your replay link and post it on Instagram, TikTok bio, stories, WhatsApp, or Facebook. We handle the rest — no integrations, no code, no Shopify needed.",
    color: "bg-accent",
    icon: Link2,
  },
  {
    num: "02",
    title: "Add your products",
    body: "Import your products, set a 48-hour countdown, and your shoppable replay page is live in under 2 minutes.",
    color: "bg-[#ff9ecd]",
    icon: Timer,
  },
  {
    num: "03",
    title: "Get paid",
    body: "Shoppers browse, get alerts, and checkout via Stripe. You keep selling long after the live ends.",
    color: "bg-accent-amber",
    icon: ShoppingBag,
  },
];

const features = [
  {
    title: "48-hour countdown timers",
    body: "Every replay page has a visible countdown that drives urgency and action from the moment it goes live.",
    color: "bg-accent",
    icon: CalendarClock,
  },
  {
    title: "Built-in buyer accounts",
    body: "Buyers sign up, track orders, manage alert preferences, and see their full purchase history.",
    color: "bg-[#ff9ecd]",
    icon: UserRound,
  },
  {
    title: "Smart email & SMS alerts",
    body: "Timer reminders, price drops, restock alerts, and replay-closing notices — sent automatically.",
    color: "bg-accent-amber",
    icon: Bell,
  },
  {
    title: "Stripe-powered checkout",
    body: "Buyers pay you directly via Stripe Connect. Fast, secure, and familiar — no middleman.",
    color: "bg-[#ffbc8c]",
    icon: CreditCard,
  },
  {
    title: "Seller command center",
    body: "Manage products, view performance analytics, track subscribers, and send campaigns from one dashboard.",
    color: "bg-[#b794f6]",
    icon: Store,
  },
  {
    title: "Loads in milliseconds",
    body: "No bloated plugins. No slow page builders. Just fast, clean storefronts that actually convert.",
    color: "bg-[#ff6b5a]/20",
    icon: Zap,
  },
];

const testimonials = [
  {
    name: "Maya R.",
    role: "TikTok fashion seller",
    quote:
      "I used to lose buyers after the live ended. Now replay links keep converting while I sleep.",
    metric: "+$2,140 replay revenue in 7 days",
    tone: "bg-accent",
  },
  {
    name: "Carmen T.",
    role: "Boutique owner",
    quote:
      "The countdown and low-stock alerts are the difference. People come back and actually checkout.",
    metric: "3.4x more post-live orders",
    tone: "bg-[#ff9ecd]",
  },
  {
    name: "Jules N.",
    role: "Instagram live host",
    quote:
      "Customers paste the link from my bio and buy fast. No DMs, no manual invoices, no chaos.",
    metric: "12 hours saved every month",
    tone: "bg-accent-amber",
  },
  {
    name: "Kayla P.",
    role: "Reseller",
    quote:
      "ReplaySell made my old replays useful again. The same content now closes new sales every week.",
    metric: "41% of weekly sales from replays",
    tone: "bg-[#ffbc8c]",
  },
  {
    name: "Lena W.",
    role: "Facebook live seller",
    quote:
      "I dropped the replay link in Stories and woke up to paid orders without touching DMs.",
    metric: "$890 overnight replay sales",
    tone: "bg-[#b794f6]",
  },
  {
    name: "Amira S.",
    role: "Beauty creator",
    quote:
      "The replay timer gives people a reason to buy now. It stopped the 'I'll come back later' problem.",
    metric: "+62% same-day conversions",
    tone: "bg-accent",
  },
  {
    name: "Rocio D.",
    role: "Vintage seller",
    quote:
      "Before ReplaySell I manually invoiced everyone. Now buyers self-checkout and I focus on sourcing.",
    metric: "7 hours saved per week",
    tone: "bg-[#ff9ecd]",
  },
  {
    name: "Nadia F.",
    role: "Accessories boutique",
    quote:
      "Our replay page works like a mini store after every live. It's clean, fast, and easy to share.",
    metric: "2.8x replay click-through rate",
    tone: "bg-accent-amber",
  },
  {
    name: "Tiana B.",
    role: "TikTok reseller",
    quote:
      "I posted one link in bio and got orders from people who missed the stream by 12 hours.",
    metric: "34 extra orders per replay",
    tone: "bg-[#ffbc8c]",
  },
  {
    name: "Brook H.",
    role: "Sneaker seller",
    quote:
      "Low-stock labels push buyers to checkout fast. It feels like the urgency from the live itself.",
    metric: "3.1x faster sell-through",
    tone: "bg-[#b794f6]",
  },
  {
    name: "Hana M.",
    role: "Home decor host",
    quote:
      "ReplaySell made old inventory move again. I now run replay drops weekly with almost no manual work.",
    metric: "$1,740 monthly replay revenue",
    tone: "bg-accent",
  },
  {
    name: "Dee C.",
    role: "Instagram boutique",
    quote:
      "Our buyers actually like the page because they can see products and buy in two taps.",
    metric: "21% higher checkout rate",
    tone: "bg-[#ff9ecd]",
  },
  {
    name: "Piper J.",
    role: "Live auction seller",
    quote:
      "I use replay links in WhatsApp follow-ups and they convert way better than plain text messages.",
    metric: "2.2x WhatsApp conversions",
    tone: "bg-accent-amber",
  },
  {
    name: "Sara K.",
    role: "Streetwear creator",
    quote:
      "The replay page looks premium and trustworthy. Buyers stopped asking if checkout is legit.",
    metric: "18% fewer drop-offs",
    tone: "bg-[#ffbc8c]",
  },
  {
    name: "Mina L.",
    role: "Jewelry seller",
    quote:
      "I schedule reminder posts and keep the same replay link everywhere. No confusion, just sales.",
    metric: "+$1,120 in 10 days",
    tone: "bg-[#b794f6]",
  },
  {
    name: "Cleo V.",
    role: "Facebook creator",
    quote:
      "ReplaySell turned my late-night lives into a 48-hour selling window that keeps paying back.",
    metric: "46% of sales after stream end",
    tone: "bg-accent",
  },
  {
    name: "Rina O.",
    role: "Boutique manager",
    quote:
      "The team loves that one replay link works across TikTok bio, Stories, and email blasts.",
    metric: "4 channels, one link, one flow",
    tone: "bg-[#ff9ecd]",
  },
  {
    name: "Jo P.",
    role: "Handmade shop owner",
    quote:
      "I can launch a replay page in minutes. It feels like a cheat code after every live session.",
    metric: "Under 2 min setup time",
    tone: "bg-accent-amber",
  },
  {
    name: "Reese N.",
    role: "TikTok beauty host",
    quote:
      "I use replay links for product rounds. It keeps momentum going all weekend long.",
    metric: "+29% weekend revenue",
    tone: "bg-[#ffbc8c]",
  },
  {
    name: "Ayla T.",
    role: "Fashion boutique",
    quote:
      "Our replay page looks on-brand and drives repeat buyers back without paid ads.",
    metric: "37% repeat buyer rate",
    tone: "bg-[#b794f6]",
  },
  {
    name: "Noor E.",
    role: "Home seller",
    quote:
      "The alerts bring people back when stock updates. We recover sales we used to lose.",
    metric: "26 recovered orders/month",
    tone: "bg-accent",
  },
  {
    name: "Mia Y.",
    role: "Live seller",
    quote:
      "The replay storefront is cleaner than link-in-bio tools and converts better for product drops.",
    metric: "1.9x better than bio links",
    tone: "bg-[#ff9ecd]",
  },
  {
    name: "Ari Q.",
    role: "Resale curator",
    quote:
      "People buy from replay while I prep the next live. That never happened before.",
    metric: "Continuous sales between lives",
    tone: "bg-accent-amber",
  },
  {
    name: "Dina G.",
    role: "Creator seller",
    quote:
      "Posting replay links in Stories became part of my routine because it just works.",
    metric: "3.7x story-to-order lift",
    tone: "bg-[#ffbc8c]",
  },
  {
    name: "Faye R.",
    role: "Curated thrift seller",
    quote:
      "ReplaySell gave me structure: timer, products, checkout. Buyers know exactly what to do.",
    metric: "Higher intent from first click",
    tone: "bg-[#b794f6]",
  },
  {
    name: "Nia P.",
    role: "TikTok boutique owner",
    quote:
      "I share one replay URL in captions and comments. Buyers keep finding it and buying later.",
    metric: "+$980 replay lift per week",
    tone: "bg-accent",
  },
  {
    name: "Jade S.",
    role: "Pop-up seller",
    quote:
      "I no longer miss post-live demand. The replay page captures all the late buyers for us.",
    metric: "31% more total event revenue",
    tone: "bg-[#ff9ecd]",
  },
];

const TESTIMONIAL_ROWS = 3;
const testimonialColumns = Array.from(
  { length: Math.ceil(testimonials.length / TESTIMONIAL_ROWS) },
  (_, columnIndex) =>
    testimonials.slice(
      columnIndex * TESTIMONIAL_ROWS,
      columnIndex * TESTIMONIAL_ROWS + TESTIMONIAL_ROWS,
    ),
);
const loopingTestimonialColumns = [...testimonialColumns, ...testimonialColumns];
const mobileTestimonials = testimonials.slice(0, 2);

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    tagline: "For solo sellers getting started with replay sales.",
    cta: "Start My First Replay",
    popular: false,
    color: "bg-accent",
    detail: "If one replay makes you $50+, this pays for itself.",
    features: [
      "Unlimited replay pages",
      "Built-in countdown timers that drive urgency",
      "Stripe-powered checkout (you get paid directly)",
      "Automated email follow-ups",
      "Essential sales tracking",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 99,
    tagline: "For sellers going live weekly.",
    cta: "Upgrade My Replay Sales",
    popular: true,
    color: "bg-[#ff9ecd]",
    detail: "Built for sellers who want consistent replay income after every live.",
    features: [
      "Everything in Starter, plus:",
      "Email + SMS automation",
      "Buyer tagging & segmentation",
      "Replay revenue tracking",
      "Priority support",
    ],
  },
  {
    id: "boutique",
    name: "Boutique",
    price: 149,
    tagline: "For teams & high-volume brands.",
    cta: "Scale My Live Revenue",
    popular: false,
    color: "bg-[#ffbc8c]",
    detail: "Designed for serious sellers scaling multiple drops.",
    features: [
      "Everything in Growth, plus:",
      "Multiple users",
      "Multiple brands/pages",
      "VIP buyer tagging",
      "Advanced analytics",
    ],
  },
];

const faqs = [
  {
    q: "What exactly is a replay storefront?",
    a: "After your live shopping event ends, ReplaySell turns it into a standalone shoppable page with a countdown timer, stock levels, and checkout — so people who missed the live can still buy.",
  },
  {
    q: "How fast can I set one up?",
    a: "Under 2 minutes. Paste your replay link, add your products, set a timer, and you're live. No integrations, no Shopify, no code.",
  },
  {
    q: "How do payments work?",
    a: "Your buyers checkout through Stripe Connect, so payments go directly to your account. You pay a flat monthly plan fee — no per-transaction commissions from us.",
  },
  {
    q: "Do buyers need an account?",
    a: "Yes — buyers create a quick account so they can track orders, manage notification preferences, and see purchase history.",
  },
  {
    q: "Can I use this with TikTok, Instagram, and Facebook?",
    a: "Yes. Paste any TikTok, Instagram, or Facebook replay URL. Then copy your replay link and post it anywhere: Instagram, TikTok bio, WhatsApp, Facebook.",
  },
  {
    q: "What's the difference between plans?",
    a: "Starter gives you everything to sell from replays. Growth adds SMS, segmentation, and performance tracking. Boutique is for teams with multiple brands and VIP buyer features.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <main className="page-fade-in min-h-screen">
      {/* ── Structured data ──────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Header ───────────────────────────────────────────── */}
      <header className="border-b-[3px] border-line bg-panel">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-[3px] border-line bg-[#ffbc8c] shadow-[0_4px_0_#000]">
              <Package size={20} />
            </div>
            <p className="font-heading text-2xl font-black leading-none tracking-tight sm:text-3xl">
              ReplaySell
            </p>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="hidden h-11 items-center px-5 font-dashboard text-sm font-bold text-text-muted transition-colors hover:text-text sm:inline-flex"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="brutal-btn-primary inline-flex h-11 items-center gap-2 px-5 font-dashboard text-sm"
            >
              Start Free
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-12 pb-8 pt-14 sm:pb-12 sm:pt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-16 lg:pt-28">
          {/* Left — Copy + Input */}
          <div>
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-line bg-accent-amber px-4 py-2 shadow-[0_2px_0_#000]">
              <Sparkles size={14} />
              <span className="font-dashboard text-xs font-bold uppercase tracking-[0.08em]">
                Launch your replay in 2 minutes
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-[clamp(2.2rem,5vw,4.2rem)] font-black leading-[1.08] tracking-[-0.035em]">
              From Replay Link to{" "}
              <span className="text-[#ff6b5a]">Live Storefront in 2 Minutes</span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-text-muted sm:text-xl sm:leading-relaxed">
              Paste your replay URL, add products, and publish instantly. Start selling to missed buyers before your next story post.
            </p>

            {/* Input + CTA */}
            <HeroReplayCta />
          </div>

          {/* Right — Replay page mockup */}
          <div className="relative hidden lg:block">
            {/* Main mockup card */}
            <div className="relative rounded-2xl border-[3px] border-line bg-white shadow-[0_8px_0_#000]">
              {/* Mock nav */}
              <div className="flex items-center justify-between border-b-[3px] border-line px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg border-2 border-line bg-[#ffbc8c]" />
                  <span className="font-heading text-sm font-black">Summer Haul</span>
                </div>
                <span className="rounded-full border-2 border-line bg-accent px-3 py-1 font-dashboard text-[10px] font-bold shadow-[0_2px_0_#000]">
                  LIVE
                </span>
              </div>

              {/* Mock countdown */}
              <div className="flex items-center justify-between border-b-[3px] border-line bg-accent-amber px-5 py-2.5">
                <div className="flex items-center gap-1.5">
                  <Timer size={13} />
                  <span className="font-dashboard text-xs font-bold">Closes in</span>
                </div>
                <span className="font-dashboard text-lg font-black tabular-nums">23:47:12</span>
              </div>

              {/* Mock content */}
              <div className="p-5">
                {/* Video placeholder */}
                <div className="mb-4 flex h-36 items-center justify-center rounded-xl border-[3px] border-line bg-panel-strong">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-line bg-white shadow-[0_3px_0_#000]">
                    <Play size={18} className="ml-0.5" />
                  </div>
                </div>

                {/* Mock products */}
                <div className="space-y-2.5">
                  <MockProduct name="Floral Print Dress" price="$38.00" stock="12 left" inStock />
                  <MockProduct name="Gold Hoop Earrings" price="$22.00" stock="4 left" inStock />
                  <MockProduct name="Silk Scrunchie Set" price="$14.00" stock="Sold out" inStock={false} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile mockup — simplified */}
        <div className="mb-8 lg:hidden">
          <div className="brutal-card overflow-hidden bg-panel p-0">
            <div className="flex items-center justify-between border-b-[3px] border-line bg-accent-amber px-5 py-3">
              <div className="flex items-center gap-1.5">
                <Timer size={14} />
                <span className="font-dashboard text-xs font-bold">Replay closes in</span>
              </div>
              <span className="font-dashboard text-lg font-black tabular-nums">23:47:12</span>
            </div>
            <div className="grid grid-cols-3 divide-x-[3px] divide-line">
              <div className="p-4 text-center">
                <p className="font-heading text-2xl font-black">12</p>
                <p className="font-dashboard text-[10px] font-bold text-text-muted">Products</p>
              </div>
              <div className="p-4 text-center">
                <p className="font-heading text-2xl font-black">48h</p>
                <p className="font-dashboard text-[10px] font-bold text-text-muted">Window</p>
              </div>
              <div className="p-4 text-center">
                <p className="font-heading text-2xl font-black">$0</p>
                <p className="font-dashboard text-[10px] font-bold text-text-muted">Commission</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 pt-18 sm:px-8 sm:pt-24">
        <div className="mb-12 max-w-2xl">
          <p className="font-dashboard text-xs font-bold uppercase tracking-[0.12em] text-text-muted">
            How it works
          </p>
          <h2 className="mt-3 font-heading text-4xl font-black tracking-tight sm:text-5xl">
            Three steps. Zero complexity.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className={`rounded-2xl border-[3px] border-line ${step.color} p-7 shadow-[0_4px_0_#000]`}
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border-[3px] border-line bg-white shadow-[0_2px_0_#000]">
                  <step.icon size={18} />
                </div>
                <span className="font-dashboard text-sm font-bold text-text-muted">{step.num}</span>
              </div>
              <h3 className="font-heading text-2xl font-extrabold tracking-tight">{step.title}</h3>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 pt-20 sm:px-8 sm:pt-28">
        <div className="mb-12 text-center">
          <p className="font-dashboard text-xs font-bold uppercase tracking-[0.12em] text-text-muted">
            Everything you need
          </p>
          <h2 className="mx-auto mt-3 max-w-xl font-heading text-4xl font-black tracking-tight sm:text-5xl">
            Sell more from every replay
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border-[3px] border-line bg-panel p-7 shadow-[0_4px_0_#000] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_0_#000]"
            >
              <div
                className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-line ${card.color} shadow-[0_2px_0_#000]`}
              >
                <card.icon size={20} />
              </div>
              <h3 className="font-heading text-xl font-extrabold tracking-tight">{card.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-text-muted">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 pt-20 sm:px-8 sm:pt-28">
        <div className="mb-12 text-center">
          <p className="font-dashboard text-xs font-bold uppercase tracking-[0.12em] text-text-muted">
            Pricing Built for Live Sellers
          </p>
          <h2 className="mx-auto mt-3 max-w-xl font-heading text-4xl font-black tracking-tight sm:text-5xl">
            Turn every live into predictable replay revenue.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base font-semibold text-text-muted">
            Launch your first replay free.
          </p>
          <p className="mx-auto mt-1 max-w-lg text-base font-semibold text-text-muted">
            7-day trial. Cancel anytime. Keep 100% of your sales.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border-[3px] border-line bg-panel shadow-[0_4px_0_#000] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_0_#000] ${
                plan.popular ? "ring-4 ring-[#ff9ecd]/40 ring-offset-2 ring-offset-bg" : ""
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border-[3px] border-line bg-[#ff9ecd] px-4 py-1.5 font-dashboard text-xs font-bold shadow-[0_3px_0_#000]">
                    <Star size={12} fill="currentColor" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex flex-1 flex-col p-7 pt-8">
                {/* Plan name */}
                <h3 className="font-heading text-2xl font-black">{plan.name}</h3>

                {/* Price */}
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-heading text-5xl font-black tracking-tight text-[#ff6b5a]">
                    ${plan.price}
                  </span>
                  <span className="font-dashboard text-base font-semibold text-text-muted">/month</span>
                </div>

                {/* Tagline */}
                <p className="mt-2 font-dashboard text-sm font-semibold text-text-muted">
                  {plan.tagline}
                </p>

                {"detail" in plan ? (
                  <p className="mt-2 font-dashboard text-xs font-semibold text-text-muted">
                    {plan.detail}
                  </p>
                ) : null}

                {/* Divider */}
                <div className="my-6 border-t-2 border-line/20" />

                {/* Features */}
                <ul className="flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm font-semibold">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-line bg-accent">
                        <Check size={11} strokeWidth={3} />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={`/dashboard?plan=${plan.id}`}
                  className={`mt-8 inline-flex h-13 w-full items-center justify-center rounded-xl border-[3px] border-line font-heading text-base font-bold shadow-[0_4px_0_#000] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_6px_0_#000] ${
                    plan.popular
                      ? "bg-[#ff9ecd] hover:bg-[#ffb8da]"
                      : "bg-white hover:bg-accent/40"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing footnote */}
        <p className="mt-6 text-center font-dashboard text-xs font-semibold text-text-muted">
          No contracts. No revenue share. No hidden fees.
        </p>
        <p className="mt-1 text-center font-dashboard text-xs font-semibold text-text-muted">
          You keep 100% of every sale.
        </p>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-3xl px-5 pt-20 sm:px-8 sm:pt-28">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-4xl font-black sm:text-5xl">Questions?</h2>
          <p className="mt-3 text-base font-semibold text-text-muted">
            Everything you need to know about ReplaySell.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.q} className="group brutal-card bg-panel p-0">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 font-heading text-lg font-bold sm:text-xl [&::-webkit-details-marker]:hidden">
                <span className="leading-tight">{faq.q}</span>
                <span className="shrink-0 text-2xl transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="border-t-[3px] border-line px-6 py-5 text-sm font-semibold leading-relaxed text-text-muted">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 pt-20 sm:px-8 sm:pt-28">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-dashboard text-xs font-bold uppercase tracking-[0.12em] text-text-muted">
              Seller stories
            </p>
            <h2 className="mt-3 font-heading text-4xl font-black tracking-tight sm:text-5xl">
              Replay pages that keep selling
            </h2>
          </div>
          <p className="hidden text-sm font-semibold text-text-muted sm:block">
            Auto-scrolls continuously. Hover to pause.
          </p>
        </div>

        <div className="space-y-4 sm:hidden">
          {mobileTestimonials.map((item) => (
            <article
              key={`mobile-${item.name}-${item.metric}`}
              className="rounded-2xl border-[3px] border-line bg-panel p-5 shadow-[0_4px_0_#000]"
            >
              <div className="mb-3 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={`${item.name}-mobile-star-${index}`}
                    size={14}
                    className="text-[#ff6b5a]"
                    fill="currentColor"
                  />
                ))}
              </div>
              <p className="text-sm font-semibold leading-relaxed text-text-muted">
                &quot;{item.quote}&quot;
              </p>
              <div className="mt-4 border-t-2 border-line/20 pt-3">
                <p className="font-heading text-lg font-black">{item.name}</p>
                <p className="text-xs font-semibold text-text-muted">{item.role}</p>
                <div
                  className={`mt-2 inline-flex rounded-full border-2 border-line px-2.5 py-1 font-dashboard text-[10px] font-bold shadow-[0_2px_0_#000] ${item.tone}`}
                >
                  {item.metric}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="testimonial-marquee relative hidden overflow-hidden rounded-3xl border-[3px] border-line bg-panel-strong/40 p-3 sm:block sm:p-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-bg to-transparent sm:w-12" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-bg to-transparent sm:w-12" />
          <div className="testimonial-marquee-track">
            {loopingTestimonialColumns.map((column, columnIndex) => (
              <div
                key={`testimonial-column-${columnIndex}`}
                className="testimonial-column grid gap-4"
              >
                {column.map((item) => (
                  <article
                    key={`${item.name}-${item.metric}-${columnIndex}`}
                    className="rounded-2xl border-[3px] border-line bg-panel p-5 shadow-[0_4px_0_#000]"
                  >
                    <div className="mb-3 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={`${item.name}-star-${index}`}
                          size={14}
                          className="text-[#ff6b5a]"
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <p className="text-sm font-semibold leading-relaxed text-text-muted">
                      &quot;{item.quote}&quot;
                    </p>
                    <div className="mt-4 border-t-2 border-line/20 pt-3">
                      <p className="font-heading text-lg font-black">{item.name}</p>
                      <p className="text-xs font-semibold text-text-muted">{item.role}</p>
                      <div
                        className={`mt-2 inline-flex rounded-full border-2 border-line px-2.5 py-1 font-dashboard text-[10px] font-bold shadow-[0_2px_0_#000] ${item.tone}`}
                      >
                        {item.metric}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 pt-20 sm:px-8 sm:pt-28">
        <div className="brutal-card overflow-hidden bg-accent-amber p-10 text-center sm:p-14">
          <h2 className="mx-auto max-w-2xl font-heading text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Your next live deserves a storefront
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base font-semibold text-text-muted sm:text-lg">
            Paste your replay link, add products, and start selling in under 2 minutes.
            No integrations. No code. No Shopify.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="brutal-btn-primary inline-flex h-14 items-center justify-center gap-2 px-8 font-heading text-lg"
            >
              Generate My Replay Page
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="mx-auto mt-20 w-full max-w-6xl rounded-t-[32px] border-x-[3px] border-t-[3px] border-line bg-[#ff6b5a] px-8 pb-8 pt-12 sm:px-10">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border-[3px] border-[#2f201f] bg-[#ffbc8c] shadow-[0_3px_0_#2f201f]">
                <Package size={18} />
              </div>
              <p className="font-heading text-2xl font-black">ReplaySell</p>
            </div>
            <p className="mt-4 max-w-sm text-sm font-semibold leading-relaxed text-[#2f201f]">
              Turn your live shopping replays into shoppable storefronts. Paste a link, add products,
              and start selling in minutes.
            </p>
          </div>
          <div>
            <p className="font-heading text-lg font-bold">Product</p>
            <ul className="mt-3 space-y-2 text-sm font-semibold text-[#2f201f]">
              <li>
                <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:underline">Pricing</Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:underline">Buyer Login</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-heading text-lg font-bold">Legal</p>
            <ul className="mt-3 space-y-2 text-sm font-semibold text-[#2f201f]">
              <li>
                <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">Terms of Service</Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:underline">Cookie Policy</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-heading text-lg font-bold">Contact</p>
            <ul className="mt-3 space-y-2 text-sm font-semibold text-[#2f201f]">
              <li>support@replaysell.com</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t-2 border-[#2f201f] pt-5 text-sm font-semibold text-[#2f201f]">
          &copy; {new Date().getFullYear()} ReplaySell. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Local components                                                   */
/* ------------------------------------------------------------------ */

function MockProduct({
  name,
  price,
  stock,
  inStock,
}: {
  name: string;
  price: string;
  stock: string;
  inStock: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border-[3px] border-line p-3 shadow-[0_2px_0_#000] ${
        inStock ? "bg-white" : "bg-panel-strong opacity-60"
      }`}
    >
      <div className="min-w-0">
        <p className="font-heading text-sm font-extrabold leading-tight">{name}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-heading text-sm font-black">{price}</span>
          <span
            className={`rounded-full border-[1.5px] border-line px-2 py-0.5 font-dashboard text-[9px] font-bold ${
              inStock ? "bg-accent" : "bg-panel-strong"
            }`}
          >
            {stock}
          </span>
        </div>
      </div>
      {inStock ? (
        <div className="shrink-0 rounded-lg border-2 border-line bg-[#ff9ecd] px-3 py-1.5 font-dashboard text-[10px] font-bold shadow-[0_2px_0_#000]">
          Buy now
        </div>
      ) : null}
    </div>
  );
}
