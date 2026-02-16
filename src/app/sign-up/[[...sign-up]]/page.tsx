import { SignUp } from "@clerk/nextjs";

function sanitizeNextPath(next: string | string[] | undefined) {
  const raw = Array.isArray(next) ? next[0] : next;
  if (!raw) return "/dashboard";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const nextPath = sanitizeNextPath(params.next);
  const signInUrl = `/sign-in?next=${encodeURIComponent(nextPath)}`;

  return (
    <main className="dashboard-layout min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto grid w-full max-w-5xl gap-6 rounded-[24px] border-[3px] border-line bg-panel p-6 shadow-[0_8px_0_#000] lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section className="rounded-2xl border-[3px] border-line bg-[#ff9ecd] p-6 shadow-[0_4px_0_#000]">
          <h1 className="font-heading text-5xl font-black leading-[0.95]">
            Create Your Account
          </h1>
          <p className="mt-3 text-sm font-semibold text-text-muted">
            Buyers can track orders and alerts. Sellers can manage replay pages and campaigns.
          </p>
        </section>
        <div className="w-full max-w-[420px] justify-self-center">
          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl={signInUrl}
            fallbackRedirectUrl={nextPath}
          />
        </div>
      </div>
    </main>
  );
}
