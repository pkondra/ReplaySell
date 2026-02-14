import {
  ArrowRight,
  Bell,
  CalendarClock,
  Check,
  CircleDollarSign,
  CreditCard,
  Mail,
  Package,
  Play,
  ShoppingBag,
  Store,
  UserRound,
  Zap,
} from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const steps = [
  {
    num: "01",
    title: "Go live, then replay",
    body: "Run your live shopping event on any platform. When it ends, import products and create a shoppable replay page in seconds.",
    color: "bg-accent",
    icon: Play,
  },
  {
    num: "02",
    title: "Buyers browse & buy",
    body: "Shoppers visit your replay storefront, see urgency timers, and checkout — all with their own account and order history.",
    color: "bg-[#ff9ecd]",
    icon: ShoppingBag,
  },
  {
    num: "03",
    title: "Alerts keep them coming back",
    body: "Buyers subscribe to price drops, stock changes, and closing-soon reminders — so you sell more, automatically.",
    color: "bg-accent-amber",
    icon: Bell,
  },
];

const features = [
  {
    title: "Replay storefronts with urgency",
    body: "Every replay page has a visible countdown timer, product cards with stock badges, and inventory callouts that drive action.",
    color: "bg-accent",
    icon: CalendarClock,
  },
  {
    title: "Full buyer accounts",
    body: "Buyers sign up, track orders, manage alert preferences, and see purchase history — all in one place.",
    color: "bg-[#ff9ecd]",
    icon: UserRound,
  },
  {
    title: "Smart notifications",
    body: "Timer reminders, price drops, restock alerts, and replay-close notices — sent automatically via email.",
    color: "bg-accent-amber",
    icon: Bell,
  },
  {
    title: "One-click checkout",
    body: "Powered by Stripe Connect. Buyers pay you directly — fast, secure, and familiar.",
    color: "bg-[#ffbc8c]",
    icon: CreditCard,
  },
  {
    title: "Seller dashboard",
    body: "Manage products, view analytics, track subscribers, and send campaigns from a single control panel.",
    color: "bg-[#b794f6]",
    icon: Store,
  },
  {
    title: "Built for speed",
    body: "Pages load instantly. No bloated plugins, no slow builders. Just fast, clean storefronts that convert.",
    color: "bg-[#ff6b5a]/20",
    icon: Zap,
  },
];

