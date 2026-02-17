"use client";

import { ExternalLink, RadioTower, RefreshCcw, Store, Wallet } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AuthUserChip } from "@/components/auth/auth-user-chip";
import { useToast } from "@/components/ui/toast-provider";

type ConnectStatus = {
  cardPaymentsStatus: string | null;
  requirementsStatus: string | null;
  readyToProcessPayments: boolean;
  onboardingComplete: boolean;
};

type AccountResponse = {
  connectedAccountId: string | null;
  displayName: string | null;
  contactEmail: string | null;
  status: ConnectStatus | null;
  subscription: {
    status: string;
    stripeSubscriptionId: string | null;
    stripePriceId: string | null;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: number | null;
    lastEventType: string | null;
  } | null;
  latestWebhookSignals?: {
    latestRequirementsStatus: string | null;
    latestCardPaymentsStatus: string | null;
    lastThinEventId: string | null;
    lastThinEventType: string | null;
    lastThinEventCreatedAt: number | null;
  };
};

type StorefrontProduct = {
  id: string;
  name: string;
  description: string | null;
  defaultPrice: {
    id: string;
    unitAmount: number | null;
    currency: string;
  } | null;
};

async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const json = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(json.error ?? `Request failed with status ${response.status}`);
  }

  return json;
}

