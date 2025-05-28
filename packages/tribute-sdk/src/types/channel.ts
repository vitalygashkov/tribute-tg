import { ChannelSubscription } from './subscription';

export type CommenAccessSubscription = ChannelSubscription & {
  periods: null;
  privateChannelInviteLink: string;
  publicChannelInviteLink: string;
  userId: number;
  webLink: string;
};

export type Channel = {
  activeSubscribers: number;
  chatId: number;
  commentSubscriptionId: number;
  commentsAccessSubscription: CommenAccessSubscription;
  connected: boolean;
  createdAt: number;
  id: number;
  isDeleted: boolean;
  isDonationRequested: boolean;
  isGroup: boolean;
  isOnboardingPassed: boolean;
  language: {
    code: string;
    englishName: string;
    name: string;
  };
  migrated: boolean;
  name: string;
  onboardingStep: string;
  photoUrl: string;
  type: 'private' | 'public';
  userId: number;
};
