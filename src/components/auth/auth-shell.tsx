import {
  CheckCircle2,
  RadioTower,
  ShoppingBag,
  Sparkles,
  Star,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";

const FEATURES = [
  { icon: Timer, text: "Countdown-gated replay storefronts" },
  { icon: ShoppingBag, text: "Stripe-powered buyer checkout" },
  { icon: TrendingUp, text: "Real-time analytics & stock alerts" },
  { icon: Zap, text: "Launch in under 2 minutes" },
];

export function AuthShell({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string;
  subtitle: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <main className="dashboard-layout relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffaf0] px-4 py-10 sm:px-6 sm:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-28 top-10 h-56 w-56 rounded-full border-[3px] border-line/20 bg-[#acf8e0]/50 blur-sm"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-16 h-64 w-64 rounded-full border-[3px] border-line/20 bg-[#ff9ecd]/40 blur-sm"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full border-[3px] border-line/10 bg-[#f9e27f]/30 blur-sm"
      />

      <div className="page-fade-in mx-auto grid w-full max-w-[58rem] gap-0 overflow-hidden rounded-[28px] border-[3px] border-line bg-panel shadow-[0_10px_0_#000] md:grid-cols-[1.05fr_1fr]">
        <section className="relative overflow-hidden bg-[#f9e27f] p-7 sm:p-9">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border-[3px] border-line/30 bg-white/50" />
          <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full border-[3px] border-line/20 bg-[#ff9ecd]/40" />

          <Link href="/" className="relative inline-flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-[3px] border-line bg-white shadow-[0_3px_0_#000]">
              <RadioTower size={17} />
            </div>
            <div>
              <p className="font-heading text-[1.6rem] font-black leading-none tracking-tight">
                ReplaySell
              </p>
              <p className="font-dashboard text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                Account
              </p>
            </div>
          </Link>

          <div className="mt-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-line bg-white px-3.5 py-1 font-dashboard text-[10px] font-bold uppercase tracking-[0.1em] shadow-[0_2px_0_#000]">
              <Sparkles size={11} />
              {badge}
            </span>

            <h1 className="mt-4 max-w-sm font-heading text-[2.6rem] font-black leading-[0.92] tracking-tight sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-sm text-[0.9rem] font-semibold leading-relaxed text-text-muted">
              {subtitle}
            </p>
          </div>

          <ul className="relative mt-8 space-y-3">
            {FEATURES.map((f) => (
              <li key={f.text} className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-line bg-white shadow-[0_2px_0_#000]">
                  <f.icon size={14} />
                </div>
                <span className="text-[0.8rem] font-semibold text-text/80">
                  {f.text}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center gap-2">
            <div className="flex -space-x-2">
              {[
                "bg-[#ff9ecd]",
                "bg-[#acf8e0]",
                "bg-[#ffbc8c]",
                "bg-[#b794f6]",
              ].map((bg, i) => (
                <div
                  key={i}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-line ${bg} text-[10px] font-black`}
                >
                  {["E", "M", "S", "K"][i]}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className="fill-text text-text"
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-text-muted">
              Loved by 2k+ sellers
            </span>
          </div>

          <div className="absolute bottom-5 right-6 flex items-center gap-1.5 text-text/30">
            <Star size={16} />
            <CheckCircle2 size={16} />
          </div>
        </section>

        <section className="flex flex-col justify-center bg-white p-6 sm:p-9">
          {children}
        </section>
      </div>
    </main>
  );
}
