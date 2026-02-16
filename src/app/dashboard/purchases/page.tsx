"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { ReceiptText, RadioTower } from "lucide-react";
import Link from "next/link";

import { api } from "@convex/_generated/api";
import { formatTimestamp } from "@/lib/time";

export default function PurchasesPage() {
  const { isLoaded, userId } = useAuth();
  const purchases = useQuery(
    api.orders.listMyPurchasesDetailed,
    isLoaded && userId ? {} : "skip",
  );

  return (
    <main className="dashboard-layout page-fade-in min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-5xl rounded-[24px] border-[3px] border-line bg-panel p-6 shadow-[0_8px_0_#000]">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-[3px] border-line bg-[#ffbc8c] shadow-[0_4px_0_#000]">
              <RadioTower size={18} />
            </div>
            <div>
              <h1 className="font-heading text-4xl font-black">My Purchases</h1>
              <p className="text-sm font-semibold text-text-muted">
                Logged-in buyer history and order timeline.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="brutal-btn-secondary inline-flex h-10 items-center px-4 text-sm">
              Seller dashboard
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{ elements: { userButtonAvatarBox: "h-10 w-10 border-2 border-[#1A1A1A]" } }}
            />
          </div>
        </header>

        {purchases === undefined ? (
          <div className="brutal-card p-6 text-sm font-semibold text-text-muted">Loading purchase history...</div>
        ) : purchases.length === 0 ? (
          <div className="brutal-card p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-line bg-accent shadow-[0_4px_0_#000]">
              <ReceiptText size={20} />
            </div>
            <p className="mt-3 font-heading text-2xl font-black">No purchases yet</p>
            <p className="mt-1 text-sm font-semibold text-text-muted">
              Once you buy from a replay page, your orders appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {purchases.map((purchase) => (
              <article
                key={purchase._id}
                className="rounded-2xl border-[3px] border-line bg-white p-4 shadow-[0_4px_0_#000]"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-heading text-xl font-black leading-tight">
                      {purchase.productName ?? "Product"} × {purchase.quantity}
                    </p>
                    <p className="text-sm font-semibold text-text-muted">
                      Replay: {purchase.replayTitle ?? purchase.replayId}
                    </p>
                  </div>
                  <span className="rounded-full border-2 border-line bg-accent-amber px-2.5 py-1 text-xs font-bold shadow-[0_2px_0_#000]">
                    {purchase.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-semibold text-text-muted">
                  <span>Total: ${purchase.total.toFixed(2)}</span>
                  <span>Email: {purchase.email}</span>
                  <span>{formatTimestamp(purchase.createdAt)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
