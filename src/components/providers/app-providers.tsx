"use client";

import { ConvexProviderWithAuth } from "convex/react";
import type { ReactNode } from "react";
import { useCallback, useRef } from "react";
import { SessionProvider, useSession } from "next-auth/react";

import { ToastProvider } from "@/components/ui/toast-provider";
import { getConvexClient } from "@/lib/convex-client";

const convex = getConvexClient();

function useAuthFromAuthJs() {
  const { data: session, status, update } = useSession();
  const lastForcedRefreshAtRef = useRef(0);
  const convexToken = session?.convexToken ?? null;

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      if (forceRefreshToken) {
        const now = Date.now();
        const refreshCooldownMs = 60_000;

        // Convex can request force refresh repeatedly when auth is unstable.
        // Throttle refresh calls to avoid hammering /api/auth/session.
        if (now - lastForcedRefreshAtRef.current < refreshCooldownMs) {
          return convexToken;
        }

        lastForcedRefreshAtRef.current = now;

        try {
          const updatedSession = await update();
          return updatedSession?.convexToken ?? convexToken;
        } catch {
          return convexToken;
        }
      }

      return convexToken;
    },
    [convexToken, update],
  );

  return {
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    fetchAccessToken,
  };
}

function ConvexWithAuthProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useAuthFromAuthJs}>
      <ToastProvider>{children}</ToastProvider>
    </ConvexProviderWithAuth>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchInterval={10 * 60} refetchOnWindowFocus={false}>
      <ConvexWithAuthProvider>{children}</ConvexWithAuthProvider>
    </SessionProvider>
  );
}
