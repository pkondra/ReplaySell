"use client";

import { ConvexProviderWithAuth } from "convex/react";
import type { ReactNode } from "react";
import { useCallback } from "react";
import { SessionProvider, useSession } from "next-auth/react";

import { ToastProvider } from "@/components/ui/toast-provider";
import { getConvexClient } from "@/lib/convex-client";

const convex = getConvexClient();

function useAuthFromAuthJs() {
  const { data: session, status, update } = useSession();

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      if (forceRefreshToken) {
        const updatedSession = await update();
        return updatedSession?.convexToken ?? null;
      }

      return session?.convexToken ?? null;
    },
    [session?.convexToken, update],
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
    <SessionProvider refetchInterval={5 * 60}>
      <ConvexWithAuthProvider>{children}</ConvexWithAuthProvider>
    </SessionProvider>
  );
}
