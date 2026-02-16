"use client";

import type { Doc, Id } from "@convex/_generated/dataModel";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Bell,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Package,
  Plus,
  RadioTower,
  Save,
  Send,
  ShoppingBag,
  Trash2,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "@convex/_generated/api";
import { AuthUserChip } from "@/components/auth/auth-user-chip";
import { EmbedPreview } from "@/components/replay/embed-preview";
import { useToast } from "@/components/ui/toast-provider";
import { validateReplayUrl } from "@/lib/embed";
import { formatTimestamp } from "@/lib/time";

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function ReplayDetailPage() {
  const { isAuthenticated } = useConvexAuth();
  const canQuery = isAuthenticated;
  const params = useParams<{ id: string }>();
  const replayId = params.id as Id<"replays">;
  const toast = useToast();

  const replay = useQuery(
    api.replays.getReplayById,
    canQuery ? { id: replayId } : "skip",
  );
  const products = useQuery(
    api.products.listByReplay,
    canQuery ? { replayId } : "skip",
  );
  const subscribers = useQuery(
    api.subscribers.listByReplay,
    canQuery ? { replayId } : "skip",
  );
  const orders = useQuery(
    api.orders.listByReplay,
    canQuery ? { replayId } : "skip",
  );
  const sellerSubscription = useQuery(
    api.sellerBilling.getMySellerSubscription,
    canQuery ? {} : "skip",
  );
  const updateReplay = useMutation(api.replays.updateReplay);
  const deleteReplay = useMutation(api.replays.deleteReplay);
  const archiveReplay = useMutation(api.replays.archiveReplay);
  const unarchiveReplay = useMutation(api.replays.unarchiveReplay);
  const addProduct = useMutation(api.products.addProduct);
  const removeProduct = useMutation(api.products.removeProduct);
  const router = useRouter();

  const [tab, setTab] = useState<"products" | "subscribers" | "orders" | "campaigns">("products");
  const [renderNow] = useState(() => Date.now());
  const [copied, setCopied] = useState(false);
  const [showShareTip, setShowShareTip] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [archiving, setArchiving] = useState(false);

  if (replay === undefined) {
    return (
      <Shell>
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 animate-pulse items-center justify-center rounded-xl border-[3px] border-line bg-accent shadow-[0_4px_0_#000]">
              <Package size={20} />
            </div>
            <p className="font-heading text-lg font-bold text-text-muted">Loading replay...</p>
          </div>
        </div>
      </Shell>
    );
  }

  const isArchived = replay.status === "archived";
  const isLive = replay.status === "live" && (replay.expiresAt ?? 0) > renderNow;
  const publicUrl =
    typeof window !== "undefined" ? `${window.location.origin}/r/${replayId}` : `/r/${replayId}`;

  const revenue = orders?.reduce((sum, o) => sum + o.total, 0) ?? 0;

  async function handleCopyPublicLink() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setShowShareTip(true);
      toast.success("Public link copied.");
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setShowShareTip(false), 2600);
    } catch {
      toast.error("Could not copy link.");
    }
  }

  return (
    <Shell>
      {/* ── Top bar: back + title + actions ──────────────── */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-line bg-white shadow-[0_3px_0_#000] transition-all hover:-translate-y-0.5"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl font-black sm:text-3xl">
                {replay.title || "Untitled replay"}
              </h1>
              <span
                className={`rounded-full border-2 border-line px-3 py-1 font-dashboard text-[10px] font-bold uppercase shadow-[0_2px_0_#000] ${
                  isArchived
                    ? "bg-[#e0d4f7]"
                    : isLive
                      ? "bg-accent"
                      : "bg-panel-strong"
                }`}
              >
                {isArchived ? "Archived" : isLive ? "Live" : "Ended"}
              </span>
            </div>
            <p className="mt-0.5 font-dashboard text-xs text-text-muted">
              Created {formatTimestamp(replay.createdAt)}
              {replay.expiresAt ? ` · Expires ${formatTimestamp(replay.expiresAt)}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-line bg-[#fff3f0] shadow-[0_3px_0_#000] transition-all hover:-translate-y-0.5 hover:bg-[#ffe5df]"
              title="Delete replay"
            >
              <Trash2 size={14} />
            </button>
          ) : (
            <button
              onClick={async () => {
                setDeleting(true);
                try {
                  await deleteReplay({ id: replayId });
                  toast.success("Replay deleted.");
                  window.location.href = "/dashboard";
                } catch {
                  toast.error("Could not delete replay.");
                  setDeleting(false);
                  setConfirmDelete(false);
                }
              }}
              disabled={deleting}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border-[3px] border-[#ff6b5a] bg-[#ff6b5a] px-4 font-dashboard text-xs font-bold text-white shadow-[0_3px_0_#c0392b] transition-all hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Trash2 size={13} />
              {deleting ? "Deleting..." : "Confirm delete"}
            </button>
          )}
          <button
            onClick={async () => {
              setArchiving(true);
              try {
                if (isArchived) {
                  await unarchiveReplay({ id: replayId });
                  toast.success("Replay restored.");
                } else {
                  await archiveReplay({ id: replayId });
                  toast.success("Replay archived.");
                }
              } catch {
                toast.error("Could not update replay.");
              } finally {
                setArchiving(false);
              }
            }}
            disabled={archiving}
            className={`inline-flex h-10 items-center gap-1.5 rounded-xl border-[3px] border-line px-4 font-dashboard text-xs font-bold shadow-[0_3px_0_#000] transition-all hover:-translate-y-0.5 disabled:opacity-60 ${
              isArchived ? "bg-accent" : "bg-[#e0d4f7]"
            }`}
            title={isArchived ? "Restore replay" : "Archive replay"}
          >
            {isArchived ? <ArchiveRestore size={13} /> : <Archive size={13} />}
            {archiving ? "..." : isArchived ? "Restore" : "Archive"}
          </button>
          <Link
            href={`/r/${replayId}`}
            target="_blank"
            className="brutal-btn-secondary inline-flex h-10 items-center gap-2 px-4 font-dashboard text-xs"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline">Preview</span>
          </Link>
          <button
            onClick={handleCopyPublicLink}
            className="brutal-btn-primary inline-flex h-10 cursor-pointer items-center gap-2 px-4 font-dashboard text-xs"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      </div>

      {isArchived && (
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3 rounded-xl border-[3px] border-line bg-[#e0d4f7] px-5 py-4 shadow-[0_3px_0_#000]">
          <div className="flex items-center gap-3">
            <Archive size={15} />
            <p className="font-dashboard text-xs font-bold sm:text-sm">
              This replay is archived. It&apos;s hidden from public view. Restore it to make it accessible again.
            </p>
          </div>
          <button
            onClick={async () => {
              setArchiving(true);
              try {
                await unarchiveReplay({ id: replayId });
                toast.success("Replay restored.");
              } catch {
                toast.error("Could not restore replay.");
              } finally {
                setArchiving(false);
              }
            }}
            disabled={archiving}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border-[3px] border-line bg-white px-3 font-dashboard text-[11px] font-bold shadow-[0_3px_0_#000] transition-all hover:-translate-y-0.5 disabled:opacity-60"
          >
            <ArchiveRestore size={12} />
            {archiving ? "Restoring..." : "Restore"}
          </button>
        </div>
      )}

      {isLive && !isArchived && (
        <div className="mb-7 rounded-xl border-[3px] border-line bg-accent-amber px-5 py-4 shadow-[0_3px_0_#000]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-[#1a1a1a]" />
              <p className="font-dashboard text-xs font-bold sm:text-sm">
                Your replay is live. Copy the link and post it in your bio, stories, or anywhere you share.
              </p>
            </div>
            <button
              onClick={handleCopyPublicLink}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border-[3px] border-line bg-white px-3 font-dashboard text-[11px] font-bold shadow-[0_3px_0_#000] transition-all hover:-translate-y-0.5"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
          {showShareTip ? (
            <p className="share-hint-pop mt-2 pl-5 text-xs font-semibold text-text-muted">
              Paste it into Instagram, TikTok bio, WhatsApp, or Facebook.
            </p>
          ) : null}
        </div>
      )}

      {/* ── Stats row ────────────────────────────────────── */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Products" value={products?.length ?? 0} tone="bg-accent" />
        <StatCard icon={UserRound} label="Subscribers" value={subscribers?.length ?? 0} tone="bg-[#ff9ecd]" />
        <StatCard icon={ShoppingBag} label="Orders" value={orders?.length ?? 0} tone="bg-[#ffbc8c]" />
        <StatCard
          icon={Clock}
          label="Time left"
          value={isLive && replay.expiresAt ? timeLeft(replay.expiresAt, renderNow) : "Ended"}
          tone="bg-accent-amber"
        />
      </div>

      {/* ── Two-column layout ────────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        {/* Left column — Preview + Settings */}
        <div className="space-y-5">
          {/* Video preview */}
          <div className="rounded-2xl border-[3px] border-line bg-white p-5 shadow-[0_4px_0_#000]">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-dashboard text-xs font-bold uppercase tracking-[0.08em] text-text-muted">
                Replay preview
              </p>
              {isLive && (
                <span className="flex items-center gap-1.5 rounded-full border-2 border-line bg-accent px-2.5 py-0.5 font-dashboard text-[10px] font-bold shadow-[0_2px_0_#000]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1a1a1a]" />
                  LIVE
                </span>
              )}
            </div>
            <EmbedPreview url={replay.url} />
          </div>

          {/* Revenue card */}
          <div className="relative overflow-hidden rounded-2xl border-[3px] border-line bg-accent p-6 shadow-[0_4px_0_#000]">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full border-[3px] border-line/20 bg-white/30"
            />
            <p className="font-dashboard text-xs font-bold uppercase tracking-[0.08em] text-text-muted">
              Total revenue
            </p>
            <p className="mt-2 font-heading text-5xl font-black tracking-tight">${revenue.toFixed(2)}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full border-2 border-line bg-white/60 px-2.5 py-0.5 font-dashboard text-[10px] font-bold shadow-[0_1px_0_#000]">
                {orders?.length ?? 0} order{(orders?.length ?? 0) !== 1 ? "s" : ""}
              </span>
              <span className="rounded-full border-2 border-line bg-white/60 px-2.5 py-0.5 font-dashboard text-[10px] font-bold shadow-[0_1px_0_#000]">
                {products?.length ?? 0} product{(products?.length ?? 0) !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Settings */}
          <ReplaySettingsCard replay={replay} updateReplay={updateReplay} toast={toast} />
        </div>

        {/* Right column — Tabs */}
        <div className="space-y-5">
          {/* Tab bar */}
          <div className="rounded-2xl border-[3px] border-line bg-white p-1.5 shadow-[0_4px_0_#000]">
            <div className="grid grid-cols-4 gap-1.5">
              {(["products", "subscribers", "orders", "campaigns"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setTab(item)}
                  className={`cursor-pointer rounded-xl px-3 py-2.5 font-dashboard text-[11px] font-bold uppercase tracking-[0.06em] transition-all ${
                    tab === item
                      ? "-translate-y-0.5 border-[3px] border-line bg-accent shadow-[0_3px_0_#000]"
                      : "border-[3px] border-transparent hover:bg-panel-strong"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          {tab === "products" && (
            <ProductsTab
              replayId={replayId}
              products={products ?? []}
              addProduct={addProduct}
              removeProduct={removeProduct}
              canManageProducts={sellerSubscription?.hasAccess ?? false}
              billingLoading={sellerSubscription === undefined}
              toast={toast}
            />
          )}
          {tab === "subscribers" && <SubscribersTab subscribers={subscribers ?? []} />}
          {tab === "orders" && <OrdersTab orders={orders ?? []} products={products ?? []} />}
          {tab === "campaigns" && (
            <CampaignsTab replayId={replayId} subscriberCount={subscribers?.length ?? 0} toast={toast} />
          )}
        </div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/*  Shell                                                               */
/* ------------------------------------------------------------------ */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="dashboard-layout page-fade-in relative min-h-screen bg-bg">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-24 h-64 w-64 rounded-full bg-[#acf8e0]/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-96 h-56 w-56 rounded-full bg-[#ff9ecd]/15 blur-3xl"
      />

      <header className="relative z-10 border-b-[3px] border-line bg-panel/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-line bg-[#ffbc8c] shadow-[0_3px_0_#000]">
              <RadioTower size={16} />
            </div>
            <div>
              <p className="font-heading text-xl font-black leading-none sm:text-2xl">
                ReplaySell
              </p>
              <p className="font-dashboard text-[10px] font-semibold text-text-muted">
                Replay workspace
              </p>
            </div>
          </Link>
          <AuthUserChip compact />
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        {children}
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat card                                                           */
/* ------------------------------------------------------------------ */

function StatCard({
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
    <div className={`relative overflow-hidden rounded-2xl border-[3px] border-line p-5 shadow-[0_4px_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_0_#000] ${tone}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/20"
      />
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-line bg-white/60 shadow-[0_1px_0_#000]">
          <Icon size={14} />
        </div>
        <span className="font-dashboard text-[11px] font-bold uppercase tracking-[0.06em] text-text-muted">
          {label}
        </span>
      </div>
      <p className="mt-3 font-heading text-4xl font-black leading-none">{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Replay settings                                                     */
/* ------------------------------------------------------------------ */

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
  const [url, setUrl] = useState(replay.url);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(replay.title ?? "");
  }, [replay.title]);

  useEffect(() => {
    setUrl(replay.url);
    setUrlError(null);
  }, [replay.url]);

  async function handleSave() {
    const check = validateReplayUrl(url);
    if (!check.valid || !check.parsed) {
      const message = check.message ?? "Enter a valid URL.";
      setUrlError(message);
      toast.error(message);
      return;
    }

    setSaving(true);
    try {
      await updateReplay({
        id: replay._id,
        title: title.trim() || undefined,
        url: check.parsed.normalizedUrl,
      });
      setUrlError(null);
      toast.success("Replay settings saved.");
    } catch {
      toast.error("Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border-[3px] border-line bg-white p-5 shadow-[0_4px_0_#000]">
      <p className="mb-4 font-dashboard text-xs font-bold uppercase tracking-[0.08em] text-text-muted">
        Settings
      </p>
      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block font-dashboard text-[11px] font-bold uppercase tracking-[0.06em] text-text-muted">
            Replay title
          </label>
          <input
            placeholder="Replay title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="brutal-input"
          />
        </div>
        <div className="space-y-2">
          <label className="block font-dashboard text-[11px] font-bold uppercase tracking-[0.06em] text-text-muted">
            Replay link
          </label>
          <input
            type="url"
            placeholder="https://www.facebook.com/reel/..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (urlError) {
                setUrlError(null);
              }
            }}
            className="brutal-input"
          />
          <p className={`text-xs font-semibold ${urlError ? "text-accent-magenta" : "text-text-muted"}`}>
            {urlError ??
              "Supports YouTube, TikTok, Vimeo, and Facebook embeds. Instagram and Whatnot save as link cards."}
          </p>
          <EmbedPreview url={url} className="mt-1" />
        </div>
        <div className="rounded-xl border-2 border-line bg-panel-strong px-4 py-3">
          <div className="grid gap-1 text-xs font-semibold text-text-muted sm:grid-cols-2">
            <p>Created {formatTimestamp(replay.createdAt)}</p>
            <p>Expires {replay.expiresAt != null ? formatTimestamp(replay.expiresAt) : "—"}</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="brutal-btn-primary inline-flex h-10 items-center gap-2 px-5 text-sm disabled:opacity-60"
        >
          <Save size={14} />
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Products tab                                                        */
/* ------------------------------------------------------------------ */

function ProductsTab({
  replayId,
  products,
  addProduct,
  removeProduct,
  canManageProducts,
  billingLoading,
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
  canManageProducts: boolean;
  billingLoading: boolean;
  toast: { success: (m: string) => void; error: (m: string) => void };
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [adding, setAdding] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (billingLoading) return;
    if (!canManageProducts) {
      toast.error("Start your seller trial first to add products.");
      return;
    }
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
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not add product."));
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Add form */}
      <div className="rounded-2xl border-[3px] border-line bg-white p-5 shadow-[0_4px_0_#000]">
        <p className="mb-4 flex items-center gap-2 font-heading text-lg font-black">
          <Plus size={16} /> Add product
        </p>
        {!canManageProducts && !billingLoading && (
          <p className="mb-4 rounded-xl border-2 border-line bg-panel-strong px-3 py-2 text-xs font-semibold text-text-muted">
            Billing required: your seller plan must be trialing or active to add
            products.
          </p>
        )}
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              placeholder="Product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!canManageProducts || billingLoading}
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
              disabled={!canManageProducts || billingLoading}
              required
              className="brutal-input"
            />
            <input
              type="number"
              min="0"
              placeholder="Stock qty"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              disabled={!canManageProducts || billingLoading}
              required
              className="brutal-input"
            />
          </div>
          <button
            type="submit"
            disabled={adding || !canManageProducts || billingLoading}
            className="brutal-btn-primary inline-flex h-10 items-center gap-2 px-5 text-sm disabled:opacity-60"
          >
            <Plus size={14} />
            {billingLoading
              ? "Checking plan..."
              : adding
                ? "Adding..."
                : !canManageProducts
                  ? "Billing required"
                  : "Add product"}
          </button>
        </form>
      </div>

      {/* Product list */}
      {products.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-line/30 px-6 py-12 text-center">
          <Package size={28} className="mx-auto mb-3 text-text-muted" />
          <p className="font-heading text-lg font-bold text-text-muted">No products yet</p>
          <p className="mt-1 text-xs font-semibold text-text-muted">
            Add your first product above to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div
              key={p._id}
              className="group flex items-center gap-4 rounded-2xl border-[3px] border-line bg-white p-5 shadow-[0_4px_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_0_#000]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-[3px] border-line bg-accent-amber shadow-[0_2px_0_#000]">
                <Package size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-xl font-black">{p.name}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="font-heading text-lg font-black text-text">
                    ${p.price.toFixed(2)}
                  </span>
                  <span className="rounded-full border-2 border-line bg-accent px-2.5 py-0.5 font-dashboard text-[10px] font-bold shadow-[0_1px_0_#000]">
                    {p.stock} in stock
                  </span>
                  <span className="rounded-full border-2 border-line bg-[#ff9ecd] px-2.5 py-0.5 font-dashboard text-[10px] font-bold shadow-[0_1px_0_#000]">
                    {p.sold} sold
                  </span>
                </div>
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
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[3px] border-line bg-[#fff3f0] shadow-[0_3px_0_#000] transition-all hover:-translate-y-0.5 hover:bg-[#ffe5df]"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Subscribers tab                                                     */
/* ------------------------------------------------------------------ */

function SubscribersTab({ subscribers }: { subscribers: Doc<"subscribers">[] }) {
  return (
    <div className="space-y-3">
      {subscribers.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-line/30 px-6 py-12 text-center">
          <UserRound size={28} className="mx-auto mb-3 text-text-muted" />
          <p className="font-heading text-lg font-bold text-text-muted">No subscribers yet</p>
          <p className="mt-1 text-xs font-semibold text-text-muted">
            Share your replay link to start capturing subscribers.
          </p>
        </div>
      ) : (
        subscribers.map((sub) => (
          <div
            key={sub._id}
            className="flex items-start gap-4 rounded-2xl border-[3px] border-line bg-white p-5 shadow-[0_4px_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_0_#000]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-[3px] border-line bg-[#ff9ecd] shadow-[0_2px_0_#000]">
              <UserRound size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-lg font-black leading-tight">{sub.email}</p>
              <p className="mt-1 text-xs font-semibold text-text-muted">
                {sub.phone ? `${sub.phone} · ` : ""}
                {sub.smsConsent ? "SMS opt-in" : "Email only"} · {formatTimestamp(sub.createdAt)}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <PreferenceChip enabled={sub.notifyTimer ?? true} label="Timer" />
                <PreferenceChip enabled={sub.notifyStock ?? true} label="Stock" />
                <PreferenceChip enabled={sub.notifyPriceChange ?? true} label="Price" />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Orders tab                                                          */
/* ------------------------------------------------------------------ */

function OrdersTab({ orders, products }: { orders: Doc<"orders">[]; products: Doc<"products">[] }) {
  const productMap = new Map(products.map((p) => [p._id, p]));

  return (
    <div className="space-y-3">
      {orders.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-line/30 px-6 py-12 text-center">
          <ShoppingBag size={28} className="mx-auto mb-3 text-text-muted" />
          <p className="font-heading text-lg font-bold text-text-muted">No orders yet</p>
          <p className="mt-1 text-xs font-semibold text-text-muted">
            Orders will appear here once buyers start purchasing.
          </p>
        </div>
      ) : (
        orders.map((order) => {
          const product = productMap.get(order.productId);
          return (
            <div
              key={order._id}
              className="flex items-center gap-4 rounded-2xl border-[3px] border-line bg-white p-5 shadow-[0_4px_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_0_#000]"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-[3px] border-line shadow-[0_2px_0_#000] ${
                  order.status === "completed" ? "bg-accent" : "bg-accent-amber"
                }`}
              >
                <ShoppingBag size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-lg font-black leading-tight">
                  {product?.name ?? "Unknown product"} &times; {order.quantity}
                </p>
                <p className="mt-1 text-xs font-semibold text-text-muted">
                  {order.email} · {formatTimestamp(order.createdAt)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span className="font-heading text-lg font-black">
                  ${order.total.toFixed(2)}
                </span>
                <span
                  className={`rounded-full border-2 border-line px-2.5 py-0.5 font-dashboard text-[10px] font-bold uppercase shadow-[0_2px_0_#000] ${
                    order.status === "completed" ? "bg-accent" : "bg-accent-amber"
                  }`}
                >
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

/* ------------------------------------------------------------------ */
/*  Campaigns tab                                                       */
/* ------------------------------------------------------------------ */

function CampaignsTab({
  replayId,
  subscriberCount,
  toast,
}: {
  replayId: Id<"replays">;
  subscriberCount: number;
  toast: { success: (m: string) => void; error: (m: string) => void };
}) {
  const [sending, setSending] = useState<string | null>(null);

  const templates = [
    { key: "live_now", label: "Replay is live now", description: "Notify all subscribers the replay is available" },
    { key: "low_stock", label: "Only X items left", description: "Create urgency with low-stock alerts" },
    { key: "closing_soon", label: "Replay closes in 6 hours", description: "Last-chance countdown reminder" },
  ];

  async function handleSend(templateKey: string) {
    if (subscriberCount === 0) {
      toast.error("No subscribers to send to.");
      return;
    }
    setSending(templateKey);
    try {
      const res = await fetch("/api/campaigns/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replayId, template: templateKey }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to send campaign.");
        return;
      }
      toast.success(`Sent to ${data.sent} subscriber${data.sent !== 1 ? "s" : ""}${data.failed ? ` (${data.failed} failed)` : ""}.`);
    } catch {
      toast.error("Failed to send campaign.");
    } finally {
      setSending(null);
    }
  }

  return (
    <div className="rounded-2xl border-[3px] border-line bg-white p-5 shadow-[0_4px_0_#000] sm:p-6">
      <div className="mb-5">
        <p className="flex items-center gap-2 font-heading text-lg font-black">
          <Bell size={18} /> Campaign templates
        </p>
        <p className="mt-1 text-sm font-semibold text-text-muted">
          {subscriberCount} subscriber{subscriberCount !== 1 ? "s" : ""} available for send.
        </p>
      </div>

      <div className="space-y-3">
        {templates.map((template) => (
          <button
            key={template.key}
            onClick={() => handleSend(template.key)}
            disabled={sending !== null}
            className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl border-[3px] border-line bg-panel-strong px-5 py-4 text-left shadow-[0_3px_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_0_#000] disabled:opacity-60"
          >
            <div>
              <p className="font-heading text-base font-bold">{template.label}</p>
              <p className="mt-0.5 text-xs font-semibold text-text-muted">{template.description}</p>
            </div>
            {sending === template.key ? (
              <span className="shrink-0 font-dashboard text-[10px] font-bold text-text-muted">Sending...</span>
            ) : (
              <Send size={16} className="shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small components                                                    */
/* ------------------------------------------------------------------ */

function PreferenceChip({ enabled, label }: { enabled: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border-2 border-line px-3 py-1 font-dashboard text-[10px] font-bold shadow-[0_2px_0_#000] ${
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

function getErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error) || !error.message) {
    return fallback;
  }

  const stripped = error.message.replace(
    /^(\[CONVEX [^\]]+\]\s*)?Uncaught Error:\s*/i,
    "",
  );

  return stripped || fallback;
}
