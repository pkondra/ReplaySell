"use client";

import { Cookie, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  COOKIE_CONSENT_COOKIE_NAME,
  COOKIE_CONSENT_MAX_AGE_SECONDS,
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_OPTIONAL_FEATURES_COOKIE_NAME,
  isCookieConsentChoice,
  parseCookieValue,
  type CookieConsentChoice,
} from "@/lib/cookies/consent";

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; samesite=lax${secure}`;
}

function deleteCookie(name: string) {
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax${secure}`;
}

function readSavedConsent(): CookieConsentChoice | null {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return null;
  }

  const cookieValue = parseCookieValue(document.cookie, COOKIE_CONSENT_COOKIE_NAME);
  if (isCookieConsentChoice(cookieValue)) {
    return cookieValue;
  }

  try {
    const localValue = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (isCookieConsentChoice(localValue)) {
      return localValue;
    }
  } catch {
    // Ignore storage access errors and rely on cookie-only behavior.
  }

  return null;
}

function applyConsent(choice: CookieConsentChoice) {
  writeCookie(COOKIE_CONSENT_COOKIE_NAME, choice, COOKIE_CONSENT_MAX_AGE_SECONDS);
  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, choice);
  } catch {
    // Ignore storage access errors and keep cookie persistence.
  }

  if (choice === "all") {
    writeCookie(
      COOKIE_OPTIONAL_FEATURES_COOKIE_NAME,
      "enabled",
      COOKIE_CONSENT_MAX_AGE_SECONDS,
    );
  } else {
    deleteCookie(COOKIE_OPTIONAL_FEATURES_COOKIE_NAME);
  }
}

export function CookieConsentBanner() {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return readSavedConsent() == null;
  });

  useEffect(() => {
    const existing = readSavedConsent();
    if (existing) applyConsent(existing);
  }, []);

  if (!open) return null;

  return (
    <aside className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="pointer-events-auto mx-auto w-full max-w-4xl rounded-2xl border-[3px] border-line bg-white p-4 shadow-[0_8px_0_#000] sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 rounded-full border-2 border-line bg-[#fff8e6] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-text">
              <Cookie size={13} />
              Cookie Preferences
            </p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-text-muted">
              We use essential cookies for sign-in, checkout security, and core functionality. You
              can choose essential only, or accept all cookies for optional features.
            </p>
            <Link
              href="/cookies"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-text underline underline-offset-2"
            >
              <ShieldCheck size={12} />
              Read Cookie Policy
            </Link>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:w-52">
            <button
              type="button"
              onClick={() => {
                applyConsent("essential");
                setOpen(false);
              }}
              className="inline-flex h-10 items-center justify-center rounded-xl border-2 border-line bg-[#fcfaf7] px-3 text-xs font-bold shadow-[0_2px_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[0_3px_0_#000]"
            >
              Essential only
            </button>
            <button
              type="button"
              onClick={() => {
                applyConsent("all");
                setOpen(false);
              }}
              className="inline-flex h-10 items-center justify-center rounded-xl border-[3px] border-line bg-[#acf8e0] px-3 text-xs font-bold shadow-[0_3px_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_0_#000]"
            >
              Accept all cookies
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
