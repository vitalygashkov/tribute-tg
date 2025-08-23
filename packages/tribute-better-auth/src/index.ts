import type { BetterAuthPlugin } from 'better-auth';

import type { TributeEndpoints, TributeOptions } from './types';
import { getSchema } from './schema';
import { webhooks } from './webhooks';
import { subscription } from './subscription';

export { tributeClient } from './client';

export * from './subscription';
export * from './webhooks';
export * from './types';

export const tribute = (options: TributeOptions) => {
  const plugins = [webhooks(options), subscription(options)]
    .map((use) => use(options.tributeClient))
    .reduce((acc, plugin) => {
      Object.assign(acc, plugin);
      return acc;
    }, {} as TributeEndpoints);

  return {
    id: 'tribute',
    endpoints: { ...plugins },
    schema: getSchema(options),
  } satisfies BetterAuthPlugin;
};
