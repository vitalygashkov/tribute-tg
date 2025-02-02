export type ChannelSubscription = {
  acceptCards: boolean;
  acceptWalletPay: boolean;
  activeSubscribers: number;
  appInviteLink: string;
  buttonText: string;
  channelId: number;
  commentAccessEnabled: boolean;
  createdAt: number;
  currency: 'rub' | 'eur';
  deletedPeriods: null;
  description: string;
  id: number;
  image: null;
  isDeleted: boolean;
  isDonate: boolean;
  migrated: boolean;
  name: string;
};

export type Subscription = ChannelSubscription & {
  webLink: string;
};
