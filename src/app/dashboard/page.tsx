"use client";

import type { Doc } from "@convex/_generated/dataModel";
import { useAction, useConvexAuth, useMutation, useQuery } from "convex/react";
import {
  CalendarClock,
  CreditCard,
  DollarSign,
  ExternalLink,
  Layers2,
  Mail,
  Plus,
  RadioTower,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { api } from "@convex/_generated/api";
import { AuthUserChip } from "@/components/auth/auth-user-chip";
import { useToast } from "@/components/ui/toast-provider";
import { validateReplayUrl } from "@/lib/embed";
import { formatTimestamp } from "@/lib/time";

type SellerPlanId = "starter" | "growth" | "boutique";
type StripeConnectStatus = {
  connectedAccountId: string | null;
  status: {
    cardPaymentsStatus: string | null;
    requirementsStatus: string | null;
    readyToProcessPayments: boolean;
    onboardingComplete: boolean;
  } | null;
};

const SELLER_PLAN_OPTIONS: Array<{
  id: SellerPlanId;
  name: string;
  price: number;
  tagline: string;
}> = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    tagline: "For solo sellers launching replay sales.",
  },
  {
    id: "growth",
    name: "Growth",
    price: 99,
    tagline: "For sellers going live every week.",
  },
  {
    id: "boutique",
    name: "Boutique",
    price: 149,
    tagline: "For teams and high-volume brands.",
  },
];

