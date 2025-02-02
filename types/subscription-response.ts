import { Channel } from './channel';
import { Member } from './member';
import { Subscription } from './subscription';
import { User } from './user';

export type SubscriptionResponse = {
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
};
