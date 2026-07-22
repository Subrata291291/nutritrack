import { apiClient } from '@api/client';
import { endpoints } from '@api/endpoints';
import type { MealPlanDay, ShoppingList } from 'types/meal-plan';

class MealPlansService {
  async getMealPlan(weekStart: string): Promise<{ id: number; weekStart: string; days: MealPlanDay[]; shoppingList?: ShoppingList } | null> {
    const response = await apiClient.get(endpoints.mealPlans.plan(weekStart));
    return response.data?.data ?? response.data;
  }

  async saveMealPlan(weekStart: string, days: MealPlanDay[]): Promise<{ id: number }> {
    const response = await apiClient.post(endpoints.mealPlans.plan(weekStart), { days });
    return response.data?.data ?? response.data;
  }

  async getShoppingList(planId: number): Promise<ShoppingList> {
    const response = await apiClient.get(endpoints.mealPlans.shoppingList(planId));
    return response.data?.data ?? response.data;
  }
}

export const mealPlansService = new MealPlansService();