const faqs = [
  {
    q: "What exactly is a replay storefront?",
    a: "After a live shopping event ends, ReplaySell lets you turn that event into a standalone product page with timers, stock levels, and checkout — so people who missed the live can still buy.",
  },
  {
    q: "How do payments work?",
    a: "You subscribe to a fixed monthly seller plan via Stripe. Your buyers checkout through Stripe Connect Express, so payments go directly to your connected account.",
  },
  {
    q: "Do buyers need an account?",
    a: "Yes — buyers create a quick account so they can track orders, manage notification preferences, and see purchase history.",
  },
  {
    q: "How are notifications sent?",
    a: "Email notifications (timer reminders, price drops, stock alerts) are sent automatically via Resend. Buyers choose which alerts they want.",
  },
  {
    q: "Can I use this with any live platform?",
    a: "Yes. ReplaySell doesn't host your live — it turns the replay into a shoppable storefront afterward. Works with any platform you already use.",
  },
  {
    q: "Is there a free trial?",
    a: "We're launching soon. Join the waitlist to get early access and a special introductory rate.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <main className="page-fade-in min-h-screen">
      {/* ── Announcement banner ──────────────────────────────── */}
      <div className="border-b-[3px] border-line bg-[#b794f6] px-4 py-2.5 text-center font-dashboard text-sm font-semibold text-[#1a1a1a]">
        <span className="hidden sm:inline">
          Fixed monthly seller plan &middot; Buyer checkout powered by Stripe Connect &middot;{" "}
        </span>
        <span className="sm:hidden">Seller plans &amp; Stripe checkout live &middot; </span>
        <Link href="/sign-up" className="underline underline-offset-2 hover:no-underline">
          Get started free&nbsp;&rarr;
        </Link>
      </div>

      {/* ── Header ───────────────────────────────────────────── */}
      <header className="border-b-[3px] border-line bg-panel">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-[3px] border-line bg-[#ffbc8c] shadow-[0_4px_0_#000]">
              <Package size={20} />
            </div>
            <div>
              <p className="font-heading text-2xl font-black leading-none tracking-tight sm:text-3xl">
                ReplaySell
              </p>
              <p className="font-dashboard text-[11px] font-semibold text-text-muted">
                Live replay storefronts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="brutal-btn-secondary hidden h-11 items-center px-5 font-dashboard text-sm sm:inline-flex"
            >
              Dashboard
            </Link>
            <Link
              href="/sign-in"
              className="brutal-btn-primary inline-flex h-11 items-center px-5 font-dashboard text-sm"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="pb-8 pt-16 sm:pb-12 sm:pt-24 lg:pb-16 lg:pt-32">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-line bg-accent-amber px-4 py-2 shadow-[0_2px_0_#000]">
            <Store size={14} />
            <span className="font-dashboard text-xs font-bold uppercase tracking-[0.08em]">
              Turn replays into revenue
            </span>
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl font-heading text-[clamp(2.4rem,5.5vw,4.8rem)] font-black leading-[1.08] tracking-[-0.035em]">
            Your live shopping replay,
            <br className="hidden sm:block" />
            <span className="text-[#ff6b5a]"> now a storefront.</span>
          </h1>

          {/* Sub-headline */}
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-muted sm:text-xl sm:leading-relaxed">
            ReplaySell turns your live shopping replays into shoppable pages with countdown timers,
            buyer accounts, stock alerts, and Stripe checkout&nbsp;&mdash; so you keep selling long
            after the live ends.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/sign-up"
              className="brutal-btn-primary inline-flex h-14 items-center justify-center gap-2 px-8 font-heading text-lg"
            >
              Start selling
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/sign-in"
              className="brutal-btn-secondary inline-flex h-14 items-center justify-center px-8 font-dashboard text-base"
            >
              Buyer login
            </Link>
          </div>

          {/* Trust bullets */}
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {[
              "Fixed monthly fee — no commission",
              "Stripe-powered checkout",
              "Automatic buyer alerts",
              "Full order history",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-semibold">
                <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-line bg-accent">
                  <Check size={11} strokeWidth={3} />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hero visual ──────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="brutal-card overflow-hidden bg-panel p-0">
          <div className="grid lg:grid-cols-3">
            {/* Mock: Replay page */}
            <div className="border-b-[3px] border-line bg-accent/40 p-8 lg:border-b-0 lg:border-r-[3px]">
              <p className="font-dashboard text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
                Replay storefront
              </p>
              <div className="mt-5 space-y-3">
                <div className="rounded-xl border-[3px] border-line bg-white p-4 shadow-[0_3px_0_#000]">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-base font-extrabold">Summer Haul Collection</span>
                    <span className="rounded-full border-2 border-line bg-accent-amber px-2.5 py-0.5 font-dashboard text-[10px] font-bold shadow-[0_2px_0_#000]">
                      LIVE
                    </span>
                  </div>
                  <p className="mt-2 font-dashboard text-xs text-text-muted">12 products &middot; 3h 24m left</p>
                </div>
                <div className="rounded-xl border-[3px] border-line bg-white p-4 shadow-[0_3px_0_#000]">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-base font-extrabold">Flash Deals Friday</span>
                    <span className="rounded-full border-2 border-line bg-[#ff9ecd] px-2.5 py-0.5 font-dashboard text-[10px] font-bold shadow-[0_2px_0_#000]">
                      ENDED
                    </span>
                  </div>
                  <p className="mt-2 font-dashboard text-xs text-text-muted">8 products &middot; Closed</p>
                </div>
              </div>
            </div>

            {/* Mock: Buyer alerts */}
            <div className="border-b-[3px] border-line p-8 lg:border-b-0 lg:border-r-[3px]">
              <p className="font-dashboard text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
                Buyer alerts
              </p>
              <div className="mt-5 space-y-3">
                <AlertRow label="Replay closing soon" color="bg-accent-amber" />
                <AlertRow label="Price dropped" color="bg-[#ff9ecd]" />
                <AlertRow label="Back in stock" color="bg-accent" />
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-xl border-2 border-line bg-panel-strong px-3 py-2.5">
                <Mail size={14} className="text-text-muted" />
                <span className="font-dashboard text-xs text-text-muted">Sent via Resend</span>
              </div>
            </div>

            {/* Mock: Pricing summary */}
            <div className="p-8">
              <p className="font-dashboard text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
                Simple pricing
              </p>
              <div className="mt-5 space-y-3">
                <div className="rounded-xl border-[3px] border-line bg-accent p-5 shadow-[0_3px_0_#000]">
                  <p className="font-dashboard text-sm font-semibold text-text-muted">Seller plan</p>
                  <p className="mt-1 font-heading text-3xl font-black">
                    $49<span className="text-lg font-bold text-text-muted">/mo</span>
                  </p>
                  <p className="mt-1 text-xs font-semibold text-text-muted">Flat fee. No commission.</p>
                </div>
                <div className="rounded-xl border-[3px] border-line bg-[#ff9ecd] p-5 shadow-[0_3px_0_#000]">
                  <p className="font-dashboard text-sm font-semibold text-text-muted">Buyer checkout</p>
                  <p className="mt-1 font-heading text-xl font-black">Stripe Connect</p>
                  <p className="mt-1 text-xs font-semibold text-text-muted">Payments go to you.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 pt-24 sm:px-8 sm:pt-32">
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
      <section className="mx-auto w-full max-w-6xl px-5 pt-24 sm:px-8 sm:pt-32">
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

      {/* ── Monetization model ───────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 pt-24 sm:px-8 sm:pt-32">
        <div className="brutal-card overflow-hidden bg-panel p-0">
          <div className="px-8 pb-2 pt-8 md:px-10 md:pt-10">
            <div className="flex items-center gap-3">
              <CircleDollarSign size={20} />
              <h2 className="font-heading text-3xl font-black sm:text-4xl">How you make money</h2>
            </div>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-text-muted">
              You pay a flat monthly fee. Your buyers pay you directly via Stripe Connect. No hidden
              fees, no per-transaction commissions from us.
            </p>
          </div>

          <div className="grid gap-0 md:grid-cols-2">
            <div className="border-t-[3px] border-line bg-accent/40 p-8 md:border-r-[3px] md:p-10">
              <p className="inline-flex items-center gap-2 rounded-full border-2 border-line bg-white px-3 py-1 font-dashboard text-xs font-bold shadow-[0_2px_0_#000]">
                <Store size={12} /> Seller
              </p>
              <h3 className="mt-5 font-heading text-2xl font-extrabold">$49/month flat</h3>
              <ul className="mt-4 space-y-2">
                {[
                  "Unlimited replay storefronts",
                  "Product management & imports",
                  "Subscriber capture & campaigns",
                  "Full analytics dashboard",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-semibold">
                    <Check size={14} className="mt-0.5 shrink-0 text-[#1a1a1a]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t-[3px] border-line bg-[#ffbc8c]/40 p-8 md:p-10">
              <p className="inline-flex items-center gap-2 rounded-full border-2 border-line bg-white px-3 py-1 font-dashboard text-xs font-bold shadow-[0_2px_0_#000]">
                <UserRound size={12} /> Buyer
              </p>
              <h3 className="mt-5 font-heading text-2xl font-extrabold">Free to sign up</h3>
              <ul className="mt-4 space-y-2">
                {[
                  "Browse & buy from replay pages",
                  "Stripe-powered secure checkout",
                  "Order history & tracking",
                  "Customizable alert preferences",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-semibold">
                    <Check size={14} className="mt-0.5 shrink-0 text-[#1a1a1a]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-3xl px-5 pt-24 sm:px-8 sm:pt-32">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-4xl font-black sm:text-5xl">Questions?</h2>
          <p className="mt-3 text-base font-semibold text-text-muted">
            Everything you need to know about ReplaySell.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.q} className="group brutal-card bg-panel p-0">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 font-heading text-lg font-bold sm:text-xl">
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

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 pt-24 sm:px-8 sm:pt-32">
        <div className="brutal-card bg-accent-amber p-10 text-center sm:p-14">
          <h2 className="mx-auto max-w-2xl font-heading text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Ready to turn replays into revenue?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base font-semibold text-text-muted sm:text-lg">
            Set up your first replay storefront in minutes. Fixed pricing, no surprises.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="brutal-btn-primary inline-flex h-14 items-center justify-center gap-2 px-8 font-heading text-lg"
            >
              Start selling
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/sign-in"
              className="brutal-btn-secondary inline-flex h-14 items-center justify-center px-8 font-dashboard text-base"
            >
              Buyer login
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="mx-auto mt-20 w-full max-w-6xl rounded-t-[32px] border-x-[3px] border-t-[3px] border-line bg-[#ff6b5a] px-8 pb-8 pt-12 sm:px-10">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border-[3px] border-[#2f201f] bg-[#ffbc8c] shadow-[0_3px_0_#2f201f]">
                <Package size={18} />
              </div>
              <p className="font-heading text-2xl font-black">ReplaySell</p>
            </div>
            <p className="mt-4 max-w-sm text-sm font-semibold leading-relaxed text-[#2f201f]">
              Turn your live shopping replays into shoppable storefronts. Manage products, capture buyers,
              send alerts, and track everything from one dashboard.
            </p>
          </div>
          <div>
            <p className="font-heading text-lg font-bold">Product</p>
            <ul className="mt-3 space-y-2 text-sm font-semibold text-[#2f201f]">
              <li>
                <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:underline">Seller Plan</Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:underline">Buyer Login</Link>
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

function AlertRow({ label, color }: { label: string; color: string }) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border-[3px] border-line px-4 py-3 shadow-[0_2px_0_#000] ${color}`}
    >
      <span className="font-dashboard text-sm font-bold">{label}</span>
      <span className="rounded-full border-2 border-line bg-white px-2.5 py-0.5 text-xs font-bold shadow-[0_2px_0_#000]">
        ON
      </span>
    </div>
  );
}
