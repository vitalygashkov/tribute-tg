import { Channel } from './channel';
import { ChannelSubscription } from './subscription';
import { Transaction } from './transaction';

export type ChannelResponse = {
  channel: Channel;
  hasCompletedOnboarding: boolean;
  isWhitelist: boolean;
  subscriptions: ChannelSubscription[];
  subscriptionsNextFrom: string;
  transactions: Transaction[];
  transactionsNextFrom: string;
  verificationStatus: 'approved' | string;
};
