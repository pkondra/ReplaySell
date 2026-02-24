import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const ADMIN_SESSION_COOKIE_NAME = "replaysell_admin_session";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12;

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

function getAdminPin() {
  return getRequiredEnv("ADMIN_PIN").trim();
}

function getSigningSecret() {
  return (
    process.env.AUTH_SECRET?.trim() ||
    process.env.AUTH_INTERNAL_SECRET?.trim() ||
    getAdminPin()
  );
}

function signPayload(payload: string) {
  return createHmac("sha256", getSigningSecret())
    .update(payload)
    .digest("base64url");
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyAdminPin(pin: string) {
  return safeCompare(pin.trim(), getAdminPin());
}

export function createAdminSessionToken() {
  const exp = Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS;
  const nonce = randomBytes(16).toString("hex");
  const payload = `${exp}.${nonce}`;
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined | null) {
  if (!token) return false;
  const [expRaw, nonce, signature] = token.split(".");
  if (!expRaw || !nonce || !signature) return false;

  const exp = Number(expRaw);
  if (!Number.isFinite(exp)) return false;
  if (exp <= Math.floor(Date.now() / 1000)) return false;

  const expected = signPayload(`${expRaw}.${nonce}`);
  return safeCompare(signature, expected);
}

export function getAdminSessionCookieName() {
  return ADMIN_SESSION_COOKIE_NAME;
}

export function getAdminSessionCookieMaxAge() {
  return ADMIN_SESSION_TTL_SECONDS;
}
