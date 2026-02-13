"use client";

import type { Doc, Id } from "@convex/_generated/dataModel";
import { UserButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  Clock,
  Copy,
  ExternalLink,
  Mail,
  Package,
  Plus,
  RadioTower,
  Save,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "@convex/_generated/api";
import { EmbedPreview } from "@/components/replay/embed-preview";
import { useToast } from "@/components/ui/toast-provider";
import { formatTimestamp } from "@/lib/time";

export default function ReplayDetailPage() {
  const params = useParams<{ id: string }>();
  const replayId = params.id as Id<"replays">;
  const toast = useToast();

  const replay = useQuery(api.replays.getReplayById, { id: replayId });
  const products = useQuery(api.products.listByReplay, { replayId });
  const subscribers = useQuery(api.subscribers.listByReplay, { replayId });
  const orders = useQuery(api.orders.listByReplay, { replayId });
  const updateReplay = useMutation(api.replays.updateReplay);
  const addProduct = useMutation(api.products.addProduct);
  const removeProduct = useMutation(api.products.removeProduct);

  const [tab, setTab] = useState<"products" | "subscribers" | "orders" | "campaigns">("products");

  if (replay === undefined) {
    return (
      <Shell>
        <div className="rounded-lg border border-line bg-panel p-8 text-center text-sm text-text-muted">
          Loading...
        </div>
      </Shell>
    );
  }

  const isLive = replay.status === "live" && (replay.expiresAt ?? 0) > Date.now();
  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/r/${replayId}`
    : `/r/${replayId}`;

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-text-muted transition-colors hover:bg-panel-strong hover:text-text"
          >
            <ArrowLeft size={14} />
          </Link>
          <h1 className="text-lg font-semibold tracking-tight">
            {replay.title || "Untitled replay"}
          </h1>
          {isLive ? (
            <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold text-accent">LIVE</span>
          ) : (
            <span className="rounded-full bg-text-muted/15 px-2.5 py-0.5 text-[10px] font-bold text-text-muted">ENDED</span>
          )}
        </div>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(publicUrl);
              toast.success("Public link copied!");
            } catch {
              toast.error("Could not copy link.");
            }
          }}
          className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-line px-3 text-xs font-medium text-text-muted transition-colors hover:bg-panel-strong hover:text-text"
        >
          <Copy size={12} />
          Copy public link
        </button>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        <MiniStat icon={Package} label="Products" value={products?.length ?? 0} />
        <MiniStat icon={Users} label="Subscribers" value={subscribers?.length ?? 0} />
        <MiniStat icon={Mail} label="Orders" value={orders?.length ?? 0} />
        <MiniStat
          icon={Clock}
          label="Expires"
          value={isLive && replay.expiresAt ? timeLeft(replay.expiresAt) : "Ended"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <div className="rounded-lg border border-line bg-panel p-4">
            <p className="mb-2 text-xs font-medium text-text-muted">Preview</p>
            <EmbedPreview url={replay.url} />
          </div>
          <ReplaySettingsCard replay={replay} updateReplay={updateReplay} toast={toast} />
        </div>

        <div className="space-y-4">
          <div className="flex gap-1 rounded-lg border border-line bg-panel p-1">
            {(["products", "subscribers", "orders", "campaigns"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 cursor-pointer rounded-md px-3 py-2 text-xs font-medium capitalize transition-colors ${
                  tab === t ? "bg-panel-strong text-text" : "text-text-muted hover:text-text"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "products" && (
            <ProductsTab
              replayId={replayId}
              products={products ?? []}
              addProduct={addProduct}
              removeProduct={removeProduct}
              toast={toast}
            />
          )}
          {tab === "subscribers" && <SubscribersTab subscribers={subscribers ?? []} />}
          {tab === "orders" && <OrdersTab orders={orders ?? []} products={products ?? []} />}
          {tab === "campaigns" && <CampaignsTab subscriberCount={subscribers?.length ?? 0} toast={toast} />}
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10 lg:py-14">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <RadioTower size={18} className="text-accent" />
          <span className="text-sm font-semibold tracking-tight">ReplaySell</span>
          <span className="text-text-muted/40">/</span>
          <Link href="/dashboard" className="text-sm text-text-muted transition-colors hover:text-text">
            Dashboard
          </Link>
          <span className="text-text-muted/40">/</span>
          <span className="text-sm text-text-muted">Detail</span>
        </div>
        <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "h-8 w-8" } }} />
      </header>
      {children}
    </main>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-line bg-panel px-4 py-3">
      <div className="flex items-center gap-1.5 text-text-muted">
        <Icon size={12} />
        <span className="text-[11px] font-medium">{label}</span>
      </div>
      <p className="mt-0.5 text-lg font-bold tracking-tight">{value}</p>
    </div>
  );
}

function ReplaySettingsCard({
  replay,
  updateReplay,
  toast,
}: {
  replay: Doc<"replays">;
  updateReplay: (args: { id: Id<"replays">; url?: string; title?: string; status?: string }) => Promise<Id<"replays">>;
  toast: { success: (m: string) => void; error: (m: string) => void };
}) {
  const [title, setTitle] = useState(replay.title ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(replay.title ?? "");
  }, [replay.title]);

  async function handleSave() {
    setSaving(true);
    try {
      await updateReplay({ id: replay._id, title: title.trim() || undefined });
      toast.success("Saved.");
    } catch {
      toast.error("Could not save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-line bg-panel p-4 space-y-3">
      <p className="text-xs font-medium text-text-muted">Settings</p>
      <div className="space-y-2">
        <input
          placeholder="Replay title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-9 w-full rounded-md border border-line bg-bg px-3 text-sm text-text placeholder:text-text-muted/60 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
        />
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>Created {formatTimestamp(replay.createdAt)}</span>
          <span>Expires {replay.expiresAt != null ? formatTimestamp(replay.expiresAt) : "—"}</span>
        </div>
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md bg-accent px-3 text-xs font-semibold text-bg-strong transition hover:brightness-110 disabled:opacity-50"
      >
        <Save size={12} />
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

function ProductsTab({
  replayId,
  products,
  addProduct,
  removeProduct,
  toast,
}: {
  replayId: Id<"replays">;
  products: Doc<"products">[];
  addProduct: (args: { replayId: Id<"replays">; name: string; price: number; stock: number }) => Promise<Id<"products">>;
  removeProduct: (args: { id: Id<"products"> }) => Promise<void | null>;
  toast: { success: (m: string) => void; error: (m: string) => void };
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [adding, setAdding] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !price || !stock) return;
    setAdding(true);
    try {
      await addProduct({
        replayId,
        name: name.trim(),
        price: parseFloat(price),
        stock: parseInt(stock, 10),
      });
      setName("");
      setPrice("");
      setStock("");
      toast.success("Product added.");
    } catch {
      toast.error("Could not add product.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleAdd} className="rounded-lg border border-line bg-panel p-4 space-y-3">
        <p className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
          <Plus size={12} /> Add product
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <input
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-9 rounded-md border border-line bg-bg px-3 text-sm text-text placeholder:text-text-muted/60 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="h-9 rounded-md border border-line bg-bg px-3 text-sm text-text placeholder:text-text-muted/60 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
          <input
            type="number"
            min="0"
            placeholder="Stock qty"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            className="h-9 rounded-md border border-line bg-bg px-3 text-sm text-text placeholder:text-text-muted/60 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
        </div>
        <button
          type="submit"
          disabled={adding}
          className="h-8 cursor-pointer rounded-md bg-accent px-4 text-xs font-semibold text-bg-strong transition hover:brightness-110 disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add"}
        </button>
      </form>

      {products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-text-muted">
          No products yet. Add your first SKU above.
        </div>
      ) : (
        <div className="divide-y divide-line rounded-lg border border-line bg-panel">
          {products.map((p) => (
            <div key={p._id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-text">{p.name}</p>
                <p className="text-xs text-text-muted">
                  ${p.price.toFixed(2)} &middot; {p.stock} in stock &middot; {p.sold} sold
                </p>
              </div>
              <button
                onClick={async () => {
                  try {
                    await removeProduct({ id: p._id });
                    toast.success("Removed.");
                  } catch {
                    toast.error("Could not remove.");
                  }
                }}
                className="cursor-pointer rounded-md p-1.5 text-text-muted transition-colors hover:bg-accent-magenta/10 hover:text-accent-magenta"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SubscribersTab({ subscribers }: { subscribers: Doc<"subscribers">[] }) {
  return (
    <div className="space-y-3">
      {subscribers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-text-muted">
          No subscribers yet. Share your public replay link to start capturing emails.
        </div>
      ) : (
        <div className="divide-y divide-line rounded-lg border border-line bg-panel">
          {subscribers.map((s) => (
            <div key={s._id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-text">{s.email}</p>
                <p className="text-xs text-text-muted">
                  {s.phone ? `${s.phone} · ` : ""}
                  {s.smsConsent ? "SMS opt-in" : "Email only"} &middot;{" "}
                  {formatTimestamp(s.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersTab({ orders, products }: { orders: Doc<"orders">[]; products: Doc<"products">[] }) {
  const productMap = new Map(products.map((p) => [p._id, p]));

  return (
    <div className="space-y-3">
      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-text-muted">
          No orders yet. Orders will appear here when viewers buy from your replay page.
        </div>
      ) : (
        <div className="divide-y divide-line rounded-lg border border-line bg-panel">
          {orders.map((o) => {
            const product = productMap.get(o.productId);
            return (
              <div key={o._id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-text">
                    {product?.name ?? "Unknown"} &times; {o.quantity}
                  </p>
                  <p className="text-xs text-text-muted">
                    {o.email} &middot; ${o.total.toFixed(2)} &middot; {formatTimestamp(o.createdAt)}
                  </p>
                </div>
                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                  {o.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CampaignsTab({
  subscriberCount,
  toast,
}: {
  subscriberCount: number;
  toast: { success: (m: string) => void; error: (m: string) => void };
}) {
  const templates = [
    { label: "Replay is live now", icon: ExternalLink },
    { label: "Only X items left", icon: Package },
    { label: "Replay closes in 6 hours", icon: Clock },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-line bg-panel p-4">
        <p className="mb-3 text-xs font-medium text-text-muted">
          Quick campaigns &middot; {subscriberCount} subscriber{subscriberCount !== 1 ? "s" : ""}
        </p>
        <div className="space-y-2">
          {templates.map((t) => (
            <button
              key={t.label}
              onClick={() => toast.success(`Campaign "${t.label}" sent! (dummy)`)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-md border border-line px-4 py-3 text-left text-sm transition-colors hover:bg-panel-strong"
            >
              <Send size={14} className="shrink-0 text-accent-purple" />
              <span className="font-medium text-text">{t.label}</span>
              <span className="ml-auto text-xs text-text-muted">Send</span>
            </button>
          ))}
        </div>
      </div>
      <p className="text-center text-xs text-text-muted">
        Full campaign builder coming soon. These are quick-send templates.
      </p>
    </div>
  );
}

function timeLeft(expiresAt: number) {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return "Ended";
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return `${h}h ${m}m`;
}
