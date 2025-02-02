# tribute-tg

Unofficial API client of Tribute - a service for monetization in Telegram.

[Wiki](https://wiki.tribute.tg/)

## Installation

```bash
npm i tribute-tg
```

## Usage

```js
import { Tribute } from 'tribute-tg';

const TOKEN = 'YOUR_TRIBUTE_TOKEN';

const tribute = new Tribute(TOKEN);

async function main() {
  const dashboard = await tribute.getDashboard();
  // ...
}
```
