"use client";

import { UserButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import {
  Clock,
  DollarSign,
  ExternalLink,
  Mail,
  Plus,
  RadioTower,
  ShoppingBag,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Doc } from "@convex/_generated/dataModel";

import { api } from "@convex/_generated/api";
import { useToast } from "@/components/ui/toast-provider";
import { formatTimestamp } from "@/lib/time";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-lg border border-line bg-panel p-4">
      <div className="flex items-center gap-2 text-text-muted">
        <Icon size={14} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const stats = useQuery(api.replays.getDashboardStats);
  const replays = useQuery(api.replays.listMyReplays);
  const createReplay = useMutation(api.replays.createReplay);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10 lg:py-14">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <RadioTower size={18} className="text-accent" />
          <span className="text-sm font-semibold tracking-tight">ReplaySell</span>
          <span className="text-text-muted/40">/</span>
          <span className="text-sm text-text-muted">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-bg-strong transition hover:brightness-110"
          >
            <Plus size={14} />
            New replay
          </button>
          <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "h-8 w-8" } }} />
        </div>
      </header>

      {stats && (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          <StatCard label="Total replays" value={stats.totalReplays} icon={ShoppingBag} />
          <StatCard label="Live now" value={stats.liveReplays} icon={Clock} />
          <StatCard label="Subscribers" value={stats.totalSubscribers} icon={Users} />
          <StatCard label="Orders" value={stats.totalOrders} icon={Mail} />
          <StatCard
            label="Revenue"
            value={`$${stats.totalRevenue.toFixed(0)}`}
            icon={DollarSign}
            />
        </div>
      )}

      {showCreate && (
        <CreateReplayCard
          onCreated={(id) => {
            setShowCreate(false);
            router.push(`/dashboard/replays/${id}`);
          }}
          onCancel={() => setShowCreate(false)}
          createReplay={createReplay}
          toast={toast}
        />
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold">Replays</h2>
          <span className="text-xs text-text-muted">
            {replays ? `${replays.length} total` : "Loading..."}
          </span>
        </div>

        {replays === undefined ? (
          <div className="rounded-lg border border-line bg-panel p-8 text-center text-sm text-text-muted">
            Loading...
          </div>
        ) : replays.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line p-8 text-center text-sm text-text-muted">
            No replays yet. Click &ldquo;New replay&rdquo; to create your first one.
          </div>
        ) : (
          <div className="divide-y divide-line rounded-lg border border-line bg-panel">
            {replays.map((replay: Doc<"replays">) => {
              const isLive = replay.status === "live" && (replay.expiresAt ?? 0) > Date.now();
              return (
                <Link
                  key={replay._id}
                  href={`/dashboard/replays/${replay._id}`}
                  className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-panel-strong"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-text">
                        {replay.title || replay.url}
                      </p>
                      {isLive ? (
                        <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                          LIVE
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-text-muted/15 px-2 py-0.5 text-[10px] font-bold text-text-muted">
                          ENDED
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-xs text-text-muted">
                      {formatTimestamp(replay.createdAt)}
                    </p>
                  </div>
                  <ExternalLink size={14} className="shrink-0 text-text-muted" />
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function CreateReplayCard({
  onCreated,
  onCancel,
  createReplay,
  toast,
}: {
  onCreated: (id: string) => void;
  onCancel: () => void;
  createReplay: (args: { url: string; title?: string; durationHours?: number }) => Promise<string>;
  toast: { success: (m: string) => void; error: (m: string) => void };
}) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [hours, setHours] = useState(48);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setPending(true);
    try {
      const id = await createReplay({
        url: url.trim(),
        title: title.trim() || undefined,
        durationHours: hours,
      });
      toast.success("Replay created! Add products next.");
      onCreated(id);
    } catch {
      toast.error("Could not create replay.");
      setPending(false);
    }
  }

  return (
    <div className="mb-6 rounded-lg border border-line bg-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">New replay</h3>
        <button onClick={onCancel} className="cursor-pointer text-xs text-text-muted hover:text-text">
          Cancel
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="url"
          placeholder="Replay URL (TikTok, YouTube, etc.)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="h-10 w-full rounded-md border border-line bg-bg px-3 text-sm text-text placeholder:text-text-muted/60 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
        />
        <input
          type="text"
          placeholder='Title (e.g. "Friday Night Drop")'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-10 w-full rounded-md border border-line bg-bg px-3 text-sm text-text placeholder:text-text-muted/60 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
        />
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-text-muted">Duration</label>
          <div className="flex gap-1.5">
            {[24, 48, 72].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHours(h)}
                className={`cursor-pointer rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                  hours === h
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-line text-text-muted hover:bg-panel-strong"
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="h-10 w-full cursor-pointer rounded-md bg-accent text-sm font-semibold text-bg-strong transition hover:brightness-110 disabled:opacity-50"
        >
          {pending ? "Creating..." : "Create & add products"}
        </button>
      </form>
    </div>
  );
}
