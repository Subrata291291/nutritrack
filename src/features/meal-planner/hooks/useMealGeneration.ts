import { useState, useCallback } from 'react';
import { apiClient } from '@api/client';
import { endpoints } from '@api/endpoints';
import { mealPlansService } from '@services/meal-plans.service';
import type { AIGenerateResponse, AIGeneratedPlan, AIDayPlan } from 'types/ai-meal-plan';
import type { MealPlanDay, PlannedMeal } from 'types/meal-plan';

interface MealGenerationState {
  loading: boolean;
  error: string | null;
  plan: AIGeneratedPlan | null;
  warnings: string[];
  saving: boolean;
  saveError: string | null;
  saveSuccess: boolean;
  failedDates: string[];
}

function transformAIToMealPlanDay(aiDay: AIDayPlan, startId: number): MealPlanDay {
  const meals: PlannedMeal[] = aiDay.meals.map((meal, idx) => ({
    id: startId + idx,
    mealType: meal.mealType,
    recipe: {
      id: meal.recipeId,
      title: meal.recipeName,
      imageUrl: '',
      prepTime: 0,
      calories: meal.calories,
      tags: [],
    },
    calories: meal.calories,
    proteinGrams: meal.proteinGrams,
  }));

  return {
    date: aiDay.date,
    dayName: aiDay.dayOfWeek,
    meals,
    totalCalories: aiDay.dayTotals.calories,
    totalProtein: aiDay.dayTotals.proteinGrams,
    totalCarbs: aiDay.dayTotals.carbsGrams,
    totalFats: aiDay.dayTotals.fatsGrams,
  };
}

export function useMealGeneration() {
  const [state, setState] = useState<MealGenerationState>({
    loading: false,
    error: null,
    plan: null,
    warnings: [],
    saving: false,
    saveError: null,
    saveSuccess: false,
    failedDates: [],
  });

  const generate = useCallback(async () => {
    setState({
      loading: true, error: null, plan: null, warnings: [],
      saving: false, saveError: null, saveSuccess: false, failedDates: [],
    });
    try {
      const response = await apiClient.post<AIGenerateResponse>(
        endpoints.ai.generatePlan,
      );
      const data = response.data;

      if (!data.success || !data.data) {
        throw new Error('AI service returned an unsuccessful response.');
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        plan: data.data.plan,
        warnings: data.data.warnings ?? [],
      }));
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to generate meal plan. Please try again.';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));
    }
  }, []);

  const retry = useCallback(() => {
    generate();
  }, [generate]);

  const reset = useCallback(() => {
    setState({
      loading: false, error: null, plan: null, warnings: [],
      saving: false, saveError: null, saveSuccess: false, failedDates: [],
    });
  }, []);

  const savePlan = useCallback(async (weekStart: string): Promise<boolean> => {
    if (!state.plan) return false;

    setState((prev) => ({
      ...prev,
      saving: true,
      saveError: null,
      saveSuccess: false,
      failedDates: [],
    }));

    const startId = Date.now();
    const transformedDays: MealPlanDay[] = state.plan.days.map((day, i) =>
      transformAIToMealPlanDay(day, startId + i * 10),
    );

    try {
      await mealPlansService.saveMealPlan(weekStart, transformedDays);
      setState((prev) => ({
        ...prev,
        saving: false,
        saveSuccess: true,
        saveError: null,
        failedDates: [],
      }));
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to save meal plan. Please try again.';
      const failed = transformedDays.map((d) => d.date);
      setState((prev) => ({
        ...prev,
        saving: false,
        saveError: message,
        failedDates: failed,
      }));
      return false;
    }
  }, [state.plan]);

  return {
    ...state,
    generate,
    retry,
    reset,
    savePlan,
  };
}