import type { Metadata } from "next";
import { Manrope, Outfit, Space_Grotesk } from "next/font/google";

import { NewAccountCelebration } from "@/components/auth/new-account-celebration";
import { CookieConsentBanner } from "@/components/legal/cookie-consent-banner";
import { AppProviders } from "@/components/providers/app-providers";

import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

/* ------------------------------------------------------------------ */
/*  SEO Metadata                                                        */
/* ------------------------------------------------------------------ */

const SITE_URL = "https://replaysell.com";
const SITE_NAME = "ReplaySell";
const SITE_DESCRIPTION =
  "Turn your live shopping replays into shoppable storefronts with countdown timers, buyer accounts, stock alerts, and Stripe checkout.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${SITE_NAME} — Live Replay Storefronts`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,

  keywords: [
    "live shopping",
    "replay storefront",
    "shoppable replay",
    "live selling",
    "replay page",
    "countdown timer",
    "stock alerts",
    "price drop alerts",
    "Stripe Connect",
    "ecommerce",
    "live commerce",
    "replay commerce",
    "ReplaySell",
  ],

  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Your live shopping replay, now a storefront`,
    description: SITE_DESCRIPTION,
  },

  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Live Replay Storefronts`,
    description: SITE_DESCRIPTION,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: SITE_URL,
  },

  category: "ecommerce",
};

/* ------------------------------------------------------------------ */
/*  Layout                                                              */
/* ------------------------------------------------------------------ */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${manrope.variable} ${spaceGrotesk.variable} bg-bg font-sans text-text antialiased`}
      >
        <AppProviders>
          <div className="relative z-10 min-h-screen overflow-x-hidden">{children}</div>
          <CookieConsentBanner />
          <NewAccountCelebration />
        </AppProviders>
      </body>
    </html>
  );
}
