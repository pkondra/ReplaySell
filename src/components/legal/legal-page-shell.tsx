import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";

export function LegalPageShell({
  title,
  summary,
  lastUpdated,
  children,
}: {
  title: string;
  summary: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <nav className="border-b-[3px] border-line bg-panel">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-line bg-[#ffbc8c] shadow-[0_3px_0_#000]">
              <Package size={16} />
            </div>
            <p className="font-heading text-xl font-black leading-none sm:text-2xl">
              ReplaySell
            </p>
          </Link>
          <Link
            href="/"
            className="brutal-btn-secondary inline-flex h-10 items-center gap-2 px-4 font-dashboard text-xs"
          >
            <ArrowLeft size={13} />
            Home
          </Link>
        </div>
      </nav>

      <article className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-10">
          <p className="font-dashboard text-xs font-bold uppercase tracking-[0.12em] text-text-muted">
            Legal
          </p>
          <h1 className="mt-2 font-heading text-4xl font-black tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm font-semibold text-text-muted">
            Last updated: {lastUpdated}
          </p>
          <p className="mt-4 max-w-3xl rounded-2xl border-2 border-line bg-[#fff8e6] px-4 py-3 text-sm font-semibold leading-relaxed text-text-muted">
            {summary}
          </p>
        </div>

        <div className="legal-content space-y-8">{children}</div>
      </article>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border-[3px] border-line bg-white p-6 shadow-[0_4px_0_#000] sm:p-8">
      <h2 className="mb-4 font-heading text-2xl font-black tracking-tight">{title}</h2>
      <div className="space-y-3 text-sm font-semibold leading-relaxed text-text-muted [&_h4]:mt-4 [&_h4]:font-heading [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-text [&_li]:ml-4 [&_li]:list-disc [&_strong]:text-text [&_ul]:space-y-1.5">
        {children}
      </div>
    </section>
  );
}
