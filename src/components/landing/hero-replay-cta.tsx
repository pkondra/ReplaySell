"use client";

import { useMutation } from "convex/react";
import { ArrowRight, Link2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { api } from "@convex/_generated/api";
import { useToast } from "@/components/ui/toast-provider";
import { validateReplayUrl } from "@/lib/embed";

export function HeroReplayCta() {
  const router = useRouter();
  const toast = useToast();
  const { status } = useSession();
  const isSignedIn = status === "authenticated";
  const createReplay = useMutation(api.replays.createReplay);
  const [url, setUrl] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const check = validateReplayUrl(url);
    if (!check.valid || !check.parsed) {
      toast.error(check.message ?? "Enter a valid replay URL.");
      return;
    }

    const normalizedUrl = check.parsed.normalizedUrl;
    const sellerOnboardingPath = `/dashboard?plan=starter&url=${encodeURIComponent(normalizedUrl)}`;
    setPending(true);

    try {
      if (!isSignedIn) {
        router.push(`/sign-up?next=${encodeURIComponent(sellerOnboardingPath)}`);
        return;
      }

      const replayId = await createReplay({ url: normalizedUrl });
      toast.success("Replay created. Add products next.");
      router.push(`/dashboard/replays/${replayId}`);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message.replace(
              /^(\[CONVEX [^\]]+\]\s*)?Uncaught Error:\s*/i,
              "",
            )
          : "Could not start your replay. Try again.";

      if (message.toLowerCase().includes("seller subscription required")) {
        router.push(sellerOnboardingPath);
        return;
      }

      toast.error(message || "Could not start your replay. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-8 max-w-lg">
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex h-14 flex-1 items-center overflow-hidden rounded-xl border-2 border-line bg-[#fcfaf7] shadow-[0_3px_0_#000] transition-all focus-within:-translate-y-0.5 focus-within:shadow-[0_4px_0_#000]">
            <div className="flex h-full w-11 shrink-0 items-center justify-center border-r-2 border-line bg-white text-text-muted">
              <Link2 size={16} />
            </div>
            <input
              type="url"
              inputMode="url"
              autoComplete="url"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="Paste your TikTok / IG / FB replay link"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="h-full w-full border-0 bg-transparent px-3 text-base font-semibold text-text outline-none placeholder:text-[rgba(26,26,26,0.5)]"
              required
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="brutal-btn-primary inline-flex h-14 shrink-0 items-center justify-center gap-2 px-6 font-heading text-base disabled:cursor-not-allowed disabled:opacity-70 sm:px-8"
          >
            {pending ? "Starting..." : "Start in 2 minutes"}
            {!pending ? <ArrowRight size={16} /> : null}
          </button>
        </div>
      </form>

      <div className="mt-3 grid gap-2 text-xs font-bold sm:grid-cols-3">
        <div className="rounded-lg border-2 border-line bg-white px-3 py-2 shadow-[0_2px_0_#000]">
          1. Paste your replay link
        </div>
        <div className="rounded-lg border-2 border-line bg-white px-3 py-2 shadow-[0_2px_0_#000]">
          2. Add your products
        </div>
        <div className="rounded-lg border-2 border-line bg-white px-3 py-2 shadow-[0_2px_0_#000]">
          3. Get paid
        </div>
      </div>

      <p className="mt-3 font-dashboard text-xs font-semibold text-text-muted">
        Post your replay link on Instagram, TikTok bio, stories, WhatsApp, or Facebook and keep selling after the
        live.
      </p>
    </div>
  );
}
