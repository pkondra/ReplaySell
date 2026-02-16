import type { AuthConfig } from "convex/server";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

const issuer = trimTrailingSlash(
  process.env.CONVEX_AUTH_ISSUER ??
    process.env.AUTH_ISSUER_URL ??
    "https://replay-sell.vercel.app",
);

const convexSiteUrl = trimTrailingSlash(
  process.env.NEXT_PUBLIC_CONVEX_SITE_URL ??
    "https://missing-convex-site.invalid",
);

const jwksUrl = `${convexSiteUrl}/auth/jwks`;

export default {
  providers: [
    {
      type: "customJwt",
      issuer,
      jwks: jwksUrl,
      algorithm: "RS256",
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
