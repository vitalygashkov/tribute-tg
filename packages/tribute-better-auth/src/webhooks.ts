import { z } from 'zod';
import { createAuthEndpoint } from 'better-auth/api';
import type { Account } from 'better-auth';
import type { Tribute } from '@tribute-tg/sdk';
import type { Subscription, TributeOptions } from './types';
import { verifyHmac } from './util';

export const webhooks =
  (webhooksOptions: Pick<TributeOptions, 'onNewSubscription' | 'onCancelledSubscription' | 'onEvent'>) =>
  (tribute: Tribute) => {
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
          const isVerified = verifyHmac(tribute.apiKey, JSON.stringify(ctx.body), signature);
          if (!isVerified) return ctx.error(401);

          const { onNewSubscription, onCancelledSubscription, onEvent } = webhooksOptions;

          const event = ctx.body;
          const eventName = event.name;
          const payload = event.payload;

          if (eventName === 'new_subscription') {
            await onNewSubscription?.(event.payload);

            const telegramUserId = payload.telegram_user_id;
            const account = await ctx.context.adapter.findOne<Account>({
              model: 'account',
              where: [
                { field: 'accountId', value: String(telegramUserId) },
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
            await onCancelledSubscription?.(payload);

            await ctx.context.adapter.update({
              model: 'subscription',
              update: { status: 'cancelled' },
              where: [
                { field: 'tributeSubscriptionId', value: payload.subscription_id },
                { field: 'tributeUserId', value: payload.user_id },
              ],
            });
          }
          await onEvent?.(event);
        }
      ),
    };
  };
