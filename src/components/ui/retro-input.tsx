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
        "brutal-input",
        className,
      )}
      {...props}
    />
  );
});

RetroInput.displayName = "RetroInput";
