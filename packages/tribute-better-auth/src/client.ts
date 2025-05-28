import type { BetterAuthClientPlugin } from 'better-auth';
import type { tribute } from './index';

export const tributeClient = () => {
  return {
    id: 'tribute-client',
    $InferServerPlugin: {} as ReturnType<typeof tribute>,
  } satisfies BetterAuthClientPlugin;
};
