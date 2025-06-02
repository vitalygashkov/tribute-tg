import { APIError } from 'better-auth/api';
import { sessionMiddleware } from 'better-auth/api';
import { createAuthEndpoint } from 'better-auth/plugins';
import type { Tribute } from '@tribute-tg/sdk';
import type { Subscription } from '../types';

export const portal = () => (_tribute: Tribute) => {
  return {
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
