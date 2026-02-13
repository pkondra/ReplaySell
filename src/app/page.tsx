import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Mail,
  Play,
  RadioTower,
  Send,
  ShoppingBag,
  Smartphone,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

const mockProducts = [
  { name: "Gold Hoop Earrings", price: 45, stock: 12 },
  { name: "Chunky Chain Necklace", price: 65, stock: 5 },
  { name: "\u201cMystery Bag\u201d Bundle", price: 39, stock: 20 },
];

const steps = [
  {
    n: "01",
    icon: Play,
    title: "Go live & sell",
    desc: "Run your TikTok, Instagram, or Whatnot live as usual. Sell your products to your audience.",
  },
  {
    n: "02",
    icon: ShoppingBag,
    title: "We build your replay page",
    desc: "Paste your replay link and add products into ReplaySell. We generate a shoppable page with a countdown timer.",
  },
  {
    n: "03",
    icon: Users,
    title: "Capture sales & subscribers",
    desc: "Viewers enter email + optional phone, browse remaining products, and buy. You build your list automatically.",
  },
];

const features = [
  {
    icon: ShoppingBag,
    title: "Shoppable replay pages",
    desc: "A branded page with your replay video, product listings, and checkout \u2014 live for 24\u201372 hours.",
  },
  {
    icon: Mail,
    title: "Email + SMS capture",
    desc: "Require email to view. Optionally capture phone with SMS consent. Build your subscriber list from every replay.",
  },
  {
    icon: Clock,
    title: "Countdown urgency",
    desc: "A visible countdown timer on every replay page drives urgency and pushes viewers to buy before time runs out.",
  },
  {
    icon: Send,
    title: "Campaign sending",
    desc: "Send simple campaigns to your subscriber list \u2014 \u201cReplay is live\u201d, \u201cOnly X left\u201d, \u201cCloses in 6 hours\u201d.",
  },
  {
    icon: Smartphone,
    title: "Works with TikTok, IG, Whatnot",
    desc: "Paste any replay link. No platform integrations, no API keys, no code needed.",
  },
  {
    icon: Zap,
    title: "Launch in minutes",
    desc: "Go from live replay to shoppable page in under 5 minutes. No technical setup required.",
  },
];

const faqs = [
  {
    q: "What platforms does ReplaySell work with?",
    a: "TikTok, Instagram Live, and Whatnot. Just paste your replay link \u2014 no integrations or API keys needed.",
  },
  {
    q: "How does the email/SMS capture work?",
    a: "Viewers must enter their email to access the replay page. Phone number with SMS consent is optional. All subscribers are saved to your dashboard.",
  },
  {
    q: "Can I send campaigns to my subscribers?",
    a: "Yes. From your dashboard you can send simple messages like \u201cReplay is live now\u201d, \u201cOnly X items left\u201d, or \u201cReplay closes in 6 hours\u201d to your subscriber list.",
  },
  {
    q: "How long does the replay page stay live?",
    a: "You choose \u2014 24, 48, or 72 hours. The countdown timer is visible to viewers the entire time.",
  },
  {
    q: "Do I need to connect Stripe or a payment processor?",
    a: "Not yet. We\u2019re rolling out integrated checkout soon. For now, you can link to your existing checkout or DM-based flow.",
  },
];

const proFeatures = [
  "Unlimited replay pages",
  "Email + SMS capture",
  "Advanced countdown & urgency",
  "Campaign sending",
  "Subscriber management",
  "Priority support",
];

