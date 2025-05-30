import { User } from './user';
import { Member } from './member';
import { Channel } from './channel';
import { Currency } from './currency';
import { SubscriptionPeriod, SubscriptionPeriodPayload } from './subscription-period';

export interface SubscriptionPayload {
  channelId: number;
  currency: Currency;
  acceptCards: boolean;
  acceptWalletPay: boolean;
  name: string;
  description: string;
  buttonText: string;
  imageId: number;
  periods: SubscriptionPeriodPayload[];
  trialPeriod: string;
}

export interface ChannelSubscription {
  acceptCards: boolean;
  acceptWalletPay: boolean;
  activeSubscribers: number;
  appInviteLink: string;
  buttonText: string;
  channelId: number;
  commentAccessEnabled: boolean;
  createdAt: number;
  currency: Currency;
  deletedPeriods: null;
  description: string;
  id: number;
  image: null;
  isDeleted: boolean;
  isDonate: boolean;
  migrated: boolean;
  name: string;
  periods: SubscriptionPeriod[];
  userId: number;
  trialPeriod: string;
  privateChannelInviteLink: string;
  publicChannelInviteLink: string;
}

export interface Subscription extends ChannelSubscription {
  webLink: string;
}

export interface SubscriptionResponse {
  channel: Channel;
  isWhitelist: boolean;
  membersGrouped: {
    active: { members: Member[]; total: number };
    all: { members: Member[]; total: number };
    expired: { members: Member[]; total: number };
    expiring: { members: Member[]; total: number };
  };
  membersGroupedNextFrom: {};
  membersNextFrom: string;
  subscription: Subscription;
  users: User[];
  verificationStatus: 'approved' | string;
}
