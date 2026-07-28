import { useState, useEffect, useCallback } from 'react';
import { mealPlansService } from '@services/meal-plans.service';
import { nutritionService } from '@services/nutrition.service';
import { toLocalDateString } from '@utils/format';
import type { MealPlanDay, PlannedMeal } from 'types/meal-plan';

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  now.setDate(diff);
  return toLocalDateString(now);
}

const mealTypeCycle: PlannedMeal['mealType'][] = ['breakfast', 'lunch', 'dinner', 'snack'];

export function useMealPlanner() {
  const [weekStart] = useState(getWeekStart);
  const [days, setDays] = useState<MealPlanDay[]>([]);
  const [planId, setPlanId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedDay, setSelectedDay] = useState(() => toLocalDateString(new Date()));
  const [fetchCount, setFetchCount] = useState(0);

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const plan = await mealPlansService.getMealPlan(weekStart);
      if (plan && plan.days) {
        setDays(plan.days);
        setPlanId(plan.id);
      } else {
        setDays([]);
      }
    } catch {
      setDays([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [weekStart]);

useEffect(() => { fetchPlan(); }, [fetchPlan, fetchCount]);

  const refresh = useCallback(() => setFetchCount((c) => c + 1), []);
  const retry = useCallback(() => setFetchCount((c) => c + 1), []);

  const deleteMeal = useCallback(async (mealId: number, date: string) => {
    const updatedDays = days.map((day) => {
      if (day.date !== date) return day;
      const meal = day.meals.find((m) => m.id === mealId);
      if (!meal) return day;
      if (meal.recipe?.id === 0) {
        nutritionService.deleteMealEntry(mealId).catch(() => {});
      }
      const remaining = day.meals.filter((m) => m.id !== mealId);
      return {
        ...day,
        meals: remaining,
        totalCalories: remaining.reduce((s, m) => s + m.calories, 0),
        totalProtein: remaining.reduce((s, m) => s + m.proteinGrams, 0),
      };
    });
    setDays(updatedDays);
    try {
      await mealPlansService.saveMealPlan(weekStart, updatedDays);
    } catch {
      refresh();
    }
  }, [days, weekStart, refresh]);

  const updateMealType = useCallback(async (mealId: number, date: string) => {
    const updatedDays = days.map((day) => {
      if (day.date !== date) return day;
      const meals = day.meals.map((meal) => {
        if (meal.id !== mealId) return meal;
        const currentIndex = mealTypeCycle.indexOf(meal.mealType);
        const nextType = mealTypeCycle[(currentIndex + 1) % mealTypeCycle.length];
        return { ...meal, mealType: nextType };
      });
      return {
        ...day,
        meals,
        totalCalories: meals.reduce((s, m) => s + m.calories, 0),
        totalProtein: meals.reduce((s, m) => s + m.proteinGrams, 0),
      };
    });
    setDays(updatedDays);
    try {
      await mealPlansService.saveMealPlan(weekStart, updatedDays);
    } catch {
      refresh();
    }
  }, [days, weekStart, refresh]);

  return {
    mealPlan: { days, weekStart, planId },
    loading,
    error,
    selectedDay,
    setSelectedDay,
    refresh,
    retry,
    deleteMeal,
    updateMealType,
  };
}