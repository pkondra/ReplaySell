"use client";

import { KeyRound, LogOut, RefreshCcw, Save, Shield } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { formatTimestamp } from "@/lib/time";

type SellerPlan = "starter" | "growth" | "boutique" | null;
type SubscriptionStatus =
  | "none"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired";

type AdminUser = {
  userId: string;
  email: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  subscription: {
    status: SubscriptionStatus;
    plan: SellerPlan;
    updatedAt: number | null;
  };
};

type UserRow = {
  userId: string;
  email: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  status: SubscriptionStatus;
  plan: SellerPlan;
  draftStatus: SubscriptionStatus;
  draftPlan: SellerPlan;
  subscriptionUpdatedAt: number | null;
  saving: boolean;
  error: string | null;
};

const STATUS_OPTIONS: Array<{ value: SubscriptionStatus; label: string }> = [
  { value: "none", label: "None" },
  { value: "trialing", label: "Trialing" },
  { value: "active", label: "Active" },
  { value: "past_due", label: "Past Due" },
  { value: "canceled", label: "Canceled" },
  { value: "unpaid", label: "Unpaid" },
  { value: "incomplete", label: "Incomplete" },
  { value: "incomplete_expired", label: "Incomplete Expired" },
];

const PLAN_OPTIONS: Array<{ value: SellerPlan; label: string }> = [
  { value: null, label: "No plan" },
  { value: "starter", label: "Starter" },
  { value: "growth", label: "Growth" },
  { value: "boutique", label: "Boutique" },
];

function toRow(user: AdminUser): UserRow {
  return {
    userId: user.userId,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    status: user.subscription.status,
    plan: user.subscription.plan,
    draftStatus: user.subscription.status,
    draftPlan: user.subscription.plan,
    subscriptionUpdatedAt: user.subscription.updatedAt,
    saving: false,
    error: null,
  };
}

function getStatusTone(status: SubscriptionStatus) {
  if (status === "active" || status === "trialing") return "bg-accent";
  if (status === "past_due" || status === "unpaid") return "bg-[#fff1ef]";
  if (status === "canceled") return "bg-panel-strong";
  return "bg-white";
}

