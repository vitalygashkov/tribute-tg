import { Currency } from './currency';
import { Period } from './subscription-period';

export interface WebhookSubscriptionPayload {
  subscription_name: string;
  subscription_id: number;
  period_id: number;
  period: Period;
  price: number;
  amount: number;
  currency: Currency;
  user_id: number;
  telegram_user_id: number;
  web_app_link: string;
  channel_id: number;
  channel_name: string;
  expires_at: string;
  type: 'regular' | 'gift' | 'trial';
}

export interface WebhookEvent {
  name: string;
  created_at: string;
  sent_at: string;
  payload: WebhookSubscriptionPayload;
}
