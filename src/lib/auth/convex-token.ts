import "server-only";

import { createPrivateKey, createPublicKey, type KeyObject } from "node:crypto";
import { SignJWT } from "jose";

const CONVEX_AUDIENCE = "convex";
const CONVEX_TOKEN_LIFETIME = "55m";

let cachedPrivateKey: KeyObject | null = null;
type PublicJwk = JsonWebKey & {
  alg: "RS256";
  kid: string;
  use: "sig";
};

let cachedJwks: { keys: PublicJwk[] } | null = null;

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

function normalizeEnvMultiline(value: string) {
  return value.replace(/\\n/g, "\n");
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getConvexAuthIssuer() {
  const rawIssuer =
    process.env.CONVEX_AUTH_ISSUER ??
    process.env.AUTH_ISSUER_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "https://replay-sell.vercel.app";

  return trimTrailingSlash(rawIssuer);
}

export function getConvexAuthKeyId() {
  return process.env.CONVEX_AUTH_KEY_ID?.trim() || "replaysell-rs256-key";
}

function getPrivateKey() {
  if (!cachedPrivateKey) {
    const pem = normalizeEnvMultiline(getRequiredEnv("CONVEX_AUTH_PRIVATE_KEY"));
    cachedPrivateKey = createPrivateKey(pem);
  }
  return cachedPrivateKey;
}

export async function issueConvexToken({
  subject,
  email,
  name,
}: {
  subject: string;
  email?: string | null;
  name?: string | null;
}) {
  const nowSeconds = Math.floor(Date.now() / 1000);

  const claims: Record<string, string> = {};
  if (email) claims.email = email;
  if (name) claims.name = name;

  return await new SignJWT(claims)
    .setProtectedHeader({ alg: "RS256", kid: getConvexAuthKeyId(), typ: "JWT" })
    .setIssuer(getConvexAuthIssuer())
    .setSubject(subject)
    .setAudience(CONVEX_AUDIENCE)
    .setIssuedAt(nowSeconds)
    .setExpirationTime(CONVEX_TOKEN_LIFETIME)
    .sign(getPrivateKey());
}

export function getConvexPublicJwks() {
  if (!cachedJwks) {
    const jwk = createPublicKey(getPrivateKey()).export({
      format: "jwk",
    }) as JsonWebKey;

    const publicJwk: PublicJwk = {
      ...(jwk as PublicJwk),
      alg: "RS256",
      kid: getConvexAuthKeyId(),
      use: "sig",
    };

    cachedJwks = {
      keys: [publicJwk],
    };
  }

  return cachedJwks;
}
