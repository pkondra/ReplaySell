import { RadioTower, Sparkles, Star } from "lucide-react";
import Link from "next/link";

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
    <main className="dashboard-layout relative min-h-screen overflow-hidden bg-[#fffaf0] px-4 py-8 sm:px-6 sm:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-12 h-52 w-52 rounded-full border-[3px] border-line bg-[#acf8e0]/70 blur-[1px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-20 h-60 w-60 rounded-full border-[3px] border-line bg-[#ff9ecd]/60 blur-[1px]"
      />

      <div className="mx-auto grid w-full max-w-5xl gap-6 rounded-[28px] border-[3px] border-line bg-panel p-5 shadow-[0_10px_0_#000] md:grid-cols-[1fr_1.1fr] md:p-8">
        <section className="relative overflow-hidden rounded-2xl border-[3px] border-line bg-[#f9e27f] p-6 shadow-[0_5px_0_#000] sm:p-7">
          <div className="absolute -right-7 -top-7 h-24 w-24 rounded-full border-[3px] border-line bg-white/70" />
          <div className="absolute bottom-4 right-5 flex items-center gap-1 text-text/70">
            <Star size={14} />
            <Sparkles size={14} />
          </div>

          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-line bg-white shadow-[0_3px_0_#000]">
              <RadioTower size={16} />
            </div>
            <div>
              <p className="font-heading text-2xl font-black leading-none">ReplaySell</p>
              <p className="font-dashboard text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
                Account
              </p>
            </div>
          </Link>

          <p className="mt-8 inline-flex items-center rounded-full border-2 border-line bg-white px-3 py-1 font-dashboard text-[10px] font-bold uppercase tracking-[0.1em] shadow-[0_2px_0_#000]">
            {badge}
          </p>
          <h1 className="mt-3 max-w-sm font-heading text-4xl font-black leading-[0.9] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-sm text-sm font-semibold leading-relaxed text-text-muted">
            {subtitle}
          </p>
        </section>

        <section className="rounded-2xl border-[3px] border-line bg-white p-5 shadow-[0_5px_0_#000] sm:p-7">
          {children}
        </section>
      </div>
    </main>
  );
}
