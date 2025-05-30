import { AuthPluginSchema } from 'better-auth';

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
        type: 'string',
        required: true,
      },
      telegramUserId: {
        type: 'string',
        required: true,
      },
      channelId: {
        type: 'string',
        required: true,
      },
      period: {
        type: 'string',
        required: true,
      },
      price: {
        type: 'string',
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
} satisfies AuthPluginSchema;

export const user = {
  user: {
    fields: {
      tributeUserId: {
        type: 'number',
        required: false,
      },
    },
  },
} satisfies AuthPluginSchema;