function formatMoney(amount: number | null, currency: string | null) {
  if (amount == null || !currency) return "No default price";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export default function ConnectDashboardPage() {
  const toast = useToast();

  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [products, setProducts] = useState<StorefrontProduct[]>([]);

  const [loadingAccount, setLoadingAccount] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("5000");
  const [productCurrency, setProductCurrency] = useState("usd");

  const [submitting, setSubmitting] = useState(false);
  const connectedAccountId = account?.connectedAccountId ?? null;

  const storefrontHref = useMemo(() => {
    if (!connectedAccountId) return null;
    return `/connect/store/${encodeURIComponent(connectedAccountId)}`;
  }, [connectedAccountId]);

  // Initial page load: fetch account status, then fetch products for that connected account.
  useEffect(() => {
    void refreshAccountAndProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refreshAccountAndProducts() {
    setLoadingAccount(true);
    try {
      const nextAccount = await requestJson<AccountResponse>("/api/connect-demo/account");
      setAccount(nextAccount);

      if (nextAccount.connectedAccountId) {
        await loadProducts(nextAccount.connectedAccountId);
      } else {
        setProducts([]);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load account.");
    } finally {
      setLoadingAccount(false);
    }
  }

  async function loadProducts(accountId: string) {
    setLoadingProducts(true);

    try {
      const result = await requestJson<{ products: StorefrontProduct[] }>(
        `/api/connect-demo/products?accountId=${encodeURIComponent(accountId)}`,
      );
      setProducts(result.products);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load products.");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function handleCreateConnectedAccount() {
    setSubmitting(true);
    try {
      await requestJson<{ connectedAccountId: string }>("/api/connect-demo/account", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          displayName,
          contactEmail,
        }),
      });

      toast.success("Connected account created.");
      await refreshAccountAndProducts();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not create connected account.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateOnboardingLink() {
    if (!connectedAccountId) {
      toast.error("Create your connected account first.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await requestJson<{ url: string }>(
        "/api/connect-demo/account-link",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ accountId: connectedAccountId }),
        },
      );

      // Redirect seller to Stripe-hosted onboarding flow.
      window.location.href = result.url;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not open onboarding link.",
      );
      setSubmitting(false);
    }
  }

  async function handleCreateProduct() {
    if (!connectedAccountId) {
      toast.error("Create your connected account first.");
      return;
    }

    setSubmitting(true);
    try {
      await requestJson<{ product: StorefrontProduct }>("/api/connect-demo/products", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: productName,
          description: productDescription,
          priceInCents: Number(productPrice),
          currency: productCurrency,
        }),
      });

      toast.success("Product created on your connected account.");
      setProductName("");
      setProductDescription("");
      setProductPrice("5000");
      await loadProducts(connectedAccountId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create product.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStartSubscriptionCheckout() {
    setSubmitting(true);
    try {
      const result = await requestJson<{ url: string }>(
        "/api/connect-demo/subscription-checkout",
        {
          method: "POST",
        },
      );
      window.location.href = result.url;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not start subscription checkout.",
      );
      setSubmitting(false);
    }
  }

  async function handleOpenBillingPortal() {
    setSubmitting(true);
    try {
      const result = await requestJson<{ url: string }>(
        "/api/connect-demo/billing-portal",
        {
          method: "POST",
        },
      );
      window.location.href = result.url;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not open billing portal.",
      );
      setSubmitting(false);
    }
  }

  return (
    <main className="dashboard-layout page-fade-in min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-5xl rounded-[24px] border-[3px] border-line bg-panel p-6 shadow-[0_8px_0_#000]">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-[3px] border-line bg-[#ffbc8c] shadow-[0_4px_0_#000]">
              <RadioTower size={18} />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-black sm:text-4xl">
                Stripe Connect Sample
              </h1>
              <p className="text-sm font-semibold text-text-muted">
                Onboard sellers, publish products, and take direct checkout payments.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="brutal-btn-secondary inline-flex h-10 items-center px-4 text-sm"
            >
              Seller dashboard
            </Link>
            <AuthUserChip compact />
          </div>
        </header>

        <section className="brutal-card mb-5 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-2xl font-black">1. Connect account</h2>
              <p className="text-sm font-semibold text-text-muted">
                Create a V2 connected account and start onboarding.
              </p>
            </div>
            <button
              onClick={() => void refreshAccountAndProducts()}
              disabled={loadingAccount || submitting}
              className="brutal-btn-secondary inline-flex h-10 items-center gap-2 px-4 text-sm disabled:opacity-60"
            >
              <RefreshCcw size={14} />
              Refresh status
            </button>
          </div>

          {loadingAccount ? (
            <p className="mt-4 text-sm font-semibold text-text-muted">Loading account status...</p>
          ) : (
            <>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <label className="text-sm font-bold">
                  Display name
                  <input
                    className="brutal-input mt-1"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="Replay Seller LLC"
                  />
                </label>
                <label className="text-sm font-bold">
                  Contact email
                  <input
                    className="brutal-input mt-1"
                    value={contactEmail}
                    onChange={(event) => setContactEmail(event.target.value)}
                    placeholder="owner@example.com"
                    type="email"
                  />
                </label>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => void handleCreateConnectedAccount()}
                  disabled={submitting}
                  className="brutal-btn-primary inline-flex h-11 items-center px-5 text-sm disabled:opacity-60"
                >
                  Create connected account
                </button>

                <button
                  onClick={() => void handleCreateOnboardingLink()}
                  disabled={!connectedAccountId || submitting}
                  className="brutal-btn-secondary inline-flex h-11 items-center gap-2 px-5 text-sm disabled:opacity-60"
                >
                  <ExternalLink size={14} />
                  Onboard to collect payments
                </button>
              </div>

              <div className="mt-4 rounded-xl border-2 border-line bg-panel-strong p-4 text-sm font-semibold">
                <p>
                  Connected account: {connectedAccountId ?? "Not created yet"}
                </p>
                <p>
                  Card payments capability: {account?.status?.cardPaymentsStatus ?? "n/a"}
                </p>
                <p>
                  Requirements status: {account?.status?.requirementsStatus ?? "n/a"}
                </p>
                <p>
                  Onboarding complete: {account?.status?.onboardingComplete ? "Yes" : "No"}
                </p>
                <p>
                  Ready to process payments: {account?.status?.readyToProcessPayments ? "Yes" : "No"}
                </p>
              </div>
            </>
          )}
        </section>

        <section className="brutal-card mb-5 p-5">
          <h2 className="font-heading text-2xl font-black">2. Seller subscription + billing portal</h2>
          <p className="text-sm font-semibold text-text-muted">
            Start subscription checkout using `customer_account` and manage it in Billing Portal.
          </p>

          <div className="mt-3 rounded-xl border-2 border-line bg-panel-strong p-3 text-sm font-semibold">
            <p>Stored subscription status: {account?.subscription?.status ?? "none"}</p>
            <p>
              Subscription ID: {account?.subscription?.stripeSubscriptionId ?? "not available"}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => void handleStartSubscriptionCheckout()}
              disabled={!connectedAccountId || submitting}
              className="brutal-btn-primary inline-flex h-11 items-center gap-2 px-5 text-sm disabled:opacity-60"
            >
              <Wallet size={14} />
              Start subscription
            </button>
            <button
              onClick={() => void handleOpenBillingPortal()}
              disabled={!connectedAccountId || submitting}
              className="brutal-btn-secondary inline-flex h-11 items-center gap-2 px-5 text-sm disabled:opacity-60"
            >
              <ExternalLink size={14} />
              Open billing portal
            </button>
          </div>
        </section>

        <section className="brutal-card mb-5 p-5">
          <h2 className="font-heading text-2xl font-black">3. Create products</h2>
          <p className="text-sm font-semibold text-text-muted">
            Products are created on the connected account using the Stripe-Account header.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="text-sm font-bold">
              Name
              <input
                className="brutal-input mt-1"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                placeholder="Replay Starter Pack"
              />
            </label>

            <label className="text-sm font-bold">
              Price (in cents)
              <input
                className="brutal-input mt-1"
                value={productPrice}
                onChange={(event) => setProductPrice(event.target.value)}
                placeholder="5000"
                inputMode="numeric"
              />
            </label>

            <label className="text-sm font-bold md:col-span-2">
              Description
              <textarea
                className="mt-1 w-full rounded-xl border-2 border-line bg-offwhite p-3 text-sm font-semibold"
                rows={3}
                value={productDescription}
                onChange={(event) => setProductDescription(event.target.value)}
                placeholder="Limited replay bundle"
              />
            </label>

            <label className="text-sm font-bold">
              Currency
              <input
                className="brutal-input mt-1"
                value={productCurrency}
                onChange={(event) => setProductCurrency(event.target.value)}
                placeholder="usd"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => void handleCreateProduct()}
              disabled={!connectedAccountId || submitting}
              className="brutal-btn-primary inline-flex h-11 items-center px-5 text-sm disabled:opacity-60"
            >
              Create product
            </button>

            {storefrontHref && (
              <Link
                href={storefrontHref}
                className="brutal-btn-secondary inline-flex h-11 items-center gap-2 px-5 text-sm"
              >
                <Store size={14} />
                Open storefront
              </Link>
            )}
          </div>

          <div className="mt-4 space-y-2">
            {loadingProducts ? (
              <p className="text-sm font-semibold text-text-muted">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-sm font-semibold text-text-muted">
                No products yet. Create one above.
              </p>
            ) : (
              products.map((product) => (
                <article
                  key={product.id}
                  className="rounded-xl border-2 border-line bg-white p-3 text-sm font-semibold"
                >
                  <p className="font-heading text-xl font-black">{product.name}</p>
                  <p className="text-text-muted">{product.description || "No description"}</p>
                  <p className="mt-1">
                    {formatMoney(
                      product.defaultPrice?.unitAmount ?? null,
                      product.defaultPrice?.currency ?? null,
                    )}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="brutal-card p-5">
          <h2 className="font-heading text-2xl font-black">4. Webhook setup notes</h2>
          <p className="text-sm font-semibold text-text-muted">
            Thin endpoint: <code>/api/connect-demo/webhooks/thin</code>
          </p>
          <p className="text-sm font-semibold text-text-muted">
            Billing endpoint: <code>/api/connect-demo/webhooks/billing</code>
          </p>
          <p className="mt-2 rounded-xl border-2 border-line bg-panel-strong p-3 text-xs font-semibold">
            CLI example:
          </p>
          <pre className="mt-2 overflow-x-auto rounded-xl border-2 border-line bg-white p-3 text-xs font-semibold">
            <code>
              {`stripe listen --thin-events 'v2.core.account[requirements].updated,v2.core.account[configuration.merchant].capability_status_updated,v2.core.account[configuration.customer].capability_status_updated,v2.core.account[configuration.recipient].capability_status_updated' --forward-thin-to http://localhost:4000/api/connect-demo/webhooks/thin`}
            </code>
          </pre>
        </section>
      </div>
    </main>
  );
}
