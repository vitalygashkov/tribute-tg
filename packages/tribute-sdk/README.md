# @tribute-tg/sdk

Developer-friendly & type-safe Typescript SDK specifically catered to leverage [Tribute](https://tribute.tg) API.

## SDK Installation

The SDK can be installed with either [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), [bun](https://bun.sh/) or [yarn](https://classic.yarnpkg.com/en/) package managers.

### NPM

```bash
npm add @tribute-tg/sdk
```

### PNPM

```bash
pnpm add @tribute-tg/sdk
```

### Bun

```bash
bun add @tribute-tg/sdk
```

### Yarn

```bash
yarn add @tribute-tg/sdk zod

# Note that Yarn does not install peer dependencies automatically. You will need
# to install zod as shown above.
```

> [!NOTE]
> This package is published with CommonJS and ES Modules (ESM) support.

## Preparation

> Authorization token can be obtained from a network request in the web version of [Telegram](https://web.telegram.org/k/) while using the Tribute mini-app. See `Authorization` header (in the request with [tribute.tg](https://tribute.tg/) host) and copy value after `TgAuth ` prefix.

> API key can be obtained from the Tribute Developers Settings page: https://wiki.tribute.tg/for-content-creators/api-documentation#how-to-get-an-api-key

```bash
# .env
TG_AUTH_TOKEN=...
TRIBUTE_API_KEY=...
```

## SDK Example Usage

### Example

```typescript
import { Tribute } from '@tribute-tg/sdk';

const tribute = new Tribute({ token: process.env.TG_AUTH_TOKEN, apiKey: process.env.TRIBUTE_API_KEY });

async function run() {
  const result = await tribute.getDashboard();

  // Handle the result
  console.log(result);
}

run();
```
