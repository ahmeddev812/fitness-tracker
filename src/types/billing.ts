export type PlanKeyClient = "pro_monthly" | "pro_yearly" | "lifetime";
export type UserPlan = PlanKeyClient | "free";

export interface SavedPaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface SubscriptionStatus {
  plan: UserPlan;
  planLabel: string;
  isActive: boolean;
  status: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  customerId: string | null;
  paymentMethods: SavedPaymentMethod[];
  hasPaymentMethod: boolean;
}
