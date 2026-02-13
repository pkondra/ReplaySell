export function LoadingDots() {
  return (
    <span className="inline-flex items-end gap-0.5" aria-hidden="true">
      <span className="h-1 w-1 animate-pulse rounded-full bg-current" />
      <span
        className="h-1 w-1 animate-pulse rounded-full bg-current"
        style={{ animationDelay: "0.2s" }}
      />
      <span
        className="h-1 w-1 animate-pulse rounded-full bg-current"
        style={{ animationDelay: "0.4s" }}
      />
    </span>
  );
}
