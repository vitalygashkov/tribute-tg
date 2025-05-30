import { APIError, createAuthEndpoint } from 'better-auth/api';
import { z } from 'zod/v4';
import { Tribute } from '@tribute-tg/sdk';
import { CheckoutSubscription } from '../types';

export interface CheckoutOptions {
  /**
   * Optional list of slug -> subscriptionId mappings for easy slug checkouts
   */
  subscriptions?: CheckoutSubscription[] | (() => Promise<CheckoutSubscription[]>);
}

const cachedSubscriptions: CheckoutSubscription[] = [];

export const checkout = (checkoutOptions: CheckoutOptions) => (tribute: Tribute) => {
  return {
    checkout: createAuthEndpoint(
      '/checkout',
      {
        method: 'POST',
        body: z.object({
          subscriptionId: z.number().optional(),
          period: z.string().optional(),
          currency: z.string().optional(),
          slug: z.string().optional(),
        }),
      },
      async (ctx) => {
        // const session = await getSessionFromCtx(ctx);

        if (!ctx.body.slug && !ctx.body.subscriptionId) {
          throw new APIError('BAD_REQUEST', {
            message: 'Either slug or subscriptionId is required',
          });
        }

        const findFrom = (subscriptions: CheckoutSubscription[]) =>
          subscriptions.find(
            (subscription) =>
              (!ctx.body.subscriptionId || subscription.subscriptionId === ctx.body.subscriptionId) &&
              (!ctx.body.slug || subscription.slug === ctx.body.slug) &&
              (!ctx.body.period || subscription.period === ctx.body.period) &&
              (!ctx.body.currency || subscription.currency === ctx.body.currency)
          );

        let subscription = findFrom(cachedSubscriptions);

        if (!subscription) {
          const resolvedSubscriptions = await (typeof checkoutOptions.subscriptions === 'function'
            ? checkoutOptions.subscriptions()
            : checkoutOptions.subscriptions);
          const resolvedSubscription = findFrom(resolvedSubscriptions ?? []);
          if (resolvedSubscription) subscription = resolvedSubscription;
        }

        if (!subscription) {
          throw new APIError('BAD_REQUEST', {
            message: 'Subscription not found',
          });
        }

        try {
          const cachedLink = subscription.redirectUrl?.trim();
          if (cachedLink) return ctx.json({ url: cachedLink, redirect: true });
          ctx.context.logger.info(`Fetching subscription link for ${subscription.subscriptionId}`);
          const subscriptionResponse = await tribute.getSubscription(subscription.subscriptionId);
          const url = subscriptionResponse.subscription.webLink;
          // Cache link (and other subscription info) in memory to reduce Tribute API calls
          const index = cachedSubscriptions.findIndex((s) => s.subscriptionId === subscription.subscriptionId);
          if (index === -1) {
            cachedSubscriptions.push({ ...subscription, redirectUrl: url });
          } else {
            cachedSubscriptions[index] = { ...subscription, redirectUrl: url };
          }
          return ctx.json({ url, redirect: true });
        } catch (e: unknown) {
          if (e instanceof Error) {
            ctx.context.logger.error(`Tribute checkout creation failed. Error: ${e.message}`);
          }

          throw new APIError('INTERNAL_SERVER_ERROR', {
            message: 'Checkout creation failed',
          });
        }
      }
    ),
  };
};
