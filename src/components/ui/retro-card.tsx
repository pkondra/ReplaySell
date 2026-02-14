import * as React from "react";

import { cn } from "@/lib/utils";

export function RetroCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "brutal-card p-5",
        className,
      )}
      {...props}
    />
  );
}
