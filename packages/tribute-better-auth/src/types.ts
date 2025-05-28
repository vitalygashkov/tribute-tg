import { UnionToIntersection } from 'better-auth';
import { webhooks } from './plugins/webhooks';
import { checkout } from './plugins/checkout';

export interface Subscription {
  /**
   * Subscription Id from Tribute Subscription
   */
  subscriptionId: number;
  /**
   * Easily identifiable slug for the subscription
   */
  slug: string;
}

export type TributePlugin = ReturnType<typeof webhooks> | ReturnType<typeof checkout>;

export type TributeEndpoints = UnionToIntersection<ReturnType<TributePlugin>>;
