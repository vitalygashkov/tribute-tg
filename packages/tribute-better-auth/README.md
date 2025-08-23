# @tribute-tg/better-auth

A [Better Auth](https://github.com/better-auth/better-auth) plugin for integrating [Tribute](https://tribute.tg) payments and subscriptions into your authentication flow.

## Features

- Checkout Integration
- Handle Tribute Webhooks securely with signature verification

## Installation

```bash
npm i better-auth @tribute-sh/better-auth @tribute-tg/sdk
```

## Preparation

> Authorization token can be obtained from a network request in the web version of [Telegram](https://web.telegram.org/k/) while using the Tribute mini-app. See `Authorization` header (in the request with [tribute.tg](https://tribute.tg/) host) and copy value after `TgAuth ` prefix.

> API key can be obtained from the Tribute Developers Settings page: https://wiki.tribute.tg/for-content-creators/api-documentation#how-to-get-an-api-key

```bash
# .env
TG_AUTH_TOKEN=...
TRIBUTE_API_KEY=...
```

### Configuring BetterAuth Server

The Tribute plugin comes with a handful additional plugins which adds functionality to your stack.

- Checkout - Enables a seamless checkout integration
- Webhooks - Listen for relevant Tribute webhooks

```typescript
import { betterAuth } from "better-auth";
import { tribute } from "@tribute-tg/better-auth";
import { Tribute } from "@tribute-tg/sdk";

const tributeClient = new Tribute({ token: process.env.TG_AUTH_TOKEN, apiKey: process.env.TRIBUTE_API_KEY });

const auth = betterAuth({
  // ... Better Auth config
  plugins: [
    tribute({
      tributeClient,
      subscriptions: [
        {
          subscriptionId: 123456, // ID of Subscription from Tribute
          slug: "pro" // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
        }
      ],
      onNewSubscription: (payload) => // Triggered when subscription was created
      onCancelledSubscription: (payload) => // Triggered when subscription was canceled
      ...  // Other webhook handlers
      onEvent: (event) => // Catch-all for all events
    })
  ]
});
```

### Configuring BetterAuth Client

You will be using the BetterAuth Client to interact with the Tribute functionalities.

```typescript
import { createAuthClient } from 'better-auth/react';
import { tributeClient } from '@tribute-tg/better-auth';

// This is all that is needed
// All Tribute plugins, etc. should be attached to the server-side BetterAuth config
export const authClient = createAuthClient({
  plugins: [tributeClient()],
});
```

## Configuration Options

```typescript
import { betterAuth } from 'better-auth';
import { tribute, checkout, webhooks } from '@tribute-tg/better-auth';
import { Tribute } from '@tribute-tg/sdk';

const tributeClient = new Tribute({ token: process.env.TG_AUTH_TOKEN, apiKey: process.env.TRIBUTE_API_KEY });

const auth = betterAuth({
  // ... Better Auth config
  plugins: [
    tribute({
      tributeClient,
      // This is where you add Tribute options
    }),
  ],
});
```

### Required Options

- `tributeClient`: Tribute SDK client instance

## Checkout

To support checkouts in your app, simply pass the Checkout to the use-property.

```typescript
import { tribute } from "@tribute-tg/better-auth";

const auth = betterAuth({
  // ... Better Auth config
  plugins: [
    tribute({
      ...
      // Optional field - will make it possible to pass a slug to checkout instead of Subscription ID
      subscriptions: [ { subscriptionId: 123456, slug: "pro" } ],
    })
  ]
});
```

When checkouts are enabled, you're able to initialize Checkout Sessions using the checkout-method on the BetterAuth Client. This will redirect the user to the Subscription Checkout.

```typescript
await authClient.checkout({
  // Any Tribute Subscription ID can be passed here
  subscriptionId: 123456,
  // Or, if you setup "subscriptions" in the Checkout Config, you can pass the slug
  slug: 'pro',
});
```

## Webhooks

The Webhooks can be used to capture incoming events from your monetized Telegram channels.

```typescript
import { tribute } from "@tribute-tg/better-auth";

const auth = betterAuth({
  // ... Better Auth config
  plugins: [
    tribute({
      ...
      onNewSubscription: (payload) => // Triggered when subscription was created
      onCancelledSubscription: (payload) => // Triggered when subscription was canceled
      ...  // Other webhook handlers
      onEvent: (event) => // Catch-all for all events
    })
  ]
});
```

Configure a Webhook endpoint in your Tribute Developers Settings page. Webhook endpoint is configured at /tribute/webhooks.

Add the API key to your environment.

```bash
# .env
TRIBUTE_API_KEY=...
```

The plugin supports handlers for all Tribute webhook events:

- `onEvent` - Catch-all handler for any incoming Webhook event
- `onNewSubscription` - Triggered when a subscription is created
- `onCancelledSubscription` - Triggered when a subscription is updated
