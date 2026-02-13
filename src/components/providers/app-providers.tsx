"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import type { ReactNode } from "react";

import { ToastProvider } from "@/components/ui/toast-provider";
import { getConvexClient } from "@/lib/convex-client";

const convex = getConvexClient();
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const clerkAppearance = {
  variables: {
    colorPrimary: "#a3e635",
    colorBackground: "#18181c",
    colorInputBackground: "#0c0c10",
    colorInputText: "#f4f4f5",
    colorText: "#f4f4f5",
    colorTextSecondary: "#a1a1aa",
    colorDanger: "#f472b6",
    colorNeutral: "#f4f4f5",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "bg-[#18181c] border border-[#33333a] shadow-none w-full",
    headerTitle: "text-[#f4f4f5]",
    headerSubtitle: "text-[#a1a1aa]",
    socialButtonsBlockButton:
      "bg-[#232329] border border-[#33333a] text-[#f4f4f5] hover:bg-[#33333a]",
    socialButtonsBlockButtonText: "text-[#f4f4f5]",
    dividerLine: "bg-[#33333a]",
    dividerText: "text-[#a1a1aa]",
    formFieldLabel: "text-[#a1a1aa]",
    formFieldInput:
      "bg-[#0c0c10] border-[#33333a] text-[#f4f4f5] focus:ring-[#a3e635]/30 focus:border-[#a3e635]/40",
    formButtonPrimary:
      "bg-[#a3e635] text-[#0c0c10] font-semibold hover:bg-[#bef264] border-none",
    footerAction: "text-[#a1a1aa]",
    footerActionLink: "text-[#a3e635] hover:text-[#bef264]",
    identityPreview: "bg-[#232329] border-[#33333a]",
    identityPreviewText: "text-[#f4f4f5]",
    identityPreviewEditButton: "text-[#a3e635]",
    formFieldSuccessText: "text-[#a3e635]",
    alert: "bg-[#232329] border-[#33333a] text-[#f4f4f5]",
    alertText: "text-[#f4f4f5]",
    footer: "bg-transparent",
    footerPages: "bg-transparent",
  },
};

function SetupRequired() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="max-w-sm space-y-3 rounded-lg border border-line bg-panel p-6 text-center">
        <h1 className="text-base font-semibold text-text">Setup required</h1>
        <p className="text-sm leading-relaxed text-text-muted">
          Copy <code className="rounded bg-panel-strong px-1.5 py-0.5 font-mono text-xs">.env.example</code> to{" "}
          <code className="rounded bg-panel-strong px-1.5 py-0.5 font-mono text-xs">.env.local</code> and add your
          Clerk keys from{" "}
          <a
            href="https://dashboard.clerk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            dashboard.clerk.com
          </a>
        </p>
      </div>
    </main>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  if (!clerkPublishableKey || clerkPublishableKey.trim() === "") {
    return <SetupRequired />;
  }

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      appearance={clerkAppearance}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ToastProvider>{children}</ToastProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
