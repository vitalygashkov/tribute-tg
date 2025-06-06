import { z } from 'zod/v4';
import { createAuthEndpoint } from 'better-auth/api';
import type { Account } from 'better-auth';
import type { Tribute, WebhookSubscriptionPayload } from '@tribute-tg/sdk';
import type { Subscription } from '../types';

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
    tributeWebhooks: createAuthEndpoint(
      '/tribute/webhooks',
      {
        method: 'POST',
        body: z.object({
          name: z.string(),
          created_at: z.string(),
          sent_at: z.string(),
          payload: z.any(),
        }),
      },
      async (ctx) => {
        const signature = ctx.headers?.get('Trbt-Signature');
        if (!signature) return ctx.error(401);
        const isVerified = verifyHmac(webhooksOptions.secret, JSON.stringify(ctx.body), signature);
        if (!isVerified) return ctx.error(401);

        const { onSubscriptionCreated, onSubscriptionCanceled, onPayload } = webhooksOptions;

        const event = ctx.body;
        const eventName = event.name;
        const payload = event.payload;

        if (eventName === 'new_subscription') {
          await onSubscriptionCreated?.(event.payload);

          const telegramUserId = payload.telegram_user_id;
          const account = await ctx.context.adapter.findOne<Account>({
            model: 'account',
            where: [
              { field: 'accountId', value: telegramUserId },
              { field: 'providerId', value: 'telegram' },
            ],
          });

          if (account) {
            const userId = account.userId;
            const tributeUserId = payload.user_id;

            await ctx.context.adapter.update({
              model: 'user',
              update: { tributeUserId },
              where: [{ field: 'id', value: userId }],
            });

            await ctx.context.adapter.create<Subscription>({
              model: 'subscription',
              data: {
                userId,
                telegramUserId,
                tributeUserId: payload.user_id,
                tributeSubscriptionId: payload.subscription_id,
                tributeSubscriptionName: payload.subscription_name,
                channelId: payload.channel_id,
                period: payload.period,
                price: payload.price / 100,
                amount: payload.amount / 100,
                currency: payload.currency,
                expiresAt: payload.expires_at,
                status: 'active',
              },
            });
          }
        } else if (eventName === 'cancelled_subscription') {
          await onSubscriptionCanceled?.(payload);

          await ctx.context.adapter.update({
            model: 'subscription',
            update: { status: 'cancelled' },
            where: [
              { field: 'tributeSubscriptionId', value: payload.subscription_id },
              { field: 'tributeUserId', value: payload.user_id },
            ],
          });
        }
        await onPayload?.(event);
      }
    ),
  };
};
