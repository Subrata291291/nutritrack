import { apiClient } from '@api/client';
import { endpoints } from '@api/endpoints';
import type { WeightAnalytics, MacroConsistency, Milestone, Insight, WeightEntry } from 'types/insights';

class InsightsService {
  async getWeightAnalytics(): Promise<WeightAnalytics> {
    const response = await apiClient.get(endpoints.insights.weight);
    return response.data?.data ?? response.data;
  }

  async addWeightEntry(weightKg: number, date: string): Promise<WeightEntry> {
    const response = await apiClient.post(endpoints.insights.weight, { weightKg, date });
    return response.data?.data ?? response.data;
  }

  async getMacroConsistency(days?: number): Promise<MacroConsistency[]> {
    const response = await apiClient.get(endpoints.insights.macros, { params: { days } });
    return response.data?.data ?? response.data;
  }

  async getMilestones(): Promise<Milestone[]> {
    const response = await apiClient.get(endpoints.insights.milestones);
    return response.data?.data ?? response.data;
  }

  async getSmartInsights(): Promise<Insight[]> {
    const response = await apiClient.get(endpoints.insights.smartInsights);
    return response.data?.data ?? response.data;
  }
}

export const insightsService = new InsightsService();
