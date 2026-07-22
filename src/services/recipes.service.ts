import { apiClient } from '@api/client';
import { endpoints } from '@api/endpoints';
import type { Recipe } from 'types/recipe';

class RecipesService {
  async getRecipes(params?: { page?: number; per_page?: number; category?: string }): Promise<Recipe[]> {
    const response = await apiClient.get(endpoints.recipes.list, { params });
    return response.data?.data ?? response.data;
  }

  async getRecipeDetail(id: number): Promise<Recipe> {
    const response = await apiClient.get(endpoints.recipes.detail(id));
    return response.data?.data ?? response.data;
  }

  async getCategories(): Promise<{ id: number; name: string; slug: string; count: number }[]> {
    const response = await apiClient.get(endpoints.recipes.categories);
    return response.data?.data ?? response.data;
  }
}

export const recipesService = new RecipesService();
