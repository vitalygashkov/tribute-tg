import type { InferOptionSchema, UnionToIntersection } from 'better-auth';
import type { Currency, Period, Tribute, WebhookEvent, WebhookSubscriptionPayload } from '@tribute-tg/sdk';
import { webhooks } from './webhooks';
import { subscription } from './subscription';
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

export type TributePlugin = ReturnType<typeof subscription> | ReturnType<typeof webhooks> | ReturnType<typeof checkout>;

export type TributeEndpoints = UnionToIntersection<ReturnType<TributePlugin>>;

export interface TributeOptions {
  /**
   * Tribute Client
   */
  tributeClient: Tribute;

  /**
   * A callback to run after a user has subscribed
   * @param payload - Tribute Subscription Data
   * @returns
   */
  onNewSubscription?: (payload: WebhookSubscriptionPayload) => Promise<void>;

  /**
   * A callback to run after a user is about to cancel their subscription
   * @returns
   */
  onCancelledSubscription?: (payload: WebhookSubscriptionPayload) => Promise<void>;

  /**
   * A callback to run after a Tribute event is received
   * @param event - Tribute Event
   * @returns
   */
  onEvent?: (event: WebhookEvent) => Promise<void>;

  /**
   * Optional list of slug -> subscriptionId mappings for easy slug checkouts
   */
  subscriptions?: CheckoutSubscription[] | (() => Promise<CheckoutSubscription[]>);

  /**
   * Schema for the tribute plugin
   */
  schema?: InferOptionSchema<typeof subscriptions & typeof user>;
}
