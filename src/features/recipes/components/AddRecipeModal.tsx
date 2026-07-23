import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nutritionService } from '@services/nutrition.service';
import { mealPlansService } from '@services/meal-plans.service';
import type { MealPlanDay, PlannedMeal } from 'types/meal-plan';
import type { MealType } from 'types/nutrition';
import type { Recipe } from 'types/recipe';

interface AddRecipeModalProps {
  recipe: Recipe;
  mode: 'log' | 'plan';
  servings: number;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

const MEAL_TYPES: { value: MealType; label: string; icon: string }[] = [
  { value: 'breakfast', label: 'Breakfast', icon: 'wb_sunny' },
  { value: 'lunch', label: 'Lunch', icon: 'light_mode' },
  { value: 'dinner', label: 'Dinner', icon: 'bedtime' },
  { value: 'snack', label: 'Snack', icon: 'cookie' },
];

function getDayName(date: string): string {
  return new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
}

function withUpdatedTotals(day: MealPlanDay): MealPlanDay {
  return {
    ...day,
    totalCalories: day.meals.reduce((sum, meal) => sum + meal.calories, 0),
    totalProtein: day.meals.reduce((sum, meal) => sum + meal.proteinGrams, 0),
    totalCarbs: day.totalCarbs ?? 0,
    totalFats: day.totalFats ?? 0,
  };
}
function getWeekDays(): { label: string; value: string; isToday: boolean }[] {
  const days = [];
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - day + (day === 0 ? -6 : 1));

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const value = d.toISOString().split('T')[0];
    const isToday = value === now.toISOString().split('T')[0];
    days.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      value,
      isToday,
    });
  }
  return days;
}

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  now.setDate(diff);
  return now.toISOString().split('T')[0];
}

export function AddRecipeModal({ recipe, mode, servings, onClose, onSuccess, onError }: AddRecipeModalProps) {
  const navigate = useNavigate();
  const weekDays = getWeekDays();
  const today = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (mode === 'log') {
        await nutritionService.addMeal(
          selectedMealType,
          0,
          servings,
          selectedDate,
          recipe.id
        );
        onSuccess(`"${recipe.title}" added to your ${selectedMealType} on ${new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}!`);
        onClose();
        if (selectedDate === today) navigate('/log');
      } else {
        // Add to meal plan
        const weekStart = getWeekStart();
        const existingPlan = await mealPlansService.getMealPlan(weekStart);
        const days = existingPlan?.days ?? [];

        // Find or create the day entry
        const dayIdx = days.findIndex((d) => d.date === selectedDate);
        const newMealEntry: PlannedMeal = {
          id: Date.now(),
          mealType: selectedMealType,
          recipe: {
            id: recipe.id,
            title: recipe.title,
            imageUrl: recipe.imageUrl,
            prepTime: recipe.prepTime,
            calories: recipe.caloriesPerServing,
            tags: recipe.tags,
          },
          calories: Math.round(recipe.caloriesPerServing * servings),
          proteinGrams: Math.round(recipe.proteinGrams * servings),
        };

        if (dayIdx >= 0) {
          days[dayIdx] = withUpdatedTotals({
            ...days[dayIdx],
            meals: [...(days[dayIdx].meals || []), newMealEntry],
          });
        } else {
          days.push(withUpdatedTotals({
            date: selectedDate,
            dayName: getDayName(selectedDate),
            meals: [newMealEntry],
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFats: 0,
          }));
        }

        await mealPlansService.saveMealPlan(weekStart, days);
        onSuccess(`"${recipe.title}" added to ${selectedMealType} on ${new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}!`);
        onClose();
        navigate('/planner');
      }
    } catch {
      onError('Something went wrong. Please try again.');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-outline-variant flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-on-surface">
              {mode === 'log' ? 'Add to Daily Log' : 'Add to Meal Plan'}
            </h3>
            <p className="text-xs text-on-surface-variant truncate max-w-[200px]">{recipe.title}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Day selector */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
              {mode === 'log' ? 'Date' : 'Day of the Week'}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {weekDays.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDate(d.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-all border ${
                    selectedDate === d.value
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container border-outline-variant text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {d.isToday ? '📅 Today' : d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Meal type selector */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Meal Type</p>
            <div className="grid grid-cols-2 gap-1.5">
              {MEAL_TYPES.map((mt) => (
                <button
                  key={mt.value}
                  onClick={() => setSelectedMealType(mt.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                    selectedMealType === mt.value
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container border-outline-variant text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{mt.icon}</span>
                  {mt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-surface-container rounded-xl px-4 py-3 flex items-center justify-between text-sm">
            <span className="text-on-surface-variant">
              {servings} serving{servings !== 1 ? 's' : ''} · {Math.round(recipe.caloriesPerServing * servings)} kcal
            </span>
            <span className="text-primary font-semibold">{recipe.proteinGrams * servings}g protein</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface text-sm font-semibold hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3 rounded-xl bg-primary text-on-primary text-sm font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[16px]">refresh</span>
                Adding...
              </>
            ) : (
              mode === 'log' ? 'Add to Log' : 'Add to Plan'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

