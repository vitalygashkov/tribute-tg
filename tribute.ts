import type { ChannelResponse } from './types/channel-response';
import type { Dashboard } from './types/dashboard';
import type { SubscriptionResponse } from './types/subscription-response';

export class Tribute {
  private baseUrl = 'https://tribute.tg/api';
  private version = 'v4';

  constructor(private token: string) {}

  private async request(route: string, body?: any) {
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
}
