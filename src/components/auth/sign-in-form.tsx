"use client";

import { ArrowRight, KeyRound, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { normalizeEmail } from "@/lib/auth/validators";

export function SignInForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const result = await signIn("credentials", {
        email: normalizeEmail(email),
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Could not sign in. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="font-dashboard text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
          Email
        </span>
        <div className="relative">
          <Mail
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@email.com"
            required
            className="brutal-input h-12 pl-10"
          />
        </div>
      </label>

      <label className="block space-y-1.5">
        <span className="font-dashboard text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
          Password
        </span>
        <div className="relative">
          <KeyRound
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
            required
            className="brutal-input h-12 pl-10"
          />
        </div>
      </label>

      {error ? (
        <p className="rounded-xl border-2 border-line bg-[#fff1ef] px-3 py-2 text-xs font-semibold text-[#8a2a20]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="brutal-btn-primary inline-flex h-12 w-full items-center justify-center gap-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
        {!pending ? <ArrowRight size={14} /> : null}
      </button>

      <p className="text-center text-xs font-semibold text-text-muted">
        New here?{" "}
        <Link
          href={`/sign-up?next=${encodeURIComponent(nextPath)}`}
          className="font-bold text-text underline decoration-2 underline-offset-2"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
