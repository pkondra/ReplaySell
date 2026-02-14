"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-[3px] border-line bg-[#ff6b5a]/20 shadow-[0_6px_0_#000]">
          <AlertTriangle size={36} />
        </div>

        {/* Error code */}
        <p className="font-dashboard text-sm font-bold uppercase tracking-[0.12em] text-text-muted">
          Something went wrong
        </p>

        {/* Heading */}
        <h1 className="mt-3 font-heading text-5xl font-black tracking-tight sm:text-6xl">
          Unexpected error
        </h1>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-sm text-base font-semibold leading-relaxed text-text-muted">
          Something broke on our end. Please try again — if the problem persists, contact support.
        </p>

        {error.digest && (
          <p className="mt-3 font-dashboard text-xs font-semibold text-text-muted/60">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="brutal-btn-primary inline-flex h-12 cursor-pointer items-center gap-2 px-6 font-heading text-base"
          >
            <RotateCcw size={16} />
            Try again
          </button>
          <Link
            href="/"
            className="brutal-btn-secondary inline-flex h-12 items-center px-6 font-dashboard text-sm"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
