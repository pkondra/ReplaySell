import {
  Bell,
  CalendarClock,
  ChartNoAxesCombined,
  Check,
  CircleDollarSign,
  Mail,
  Package,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";

const featureCards = [
  {
    title: "Replay pages with urgency",
    body: "Turn every live into a replay storefront with a visible timer, product cards, and inventory callouts.",
    color: "bg-accent",
    icon: CalendarClock,
  },
  {
    title: "Buyer accounts + history",
    body: "Buyers are prompted to sign up, then they can log in and see purchase history, alerts, and tracking.",
    color: "bg-[#ff9ecd]",
    icon: UserRound,
  },
  {
    title: "Price and stock alerts",
    body: "Let buyers subscribe for timer reminders, price drops, stock changes, and replay-close notices.",
    color: "bg-accent-amber",
    icon: Bell,
  },
];

const faqs = [
  {
    q: "How will payments work?",
    a: "Seller subscriptions use Stripe Billing monthly plans on the platform. Buyer checkout uses Stripe Connect Express with destination charges.",
  },
  {
    q: "Do buyers need an account?",
    a: "Yes. Buyers are prompted to create an account before purchase so they can track orders and notification preferences.",
  },
  {
    q: "How are emails sent?",
    a: "We use Resend for transactional messaging from noreply@hello.ringreceptionist.com.",
  },
  {
    q: "Is this light mode only?",
    a: "Yes. The current design system intentionally ships light mode only.",
  },
];

export default function HomePage() {
  return (
    <main className="page-fade-in min-h-screen pb-16">
      <div className="border-b-[3px] border-line bg-[#b794f6] px-4 py-2 text-center font-dashboard text-sm font-semibold text-[#1a1a1a]">
        Seller Pro Plan - Fixed Monthly Fee · Buyer Checkout via Stripe Connect
      </div>

      <header className="border-b-[3px] border-line bg-panel">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-[3px] border-line bg-[#ffbc8c] shadow-[0_4px_0_#000]">
              <Package size={20} />
            </div>
            <div>
              <p className="font-heading text-3xl font-black leading-none tracking-tight">ReplaySell</p>
              <p className="font-dashboard text-xs font-semibold text-text-muted">
                Shoppable replay storefronts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="brutal-btn-secondary inline-flex h-11 items-center px-5 font-dashboard text-sm"
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

      <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24 lg:pt-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-line bg-accent-amber px-4 py-2 shadow-[0_2px_0_#000]">
            <ShieldCheck size={14} />
            <span className="font-dashboard text-xs font-bold uppercase tracking-[0.08em]">
              Light mode neo-brutalist system
            </span>
          </div>

          <h1 className="max-w-3xl font-heading text-[clamp(2.5rem,6vw,5.2rem)] font-black leading-[1.05] tracking-[-0.04em]">
            Monetize your replay window in one place.
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-text-muted">
            Sellers pay one fixed monthly fee. Buyers can subscribe to your replay page for timer alerts,
            stock updates, and price change notifications, then buy with a full account + history flow.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/sign-up"
              className="brutal-btn-primary inline-flex h-14 items-center justify-center px-8 font-heading text-lg"
            >
              Start Seller Plan
            </Link>
            <Link
              href="/sign-in"
              className="brutal-btn-secondary inline-flex h-14 items-center justify-center px-8 font-dashboard text-base"
            >
              Buyer Login
            </Link>
          </div>

          <div className="grid gap-2 pt-2 sm:grid-cols-2">
            {[
              "Stripe Billing for seller monthly plan",
              "Stripe Connect Express for buyer checkout",
              "Buyer accounts with order history",
              "Resend notifications from noreply@hello.ringreceptionist.com",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-semibold">
                <Check size={14} className="text-[#1fe2c3]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="brutal-card space-y-5 bg-panel p-6 lg:ml-4">
          <div className="flex items-center justify-between">
            <p className="font-dashboard text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
              Buyer Alert Preferences
            </p>
            <span className="rounded-full border-2 border-line bg-accent px-3 py-1 text-xs font-bold shadow-[0_2px_0_#000]">
              LIVE
            </span>
          </div>

          <div className="space-y-3 rounded-xl border-[3px] border-line bg-panel-strong p-4 shadow-[0_4px_0_#000]">
            <AlertRow label="Replay closing timer" color="bg-accent-amber" />
            <AlertRow label="Stock changed" color="bg-[#ff9ecd]" />
            <AlertRow label="Price changed" color="bg-accent" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border-[3px] border-line bg-accent p-4 shadow-[0_4px_0_#000]">
              <p className="font-dashboard text-sm font-semibold text-text-muted">Monthly seller plan</p>
              <p className="mt-1 font-heading text-3xl font-black">$49/mo</p>
            </div>
            <div className="rounded-xl border-[3px] border-line bg-[#ff9ecd] p-4 shadow-[0_4px_0_#000]">
              <p className="font-dashboard text-sm font-semibold text-text-muted">Buyer checkout</p>
              <p className="mt-1 font-heading text-xl font-black">Stripe Connect</p>
            </div>
          </div>

          <div className="rounded-xl border-[2px] border-line bg-white p-4 shadow-[0_3px_0_#000]">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Mail size={14} />
              Sending with Resend
            </div>
            <p className="mt-1 font-dashboard text-sm text-text-muted">From: noreply@hello.ringreceptionist.com</p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {featureCards.map((card) => (
            <article
              key={card.title}
              className={`rounded-2xl border-[3px] border-line ${card.color} p-6 shadow-[0_4px_0_#000] transition-all duration-200 hover:-translate-y-1 hover:rotate-[-1deg] hover:shadow-[0_8px_0_#000]`}
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-line bg-white shadow-[0_2px_0_#000]">
                <card.icon size={18} />
              </div>
              <h2 className="font-heading text-2xl font-extrabold tracking-tight">{card.title}</h2>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-text-muted">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-6xl px-4 sm:px-6">
        <div className="brutal-card bg-panel p-6 md:p-8">
          <div className="mb-6 flex items-center gap-2">
            <CircleDollarSign size={18} />
            <h2 className="font-heading text-3xl font-black">Monetization + Notification Model</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border-[3px] border-line bg-accent p-5 shadow-[0_4px_0_#000]">
              <p className="font-heading text-xl font-extrabold">Seller side</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed">
                Seller subscribes monthly (fixed fee), gets replay storefront tools, product management,
                subscriber capture, and campaign sending.
              </p>
            </div>
            <div className="rounded-xl border-[3px] border-line bg-[#ffbc8c] p-5 shadow-[0_4px_0_#000]">
              <p className="font-heading text-xl font-extrabold">Buyer side</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed">
                Buyer signs up, purchases through connected seller account, and can later view purchase history,
                receipts, and page-alert settings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-6xl px-4 sm:px-6">
        <h2 className="mb-5 text-center font-heading text-4xl font-black">Frequently Asked Questions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <details key={faq.q} className="group brutal-card bg-panel p-0">
              <summary className="flex cursor-pointer items-center justify-between px-6 py-5 font-heading text-2xl font-bold">
                <span className="text-[1.15rem] leading-tight">{faq.q}</span>
                <span className="text-2xl">+</span>
              </summary>
              <p className="border-t-[3px] border-line px-6 py-4 text-sm font-semibold leading-relaxed text-text-muted">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <footer className="mx-auto mt-16 w-full max-w-6xl rounded-t-[32px] border-x-[3px] border-t-[3px] border-line bg-[#ff6b5a] px-6 pb-8 pt-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-heading text-2xl font-black">ReplaySell</p>
            <p className="mt-2 max-w-md text-sm font-semibold text-[#2f201f]">
              Manage replay pages, recurring seller revenue, buyer alerts, and order history from one place.
            </p>
          </div>
          <div>
            <p className="font-heading text-lg font-bold">Product</p>
            <ul className="mt-2 space-y-1 text-sm font-semibold text-[#2f201f]">
              <li>Dashboard</li>
              <li>Buyer Accounts</li>
              <li>Alerts</li>
            </ul>
          </div>
          <div>
            <p className="font-heading text-lg font-bold">Contact</p>
            <ul className="mt-2 space-y-1 text-sm font-semibold text-[#2f201f]">
              <li>support@replaysell.com</li>
              <li>noreply@hello.ringreceptionist.com</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t-2 border-[#2f201f] pt-4 text-sm font-semibold text-[#2f201f]">
          © 2026 ReplaySell. All rights reserved.
        </div>
      </footer>

      <section className="mx-auto mt-10 w-full max-w-6xl px-4 sm:px-6">
        <div className="brutal-card bg-panel p-6 text-center">
          <h2 className="font-heading text-3xl font-black">Seller Analytics + Buyer History in One Dashboard</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold text-text-muted">
            The dashboard now includes seller metrics and buyer purchase tracking so both sides of the replay funnel are visible.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-line bg-accent-amber px-4 py-2 shadow-[0_2px_0_#000]">
            <ChartNoAxesCombined size={14} />
            <span className="font-dashboard text-xs font-bold uppercase tracking-[0.1em]">
              Built for conversion and retention
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

function AlertRow({ label, color }: { label: string; color: string }) {
  return (
    <div className={`flex items-center justify-between rounded-xl border-2 border-line px-3 py-2 shadow-[0_2px_0_#000] ${color}`}>
      <span className="font-dashboard text-sm font-bold">{label}</span>
      <span className="rounded-full border-2 border-line bg-white px-2 py-0.5 text-xs font-bold shadow-[0_2px_0_#000]">
        ON
      </span>
    </div>
  );
}
