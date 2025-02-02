# tribute-tg

Unofficial API client of Tribute - a service for monetization in Telegram.

[Wiki](https://wiki.tribute.tg/)

## Installation

```bash
npm i tribute-tg
```

## Usage

> Authorization token can be obtained from a network request in the web version of [Telegram](https://web.telegram.org/k/) while using the Tribute mini-app. See `Authorization` header (in the request with [tribute.tg](https://tribute.tg/) host) and copy value after `TgAuth ` prefix.

```js
import { Tribute } from 'tribute-tg';

const TOKEN = 'TG_AUTH_TOKEN';

const tribute = new Tribute(TOKEN);

async function main() {
  const dashboard = await tribute.getDashboard();
  // ...
}
```
