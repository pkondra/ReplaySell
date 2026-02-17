export const COOKIE_CONSENT_COOKIE_NAME = "replaysell_cookie_consent";
export const COOKIE_OPTIONAL_FEATURES_COOKIE_NAME =
  "replaysell_optional_cookies_enabled";
export const COOKIE_CONSENT_STORAGE_KEY = "replaysell_cookie_consent";
export const COOKIE_CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

export type CookieConsentChoice = "essential" | "all";

const COOKIE_CONSENT_VALUES: ReadonlyArray<CookieConsentChoice> = [
  "essential",
  "all",
];

export function isCookieConsentChoice(
  value: string | null | undefined,
): value is CookieConsentChoice {
  if (!value) return false;
  return COOKIE_CONSENT_VALUES.includes(value as CookieConsentChoice);
}

export function parseCookieValue(
  cookieString: string,
  name: string,
): string | null {
  const entries = cookieString.split(";").map((item) => item.trim());
  for (const entry of entries) {
    if (!entry) continue;
    const separator = entry.indexOf("=");
    if (separator <= 0) continue;
    const cookieName = entry.slice(0, separator);
    if (cookieName !== name) continue;
    return decodeURIComponent(entry.slice(separator + 1));
  }
  return null;
}
