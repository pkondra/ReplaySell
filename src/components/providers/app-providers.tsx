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
    colorPrimary: "#ff9ecd",
    colorBackground: "#fcfaf7",
    colorInputBackground: "#fcfaf7",
    colorInputText: "#1a1a1a",
    colorText: "#1a1a1a",
    colorTextSecondary: "rgba(26,26,26,0.62)",
    colorDanger: "#ff6b5a",
    colorNeutral: "#1a1a1a",
    borderRadius: "12px",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "bg-white border-[3px] border-[#1a1a1a] rounded-2xl shadow-[0_6px_0_#000] w-full",
    headerTitle: "text-[#1a1a1a]",
    headerSubtitle: "text-[rgba(26,26,26,0.62)]",
    socialButtonsBlockButton:
      "bg-white border-2 border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#f2f2f2] shadow-[0_3px_0_#000]",
    socialButtonsBlockButtonText: "text-[#1a1a1a]",
    dividerLine: "bg-[#1a1a1a]",
    dividerText: "text-[rgba(26,26,26,0.62)]",
    formFieldLabel: "text-[rgba(26,26,26,0.7)]",
    formFieldInput:
      "bg-[#fcfaf7] border-2 border-[#1a1a1a] text-[#1a1a1a] shadow-[0_2px_0_#000] focus:ring-0 focus:border-[#1a1a1a]",
    formButtonPrimary:
      "bg-[#ff9ecd] border-[3px] border-[#1a1a1a] shadow-[0_6px_0_#000] text-[#1a1a1a] font-bold hover:bg-[#acf8e0]",
    footerAction: "text-[rgba(26,26,26,0.62)]",
    footerActionLink: "text-[#1a1a1a] underline",
    identityPreview: "bg-[#f2f2f2] border-2 border-[#1a1a1a]",
    identityPreviewText: "text-[#1a1a1a]",
    identityPreviewEditButton: "text-[#1a1a1a]",
    formFieldSuccessText: "text-[#22C55E]",
    alert: "bg-[#fff3f0] border-2 border-[#1a1a1a] text-[#1a1a1a]",
    alertText: "text-[#1a1a1a]",
    footer: "bg-transparent",
    footerPages: "bg-transparent",
  },
};

function SetupRequired() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="max-w-sm space-y-3 rounded-2xl border-[3px] border-line bg-panel p-6 text-center shadow-[0_6px_0_#000]">
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
