import { APIError } from 'better-auth/api';
import { sessionMiddleware } from 'better-auth/api';
import { createAuthEndpoint } from 'better-auth/plugins';
import { z } from 'zod';
import type { Tribute } from '@tribute-tg/sdk';
import type { CheckoutSubscription, Subscription, TributeOptions } from './types';

const cachedSubscriptions: CheckoutSubscription[] = [];

export const subscription = (options: Pick<TributeOptions, 'subscriptions'>) => (tribute: Tribute) => {
  return {
    upgradeSubscription: createAuthEndpoint(
      '/subscription/upgrade',
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
          const resolvedSubscriptions = await (typeof options.subscriptions === 'function'
            ? options.subscriptions()
            : options.subscriptions);
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

    listActiveSubscriptions: createAuthEndpoint(
      '/subscription/list',
      {
        method: 'GET',
        use: [sessionMiddleware],
      },
      async (ctx) => {
        if (!ctx.context.session.user.id || !ctx.context.session.user['tributeUserId']) {
          throw new APIError('BAD_REQUEST', {
            message: 'User not found',
          });
        }

        try {
          const userSubscriptions = await ctx.context.adapter.findMany<Subscription>({
            model: 'subscription',
            where: [{ field: 'tributeUserId', value: ctx.context.session.user['tributeUserId'] }],
          });

          const activeSubscriptions = userSubscriptions.filter((s) => {
            const expiresAt = new Date(s.expiresAt);
            return expiresAt > new Date() || s.status === 'active';
          });

          return ctx.json(activeSubscriptions);
        } catch (e: unknown) {
          if (e instanceof Error) {
            ctx.context.logger.error(`Tribute subscriptions list failed. Error: ${e.message}`);
          }

          throw new APIError('INTERNAL_SERVER_ERROR', {
            message: 'Subscriptions list failed',
          });
        }
      }
    ),

    portal: createAuthEndpoint(
      '/customer/portal',
      {
        method: 'GET',
        use: [sessionMiddleware],
      },
      async (ctx) => {
        if (!ctx.context.session?.user.id) {
          throw new APIError('BAD_REQUEST', {
            message: 'User not found',
          });
        }

        try {
          return ctx.json({
            url: 'https://t.me/tribute/app?startapp=',
            redirect: true,
          });
        } catch (e: unknown) {
          if (e instanceof Error) {
            ctx.context.logger.error(`Tribute customer portal creation failed. Error: ${e.message}`);
          }

          throw new APIError('INTERNAL_SERVER_ERROR', {
            message: 'Customer portal creation failed',
          });
        }
      }
    ),
    state: createAuthEndpoint(
      '/customer/state',
      {
        method: 'GET',
        use: [sessionMiddleware],
      },
      async (ctx) => {
        if (!ctx.context.session.user.id || !ctx.context.session.user['tributeUserId']) {
          throw new APIError('BAD_REQUEST', {
            message: 'User not found',
          });
        }

        try {
          const userSubscriptions = await ctx.context.adapter.findMany<Subscription>({
            model: 'subscription',
            where: [{ field: 'tributeUserId', value: ctx.context.session.user['tributeUserId'] }],
          });

          const activeSubscriptions = userSubscriptions.filter((s) => {
            const expiresAt = new Date(s.expiresAt);
            return expiresAt > new Date() || s.status === 'active';
          });

          const state = {
            ...ctx.context.session.user,
            activeSubscriptions,
          };

          return ctx.json(state);
        } catch (e: unknown) {
          if (e instanceof Error) {
            ctx.context.logger.error(`Tribute customer state failed. Error: ${e.message}`);
          }

          throw new APIError('INTERNAL_SERVER_ERROR', {
            message: 'Customer state failed',
          });
        }
      }
    ),
  };
};