export default function HomePage() {
  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-line/60 bg-bg/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <RadioTower size={18} className="text-accent" />
            <span className="text-sm font-bold tracking-tight">ReplaySell</span>
          </div>
          <div className="hidden items-center gap-6 text-sm text-text-muted md:flex">
            <a href="#how-it-works" className="transition-colors hover:text-text">How it works</a>
            <a href="#pricing" className="transition-colors hover:text-text">Pricing</a>
            <a href="#faq" className="transition-colors hover:text-text">FAQ</a>
          </div>
          <Link
            href="/sign-up"
            className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-bg-strong transition hover:brightness-110"
          >
            Get early access
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-7 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3.5 py-1.5 text-xs font-medium text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Works with TikTok, Instagram, Whatnot (no integrations needed)
            </div>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              Your live ends.
              <br />
              Your sales shouldn&apos;t.
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-text-muted sm:text-[17px]">
              ReplaySell turns your live replay into a{" "}
              <span className="font-medium text-text">24–72 hour sales window</span> with a
              shoppable replay page, email/phone capture, and urgency that drives
              extra orders.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/sign-up"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-bg-strong transition hover:brightness-110"
              >
                Turn my last live into sales
              </Link>
              <a
                href="#pricing"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-line px-5 text-sm font-medium text-text transition-colors hover:bg-panel-strong"
              >
                See pricing
              </a>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
              {["Replay page on your link", "Email + optional SMS capture", "Countdown urgency"].map((f) => (
                <span key={f} className="flex items-center gap-1.5 text-sm text-text-muted">
                  <Check size={14} className="text-accent" />
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="animate-fade-in-delayed rounded-xl border border-line bg-panel p-1.5 shadow-2xl shadow-accent-purple/5">
            <div className="flex items-center justify-between rounded-t-lg bg-panel-strong px-4 py-2.5">
              <span className="font-mono text-xs text-text-muted">replaysell.com/yourstore/live</span>
              <span className="rounded-full bg-accent-purple/20 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-accent-purple">
                LIVE
              </span>
            </div>

            <div className="space-y-3 p-4">
              <div className="flex aspect-video items-center justify-center rounded-lg border border-line bg-gradient-to-br from-accent-purple/15 via-accent-purple/5 to-transparent">
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Play size={16} />
                  Replay video embed
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-accent-amber/20 to-accent-purple/20 px-4 py-2.5">
                <span className="text-sm font-medium text-text">Replay closes in</span>
                <span className="font-mono text-sm font-bold tabular-nums text-text">26:19:27</span>
              </div>

              <div className="space-y-2">
                {mockProducts.map((p) => (
                  <div key={p.name} className="flex items-center justify-between rounded-lg border border-line bg-bg px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-text">{p.name}</p>
                      <p className="text-xs text-text-muted">${p.price} &middot; {p.stock} left</p>
                    </div>
                    <span className="rounded-md border border-accent-purple/30 bg-accent-purple/10 px-3 py-1 text-xs font-semibold text-accent-purple">
                      Buy
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
          <div className="mb-14 max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
            <p className="mt-3 text-text-muted">Three steps. No integrations. No code.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="space-y-4 rounded-xl border border-line bg-panel p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <s.icon size={16} />
                  </span>
                  <span className="font-mono text-xs text-text-muted">{s.n}</span>
                </div>
                <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
          <div className="mb-14 max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to sell from replays</h2>
            <p className="mt-3 text-text-muted">No complex setup. No monthly contracts. Just more sales.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="space-y-3 rounded-xl border border-line bg-panel p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-purple/10 text-accent-purple">
                  <f.icon size={16} />
                </span>
                <h3 className="font-semibold tracking-tight">{f.title}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple pricing</h2>
            <p className="mt-3 text-text-muted">Start free during early access. No credit card required.</p>
          </div>

          <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
            <div className="space-y-5 rounded-xl border border-line bg-panel p-7">
              <div>
                <p className="text-sm font-medium text-text-muted">Starter</p>
                <p className="mt-1 text-3xl font-bold tracking-tight">Free</p>
                <p className="mt-1 text-sm text-text-muted">During early access</p>
              </div>
              <ul className="space-y-2.5">
                {["Up to 5 replay pages / month", "Email capture", "Countdown timer", "Basic campaigns"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text-muted">
                    <Check size={14} className="mt-0.5 shrink-0 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="flex h-10 items-center justify-center rounded-lg border border-line text-sm font-semibold text-text transition-colors hover:bg-panel-strong"
              >
                Get started free
              </Link>
            </div>

            <div className="space-y-5 rounded-xl border border-accent-purple/40 bg-panel p-7 ring-1 ring-accent-purple/10">
              <div>
                <span className="mb-2 inline-flex rounded-full bg-accent-purple/15 px-2.5 py-0.5 text-[11px] font-bold text-accent-purple">
                  POPULAR
                </span>
                <p className="text-sm font-medium text-text-muted">Pro</p>
                <p className="mt-1 text-3xl font-bold tracking-tight">
                  $29<span className="text-lg font-normal text-text-muted">/mo</span>
                </p>
                <p className="mt-1 text-sm text-text-muted">When we launch</p>
              </div>
              <ul className="space-y-2.5">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text-muted">
                    <Check size={14} className="mt-0.5 shrink-0 text-accent-purple" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="flex h-10 items-center justify-center rounded-lg bg-accent-purple text-sm font-semibold text-white transition hover:brightness-110"
              >
                Join waitlist
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-line">
        <div className="mx-auto max-w-3xl px-6 py-20 lg:py-24">
          <h2 className="mb-10 text-3xl font-bold tracking-tight sm:text-4xl">FAQ</h2>
          <div className="divide-y divide-line">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between text-[15px] font-medium text-text">
                  {faq.q}
                  <ChevronDown size={16} className="shrink-0 text-text-muted transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center lg:py-28">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Stop losing sales when the live ends.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-text-muted">
            Join sellers who are turning replay viewers into buyers with ReplaySell.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-6 text-sm font-semibold text-bg-strong transition hover:brightness-110"
            >
              Get early access
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <RadioTower size={14} className="text-accent" />
            <span>&copy; 2026 ReplaySell</span>
          </div>
          <div className="flex gap-5 text-sm text-text-muted">
            <a href="#how-it-works" className="transition-colors hover:text-text">How it works</a>
            <a href="#pricing" className="transition-colors hover:text-text">Pricing</a>
            <a href="#faq" className="transition-colors hover:text-text">FAQ</a>
          </div>
        </div>
      </footer>
    </>
  );
}
