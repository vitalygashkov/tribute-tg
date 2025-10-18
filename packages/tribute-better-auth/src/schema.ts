import { mergeSchema } from 'better-auth/db';
import type { BetterAuthPluginDBSchema } from 'better-auth/db';
import type { TributeOptions } from './types';

export const subscriptions = {
  subscription: {
    fields: {
      tributeSubscriptionId: {
        type: 'number',
        required: true,
      },
      tributeSubscriptionName: {
        type: 'string',
        required: true,
      },
      tributeUserId: {
        type: 'number',
        required: true,
      },
      telegramUserId: {
        type: 'number',
        required: true,
      },
      channelId: {
        type: 'number',
        required: true,
      },
      period: {
        type: 'string',
        required: true,
      },
      price: {
        type: 'number',
        required: true,
      },
      amount: {
        type: 'number',
        required: true,
      },
      currency: {
        type: 'string',
        required: true,
      },
      expiresAt: {
        type: 'string',
        required: true,
      },
      status: {
        type: 'string',
        defaultValue: 'active',
      },
    },
  },
} satisfies BetterAuthPluginDBSchema;

export const user = {
  user: {
    fields: {
      tributeUserId: {
        type: 'number',
        required: false,
      },
    },
  },
} satisfies BetterAuthPluginDBSchema;

export const getSchema = (options: TributeOptions) => {
  return mergeSchema(
    {
      ...subscriptions,
      ...user,
    },
    options.schema
  );
};
