"use client";

import { useEffect } from "react";

import { RetroButton } from "@/components/ui/retro-button";
import { RetroCard } from "@/components/ui/retro-card";

export default function ReplayDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-8 sm:px-6">
      <RetroCard className="max-w-md space-y-3 text-center">
        <h2 className="text-xl font-semibold">Could not load replay</h2>
        <p className="text-sm text-text-muted">
          This replay may not exist for your account or you may have lost access.
        </p>
        <div className="flex justify-center">
          <RetroButton onClick={reset}>Try again</RetroButton>
        </div>
      </RetroCard>
    </main>
  );
}
