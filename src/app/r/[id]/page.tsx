"use client";

import type { Doc, Id } from "@convex/_generated/dataModel";
import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import {
  Bell,
  CalendarClock,
  CircleDollarSign,
  Clock,
  LogIn,
  Mail,
  Package,
  Phone,
  RadioTower,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { api } from "@convex/_generated/api";
import { EmbedPreview } from "@/components/replay/embed-preview";
import { useToast } from "@/components/ui/toast-provider";

export default function PublicReplayPage() {
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

  if (replay === undefined) {
    return (
      <PageShell>
        <div className="brutal-card p-8 text-sm font-semibold text-text-muted">Loading replay...</div>
      </PageShell>
    );
  }

  if (!replay) {
    return (
      <PageShell>
        <div className="brutal-card p-8 text-sm font-semibold text-text-muted">Replay not found.</div>
      </PageShell>
    );
  }

  const isExpired = replay.status !== "live" || (replay.expiresAt ?? 0) <= nowTs;

  if (isExpired) {
    return (
      <PageShell>
        <div className="brutal-card flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center p-6">
          <Clock size={32} />
          <h2 className="font-heading text-4xl font-black">This replay has ended</h2>
          <p className="text-sm font-semibold text-text-muted">
            The selling window for this replay is closed.
          </p>
        </div>
      </PageShell>
    );
  }

  if (!unlocked) {
    return (
      <PageShell>
        <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center">
          <div className="rounded-2xl border-[3px] border-line bg-white p-6 shadow-[0_8px_0_#000]">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-line bg-accent shadow-[0_4px_0_#000]">
                <Mail size={20} />
              </div>
              <h2 className="font-heading text-4xl font-black">Unlock this replay</h2>
              <p className="mt-1 text-sm font-semibold text-text-muted">
                Subscribe for countdown, stock, and price-change alerts.
              </p>
            </div>

            <div className="mb-4 flex items-center justify-between rounded-xl border-[3px] border-line bg-accent-amber px-4 py-3 shadow-[0_4px_0_#000]">
              <span className="font-heading text-xl font-black">Replay closes in</span>
              <span className="font-dashboard text-xl font-bold tabular-nums">{countdown}</span>
            </div>

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
              className="space-y-3"
            >
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="brutal-input"
              />

              <input
                type="tel"
                placeholder="Phone number (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="brutal-input"
              />

              {phone ? (
                <label className="flex items-center gap-2 text-xs font-semibold text-text-muted">
                  <input
                    type="checkbox"
                    checked={smsConsent}
                    onChange={(e) => setSmsConsent(e.target.checked)}
                    className="h-4 w-4 accent-[#1a1a1a]"
                  />
                  I agree to receive SMS reminders
                </label>
              ) : null}

              <div className="rounded-xl border-[2px] border-line bg-panel-strong p-3">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-text-muted">
                  Notification preferences
                </p>
                <div className="space-y-2">
                  <PreferenceToggle label="Timer reminders" checked={notifyTimer} onChange={setNotifyTimer} />
                  <PreferenceToggle label="Stock updates" checked={notifyStock} onChange={setNotifyStock} />
                  <PreferenceToggle
                    label="Price change alerts"
                    checked={notifyPriceChange}
                    onChange={setNotifyPriceChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={subscribing}
                className="brutal-btn-primary h-12 w-full text-sm disabled:opacity-60"
              >
                {subscribing ? "Subscribing..." : "Watch replay"}
              </button>
            </form>

            {!isSignedIn && (
              <p className="mt-3 text-center text-xs font-semibold text-text-muted">
                You can watch now. You will be prompted to create an account before buying.
              </p>
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border-[3px] border-line bg-accent-amber px-4 py-3 shadow-[0_4px_0_#000]">
          <span className="font-heading text-xl font-black">Replay closes in</span>
          <span className="font-dashboard text-xl font-bold tabular-nums">{countdown}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <div className="space-y-4">
            {replay.title ? <h1 className="font-heading text-4xl font-black">{replay.title}</h1> : null}
            <EmbedPreview url={replay.url} />
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border-[3px] border-line bg-white p-4 shadow-[0_4px_0_#000]">
              <div className="mb-3 flex items-center justify-between">
                <p className="flex items-center gap-2 font-heading text-2xl font-black">
                  <Package size={18} /> Products
                </p>
                <span className="rounded-full border-2 border-line bg-accent px-2.5 py-1 text-xs font-bold shadow-[0_2px_0_#000]">
                  {products?.length ?? 0}
                </span>
              </div>

              {!products || products.length === 0 ? (
                <p className="text-sm font-semibold text-text-muted">No products listed yet.</p>
              ) : (
                <div className="space-y-2">
                  {products.map((product) => (
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

            <div className="rounded-2xl border-[3px] border-line bg-[#ff9ecd] p-4 shadow-[0_4px_0_#000]">
              <p className="mb-1 flex items-center gap-2 font-heading text-xl font-black">
                <Bell size={16} /> Alerts enabled
              </p>
              <p className="text-sm font-semibold">
                Timer {notifyTimer ? "ON" : "OFF"} · Stock {notifyStock ? "ON" : "OFF"} · Price {notifyPriceChange ? "ON" : "OFF"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-layout min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-6xl rounded-[24px] border-[3px] border-line bg-panel shadow-[0_8px_0_#000]">
        <nav className="flex items-center justify-between border-b-[3px] border-line px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-line bg-[#ffbc8c] shadow-[0_4px_0_#000]">
              <RadioTower size={16} />
            </div>
            <div>
              <p className="font-heading text-2xl font-black leading-none">ReplaySell</p>
              <p className="text-xs font-semibold text-text-muted">Shop this replay</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Chip icon={CalendarClock} label="Timer" />
            <Chip icon={CircleDollarSign} label="Price Alerts" />
            <Chip icon={Phone} label="SMS" />
          </div>
        </nav>

        <main className="p-5 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

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
    <div className="rounded-xl border-[2px] border-line bg-panel-strong p-3 shadow-[0_2px_0_#000]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-heading text-xl font-black leading-none">{product.name}</p>
          <p className="text-xs font-semibold text-text-muted">
            ${product.price.toFixed(2)} · {outOfStock ? "Sold out" : `${product.stock} left`}
          </p>
        </div>

        {!isSignedIn ? (
          <Link
            href={signInHref}
            className="inline-flex h-9 items-center gap-1 rounded-xl border-2 border-line bg-white px-3 text-xs font-bold shadow-[0_2px_0_#000]"
          >
            <LogIn size={12} /> Sign in
          </Link>
        ) : (
          <button
            onClick={handleBuy}
            disabled={buying || outOfStock || !email}
            className="brutal-btn-primary h-9 px-4 text-xs disabled:opacity-60"
          >
            {buying ? "..." : outOfStock ? "Sold out" : "Buy"}
          </button>
        )}
      </div>

      {!isSignedIn ? (
        <p className="mt-2 text-xs font-semibold text-text-muted">
          Create account to buy and track history.
        </p>
      ) : null}
    </div>
  );
}

function PreferenceToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border-2 border-line bg-white px-3 py-2 text-xs font-bold shadow-[0_2px_0_#000]">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#1a1a1a]"
      />
    </label>
  );
}

function Chip({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border-2 border-line bg-accent-amber px-3 py-1 text-xs font-bold shadow-[0_2px_0_#000]">
      <Icon size={12} />
      {label}
    </span>
  );
}
