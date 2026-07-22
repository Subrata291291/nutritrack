import { apiClient } from '@api/client';
import { endpoints } from '@api/endpoints';
import type { PricingPlan, BillingPeriod } from 'types/pricing';

interface CheckoutResponse {
  url: string;
  sessionId: string;
}

class SubscriptionsService {
  async getPlans(): Promise<PricingPlan[]> {
    const response = await apiClient.get(endpoints.subscriptions.plans);
    return response.data?.data ?? response.data;
  }

  async createCheckout(planId: string, billingPeriod: BillingPeriod): Promise<CheckoutResponse> {
    const response = await apiClient.post(endpoints.subscriptions.createCheckout, { planId, billingPeriod });
    return response.data?.data ?? response.data;
  }

  async manageSubscription(): Promise<{ url: string }> {
    const response = await apiClient.post(endpoints.subscriptions.manage);
    return response.data?.data ?? response.data;
  }
}

export const subscriptionsService = new SubscriptionsService();
