import { InferOptionSchema, UnionToIntersection } from 'better-auth';
import type { Currency, Tribute } from '@tribute-tg/sdk';
import { webhooks } from './plugins/webhooks';
import { checkout } from './plugins/checkout';
import { subscriptions, user } from './schema';

export interface Subscription {
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

export type TributePlugin = ReturnType<typeof webhooks> | ReturnType<typeof checkout>;

export type TributeEndpoints = UnionToIntersection<ReturnType<TributePlugin>>;

export interface TributeOptions {
  client: Tribute;
  use: TributePlugin[];
  /**
   * Schema for the tribute plugin
   */
  schema?: InferOptionSchema<typeof subscriptions & typeof user>;
}
