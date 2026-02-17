export const CONNECT_ONBOARDING_COUNTRIES = [
  { code: "us", label: "United States" },
  { code: "ca", label: "Canada" },
  { code: "gb", label: "United Kingdom" },
  { code: "ae", label: "United Arab Emirates" },
] as const;

export type ConnectOnboardingCountry =
  (typeof CONNECT_ONBOARDING_COUNTRIES)[number]["code"];

export const DEFAULT_CONNECT_ONBOARDING_COUNTRY: ConnectOnboardingCountry = "us";

const ALLOWED_CONNECT_ONBOARDING_COUNTRIES = new Set<ConnectOnboardingCountry>(
  CONNECT_ONBOARDING_COUNTRIES.map((item) => item.code),
);

export function normalizeConnectOnboardingCountry(
  value: unknown,
): ConnectOnboardingCountry | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (ALLOWED_CONNECT_ONBOARDING_COUNTRIES.has(normalized as ConnectOnboardingCountry)) {
    return normalized as ConnectOnboardingCountry;
  }
  return null;
}
