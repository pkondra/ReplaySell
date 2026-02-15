"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#fcfaf7] px-5 font-sans text-[#1a1a1a] antialiased">
        <div className="w-full max-w-lg text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-[3px] border-[#1a1a1a] bg-[#ff6b5a] shadow-[0_6px_0_#000]">
            <AlertTriangle size={36} />
          </div>

          {/* Error code */}
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[rgba(26,26,26,0.62)]">
            Error 500
          </p>

          {/* Heading */}
          <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-6xl">
            Something went wrong
          </h1>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-sm text-base font-semibold leading-relaxed text-[rgba(26,26,26,0.62)]">
            An unexpected error occurred. Our team has been notified. Please try again.
          </p>

          {error.digest && (
            <p className="mt-3 text-xs font-semibold text-[rgba(26,26,26,0.4)]">
              Error ID: {error.digest}
            </p>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-xl border-[3px] border-[#1a1a1a] bg-[#ff9ecd] px-6 text-base font-bold shadow-[0_6px_0_#000] transition-all hover:-translate-y-1 hover:shadow-[0_8px_0_#000]"
            >
              <RotateCcw size={16} />
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex h-12 items-center rounded-xl border-2 border-[#1a1a1a] bg-white px-6 text-sm font-bold shadow-[0_3px_0_#000]"
            >
              Back to home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
