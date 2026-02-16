"use client";

import type { Doc } from "@convex/_generated/dataModel";
import { UserButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import {
  CalendarClock,
  DollarSign,
  Layers2,
  Mail,
  Plus,
  RadioTower,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "@convex/_generated/api";
import { useToast } from "@/components/ui/toast-provider";
import { validateReplayUrl } from "@/lib/embed";
import { formatTimestamp } from "@/lib/time";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const stats = useQuery(api.replays.getDashboardStats);
  const replays = useQuery(api.replays.listMyReplays);
  const createReplay = useMutation(api.replays.createReplay);
  const [showCreate, setShowCreate] = useState(false);
  const [renderNow] = useState(() => Date.now());
  const initialUrl = searchParams.get("url") ?? "";

  useEffect(() => {
    if (initialUrl) {
      setShowCreate(true);
    }
  }, [initialUrl]);

  return (
    <main className="dashboard-layout page-fade-in min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col overflow-hidden rounded-[24px] border-[3px] border-line bg-panel shadow-[0_8px_0_#000] lg:flex-row">
        <aside className="w-full border-b-[3px] border-line bg-panel-strong p-5 lg:w-72 lg:border-b-0 lg:border-r-[3px]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-[3px] border-line bg-[#ffbc8c] shadow-[0_4px_0_#000]">
              <RadioTower size={18} />
            </div>
            <div>
              <p className="font-heading text-2xl font-black leading-none">ReplaySell</p>
              <p className="text-xs font-semibold text-text-muted">Seller console</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl border-[3px] border-line bg-[#ffbc8c] px-4 py-3 text-sm font-bold shadow-[0_4px_0_#000]"
            >
              <Layers2 size={15} />
              Dashboard
            </Link>
            <Link
              href="/dashboard/purchases"
              className="flex items-center gap-2 rounded-xl border-2 border-line bg-white px-4 py-3 text-sm font-bold shadow-[0_3px_0_#000] transition-all hover:-translate-y-0.5"
            >
              <UserRound size={15} />
              Buyer history
            </Link>
          </nav>

          <div className="mt-6 rounded-xl border-[3px] border-line bg-accent p-4 shadow-[0_4px_0_#000]">
            <p className="font-heading text-lg font-black">Fixed Monthly Plan</p>
            <p className="text-sm font-semibold text-text-muted">Billing via Stripe Subscriptions</p>
          </div>
        </aside>

        <section className="min-w-0 flex-1 bg-bg p-5 sm:p-6">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-heading text-4xl font-black">Dashboard</h1>
              <p className="text-sm font-semibold text-text-muted">
                Replay metrics, product inventory, subscribers, and campaigns.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreate((v) => !v)}
                className="brutal-btn-primary inline-flex h-11 cursor-pointer items-center gap-2 px-5 font-dashboard text-sm"
              >
                <Plus size={14} />
                {showCreate ? "Close" : "Add Replay"}
              </button>
              <UserButton
                afterSignOutUrl="/"
                appearance={{ elements: { userButtonAvatarBox: "h-11 w-11 border-2 border-[#1A1A1A]" } }}
              />
            </div>
          </header>

          {stats && (
            <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <StatCard label="Monthly Total" value={`$${stats.totalRevenue.toFixed(2)}`} icon={DollarSign} tone="bg-accent" />
              <StatCard label="Active" value={stats.liveReplays} icon={CalendarClock} tone="bg-[#ff9ecd]" />
              <StatCard label="Renewals" value={stats.totalReplays} icon={ShoppingBag} tone="bg-[#ff6b5a]" />
              <StatCard label="Leads" value={stats.totalSubscribers} icon={Mail} tone="bg-accent-amber" />
              <StatCard label="Orders" value={stats.totalOrders} icon={Layers2} tone="bg-[#b794f6]" />
            </div>
          )}

          {showCreate && (
            <CreateReplayCard
              initialUrl={initialUrl}
              onCreated={(id) => {
                setShowCreate(false);
                router.push(`/dashboard/replays/${id}`);
              }}
              createReplay={createReplay}
              toast={toast}
            />
          )}

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-black">Your replays</h2>
              <span className="rounded-full border-2 border-line bg-accent-amber px-3 py-1 text-xs font-bold shadow-[0_2px_0_#000]">
                {replays ? `${replays.length} items` : "Loading"}
              </span>
            </div>

            {replays === undefined ? (
              <div className="brutal-card p-6 text-sm font-semibold text-text-muted">Loading replays...</div>
            ) : replays.length === 0 ? (
              <div className="brutal-card p-6 text-sm font-semibold text-text-muted">
                No replays yet. Create your first replay above.
              </div>
            ) : (
              <div className="space-y-3">
                {replays.map((replay: Doc<"replays">) => {
                  const isLive = replay.status === "live" && (replay.expiresAt ?? 0) > renderNow;
                  return (
                    <Link
                      key={replay._id}
                      href={`/dashboard/replays/${replay._id}`}
                      className="group block rounded-2xl border-[3px] border-line bg-white p-4 shadow-[0_4px_0_#000] transition-all hover:-translate-y-1 hover:shadow-[0_6px_0_#000]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-heading text-xl font-extrabold leading-tight">
                            {replay.title || replay.url}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-text-muted">
                            Created {formatTimestamp(replay.createdAt)}
                          </p>
                        </div>
                        <span
                          className={`rounded-full border-2 border-line px-2.5 py-1 text-[11px] font-bold shadow-[0_2px_0_#000] ${
                            isLive ? "bg-accent" : "bg-panel-strong"
                          }`}
                        >
                          {isLive ? "LIVE" : "ENDED"}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  tone: string;
}) {
  return (
    <div className={`rounded-2xl border-[3px] border-line p-4 shadow-[0_4px_0_#000] ${tone}`}>
      <div className="flex items-center gap-2 text-text-muted">
        <Icon size={14} />
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <p className="mt-1 font-heading text-4xl font-black leading-none">{value}</p>
    </div>
  );
}

function CreateReplayCard({
  initialUrl = "",
  onCreated,
  createReplay,
  toast,
}: {
  initialUrl?: string;
  onCreated: (id: string) => void;
  createReplay: (args: { url: string; title?: string; durationHours?: number }) => Promise<string>;
  toast: { success: (m: string) => void; error: (m: string) => void };
}) {
  const [url, setUrl] = useState(initialUrl);
  const [title, setTitle] = useState("");
  const [hours, setHours] = useState(48);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setUrl(initialUrl);
  }, [initialUrl]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const check = validateReplayUrl(url);
    if (!check.valid || !check.parsed) {
      toast.error(check.message ?? "Enter a valid replay URL.");
      return;
    }

    setPending(true);
    try {
      const id = await createReplay({
        url: check.parsed.normalizedUrl,
        title: title.trim() || undefined,
        durationHours: hours,
      });
      toast.success("Replay created. Add products next.");
      onCreated(id);
    } catch {
      toast.error("Could not create replay.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border-[3px] border-line bg-white p-5 shadow-[0_6px_0_#000]">
      <p className="mb-3 font-heading text-xl font-black">Create replay</p>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          type="url"
          placeholder="Replay URL (TikTok, YouTube, etc.)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="brutal-input"
        />
        <input
          type="text"
          placeholder='Title (e.g. "Friday Night Drop")'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="brutal-input"
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.06em] text-text-muted">Duration</span>
        {[24, 48, 72].map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => setHours(h)}
            className={`rounded-xl border-2 px-3 py-1 text-xs font-bold shadow-[0_2px_0_#000] transition-all hover:-translate-y-0.5 ${
              hours === h ? "border-line bg-accent" : "border-line bg-white"
            }`}
          >
            {h}h
          </button>
        ))}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="brutal-btn-primary mt-4 inline-flex h-11 items-center px-6 font-heading text-sm disabled:opacity-60"
      >
        {pending ? "Creating..." : "Create & add products"}
      </button>
    </form>
  );
}