export default function AdminPage() {
  const [authState, setAuthState] = useState<"checking" | "locked" | "ready">(
    "checking",
  );
  const [pin, setPin] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  const [rows, setRows] = useState<UserRow[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  const userCountLabel = useMemo(() => `${rows.length} users`, [rows.length]);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    setUsersError(null);

    try {
      const response = await fetch("/api/admin/users", {
        method: "GET",
        cache: "no-store",
      });

      const payload = (await response.json().catch(() => ({}))) as {
        users?: AdminUser[];
        error?: string;
      };

      if (response.status === 401) {
        setAuthState("locked");
        setRows([]);
        return;
      }

      if (!response.ok) {
        setUsersError(payload.error ?? "Failed to load users.");
        return;
      }

      setRows((payload.users ?? []).map(toRow));
      setAuthState("ready");
    } catch {
      setUsersError("Failed to load users.");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  async function handlePinSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPinLoading(true);
    setPinError(null);

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setPinError(payload.error ?? "Could not verify admin PIN.");
        return;
      }

      setPin("");
      setAuthState("ready");
      await loadUsers();
    } catch {
      setPinError("Could not verify admin PIN.");
    } finally {
      setPinLoading(false);
    }
  }

  async function handleAdminSignOut() {
    await fetch("/api/admin/auth", { method: "DELETE" }).catch(() => null);
    setAuthState("locked");
    setRows([]);
  }

  function updateRow(
    userId: string,
    updater: (row: UserRow) => UserRow,
  ) {
    setRows((current) =>
      current.map((row) => (row.userId === userId ? updater(row) : row)),
    );
  }

  function handleStatusChange(userId: string, status: SubscriptionStatus) {
    updateRow(userId, (row) => ({
      ...row,
      draftStatus: status,
      draftPlan: status === "none" ? null : row.draftPlan,
      error: null,
    }));
  }

  function handlePlanChange(userId: string, plan: SellerPlan) {
    updateRow(userId, (row) => ({
      ...row,
      draftPlan: plan,
      draftStatus: plan && row.draftStatus === "none" ? "active" : row.draftStatus,
      error: null,
    }));
  }

  async function handleSave(userId: string) {
    const row = rows.find((item) => item.userId === userId);
    if (!row) return;

    updateRow(userId, (current) => ({ ...current, saving: true, error: null }));

    try {
      const response = await fetch("/api/admin/subscription", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userId,
          status: row.draftStatus,
          plan: row.draftPlan,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        updated?: {
          status: SubscriptionStatus;
          plan: SellerPlan;
          updatedAt: number;
        };
        error?: string;
      };

      if (response.status === 401) {
        setAuthState("locked");
        setRows([]);
        return;
      }

      if (!response.ok || !payload.updated) {
        updateRow(userId, (current) => ({
          ...current,
          saving: false,
          error: payload.error ?? "Could not update user subscription.",
        }));
        return;
      }

      updateRow(userId, (current) => ({
        ...current,
        saving: false,
        status: payload.updated!.status,
        plan: payload.updated!.plan,
        draftStatus: payload.updated!.status,
        draftPlan: payload.updated!.plan,
        subscriptionUpdatedAt: payload.updated!.updatedAt,
        error: null,
      }));
    } catch {
      updateRow(userId, (current) => ({
        ...current,
        saving: false,
        error: "Could not update user subscription.",
      }));
    }
  }

  return (
    <main className="dashboard-layout page-fade-in min-h-screen px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto w-full max-w-[110rem] rounded-[28px] border-[3px] border-line bg-panel p-6 shadow-[0_8px_0_#000] sm:p-8 lg:p-10">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-4xl font-black sm:text-5xl">Admin</h1>
            <p className="mt-1 text-sm font-semibold text-text-muted">
              Manage seller subscription plan and status values directly in Convex.
            </p>
          </div>
          {authState === "ready" ? (
            <button
              type="button"
              onClick={() => void handleAdminSignOut()}
              className="inline-flex h-11 items-center gap-2 rounded-xl border-[3px] border-line bg-white px-4 text-xs font-bold shadow-[0_3px_0_#000] transition-all hover:-translate-y-0.5"
            >
              <LogOut size={14} />
              Lock admin
            </button>
          ) : null}
        </header>

        {authState !== "ready" ? (
          <section className="mx-auto max-w-md rounded-2xl border-[3px] border-line bg-white p-6 shadow-[0_6px_0_#000] sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-line bg-accent shadow-[0_3px_0_#000]">
                <Shield size={16} />
              </div>
              <div>
                <p className="font-heading text-xl font-black">Admin PIN required</p>
                <p className="text-xs font-semibold text-text-muted">
                  Enter `ADMIN_PIN` to unlock this panel.
                </p>
              </div>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-3">
              <label className="block space-y-1.5">
                <span className="font-dashboard text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
                  PIN
                </span>
                <div className="grid h-12 grid-cols-[2.75rem_1fr] items-center overflow-hidden rounded-xl border-2 border-line bg-[#fcfaf7] shadow-[0_2px_0_#000]">
                  <div className="flex h-full items-center justify-center border-r-2 border-line bg-white text-text-muted">
                    <KeyRound size={16} />
                  </div>
                  <input
                    type="password"
                    autoComplete="off"
                    value={pin}
                    onChange={(event) => setPin(event.target.value)}
                    placeholder="Enter admin PIN"
                    className="h-full w-full border-0 bg-transparent px-3 text-sm font-semibold text-text outline-none placeholder:text-text-muted/60"
                    required
                  />
                </div>
              </label>

              {pinError ? (
                <p className="rounded-xl border-2 border-[#e8c4c0] bg-[#fff1ef] px-3.5 py-2.5 text-xs font-semibold text-[#8a2a20]">
                  {pinError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={pinLoading}
                className="brutal-btn-primary inline-flex h-11 w-full items-center justify-center text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pinLoading ? "Verifying..." : "Unlock admin"}
              </button>
            </form>
          </section>
        ) : (
          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full border-2 border-line bg-accent-amber px-3 py-1 text-xs font-bold shadow-[0_2px_0_#000]">
                {userCountLabel}
              </span>
              <button
                type="button"
                onClick={() => void loadUsers()}
                disabled={loadingUsers}
                className="inline-flex h-10 items-center gap-2 rounded-xl border-[3px] border-line bg-white px-4 text-xs font-bold shadow-[0_3px_0_#000] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCcw size={13} />
                {loadingUsers ? "Refreshing..." : "Refresh users"}
              </button>
            </div>

            {usersError ? (
              <p className="rounded-xl border-2 border-[#e8c4c0] bg-[#fff1ef] px-3.5 py-2.5 text-xs font-semibold text-[#8a2a20]">
                {usersError}
              </p>
            ) : null}

            {rows.length === 0 && !loadingUsers ? (
              <div className="rounded-2xl border-[3px] border-line bg-white p-6 text-sm font-semibold text-text-muted shadow-[0_4px_0_#000]">
                No users found.
              </div>
            ) : (
              <div className="space-y-4">
                {rows.map((row) => {
                  const isDirty =
                    row.status !== row.draftStatus || row.plan !== row.draftPlan;

                  return (
                    <article
                      key={row.userId}
                      className={`rounded-2xl border-[3px] border-line p-5 shadow-[0_4px_0_#000] ${getStatusTone(
                        row.draftStatus,
                      )}`}
                    >
                      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr_1fr_auto] lg:items-end">
                        <div className="min-w-0">
                          <p className="truncate font-heading text-xl font-black leading-tight">
                            {row.name}
                          </p>
                          <p className="truncate text-xs font-semibold text-text-muted">
                            {row.email}
                          </p>
                          <p className="mt-1 text-[11px] font-semibold text-text-muted">
                            User ID: {row.userId}
                          </p>
                          <p className="mt-1 text-[11px] font-semibold text-text-muted">
                            Joined {formatTimestamp(row.createdAt)} | Last user update{" "}
                            {formatTimestamp(row.updatedAt)}
                          </p>
                          {row.subscriptionUpdatedAt ? (
                            <p className="mt-1 text-[11px] font-semibold text-text-muted">
                              Last subscription update {formatTimestamp(row.subscriptionUpdatedAt)}
                            </p>
                          ) : (
                            <p className="mt-1 text-[11px] font-semibold text-text-muted">
                              No subscription record yet.
                            </p>
                          )}
                        </div>

                        <label className="space-y-1">
                          <span className="font-dashboard text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted">
                            Status
                          </span>
                          <select
                            value={row.draftStatus}
                            onChange={(event) =>
                              handleStatusChange(
                                row.userId,
                                event.target.value as SubscriptionStatus,
                              )
                            }
                            className="h-11 w-full rounded-xl border-[3px] border-line bg-white px-3 text-sm font-semibold text-text outline-none"
                          >
                            {STATUS_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="space-y-1">
                          <span className="font-dashboard text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted">
                            Plan
                          </span>
                          <select
                            value={row.draftPlan ?? ""}
                            onChange={(event) =>
                              handlePlanChange(
                                row.userId,
                                (event.target.value || null) as SellerPlan,
                              )
                            }
                            className="h-11 w-full rounded-xl border-[3px] border-line bg-white px-3 text-sm font-semibold text-text outline-none"
                          >
                            {PLAN_OPTIONS.map((option) => (
                              <option key={option.value ?? "none"} value={option.value ?? ""}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>

                        <button
                          type="button"
                          onClick={() => void handleSave(row.userId)}
                          disabled={!isDirty || row.saving}
                          className="brutal-btn-primary inline-flex h-11 items-center justify-center gap-2 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Save size={13} />
                          {row.saving ? "Saving..." : "Save"}
                        </button>
                      </div>

                      {row.error ? (
                        <p className="mt-3 rounded-lg border-2 border-[#e8c4c0] bg-[#fff1ef] px-3 py-2 text-xs font-semibold text-[#8a2a20]">
                          {row.error}
                        </p>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
