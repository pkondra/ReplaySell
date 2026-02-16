"use client";

import type { Doc, Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  Bell,
  BellRing,
  Check,
  Clock,
  Copy,
  LogIn,
  Package,
  ShoppingBag,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

import { api } from "@convex/_generated/api";
import { EmbedPreview } from "@/components/replay/embed-preview";
import { useToast } from "@/components/ui/toast-provider";

/* ------------------------------------------------------------------ */
/*  Public replay page (client)                                         */
/* ------------------------------------------------------------------ */

export default function PublicReplayClient() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const replayId = params.id as Id<"replays">;
  const toast = useToast();

  const { data: session, status } = useSession();
  const isSignedIn = status === "authenticated";
  const buyerEmail = session?.user?.email ?? "";
  const accountUserId = session?.user?.id;

  const replay = useQuery(api.replays.getPublicReplay, { id: replayId });
  const products = useQuery(api.products.listByReplay, { replayId });
  const subscribe = useMutation(api.subscribers.subscribe);
  const placeOrder = useMutation(api.orders.placeOrder);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [notifyTimer, setNotifyTimer] = useState(true);
  const [notifyStock, setNotifyStock] = useState(true);
  const [notifyPriceChange, setNotifyPriceChange] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [nowTs, setNowTs] = useState(() => Date.now());
  const [copied, setCopied] = useState(false);
  const [showShareTip, setShowShareTip] = useState(false);

  useEffect(() => {
    if (!replay?.expiresAt) return;

    function tick() {
      const now = Date.now();
      setNowTs(now);
      const diff = (replay?.expiresAt ?? 0) - now;
      if (diff <= 0) {
        setCountdown("00:00:00");
        return;
      }
      const h = String(Math.floor(diff / 3_600_000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60_000) / 1000)).padStart(2, "0");
      setCountdown(`${h}:${m}:${s}`);
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [replay?.expiresAt]);

  useEffect(() => {
    if (isSignedIn && buyerEmail) {
      setEmail((current) => current || buyerEmail);
    }
  }, [isSignedIn, buyerEmail]);

  const signInHref = useMemo(
    () => `/sign-in?next=${encodeURIComponent(pathname)}`,
    [pathname],
  );
  const publicShareUrl =
    typeof window !== "undefined" ? window.location.href : `/r/${replayId}`;

  async function handleCopyShareLink() {
    try {
      await navigator.clipboard.writeText(publicShareUrl);
      setCopied(true);
      setShowShareTip(true);
      toast.success("Replay link copied.");
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setShowShareTip(false), 2600);
    } catch {
      toast.error("Could not copy replay link.");
    }
  }

  /* ── Loading state ─────────────────────────────────────── */
  if (replay === undefined) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 animate-pulse items-center justify-center rounded-xl border-[3px] border-line bg-accent shadow-[0_4px_0_#000]">
              <Package size={20} />
            </div>
            <p className="font-heading text-lg font-bold text-text-muted">Loading replay...</p>
          </div>
        </div>
      </PageShell>
    );
  }

  /* ── Not found ─────────────────────────────────────────── */
  if (!replay) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="mx-auto max-w-sm text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-line bg-panel-strong shadow-[0_6px_0_#000]">
              <Package size={26} />
            </div>
            <h2 className="font-heading text-3xl font-black">Replay not found</h2>
            <p className="mt-2 text-sm font-semibold text-text-muted">
              This replay may have been removed or the link is incorrect.
            </p>
            <Link
              href="/"
              className="brutal-btn-secondary mt-5 inline-flex h-11 items-center px-6 font-dashboard text-sm"
            >
              Back to ReplaySell
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const isExpired = replay.status !== "live" || (replay.expiresAt ?? 0) <= nowTs;

  /* ── Expired state ─────────────────────────────────────── */
  if (isExpired) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="mx-auto max-w-md text-center">
            <div className="relative mx-auto mb-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border-[3px] border-line bg-panel-strong shadow-[0_6px_0_#000]">
                <Clock size={32} />
              </div>
              <span className="absolute -right-2 -top-2 rounded-full border-2 border-line bg-[#ff6b5a] px-2.5 py-0.5 font-dashboard text-[10px] font-bold text-white shadow-[0_2px_0_#000]">
                Ended
              </span>
            </div>
            <h2 className="font-heading text-4xl font-black">This replay has ended</h2>
            <p className="mt-3 text-base font-semibold text-text-muted">
              The selling window for this replay has closed. Check back later or follow the seller for future replays.
            </p>
            <Link
              href="/"
              className="brutal-btn-secondary mt-6 inline-flex h-11 items-center px-6 font-dashboard text-sm"
            >
              Back to ReplaySell
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  /* ── Gated / subscribe view ────────────────────────────── */
  if (!unlocked) {
    return (
      <PageShell
        countdown={countdown}
        showShareStrip
        onCopyLink={handleCopyShareLink}
        copied={copied}
        showShareTip={showShareTip}
      >
        <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center py-8">
          <div className="w-full space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-line bg-accent shadow-[0_6px_0_#000]">
                <BellRing size={26} />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-line bg-[#ff6b5a] font-dashboard text-[9px] font-bold text-white">
                  !
                </span>
              </div>
              <h2 className="font-heading text-3xl font-black sm:text-4xl">
                Unlock this replay
              </h2>
              <p className="mt-2 text-sm font-semibold text-text-muted">
                Subscribe to get countdown, stock, and price-change alerts.
              </p>
              <div className="mx-auto mt-3 flex items-center justify-center gap-3">
                <span className="inline-flex items-center gap-1 rounded-full border-2 border-line bg-accent px-2.5 py-1 font-dashboard text-[10px] font-bold shadow-[0_1px_0_#000]">
                  <Check size={10} strokeWidth={3} /> Free to browse
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border-2 border-line bg-[#ff9ecd] px-2.5 py-1 font-dashboard text-[10px] font-bold shadow-[0_1px_0_#000]">
                  <Check size={10} strokeWidth={3} /> Instant alerts
                </span>
              </div>
            </div>

            {/* Form card */}
            <div className="rounded-2xl border-[3px] border-line bg-white p-6 shadow-[0_6px_0_#000] sm:p-8">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!email.trim()) return;
                  setSubscribing(true);
                  try {
                    await subscribe({
                      replayId,
                      email: email.trim(),
                      phone: phone.trim() || undefined,
                      smsConsent,
                      accountUserId: isSignedIn ? accountUserId : undefined,
                      notifyTimer,
                      notifyStock,
                      notifyPriceChange,
                    });
                    setUnlocked(true);
                  } catch {
                    toast.error("Could not subscribe. Please try again.");
                  } finally {
                    setSubscribing(false);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="mb-1.5 block font-dashboard text-xs font-bold uppercase tracking-[0.08em] text-text-muted">
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="brutal-input"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-dashboard text-xs font-bold uppercase tracking-[0.08em] text-text-muted">
                    Phone <span className="normal-case tracking-normal text-text-muted">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="brutal-input"
                  />
                </div>

                {phone ? (
                  <label className="flex items-center gap-2.5 rounded-xl border-2 border-line bg-panel-strong px-4 py-3 text-sm font-semibold">
                    <input
                      type="checkbox"
                      checked={smsConsent}
                      onChange={(e) => setSmsConsent(e.target.checked)}
                      className="h-4 w-4 accent-[#1a1a1a]"
                    />
                    I agree to receive SMS reminders
                  </label>
                ) : null}

                {/* Notification preferences */}
                <div>
                  <p className="mb-2 font-dashboard text-xs font-bold uppercase tracking-[0.08em] text-text-muted">
                    Alert preferences
                  </p>
                  <div className="space-y-2">
                    <PreferenceToggle
                      icon={Timer}
                      label="Timer reminders"
                      description="Get notified before the replay closes"
                      checked={notifyTimer}
                      onChange={setNotifyTimer}
                    />
                    <PreferenceToggle
                      icon={Package}
                      label="Stock updates"
                      description="Know when items are restocked"
                      checked={notifyStock}
                      onChange={setNotifyStock}
                    />
                    <PreferenceToggle
                      icon={Bell}
                      label="Price changes"
                      description="Alerts when prices drop"
                      checked={notifyPriceChange}
                      onChange={setNotifyPriceChange}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={subscribing}
                  className="brutal-btn-primary h-12 w-full font-heading text-base disabled:opacity-60"
                >
                  {subscribing ? "Subscribing..." : "Watch replay"}
                </button>
              </form>

              {!isSignedIn && (
                <p className="mt-4 text-center text-xs font-semibold text-text-muted">
                  You can watch now. You&apos;ll be prompted to create an account before buying.
                </p>
              )}
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  /* ── Unlocked replay view ──────────────────────────────── */
  const inStockProducts = products?.filter((p) => p.stock > 0) ?? [];
  const soldOutProducts = products?.filter((p) => p.stock <= 0) ?? [];

  return (
    <PageShell
      countdown={countdown}
      showShareStrip
      onCopyLink={handleCopyShareLink}
      copied={copied}
      showShareTip={showShareTip}
    >
      <div className="space-y-8">
        {/* Title */}
        {replay.title ? (
          <h1 className="font-heading text-3xl font-black tracking-tight sm:text-4xl">
            {replay.title}
          </h1>
        ) : null}

        {/* Main content grid */}
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          {/* Left — Video */}
          <div className="space-y-4">
            <EmbedPreview url={replay.url} />
          </div>

          {/* Right — Products + Alerts */}
          <div className="space-y-5">
            {/* Products */}
            <div className="rounded-2xl border-[3px] border-line bg-white p-5 shadow-[0_4px_0_#000] sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <p className="flex items-center gap-2.5 font-heading text-xl font-black">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border-[3px] border-line bg-accent shadow-[0_2px_0_#000]">
                    <ShoppingBag size={16} />
                  </div>
                  Products
                </p>
                <span className="rounded-full border-2 border-line bg-accent px-3 py-1 font-dashboard text-xs font-bold shadow-[0_2px_0_#000]">
                  {products?.length ?? 0} item{(products?.length ?? 0) !== 1 ? "s" : ""}
                </span>
              </div>

              {!products || products.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-line/30 px-4 py-8 text-center">
                  <Package size={24} className="mx-auto mb-2 text-text-muted" />
                  <p className="text-sm font-semibold text-text-muted">
                    No products listed yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inStockProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      replayId={replayId}
                      email={email}
                      isSignedIn={isSignedIn}
                      signInHref={signInHref}
                      placeOrder={placeOrder}
                      toast={toast}
                    />
                  ))}
                  {soldOutProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      replayId={replayId}
                      email={email}
                      isSignedIn={isSignedIn}
                      signInHref={signInHref}
                      placeOrder={placeOrder}
                      toast={toast}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Alerts enabled */}
            <div className="relative overflow-hidden rounded-2xl border-[3px] border-line bg-[#ff9ecd] p-5 shadow-[0_4px_0_#000]">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/20"
              />
              <p className="mb-3 flex items-center gap-2 font-heading text-lg font-black">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-line bg-white/60 shadow-[0_1px_0_#000]">
                  <Bell size={14} />
                </div>
                Your alerts
              </p>
              <div className="flex flex-wrap gap-2">
                <AlertChip label="Timer" active={notifyTimer} />
                <AlertChip label="Stock" active={notifyStock} />
                <AlertChip label="Price" active={notifyPriceChange} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Page shell                                                          */
/* ------------------------------------------------------------------ */

function PageShell({
  children,
  countdown,
  showShareStrip = false,
  onCopyLink,
  copied = false,
  showShareTip = false,
}: {
  children: React.ReactNode;
  countdown?: string;
  showShareStrip?: boolean;
  onCopyLink?: () => void;
  copied?: boolean;
  showShareTip?: boolean;
}) {
  return (
    <div className="dashboard-layout relative min-h-screen bg-bg">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-48 h-72 w-72 rounded-full bg-[#acf8e0]/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-48 h-64 w-64 rounded-full bg-[#ff9ecd]/10 blur-3xl"
      />

      <nav className="relative z-10 border-b-[3px] border-line bg-panel/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-line bg-[#ffbc8c] shadow-[0_3px_0_#000]">
              <Package size={16} />
            </div>
            <div>
              <p className="font-heading text-xl font-black leading-none sm:text-2xl">
                ReplaySell
              </p>
              <p className="font-dashboard text-[10px] font-semibold text-text-muted">
                Shop this replay
              </p>
            </div>
          </Link>
        </div>
      </nav>

      {showShareStrip && onCopyLink ? (
        <div className="relative z-10 border-b-[3px] border-line bg-accent-amber">
          <div className="mx-auto max-w-5xl px-5 py-2.5 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-dashboard text-xs font-bold">
                Your replay is live. Copy the link and post it in your bio, stories, or anywhere you share.
              </p>
              <button
                onClick={onCopyLink}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border-[3px] border-line bg-white px-3 font-dashboard text-[11px] font-bold shadow-[0_2px_0_#000] transition-all hover:-translate-y-0.5"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
            {showShareTip ? (
              <p className="share-hint-pop mt-1.5 text-xs font-semibold text-text-muted">
                Paste it into Instagram, TikTok bio, WhatsApp, or Facebook.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {countdown && (
        <div className="relative z-10 border-b-[3px] border-line bg-[#1a1a1a] text-white">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-3.5 sm:px-8">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff6b5a]">
                <Timer size={15} />
              </div>
              <span className="font-heading text-sm font-bold sm:text-base">
                Replay closes in
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff6b5a]" />
              <span className="font-dashboard text-2xl font-black tabular-nums sm:text-3xl">
                {countdown}
              </span>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
        {children}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Product card                                                        */
/* ------------------------------------------------------------------ */

function ProductCard({
  product,
  replayId,
  email,
  isSignedIn,
  signInHref,
  placeOrder,
  toast,
}: {
  product: Doc<"products">;
  replayId: Id<"replays">;
  email: string;
  isSignedIn: boolean;
  signInHref: string;
  placeOrder: (args: {
    replayId: Id<"replays">;
    productId: Id<"products">;
    email: string;
    quantity: number;
  }) => Promise<Id<"orders">>;
  toast: { success: (m: string) => void; error: (m: string) => void };
}) {
  const [buying, setBuying] = useState(false);
  const outOfStock = product.stock <= 0;

  async function handleBuy() {
    if (!isSignedIn) return;
    setBuying(true);
    try {
      await placeOrder({
        replayId,
        productId: product._id,
        email,
        quantity: 1,
      });
      toast.success(`Purchased ${product.name}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place order.");
    } finally {
      setBuying(false);
    }
  }

  return (
    <div
      className={`group rounded-xl border-[3px] border-line p-4 shadow-[0_3px_0_#000] transition-all sm:p-5 ${
        outOfStock
          ? "bg-panel-strong opacity-60"
          : "bg-white hover:-translate-y-0.5 hover:shadow-[0_5px_0_#000]"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-[3px] border-line shadow-[0_2px_0_#000] ${
            outOfStock ? "bg-panel-strong" : "bg-accent-amber"
          }`}
        >
          <ShoppingBag size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-lg font-extrabold leading-tight">{product.name}</p>
          <div className="mt-1.5 flex items-center gap-3">
            <span className="font-heading text-xl font-black">${product.price.toFixed(2)}</span>
            <span
              className={`rounded-full border-2 border-line px-2.5 py-0.5 font-dashboard text-[10px] font-bold shadow-[0_1px_0_#000] ${
                outOfStock ? "bg-panel-strong" : product.stock <= 5 ? "bg-[#ff6b5a]/20" : "bg-accent"
              }`}
            >
              {outOfStock ? "Sold out" : product.stock <= 5 ? `Only ${product.stock} left` : `${product.stock} left`}
            </span>
          </div>
        </div>

        {!isSignedIn ? (
          <Link
            href={signInHref}
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border-[3px] border-line bg-white px-4 font-dashboard text-xs font-bold shadow-[0_3px_0_#000] transition-all hover:-translate-y-0.5"
          >
            <LogIn size={13} />
            Sign in to buy
          </Link>
        ) : (
          <button
            onClick={handleBuy}
            disabled={buying || outOfStock || !email}
            className="brutal-btn-primary h-10 shrink-0 px-5 text-sm disabled:opacity-50"
          >
            {buying ? "..." : outOfStock ? "Sold out" : "Buy now"}
          </button>
        )}
      </div>

      {!isSignedIn && (
        <p className="mt-2.5 pl-[4.5rem] text-xs font-semibold text-text-muted">
          Create an account to buy and track your order history.
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small components                                                    */
/* ------------------------------------------------------------------ */

function PreferenceToggle({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border-[3px] border-line px-4 py-3 shadow-[0_2px_0_#000] transition-all ${
        checked ? "bg-accent" : "bg-white"
      }`}
    >
      <Icon size={16} className="shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-bold">{label}</p>
        <p className="text-[11px] font-semibold text-text-muted">{description}</p>
      </div>
      <div
        className={`flex h-6 w-10 shrink-0 items-center rounded-full border-2 border-line p-0.5 transition-colors ${
          checked ? "bg-[#1a1a1a]" : "bg-panel-strong"
        }`}
      >
        <div
          className={`h-4 w-4 rounded-full border-2 border-line bg-white shadow-sm transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
    </label>
  );
}

function AlertChip({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-2 border-line px-3.5 py-1.5 font-dashboard text-xs font-bold shadow-[0_2px_0_#000] transition-all ${
        active ? "bg-white" : "bg-white/40 opacity-60"
      }`}
    >
      {active ? (
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1a1a1a]">
          <Check size={10} strokeWidth={3} className="text-white" />
        </span>
      ) : (
        <span className="h-4 w-4 rounded-full border-2 border-line" />
      )}
      {label}
    </span>
  );
}
