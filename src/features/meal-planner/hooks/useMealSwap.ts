import { useState, useCallback } from 'react';
import { apiClient } from '@api/client';
import { endpoints } from '@api/endpoints';
import { mealPlansService } from '@services/meal-plans.service';
import { useProfile } from '@hooks/useProfile';
import type { AISwapResponse, SwapAlternative } from 'types/ai-meal-plan';
import type { MealPlanDay } from 'types/meal-plan';

interface MealSwapState {
  loading: boolean;
  error: string | null;
  alternatives: SwapAlternative[];
  warnings: string[];
}

export function useMealSwap() {
  const { nutritionTargets, ensureProfile } = useProfile();
  const [state, setState] = useState<MealSwapState>({
    loading: false,
    error: null,
    alternatives: [],
    warnings: [],
  });

  const suggestSwap = useCallback(async (
    mealId: number,
    mealType: string,
    currentDayTotals: { calories: number; proteinGrams: number; carbsGrams: number; fatsGrams: number },
  ) => {
    setState({ loading: true, error: null, alternatives: [], warnings: [] });
    try {
      await ensureProfile();
      const response = await apiClient.post<AISwapResponse>(
        endpoints.ai.suggestSwap,
        { mealId, mealType, currentDayTotals, nutritionTargets },
      );
      const data = response.data;
      if (!data.success || !data.data) {
        throw new Error('AI service returned an unsuccessful response.');
      }
      setState({
        loading: false,
        error: null,
        alternatives: data.data.alternatives,
        warnings: data.data.warnings ?? [],
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to get swap suggestions.';
      setState({ loading: false, error: message, alternatives: [], warnings: [] });
    }
  }, [nutritionTargets, ensureProfile]);

  const applySwap = useCallback(async (
    alternative: SwapAlternative,
    mealId: number,
    dayDate: string,
    days: MealPlanDay[],
    weekStart: string,
  ): Promise<boolean> => {
    try {
      const updatedDays = days.map((day) => {
        if (day.date !== dayDate) return day;
        const meals = day.meals.map((meal) => {
          if (meal.id !== mealId) return meal;
          return {
            ...meal,
            recipe: {
              id: alternative.recipeId,
              title: alternative.recipeName,
              imageUrl: alternative.imageUrl ?? '',
              prepTime: 0,
              calories: alternative.calories,
              tags: [],
            },
            calories: alternative.calories,
            proteinGrams: alternative.proteinGrams,
          };
        });
        return {
          ...day,
          meals,
          totalCalories: meals.reduce((s, m) => s + m.calories, 0),
          totalProtein: meals.reduce((s, m) => s + m.proteinGrams, 0),
        };
      });
      await mealPlansService.saveMealPlan(weekStart, updatedDays);
      return true;
    } catch {
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, alternatives: [], warnings: [] });
  }, []);

  return {
    ...state,
    suggestSwap,
    applySwap,
    reset,
  };
}