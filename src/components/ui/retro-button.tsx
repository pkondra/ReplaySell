import * as React from "react";

import { cn } from "@/lib/utils";

type RetroButtonVariant = "accent" | "ghost";

type RetroButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: RetroButtonVariant;
};

const styles: Record<RetroButtonVariant, string> = {
  accent:
    "border-accent bg-accent text-bg-strong font-semibold hover:brightness-110 disabled:opacity-50",
  ghost:
    "border-line bg-panel-strong text-text hover:bg-line disabled:opacity-40",
};

export const RetroButton = React.forwardRef<HTMLButtonElement, RetroButtonProps>(
  ({ className, variant = "accent", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border px-4 text-sm tracking-tight transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed",
          styles[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

RetroButton.displayName = "RetroButton";
