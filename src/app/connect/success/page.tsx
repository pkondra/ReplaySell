import Link from "next/link";

export default async function ConnectSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; accountId?: string }>;
}) {
  const params = await searchParams;
  const accountId = params.accountId;

  return (
    <main className="dashboard-layout page-fade-in min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-2xl rounded-[24px] border-[3px] border-line bg-panel p-6 shadow-[0_8px_0_#000]">
        <h1 className="font-heading text-4xl font-black">Payment complete</h1>
        <p className="mt-2 text-sm font-semibold text-text-muted">
          Your checkout session was successful.
        </p>
        <p className="mt-3 rounded-xl border-2 border-line bg-panel-strong p-3 text-xs font-semibold">
          Session ID: {params.session_id ?? "not provided"}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {accountId ? (
            <Link
              href={`/connect/store/${encodeURIComponent(accountId)}`}
              className="brutal-btn-primary inline-flex h-10 items-center px-4 text-sm"
            >
              Back to storefront
            </Link>
          ) : (
            <Link href="/" className="brutal-btn-primary inline-flex h-10 items-center px-4 text-sm">
              Back to home
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
