import { ArrowLeft, SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-[3px] border-line bg-accent-amber shadow-[0_6px_0_#000]">
          <SearchX size={36} />
        </div>

        {/* Error code */}
        <p className="font-dashboard text-sm font-bold uppercase tracking-[0.12em] text-text-muted">
          Error 404
        </p>

        {/* Heading */}
        <h1 className="mt-3 font-heading text-5xl font-black tracking-tight sm:text-6xl">
          Page not found
        </h1>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-sm text-base font-semibold leading-relaxed text-text-muted">
          The page you&apos;re looking for doesn&apos;t exist, was moved, or the URL might be wrong.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="brutal-btn-primary inline-flex h-12 items-center gap-2 px-6 font-heading text-base"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
          <Link
            href="/dashboard"
            className="brutal-btn-secondary inline-flex h-12 items-center px-6 font-dashboard text-sm"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
