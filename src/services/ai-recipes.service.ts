import { apiClient } from '@api/client';
import { endpoints } from '@api/endpoints';

export interface GenerationJob {
  id: number;
  userId: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalRecipes: number;
  generatedRecipes: number;
  failedRecipes: number;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

class AiRecipesService {
  async triggerGeneration(): Promise<{ jobId: number }> {
    const response = await apiClient.post<{ job_id: number }>(endpoints.ai.generateRecipes);
    return { jobId: response.data?.job_id ?? 0 };
  }

  async getGenerationStatus(jobId: number): Promise<GenerationJob> {
    const response = await apiClient.get<{ data: GenerationJob }>(endpoints.ai.generationStatus(jobId));
    const raw = response.data?.data ?? response.data;
    return raw;
  }

  async regenerate(): Promise<{ jobId: number }> {
    const response = await apiClient.post<{ job_id: number }>(endpoints.ai.regenerateRecipes);
    return { jobId: response.data?.job_id ?? 0 };
  }
}

export const aiRecipesService = new AiRecipesService();
