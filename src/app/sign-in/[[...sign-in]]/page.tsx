import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { sanitizeNextPath } from "@/lib/auth/validators";

export default async function SignInPage({
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
      badge="Buyer + Seller Login"
      title="Welcome back."
      subtitle="Sign in to launch replays, manage products, and track every purchase in one place."
    >
      <SignInForm nextPath={nextPath} />
    </AuthShell>
  );
}
