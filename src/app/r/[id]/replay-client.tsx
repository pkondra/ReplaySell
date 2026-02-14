"use client";

import type { Doc, Id } from "@convex/_generated/dataModel";
import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import {
  Bell,
  BellRing,
  Check,
  Clock,
  LogIn,
  Mail,
  Package,
  Phone,
  ShoppingBag,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
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

  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const buyerEmail = user?.primaryEmailAddress?.emailAddress ?? "";

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
    () => `/sign-in?redirect_url=${encodeURIComponent(pathname)}`,
    [pathname],
  );

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
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-line bg-panel-strong shadow-[0_4px_0_#000]">
              <Package size={24} />
            </div>
            <h2 className="font-heading text-3xl font-black">Replay not found</h2>
            <p className="mt-2 text-sm font-semibold text-text-muted">
              This replay may have been removed or the link is incorrect.
            </p>
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
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-line bg-panel-strong shadow-[0_6px_0_#000]">
              <Clock size={28} />
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
      <PageShell countdown={countdown}>
        <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center py-8">
          <div className="w-full space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-line bg-accent shadow-[0_6px_0_#000]">
                <BellRing size={24} />
              </div>
              <h2 className="font-heading text-3xl font-black sm:text-4xl">
                Unlock this replay
              </h2>
              <p className="mt-2 text-sm font-semibold text-text-muted">
                Subscribe to get countdown, stock, and price-change alerts.
              </p>
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
                      accountUserId: isSignedIn ? user?.id : undefined,
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
    <PageShell countdown={countdown}>
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
              <div className="mb-4 flex items-center justify-between">
                <p className="flex items-center gap-2 font-heading text-xl font-black">
                  <ShoppingBag size={18} />
                  Products
                </p>
                <span className="rounded-full border-2 border-line bg-accent px-3 py-1 font-dashboard text-xs font-bold shadow-[0_2px_0_#000]">
                  {products?.length ?? 0}
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
                      isSignedIn={Boolean(isSignedIn)}
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
                      isSignedIn={Boolean(isSignedIn)}
                      signInHref={signInHref}
                      placeOrder={placeOrder}
                      toast={toast}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Alerts enabled */}
            <div className="rounded-2xl border-[3px] border-line bg-[#ff9ecd] p-5 shadow-[0_4px_0_#000]">
              <p className="mb-3 flex items-center gap-2 font-heading text-lg font-black">
                <Bell size={16} />
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
}: {
  children: React.ReactNode;
  countdown?: string;
}) {
  return (
    <div className="dashboard-layout min-h-screen bg-bg">
      {/* ── Nav ──────────────────────────────────────────── */}
      <nav className="border-b-[3px] border-line bg-panel">
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

      {/* ── Countdown bar ────────────────────────────────── */}
      {countdown && (
        <div className="border-b-[3px] border-line bg-accent-amber">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-3 sm:px-8">
            <div className="flex items-center gap-2">
              <Timer size={16} className="shrink-0" />
              <span className="font-heading text-sm font-bold sm:text-base">
                Replay closes in
              </span>
            </div>
            <span className="font-dashboard text-xl font-black tabular-nums sm:text-2xl">
              {countdown}
            </span>
          </div>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────── */}
      <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
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
      className={`rounded-xl border-[3px] border-line p-4 shadow-[0_3px_0_#000] ${
        outOfStock ? "bg-panel-strong opacity-60" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-heading text-lg font-extrabold leading-tight">{product.name}</p>
          <div className="mt-1.5 flex items-center gap-3">
            <span className="font-heading text-xl font-black">${product.price.toFixed(2)}</span>
            <span
              className={`rounded-full border-2 border-line px-2.5 py-0.5 font-dashboard text-[10px] font-bold shadow-[0_1px_0_#000] ${
                outOfStock ? "bg-panel-strong" : "bg-accent"
              }`}
            >
              {outOfStock ? "Sold out" : `${product.stock} left`}
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
        <p className="mt-2 text-xs font-semibold text-text-muted">
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
      className={`inline-flex items-center gap-1.5 rounded-full border-2 border-line px-3 py-1.5 font-dashboard text-xs font-bold shadow-[0_2px_0_#000] ${
        active ? "bg-white" : "bg-white/50"
      }`}
    >
      {active && <Check size={11} strokeWidth={3} />}
      {label} {active ? "ON" : "OFF"}
    </span>
  );
}
