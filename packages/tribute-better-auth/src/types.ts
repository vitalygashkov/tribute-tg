import type { InferOptionSchema, UnionToIntersection } from 'better-auth';
import type { Currency, Period, Tribute } from '@tribute-tg/sdk';
import { webhooks } from './plugins/webhooks';
import { checkout } from './plugins/checkout';
import { portal } from './plugins/portal';
import { subscriptions, user } from './schema';

export interface CheckoutSubscription {
  /**
   * Subscription Id from Tribute Subscription
   */
  subscriptionId: number;
  /**
   * Easily identifiable slug for the subscription
   */
  slug: string;
  /**
   * Period (onetime, monthly, yearly, etc.)
   */
  period?: string;
  currency?: Currency;
  redirectUrl?: string;
}

export interface Subscription {
  tributeSubscriptionId: number;
  tributeSubscriptionName: string;
  tributeUserId: number;
  telegramUserId: number;
  userId: string;
  channelId: number;
  period: Period;
  price: number;
  amount: number;
  currency: Currency;
  expiresAt: string;
  status: string;
}

export type TributePlugin = ReturnType<typeof portal> | ReturnType<typeof webhooks> | ReturnType<typeof checkout>;

export type TributeEndpoints = UnionToIntersection<ReturnType<TributePlugin>>;

export interface TributeOptions {
  client: Tribute;
  use: TributePlugin[];
  /**
   * Schema for the tribute plugin
   */
  schema?: InferOptionSchema<typeof subscriptions & typeof user>;
}
