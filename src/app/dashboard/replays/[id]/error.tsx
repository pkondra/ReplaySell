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
    <main className="dashboard-layout min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-center rounded-[24px] border-[3px] border-line bg-panel p-6 shadow-[0_8px_0_#000]">
      <RetroCard className="max-w-md space-y-3 text-center bg-white">
        <h2 className="font-heading text-3xl font-black">Could not load replay</h2>
        <p className="text-sm font-semibold text-text-muted">
          This replay may not exist for your account or you may have lost access.
        </p>
        <div className="flex justify-center">
          <RetroButton onClick={reset}>Try again</RetroButton>
        </div>
      </RetroCard>
      </div>
    </main>
  );
}
