import { apiClient } from '@api/client';
import { endpoints } from '@api/endpoints';
import type { OnboardingMetrics, OnboardingData, TDEEInfo } from 'types/onboarding';

class OnboardingService {
  async saveMetrics(metrics: OnboardingMetrics) {
    const response = await apiClient.post(endpoints.onboarding.saveMetrics, metrics);
    return response.data;
  }

  async calculateTDEE(data: OnboardingData): Promise<{ data: TDEEInfo }> {
    const response = await apiClient.post(endpoints.onboarding.getTDEE, data);
    return response.data;
  }

  async complete(data: Record<string, unknown>) {
    const response = await apiClient.post(endpoints.onboarding.complete, data);
    return response.data;
  }
}

export const onboardingService = new OnboardingService();
