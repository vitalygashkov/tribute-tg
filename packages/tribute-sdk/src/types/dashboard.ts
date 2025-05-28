import { Channel } from './channel';
import { Goal } from './goal';

export type Dashboard = {
  acceptCards: boolean;
  acceptWalletPay: boolean;
  availableManagers: boolean;
  availablePhysicalProducts: boolean;
  availableReferralOffers: boolean;
  availableToCreateShowcaseWithoutItems: boolean;
  balances: [
    { amount: number; currency: 'eur' },
    { amount: number; currency: 'rub' },
    { amount: number; currency: 'ton' },
    { amount: number; currency: 'usdt' }
  ];
  channels: Channel[];
  costCalc: boolean;
  donationCount: number;
  energy: number;
  goals: Goal[];
  migrationAvailable: boolean;
  mode: 'creator';
  orders: null;
  products: unknown[];
  termsAccepted: boolean;
  transactions: unknown[];
  transactionsNextFrom: string;
  verificationStatus: 'approved' | string;
  withdrawalAccount: {
    id: number;
    createdAt: number;
    country: string;
    countryIso2: string;
    methodType: 'bank_card';
    currency: string;
    taxReference: string;
    objectId: number;
    userId: number;
    isFiatToCrypto: boolean;
    params: {};
  };
};
