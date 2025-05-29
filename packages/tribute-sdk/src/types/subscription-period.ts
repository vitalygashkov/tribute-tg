export type Period = 'onetime' | 'monthly' | 'yearly' | 'weekly';

export interface SubscriptionPeriodPayload {
  period: Period;
  amount: number;
  firstTimeDiscountEnabled: boolean;
  firstTimeDiscountPercent: number;
  cancellationDiscountEnabled: boolean;
  cancellationDiscountPercent: number;
}

export interface SubscriptionPeriod extends SubscriptionPeriodPayload {
  id: number;
  active: boolean;
}
