import { apiClient } from '@api/client';
import { endpoints } from '@api/endpoints';
import type { DailyLog, FoodItem, MealEntry, MealType } from 'types/nutrition';

class NutritionService {
  async getDailyLog(date: string): Promise<DailyLog> {
    const response = await apiClient.get(endpoints.nutrition.dailyLog(date));
    return response.data?.data ?? response.data;
  }

  async addMeal(mealType: MealType, foodItemId: number, servings: number, date: string, recipeId?: number): Promise<MealEntry> {
    const response = await apiClient.post(endpoints.nutrition.log, {
      mealType,
      foodItemId,
      recipeId,
      servings,
      date,
    });
    return response.data?.data ?? response.data;
  }

  async deleteMealEntry(entryId: number): Promise<void> {
    await apiClient.delete(endpoints.nutrition.logDetail(entryId));
  }

  async searchFoods(query: string): Promise<FoodItem[]> {
    const response = await apiClient.get(endpoints.nutrition.searchFoods, {
      params: { q: query },
    });
    return response.data?.data ?? response.data;
  }

  async getRecentFoods(): Promise<FoodItem[]> {
    const response = await apiClient.get(endpoints.nutrition.recentFoods);
    return response.data?.data ?? response.data;
  }

  async updateWater(date: string, waterMl: number): Promise<void> {
    await apiClient.post(endpoints.nutrition.water, {
      date,
      waterMl,
    });
  }
}

export const nutritionService = new NutritionService();
