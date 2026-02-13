"use client";

import type { Doc, Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Clock, Mail, Play, RadioTower, ShoppingBag } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "@convex/_generated/api";
import { EmbedPreview } from "@/components/replay/embed-preview";
import { useToast } from "@/components/ui/toast-provider";

export default function PublicReplayPage() {
  const params = useParams<{ id: string }>();
  const replayId = params.id as Id<"replays">;
  const toast = useToast();

  const replay = useQuery(api.replays.getPublicReplay, { id: replayId });
  const products = useQuery(api.products.listByReplay, { replayId });
  const subscribe = useMutation(api.subscribers.subscribe);
  const placeOrder = useMutation(api.orders.placeOrder);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!replay?.expiresAt) return;
    function tick() {
      const diff = (replay?.expiresAt ?? 0) - Date.now();
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

  if (replay === undefined) {
    return (
      <PageShell>
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-text-muted">
          Loading replay...
        </div>
      </PageShell>
    );
  }

  if (!replay) {
    return (
      <PageShell>
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-text-muted">
          Replay not found.
        </div>
      </PageShell>
    );
  }

  const isExpired = replay.status !== "live" || (replay.expiresAt ?? 0) <= Date.now();

  if (isExpired) {
    return (
      <PageShell>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
          <Clock size={32} className="text-text-muted" />
          <h2 className="text-xl font-bold">This replay has ended</h2>
          <p className="text-sm text-text-muted">The selling window for this replay has closed.</p>
        </div>
      </PageShell>
    );
  }

  if (!unlocked) {
    return (
      <PageShell>
        <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center">
          <div className="w-full space-y-5 rounded-xl border border-line bg-panel p-6">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-purple/15">
                <Mail size={20} className="text-accent-purple" />
              </div>
              <h2 className="text-lg font-bold">Enter your email to watch</h2>
              <p className="mt-1 text-sm text-text-muted">
                {replay.title ? `"${replay.title}"` : "This replay"} is available for a limited time.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-accent-amber/20 to-accent-purple/20 px-4 py-2">
              <span className="text-xs font-medium text-text">Closes in</span>
              <span className="font-mono text-sm font-bold tabular-nums text-text">{countdown}</span>
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
                  });
                  setUnlocked(true);
                } catch {
                  toast.error("Could not subscribe. Try again.");
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
                className="h-10 w-full rounded-md border border-line bg-bg px-3 text-sm text-text placeholder:text-text-muted/60 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
              />
              <input
                type="tel"
                placeholder="Phone number (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 w-full rounded-md border border-line bg-bg px-3 text-sm text-text placeholder:text-text-muted/60 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
              />
              {phone && (
                <label className="flex items-center gap-2 text-xs text-text-muted">
                  <input
                    type="checkbox"
                    checked={smsConsent}
                    onChange={(e) => setSmsConsent(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-line accent-accent"
                  />
                  I agree to receive SMS updates about this replay
                </label>
              )}
              <button
                type="submit"
                disabled={subscribing}
                className="h-10 w-full cursor-pointer rounded-md bg-accent text-sm font-semibold text-bg-strong transition hover:brightness-110 disabled:opacity-50"
              >
                {subscribing ? "Joining..." : "Watch replay"}
              </button>
            </form>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-accent-amber/20 to-accent-purple/20 px-5 py-3">
          <span className="text-sm font-medium text-text">Replay closes in</span>
          <span className="font-mono text-lg font-bold tabular-nums text-text">{countdown}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-4">
            {replay.title && (
              <h1 className="text-xl font-bold tracking-tight">{replay.title}</h1>
            )}
            <EmbedPreview url={replay.url} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-text">
              <ShoppingBag size={14} className="text-accent" />
              Products ({products?.length ?? 0})
            </div>

            {(!products || products.length === 0) ? (
              <div className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-text-muted">
                No products listed yet.
              </div>
            ) : (
              <div className="space-y-2">
                {products.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    email={email}
                    replayId={replayId}
                    placeOrder={placeOrder}
                    toast={toast}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-line/60 bg-bg/80 backdrop-blur-lg">
        <div className="mx-auto flex h-12 max-w-5xl items-center px-6">
          <div className="flex items-center gap-2">
            <RadioTower size={16} className="text-accent" />
            <span className="text-xs font-semibold tracking-tight text-text-muted">ReplaySell</span>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}

function ProductCard({
  product,
  email,
  replayId,
  placeOrder,
  toast,
}: {
  product: Doc<"products">;
  email: string;
  replayId: Id<"replays">;
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
    setBuying(true);
    try {
      await placeOrder({
        replayId,
        productId: product._id,
        email,
        quantity: 1,
      });
      toast.success(`Added "${product.name}" to your order!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place order.");
    } finally {
      setBuying(false);
    }
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-line bg-panel px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-text">{product.name}</p>
        <p className="text-xs text-text-muted">
          ${product.price.toFixed(2)} &middot;{" "}
          {outOfStock ? (
            <span className="text-accent-magenta">Sold out</span>
          ) : (
            `${product.stock} left`
          )}
        </p>
      </div>
      <button
        onClick={handleBuy}
        disabled={buying || outOfStock}
        className="cursor-pointer rounded-md border border-accent-purple/30 bg-accent-purple/10 px-4 py-1.5 text-xs font-semibold text-accent-purple transition-colors hover:bg-accent-purple/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {buying ? "..." : outOfStock ? "Sold out" : "Buy"}
      </button>
    </div>
  );
}
