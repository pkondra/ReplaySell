"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function ConnectedAccountStorefrontPage() {
  const params = useParams<{ accountId: string }>();

  // NOTE: This sample uses the raw Stripe connected account ID in the URL.
  // In production, use a stable seller slug and resolve slug -> account ID server-side.
  const accountId = params.accountId;

  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buyingPriceId, setBuyingPriceId] = useState<string | null>(null);

  useEffect(() => {
    void loadProducts(accountId);
  }, [accountId]);

  async function loadProducts(nextAccountId: string) {
    setLoading(true);
    setError(null);

    try {
      const result = await requestJson<{ products: StorefrontProduct[] }>(
        `/api/connect-demo/products?accountId=${encodeURIComponent(nextAccountId)}`,
      );
      setProducts(result.products);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Failed to load products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleBuyProduct(product: StorefrontProduct) {
    if (!product.defaultPrice?.id) {
      setError("This product is missing a default price.");
      return;
    }

    setBuyingPriceId(product.defaultPrice.id);
    setError(null);

    try {
      const result = await requestJson<{ url: string }>("/api/connect-demo/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          accountId,
          priceId: product.defaultPrice.id,
          quantity: 1,
        }),
      });

      window.location.href = result.url;
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Failed to start checkout.");
      setBuyingPriceId(null);
    }
  }

  return (
    <main className="dashboard-layout page-fade-in min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-4xl rounded-[24px] border-[3px] border-line bg-panel p-6 shadow-[0_8px_0_#000]">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl font-black sm:text-4xl">
              Seller Storefront
            </h1>
            <p className="text-sm font-semibold text-text-muted">
              Connected account: <code>{accountId}</code>
            </p>
          </div>
          <Link href="/" className="brutal-btn-secondary inline-flex h-10 items-center px-4 text-sm">
            Home
          </Link>
        </header>

        {error && (
          <p className="mb-4 rounded-xl border-2 border-line bg-[#fff1ef] p-3 text-sm font-bold text-[#8a2a20]">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-sm font-semibold text-text-muted">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="brutal-card p-6 text-sm font-semibold text-text-muted">
            No active products are available yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {products.map((product) => (
              <article
                key={product.id}
                className="rounded-2xl border-[3px] border-line bg-white p-4 shadow-[0_4px_0_#000]"
              >
                <h2 className="font-heading text-2xl font-black leading-tight">{product.name}</h2>
                <p className="mt-1 text-sm font-semibold text-text-muted">
                  {product.description || "No description provided."}
                </p>
                <p className="mt-3 text-sm font-bold">
                  {formatMoney(
                    product.defaultPrice?.unitAmount ?? null,
                    product.defaultPrice?.currency ?? null,
                  )}
                </p>

                <button
                  onClick={() => void handleBuyProduct(product)}
                  disabled={!product.defaultPrice || buyingPriceId === product.defaultPrice.id}
                  className="brutal-btn-primary mt-4 inline-flex h-11 items-center gap-2 px-5 text-sm disabled:opacity-60"
                >
                  <ShoppingCart size={14} />
                  {buyingPriceId === product.defaultPrice?.id
                    ? "Redirecting..."
                    : "Buy with Stripe Checkout"}
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
