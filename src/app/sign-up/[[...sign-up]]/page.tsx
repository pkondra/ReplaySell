import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { sanitizeNextPath } from "@/lib/auth/validators";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const nextPath = sanitizeNextPath(params.next);
  const session = await auth();

  if (session?.user?.id) {
    redirect(nextPath);
  }

  return (
    <AuthShell
      badge="Create Account"
      title="Start selling in minutes."
      subtitle="Create one account for buying, selling, replay analytics, and Stripe-powered checkout management."
    >
      <SignUpForm nextPath={nextPath} />
    </AuthShell>
  );
}
