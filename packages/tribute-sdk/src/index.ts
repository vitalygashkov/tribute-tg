import type { ChannelResponse } from './types/channel-response';
import type { Dashboard } from './types/dashboard';
import type { Subscription, SubscriptionPayload, SubscriptionResponse } from './types/subscription';
import type { SubscriptionMemberResponse } from './types/subscription-member-response';
import type { SubscriptionPeriod, SubscriptionPeriodPayload } from './types/subscription-period';

export class Tribute {
  private baseUrl = 'https://tribute.tg/api';
  private version = 'v4';
  private token = '';

  constructor({ token }: { token: string }) {
    this.token = token;
  }

  private async request<T>(route: string, body?: any, method?: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${this.version}${route}`, {
      headers: { Authorization: `TgAuth ${this.token}` },
      method: method ?? (body ? 'POST' : 'GET'),
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.json();
  }

  getDashboard(): Promise<Dashboard> {
    return this.request(`/dashboard`);
  }

  getChannel(id: number): Promise<ChannelResponse> {
    return this.request(`/channel/${id}`);
  }

  createSubscription(payload: SubscriptionPayload): Promise<Subscription> {
    return this.request(`/subscription`, payload);
  }

  getSubscription(id: number): Promise<SubscriptionResponse> {
    return this.request(`/subscription/${id}`);
  }

  updateSubscription(payload: Pick<SubscriptionPayload, 'name' | 'description' | 'buttonText'>): Promise<Subscription> {
    return this.request(`/subscription`, payload, 'PATCH');
  }

  createSubscriptionPeriod(subscriptionId: number, payload: SubscriptionPeriodPayload): Promise<SubscriptionPeriod> {
    return this.request(`/subscription/${subscriptionId}/periods`, payload);
  }

  updateSubscriptionPeriod(
    subscriptionId: number,
    periodId: number,
    payload: SubscriptionPeriodPayload
  ): Promise<SubscriptionPeriod> {
    return this.request(`/subscription/${subscriptionId}/periods/${periodId}`, payload, 'PATCH');
  }

  getSubscriptionMember(id: number): Promise<SubscriptionMemberResponse> {
    return this.request(`/subscription_member/${id}`);
  }
}

export * from './types';
