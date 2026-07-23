import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeeklyCalendar } from '../components/WeeklyCalendar';
import { RecipeLibrary } from '../components/RecipeLibrary';
import { ShoppingListModal } from '../components/ShoppingListModal';
import { mealPlansService } from '@services/meal-plans.service';
import { nutritionService } from '@services/nutrition.service';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import type { MealPlanDay, ShoppingList } from 'types/meal-plan';

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  now.setDate(diff);
  return now.toISOString().split('T')[0];
}

function formatWeekRange(weekStart: string): string {
  const start = new Date(weekStart);
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`;
}

export function MealPlannerPage() {
  const navigate = useNavigate();
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const [planId, setPlanId] = useState<number | null>(null);
  const [days, setDays] = useState<MealPlanDay[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const weekStart = getWeekStart();

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    try {
      const plan = await mealPlansService.getMealPlan(weekStart);
      if (plan && plan.days) {
        setDays(plan.days);
        setPlanId(plan.id);
        if (plan.shoppingList) setShoppingList(plan.shoppingList);
      } else {
        setDays([]);
      }
    } catch {
      setDays([]);
    } finally {
      setLoading(false);
    }
  }, [weekStart]);

  useEffect(() => { fetchPlan(); }, [fetchPlan]);

  useEffect(() => {
    if (shoppingListOpen && planId && !shoppingList) {
      mealPlansService.getShoppingList(planId).then(setShoppingList).catch(() => {});
    }
  }, [shoppingListOpen, planId, shoppingList]);

  const handleDeleteMeal = async (mealId: number, date: string) => {
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
      fetchPlan();
    }
  };

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
            </div>
            <div>
              <h2 className="text-headline-lg font-bold text-on-surface">Weekly Planner</h2>
              <p className="text-body-md text-on-surface-variant">{formatWeekRange(weekStart)}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button onClick={() => setShoppingListOpen(true)}
            className="flex-1 sm:flex-none py-2.5 px-5 bg-surface-container-lowest text-on-surface text-label-sm font-semibold rounded-xl border border-outline-variant shadow-sm hover:bg-surface-container-low transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">shopping_cart</span>
            Shopping List
          </button>
          <button className="flex-1 sm:flex-none py-2.5 px-5 bg-primary text-on-primary text-label-sm font-semibold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
            Auto-Generate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          {loading ? (
            <LoadingSpinner size="lg" text="Loading meal plan..." />
          ) : (
            <WeeklyCalendar days={days} weekStart={weekStart} onAddMeal={(date) => navigate(`/log?date=${date}`)} onDeleteMeal={handleDeleteMeal} />
          )}
        </div>
        <div className="col-span-12 lg:col-span-4">
          <RecipeLibrary />
        </div>
      </div>

      <ShoppingListModal isOpen={shoppingListOpen} onClose={() => setShoppingListOpen(false)} shoppingList={shoppingList} weekStart={weekStart} />
    </div>
  );
}
