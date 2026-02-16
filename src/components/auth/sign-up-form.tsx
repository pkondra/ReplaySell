"use client";

import { ArrowRight, KeyRound, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { normalizeEmail, signUpSchema } from "@/lib/auth/validators";

export function SignUpForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = signUpSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!parsed.success) {
      const firstFieldError = Object.values(parsed.error.flatten().fieldErrors)
        .find((issues) => issues && issues.length > 0)
        ?.at(0);
      setError(firstFieldError ?? "Please review your details.");
      return;
    }

    setPending(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: parsed.data.name,
          email: normalizeEmail(parsed.data.email),
          password: parsed.data.password,
          confirmPassword: parsed.data.confirmPassword,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setError(payload.error ?? "Could not create account.");
        return;
      }

      const loginResult = await signIn("credentials", {
        email: normalizeEmail(parsed.data.email),
        password: parsed.data.password,
        redirect: false,
      });

      if (!loginResult || loginResult.error) {
        setError("Account created, but sign-in failed. Please sign in manually.");
        router.push(`/sign-in?next=${encodeURIComponent(nextPath)}`);
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Could not create account. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="font-dashboard text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
          Full name
        </span>
        <div className="grid h-12 grid-cols-[2.75rem_1fr] items-center overflow-hidden rounded-xl border-2 border-line bg-[#fcfaf7] shadow-[0_2px_0_#000] transition-all focus-within:-translate-y-0.5 focus-within:shadow-[0_3px_0_#000]">
          <div className="flex h-full items-center justify-center border-r-2 border-line bg-white text-text-muted">
            <UserRound size={16} />
          </div>
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            required
            className="h-full w-full border-0 bg-transparent px-3 text-sm font-semibold text-text outline-none placeholder:text-[rgba(26,26,26,0.5)]"
          />
        </div>
      </label>

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
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@email.com"
            required
            className="h-full w-full border-0 bg-transparent px-3 text-sm font-semibold text-text outline-none placeholder:text-[rgba(26,26,26,0.5)]"
          />
        </div>
      </label>

      <label className="block space-y-1.5">
        <span className="font-dashboard text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
          Password
        </span>
        <div className="grid h-12 grid-cols-[2.75rem_1fr] items-center overflow-hidden rounded-xl border-2 border-line bg-[#fcfaf7] shadow-[0_2px_0_#000] transition-all focus-within:-translate-y-0.5 focus-within:shadow-[0_3px_0_#000]">
          <div className="flex h-full items-center justify-center border-r-2 border-line bg-white text-text-muted">
            <KeyRound size={16} />
          </div>
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimum 8 characters"
            required
            className="h-full w-full border-0 bg-transparent px-3 text-sm font-semibold text-text outline-none placeholder:text-[rgba(26,26,26,0.5)]"
          />
        </div>
      </label>

      <label className="block space-y-1.5">
        <span className="font-dashboard text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
          Confirm password
        </span>
        <div className="grid h-12 grid-cols-[2.75rem_1fr] items-center overflow-hidden rounded-xl border-2 border-line bg-[#fcfaf7] shadow-[0_2px_0_#000] transition-all focus-within:-translate-y-0.5 focus-within:shadow-[0_3px_0_#000]">
          <div className="flex h-full items-center justify-center border-r-2 border-line bg-white text-text-muted">
            <KeyRound size={16} />
          </div>
          <input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat password"
            required
            className="h-full w-full border-0 bg-transparent px-3 text-sm font-semibold text-text outline-none placeholder:text-[rgba(26,26,26,0.5)]"
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
        {pending ? "Creating account..." : "Create account"}
        {!pending ? <ArrowRight size={14} /> : null}
      </button>

      <p className="text-center text-xs font-semibold text-text-muted">
        Already have an account?{" "}
        <Link
          href={`/sign-in?next=${encodeURIComponent(nextPath)}`}
          className="font-bold text-text underline decoration-2 underline-offset-2"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
