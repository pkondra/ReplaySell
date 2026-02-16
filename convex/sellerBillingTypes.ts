export const SELLER_PLAN_IDS = ["starter", "growth", "boutique"] as const;
export type SellerPlanId = (typeof SELLER_PLAN_IDS)[number];

export const SELLER_TRIAL_DAYS = 7;
