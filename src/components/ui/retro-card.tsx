import * as React from "react";

import { cn } from "@/lib/utils";

export function RetroCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-panel p-5 transition-colors duration-150",
        className,
      )}
      {...props}
    />
  );
}
