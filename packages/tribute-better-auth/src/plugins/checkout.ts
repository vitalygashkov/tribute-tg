import { APIError, createAuthEndpoint } from 'better-auth/api';
import { z } from 'zod/v4';
import { Tribute } from '@tribute-tg/sdk';
import { Subscription } from '../types';

export interface CheckoutOptions {
  /**
   * Optional list of slug -> subscriptionId mappings for easy slug checkouts
   */
  subscriptions?: Subscription[] | (() => Promise<Subscription[]>);
}

export const checkout = (checkoutOptions: CheckoutOptions) => (tribute: Tribute) => {
  return {
    checkout: createAuthEndpoint(
      '/checkout',
      {
        method: 'POST',
        body: z.object({
          subscriptions: z.union([z.array(z.number()), z.number()]).optional(),
          slug: z.string().optional(),
        }),
      },
      async (ctx) => {
        // const session = await getSessionFromCtx(ctx);

        let subscriptionIds: number[] = [];

        if (ctx.body.slug) {
          const resolvedSubscriptions = await (typeof checkoutOptions.subscriptions === 'function'
            ? checkoutOptions.subscriptions()
            : checkoutOptions.subscriptions);

          const subscriptionId = resolvedSubscriptions?.find(
            (product) => product.slug === ctx.body.slug
          )?.subscriptionId;

          if (!subscriptionId) {
            throw new APIError('BAD_REQUEST', {
              message: 'Subscription not found',
            });
          }

          subscriptionIds = [subscriptionId];
        } else {
          subscriptionIds = Array.isArray(ctx.body.subscriptions)
            ? ctx.body.subscriptions.filter((id) => id !== undefined)
            : [ctx.body.subscriptions].filter((id) => id !== undefined);
        }

        try {
          const id = subscriptionIds[0];
          if (!id) {
            throw new APIError('BAD_REQUEST', { message: 'Subscription not found' });
          }
          const subscriptionResponse = await tribute.getSubscription(id);
          const url = subscriptionResponse.subscription.webLink;

          return ctx.json({
            url: url,
            redirect: true,
          });
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
