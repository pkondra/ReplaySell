import * as React from "react";

import { cn } from "@/lib/utils";

type RetroButtonVariant = "accent" | "ghost";

type RetroButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: RetroButtonVariant;
};

const styles: Record<RetroButtonVariant, string> = {
  accent:
    "brutal-btn-primary disabled:cursor-not-allowed disabled:opacity-55",
  ghost:
    "brutal-btn-secondary disabled:cursor-not-allowed disabled:opacity-55",
};

export const RetroButton = React.forwardRef<HTMLButtonElement, RetroButtonProps>(
  ({ className, variant = "accent", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex h-11 cursor-pointer items-center justify-center gap-2 px-4 text-sm uppercase tracking-[0.02em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed",
          styles[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

RetroButton.displayName = "RetroButton";