export default function DashboardPage() {
  const { isAuthenticated } = useConvexAuth();
  const canQuery = isAuthenticated;
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const stats = useQuery(api.replays.getDashboardStats, canQuery ? {} : "skip");
  const replays = useQuery(api.replays.listMyReplays, canQuery ? {} : "skip");
  const sellerSubscription = useQuery(
    api.sellerBilling.getMySellerSubscription,
    canQuery ? {} : "skip",
  );
  const createSellerCheckoutSession = useAction(
    api.sellerBillingActions.createSellerCheckoutSession,
  );
  const createSellerPortalSession = useAction(
    api.sellerBillingActions.createSellerPortalSession,
  );
  const initialUrl = searchParams.get("url") ?? "";
  const billingState = searchParams.get("billing");
  const onboardingState = searchParams.get("stripe_onboarding");
  const preferredPlan = parseSellerPlan(searchParams.get("plan"));
  const createReplay = useMutation(api.replays.createReplay);
  const [showCreate, setShowCreate] = useState(() => Boolean(initialUrl));
  const [renderNow] = useState(() => Date.now());
  const [checkoutPlan, setCheckoutPlan] = useState<SellerPlanId | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const billingGateRef = useRef<HTMLDivElement | null>(null);
  const handledBillingStateRef = useRef<string | null>(null);
  const handledOnboardingStateRef = useRef<string | null>(null);
  const hasSellerAccess = sellerSubscription?.hasAccess ?? false;
  const [stripeConnectStatus, setStripeConnectStatus] =
    useState<StripeConnectStatus | null>(null);
  const [stripeConnectLoading, setStripeConnectLoading] = useState(false);
  const [stripeConnectOnboardingLoading, setStripeConnectOnboardingLoading] =
    useState(false);

  const refreshStripeConnectStatus = useCallback(async () => {
    setStripeConnectLoading(true);
    try {
      const response = await fetch("/api/connect/status");
      const json = (await response.json()) as StripeConnectStatus & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(json.error ?? "Failed to load Stripe Connect status.");
      }

      setStripeConnectStatus({
        connectedAccountId: json.connectedAccountId ?? null,
        status: json.status ?? null,
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load Stripe Connect status."));
      setStripeConnectStatus(null);
    } finally {
      setStripeConnectLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!billingState || handledBillingStateRef.current === billingState) return;

    if (billingState === "success") {
      toast.success("Checkout complete. We are activating your seller access.");
    } else if (billingState === "canceled") {
      toast.error("Checkout canceled. Start your 7-day trial to continue.");
    }

    handledBillingStateRef.current = billingState;
  }, [billingState, toast]);

  useEffect(() => {
    if (!onboardingState || handledOnboardingStateRef.current === onboardingState) {
      return;
    }

    if (onboardingState === "return") {
      toast.success("Stripe onboarding returned. Refreshing status...");
    } else if (onboardingState === "refresh") {
      toast.error("Stripe onboarding expired. Please continue onboarding.");
    }

    handledOnboardingStateRef.current = onboardingState;
    void refreshStripeConnectStatus();
  }, [onboardingState, refreshStripeConnectStatus, toast]);

  useEffect(() => {
    if (!canQuery) return;
    void refreshStripeConnectStatus();
  }, [canQuery, refreshStripeConnectStatus]);

  async function handleManageSubscription() {
    setPortalLoading(true);
    try {
      const { url } = await createSellerPortalSession();
      window.location.href = url;
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not open billing portal."));
      setPortalLoading(false);
    }
  }

  async function handleStartTrial(plan: SellerPlanId) {
    setCheckoutPlan(plan);
    try {
      const { url } = await createSellerCheckoutSession({ plan });
      if (typeof window !== "undefined") {
        window.location.href = url;
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not start Stripe checkout."));
      setCheckoutPlan(null);
    }
  }

  async function handleConnectToStripe() {
    setStripeConnectOnboardingLoading(true);
    try {
      const response = await fetch("/api/connect/onboard", { method: "POST" });
      const json = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !json.url) {
        throw new Error(json.error ?? "Could not open Stripe onboarding.");
      }
      window.location.href = json.url;
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not open Stripe onboarding."));
      setStripeConnectOnboardingLoading(false);
    }
  }

  return (
    <main className="dashboard-layout page-fade-in min-h-screen px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto flex w-full max-w-[104rem] flex-col overflow-hidden rounded-[28px] border-[3px] border-line bg-panel shadow-[0_8px_0_#000] lg:flex-row">
        <aside className="w-full border-b-[3px] border-line bg-panel-strong p-6 sm:p-7 lg:w-80 lg:border-b-0 lg:border-r-[3px] lg:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-[3px] border-line bg-[#ffbc8c] shadow-[0_4px_0_#000]">
              <RadioTower size={18} />
            </div>
            <div>
              <p className="font-heading text-2xl font-black leading-none">ReplaySell</p>
              <p className="text-xs font-semibold text-text-muted">Seller console</p>
            </div>
          </div>

          <nav className="space-y-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl border-[3px] border-line bg-[#ffbc8c] px-4 py-3.5 text-sm font-bold shadow-[0_4px_0_#000]"
            >
              <Layers2 size={15} />
              Dashboard
            </Link>
            <Link
              href="/dashboard/purchases"
              className="flex items-center gap-2 rounded-xl border-2 border-line bg-white px-4 py-3.5 text-sm font-bold shadow-[0_3px_0_#000] transition-all hover:-translate-y-0.5"
            >
              <UserRound size={15} />
              Buyer history
            </Link>
          </nav>

          <div
            className={`mt-7 rounded-xl border-[3px] border-line p-5 shadow-[0_4px_0_#000] ${
              sellerSubscription?.status === "canceled"
                ? "bg-panel-strong"
                : sellerSubscription?.status === "past_due"
                  ? "bg-[#fff1ef]"
                  : sellerSubscription?.cancelAtPeriodEnd
                    ? "bg-[#f9e27f]"
                    : "bg-accent"
            }`}
          >
            <p className="font-heading text-lg font-black">
              {sellerSubscription === undefined
                ? "Loading..."
                : sellerSubscription.status === "canceled"
                  ? "Subscription canceled"
                  : sellerSubscription.status === "past_due"
                    ? "Payment failed"
                    : sellerSubscription.hasAccess
                      ? `${formatSellerPlan(sellerSubscription.plan)} plan`
                      : "Seller billing required"}
            </p>
            <p className="text-sm font-semibold text-text-muted">
              {sellerSubscription === undefined
                ? "Checking seller access..."
                : sellerSubscription.status === "canceled"
                  ? "Your access has ended. Resubscribe to continue."
                  : sellerSubscription.status === "past_due"
                    ? "Update your payment method to keep access."
                    : sellerSubscription.cancelAtPeriodEnd
                      ? "Cancels at end of period. You still have access until then."
                      : sellerSubscription.hasAccess
                        ? `Status: ${formatSellerStatus(sellerSubscription.status)}`
                        : "Start a 7-day trial to unlock replay and product creation."}
            </p>
            {sellerSubscription?.cancelAtPeriodEnd &&
              sellerSubscription.currentPeriodEnd && (
                <p className="mt-1 text-xs font-bold text-[#8a2a20]">
                  Access ends{" "}
                  {formatBillingDate(sellerSubscription.currentPeriodEnd)}
                </p>
              )}
            {!sellerSubscription?.cancelAtPeriodEnd &&
              (sellerSubscription?.trialEndsAt ??
                sellerSubscription?.currentPeriodEnd) && (
                <p className="mt-1 text-xs font-semibold text-text-muted">
                  {sellerSubscription.status === "trialing"
                    ? "Trial ends"
                    : "Next billing"}{" "}
                  {formatBillingDate(
                    sellerSubscription.trialEndsAt ??
                      sellerSubscription.currentPeriodEnd,
                  )}
                </p>
              )}
            {sellerSubscription?.hasStripeCustomer &&
              sellerSubscription.status !== "none" && (
                <button
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border-[3px] border-line bg-white px-4 py-2.5 text-xs font-bold shadow-[0_3px_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_0_#000] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ExternalLink size={13} />
                  {portalLoading ? "Opening..." : "Manage Subscription"}
                </button>
              )}
          </div>

          <div
            className={`mt-4 rounded-xl border-[3px] border-line p-5 shadow-[0_4px_0_#000] ${
              stripeConnectStatus?.status?.readyToProcessPayments
                ? "bg-accent"
                : "bg-white"
            }`}
          >
            <p className="font-heading text-lg font-black">Stripe Connect</p>
            <p className="text-sm font-semibold text-text-muted">
              {stripeConnectLoading
                ? "Checking Stripe onboarding..."
                : stripeConnectStatus?.status?.readyToProcessPayments
                  ? "Ready to accept payments on replay products."
                  : stripeConnectStatus?.connectedAccountId
                    ? "Finish Stripe onboarding to accept payments."
                    : "Connect your Stripe account to accept payments."}
            </p>
            {stripeConnectStatus?.connectedAccountId ? (
              <p className="mt-1 text-xs font-semibold text-text-muted">
                Account: {stripeConnectStatus.connectedAccountId}
              </p>
            ) : null}
            {stripeConnectStatus?.status ? (
              <p className="mt-1 text-xs font-semibold text-text-muted">
                Card payments: {stripeConnectStatus.status.cardPaymentsStatus ?? "unknown"}
              </p>
            ) : null}
            <button
              onClick={handleConnectToStripe}
              disabled={stripeConnectOnboardingLoading}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border-[3px] border-line bg-white px-4 py-2.5 text-xs font-bold shadow-[0_3px_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_0_#000] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CreditCard size={13} />
              {stripeConnectOnboardingLoading
                ? "Opening..."
                : stripeConnectStatus?.status?.readyToProcessPayments
                  ? "Review Stripe onboarding"
                  : stripeConnectStatus?.connectedAccountId
                    ? "Continue Stripe onboarding"
                    : "Connect To Stripe"}
            </button>
          </div>
        </aside>

        <section className="min-w-0 flex-1 bg-bg p-6 sm:p-8 lg:p-10">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-4xl font-black sm:text-5xl">Dashboard</h1>
              <p className="mt-1 text-sm font-semibold text-text-muted">
                Replay metrics, product inventory, subscribers, and campaigns.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (!hasSellerAccess) {
                    billingGateRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                    toast.error("Start your 7-day trial to create replays.");
                    return;
                  }
                  setShowCreate((v) => !v);
                }}
                disabled={
                  !canQuery || sellerSubscription === undefined || checkoutPlan !== null
                }
                className="brutal-btn-primary inline-flex h-11 cursor-pointer items-center gap-2 px-5 font-dashboard text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={14} />
                {sellerSubscription === undefined
                  ? "Checking plan..."
                  : !hasSellerAccess
                    ? "Start Trial"
                    : showCreate
                      ? "Close"
                      : "Add Replay"}
              </button>
              <AuthUserChip compact />
            </div>
          </header>

          {sellerSubscription && !sellerSubscription.hasAccess && (
            <div ref={billingGateRef} className="mb-8">
              <SellerBillingGate
                subscription={sellerSubscription}
                preferredPlan={preferredPlan}
                checkoutPlan={checkoutPlan}
                onStartTrial={handleStartTrial}
              />
            </div>
          )}

          {stats && (
            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <StatCard label="Monthly Total" value={`$${stats.totalRevenue.toFixed(2)}`} icon={DollarSign} tone="bg-accent" />
              <StatCard label="Active" value={stats.liveReplays} icon={CalendarClock} tone="bg-[#ff9ecd]" />
              <StatCard label="Renewals" value={stats.totalReplays} icon={ShoppingBag} tone="bg-[#ff6b5a]" />
              <StatCard label="Leads" value={stats.totalSubscribers} icon={Mail} tone="bg-accent-amber" />
              <StatCard label="Orders" value={stats.totalOrders} icon={Layers2} tone="bg-[#b794f6]" />
            </div>
          )}

          {showCreate && hasSellerAccess && (
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

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-3xl font-black">Your replays</h2>
              <span className="rounded-full border-2 border-line bg-accent-amber px-3 py-1 text-xs font-bold shadow-[0_2px_0_#000]">
                {replays ? `${replays.length} items` : "Loading"}
              </span>
            </div>

            {replays === undefined ? (
              <div className="brutal-card p-8 text-sm font-semibold text-text-muted">Loading replays...</div>
            ) : replays.length === 0 ? (
              <div className="brutal-card p-8 text-sm font-semibold text-text-muted">
                No replays yet. Create your first replay above.
              </div>
            ) : (
              <div className="space-y-4">
                {replays.map((replay: Doc<"replays">) => {
                  const isArchived = replay.status === "archived";
                  const isLive = replay.status === "live" && (replay.expiresAt ?? 0) > renderNow;
                  return (
                    <Link
                      key={replay._id}
                      href={`/dashboard/replays/${replay._id}`}
                      className={`group block rounded-2xl border-[3px] border-line p-5 shadow-[0_4px_0_#000] transition-all hover:-translate-y-1 hover:shadow-[0_6px_0_#000] ${
                        isArchived ? "bg-panel-strong/50 opacity-75" : "bg-white"
                      }`}
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
                            isArchived
                              ? "bg-[#e0d4f7]"
                              : isLive
                                ? "bg-accent"
                                : "bg-panel-strong"
                          }`}
                        >
                          {isArchived ? "ARCHIVED" : isLive ? "LIVE" : "ENDED"}
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

function SellerBillingGate({
  subscription,
  preferredPlan,
  checkoutPlan,
  onStartTrial,
}: {
  subscription: {
    status: string;
    plan: string | null;
    hasAccess: boolean;
    trialEndsAt: number | null;
    currentPeriodEnd: number | null;
    cancelAtPeriodEnd: boolean;
  };
  preferredPlan: SellerPlanId | null;
  checkoutPlan: SellerPlanId | null;
  onStartTrial: (plan: SellerPlanId) => Promise<void>;
}) {
  return (
    <section className="rounded-2xl border-[3px] border-line bg-white p-6 shadow-[0_6px_0_#000] sm:p-7 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-3xl font-black leading-tight sm:text-4xl">
            Activate seller access
          </h2>
          <p className="mt-3 text-sm font-semibold text-text-muted">
            Pick a monthly plan, enter your card in Stripe Checkout, and your
            7-day trial starts immediately.
          </p>
          <p className="mt-2 text-xs font-semibold text-text-muted">
            Replay and product creation stay locked until your subscription is
            trialing or active.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-line bg-accent-amber px-3 py-1 font-dashboard text-[11px] font-bold shadow-[0_2px_0_#000]">
          <CreditCard size={13} />
          {formatSellerStatus(subscription.status)}
        </span>
      </div>

      {(subscription.hasAccess && subscription.plan) ||
      subscription.trialEndsAt ||
      subscription.currentPeriodEnd ? (
        <div className="mb-6 rounded-xl border-2 border-line bg-panel-strong px-4 py-3 text-xs font-semibold text-text-muted">
          {subscription.hasAccess && subscription.plan ? (
            <p>Current plan: {formatSellerPlan(subscription.plan)}</p>
          ) : null}
          {subscription.trialEndsAt ? (
            <p>Trial ends: {formatBillingDate(subscription.trialEndsAt)}</p>
          ) : subscription.currentPeriodEnd ? (
            <p>Current period ends: {formatBillingDate(subscription.currentPeriodEnd)}</p>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {SELLER_PLAN_OPTIONS.map((plan) => (
          <article
            key={plan.id}
            className={`rounded-xl border-[3px] border-line p-5 shadow-[0_3px_0_#000] ${
              preferredPlan === plan.id ? "bg-accent" : "bg-panel"
            }`}
          >
            <p className="font-heading text-xl font-black">{plan.name}</p>
            <p className="mt-1 font-heading text-4xl font-black text-[#ff6b5a]">
              ${plan.price}
              <span className="ml-1 font-dashboard text-sm font-semibold text-text-muted">
                /mo
              </span>
            </p>
            <p className="mt-2 text-xs font-semibold text-text-muted">
              {plan.tagline}
            </p>
            <button
              type="button"
              onClick={() => void onStartTrial(plan.id)}
              disabled={checkoutPlan !== null}
              className="brutal-btn-primary mt-5 inline-flex h-11 w-full items-center justify-center text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkoutPlan === plan.id
                ? "Redirecting..."
                : "Start 7-Day Trial"}
            </button>
          </article>
        ))}
      </div>
    </section>
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
    <div className={`rounded-2xl border-[3px] border-line p-5 shadow-[0_4px_0_#000] ${tone}`}>
      <div className="flex items-center gap-2 text-text-muted">
        <Icon size={14} />
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <p className="mt-2 font-heading text-5xl font-black leading-none">{value}</p>
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
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not create replay."));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border-[3px] border-line bg-white p-6 shadow-[0_6px_0_#000]">
      <p className="mb-4 font-heading text-2xl font-black">Create replay</p>
      <div className="grid gap-4 md:grid-cols-2">
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
      <div className="mt-4 flex flex-wrap items-center gap-2.5">
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
        className="brutal-btn-primary mt-5 inline-flex h-12 items-center px-7 font-heading text-sm disabled:opacity-60"
      >
        {pending ? "Creating..." : "Create & add products"}
      </button>
    </form>
  );
}

function parseSellerPlan(value: string | null): SellerPlanId | null {
  if (!value) return null;
  if (value === "starter" || value === "growth" || value === "boutique") {
    return value;
  }
  return null;
}

function formatSellerPlan(plan: string | null) {
  if (plan === "starter") return "Starter";
  if (plan === "growth") return "Growth";
  if (plan === "boutique") return "Boutique";
  return "Unknown";
}

function formatSellerStatus(status: string) {
  if (status === "trialing") return "Trialing";
  if (status === "active") return "Active";
  if (status === "canceled") return "Canceled";
  if (status === "checkout_pending") return "Checkout pending";
  if (status === "past_due") return "Past due";
  return "Inactive";
}

function formatBillingDate(timestamp: number | null) {
  if (timestamp == null) return "—";
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
