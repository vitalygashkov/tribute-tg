import type { BetterAuthPlugin } from 'better-auth';
import type { TributeEndpoints, TributePlugin } from './types';
import type { Tribute } from '../../tribute-sdk/src';

interface TributeOptions {
  client: Tribute;
  use: TributePlugin[];
}

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
  } satisfies BetterAuthPlugin;
};

export * from './plugins/checkout';
export * from './plugins/webhooks';
