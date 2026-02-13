import * as React from "react";

import { cn } from "@/lib/utils";

export const RetroInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border border-line bg-bg px-3 text-sm text-text placeholder:text-text-muted/60 transition duration-150 focus-visible:border-accent/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/30",
        className,
      )}
      {...props}
    />
  );
});

RetroInput.displayName = "RetroInput";
