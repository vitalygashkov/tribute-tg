import { createAuthEndpoint } from 'better-auth/api';
import type { Tribute } from '@tribute-tg/sdk';

export const verifyHmac = async (key: string, data: string, expectedHmac: string) => {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const dataToVerify = encoder.encode(data);
  const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataToVerify);
  const computedHmac = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
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
   * A callback to run after a user has subscribed
   * @param payload
   * @returns
   */
  onSubscriptionCreated?: (payload: WebhookSubscriptionPayload) => Promise<void>;
  /**
   * A callback to run after a user is about to cancel their subscription
   * @returns
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
        await onSubscriptionCreated?.(event.payload);
      } else if (eventName === 'cancelled_subscription') {
        await onSubscriptionCanceled?.(event);
      }
      await onPayload?.(event.payload);
    }),
  };
};
