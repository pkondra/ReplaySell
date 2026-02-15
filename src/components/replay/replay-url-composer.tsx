"use client";

import { useEffect, useMemo, useState } from "react";

import { EmbedPreview } from "@/components/replay/embed-preview";
import { LoadingDots } from "@/components/ui/loading-dots";
import { RetroButton } from "@/components/ui/retro-button";
import { RetroInput } from "@/components/ui/retro-input";
import { validateReplayUrl } from "@/lib/embed";

type ReplayUrlComposerProps = {
  initialUrl?: string;
  submitLabel: string;
  pendingLabel?: string;
  onSubmit: (url: string) => Promise<void>;
};

export function ReplayUrlComposer({
  initialUrl = "",
  submitLabel,
  pendingLabel = "Working...",
  onSubmit,
}: ReplayUrlComposerProps) {
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setUrl(initialUrl);
  }, [initialUrl]);

  const helperText = useMemo(() => {
    const check = validateReplayUrl(url);
    if (!url.trim()) {
      return "Supports YouTube, TikTok, Vimeo, and Facebook embeds. Instagram & Whatnot as link cards.";
    }

    if (!check.valid) {
      return check.message ?? "Enter a valid URL.";
    }

    return "Looks good. Preview updates live below.";
  }, [url]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const check = validateReplayUrl(url);

    if (!check.valid || !check.parsed) {
      setError(check.message ?? "Enter a valid URL.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(check.parsed.normalizedUrl);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-2.5" noValidate>
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <RetroInput
            type="url"
            inputMode="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              if (error) {
                setError(null);
              }
            }}
            aria-invalid={Boolean(error)}
            aria-describedby="replay-url-helper"
            required
          />
          <RetroButton type="submit" disabled={isSubmitting} className="shrink-0 sm:w-40">
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                {pendingLabel}
                <LoadingDots />
              </span>
            ) : (
              submitLabel
            )}
          </RetroButton>
        </div>
        <p
          id="replay-url-helper"
          className={`text-xs ${error ? "text-accent-magenta" : "text-text-muted"}`}
        >
          {error ?? helperText}
        </p>
      </form>

      <EmbedPreview url={url} />
    </div>
  );
}
