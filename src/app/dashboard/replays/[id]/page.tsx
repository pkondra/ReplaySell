"use client";

import type { Doc, Id } from "@convex/_generated/dataModel";
import { UserButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  Bell,
  Clock,
  Copy,
  Mail,
  Package,
  Plus,
  RadioTower,
  Save,
  Send,
  Trash2,
  UserRound,
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
  const [renderNow] = useState(() => Date.now());

  if (replay === undefined) {
    return (
      <Shell>
        <div className="brutal-card p-8 text-sm font-semibold text-text-muted">Loading replay...</div>
      </Shell>
    );
  }

  const isLive = replay.status === "live" && (replay.expiresAt ?? 0) > renderNow;
  const publicUrl =
    typeof window !== "undefined" ? `${window.location.origin}/r/${replayId}` : `/r/${replayId}`;

  return (
    <Shell>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-xl border-[2px] border-line bg-white shadow-[0_3px_0_#000] transition-all hover:-translate-y-0.5"
          >
            <ArrowLeft size={14} />
          </Link>
          <h1 className="font-heading text-3xl font-black">{replay.title || "Untitled replay"}</h1>
          <span
            className={`rounded-full border-2 border-line px-3 py-1 text-xs font-bold shadow-[0_2px_0_#000] ${
              isLive ? "bg-accent" : "bg-panel-strong"
            }`}
          >
            {isLive ? "LIVE" : "ENDED"}
          </span>
        </div>

        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(publicUrl);
              toast.success("Public link copied.");
            } catch {
              toast.error("Could not copy link.");
            }
          }}
          className="brutal-btn-secondary inline-flex h-10 cursor-pointer items-center gap-2 px-4 text-sm"
        >
          <Copy size={14} />
          Copy public link
        </button>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        <MiniStat icon={Package} label="Products" value={products?.length ?? 0} tone="bg-accent" />
        <MiniStat icon={UserRound} label="Subscribers" value={subscribers?.length ?? 0} tone="bg-[#ff9ecd]" />
        <MiniStat icon={Mail} label="Orders" value={orders?.length ?? 0} tone="bg-[#ffbc8c]" />
        <MiniStat
          icon={Clock}
          label="Time left"
          value={isLive && replay.expiresAt ? timeLeft(replay.expiresAt, renderNow) : "Ended"}
          tone="bg-accent-amber"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
        <div className="space-y-4">
          <div className="brutal-card bg-white p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-text-muted">Replay preview</p>
            <EmbedPreview url={replay.url} />
          </div>

          <ReplaySettingsCard replay={replay} updateReplay={updateReplay} toast={toast} />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border-[3px] border-line bg-white p-1 shadow-[0_4px_0_#000]">
            <div className="grid grid-cols-4 gap-1">
              {(["products", "subscribers", "orders", "campaigns"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setTab(item)}
                  className={`cursor-pointer rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-[0.06em] transition-all ${
                    tab === item
                      ? "-translate-y-0.5 border-2 border-line bg-accent shadow-[0_2px_0_#000]"
                      : "border-2 border-transparent hover:border-line"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
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
          {tab === "campaigns" && (
            <CampaignsTab subscriberCount={subscribers?.length ?? 0} toast={toast} />
          )}
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="dashboard-layout page-fade-in min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-7xl rounded-[24px] border-[3px] border-line bg-panel p-5 shadow-[0_8px_0_#000] sm:p-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-[3px] border-line bg-[#ffbc8c] shadow-[0_4px_0_#000]">
              <RadioTower size={18} />
            </div>
            <div>
              <p className="font-heading text-3xl font-black leading-none">ReplaySell</p>
              <p className="text-sm font-semibold text-text-muted">Replay detail workspace</p>
            </div>
          </div>
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { userButtonAvatarBox: "h-11 w-11 border-2 border-[#1A1A1A]" } }}
          />
        </header>
        {children}
      </div>
    </main>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  tone: string;
}) {
  return (
    <div className={`rounded-2xl border-[3px] border-line p-4 shadow-[0_4px_0_#000] ${tone}`}>
      <div className="flex items-center gap-1.5 text-text-muted">
        <Icon size={13} />
        <span className="text-xs font-bold uppercase tracking-[0.06em]">{label}</span>
      </div>
      <p className="mt-1 font-heading text-3xl font-black leading-none">{value}</p>
    </div>
  );
}

function ReplaySettingsCard({
  replay,
  updateReplay,
  toast,
}: {
  replay: Doc<"replays">;
  updateReplay: (args: {
    id: Id<"replays">;
    url?: string;
    title?: string;
    status?: string;
  }) => Promise<Id<"replays">>;
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
      toast.success("Replay settings saved.");
    } catch {
      toast.error("Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="brutal-card space-y-3 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-text-muted">Replay settings</p>
      <input
        placeholder="Replay title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="brutal-input"
      />
      <div className="grid gap-1 text-xs font-semibold text-text-muted sm:grid-cols-2">
        <p>Created {formatTimestamp(replay.createdAt)}</p>
        <p>Expires {replay.expiresAt != null ? formatTimestamp(replay.expiresAt) : "—"}</p>
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="brutal-btn-primary inline-flex h-10 items-center gap-2 px-4 text-sm disabled:opacity-60"
      >
        <Save size={14} />
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
  addProduct: (args: {
    replayId: Id<"replays">;
    name: string;
    price: number;
    stock: number;
  }) => Promise<Id<"products">>;
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
      <form onSubmit={handleAdd} className="rounded-2xl border-[3px] border-line bg-white p-4 shadow-[0_4px_0_#000]">
        <p className="mb-3 flex items-center gap-2 font-heading text-2xl font-black">
          <Plus size={16} /> Add product
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <input
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="brutal-input"
          />
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="brutal-input"
          />
          <input
            type="number"
            min="0"
            placeholder="Stock qty"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            className="brutal-input"
          />
        </div>
        <button
          type="submit"
          disabled={adding}
          className="brutal-btn-primary mt-3 inline-flex h-10 items-center px-4 text-sm disabled:opacity-60"
        >
          {adding ? "Adding..." : "Add product"}
        </button>
      </form>

      {products.length === 0 ? (
        <div className="brutal-card p-6 text-sm font-semibold text-text-muted">No products yet.</div>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p._id} className="rounded-2xl border-[3px] border-line bg-white p-4 shadow-[0_4px_0_#000]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-2xl font-black">{p.name}</p>
                  <p className="text-sm font-semibold text-text-muted">
                    ${p.price.toFixed(2)} · {p.stock} in stock · {p.sold} sold
                  </p>
                </div>
                <button
                  onClick={async () => {
                    try {
                      await removeProduct({ id: p._id });
                      toast.success("Product removed.");
                    } catch {
                      toast.error("Could not remove product.");
                    }
                  }}
                  className="rounded-xl border-2 border-line bg-[#fff3f0] p-2 shadow-[0_2px_0_#000] transition-all hover:-translate-y-0.5"
                >
                  <Trash2 size={15} />
                </button>
              </div>
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
        <div className="brutal-card p-6 text-sm font-semibold text-text-muted">No subscribers yet.</div>
      ) : (
        subscribers.map((sub) => (
          <div key={sub._id} className="rounded-2xl border-[3px] border-line bg-white p-4 shadow-[0_4px_0_#000]">
            <p className="font-heading text-2xl font-black leading-none">{sub.email}</p>
            <p className="mt-1 text-sm font-semibold text-text-muted">
              {sub.phone ? `${sub.phone} · ` : ""}
              {sub.smsConsent ? "SMS opt-in" : "Email only"} · {formatTimestamp(sub.createdAt)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <PreferenceChip enabled={sub.notifyTimer ?? true} label="Timer alerts" />
              <PreferenceChip enabled={sub.notifyStock ?? true} label="Stock alerts" />
              <PreferenceChip enabled={sub.notifyPriceChange ?? true} label="Price alerts" />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function OrdersTab({ orders, products }: { orders: Doc<"orders">[]; products: Doc<"products">[] }) {
  const productMap = new Map(products.map((p) => [p._id, p]));

  return (
    <div className="space-y-3">
      {orders.length === 0 ? (
        <div className="brutal-card p-6 text-sm font-semibold text-text-muted">No orders yet.</div>
      ) : (
        orders.map((order) => {
          const product = productMap.get(order.productId);
          return (
            <div key={order._id} className="rounded-2xl border-[3px] border-line bg-white p-4 shadow-[0_4px_0_#000]">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-heading text-2xl font-black leading-none">
                    {product?.name ?? "Unknown"} × {order.quantity}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-text-muted">
                    {order.email} · ${order.total.toFixed(2)} · {formatTimestamp(order.createdAt)}
                  </p>
                </div>
                <span className="rounded-full border-2 border-line bg-accent-amber px-2.5 py-1 text-xs font-bold shadow-[0_2px_0_#000]">
                  {order.status}
                </span>
              </div>
            </div>
          );
        })
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
  const templates = ["Replay is live now", "Only X items left", "Replay closes in 6 hours"];

  return (
    <div className="rounded-2xl border-[3px] border-line bg-white p-5 shadow-[0_4px_0_#000]">
      <p className="mb-3 flex items-center gap-2 font-heading text-2xl font-black">
        <Bell size={18} /> Campaign templates
      </p>
      <p className="mb-3 text-sm font-semibold text-text-muted">
        {subscriberCount} subscribers available for send.
      </p>

      <div className="space-y-2">
        {templates.map((template) => (
          <button
            key={template}
            onClick={() => toast.success(`Template sent: ${template}`)}
            className="flex w-full cursor-pointer items-center justify-between rounded-xl border-[2px] border-line bg-panel-strong px-4 py-3 text-left text-sm font-bold shadow-[0_2px_0_#000] transition-all hover:-translate-y-0.5"
          >
            <span>{template}</span>
            <Send size={14} />
          </button>
        ))}
      </div>
    </div>
  );
}

function PreferenceChip({ enabled, label }: { enabled: boolean; label: string }) {
  return (
    <span
      className={`rounded-full border-2 border-line px-3 py-1 text-xs font-bold shadow-[0_2px_0_#000] ${
        enabled ? "bg-accent" : "bg-panel-strong"
      }`}
    >
      {label}
    </span>
  );
}

function timeLeft(expiresAt: number, now: number) {
  const diff = expiresAt - now;
  if (diff <= 0) return "Ended";
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return `${h}h ${m}m`;
}
