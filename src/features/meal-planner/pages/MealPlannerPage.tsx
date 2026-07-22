import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeeklyCalendar } from '../components/WeeklyCalendar';
import { RecipeLibrary } from '../components/RecipeLibrary';
import { ShoppingListModal } from '../components/ShoppingListModal';
import { mealPlansService } from '@services/meal-plans.service';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import type { MealPlanDay, ShoppingList } from 'types/meal-plan';

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  now.setDate(diff);
  return now.toISOString().split('T')[0];
}

export function MealPlannerPage() {
  const navigate = useNavigate();
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const [planId, setPlanId] = useState<number | null>(null);
  const [days, setDays] = useState<MealPlanDay[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const weekStart = getWeekStart();

  useEffect(() => {
    const fetchPlan = async () => {
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
    };
    fetchPlan();
  }, [weekStart]);

  useEffect(() => {
    if (shoppingListOpen && planId && !shoppingList) {
      mealPlansService.getShoppingList(planId).then(setShoppingList).catch(() => {});
    }
  }, [shoppingListOpen, planId, shoppingList]);

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-headline-lg text-on-surface font-bold mb-1">Weekly Planner</h2>
          <p className="text-base text-on-surface-variant">Manage your nutrition for the week</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShoppingListOpen(true)}
            className="py-3 px-5 bg-surface-container-lowest text-on-surface text-sm font-semibold rounded-xl border border-outline-variant shadow-[0px_4px_6px_rgba(0,0,0,0.05)] hover:bg-surface-container-low transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">shopping_cart</span>
            Shopping List
          </button>
          <button className="py-3 px-5 bg-primary text-on-primary text-sm font-semibold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
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
            <WeeklyCalendar days={days} weekStart={weekStart} onAddMeal={(date) => navigate(`/log?date=${date}`)} />
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

