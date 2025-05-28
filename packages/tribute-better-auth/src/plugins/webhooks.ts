import { createHmac } from 'node:crypto';
import { createAuthEndpoint } from 'better-auth/api';
import type { Tribute } from '../../../tribute-sdk/src';

export const verifyHmac = (
  key: string,
  data: string,
  expectedHmac: string,
  algorithm = 'sha256',
  encoding: 'hex' | 'base64' = 'hex'
) => {
  const computedHmac = createHmac(algorithm, key).update(data).digest(encoding);
  return computedHmac === expectedHmac;
};

interface WebhookSubscriptionPayload {
  subscription_name: string;
  subscription_id: number;
  period_id: number;
  period: 'weekly' | 'monthly' | 'yearly';
  price: number;
  amount: number;
  currency: 'rub' | 'eur';
  user_id: number;
  telegram_user_id: number;
  web_app_link: string;
  channel_id: number;
  channel_name: string;
  expires_at: string;
}

export interface WebhooksOptions {
  /**
   * Webhook Secret
   */
  secret: string;
  /**
   * Webhook for subscription created
   */
  onSubscriptionCreated?: (payload: WebhookSubscriptionPayload) => Promise<void>;
  /**
   * Webhook for subscription canceled
   */
  onSubscriptionCanceled?: (payload: WebhookSubscriptionPayload) => Promise<void>;
  /**
   * Webhook for any other event
   */
  onPayload?: (event: any) => Promise<void>;
}

export const webhooks = (webhooksOptions: WebhooksOptions) => (_tribute: Tribute) => {
  return {
    tributeWebhooks: createAuthEndpoint('/tribute/webhooks', { method: 'POST' }, async (ctx) => {
      const signature = ctx.headers?.get('Trbt-Signature');
      if (!signature) return ctx.error(401);
      const isVerified = verifyHmac(webhooksOptions.secret, JSON.stringify(ctx.body), signature);
      if (!isVerified) return ctx.error(401);

      const { onSubscriptionCreated, onSubscriptionCanceled, onPayload } = webhooksOptions;

      const event = ctx.body;
      const eventName = event.name;

      if (eventName === 'new_subscription') {
        onSubscriptionCreated?.(event.payload);
      } else if (eventName === 'cancelled_subscription') {
        onSubscriptionCanceled?.(event);
      }
      onPayload?.(event.payload);
    }),
  };
};
