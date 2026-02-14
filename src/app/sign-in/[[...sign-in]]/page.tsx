import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="dashboard-layout min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto grid w-full max-w-5xl gap-6 rounded-[24px] border-[3px] border-line bg-panel p-6 shadow-[0_8px_0_#000] lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section className="rounded-2xl border-[3px] border-line bg-accent p-6 shadow-[0_4px_0_#000]">
          <h1 className="font-heading text-5xl font-black leading-[0.95]">
            Buyer + Seller Login
          </h1>
          <p className="mt-3 text-sm font-semibold text-text-muted">
            Sign in to manage replays, place orders, and view purchase history.
          </p>
        </section>
        <div className="w-full max-w-[420px] justify-self-center">
          <SignIn
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </main>
  );
}
