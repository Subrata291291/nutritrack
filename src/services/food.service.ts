import { apiClient } from '@api/client';
import { endpoints } from '@api/endpoints';
import type { FoodItem } from 'types/nutrition';

class FoodService {
  async getFoods(): Promise<FoodItem[]> {
    const response = await apiClient.get<{ data: FoodItem[] }>(endpoints.foods.list);
    return response.data?.data ?? [];
  }

  async getFoodDetail(id: number): Promise<FoodItem | null> {
    const response = await apiClient.get<{ data: FoodItem }>(endpoints.foods.detail(id));
    return response.data?.data ?? null;
  }
}

export const foodService = new FoodService();
