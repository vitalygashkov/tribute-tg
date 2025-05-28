import type { ChannelResponse } from './types/channel-response';
import type { Dashboard } from './types/dashboard';
import type { SubscriptionResponse } from './types/subscription-response';
import type { SubscriptionMemberResponse } from './types/subscription-member-response';

export class Tribute {
  private baseUrl = 'https://tribute.tg/api';
  private version = 'v4';
  private token = '';

  constructor({ token }: { token: string }) {
    this.token = token;
  }

  private async request<T>(route: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${this.version}${route}`, {
      headers: { Authorization: `TgAuth ${this.token}` },
      method: body ? 'POST' : 'GET',
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

  getSubscription(id: number): Promise<SubscriptionResponse> {
    return this.request(`/subscription/${id}`);
  }

  getSubscriptionMember(id: number): Promise<SubscriptionMemberResponse> {
    return this.request(`/subscription_member/${id}`);
  }
}
