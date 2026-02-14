import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border-2 border-line bg-accent-amber px-3 py-1 text-[11px] font-semibold text-text shadow-[0_2px_0_#000]",
        className,
      )}
      {...props}
    />
  );
}
