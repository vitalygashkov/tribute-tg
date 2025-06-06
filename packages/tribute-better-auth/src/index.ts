import type { BetterAuthPlugin } from 'better-auth';

import type { TributeEndpoints, TributeOptions } from './types';
import { getSchema } from './schema';

export { tributeClient } from './client';

export * from './plugins/portal';
export * from './plugins/checkout';
export * from './plugins/webhooks';
export * from './types';

export const tribute = (options: TributeOptions) => {
  const plugins = options.use
    .map((use) => use(options.client))
    .reduce((acc, plugin) => {
      Object.assign(acc, plugin);
      return acc;
    }, {} as TributeEndpoints);

  return {
    id: 'tribute',
    endpoints: {
      ...plugins,
    },
    schema: getSchema(options),
  } satisfies BetterAuthPlugin;
};
