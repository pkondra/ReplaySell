"use client";

import clsx from "clsx";
import { LogOut, UserRound } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

function getDisplayName({
  name,
  email,
}: {
  name?: string | null;
  email?: string | null;
}) {
  if (name && name.trim().length > 0) return name.trim();
  if (email && email.includes("@")) return email.split("@")[0];
  return "Account";
}

function getInitials({
  name,
  email,
}: {
  name?: string | null;
  email?: string | null;
}) {
  const source = getDisplayName({ name, email });
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function AuthUserChip({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div
        className={clsx(
          "inline-flex h-10 w-24 animate-pulse rounded-xl border-[3px] border-line bg-panel-strong",
          className,
        )}
      />
    );
  }

  const name = session?.user?.name;
  const email = session?.user?.email;
  const displayName = getDisplayName({ name, email });
  const initials = getInitials({ name, email });

  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-line bg-white font-dashboard text-xs font-black shadow-[0_3px_0_#000]">
        {initials || <UserRound size={14} />}
      </div>
      {!compact ? (
        <div className="hidden sm:block">
          <p className="max-w-[150px] truncate font-dashboard text-xs font-bold">
            {displayName}
          </p>
          <p className="max-w-[150px] truncate font-dashboard text-[10px] font-semibold text-text-muted">
            {email}
          </p>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => void signOut({ redirectTo: "/" })}
        className="inline-flex h-10 items-center gap-1.5 rounded-xl border-[3px] border-line bg-white px-3 font-dashboard text-[11px] font-bold shadow-[0_3px_0_#000] transition-all hover:-translate-y-0.5"
      >
        <LogOut size={13} />
        <span className="hidden sm:inline">Sign out</span>
      </button>
    </div>
  );
}
