"use client";

import { ArrowRight, Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { normalizeEmail } from "@/lib/auth/validators";

export function SignInForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div>
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-black tracking-tight">
          Sign in to your account
        </h2>
        <p className="mt-1 text-sm font-semibold text-text-muted">
          Enter your credentials to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-1.5">
          <span className="font-dashboard text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
            Email
          </span>
          <div className="grid h-12 grid-cols-[2.75rem_1fr] items-center overflow-hidden rounded-xl border-2 border-line bg-[#fcfaf7] shadow-[0_2px_0_#000] transition-all focus-within:-translate-y-0.5 focus-within:shadow-[0_3px_0_#000]">
            <div className="flex h-full items-center justify-center border-r-2 border-line bg-white text-text-muted">
              <Mail size={16} />
            </div>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              className="h-full w-full border-0 bg-transparent px-3 text-sm font-semibold text-text outline-none placeholder:text-text-muted/60"
            />
          </div>
        </label>

        <label className="block space-y-1.5">
          <span className="font-dashboard text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
            Password
          </span>
          <div className="grid h-12 grid-cols-[2.75rem_1fr_2.75rem] items-center overflow-hidden rounded-xl border-2 border-line bg-[#fcfaf7] shadow-[0_2px_0_#000] transition-all focus-within:-translate-y-0.5 focus-within:shadow-[0_3px_0_#000]">
            <div className="flex h-full items-center justify-center border-r-2 border-line bg-white text-text-muted">
              <KeyRound size={16} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              className="h-full w-full border-0 bg-transparent px-3 text-sm font-semibold text-text outline-none placeholder:text-text-muted/60"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="flex h-full items-center justify-center border-l-2 border-line bg-white text-text-muted transition-colors hover:text-text"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </label>

        {error && (
          <p className="rounded-xl border-2 border-[#e8c4c0] bg-[#fff1ef] px-3.5 py-2.5 text-xs font-semibold text-[#8a2a20]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="brutal-btn-primary inline-flex h-12 w-full items-center justify-center gap-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Signing in..." : "Sign in"}
          {!pending && <ArrowRight size={14} />}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-line/15" />
        <span className="font-dashboard text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted/60">
          No account yet?
        </span>
        <div className="h-px flex-1 bg-line/15" />
      </div>

      <Link
        href={`/sign-up?next=${encodeURIComponent(nextPath)}`}
        className="mt-4 flex h-11 w-full items-center justify-center rounded-xl border-2 border-line bg-[#fcfaf7] text-sm font-bold shadow-[0_2px_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[0_3px_0_#000]"
      >
        Create an account
      </Link>
    </div>
  );
}
